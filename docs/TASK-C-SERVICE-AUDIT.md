# Task C — Service & Connector Audit
**Curls & Contemplation — curlscontemplation.beauty**
Audited: 2026-06-30/07-01, live via MCP connectors + direct code review of `miketui/Website` @ `f56b654` (main). Every finding below is either a real API response or a cited file/line — nothing in this document is asserted from memory or training data.

## 🟢 STATUS UPDATE — 2026-07-01, follow-up pass
Everything in this section was fixed live this session, verified, and is sitting on branch `feat/auth-sentry-posthog` awaiting your merge (not yet on `main`).

- **B1 (Supabase paused) — FIXED.** Project restored via `Supabase:restore_project`, confirmed `ACTIVE_HEALTHY`.
- **New, bigger finding than B1 implied — FIXED.** The live database schema predated the app code entirely: `purchases`, `webhook_events`, `subscriber_events`, `bonus_claims`, `download_events`, `admin_users` didn't exist, and the one shared table name (`orders`) had incompatible columns (`stripe_session_id` vs. code's `stripe_checkout_session_id`, etc.). Confirmed with `to_regclass()` returning `null` for all six. Applied migration `app_schema_alignment` — renamed the legacy `orders` to `orders_legacy_v1` (0 rows everywhere, nothing lost) and created the schema the code has always assumed, including `purchases UNIQUE(order_id, book_slug)` — the exact constraint the webhook handler's defensive fallback comment (`"Migration 0002 not applied yet"`) was waiting on. `get_advisors` (security + performance) run clean — INFO-level only, correct for service-role-only tables.
- **B3 (login/signup non-functional) — FIXED.** Real Supabase Auth, passwordless magic-link (one flow for both signup and login). New: `lib/supabase/browser.ts`, `app/auth/callback/route.ts`, rewritten `components/AuthForm.tsx`. Also fixed a second, independent bug found while building this: `getSessionUser()` was using a client with `persistSession: false` — cookie-blind, could never see a real session even with working auth code elsewhere. Now uses a proper `@supabase/ssr` cookie-aware client. `app/dashboard/page.tsx` now queries real purchases; `components/DownloadList.tsx` now actually calls `/api/downloads/sign` instead of raw-POSTing to display JSON on screen; `app/logout/route.ts` now calls real `signOut()`.
- **H3 (Sentry unwired) — FIXED.** New dedicated project `curls-contemplation-website` created (not the generic default). DSN: `https://79379bde875c5981a7150c413b4bc8fa@o4510096051404800.ingest.us.sentry.io/4511657443459072` — paste as `NEXT_PUBLIC_SENTRY_DSN` in Vercel. `instrumentation.ts` + `instrumentation-client.ts` (the correct pattern for Next.js 16 + Turbopack — the older `sentry.client.config.ts` convention does not auto-load under Turbopack), `app/global-error.tsx`, `next.config.ts` wrapped with `withSentryConfig`.
- **H4, PostHog half — FIXED.** Wired via `components/PostHogProvider.tsx`, but strictly gated behind the site's existing consent banner (`cc_analytics_consent` in localStorage) — zero init, zero capture until the visitor actually clicks "Allow analytics." Extracted the consent-reading logic into `lib/consent.ts` so the banner and PostHog share one source of truth instead of duplicating it.
- **H4, GA4 half — still open.** Property age mismatch unresolved, needs your confirmation in the GA4 Admin UI (see original finding below).
- **Real bug found and fixed during this build, unrelated to the ask:** `components/DownloadList.tsx` (client component) was importing from `lib/downloads.ts`, which also contains server-only Supabase signing logic (`next/headers`) — Turbopack correctly refused to build it. Split the client-safe deliverable metadata into `lib/deliverables.ts`.
- **New surface found, not yet audited:** the build revealed a full `/admin` route tree (`/admin`, `/admin/analytics`, `/admin/claims`, `/admin/content`, `/admin/orders`, `/admin/subscribers`) that wasn't part of any prior audit pass. Flagging for a future session — not touched here.
- **Verified:** typecheck 0, lint 0, 66/66 tests, build exit 0 (Next.js 16.2.9, Turbopack).
- **Still open, unchanged:** B2 (Stripe webhook URL), H1 (MailerLite automations), M1 (Resend domain verification), M3 (confirm `ALLOW_DEMO_SESSION` absent from prod), and everything else not listed above.

