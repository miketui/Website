# Prompt 8 Vercel Preview Deployment Guide

This guide is for Preview only. Do not deploy production, do not add live keys, and do not activate live payments from this guide.

## Project settings

- **Vercel project root:** `author-site`
- **Install command:** `pnpm install`
- **Build command:** `pnpm build`
- **Output:** `.next`
- **Framework preset:** Next.js
- **Node/package manager:** use the package manager from `author-site/package.json` (`pnpm@10.0.0`)

## Before creating the preview

1. Confirm the branch contains `author-site/package.json`.
2. Confirm `apps/author-site/` is not used.
3. Confirm paid EPUB/PDF files are not in `author-site/public/`.
4. Confirm no `.env.local` or `.env.sandbox` files are committed.
5. Confirm no production/live provider keys are in Vercel Preview env.

## Preview env vars

Use Vercel **Preview** environment variables first. Do not add Production env values yet.

### Site

- `NEXT_PUBLIC_SITE_URL=` set to the Vercel Preview URL after the first preview exists.
- `NEXT_PUBLIC_LAUNCH_MODE=preorder` or `paused` for safe preview behavior.
- `RELEASE_DATE=` Michael-approved planned release date, if known.
- `SUPPORT_EMAIL=` approved support inbox.

### Supabase sandbox

- `NEXT_PUBLIC_SUPABASE_URL=` sandbox project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=` sandbox anon key.
- `SUPABASE_SERVICE_ROLE_KEY=` sandbox service role key in Vercel env only.
- `SUPABASE_STORAGE_BUCKET=curls-deliverables`.

Create private bucket `curls-deliverables`, then upload:

- `books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub`
- `books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf`

Source files stay outside the website public folder:

- `release/Curls-and-Contemplation-v8-20260610.epub`
- `release/CurlsAndContemplation-POD-Royal-v8-20260610.pdf`

### Stripe test mode

Use test keys and test price IDs only:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=` test publishable key.
- `STRIPE_SECRET_KEY=` test secret key.
- `STRIPE_WEBHOOK_SECRET=` test webhook secret.
- `STRIPE_PRICE_ID_PREORDER=` test one-time `$17.99` price.
- `STRIPE_PRICE_ID_REGULAR=` test one-time `$19.99` price.

### Resend/MailerLite

- `RESEND_API_KEY=` sandbox/test key.
- `RESEND_FROM_EMAIL=` verified preview/test sender.
- `MAILERLITE_API_KEY=` sandbox/test key.
- `MAILERLITE_GROUP_*=` sandbox group IDs only.

Do not send a production broadcast from preview.

### Turnstile, analytics, monitoring

- `TURNSTILE_SITE_KEY=` sandbox/test site key.
- `TURNSTILE_SECRET_KEY=` sandbox/test secret key.
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID=` preview/testing stream only, if GA4 is chosen.
- `NEXT_PUBLIC_POSTHOG_KEY=` preview/testing project only, if PostHog is chosen.
- `SENTRY_DSN=` / `NEXT_PUBLIC_SENTRY_DSN=` preview project DSN only.

## Deploy Preview

1. Import the repo into Vercel.
2. Set Root Directory to `author-site`.
3. Add Preview env vars.
4. Trigger a Preview deployment.
5. After Vercel gives the preview URL, update `NEXT_PUBLIC_SITE_URL` to that URL and redeploy Preview.

## Preview smoke tests

From local `author-site/` before or after preview:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check:sandbox
pnpm check:sandbox-env
pnpm check:deliverables
pnpm check:supabase-storage
pnpm check:stripe-test
```

In the Vercel Preview UI/browser:

- [ ] Home loads.
- [ ] `/book`, `/preorder`, `/buy`, `/free-chapter`, `/faq`, and `/contact` load.
- [ ] `/login`, `/dashboard`, and `/downloads` do not expose customer data.
- [ ] `/admin` is not visible/usable by normal users.
- [ ] Stripe test checkout reaches test-mode Checkout only.
- [ ] Stripe webhook test creates entitlement in sandbox.
- [ ] Protected download works only for an entitled sandbox user.
- [ ] Unauthorized download is denied.
- [ ] Refunded/revoked entitlement is denied.
- [ ] Consent banner blocks marketing analytics until consent.
- [ ] Reduced-motion preference is honored.

## Confirm production remains locked

- [ ] No `sk_live_`, `rk_live_`, or live webhook secret is present.
- [ ] No production Supabase service-role key is present.
- [ ] No production Resend/MailerLite key is present.
- [ ] Vercel Production env remains empty or explicitly unconfigured.
- [ ] No production domain is assigned.
- [ ] No live Stripe payment is attempted.
- [ ] No subscription/resource-library offer is public.

## Roll back or disable preview

If a preview exposes a configuration mistake:

1. Remove the sensitive env var from Vercel immediately.
2. Redeploy Preview or disable the deployment.
3. Rotate the affected provider key if it was exposed to logs or browser output.
4. Re-run the secret scan and sandbox checks.
5. Record the incident and remediation in `author-site/docs/website-v4/17_FINAL_QA_REPORT.md`.
