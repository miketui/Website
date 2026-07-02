# Curls & Contemplation Author Site

Production-oriented scaffold for the Next.js App Router author-commerce platform under `author-site/`.

## Local setup

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and fill only development keys. Do not commit real secrets.

## Environment variables

`.env.example` lists launch mode, pricing, Supabase, Stripe, Resend, MailerLite, Turnstile, admin, analytics, and observability variables by name only.

## Supabase setup

Run `supabase/migrations/0001_author_commerce.sql`. Paid deliverable files (EPUB, card deck PDF) must be uploaded to private Storage bucket `curls-deliverables`, not `public/`.

## Stripe setup

Create one-time prices for preorder (`$17.99`) and regular direct (`$19.99`). The checkout API chooses server-side price IDs and never trusts client-provided prices. Webhooks verify `STRIPE_WEBHOOK_SECRET` before handling events.

## MailerLite and Resend

Wrappers fail safely when keys are absent. Configure MailerLite group IDs and Resend sender before production.

## Secure downloads

`/downloads` and `/api/downloads/sign` require a session, check entitlement server-side, deny refunded/revoked/non-buyers, and scaffold a 3 downloads / 7 days cap. Signed URLs are generated from Supabase private Storage.

## Analytics

`lib/analytics.ts` defines the event map. `lib/events/server-analytics.ts` records internal events when Supabase service credentials exist. GA4/PostHog env placeholders are present but not activated as live tracking.

## Deployment

Vercel root directory: `author-site`. Set preview and production env vars separately. Do not deploy production until launch QA and human legal review pass.

## Testing commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Real vs scaffolded

Real: route structure, content/config modules, launch mode CTA logic, server-side price selection, webhook signature verification path, entitlement-denial default, private Storage signing path, RLS migration intent, event map.

Scaffolded: final Supabase project, live Stripe products, MailerLite automations, Resend templates, actual admin data tables UI, Turnstile verification, GA4/PostHog browser activation, production legal copy.

## Prompt 5 sandbox integration notes

### Vercel settings
- Root directory: `author-site`
- Install command: `pnpm install`
- Build command: `pnpm build`
- Local env file: `.env.local` only; never commit it.
- Keep preview and production environment variables separate. Use Stripe/Supabase sandbox projects for preview.

### Stripe webhook
- Endpoint path: `/api/stripe/webhook`
- Test mode only until production activation gates pass.
- Required sandbox vars: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PREORDER`, `STRIPE_PRICE_ID_REGULAR`.

### Supabase private bucket checklist
- Apply `supabase/migrations/0001_author_commerce.sql`.
- Create private bucket `curls-deliverables`.
- Upload EPUB to `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
- The v13 POD interior PDF is a print artifact for KDP/third-party POD only — it is not a site deliverable and is not uploaded to Storage.
- Do not add public read policies for paid deliverables.

### Email and marketing checklist
- MailerLite: create groups for Subscribers, Free Chapter, Preorders, Customers, Abandoned Checkout, Bonus Claim Started, Bonus Claim Completed, Refunded, Blog Readers, and VIP / Early Readers; copy group IDs into env.
- Resend: verify sender domain and configure SPF, DKIM, and DMARC before real sends.
- Turnstile: add site/secret keys before enabling remote bot verification on forms.

### Analytics checklist
- GA4/PostHog are optional until consent behavior is approved.
- Client analytics require consent; server operational events may still record security/order/download events.

### Production activation gates
- Human legal review complete.
- Domain and email DNS approved.
- Supabase RLS verified in sandbox.
- Stripe test checkout/webhook/refund pass.
- Protected download signing and revocation pass.
- No real secrets committed and no paid files in `public/`.

## Sandbox integration

Prompt 6 prepares the app for real sandbox verification while keeping production locked. Use `docs/website-v4/12_SANDBOX_INTEGRATION_RUNBOOK.md` as the step-by-step source of truth and `docs/website-v4/13_SANDBOX_TEST_RESULTS_TEMPLATE.md` to record results without secrets.

### Sandbox env file

1. Copy `.env.sandbox.example` to a local-only `.env.sandbox` or copy selected values into `.env.local` for local testing only.
2. Fill sandbox/test values only. Never use production/live API keys.
3. Never commit `.env.local`, `.env.sandbox`, signed URLs, customer exports, or provider secrets.
4. Keep production env scopes empty/blocked until launch approval.

Run the safe readiness checks:

```bash
pnpm check:sandbox
```

