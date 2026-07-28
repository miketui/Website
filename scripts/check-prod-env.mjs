#!/usr/bin/env node
/**
 * Production environment guard — runs as `prebuild`, so every `pnpm build`
 * is gated by it.
 *
 * Why this exists (2026-07-27 audit): `content/site.ts` and `lib/env.ts` both
 * fall back to "http://localhost:3000" when NEXT_PUBLIC_SITE_URL is empty.
 * That fallback is correct for local dev and fatal in production — the build
 * SUCCEEDS and silently ships sitemap.xml, robots.txt, every canonical, and
 * every OG url pointing at localhost. Nothing crashes. No test fails.
 *
 * This is the same failure class as the RELEASE_DATE incident (commit
 * 6514c67), except that one crashed loudly and this one does not. The
 * envOrDefault() helper traded a visible crash for a silent wrong answer, so
 * the guard has to live here instead.
 *
 * Deliberately NOT the same thing as scripts/check-sandbox-env.mjs — that
 * script asserts the environment is *not* production. This one asserts a
 * production environment is complete.
 *
 * Enforcement is scoped: hard failure only when we can positively identify a
 * production build (VERCEL_ENV=production, or CHECK_PROD_ENV=true for local
 * verification). Everywhere else it prints a notice and exits 0, so local dev
 * and preview builds are unaffected.
 */

const REQUIRED_IN_PRODUCTION = [
  {
    name: "NEXT_PUBLIC_SITE_URL",
    validate(value) {
      if (!value || !value.trim()) return "is empty or unset — sitemap.xml, robots.txt, and every canonical would resolve to http://localhost:3000";
      if (/localhost|127\.0\.0\.1|0\.0\.0\.0/i.test(value)) return `is "${value}" — a localhost URL must never ship to production`;
      if (!/^https:\/\//i.test(value)) return `is "${value}" — production must be https://`;
      if (/\/$/.test(value)) return `is "${value}" — a trailing slash produces double-slash URLs in sitemap.xml (normalizeSiteUrl strips it, but set it correctly at the source)`;
      return null;
    }
  },
  {
    name: "RELEASE_DATE",
    validate(value) {
      // Blank RELEASE_DATE is the documented cause of the 6514c67 production
      // crash. envOrDefault() now absorbs it; this keeps it visible anyway.
      if (!value || !value.trim()) return "is empty or unset — falls back to the hardcoded default; set it explicitly so the launch date has one source of truth";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) return `is "${value}" — expected YYYY-MM-DD`;
      if (Number.isNaN(new Date(`${value.trim()}T00:00:00Z`).getTime())) return `is "${value}" — not a real date`;
      return null;
    }
  },
  {
    name: "CRON_SECRET",
    validate(value) {
      // The cron routes used to authenticate only when this was set, so an
      // absent secret admitted every caller instead of rejecting them. They
      // now return 503 without it — which means a production deploy missing
      // this variable has non-functioning launch automation. Fail the build
      // rather than discover it on launch morning.
      if (!value || !value.trim()) return "is empty or unset — the launch-day and pre-launch cron routes return 503 without it, so launch automation would not run";
      if (value.trim().length < 16) return "is shorter than 16 characters — use a high-entropy value; this is the only thing standing in front of the launch email routes";
      return null;
    }
  },
  {
    name: "ALLOW_DEMO_SESSION",
    validate(value) {
      // Demo sessions accept unsigned, spoofable cookies that define the
      // current user by email — and admin authorization keys on that email.
      // getSessionUser() now ignores this flag when VERCEL_ENV=production, so
      // this check is defense in depth against the flag reaching production
      // config at all.
      if (value && value.trim() === "1") return 'is "1" — demo sessions accept unsigned spoofable cookies and must never be enabled in production';
      return null;
    }
  }
];

function isProductionBuild(env) {
  return env.VERCEL_ENV === "production" || env.CHECK_PROD_ENV === "true";
}

export function collectProdEnvIssues(env = process.env) {
  const issues = [];
  for (const { name, validate } of REQUIRED_IN_PRODUCTION) {
    const problem = validate(env[name]);
    if (problem) issues.push(`${name} ${problem}`);
  }
  return issues;
}

export function runProdEnvCheck({ env = process.env } = {}) {
  const enforced = isProductionBuild(env);
  const issues = collectProdEnvIssues(env);

  if (!enforced) {
    console.log(
      issues.length
        ? `[check-prod-env] Non-production build — ${issues.length} issue(s) noted, not enforced. Run CHECK_PROD_ENV=true pnpm build to enforce.`
        : "[check-prod-env] Non-production build — production variables look valid."
    );
    return { enforced, issues, ok: true };
  }

  if (issues.length) {
    console.error("[check-prod-env] Production build blocked:\n");
    for (const issue of issues) console.error(`  ✗ ${issue}`);
    console.error("\nSet these in the Vercel project (Settings → Environment Variables → Production) and redeploy.\n");
    return { enforced, issues, ok: false };
  }

  console.log("[check-prod-env] Production environment validated.");
  return { enforced, issues, ok: true };
}

// Only act when executed directly, so the exports stay importable from tests.
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  const result = runProdEnvCheck();
  if (!result.ok) process.exit(1);
}
