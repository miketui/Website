# Commerce Runbook — curlscontemplation.beauty

**Audience:** the human operator (Michael / owner). **Author:** Phase 5 (code-side).
**Generated:** 2026-07-09. Release date of record: **2026-11-24** (`content/site.ts:24`,
`RELEASE_DATE`, default `2026-11-24`).

> ### [GATE] — READ BEFORE POINTING REAL TRAFFIC AT EITHER FUNNEL
> **Do not point real traffic at the checkout or the free-chapter funnel until BOTH are true:**
> 1. The gated **$1 live-test** has completed and the resulting row is confirmed in Supabase
>    (`orders` + `purchases`), and
> 2. The MailerLite nurture sequence has been reviewed — specifically the **live
>    "Customers — Post-Purchase Onboarding (DRAFT)"** automation (`docs/WIRING-AUDIT.md:45`),
>    which is `enabled: true` and **will fire on the first real sale**. Approve or pause it
>    *before* the $1 test lands a customer in the `customers` group.
>
> Every credential/dashboard action below is **human-gated**. Nothing in this runbook was
> executed by the agent: no live keys were read or rotated, no live charges were run, and no
> MailerLite groups/automations were modified.

---

## 1. The 502 fix procedure (checkout)

**Root cause class (from `docs/current-state.md` §3):** a 502 from `POST /api/checkout` means
`stripe.checkout.sessions.create()` **threw** — i.e. the Stripe SDK was constructed (so the
secret key is *present*) but the live API rejected the call. Missing env would instead return
**503 `config_missing`**, not 502. So a prod 502 = a *populated-but-wrong* Stripe value in Vercel.

**What changed in code (this phase):** the previously bare `catch {}` at
`app/api/checkout/route.ts` now logs a structured `console.error` with the Stripe error
`type` / `code` / `statusCode` / `message` (no secrets, no PII) and forwards the exception to
Sentry (guarded). The client still receives the same `502 { code: "stripe_error" }`. This makes
the exact failure visible in Vercel runtime logs and Sentry.

### Diagnose (read logs)
1. **Vercel → Project → Logs (Runtime)** — filter to `/api/checkout`. Look for
   `[checkout] stripe.checkout.sessions.create failed` and read the logged `type`/`code`.
2. **Stripe Dashboard → Developers → Logs** — find the failed API request at the same
   timestamp; the response body names the exact error.

### Interpret and fix
| Stripe error `type` / `code` | Meaning | Fix |
|---|---|---|
| `authentication_error` (HTTP 401) | `STRIPE_SECRET_KEY` present but stale/invalid/wrong-mode | Set the correct **live** `STRIPE_SECRET_KEY` in Vercel (Production). |
| `resource_missing` (e.g. "No such price") | A price ID doesn't exist / belongs to another account or to test mode | Fix `STRIPE_PRICE_ID_PREORDER` and/or `STRIPE_PRICE_ID_REGULAR` (and `STRIPE_PRICE_ID_CARD_DECK` if the deck bump is on) to live-mode price IDs from the same account as the secret key. |

### Apply
- Set the corrected value(s) in **Vercel → Settings → Environment Variables (Production)**.
- **REDEPLOY.** Env var changes do **not** take effect until a new deployment — a save alone
  will not fix the 502.
- Re-run the checkout and confirm a `303`/JSON `{ ok: true, url }` and no `[checkout] … failed`
  log line.

### Four-credential rotation gate
Stripe touches **four** correlated secrets that must stay mutually consistent (same account,
same live/test mode): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PREORDER`,
`STRIPE_PRICE_ID_REGULAR` (+ optional `STRIPE_PRICE_ID_CARD_DECK`). If you rotate the secret key,
re-verify the webhook signing secret and that the price IDs belong to the same account/mode.
Rotating one without the others reintroduces the 502 (or breaks fulfillment). This rotation is
**human-gated** — the agent must not touch these values.

---

## 2. The $1 live-test procedure

**Goal:** prove the full purchase chain (Checkout → webhook → Supabase → Resend → MailerLite)
end-to-end with a real, refundable charge, before opening the funnel.

1. **Pre-flight:** confirm §1 shows a clean checkout (no 502). Confirm the Stripe webhook
   endpoint in **Stripe → Developers → Webhooks** points at `https://<domain>/api/stripe/webhook`
   (the `/api/webhooks/stripe` alias also works) and is subscribed to at least
   `checkout.session.completed` and `charge.refunded`.
