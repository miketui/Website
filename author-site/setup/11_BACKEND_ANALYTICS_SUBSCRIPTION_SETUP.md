# 11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md — Backend, Analytics, Email, Subscription, and Automation Setup

## Purpose
This file gives Codex the missing backend setup layer for the author-commerce platform.

The website is not just a brochure. It must behave like a measurable preorder/post-launch revenue system:
- capture subscribers,
- route buyers through Stripe,
- create buyer records,
- protect downloads,
- trigger emails,
- track funnel events,
- support refund revocation,
- support future subscriptions/memberships without overbuilding now.

## Core backend stack
Locked stack:
- Next.js App Router route handlers
- Supabase Auth
- Supabase Postgres
- Supabase private Storage
- Stripe Checkout
- Stripe webhooks
- Resend transactional email
- MailerLite marketing email
- GA4 consent-mode analytics
- Sentry error monitoring
- Turnstile bot protection
- Vercel hosting/env vars/cron where needed

Optional but scaffold-ready:
- PostHog product analytics if Michael wants deeper funnel/session analysis later
- Stripe Billing subscriptions for a future community, workbook, or course layer

## Required backend architecture

```text
Visitor
  ↓
Marketing page / blog / preorder page
  ↓
Email capture or Stripe Checkout
  ↓
Supabase subscriber/order records
  ↓
MailerLite groups + automations
  ↓
Stripe webhook confirms payment
  ↓
Purchase entitlement created
  ↓
User signs in or magic-link account is associated by email
  ↓
Dashboard checks entitlement server-side
  ↓
Supabase private Storage signed URL generated
  ↓
Download event tracked
  ↓
Retention sequence / worksheets / future offer
```

## Supabase setup

### Project
Create one Supabase project for the production site.

Required environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=curls-deliverables
```

### Storage
Create private bucket:
```text
curls-deliverables
```

Suggested private paths:
```text
books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub
books/curls-and-contemplation/pdf/Curls-and-Contemplation-POD-Royal-FINAL.pdf
worksheets/pricing-confidence-kit.pdf
worksheets/chapter-workbook.pdf
bonuses/preorder-bonus-chapter.pdf
```

Rules:
- Bucket must be private.
- No paid EPUB/PDF in `public/`.
- Use signed URLs with 24-hour TTL.
- Track every download attempt.
- Enforce 3 downloads / 7 days by default.
- Refunded orders revoke access.

### Database tables
Codex must create SQL migration with at least:

```sql
profiles
products
prices
orders
purchases
download_tokens
download_events
bonus_claims
subscribers
subscriber_events
consent_log
webhook_events
analytics_events
gate_ledger
admin_users
```

### RLS policy intent
- Public can insert subscribers with validation.
- User can read own profile.
- User can read own purchases by `auth.uid()` or verified email association.
- User can read own bonus claims.
- User cannot read other customers' records.
- Service role handles Stripe webhook writes.
- Admin-only policies use `admin_users`.
- No direct public read of orders/purchases.

## Stripe setup

### Products
Create products in Stripe dashboard or via Stripe MCP/Codex instructions:

1. Curls & Contemplation — Direct Preorder
   - Price: `$17.99`
   - Type: one-time
   - Env: `STRIPE_PRICE_ID_PREORDER`

2. Curls & Contemplation — Direct Regular Edition
   - Price: `$19.99`
   - Type: one-time
   - Env: `STRIPE_PRICE_ID_REGULAR`

3. Optional: Worksheet / Bonus Bundle
   - Price: TBD
   - Env: `STRIPE_PRICE_ID_WORKSHEETS`

4. Future subscription placeholder:
   - Name: Curls & Contemplation Studio Notes / Resource Library
   - Type: recurring monthly
   - Price: TBD
   - Env: `STRIPE_PRICE_ID_MEMBERSHIP_MONTHLY`
   - Do not activate unless Michael approves subscription model.

### Checkout route
`app/api/checkout/route.ts` must:
- validate product/price choice with Zod,
- choose price ID server-side,
- create Stripe Checkout Session,
- set success URL to `/thank-you?session_id={CHECKOUT_SESSION_ID}`,
- set cancel URL to `/preorder` or `/buy`,
- pass customer email if known,
- attach metadata:
  - `book_slug`
  - `launch_mode`
  - `price_tier`
  - `source_page`
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`

### Webhook route
`app/api/stripe/webhook/route.ts` must:
- read raw body,
- verify `STRIPE_WEBHOOK_SECRET`,
- reject bad signature with 400,
- idempotently store Stripe event in `webhook_events`,
- on `checkout.session.completed`, create/update:
  - order
  - purchase
  - subscriber/customer group
  - entitlement
- on refund event, revoke purchase/download access,
- never trust client-side success page as purchase proof.

## MailerLite setup

### Required groups
Create or configure group IDs:
```text
Subscribers
Free Chapter
Preorders
Customers
Abandoned Checkout
Bonus Claim Started
Bonus Claim Completed
Refunded
VIP / Early Readers
Blog Readers
```

