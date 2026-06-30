<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 07_WORKFLOW_AND_KEYS — Setup, Environments, and Credentials Plan

## 1. End-to-end visitor-to-purchase workflow
1. Visitor reaches `{{DOMAIN}}` or route-specific landing page.
2. Consent banner records cookie preferences in `consent_log`.
3. Visitor submits email on `/free-chapter` or `/preorder`.
4. Server validates Turnstile and form input.
5. Server inserts/updates `subscribers` and `subscriber_events`.
6. Server adds subscriber to MailerLite group.
7. Visitor starts checkout from `/preorder` or `/buy`.
8. `/api/checkout` selects Stripe price server-side.
9. Stripe Checkout collects payment.
10. `/api/stripe/webhook` verifies signature and writes order/purchase.
11. Resend sends confirmation.
12. Customer signs in with Supabase Auth.
13. Dashboard checks entitlement.
14. `/api/downloads/sign` creates Supabase private Storage signed URL.
15. Download and analytics events are recorded.

## 2. Stripe setup
Create test-mode products first:
- `Curls & Contemplation — Direct Preorder` one-time `$17.99` → `STRIPE_PRICE_ID_PREORDER`.
- `Curls & Contemplation — Direct Regular Edition` one-time `$19.99` → `STRIPE_PRICE_ID_REGULAR`.
- Optional worksheet/future products remain inactive unless approved.

Get keys from Stripe Dashboard:
- Developers → API keys: `STRIPE_SECRET_KEY`.
- Developers → Webhooks: endpoint secret `STRIPE_WEBHOOK_SECRET`.
- Products → Prices: price IDs.

Production gate:
- Test webhook signature verification.
- Test refund entitlement revocation.
- Confirm tax/business settings.
- Switch to live keys only after human approval.

## 3. Supabase setup
Create a Supabase project per environment or use separate projects for preview/production.

Needed values:
- `NEXT_PUBLIC_SUPABASE_URL`: Project Settings → API.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Project Settings → API.
- `SUPABASE_SERVICE_ROLE_KEY`: Project Settings → API; server-only.

Run migrations from Prompt 3 after review. Enable RLS and verify policies.

## 4. Supabase private Storage setup
Create private bucket:
```text
curls-deliverables
```
Upload paid files after production storage is ready:
- `release/Curls-and-Contemplation-v8-20260610.epub`
- `release/CurlsAndContemplation-POD-Royal-v8-20260610.pdf`

Rules:
- Never copy paid files into `author-site/public/`.
- Use signed URLs from server route only.
- Record download attempts.

## 5. MailerLite setup
Get API key from MailerLite Integrations/API.
Create groups:
- Subscribers, Free Chapter, Preorders, Customers, Abandoned Checkout, Bonus Claim Started, Bonus Claim Completed, Refunded, VIP / Early Readers, Blog Readers.

Create automations:
1. Free Chapter Delivery.
2. Preorder Nurture.
3. Abandoned Checkout Recovery.
4. Launch-Day Delivery.
5. Customer Onboarding.
6. Worksheet Engagement.
7. Review/Referral Request.
8. Refund/Access Revocation.
9. Blog-to-Book Nurture.
10. Future Offer Waitlist.

## 6. Resend setup
Get `RESEND_API_KEY` from Resend API Keys.
Verify sender domain and configure:
- SPF.
- DKIM.
- DMARC.

Transactional sender:
- `RESEND_FROM_EMAIL` should use approved domain email.
- `SUPPORT_EMAIL` receives support/contact notices.

## 7. Vercel setup
Create Vercel project pointed to future `author-site/`.
Set Framework Preset: Next.js.
Set Root Directory: `author-site`.
Configure environment variables for Preview and Production separately.
Use `NEXT_PUBLIC_SITE_URL` for deployed canonical URL once domain is chosen.

## 8. GA4 setup
Create GA4 property and web stream.
Use `NEXT_PUBLIC_GA4_MEASUREMENT_ID`.
Implement consent mode:
- Default denied for analytics/ads where required.
- Update consent after user choice.
- Server-side critical events still insert into `analytics_events` for fulfillment/security.

## 9. Sentry setup
Create project and set:
- `NEXT_PUBLIC_SENTRY_DSN`.
- `SENTRY_AUTH_TOKEN` for sourcemaps if used.
- `SENTRY_ORG`, `SENTRY_PROJECT` if needed.

## 10. Turnstile setup
Create Cloudflare Turnstile widget:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` for forms.
- `TURNSTILE_SECRET_KEY` server-only verification.

Use on email capture, contact, bonus claim, and high-risk unauthenticated forms.

## 11. Admin setup
- Add approved admin user IDs/emails to `admin_users` through secure SQL or admin seed script.
- Admin routes must check Supabase session and `admin_users` membership.
- Admin navigation must be absent from public navigation.

## 12. `.env.example` variable names only
```bash
# Site
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_LAUNCH_MODE=
SUPPORT_EMAIL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PREORDER=
STRIPE_PRICE_ID_REGULAR=
STRIPE_PRICE_ID_KINDLE_EXTERNAL=
STRIPE_PRICE_ID_PAPERBACK_EXTERNAL=
STRIPE_PRICE_ID_WORKSHEETS=
STRIPE_PRICE_ID_MEMBERSHIP_MONTHLY=

