<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP — v4 Backend/Growth Plan

## 1. Backend mandate
Use this file as a hard requirement for Prompt 3. The app must include Supabase Auth/DB/private Storage, Stripe one-time Checkout, signature-verified webhooks, MailerLite, Resend, GA4 consent behavior, internal server-side analytics, admin-ready surfaces, and subscription-ready schema placeholders without activating a subscription offer.

## 2. Supabase schema
Required tables:
```sql
profiles(id uuid primary key, email text, full_name text, created_at timestamptz);
products(id uuid primary key, slug text unique, name text, fulfillment_type text, active boolean);
prices(id uuid primary key, product_id uuid, stripe_price_id text, amount_cents int, currency text, mode text, active boolean);
orders(id uuid primary key, stripe_checkout_session_id text unique, stripe_payment_intent_id text, customer_email text, status text, amount_total int, currency text, metadata jsonb, created_at timestamptz);
purchases(id uuid primary key, order_id uuid, user_id uuid, customer_email text, product_slug text, entitlement_status text, revoked_at timestamptz, created_at timestamptz);
download_tokens(id uuid primary key, purchase_id uuid, user_id uuid, storage_path text, expires_at timestamptz, max_uses int, use_count int);
download_events(id uuid primary key, purchase_id uuid, user_id uuid, event_type text, ip_hash text, user_agent text, created_at timestamptz);
bonus_claims(id uuid primary key, user_id uuid, email text, status text, metadata jsonb, created_at timestamptz);
subscribers(id uuid primary key, email text unique, source text, consent_state jsonb, created_at timestamptz);
subscriber_events(id uuid primary key, subscriber_id uuid, event_type text, provider text, provider_group_id text, metadata jsonb, created_at timestamptz);
consent_log(id uuid primary key, email text, user_id uuid, consent_state jsonb, ip_hash text, created_at timestamptz);
webhook_events(id uuid primary key, provider text, provider_event_id text unique, event_type text, payload jsonb, processed_at timestamptz, created_at timestamptz);
analytics_events(id uuid primary key, user_id uuid, anonymous_id text, event_name text, route text, source text, metadata jsonb, created_at timestamptz);
admin_users(id uuid primary key, user_id uuid unique, email text unique, role text, created_at timestamptz);
content_items(id uuid primary key, type text, slug text unique, title text, status text, body text, metadata jsonb, created_at timestamptz);
memberships(id uuid primary key, user_id uuid, status text, stripe_subscription_id text, created_at timestamptz);
membership_events(id uuid primary key, membership_id uuid, event_type text, metadata jsonb, created_at timestamptz);
```

## 3. RLS intent
- Enable RLS for all tables.
- `profiles`: users read/update own row.
- `purchases`: users read own purchase by `auth.uid()`; email association must be verified server-side.
- `orders`: no direct customer read unless exposed through safe server projection.
- `download_tokens/events`: users see own events; tokens created server-side only.
- `subscribers`: public insert only through validated route or constrained policy; no public list read.
- `analytics_events`, `webhook_events`: service/admin only.
- `admin_users`: admin/service only.
- `memberships`: placeholder policies; not offered publicly.

## 4. Supabase private Storage
Bucket: `curls-deliverables`.

