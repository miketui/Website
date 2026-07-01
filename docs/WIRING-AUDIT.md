# Wiring Audit — Curls & Contemplation

Verified 2026-07-01 by direct inspection of code, live Vercel deployment, live
Supabase project, and live MailerLite account — not from memory or assumption.
Every row below was checked against a real system, not just read from source.

## Forms — every interactive input on the site

| Form / component | Lives on | Posts to | MailerLite | Supabase | Resend email | Status |
|---|---|---|---|---|---|---|
| `NewsletterForm` | Footer (every page) + `/blog/[slug]` | `/api/subscribe` | ✅ `subscribers` group | ✅ `subscribers` + `subscriber_events` | — (no confirmation email exists) | ✅ **Fixed this session** — Supabase write was silently failing (see below) |
| `FreeChapterForm` | `/free-chapter` | `/api/free-chapter` | ✅ `free_chapter` group | ❌ no DB write | ✅ `sendFreeChapter` | ✅ Working. Email content depends on `curls-free` bucket files existing (see Missing Information doc) |
| `PreorderCheckout` | `/buy`, `/preorder` | `/api/checkout` → Stripe Checkout | — (tagged later via webhook) | — (order row created by webhook, not this route) | — | ✅ Working, verified structurally |
| `AuthForm` | `/login`, `/signup` | Supabase `signInWithOtp()` directly (no custom API route) | — | ✅ Supabase Auth | Supabase's own magic-link email (not Resend) | ✅ Working |
| `QuizFlow` | Nowhere yet | `/api/quiz` | — | — | — | 🟡 **Built, not wired.** `/quiz` currently renders a "Coming next" `StagedNotice`, not the real quiz. Intentional per your funnel-staging convention — flip it on when ready |
| `EmailSignup` | Nowhere | `/api/subscribe` (plain HTML form, no JS) | — | — | — | ⚠️ **Dead code.** Defined, never placed on any page. If you ever drop it onto a page, it has no Turnstile token attachment — would bypass bot protection |
| `AnalyticsEvent` | Nowhere | `/api/track` | — | — | — | ⚠️ **Dead code.** Component exists, zero usages anywhere |
| Bonus claim | `/bonus-claim` (unlinked from every other page) | *(page has no form at all — just descriptive text)* | — | — | — | 🟡 **Intentionally scaffolded** — page itself says "requires Michael's approval before launch." `/api/bonus-claim` exists as a real API route but nothing calls it yet |

### Bug found and fixed this session
`/api/subscribe` upserted `{ email, source, updated_at }` into `public.subscribers`,
but that table had no `updated_at` column. Supabase's JS client doesn't throw on
a bad upsert — it returns `{ error }`, which the route never checked — so every
newsletter signup silently failed to write to Supabase while the route still
returned `{ ok: true, database: "recorded" }`. MailerLite always received the
subscriber correctly; only the Supabase copy was lost. Fixed via migration
(`add_updated_at_to_subscribers`) — added the column plus a trigger that keeps
it current automatically. Verified with a real insert/upsert/delete round-trip.

## Stripe → Supabase → Resend → MailerLite (the purchase chain)

1. Customer completes Stripe Checkout → `checkout.session.completed` webhook fires
2. `recordWebhookEvent()` — dedupes by `stripe_event_id` into `webhook_events` ✅
3. `handleCheckoutCompleted()` — upserts `orders`, upserts `purchases` (book + card deck if ordered) ✅
4. `upsertSubscriber(email, "customers")` → MailerLite `Customers` group ✅
5. `sendOrderConfirmation()` + `sendDownloadAccess()` → two separate Resend emails, sent back-to-back ✅ wired, but copy is generic ("check your dashboard") — no direct link in either email. Worth tightening, not broken.
6. Refund: `charge.refunded` → `revokeEntitlementForRefund()` → `purchases.entitlement_status = "revoked"` + MailerLite `Refunded` group + `sendRefundAccessRevoked()` ✅

## MailerLite automations — live status (checked via API, not memory)

| Automation | Enabled? | Steps | Risk |
|---|---|---|---|
| Free Chapter — Welcome (DRAFT) | **No** | 1 | Safe — won't fire until you enable it |
| Abandoned Checkout — +24h Reminder (DRAFT) | **No** | 2 | Safe — won't fire until you enable it |
| Customers — Post-Purchase Onboarding (DRAFT) | **Yes** ⚠️ | 1 | **This one is live right now.** The name still says "(DRAFT)" but `enabled: true` means it WILL fire the moment someone lands in the Customers group — i.e., on your very first real sale. The email step's content can only be authored in the MailerLite visual editor (not via API) — go check what's actually in it before your first sale reaches a real customer, or you risk sending an empty/placeholder email to a paying buyer. |

## Stripe webhook 404s

Checked Vercel runtime logs for `/api/webhooks/stripe` and `/api/stripe/webhook`
over the hour following the production fix deploy: **zero requests, zero 404s.**
That's a good sign but not a full confirmation — webhooks fire on events, not
continuously, and I don't have API access to list your Stripe Dashboard's
webhook endpoint configuration through the available tools. **You still need to
personally check Stripe Dashboard → Developers → Webhooks** and confirm every
destination points at `/api/stripe/webhook` (not the legacy `/api/webhooks/stripe`
path). The alias in code will keep either path working either way, but finding
and fixing the stale destination is the only way to know the root cause is gone,
not just quiet for an hour.

## Supabase — schema review

The database has **two generations of schema living side by side**:

- **Legacy (11 tables, zero code references, zero rows):** `users`, `products`,
  `prices`, `orders_legacy_v1`, `order_items`, `entitlements`, `downloads`,
  `magnet_leads`, `testimonials`, `blog_posts`, `audit_log`. None of these are
  read or written by any current code path — `content/testimonials.ts` and
  `content/blog.ts` (local files) power those pages instead. Safe to drop
  whenever you want to clean up; not urgent, not costing you anything.
- **Live (8 tables, actively used):** `orders`, `purchases`, `webhook_events`,
  `subscriber_events`, `bonus_claims`, `download_events`, `admin_users`,
  `analytics_events` — all confirmed referenced in code, all with RLS enabled.
- RLS shows as "enabled, no policy" on the live tables — that's correct, not a
  bug: every write goes through server-side code using the service-role key,
  which bypasses RLS by design. No anon/client-side access exists to any of
  these tables.
- One low-priority lint: the `citext` extension is installed in the `public`
  schema instead of a dedicated one. Cosmetic, not a real risk, not urgent.
- All 8 live tables currently have 0 rows — expected pre-launch, confirms this
  is a clean slate rather than lost data.

## What this doc doesn't cover

I couldn't verify: Resend domain SPF/DKIM/DMARC status, Turnstile challenge
pass-rate, or whether the `curls-free` / `curls-deliverables` Supabase Storage
buckets actually contain the files the code expects at the exact paths it
requests. See `MISSING-INFORMATION.md` for what's still open.
