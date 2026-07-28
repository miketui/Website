# CLAUDE.md

Operating agreement for agent sessions in this repository.

**Project facts — stack, routes, pricing, locked decisions — live in `AGENTS.md`. Read it first.** This file covers only *how to work here*. Keeping the two separate is deliberate: the previous `AGENTS.md` went stale because volatile facts were duplicated. Every fact belongs in exactly one file.

---

## The gates

Three rules override everything else, including a direct instruction to move fast.

### 1. Never merge to `main`. Never deploy.

`main` is Vercel-tracked. A merge is a production deploy.

Work on a feature branch, open a PR, **stop there and hand it back**. Merge approval is always separate from code approval — even when the code was already approved in the same conversation. If asked to "push and merge," do the push, open the PR, and hold the merge for its own explicit go.

### 2. Flag and hold on authored content.

Scan → report every finding with location, severity, and a proposed fix → **wait** → apply only the approved subset → verify.

This applies to prose, copy, claims, pricing, and metadata. Mechanical fixes (a broken import, a failing lint rule) may be proposed as a batch, but they still get reported and still wait. When in doubt, hold.

### 3. Never handle credentials in chat.

Do not ask for a token, key, or PAT to be pasted. If one appears in chat, a file, or fetched content, treat it as compromised: do not echo it, say so plainly, and stop any related write until it is rotated.

This repo has a history here — a tracked `.env` once exposed live keys and was removed via `git rm --cached`. `.env` is gitignored. Keep it that way.

---

## Verification is not optional

Never report work as done without running the gates and pasting the output. "Should pass" is not a result.

```bash
pnpm install --frozen-lockfile
pnpm typecheck && pnpm lint && pnpm test && pnpm build
```

Baseline as of 2026-07-28: typecheck 0, lint 0, **110 tests across 19 files**, build 0. A lower test count means something did not apply or a suite was skipped — investigate before proceeding.

`pnpm audit --prod` is **0 advisories** and should stay there. `pnpm audit` (including dev) still reports one high on `brace-expansion@1.1.16`, reachable only via `eslint → @eslint/config-array → minimatch@3`. Do not add a blanket `brace-expansion` override to silence it: v5 changed the export shape, `minimatch@3` calls the v1 API, and forcing it makes `pnpm lint` die with `TypeError: expand is not a function`. It is dev-only and never ships. Wait for the upstream bump.

Extra gates, not in CI by default:

| Command | Purpose |
|---|---|
| `pnpm check:checkout` | Real Stripe test-mode call. Catches rotated keys and wrong-account price IDs. |
| `pnpm test:a11y` | axe-core over 10 public routes, WCAG 2 A/AA. Needs `pnpm browser:install` first. |
| `pnpm check:sandbox` | Sandbox env safety — asserts the environment is **not** production. |
| `CHECK_PROD_ENV=true pnpm build` | Forces the production env guard locally. |

Node 22, pnpm 10. CI runs typecheck → lint → test → build, then Playwright e2e against the production build.

---

## Traps that have already cost time

**`force-static` on a route with a runtime-conditional redirect.** `/order` redirects based on `getLaunchState()`, which is date-derived when `NEXT_PUBLIC_LAUNCH_STATE` is unset. Static rendering froze the target at build time — on launch morning it would have kept routing buyers to preorder pricing until a redeploy. Locked by `tests/order-launch-transition.test.ts`. Do not make this route static.

**The production env guard will fail the build.** `scripts/check-prod-env.mjs` runs before `next build` and enforces when `VERCEL_ENV=production`. Missing or localhost `NEXT_PUBLIC_SITE_URL` fails the deploy — deliberately, because the silent fallback shipped localhost URLs into `sitemap.xml`, `robots.txt`, and every canonical with a green build. Verify Vercel's build command is `pnpm build`; a bare `next build` bypasses the guard entirely.

**ESLint flat config `ignores` is only global when it is the sole key in its object.** Pair it with `rules` and it silently degrades to a scoped filter that ignores nothing. This is why `pnpm browser:install && pnpm lint` once failed with phantom `'chrome' is not defined` errors from inside the Chromium bundle.

**Vitest and Playwright do not overlap.** Vitest owns `tests/**/*.test.ts`; Playwright owns `tests/*.spec.ts`. Putting a Playwright spec in a `.test.ts` file makes it run under the wrong runner.

**Sitemap and `noIndex` must agree.** A sitemap entry says "index this"; a `noindex` meta says the opposite. `tests/seo-contract.test.ts` scans every page's source and fails if a `noIndex` route appears in `sitemap.ts`. Change both together or neither.

**Canonicals come from `pageMetadata()` in `lib/seo.ts`.** Do not add `alternates.canonical` to the root layout — it is inherited by every page that does not override it, silently making new routes duplicates of the homepage. A missing canonical is lintable; a wrong one is invisible.