---

## 🟢 STATUS UPDATE #2 — 2026-07-01, this pass
- **Stripe connector confirmed live, but webhook endpoint management is genuinely not exposed by it.** Verified with 4 search phrasings + a direct operation-ID probe (`PostWebhookEndpoints` → not available), corroborated by Stripe's own docs presenting webhook creation as a Dashboard/Workbench-only action. **B2 remains a manual dashboard fix** — exact steps unchanged, see Blocker B2 below.
- **New real bug found and fixed:** `analytics_events` — declared in code's `tableNames`, actively written by `recordServerEvent()` (called from *every* route in the app), but the table never existed. Every analytics call site-wide has been silently failing. Created, verified with a real insert/delete round-trip.
- **Confirmed via grep:** the other 4 declared-but-missing tables (`profiles`, `download_tokens`, `consent_log`, `gate_ledger`) are genuinely unused — no code queries them. Left uncreated rather than adding speculative schema.
- **`/admin` audited:** all 6 pages correctly call `requireAdmin()` — genuinely gated, not a leak — and that gate now actually *works* for the first time (it depends on this session's `getSessionUser()` fix + the `admin_users` table). But every page body is identical scaffold (`AdminSurface`), zero real data queries. **`admin_users` is empty — nobody, including you, can pass the gate yet.** Needs a row inserted with your real account email, or `ADMIN_EMAILS` set in Vercel.
- **New: autonomous launch-day EPUB send, built.** `app/api/cron/launch-day/route.ts` + `vercel.json` (daily 14:00 UTC). No-ops until `RELEASE_DATE` arrives, then sends the *existing* approved `sendDownloadAccess()` template to every active purchase that hasn't received it — idempotent via a new `launch_email_sent_at` column, safe to run forever. Auth-gated on `CRON_SECRET` (add this to Vercel).
- **MailerLite automations — structure built, all inactive:** Free Chapter welcome, Abandoned Checkout +24h reminder, Customers post-purchase onboarding. All three need real subject lines + HTML body written in the MailerLite visual editor before activating — genuinely cannot be done via API, and the copy is your voice, not mine to invent.
- **Verified:** typecheck 0, lint 0, 70/70 tests, build exit 0.

---

## Verdict
**Not launch-ready.** Two infrastructure items are actively broken in production right now (Supabase paused, Stripe webhook 404ing). Auth/signup is unbuilt. Everything else ranges from "correctly coded, awaiting real credentials" to "dashboard exists, zero code wiring."

## Counts
| Severity | Count |
|---|---|
| 🔴 BLOCKER | 3 |
| 🟠 HIGH | 4 |
| 🟡 MEDIUM | 3 |
| ⚪ LOW / INFO | 2 |

---

## 🔴 BLOCKERS

### B1 — Supabase database is PAUSED, unreachable
- **Verified via:** `Supabase:get_project` → `"status":"INACTIVE"`. Confirmed a second way with `Supabase:list_tables` → `Connection terminated due to connection timeout`. Not a permissions error — a real outage.
- **Impact:** Every write to `subscribers`, `subscriber_events`, `orders`, `purchases`, `webhook_events`, `download_events`, `bonus_claims` is currently failing silently. The app degrades gracefully (`database: "skipped_config_missing"`) so the user sees no error, but **nothing is being recorded**. Entitlement checks (`checkDownloadEntitlement`) will also always fail closed while this is paused — a paying customer cannot get their download.
- **Fix:** Restore the project. Available via `Supabase:restore_project(project_id: "jmfbosczwbfugbjsshwf")`.
- **Action needed from you:** One-word confirmation before I fire this — it changes billing/compute state on your project and I won't do that without an explicit go.
- **After restore:** Re-run `list_tables` to confirm all 15 expected tables exist (`profiles, products, prices, orders, purchases, download_tokens, download_events, bonus_claims, subscribers, subscriber_events, consent_log, webhook_events, analytics_events, gate_ledger, admin_users` — from `lib/supabase/server.ts` `tableNames`), and run `get_advisors` (security + performance) for a real RLS/index audit.

### B2 — Stripe webhook endpoint is misconfigured; every event has 404'd
- **Verified via:** `Vercel:get_runtime_logs` shows repeated live `POST /api/webhooks/stripe` → `404`, dozens of hits at 01:18:32–33 (classic Stripe retry-storm pattern). Confirmed the real route via `find app/api -name route.ts` → the actual handler lives at `app/api/stripe/webhook/route.ts`, serving `/api/stripe/webhook`. No rewrite exists mapping one to the other.
- **Impact:** Whatever is registered in the Stripe Dashboard as the webhook URL is wrong. Every `checkout.session.completed`, `charge.refunded`, and `checkout.session.expired` event has failed delivery. **No order has ever been recorded, no entitlement ever granted, no confirmation email ever sent, no MailerLite "Customers" tag ever applied — even for any real purchase that may have already happened.**
- **The handler itself is well-built** (`app/api/stripe/webhook/route.ts`): correct signature verification via `stripe.webhooks.constructEvent`, idempotent via `webhook_events.provider_event_id` upsert, grants book + card-deck entitlements, moves subscribers between MailerLite groups, triggers Resend emails. It just has never received a real event.
- **Fix (manual — no Stripe connector available this session):**
  1. Stripe Dashboard → Developers → Webhooks.
  2. Find the endpoint pointed at `.../api/webhooks/stripe`. Edit its URL to:
     **`https://curlscontemplation.beauty/api/stripe/webhook`**
  3. Confirm it's listening for: `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`, `checkout.session.expired`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted` (the exact set the handler's `switch` statement checks — anything else is safely ignored).
  4. Copy the endpoint's **signing secret** → set as `STRIPE_WEBHOOK_SECRET` in Vercel → Project → Settings → Environment Variables (Production).
  5. Use Stripe's "Send test webhook" button on `checkout.session.completed` and confirm `HTTP 200` this time, then check Vercel runtime logs for a matching `200` on `/api/stripe/webhook`.
