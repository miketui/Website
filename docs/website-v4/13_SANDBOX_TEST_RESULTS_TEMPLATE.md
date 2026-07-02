# 13_SANDBOX_TEST_RESULTS_TEMPLATE — Prompt 6 Verification Worksheet

Fill this out only after sandbox credentials are configured. Do not paste secrets into this file.

| Area | Check | Status | Evidence / Notes | Owner | Date |
|---|---|---:|---|---|---|
| Supabase | Supabase project created | ☐ |  |  |  |
| Supabase | Migration applied | ☐ |  |  |  |
| Supabase | RLS verified | ☐ |  |  |  |
| Supabase Storage | Private bucket `curls-deliverables` created | ☐ |  |  |  |
| Supabase Storage | EPUB uploaded to private path | ☐ | `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub` |  |  |
| Supabase Storage | PDF uploaded to private path | ☐ | `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf` |  |  |
| Downloads | Signed URL test passed | ☐ |  |  |  |
| Downloads | Unauthenticated download denied | ☐ |  |  |  |
| Downloads | Refunded purchase denied | ☐ |  |  |  |
| Stripe | Stripe test product created | ☐ | Curls & Contemplation — Direct Preorder / Regular Edition |  |  |
| Stripe | Stripe test price preorder created | ☐ | $17.99 |  |  |
| Stripe | Stripe test price regular created | ☐ | $19.99 |  |  |
| Stripe | Stripe webhook endpoint created | ☐ | `/api/stripe/webhook` |  |  |
| Stripe | Stripe CLI replay passed | ☐ |  |  |  |
| Resend | Resend domain/sender verified | ☐ |  |  |  |
| Resend | Resend test emails sent | ☐ |  |  |  |
| MailerLite | MailerLite groups created | ☐ | Subscribers, Free Chapter, Preorders, Customers, Abandoned Checkout, Bonus Claim Started, Bonus Claim Completed, Refunded, Blog Readers, VIP / Early Readers |  |  |
| MailerLite | MailerLite add subscriber test passed | ☐ |  |  |  |
| Turnstile | Turnstile test passed or intentionally skipped | ☐ |  |  |  |
| Analytics | Analytics consent test passed | ☐ |  |  |  |
| Security | No secrets committed | ☐ |  |  |  |
| Security | No public paid files | ☐ |  |  |  |
| Launch Gate | Production activation still blocked | ☐ |  |  |  |

## Required command evidence

