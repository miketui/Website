<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 01_WEBSITE_PRD_v4 — Author-Commerce Product Requirements

## 1. Product overview
Build a production-ready author-commerce platform for **Curls & Contemplation: A Freelance Hairstylist's Guide to Creative Excellence** by **Michael David Warren Jr. / Michael David**. The site sells the direct digital bundle, grows an owned email list, protects paid deliverables, and prepares the business for post-launch retention without activating subscriptions in v1.

Controlling repo truth:
- Audit source: `author-site/docs/website-v4/00_REPO_AUDIT.md`.
- Current EPUB: `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
- Current PDF/POD interior: `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`.
- The paid EPUB/PDF must later be uploaded to Supabase private Storage bucket `curls-deliverables`; never place paid deliverables under a web `public/` folder.

## 2. Audience
Primary audience:
- Freelance hairstylists, assistants, emerging editorial/session stylists, salon-independent creatives, and beauty professionals who know the craft but need stronger business structure.

Audience state:
- Skilled but scattered.
- Often self-taught in pricing, booking, client boundaries, planning, and self-advocacy.
- Wants a premium, practical, emotionally intelligent path rather than hype.

Voice requirements:
- Warm, direct, premium, credible, specific.
- No generic AI phrasing.
- No fake urgency, fake scarcity, fake reviews, fake awards, invented testimonials, guaranteed income, or guaranteed bestseller language.
- Every credibility claim that exceeds basic product facts must be tagged `[VERIFY: claims-evidence.md]` until evidence is approved.

## 3. Locked launch modes
The app must support three launch modes through server-readable configuration:

| Mode | Public behavior | Primary CTA | Fulfillment behavior |
|---|---|---|---|
| `preorder` | Preorder page leads; buy routes may redirect or explain preorder. | Preorder for `$17.99`. | Record preorder entitlement; deliver launch email sequence and bonus confirmation. |
| `launched` | Buy page leads; preorder page becomes legacy/explainer. | Buy direct for `$19.99`. | Confirm purchase and enable secure downloads. |
| `paused` | Commerce disabled without breaking trust pages. | Join list / contact support. | No Checkout Session creation; capture interest only. |

Pricing locks:
- Direct preorder/launch price: **$17.99**.
- Regular direct price: **$19.99**.
- Kindle external bare ebook: **$9.99**.
- Paperback/POD external placeholder: **$29.99**.

## 4. Locked stack
- Next.js App Router.
- TypeScript strict.
- Tailwind CSS.
- Supabase Auth.
- Supabase Postgres.
- Supabase private Storage.
- Stripe Checkout.
- Stripe webhooks with raw-body signature verification.
- Resend transactional email.
- MailerLite marketing email.
- Vercel deployment.
- GA4 consent-mode analytics.
- Internal server-side analytics table.
- Sentry error monitoring.
- Turnstile bot protection.

Future app location for Prompt 3: `author-site/`.

## 5. Route map
Public routes:
- `/`, `/book`, `/preorder`, `/buy`, `/free-chapter`, `/chapters`, `/chapter/[slug]`, `/blog`, `/blog/[slug]`, `/resources`, `/worksheets`, `/about`, `/media-kit`, `/faq`, `/contact`, `/thank-you`, `/privacy`, `/terms`, `/refund-policy`, `/preorder-policy`, `/digital-delivery-policy`, `/cookies`, `/accessibility`.

Auth/customer routes:
- `/signup`, `/login`, `/logout`, `/dashboard`, `/downloads`, `/bonus-claim`.

Admin routes:
- `/admin`, `/admin/orders`, `/admin/subscribers`, `/admin/claims`, `/admin/content`, `/admin/analytics`.

API routes for Prompt 3:
- `/api/checkout`, `/api/stripe/webhook`, `/api/downloads/sign`, `/api/subscribe`, `/api/free-chapter`, `/api/bonus-claim`, `/api/track`, `/api/health`.

## 6. Preorder workflow
1. Visitor lands from social/search/email/referral.
2. Visitor reaches `/preorder` or first-home CTA.
3. Visitor can capture email before checkout.
4. `/api/subscribe` validates input, records subscriber, stores consent, and sends MailerLite group assignment.
5. Checkout CTA posts to `/api/checkout` with product intent `preorder`.
6. Server chooses `STRIPE_PRICE_ID_PREORDER` only when `launch_mode=preorder`.
7. Stripe Checkout collects payment.
8. Stripe webhook verifies signature and idempotently records event.
9. Webhook creates order, purchase/entitlement, preorder subscriber status, and Resend confirmation.
10. Buyer sees `/thank-you` with next steps, bonus claim CTA, and account/dashboard instructions.
11. MailerLite launch sequence starts.

## 7. Post-launch workflow
1. Visitor arrives at `/buy`, blog, SEO route, or direct book page.
2. CTA posts to `/api/checkout` with product intent `regular`.
3. Server chooses `STRIPE_PRICE_ID_REGULAR` only when `launch_mode=launched`.
4. Stripe Checkout completes.
5. Webhook creates order and entitlement.
6. User signs in or creates an account through Supabase Auth.
7. `/dashboard` and `/downloads` check entitlements server-side.
8. `/api/downloads/sign` creates short-lived signed Supabase private Storage URLs after entitlement checks.
9. Download events are recorded.
10. Customer enters onboarding/worksheet retention sequence.

## 8. Auth requirements
- Supabase Auth is the source of identity.
- Email/password and magic-link-ready architecture are acceptable; exact login UX finalized in Prompt 3.
- Auth callback routes must not expose tokens in logs.
- Auth state must be used to protect `/dashboard`, `/downloads`, `/bonus-claim`, and all `/admin/*` routes.
- Middleware must distinguish customer auth from admin authorization.
- Admin authorization requires an `admin_users` table check, not merely a logged-in session.

## 9. Customer dashboard requirements
Dashboard must show:
- Purchase status.
- Launch mode message.
- Download availability and limits.
- Bonus claim status.
- Links to worksheets/resources.
- Support contact.
- Email preference reminder.
- Refund/access revocation state if applicable.

Dashboard must not:
- Show private storage URLs directly in HTML.
- Trust client state for purchases.
- Reveal admin links to regular users.

## 10. Protected download requirements
- Paid files are private in Supabase Storage bucket `curls-deliverables`.
- File references:
  - EPUB source artifact: `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
  - PDF source artifact: `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`.
- Production object paths should use stable private keys, for example:
  - `books/curls-and-contemplation/v8/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
  - `books/curls-and-contemplation/v8/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`
- Signed URLs should expire within 24 hours or less.
- Enforce download policy: default 3 attempts / 7 days unless support extends.
- Record every signed URL request and download event.
- Refunds or chargebacks must revoke entitlement.

## 11. Supabase schema
Prompt 3 migrations must include at least:

| Table | Purpose |
|---|---|
| `profiles` | Supabase Auth profile extension. |
| `products` | Internal product definitions: preorder, regular, Kindle external, paperback placeholder, worksheet placeholders. |
| `prices` | Stripe price IDs and active price tiers. |
| `orders` | Checkout/order records from Stripe. |
| `purchases` | Entitlement records for customers. |
| `download_tokens` | Signed URL issuance and limits. |
| `download_events` | Audit trail of downloads/sign attempts. |
| `bonus_claims` | Bonus claim status and metadata. |
| `subscribers` | Email subscribers and source attribution. |
| `subscriber_events` | Group/automation history. |
| `consent_log` | Cookie/privacy consent snapshots. |
| `webhook_events` | Idempotency ledger for Stripe/MailerLite webhooks. |
| `analytics_events` | Server-side funnel/event mirror. |
| `admin_users` | Admin authorization allowlist. |
| `content_items` | Admin-ready content records for blog/chapter/resource surfaces. |
| `memberships` | Future subscription placeholder only; no v1 live offer. |
| `membership_events` | Future subscription lifecycle placeholder only. |

## 12. Supabase RLS policy summary
- Enable RLS on all customer/data tables.
- Public can insert limited subscriber/free-chapter records through validated server routes or controlled policies.
- Authenticated users can read their own `profiles`, `purchases`, `download_events`, and `bonus_claims` by `auth.uid()` and/or verified email association.
- Users cannot read other customers' orders, purchases, subscriber rows, analytics, or admin rows.
- Service role performs webhook writes and privileged reconciliation only on the server.
- Admin reads require membership in `admin_users`.
- Storage bucket remains private; signed URLs are issued only by server code after entitlement checks.

## 13. Stripe checkout/webhook requirements
Checkout:
- Choose Stripe price server-side; never trust client-submitted price IDs.
- Support preorder `$17.99` and regular `$19.99` one-time prices.
- Include metadata: `book_slug`, `launch_mode`, `price_tier`, `source_page`, `utm_source`, `utm_medium`, `utm_campaign`, `subscriber_id` when known.
- Success URL uses `NEXT_PUBLIC_SITE_URL` and `/thank-you?session_id={CHECKOUT_SESSION_ID}`.
- Cancel URL returns to `/preorder` or `/buy` based on mode.

Webhook:
- Use raw body and `STRIPE_WEBHOOK_SECRET` signature verification.
- Store event ID in `webhook_events` before side effects when safe.
- Handle at minimum:
  - `checkout.session.completed`.
  - `payment_intent.succeeded` if needed for reconciliation.
  - `charge.refunded` / refund-related event.
  - `checkout.session.expired` for abandoned checkout analytics.
- Refund handling revokes entitlement and download access.
- Client-side thank-you page is never purchase proof.

## 14. MailerLite and Resend requirements
MailerLite groups:
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

Resend transactional emails:
- Email confirmation / free chapter delivery.
- Order confirmation.
- Preorder confirmation.
- Launch delivery notice.
- Download access notice.
- Bonus claim status.
- Support receipt.
- Refund/access revocation notice.

No real API keys in repo. `.env.example` later contains variable names only.

## 15. Analytics event plan
Use GA4 consent-aware client events plus server-side `analytics_events` for business-critical events.

Core events:
- `page_view`.
- `cta_click`.
- `email_capture_submit` / `email_capture_success` / `email_capture_error`.
- `free_chapter_request` / `free_chapter_delivered`.
- `checkout_started` / `checkout_completed` / `checkout_expired`.
- `preorder_completed`.
- `purchase_completed`.
- `bonus_claim_started` / `bonus_claim_completed`.
- `signup_completed` / `login_completed`.
- `dashboard_viewed`.
- `download_signed` / `download_failed`.
- `refund_recorded` / `entitlement_revoked`.
- `admin_viewed`.

## 16. Admin surfaces
Admin pages are v1 operational surfaces, not public marketing:
- `/admin`: overview, mode, health, recent events.
- `/admin/orders`: order lookup, refund/access status, Stripe IDs.
- `/admin/subscribers`: list health, MailerLite group status.
- `/admin/claims`: preorder bonus claims and fulfillment status.
- `/admin/content`: blog/chapter/resource content management placeholders.
- `/admin/analytics`: funnel event snapshots.

Admin routes require server-side authorization and should be hidden from normal navigation.

## 17. Legal/trust requirements
Required pages:
- Privacy.
- Terms.
- Refund Policy.
- Preorder Policy.
- Digital Delivery Policy.
- Cookies.
- Accessibility.

Legal copy status:
- Draft outline only until reviewed by qualified human/attorney.
- Must accurately describe preorder timing, digital delivery, refund window, data processors, cookies, consent behavior, accessibility contact, and support path.
- FTC preorder compliance requires truthful timing and prompt refund/cancellation handling if delivery changes.

## 18. Acceptance criteria
Prompt 2 acceptance:
- All v4 planning/spec files exist under `author-site/docs/website-v4/`.
- No `author-site/` is created.
- No EPUB, POD, book, release, archive, or publishing build files are modified.
- No real API keys or live payment activation appears.
- Release artifact names are normalized to v8 artifacts from the audit.
- Pricing is normalized to `$17.99` preorder and `$19.99` regular.

Prompt 3 acceptance preview:
- App scaffolds at `author-site/` only.
- All listed routes compile.
- Protected downloads are server-gated.
- Stripe webhook verifies signatures.
- Supabase RLS migrations are present.
- `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` run from `author-site/` or failures are narrowly documented.