- **If you'd rather I do this via API:** add the Stripe connector in Claude's settings and I can create/patch the webhook endpoint directly next turn instead of you clicking through the dashboard.

### B3 — Login/signup are non-functional; account creation cannot happen
- **Verified via:** full read of `components/AuthForm.tsx` — no `"use client"` directive, no `onSubmit` handler, no `useState`, no call into Supabase Auth at all. Its own copy admits it: *"Supabase Auth wiring scaffold. Configure env keys before production use."* `/login` and `/signup` pages also self-describe as scaffold in their metadata descriptions.
- **What IS real:** `lib/supabase/server.ts` → `getSessionUser()` correctly calls `supabase.auth.getUser()` server-side, and there's a properly-gated demo-session escape hatch (`ALLOW_DEMO_SESSION=1`) explicitly commented as sandbox-only and dangerous in production — **confirm this env var is absent from Vercel production**, it's a real auth-bypass if accidentally set live.
- **What's missing:** the actual submit handler — email/password or magic-link call into `supabase.auth.signUp` / `signInWithOtp` / `signInWithPassword`, loading/error states, redirect on success. `app/dashboard/page.tsx` also never calls `getSessionUser()` or queries `purchases` — even once auth works, the dashboard's "your orders" panel is still static copy, not a real query.
- **Fix:** this is new code, not a config fix. I can build it (Supabase magic-link auth is the standard low-friction pattern for a book-buyer site — no password to remember, one click from the confirmation email) — say the word and I'll implement `AuthForm` + wire `dashboard` to real purchase data in the next turn. Not doing it silently in this pass since it's meaningful new production code, not a config change.

---

## 🟠 HIGH