Private object paths:
- `books/curls-and-contemplation/v8/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
- `books/curls-and-contemplation/v8/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`.

Rules:
- Bucket private.
- No paid files in `public/`.
- Server validates entitlement before signed URL.
- Signed URL TTL <= 24 hours.
- Record `download_signed`, `download_denied`, and `download_expired` events.

## 5. Stripe products/prices/webhooks
Products:
- Direct Preorder: one-time `$17.99`, `STRIPE_PRICE_ID_PREORDER`.
- Direct Regular Edition: one-time `$19.99`, `STRIPE_PRICE_ID_REGULAR`.
- Kindle external: `$9.99`, external link/reference only.
- Paperback/POD external placeholder: `$29.99`, external/reference only.
- Future membership: placeholder only, inactive.

Checkout route:
- Validate request with Zod.
- Derive price ID server-side from launch mode and product intent.
- Include metadata for source attribution.
- Use `NEXT_PUBLIC_SITE_URL` for success/cancel URLs.

Webhook route:
- Read raw request body.
- Verify `STRIPE_WEBHOOK_SECRET`.
- Store idempotency record in `webhook_events`.
- On completion, create/update `orders`, `purchases`, `subscribers`, `subscriber_events`.
- On refund/chargeback, set purchase `entitlement_status='revoked'`, set `revoked_at`, notify customer via Resend, add MailerLite `Refunded` group.

## 6. Secure downloads
`/api/downloads/sign` must:
1. Require Supabase session.
2. Validate requested deliverable slug.
3. Query active entitlement.
4. Check revoked/refunded/download limits.
5. Create signed URL with Supabase service role server-side.
6. Insert `download_tokens` / `download_events`.
7. Return short-lived URL or structured denial.

## 7. MailerLite groups and automations
Groups:
- Subscribers.
- Free Chapter.
- Preorders.
- Customers.
- Abandoned Checkout.
- Bonus Claim Started.
- Bonus Claim Completed.
- Refunded.
- VIP / Early Readers.
- Blog Readers.

Automations:
1. Free Chapter Delivery.
2. Preorder Nurture Sequence.
3. Abandoned Checkout Recovery.
4. Launch-Day Delivery.
5. Customer Onboarding.
6. Worksheet Engagement.
7. Review/Referral Request.
8. Refund/Access Revocation Notice.
9. Blog-to-Book Nurture.
10. Future Offer Waitlist.

## 8. Resend transactional email
Messages:
- Free chapter delivery.
- Preorder confirmation.
- Order confirmation.
- Launch delivery notice.
- Download access notice.
- Bonus claim status.
- Support receipt.
- Refund/access revocation notice.

Do not include private signed URLs in long-lived email unless TTL is short and regenerated from dashboard is available.

## 9. GA4 event map
Use consent-aware client events:
- `page_view`, `scroll_depth`, `cta_click`.
- `email_capture_success`.
- `checkout_started`.
- `preorder_completed`.
- `purchase_completed`.
- `dashboard_viewed`.
- `download_signed`.
- `bonus_claim_completed`.
- `refund_recorded`.

Do not send PII to GA4. Use internal IDs or event metadata without raw email.

## 10. Internal analytics events
`analytics_events` is the server-side truth for critical funnel events. It should store:
- Event name.
- Route/source.
- Anonymous ID or user ID.
- UTM metadata.
- Product/price tier.
- Non-sensitive status metadata.

## 11. Subscription-ready placeholders
Include tables and env placeholders for future memberships, but do not:
- Show a subscription offer.
- Create active recurring prices.
- Start Stripe Billing subscription flow.
- Promise future member benefits.

Use only waitlist/future-offer language if needed.

## 12. Vercel env/deploy instructions
- Root directory: `author-site`.
- Framework: Next.js.
- Set Preview env vars separately from Production.
- Production deploy only after QA checklist passes.
- Configure webhook URL after domain/preview URL exists.

## 13. Sentry
- Add Sentry DSN and environment tags.
- Scrub request bodies and headers containing secrets, payment IDs beyond necessary references, or customer-sensitive data.
- Alert on webhook failures, download failures, and admin auth failures.

## 14. Turnstile
- Use Cloudflare Turnstile on public forms.
- Verify token server-side.
- Fail closed for suspicious high-risk forms but provide support path.

## 15. Admin surfaces
- Orders: status, amount, Stripe references, entitlement/revocation.
- Subscribers: group status, source, consent state.
- Claims: claim status and manual review.
- Content: drafts/published placeholders.
- Analytics: funnel counts, failures, download events.

Admin surfaces must avoid exposing full secrets, raw webhook payloads to non-technical admins, or sensitive customer data beyond operational need.
