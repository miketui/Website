# 12_SANDBOX_INTEGRATION_RUNBOOK — Prompt 6 Safe Sandbox Wiring

This runbook connects sandbox services only. Do not paste production/live keys into local files, Vercel Preview, or test scripts. Do not deploy production, activate live payments, or copy paid EPUB/PDF files into `author-site/public/`.

Locked private bucket: `curls-deliverables`

Locked private object paths:
- `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
- `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`

Local release source artifacts must stay outside public:
- `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
- `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`

## A. Supabase sandbox

1. Create a new Supabase project dedicated to sandbox/preview testing.
2. In Project Settings → API, copy these values into local `.env.sandbox` or Vercel Preview env only:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only; never expose in client code)
3. Set `SUPABASE_STORAGE_BUCKET=curls-deliverables`.
4. Apply the schema migration:
   ```bash
   cd author-site
   supabase db push --include-all
   # or paste/run supabase/migrations/0001_author_commerce.sql in the Supabase SQL editor.
   ```
5. Verify RLS is enabled on all app tables created by `author-site/supabase/migrations/0001_author_commerce.sql`.
6. Verify anon and authenticated roles cannot read other customers' orders, purchases, claims, subscribers, download events, or analytics events.
7. Create private Storage bucket `curls-deliverables`. Keep **public bucket** disabled.
8. Upload `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub` to:
   `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
9. Upload `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf` to:
   `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`
10. Verify the bucket remains private by attempting an unauthenticated object URL. It should be denied.
11. Verify signed URLs are generated only through `/api/downloads/sign` after a sandbox user has an active entitlement.
12. Verify a user without entitlement, a refunded purchase, and a revoked purchase are denied.
13. Verify paid files are not in `author-site/public/`:
    ```bash
    cd author-site
    pnpm check:deliverables
    pnpm check:supabase-storage
    ```

## B. Stripe test mode

1. Open Stripe Dashboard with **Test mode** enabled.
2. Create product: `Curls & Contemplation — Direct Preorder`.
3. Add a one-time test price: `$17.99 USD`; copy the price ID to `STRIPE_PRICE_ID_PREORDER`.
4. Create product: `Curls & Contemplation — Direct Regular Edition`.
5. Add a one-time test price: `$19.99 USD`; copy the price ID to `STRIPE_PRICE_ID_REGULAR`.
6. Copy test API keys only:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
7. Create a test webhook endpoint using the preview/local URL plus `/api/stripe/webhook`.
8. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.refunded`
   - `payment_intent.succeeded` if needed by the sandbox checkout flow
   - `customer.subscription.created` placeholder only
   - `customer.subscription.updated` placeholder only
   - `customer.subscription.deleted` placeholder only
9. Copy the endpoint signing secret to `STRIPE_WEBHOOK_SECRET`.
10. If Stripe CLI is available, replay locally:
    ```bash
    stripe login
    stripe listen --forward-to localhost:3000/api/stripe/webhook
    stripe trigger checkout.session.completed
    stripe trigger charge.refunded
    ```
11. Run:
    ```bash
    cd author-site
    pnpm check:stripe-test
    ```
12. Confirm no live mode activation, no live secret key, restricted key, or live webhook secret prefixes are used.

## C. Resend sandbox

1. Configure a sandbox sender or verified test domain if available.
2. Set:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL`
   - `SUPPORT_EMAIL`
3. Test these transactional messages in sandbox only:
   - order confirmation
   - download access
   - free chapter delivery
   - bonus claim received
   - refund/access revoked
   - support receipt
4. Production gate: SPF, DKIM, and DMARC must be verified before real-recipient sends.

## D. MailerLite sandbox

1. Create or identify sandbox groups:
   - Subscribers
   - Free Chapter
   - Preorders
   - Customers
   - Abandoned Checkout
   - Bonus Claim Started
   - Bonus Claim Completed
   - Refunded
   - Blog Readers
   - VIP / Early Readers
2. Set group environment IDs:
   - `MAILERLITE_GROUP_SUBSCRIBERS`
   - `MAILERLITE_GROUP_FREE_CHAPTER`
   - `MAILERLITE_GROUP_PREORDERS`
   - `MAILERLITE_GROUP_CUSTOMERS`
   - `MAILERLITE_GROUP_ABANDONED_CHECKOUT`
   - `MAILERLITE_GROUP_BONUS_CLAIM_STARTED`
   - `MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED`
   - `MAILERLITE_GROUP_REFUNDED`
   - `MAILERLITE_GROUP_BLOG_READERS`
   - `MAILERLITE_GROUP_VIP_EARLY_READERS`
3. Set `MAILERLITE_API_KEY` and optional `MAILERLITE_WEBHOOK_SECRET`.
4. Test subscriber add/update and group assignment with a sandbox email address only.
5. Confirm no production broadcast, automation, or audience is used.

## E. Turnstile

1. Create a Cloudflare Turnstile sandbox/test widget if available.
2. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` or `TURNSTILE_SITE_KEY` for client use, and `TURNSTILE_SECRET_KEY` server-side.
3. Verify form placeholders fail safely when keys are absent: the app should not expose private tokens and should not silently trust high-risk unauthenticated submissions.
4. Production gate: enable full remote verification before public traffic.

## F. Analytics

1. Optional: create a GA4 sandbox web stream and set `NEXT_PUBLIC_GA4_MEASUREMENT_ID`.
2. Optional: create a PostHog sandbox project and set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.
3. Confirm consent mode defaults to no marketing analytics until accepted.
4. Confirm server-side operational events still record checkout, download, security, and fulfillment events when Supabase service credentials exist.
5. Do not include signed URLs, secrets, tokens, full PII, service-role keys, or email bodies in event payloads.

## G. Vercel preview

1. Create or update a Vercel project with:
   - Root directory: `author-site`
   - Install command: `pnpm install`
   - Build command: `pnpm build`
2. Keep env scopes separate:
   - Local: developer-only `.env.local` or `.env.sandbox` (never committed)
   - Preview: sandbox Supabase, Stripe test mode, Resend/MailerLite sandbox credentials
   - Production: empty/blocked until launch approval
3. Production remains blocked until legal review, checkout sandbox, webhook replay, protected downloads, email DNS, RLS verification, and final launch QA all pass.
