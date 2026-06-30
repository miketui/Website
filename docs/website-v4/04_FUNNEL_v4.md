<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 04_FUNNEL_v4 — Preorder, Purchase, Retention, and Email Map

## 1. Primary preorder funnel
**Traffic → Preorder landing page → Email capture → Checkout/preorder → Bonus confirmation → Launch email sequence.**

| Stage | Page/API | MailerLite group | GA4 event | Database record | Success branch | Failure branch |
|---|---|---|---|---|---|---|
| Traffic arrives | `/`, `/preorder` | none | `page_view` | `analytics_events` | Continue to recognition/CTA. | Bounce recorded by analytics only if consent allows. |
| Email capture | `/api/subscribe` | Subscribers, Preorders if intent set | `email_capture_submit`, `email_capture_success` | `subscribers`, `subscriber_events`, `consent_log` | Show checkout CTA and send nurture. | Show inline error; record `email_capture_error`. |
| Checkout start | `/api/checkout` | Preorders | `checkout_started` | `orders` pending, `analytics_events` | Redirect to Stripe. | Preserve email; show support/contact. |
| Payment confirmed | `/api/stripe/webhook` | Preorders, Customers when paid | `preorder_completed` | `webhook_events`, `orders`, `purchases` | Resend confirmation; `/thank-you`. | Webhook retry/idempotency; support alert if unresolved. |
| Bonus confirmation | `/bonus-claim`, `/api/bonus-claim` | Bonus Claim Started/Completed | `bonus_claim_started`, `bonus_claim_completed` | `bonus_claims` | Show dashboard next step. | Save partial and send support path. |
| Launch sequence | MailerLite automation | Preorders | `launch_email_sent` via server/import if mirrored | `subscriber_events` | Convert to download at launch. | Suppress bounced/unsubscribed users. |

## 2. Post-launch funnel
**Traffic/blog → Buy page → Stripe Checkout → Account/dashboard → Secure download → Worksheets/resources → Retention.**

| Stage | Page/API | MailerLite group | GA4 event | Database record | Success branch | Failure branch |
|---|---|---|---|---|---|---|
| SEO/blog visit | `/blog`, `/blog/[slug]` | Blog Readers on signup | `page_view`, `blog_read` | `analytics_events` | CTA to `/buy` or `/free-chapter`. | Offer free chapter instead of purchase. |
| Buy page | `/buy` | none | `buy_page_viewed`, `cta_click` | `analytics_events` | Start checkout. | Route to FAQ/contact. |
| Checkout | `/api/checkout` | Customers on completion | `checkout_started` | `orders` pending | Stripe hosted checkout. | Abandoned checkout branch. |
| Webhook purchase | `/api/stripe/webhook` | Customers | `purchase_completed` | `orders`, `purchases`, `webhook_events` | Confirm and invite login. | Retry webhook; reconcile from Stripe. |
| Account | `/signup`, `/login`, `/dashboard` | Customers | `signup_completed`, `dashboard_viewed` | `profiles` | Download CTA. | Magic-link/support fallback. |
| Download | `/downloads`, `/api/downloads/sign` | Customers | `download_signed`, `download_failed` | `download_tokens`, `download_events` | Signed URL from private Storage. | If no entitlement, show support/order lookup. |
| Retention | `/resources`, `/worksheets` | Customers, Worksheet Engagement | `resource_opened`, `worksheet_opened` | `analytics_events` | Continue learning loop. | Suggest free chapter or support. |

## 3. Customer retention loop
1. Order confirmation.
2. Dashboard onboarding.
3. Download completion.
4. Worksheet/resource nudge.
5. Chapter pathway re-engagement.
6. Support check-in.
7. Review/referral request only after enough usage time.
8. Future offer waitlist, not a live subscription.

## 4. Free chapter branch
| Step | Action | Group | Event | DB | Success | Failure |
|---|---|---|---|---|---|---|
| Request | Visitor submits email on `/free-chapter`. | Free Chapter, Subscribers | `free_chapter_request` | `subscribers` | Send sample via Resend or MailerLite. | Inline error and retry. |
| Delivery | Transactional email sends. | Free Chapter | `free_chapter_delivered` | `subscriber_events` | CTA to preorder/buy. | Log resend failure; support fallback. |
| Nurture | 3-email bridge to book. | Free Chapter | `free_chapter_nurture_step` | `subscriber_events` | Segment by clicks. | Suppress unsubscribes. |