# MailerLite
MAILERLITE_API_KEY=
MAILERLITE_GROUP_SUBSCRIBERS=
MAILERLITE_GROUP_FREE_CHAPTER=
MAILERLITE_GROUP_PREORDERS=
MAILERLITE_GROUP_CUSTOMERS=
MAILERLITE_GROUP_ABANDONED_CHECKOUT=
MAILERLITE_GROUP_BONUS_CLAIM_STARTED=
MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED=
MAILERLITE_GROUP_REFUNDED=
MAILERLITE_GROUP_VIP_EARLY_READERS=
MAILERLITE_GROUP_BLOG_READERS=
MAILERLITE_WEBHOOK_SECRET=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Analytics / monitoring
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

# Bot protection
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## 13. Environment use
| Variable type | Local | Preview | Production |
|---|---|---|---|
| Public site URL | localhost | Vercel preview URL | Chosen domain |
| Supabase | local/test project | preview project | production project |
| Stripe | test keys | test keys | live keys after approval |
| MailerLite | test/group sandbox if available | preview groups | production groups |
| Resend | verified test sender | verified domain | production sender |
| GA4 | debug stream | preview stream optional | production stream |
| Sentry | development env | preview env | production env |
| Turnstile | test keys | preview widget | production widget/domain |

## 14. Before production
- Domain chosen and DNS configured.
- Legal pages reviewed.
- Stripe live products/prices approved.
- Webhook endpoint live and tested.
- Supabase RLS verified.
- Paid files uploaded to private bucket.
- Download entitlement QA passed.
- MailerLite groups/automations tested.
- Resend DNS verified.
- GA4 consent mode verified.
- Sentry alerts tested.
- Turnstile verified on forms.

## Prompt 5 Vercel and sandbox environment additions

- Vercel root directory: `author-site`.
- Vercel install command: `pnpm install`.
- Vercel build command: `pnpm build`.
- Local env file: `author-site/.env.local`; do not commit it.
- Use separate preview and production env sets. Preview must use sandbox Supabase/Stripe/Resend/MailerLite settings.
- Stripe webhook endpoint path: `/api/stripe/webhook`.
- Supabase private bucket: `curls-deliverables`; upload locked EPUB/PDF objects only to private Storage paths, not `public/`.
- MailerLite group checklist: Subscribers, Free Chapter, Preorders, Customers, Abandoned Checkout, Bonus Claim Started, Bonus Claim Completed, Refunded, Blog Readers, VIP / Early Readers.
- Resend checklist: verified sender, SPF, DKIM, DMARC, support inbox, and sandbox-send review before production.
- Turnstile checklist: site key, secret key, allowed domains, and route-level verification before enabling as required.
- GA4/PostHog optional setup must honor consent; internal operational analytics may record server-side order/security/download events.
- Production activation remains blocked until legal, domain, payment, RLS, download, email, consent, and support QA gates pass.

## Prompt 6 sandbox credential gate and production lock

- Sandbox credentials may be used only in local `.env.local`, local `.env.sandbox`, or Vercel Preview env scopes. They must never be committed.
- Production/live keys are blocked until Michael approves legal copy, launch QA, domain/email DNS, payment setup, and download fulfillment.
- Run `cd author-site && pnpm check:sandbox` before any preview deploy. Missing sandbox credentials should be documented as skipped; live Stripe key patterns must fail.
- Supabase verification gate: apply `author-site/supabase/migrations/0001_author_commerce.sql`, verify RLS for anon/auth/admin/service-role behavior, create private bucket `curls-deliverables`, upload locked EPUB/PDF object paths, and confirm no public paid file access.
- Stripe verification gate: create test-mode products/prices for `$17.99` preorder and `$19.99` regular direct, configure `/api/stripe/webhook`, replay `checkout.session.completed`, `checkout.session.expired`, and `charge.refunded`, and confirm refunds revoke entitlements.
- Email provider gate: Resend sandbox sends must pass for order, download, free chapter, bonus claim, refund/access revoked, and support receipt; MailerLite sandbox groups must accept add/update and group assignment without production broadcasts.
- Turnstile/analytics gate: Turnstile test keys should verify high-risk forms or skip explicitly; analytics consent must block marketing events until consent while internal operational events avoid signed URLs, secrets, tokens, and full PII.
- Production lock gate: live Stripe/Supabase/Resend/MailerLite credentials, production Vercel env, live subscription offers, and public launch remain blocked after Prompt 6.