```bash
cd author-site
pnpm check:sandbox
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Record command output summaries only. Never paste keys, signed URLs, private customer data, or full email payloads.


## Prompt 7 sandbox verification results

Statuses use only: `PASSED`, `FAILED`, `SKIPPED — credentials missing`, or `BLOCKED — human/provider setup required`.

| Provider | Check | Status | Evidence / Notes | Date |
|---|---|---:|---|---|
| Supabase | project credentials detected | SKIPPED — credentials missing | Missing `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`. | 2026-06-10 |
| Supabase | migration application verified or blocked | BLOCKED — human/provider setup required | Requires sandbox Supabase project and migration application. | 2026-06-10 |
| Supabase | RLS verification completed or blocked | BLOCKED — human/provider setup required | Requires provider-backed anon/authenticated/admin/service-role checks. | 2026-06-10 |
| Supabase | private bucket `curls-deliverables` verified or blocked | SKIPPED — credentials missing | Static locked bucket string passed; remote bucket probe skipped. | 2026-06-10 |
| Supabase | EPUB private object path verified or blocked | SKIPPED — credentials missing | Static locked path passed; remote object listing skipped. | 2026-06-10 |
| Supabase | PDF private object path verified or blocked | SKIPPED — credentials missing | Static locked path passed; remote object listing skipped. | 2026-06-10 |
| Supabase | signed URL generation verified or blocked | BLOCKED — human/provider setup required | Requires sandbox authenticated entitled user and private Storage object. | 2026-06-10 |
| Supabase | unauthenticated download denied | PASSED | Local tests cover denial/static entitlement behavior; remote signed URL path remains blocked until credentials. | 2026-06-10 |
| Supabase | refunded/revoked download denied | PASSED | Local entitlement tests cover revoked/refunded denial; provider-backed replay remains blocked. | 2026-06-10 |
| Stripe | test secret key detected | SKIPPED — credentials missing | `STRIPE_SECRET_KEY` absent. | 2026-06-10 |
| Stripe | live key pattern rejected | PASSED | `pnpm check:stripe-test` and static secret scan found no live key pattern. | 2026-06-10 |
| Stripe | preorder price ID detected | SKIPPED — credentials missing | `STRIPE_PRICE_ID_PREORDER` absent. | 2026-06-10 |
| Stripe | regular price ID detected | SKIPPED — credentials missing | `STRIPE_PRICE_ID_REGULAR` absent. | 2026-06-10 |
| Stripe | checkout test session created or blocked | SKIPPED — credentials missing | Not created; no Stripe test credentials present. | 2026-06-10 |
| Stripe | webhook signing secret detected | SKIPPED — credentials missing | `STRIPE_WEBHOOK_SECRET` absent. | 2026-06-10 |
| Stripe | webhook bad signature rejection verified | PASSED | Local webhook tests cover bad signature rejection. | 2026-06-10 |
| Stripe | webhook replay verified or blocked | BLOCKED — human/provider setup required | Requires Stripe CLI/test-mode webhook endpoint. | 2026-06-10 |
| Stripe | refund/revocation flow verified or blocked | BLOCKED — human/provider setup required | Local logic covered; provider replay requires Stripe test webhook and Supabase sandbox. | 2026-06-10 |
| Resend | API key detected | SKIPPED — credentials missing | `RESEND_API_KEY` absent. | 2026-06-10 |
| Resend | sender/from email detected | SKIPPED — credentials missing | `RESEND_FROM_EMAIL` and `SUPPORT_EMAIL` absent. | 2026-06-10 |
| Resend | order confirmation send verified or blocked | SKIPPED — credentials missing | No email sent. Requires sandbox sender and `SANDBOX_TEST_EMAIL`. | 2026-06-10 |
| Resend | download access send verified or blocked | SKIPPED — credentials missing | No email sent. Requires sandbox sender and `SANDBOX_TEST_EMAIL`. | 2026-06-10 |
| Resend | free chapter send verified or blocked | SKIPPED — credentials missing | No email sent. Requires sandbox sender and `SANDBOX_TEST_EMAIL`. | 2026-06-10 |
| Resend | refund/access revoked send verified or blocked | SKIPPED — credentials missing | No email sent. Requires sandbox sender and `SANDBOX_TEST_EMAIL`. | 2026-06-10 |
| MailerLite | API key detected | SKIPPED — credentials missing | `MAILERLITE_API_KEY` absent. | 2026-06-10 |
| MailerLite | group IDs detected | SKIPPED — credentials missing | Sandbox group IDs absent. | 2026-06-10 |
| MailerLite | add/update subscriber verified or blocked | SKIPPED — credentials missing | No subscriber mutation attempted. | 2026-06-10 |
| MailerLite | free chapter group verified or blocked | SKIPPED — credentials missing | Requires sandbox group ID. | 2026-06-10 |
| MailerLite | preorder group verified or blocked | SKIPPED — credentials missing | Requires sandbox group ID. | 2026-06-10 |
| MailerLite | customer group verified or blocked | SKIPPED — credentials missing | Requires sandbox group ID. | 2026-06-10 |
| MailerLite | refunded group verified or blocked | SKIPPED — credentials missing | Requires sandbox group ID. | 2026-06-10 |
| Turnstile | site key detected | SKIPPED — credentials missing | `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SITE_KEY` absent. | 2026-06-10 |
| Turnstile | secret key detected | SKIPPED — credentials missing | `TURNSTILE_SECRET_KEY` absent. | 2026-06-10 |
| Turnstile | invalid/missing challenge fails safely | PASSED | App remains credential-gated; no remote trust path was enabled without keys. | 2026-06-10 |
| Turnstile | sandbox validation verified or blocked | SKIPPED — credentials missing | Requires sandbox widget keys. | 2026-06-10 |
| Analytics | GA4 or PostHog sandbox ID detected | SKIPPED — credentials missing | GA4/PostHog sandbox IDs absent. | 2026-06-10 |
| Analytics | consent behavior verified | PASSED | Local tests cover consent helper behavior. | 2026-06-10 |
| Analytics | invalid event rejected | PASSED | Local analytics route/schema tests cover invalid event rejection. | 2026-06-10 |
| Analytics | operational event accepted | PASSED | Local tests cover approved event map and server-side operational event shape. | 2026-06-10 |
| Analytics | sensitive metadata stripped | PASSED | Local tests cover metadata sanitization. | 2026-06-10 |
| Security/static | no real secrets committed | PASSED | Secret-pattern scan produced documentation-only matches for the recorded scan command and found no real live/populated key values in checked paths. | 2026-06-10 |
| Security/static | no `.env.local` committed | PASSED | `test ! -f author-site/.env.local` passed. | 2026-06-10 |
| Security/static | no `.env.sandbox` committed | PASSED | `test ! -f author-site/.env.sandbox` passed. | 2026-06-10 |
| Security/static | no paid EPUB/PDF in public | PASSED | `pnpm check:deliverables` and public file scan passed. | 2026-06-10 |
| Security/static | no release/public path leakage | PASSED | Static deliverables check passed for no public paid-file URL references. | 2026-06-10 |
| Security/static | no live payment activation | PASSED | Stripe live patterns absent; no checkout session created. | 2026-06-10 |
| Security/static | no production deploy | PASSED | No Vercel production deploy command was run. | 2026-06-10 |