### H1 — MailerLite: zero automations exist
- **Verified via:** `Mailerlite:list_automations` → *"No automations found in your account."*
- **Impact:** Nothing fires automatically. The webhook handler tags a `checkout.session.expired` customer into "Abandoned Checkout" (`app/api/stripe/webhook/route.ts`, with a code comment: *"one compliant abandoned-checkout reminder is sent from MailerLite (+24h automation, owner-gated)"*) — but that automation doesn't exist, so the tag currently does nothing. Same gap for a welcome sequence on `Website Signups`/free-chapter signup.
- **Fix:** Build at minimum: (1) Free Chapter → welcome + nurture sequence, (2) Abandoned Checkout → +24h reminder, (3) Customers → post-purchase onboarding. I can scaffold these via `Mailerlite:create_automation` once you approve subject lines/copy (FLAG-AND-HOLD applies to any customer-facing copy — I won't invent your voice).

### H2 — MailerLite groups now fully match code, but env vars are unverified
- **Verified via:** cross-referenced `lib/email/mailerlite.ts` `mailerLiteGroups` map against live `Mailerlite:list_resources(group)`. All 11 required groups now exist (2 were missing — **created live this session**, see table below). No tool available to me can read Vercel's actual env var values, so whether `MAILERLITE_GROUP_*` in Vercel points at these correct IDs is unverified.
- **Exact values to paste into Vercel (Production env):**

| Env var | Group name | Group ID |
|---|---|---|
| `MAILERLITE_GROUP_SUBSCRIBERS` | Website Signups *(name differs, functionally correct — code matches by ID not name)* | `182303148544623709` |
| `MAILERLITE_GROUP_FREE_CHAPTER` | Free Chapter | `189927249078650673` |
| `MAILERLITE_GROUP_PREORDERS` | Preorders | `189927254041560661` |
| `MAILERLITE_GROUP_CUSTOMERS` | Customers | `189927259391395798` |
| `MAILERLITE_GROUP_ABANDONED_CHECKOUT` | Abandoned Checkout | `189927264762202014` |
| `MAILERLITE_GROUP_BONUS_CLAIM_STARTED` | Bonus Claim Started | `189927270563972991` |
| `MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED` | Bonus Claim Completed | `189927275564631964` |
| `MAILERLITE_GROUP_REFUNDED` | Refunded | `189927280131180245` |
| `MAILERLITE_GROUP_BLOG_READERS` | Blog Readers | `189927285613135631` |
| `MAILERLITE_GROUP_QUIZ` | Quiz / Blind-Spot **← created this session** | `191751931239073670` |
| `MAILERLITE_GROUP_VIP_EARLY_READERS` | VIP / Early Readers **← created this session** | `191751933392848782` |

- Also verify `MAILERLITE_API_KEY` is set in Vercel — I confirmed the key I'm using via MCP is valid (`get_auth_status` → authenticated), but that's a Claude-connector credential, not proof the *same* key (or any key) is in Vercel's env.

### H3 — Sentry: dashboard exists, zero code instrumentation
- **Verified via:** `Sentry:find_organizations` → org `miketui` exists. `Sentry:find_projects` → only a single default-named `miketui` project, nothing site-specific. `grep` of `package.json` → **no `@sentry/nextjs` or any Sentry package.**
- **Impact:** No error is ever reported to Sentry. If checkout, webhook processing, or downloads break in production, you find out from a user complaint, not from Sentry.
- **Fix:** requires real code — install `@sentry/nextjs`, add `sentry.client.config.ts` / `sentry.server.config.ts` / `sentry.edge.config.ts`, wrap `next.config` with `withSentryConfig`, create a dedicated Sentry project (not the generic default), set `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` in Vercel. I can build this — flagging rather than doing it silently since it touches the build config.

### H4 — GA4 property may be orphaned; PostHog completely unwired
- **GA4 verified via:** `ga4:get_property_details` on `properties/448841433` ("Curls & Contempt") → `create_time: 2024-07-03` — nearly two years before this codebase (Supabase project created 2026-05-23). `ga4:run_realtime_report` → zero active users (inconclusive alone, but combined with the age mismatch, worth confirming this property's Measurement ID is actually what's in `NEXT_PUBLIC_GA4_MEASUREMENT_ID`).
- **PostHog verified via:** `PostHog:exec projects-get` → one "Default project" exists, **`ingested_event: false`** (literally zero events ever received). `grep` of `package.json` → no `posthog-js` dependency.
- **Fix:** For GA4 — confirm in the GA4 Admin UI that `properties/448841433`'s Data Stream Measurement ID matches what's set as `NEXT_PUBLIC_GA4_MEASUREMENT_ID` in Vercel; if not, either repoint the env var or create a fresh, purpose-built property. For PostHog — same situation as Sentry: needs the SDK installed and a provider wired in `app/layout.tsx`, or drop it entirely from the env schema if you don't intend to use it (it's optional in `lib/env.ts`, so leaving it unconfigured is a valid choice, not a bug).