2. **Approve or pause** the live "Customers — Post-Purchase Onboarding (DRAFT)" automation first
   (see [GATE]) — otherwise this test emails a real customer whatever is currently in that step.
3. **Create a temporary $1 price** in Stripe (live mode) and point `STRIPE_PRICE_ID_PREORDER` at
   it (redeploy), OR run the test against the real price and refund it after. A dedicated $1
   price is cleaner and avoids charging yourself $17.99.
4. **Complete a real checkout** at `/preorder` (or `/buy` post-launch) with your own email.
5. **Confirm the row landed** in Supabase (SQL editor). Table names are from
   `app/api/stripe/webhook/route.ts` (`handleCheckoutCompleted`):

   ```sql
   -- Order created by the webhook (status should be 'paid'):
   select id, email, status, amount_cents, currency, stripe_checkout_session_id,
          stripe_payment_intent_id, created_at
   from orders
   order by created_at desc
   limit 5;

   -- Entitlement granted (book_slug 'curls-and-contemplation', and
   -- 'affirmation-deck' too if the card-deck bump was selected):
   select p.order_id, p.email, p.book_slug, p.status, p.entitlement_status
   from purchases p
   join orders o on o.id = p.order_id
   order by p.order_id desc
   limit 5;

   -- Idempotency record (dedupes replays):
   select provider_event_id, event_type, processed_at
   from webhook_events
   order by processed_at desc
   limit 5;
   ```
   Expect: one `orders` row `status='paid'`, one `purchases` row
   `status='active' / entitlement_status='active'`, one `webhook_events` row for
   `checkout.session.completed`.
6. **Confirm side effects:** two Resend emails (order confirmation + download access) arrived,
   and your email landed in the MailerLite `customers` group.
7. **Refund** the charge in Stripe → confirm `charge.refunded` fires and the `purchases` row
   flips to `status='refunded' / entitlement_status='revoked'` (webhook
   `revokeEntitlementForRefund`), and the email lands in the MailerLite `refunded` group.
8. **Revert** the temporary $1 price change (restore the real `STRIPE_PRICE_ID_PREORDER`,
   redeploy).

---

## 3. Pre-order model decision — charge-now vs authorize-later

**RECOMMENDATION: charge-now (immediate capture).**

**One-line justification:** the product is a *digital* good with no inventory or per-unit
fulfillment cost and a release ~4 months out; Stripe Checkout already runs `mode: "payment"`
(immediate capture, `app/api/checkout/route.ts`), whereas authorize-later (manual capture)
auth holds **expire in ~7 days** and cannot survive months to 2026-11-24 — so authorize-later is
not even mechanically viable for this timeline.

**FTC compliance note (charge-now digital preorder):** because the buyer is charged now for a
good delivered later, you must clearly disclose (a) the **release/delivery date** (2026-11-24)
and (b) the **refund terms**. The preorder page and policy already do this
(`app/preorder-policy/page.tsx`, and the price/delivery copy surfaced via
`config/launchState.ts` → `deliveryCopy` "Delivered to your inbox on release day"). Keep that
disclosure visible on the checkout entry page; do not remove it.

---

## 4. MailerLite countdown nurture sequence (release 2026-11-24)

**Group mapping** — the env-var names are defined in `lib/env.ts` (`getMailerLiteConfig`,
`lib/env.ts:142`); the internal keys are what the code passes to `upsertSubscriber(email, key)`:

