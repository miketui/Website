# 14_SANDBOX_VERIFICATION_REPORT — Prompt 7 Sandbox Provider Verification

## Prompt 7 scope

Prompt 7 verified sandbox-provider readiness for Supabase, Stripe test mode, protected private downloads, Resend, MailerLite, Turnstile, analytics, and Vercel Preview readiness without using production credentials, activating live payments, deploying production, creating a live subscription offer, or moving paid deliverables into public assets.

## Date / run context

- Date: 2026-06-10
- Repo path: `/workspace/Last2`
- App path: `author-site/`
- Local branch: current working branch in `miketui/Last2`
- Local release artifacts remain outside public:
  - `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
  - `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`
- Locked Supabase bucket: `curls-deliverables`
- Locked private object paths:
  - `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
  - `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`

## Sandbox credential presence

No real sandbox provider credentials were available through the runtime environment during this run. Real-provider verification was therefore limited to safe static checks, local test suites, dangerous-pattern detection, and skip-safe provider scripts.

Detected missing provider env names:

- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PREORDER`, `STRIPE_PRICE_ID_REGULAR`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Resend: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SUPPORT_EMAIL`
- MailerLite: `MAILERLITE_API_KEY`, `MAILERLITE_GROUP_SUBSCRIBERS`, `MAILERLITE_GROUP_FREE_CHAPTER`, `MAILERLITE_GROUP_PREORDERS`, `MAILERLITE_GROUP_CUSTOMERS`, `MAILERLITE_GROUP_REFUNDED`
- Turnstile: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` or `TURNSTILE_SITE_KEY`, plus `TURNSTILE_SECRET_KEY`
- Analytics: `NEXT_PUBLIC_GA4_MEASUREMENT_ID` or `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST`

## Providers tested live

None. Live remote-provider calls were not performed because sandbox/test credentials were missing. No production/live provider credentials were used.

## Providers skipped

- Supabase remote bucket/object verification: `SKIPPED — credentials missing`
- Stripe test-mode Checkout Session creation: `SKIPPED — credentials missing`
- Resend sandbox transactional sends: `SKIPPED — credentials missing`
- MailerLite sandbox subscriber/group mutation: `SKIPPED — credentials missing`
- Turnstile remote challenge verification: `SKIPPED — credentials missing`
- GA4/PostHog remote ingestion verification: `SKIPPED — credentials missing`

## Exact commands run

```bash
git status --short
find author-site/scripts -maxdepth 2 -type f | sort
find author-site/tests -maxdepth 3 -type f | sort
find author-site/docs/website-v4 -maxdepth 1 -type f | sort
find release -maxdepth 2 -type f | sort
cd author-site && pnpm check:supabase-storage
cd author-site && pnpm check:stripe-test
cd author-site && pnpm install
cd author-site && pnpm lint
cd author-site && pnpm typecheck
cd author-site && pnpm test
cd author-site && pnpm build
cd author-site && pnpm check:sandbox
cd author-site && pnpm check:sandbox-env
cd author-site && pnpm check:deliverables
cd author-site && pnpm check:supabase-storage
cd author-site && pnpm check:stripe-test
grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E 'sk_live_|rk_live_|whsec_live|supabase_service_role=|STRIPE_SECRET_KEY=.+|RESEND_API_KEY=.+|MAILERLITE_API_KEY=.+|SUPABASE_SERVICE_ROLE_KEY=.+' author-site author-site/docs/website-v4 .env.example || true
find author-site/public -type f | grep -Ei '.(epub|pdf)$' && exit 1 || true
test ! -f author-site/.env.local
test ! -f author-site/.env.sandbox
```

## Pass / fail / skipped table

| Area | Result | Evidence / notes |
|---|---:|---|
| Prompt 6 state audit | PASSED | Required `git status` and `find` commands were run. Pre-existing untracked `tools/` and `validation-reports/` remained untouched. |
| Supabase static locked path verification | PASSED | `pnpm check:supabase-storage` verified the locked bucket/object strings and skipped remote checks safely. |
| Supabase remote bucket/object verification | SKIPPED — credentials missing | Missing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`. |
| Private paid deliverables in public | PASSED | `pnpm check:deliverables` and `find author-site/public ...` found no EPUB/PDF in public assets. |
| Stripe live/prod pattern rejection | PASSED | `pnpm check:stripe-test` and secret-pattern scan found no live key patterns. |
| Stripe test checkout session | SKIPPED — credentials missing | Missing Stripe test key, webhook secret, publishable key, and test price IDs. |
| Resend sandbox sends | SKIPPED — credentials missing | Missing Resend API key/from/support env vars; no email was sent. |
| MailerLite subscriber/group smoke | SKIPPED — credentials missing | Missing API key and sandbox group IDs; no subscriber records were created. |
| Turnstile remote verification | SKIPPED — credentials missing | Missing site/secret keys; local fail-safe behavior remains covered by config and tests. |
| Analytics remote ingestion | SKIPPED — credentials missing | Missing GA4/PostHog sandbox IDs; local event validation, consent behavior, and metadata sanitization remain covered by tests. |
| Lint | PASSED | `pnpm lint` completed successfully. |
| Typecheck | PASSED | `pnpm typecheck` completed successfully. |
| Tests | PASSED | `pnpm test` completed successfully. |
| Build | PASSED | `pnpm build` completed successfully. |
| Combined sandbox checks | PASSED | `pnpm check:sandbox` passed with provider skips where credentials were missing. |
| No committed local env files | PASSED | `test ! -f author-site/.env.local` and `test ! -f author-site/.env.sandbox` passed. |
| No live payment activation | PASSED | No live keys were present, no live checkout was created, and production deploy was not run. |