---

## 🟡 MEDIUM

### M1 — Resend: correctly coded, live status unverifiable this session
- **Verified via:** full read of `lib/email/resend.ts` — clean, correct `fetch`-based integration against `https://api.resend.com/emails`, properly gated behind `getResendConfig()`, six real transactional templates (order confirmation, download access, free chapter, bonus claim, refund, support receipt).
- **Gap:** I don't have a Resend connector this session, so I cannot confirm `RESEND_API_KEY` is set in Vercel, that `RESEND_FROM_EMAIL`'s domain is verified in Resend, or that SPF/DKIM/DMARC records are published on your DNS.
- **Action needed from you:** in the Resend dashboard, confirm the sending domain shows "Verified" (green), and paste me the domain's SPF/DKIM/DMARC record values if you want me to advise on DNS — I have no DNS/zone tool available to check this directly (my Cloudflare access is Workers/D1/KV/R2 only, not DNS).

### M2 — Stripe purchases-table migration status unknown
- **Verified via:** code comment in `handleCheckoutCompleted` (`app/api/stripe/webhook/route.ts`): *"Migration 0002 not applied yet: fall back to the legacy unique(order_id) key..."* — the code itself is defensive about this, but I can't confirm which state your database is actually in while Supabase is paused (B1).
- **Fix:** once Supabase is restored, run `Supabase:list_migrations` to confirm `0002_order_bump.sql` (or equivalent) has been applied — this is what allows a customer to hold *both* the book and the card-deck entitlement on one order without a constraint collision.

### M3 — `ALLOW_DEMO_SESSION` must be confirmed absent from production
- **Verified via:** `lib/supabase/server.ts` code comment explicitly warns this flag is *"unsigned and spoofable"* and must never be set in production.
- **Action needed from you:** confirm this env var does not exist in Vercel Production (only acceptable in local/dev).

---

## ⚪ LOW / INFO

### L1 — Card deck & worksheets products are fully scaffolded, awaiting real Stripe Price IDs
`lib/stripe.ts` → `resolveCardDeckPriceId()` reads `STRIPE_PRICE_ID_CARD_DECK`; `app/api/checkout/route.ts` → `product: "worksheets"` reads `STRIPE_PRICE_ID_WORKSHEETS`. Both are `.optional()` in the Zod schema — the checkout route correctly refuses the add-on (`card_deck_unavailable`, 503) rather than silently dropping it if the price ID is missing. **This is exactly the infrastructure for the "digital card deck to sell" you asked about — it needs a real Stripe Price object created and its ID pasted into Vercel, nothing else.**

### L2 — Connector coverage summary
| Service | Connector live this session? | Code wired? | Live/working? |
|---|---|---|---|
| MailerLite | ✅ | ✅ | ✅ (auth valid, 11/11 groups, 0 automations) |
| Supabase | ✅ | ✅ | 🔴 paused |
| Sentry | ✅ | ❌ | ❌ no events ever sent |
| GA4 | ✅ | ✅ (schema) | ⚠️ property possibly orphaned |
| PostHog | ✅ | ❌ | ❌ 0 events ingested |
| Vercel | ✅ | — | ✅ |
| Stripe | ❌ not connected this session | ✅ (webhook handler + checkout well-built) | 🔴 webhook URL wrong |
| Resend | ❌ not connected this session | ✅ | ⚠️ unverified live |
| Cloudflare | ✅ (Workers/D1/KV/R2 only — no DNS tool) | — | n/a for DNS/email-auth needs |