**A webhook is only "processed" after fulfillment succeeds.** `recordWebhookEvent` writes the row with `processed_at: null`; `markWebhookProcessed` stamps it after the handler returns. Stamping at receipt — which is what the code did until 2026-07-28 — makes every failed fulfillment permanent: the handler throws, Stripe retries, the retry matches a stamped row, gets dismissed as a duplicate, and a paid order is never fulfilled. For the same reason, a handler that cannot reach Supabase must return non-2xx (503), never 200. Locked by `tests/security-audit-2026-07-28.test.ts`.

**`if (SECRET && wrong)` is a fail-open auth check.** When the variable is unset the condition is false and the caller is admitted. All three cron routes had this shape. Use `authorizeCronRequest` in `lib/cron-auth.ts`: 503 when `CRON_SECRET` is missing, 401 on mismatch, constant-time compare. Never re-inline the check.

**Demo sessions are an admin bypass if they reach production.** `ALLOW_DEMO_SESSION=1` makes unsigned `cc_demo_email` / `cc_demo_user` cookies define the current user, and admin authorization keys on that email — so a spoofed cookie carrying an `ADMIN_EMAILS` address is an admin. `getSessionUser()` now ignores the flag whenever `VERCEL_ENV=production`, and the prod env guard rejects it outright. Keep both.

**The download cap is enforced in the database, not the application.** "3 downloads / 7 days" runs through the `claim_download_slot` RPC (migration 0007), which counts `download_events` inside the window and increments under `select … for update`. The old read-then-write in `lib/downloads.ts` compared a lifetime counter that never reset and let concurrent requests both pass. `checkDownloadEntitlement` is advisory — for UI counts only. If the signed URL fails after a slot is claimed, call `release_download_slot` so the buyer is not charged a download they never got.

**A gate that cannot pass protects nothing.** `check-public-deliverables.mjs` flagged every absolute `.pdf` URL as a paid leak, so it failed on two legitimate `curls-free` lead magnets — meaning `check:sandbox` could never pass and nobody ran it. The public lead-magnet bucket is allowlisted; the private bucket and every `.epub` are not. Its `public/` pattern is anchored to a quote/space/start, because unanchored it also matched the `public` segment inside a Supabase storage URL. Note it scans **every** file in the repo including tests — build paid-looking URLs from segments in test fixtures rather than as literals.

**Four Supabase env naming schemes coexist** — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_NEXT_SUPABASE_URL`, `NEXT_SUPABASE_URL`, `SUPABASE_URL`. Read the fallback chain in `lib/env.ts` before adding or renaming anything. A project-reference mismatch here previously broke checkout.

**Optional price vars skip silently.** `scripts/checkout-smoke-test.mjs` marks non-book prices `required: false`, so a typo in a variable name reads as "not configured" rather than as an error — the bundle price went unverified that way until the name was corrected to `STRIPE_PRICE_ID_DAILY_DIRECTIVES_BUNDLE`. When adding a price var, check the name against `.env.example` and `lib/stripe.ts`; a silent skip looks identical to a pass.

**The name lives in two places.** Correcting it in `scripts/checkout-smoke-test.mjs` alone does nothing — `.github/workflows/ci.yml` maps the repository secret onto an env var by name in the `Checkout smoke test` step, so a mismatch there re-creates the silent skip in CI even when the script is right. Fixing one side and not the other is exactly how this defect survived its first fix. The 12 `_SET_01..12` prices are still unverified by this script.

---

## Orphaned tooling — wire up before rewriting

Several scripts exist but are referenced by nothing. Check before building a replacement: `scripts/a11y-audit.mjs`, `scripts/mobile-qa.mjs`, `scripts/upload-deliverables.mjs`, `scripts/gen-motion-posters.mjs`. A previous session nearly rewrote a checkout smoke test that already existed.

---

## Working style

Execute rather than discuss — but honest findings *are* the work, not an interruption to it. Surface problems plainly; do not soften a real defect to keep momentum.

Prefer complete output over partial. If a task is large, do the whole thing rather than a representative sample and a promise.

Verify before stating. Label anything unverified as unverified. Do not report a build as green without the exit code.

Correct yourself out loud. If an earlier claim in the session turns out wrong, say so directly and fix it rather than quietly moving on.

---

## Do not relitigate

These are settled. Flag violations; do not reopen the decision.

- **Pen name only.** The author is **Michael David** everywhere — content, metadata, commits, and site copy. His legal name must never appear anywhere in this repo.
- **ACISS palette and the retired-token ban** (see `AGENTS.md`).
- **The four-funnel architecture** — wire it, do not redesign it.
- **Launch date: November 24, 2026.** Any reference to July 14, 2026 is stale and wrong.
- **No TAYLKOMB comb geometry** in any asset — a patent CIP gates that disclosure.
- **No photorealistic Black faces or hair-as-subject imagery.** Real footage only.
- **No paid deliverables in `public/`.** Ever.