Environment variables:
```bash
MAILERLITE_API_KEY=
MAILERLITE_GROUP_SUBSCRIBERS=
MAILERLITE_GROUP_FREE_CHAPTER=
MAILERLITE_GROUP_PREORDERS=
MAILERLITE_GROUP_CUSTOMERS=
MAILERLITE_GROUP_ABANDONED_CHECKOUT=
MAILERLITE_GROUP_BONUS_CLAIM_STARTED=
MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED=
MAILERLITE_GROUP_REFUNDED=
MAILERLITE_WEBHOOK_SECRET=
```

### Automations
Codex must document automations and scaffold API functions:

1. Free Chapter Delivery
2. Preorder Nurture Sequence
3. Abandoned Checkout Recovery
4. Launch-Day Delivery
5. Customer Onboarding
6. Worksheet Engagement
7. Review/Referral Request
8. Refund/Access Revocation Notice
9. Blog-to-Book Nurture
10. Future Offer Waitlist

## Resend setup

Use Resend for transactional email:
- order confirmation,
- magic-link/account instructions if needed,
- download access,
- bonus claim status,
- support receipt,
- refund confirmation.

Environment variables:
```bash
RESEND_API_KEY=
RESEND_FROM_EMAIL=
SUPPORT_EMAIL=
```

DNS records to document:
- SPF
- DKIM
- DMARC

## Analytics setup

### Consent first
Use consent-mode behavior:
- No marketing/analytics tracking before consent where required.
- Always allow strictly necessary events for security/order fulfillment.
- Store consent in `consent_log`.

### GA4 events
Codex must create a central event map in `lib/analytics.ts`.

Marketing:
```text
page_view
scroll_depth_50
scroll_depth_90
email_signup_started
email_signup_completed
free_chapter_requested
preorder_cta_clicked
buy_cta_clicked
retailer_click
blog_cta_click
faq_opened
```

Commerce:
```text
checkout_started
checkout_completed
purchase_recorded
payment_failed
refund_recorded
```

Auth:
```text
signup_started
signup_completed
login_completed
logout_completed
password_reset_requested
```

Customer:
```text
dashboard_viewed
download_requested
download_signed_url_created
download_denied
download_limit_reached
worksheet_viewed
worksheet_downloaded
bonus_claim_started
bonus_claim_submitted
```

Design/experience:
```text
hero_cta_seen
chapter_pathway_interaction
curl_cursor_enabled
reduced_motion_detected
```

### Server-side event mirror
For purchase/download/security events, store an internal row in `analytics_events` even if GA4 is blocked by consent rules, because the business needs operational records.

## Subscription strategy

Do not force a paid subscription into v1. The book funnel should sell the direct book first.

However, scaffold future subscription readiness:
- `products.type` supports `one_time` and `subscription`.
- `prices.interval` supports `null`, `month`, `year`.
- `purchases.status` supports `active`, `refunded`, `canceled`, `past_due`.
- dashboard can display future membership cards.
- Stripe webhook handles `customer.subscription.created`, `updated`, `deleted` as placeholders.

Potential future subscription products:
1. Monthly worksheet/resource library
2. Freelance stylist business templates
3. Private community
4. Live office-hours replay library
5. Course/workbook companion

## Vercel setup

Required env groups:
- Local development
- Preview
- Production

Required build settings:
```text
Root directory: author-site
Install command: pnpm install
Build command: pnpm build
Output: .next
```

Required Vercel env vars:
- all `.env.example` names except local-only testing values.

Recommended preview gates:
- deploy preview for every PR,
- run lint/typecheck/test/build,
- run no-public-paid-file check,
- run deprecated-hex grep,
- run basic accessibility check.

## Turnstile setup
Use Cloudflare Turnstile on:
- email signup,
- free chapter form,
- contact form,
- bonus claim form,
- password reset if abuse appears.

## Sentry setup
Track:
- checkout route errors,
- webhook failures,
- Supabase errors,
- download denial spikes,
- email API errors,
- unexpected auth/session errors.

Do not send:
- full customer PII,
- raw tokens,
- signed URLs,
- secret env values.

## Admin setup
Admin surfaces:
```text
/admin
/admin/orders
/admin/subscribers
/admin/claims
/admin/content
/admin/analytics
```

Rules:
- admin email allowlist via `ADMIN_EMAILS`,
- optional `admin_users` table,
- no admin routes in sitemap,
- no public admin data.

## Codex acceptance criteria
Codex is not done until:
- `.env.example` contains all backend/analytics/subscription variables.
- Supabase migration includes required tables and RLS intent.
- Stripe checkout route and webhook route exist.
- Analytics event map exists.
- MailerLite and Resend client wrappers exist.
- Dashboard and downloads use entitlement checks.
- Future subscription fields are schema-ready but not active in UI unless approved.
- README explains backend setup step by step.