| Code key | Env var | Populated by |
|---|---|---|
| `preorders` | `MAILERLITE_GROUP_PREORDERS` | preorder buyers (owner may tag from `customers`) |
| `customers` | `MAILERLITE_GROUP_CUSTOMERS` | webhook on `checkout.session.completed` (`webhook/route.ts:51`) |
| `subscribers` | `MAILERLITE_GROUP_SUBSCRIBERS` | newsletter (`/api/subscribe`) |
| `free_chapter` | `MAILERLITE_GROUP_FREE_CHAPTER` | free-chapter funnel (`/api/free-chapter:20`) |
| `abandoned_checkout` | `MAILERLITE_GROUP_ABANDONED_CHECKOUT` | webhook on `checkout.session.expired` (`webhook/route.ts:111`) |
| `refunded` | `MAILERLITE_GROUP_REFUNDED` | webhook on `charge.refunded` (`webhook/route.ts:69`) |
| `quiz` | `MAILERLITE_GROUP_QUIZ` | quiz funnel (`/api/quiz`) |
| `vip_early_readers` | `MAILERLITE_GROUP_VIP_EARLY_READERS` | owner-managed |
| `blog_readers` | `MAILERLITE_GROUP_BLOG_READERS` | owner-managed |
| `bonus_claim_started` / `bonus_claim_completed` | `MAILERLITE_GROUP_BONUS_CLAIM_*` | inert (bonus funnel gated off) |

**Countdown campaign** — target the **`preorders`** group (buyers awaiting delivery) with the
launch-morning send also going to `customers`. Offsets are relative to **2026-11-24**. These are
drafts for the operator to schedule in MailerLite; wording assumes charge-now (already paid).

| Offset | Send date | Suggested subject line |
|---|---|---|
| T-30 | 2026-10-25 | "One month out: your copy of *Curls & Contemplation* is reserved" |
| T-14 | 2026-11-10 | "Two weeks. Here's exactly what lands in your inbox on the 24th" |
| T-7 | 2026-11-17 | "One week to the journey — a first look inside" |
| T-3 | 2026-11-21 | "Three days. The map is almost in your hands" |
| T-1 | 2026-11-23 | "Tomorrow morning: watch your inbox" |
| Launch AM | 2026-11-24 | "It's here — open *Curls & Contemplation* now" (also send to `customers`) |

> **[GATE] MailerLite automation warning:** before the $1 test or any real preorder,
> review/approve or pause **"Customers — Post-Purchase Onboarding (DRAFT)"** — it is **live**
> (`enabled: true`) and fires on the first landing in `customers` (`docs/WIRING-AUDIT.md:45`).
> Its email body can only be authored in the MailerLite visual editor; confirm its contents so a
> paying buyer never receives an empty/placeholder email.

---

## 5. Free-chapter funnel (lead → tripwire)

Flow, with code paths (all already wired — `docs/current-state.md` §2):

1. **Opt-in:** `FreeChapterForm` on `/free-chapter` → `POST /api/free-chapter`
   (`app/api/free-chapter/route.ts:13`), Turnstile-gated (`:17`).
2. **Supabase:** one row per claim into `magnet_leads`
   (`email`, `magnet_slug='free-chapter'`, `delivered_at`) — `free-chapter/route.ts:30`.
3. **MailerLite:** `upsertSubscriber(email, "free_chapter")` → `MAILERLITE_GROUP_FREE_CHAPTER`
   (`free-chapter/route.ts:20`).
4. **Deliver the chapter:** Resend `sendFreeChapter` (`free-chapter/route.ts:22`), which links
   the Chapter 1 PDF + Pricing Confidence Checklist from the `curls-free` Storage bucket
   (`lib/free-assets.ts:1`). If the bucket links aren't configured the email degrades to
   `email_not_configured_no_public_link` (still captures the lead).
5. **Tripwire offer:** the user lands on `/thank-you`, which presents the **$17.99 preorder**
   CTA and the Blind-Spot Quiz (`app/thank-you/page.tsx`). (This phase also added a tasteful,
   reduced-motion-safe gold "burst" — asset I — on that confirmed state.)

**Pre-launch dependency:** confirm the `curls-free` bucket actually contains the expected PDFs at
the paths the code requests (open item in `docs/MISSING-INFORMATION.md`), else the delivery email
has no working links.

---

## 6. Quick reference — readiness probe

`GET /api/health` now returns real, secret-free booleans:
`paymentsLive` = `getStripeConfig().ok` (Stripe keys+prices present),
`subscriptionsLive` = `getMailerLiteConfig().ok` (MailerLite key present). Use it as a
post-deploy smoke check that env is wired — but it only checks *presence*, not *correctness*
(a wrong-but-present key still reads `true`; only the $1 test proves correctness).