## Blockers and next actions

| Blocker | Status | Next action |
|---|---:|---|
| Supabase sandbox credentials unavailable | SKIPPED — credentials missing | Configure a sandbox Supabase project, set the four required env vars in secure local/Vercel Preview env, apply migrations, create private bucket, upload locked objects, then rerun `pnpm check:supabase-storage`. |
| Supabase RLS not remotely verified | BLOCKED — human/provider setup required | Apply `supabase/migrations/0001_author_commerce.sql` in sandbox and verify anon/authenticated/admin/service-role access manually or with provider-backed tests. |
| Stripe test keys and price IDs unavailable | SKIPPED — credentials missing | Create Stripe test products/prices for `$17.99` preorder and `$19.99` regular direct, configure a test webhook endpoint, then rerun `pnpm check:stripe-test` and a safe test Checkout Session smoke. |
| Stripe webhook replay/refund flow not provider-verified | BLOCKED — human/provider setup required | Use Stripe CLI/test dashboard to replay bad signature, checkout completed, checkout expired, and refund events against preview/local. |
| Resend sandbox sender/API key unavailable | SKIPPED — credentials missing | Configure sandbox sender/domain, set test env vars, and send only to `SANDBOX_TEST_EMAIL` after approval. |
| MailerLite sandbox API key/group IDs unavailable | SKIPPED — credentials missing | Create sandbox groups and use a sandbox/test subscriber only; do not touch production audiences or broadcasts. |
| Turnstile keys unavailable | SKIPPED — credentials missing | Configure Turnstile test widget and verify invalid/missing challenges fail safely before preview traffic. |
| GA4/PostHog sandbox IDs unavailable | SKIPPED — credentials missing | Configure sandbox IDs, confirm consent blocks marketing events until granted, and confirm operational events strip sensitive metadata. |
| Vercel Preview env not configured in this runtime | BLOCKED — human/provider setup required | Add sandbox-only env vars to Vercel Preview, keep Production env locked, and run the same checks before any preview handoff. |

## Production lock confirmation

Production remains locked. Prompt 7 did not deploy production, activate live payments, configure live keys, create a live subscription offer, or advertise membership/subscription purchasing. Stripe subscription price env names remain placeholders only for future schema readiness.

## Secret-safety confirmation

- No secret values were printed in command output or written to tracked files.
- The sandbox env check reports variable names and presence only.
- Secret-pattern scanning produced documentation-only matches for the recorded scan command and found no real live Stripe keys or populated secret env assignments in the app/docs paths checked.
- `.env.local` and `.env.sandbox` were not created or committed.

## Public deliverable safety confirmation

- Paid EPUB/PDF release artifacts stayed under `release/` and outside `author-site/public/`.
- No paid EPUB/PDF files were copied into public assets.
- The app continues to point to Supabase private Storage paths only for the locked deliverables.

## Smoke-test script decision

Prompt 7 did not add provider smoke scripts because sandbox credentials and `SANDBOX_TEST_EMAIL` were absent. Creating scripts that mutate providers without confirmed sandbox credentials would be too speculative and could encourage unsafe sends or records. The existing safe checks remain read-only/static and skip cleanly when credentials are missing.

## Recommendation for Prompt 8

Prompt 8 should remain a sandbox/preview hardening pass, not production launch: configure sandbox credentials only in secure local/Vercel Preview env, run provider-backed Supabase RLS/storage checks, Stripe test checkout/webhook/refund replay, Resend/MailerLite sandbox recipient tests, Turnstile invalid-challenge checks, analytics consent verification, then update this report with real provider evidence before any live launch decision.