## 5. Abandoned checkout branch
Trigger sources:
- Stripe `checkout.session.expired` webhook.
- Server-created pending order not completed after configured delay.

Flow:
1. Record `checkout_expired`.
2. Add/update MailerLite `Abandoned Checkout` group when consent allows.
3. Send helpful recovery email; no fake urgency.
4. If user completes purchase, remove or suppress abandoned branch.

## 6. Bonus claim branch
- Started: user visits/submits partial bonus claim.
- Completed: user submits required info and matching purchase/preorder found.
- Manual review: mismatched email/order or suspicious activity.
- Failure: no entitlement; show support and order lookup instructions.

## 7. Dashboard re-engagement loop
- `dashboard_viewed` → if no download, prompt secure download.
- `download_signed` → after 3 days, suggest worksheets.
- `worksheet_opened` → suggest chapter pathway.
- `support_contacted` → suppress promotional emails until resolved when needed.

## 8. MailerLite group per stage
| Group | Entry condition | Exit/suppression condition |
|---|---|---|
| Subscribers | Any opted-in capture. | Unsubscribe/delete request. |
| Free Chapter | Free chapter request. | Customer segment supersedes but keep history. |
| Preorders | Paid preorder or preorder-intent capture. | Launch conversion complete or refund. |
| Customers | Successful paid order. | Refund group if refunded; retain customer history. |
| Abandoned Checkout | Expired checkout with consent. | Purchase completed. |
| Bonus Claim Started | Claim started. | Claim completed or rejected. |
| Bonus Claim Completed | Claim completed. | none. |
| Refunded | Refund/chargeback. | Manual reinstatement only. |
| VIP / Early Readers | Manual approved segment only. | Manual. |
| Blog Readers | Blog signup or repeated content engagement. | Customer segment supersedes. |

## 9. GA4 event per stage
- Awareness: `page_view`, `scroll_depth`, `blog_read`.
- Recognition: `home_recognition_viewed`.
- Relief: `home_relief_viewed`.
- Authority/path: `home_authority_path_viewed`.
- Capture: `email_capture_submit`, `email_capture_success`, `email_capture_error`.
- Commerce: `checkout_started`, `preorder_completed`, `purchase_completed`, `checkout_expired`.
- Customer: `signup_completed`, `login_completed`, `dashboard_viewed`, `download_signed`.
- Retention: `worksheet_opened`, `resource_opened`, `bonus_claim_completed`.
- Trust/security: `consent_updated`, `refund_recorded`, `entitlement_revoked`.

## 10. Database record per stage
- `analytics_events`: every server-critical funnel event.
- `subscribers`: capture identity and source.
- `subscriber_events`: group/automation state.
- `consent_log`: cookie/email consent snapshots.
- `orders`: checkout lifecycle.
- `webhook_events`: Stripe/MailerLite idempotency.
- `purchases`: entitlements.
- `download_tokens` and `download_events`: secure fulfillment.
- `bonus_claims`: preorder/bonus claims.

## 11. Ten-email sequence map
No fake urgency or fake scarcity. Timing is relative and should be adjusted to launch date.

| # | Sequence email | Audience | Purpose | Primary CTA |
|---:|---|---|---|---|
| 1 | Welcome: You are not behind | New subscriber/free chapter | Recognition and relief. | Read free chapter / preorder. |
| 2 | The craft vs. the business | Subscriber/preorder intent | Name the gap. | View book path. |
| 3 | A calmer pricing conversation | Subscriber | Practical value. | Preorder/buy. |
| 4 | What the book helps organize | Subscriber | Authority/path. | See chapters. |
| 5 | Preorder confirmation | Paid preorder | Trust and receipt. | Claim bonus / dashboard. |
| 6 | Bonus claim reminder | Paid preorder not completed | Helpful follow-up. | Complete bonus claim. |
| 7 | Launch-day delivery | Preorders | Download/account instructions. | Login/download. |
| 8 | First worksheet nudge | Customers | Retention. | Open worksheets. |
| 9 | Chapter pathway check-in | Customers | Re-engagement. | Continue chapter path. |
| 10 | Review/referral request | Customers after usage window | Ask honestly, no pressure. | Reply/share/review when real. |