The sandbox checks hide secret values, allow missing provider credentials during scaffolding, and fail only on dangerous conditions such as live Stripe key patterns or paid EPUB/PDF files in `public/`.

### Supabase sandbox

Apply the migration in a sandbox Supabase project:

```bash
cd author-site
supabase db push --include-all
# or run supabase/migrations/0001_author_commerce.sql in the Supabase SQL editor.
```

Create private Storage bucket `curls-deliverables` with public access disabled. Upload the local release artifact from the repo root to this private object path only:

- EPUB: `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`

Source artifacts remain outside public:

- `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
- `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf` (POD print interior for KDP/third-party POD only — never uploaded to Storage)

After credentials are present, run:

```bash
pnpm check:supabase-storage
```

Without Supabase credentials, this check verifies locked path strings and safely skips the remote bucket/object probe.

### Stripe test mode

In Stripe Dashboard **Test mode**:

1. Create product `Curls & Contemplation — Direct Preorder` with one-time `$17.99` price and set `STRIPE_PRICE_ID_PREORDER`.
2. Create product `Curls & Contemplation — Direct Regular Edition` with one-time `$19.99` price and set `STRIPE_PRICE_ID_REGULAR`.
3. Set test keys only: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_SECRET`.
4. Create a test webhook endpoint at `/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.expired`, `charge.refunded`, optional `payment_intent.succeeded`, and subscription placeholder events.

If Stripe CLI is available:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
stripe trigger charge.refunded
```

Run:

```bash
pnpm check:stripe-test
```

The check fails on live key patterns and skips safely if test credentials are missing.

### Resend and MailerLite sandbox

Configure Resend sandbox/test sender values: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `SUPPORT_EMAIL`. Test order confirmation, download access, free chapter delivery, bonus claim received, refund/access revoked, and support receipt messages only against sandbox recipients. Production SPF, DKIM, and DMARC remain a launch gate.

Configure MailerLite sandbox groups for Subscribers, Free Chapter, Preorders, Customers, Abandoned Checkout, Bonus Claim Started, Bonus Claim Completed, Refunded, Blog Readers, and VIP / Early Readers. Set the matching `MAILERLITE_GROUP_*` env IDs and test add/update plus group assignment without sending a production broadcast.

### Turnstile and analytics sandbox

Use Turnstile sandbox/test keys when available. Missing keys must fail safely and must not cause forms to trust unverified high-risk submissions.

GA4 and PostHog are optional sandbox integrations. Consent mode must block marketing analytics until accepted, while server-side operational events may record fulfillment/security events without signed URLs, secrets, tokens, or full PII.

### Production remains blocked

Before production activation, Michael must approve legal copy, domain/email DNS, Supabase RLS, private Storage, Stripe test checkout/webhook/refund, protected download revocation, Resend/MailerLite sandbox sends, analytics consent behavior, and final launch QA. Do not activate live payments or a subscription offer in Prompt 6.


## Prompt 7 sandbox verification

Prompt 7 documents provider-readiness without using production keys or deploying production. The complete report lives at `docs/website-v4/14_SANDBOX_VERIFICATION_REPORT.md` from this app directory.

Run the safe verification suite from `author-site/`:

```bash
pnpm check:sandbox
pnpm check:sandbox-env
pnpm check:deliverables
pnpm check:supabase-storage
pnpm check:stripe-test
```

Read `docs/website-v4/14_SANDBOX_VERIFICATION_REPORT.md` for the pass/fail/skipped table, missing env names, and next actions. Missing sandbox credentials are expected to report as skipped unless a dangerous live/prod pattern is detected. Placeholder values copied from example files are treated as missing, not provider-ready.

Provider-backed checks remain blocked until sandbox-only credentials are configured through secure local runtime variables or Vercel Preview env. Do not commit `.env.local`, `.env.sandbox`, API keys, signed URLs, customer exports, or provider secrets. Production remains locked: no live payments, no production deploy, and no live subscription offer.


## Prompt 8 final handoff

Prompt 8 consolidated all website-related files into this self-contained `author-site/` folder. A future operator should start here, then read:

- `docs/website-v4/15_FINAL_HANDOFF.md`
- `docs/website-v4/16_PRODUCTION_ACTIVATION_CHECKLIST.md`
- `docs/website-v4/17_FINAL_QA_REPORT.md`
- `docs/website-v4/18_VERCEL_PREVIEW_DEPLOYMENT_GUIDE.md`

Preview may be deployed from Vercel with root directory `author-site` after sandbox env vars are configured. Production remains blocked until Michael approves legal copy, claims, domain, live payment activation, provider configuration, and the production activation checklist.
