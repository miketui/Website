# Current State Report — curlscontemplation.beauty

**Phase 1 (INVESTIGATE) — read-only.** Generated 2026-07-09. Every claim below is
backed by a `file:line` citation or command output. Nothing was modified; the build
was not run.

Repo: Next.js App Router + Supabase + Stripe + MailerLite + Resend + Sentry + PostHog.
Design system "ACISS", palette `#111111 / #B08D57 / #D8D1C5 / #145B4B / #C7D9D2`.

---

## 1. Repo topology — every route under `app/`

### Pages (`page.tsx`)

| Route | File | One-line purpose | Class |
|---|---|---|---|
| `/` | `app/page.tsx:1` | Homepage — hero "Your hands know the work…" | shippable |
| `/about` | `app/about/page.tsx:1` | Author/about page (canonical, indexed); uses `MouseScrubVideo` `app/about/page.tsx:25` | shippable |
| `/author` | `app/author/page.tsx:11` | `permanentRedirect("/about")` — PRD sitemap alias | shippable (alias) |
| `/accessibility` | `app/accessibility/page.tsx:1` | Accessibility statement | shippable |
| `/blog` | `app/blog/page.tsx:1` | Blog index (content from local files) | shippable |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx:1` | Blog post; hosts `NewsletterForm` | shippable |
| `/book` | `app/book/page.tsx:24` | Book landing; `ScrollScrubVideo` + JSON-LD | shippable |
| `/bonus-claim` | `app/bonus-claim/page.tsx:1` | Descriptive bonus-claim page — **no form present** (grep for `form`/`fetch`/`BonusClaimForm` = 0 hits) | shippable but inert (see §2) |
| `/buy` | `app/buy/page.tsx:1` | Post-launch checkout page; hosts `PreorderCheckout` | shippable |
| `/preorder` | `app/preorder/page.tsx:1` | Preorder checkout page; hosts `PreorderCheckout` | shippable |
| `/order` | `app/order/page.tsx:14` | Stable conversion terminus; redirects to `/preorder` or `/buy` by launch state | shippable (alias) |
| `/challenge` | `app/challenge/page.tsx:1` | 5-day email challenge; `NewsletterForm source="challenge"` `app/challenge/page.tsx:29` | shippable |
| `/chapter/[slug]` | `app/chapter/[slug]/page.tsx:1` | Single chapter preview | shippable |
| `/chapters` | `app/chapters/page.tsx:1` | Chapter list | shippable |
| `/contact` | `app/contact/page.tsx:1` | Contact page; hosts `ContactForm` | shippable |
| `/cookies` `/privacy` `/terms` `/refund-policy` `/preorder-policy` `/digital-delivery-policy` | resp. `app/cookies/page.tsx:1` … | Legal pages (content from `content/legal-outlines.ts`) | shippable |
| `/dashboard` | `app/dashboard/page.tsx:1` | Signed-in buyer dashboard (download access) | shippable |
| `/downloads` | `app/downloads/page.tsx:1` | Downloads page; hosts `DownloadList` | shippable |
| `/free-chapter` | `app/free-chapter/page.tsx:1` | Lead magnet; hosts `FreeChapterForm` | shippable |
| `/faq` | `app/faq/page.tsx:1` | FAQ | shippable |
| `/journey` | `app/journey/page.tsx:1` | Cinematic scroll experience (`CinematicJourney`); own route to protect homepage LCP | shippable |
| `/login` `/signup` | `app/login/page.tsx:1`, `app/signup/page.tsx:1` | Supabase OTP auth (`AuthForm`) | shippable |
| `/media-kit` | `app/media-kit/page.tsx:1` | Press/media kit | shippable |
| `/quiz` | `app/quiz/page.tsx:27` | Funnel 2 Blind-Spot Quiz — renders live `QuizFlow` | shippable |
| `/quiz/results/[archetype]` | `app/quiz/results/[archetype]/page.tsx:1` | Personalized archetype result (noindex per §comment) | shippable |
| `/resources` | `app/resources/page.tsx:1` | Resources index | shippable |
| `/thank-you` | `app/thank-you/page.tsx:1` | Post-conversion thank-you | shippable |
| `/worksheets` | `app/worksheets/page.tsx:1` | Worksheets index | shippable |
| `/admin` (+ `/analytics` `/claims` `/content` `/orders` `/subscribers`) | `app/admin/page.tsx:1` … `app/admin/subscribers/page.tsx:1` | Admin console pages (email-allowlist gated via `isAdminUser` `lib/supabase/server.ts:76`) | shippable (internal) |

### API / route handlers (`route.ts`)

| Route | File | Purpose | Class |
|---|---|---|---|
| `POST /api/checkout` | `app/api/checkout/route.ts:18` | Creates Stripe Checkout session | shippable (see §3) |
| `POST /api/stripe/webhook` | `app/api/stripe/webhook/route.ts:76` | **Canonical** Stripe webhook (sig-verified) | shippable |
| `POST /api/webhooks/stripe` | `app/api/webhooks/stripe/route.ts:14` | **Shim alias** — `export { POST } from "../../stripe/webhook/route"` for a legacy destination | compat shim (keep, not noise) |
| `POST /api/subscribe` | `app/api/subscribe/route.ts:22` | Newsletter signup → MailerLite + Supabase + Resend welcome | shippable |
| `POST /api/free-chapter` | `app/api/free-chapter/route.ts:13` | Free-chapter lead magnet | shippable |
| `POST /api/quiz` | `app/api/quiz/route.ts:16` | Quiz capture → MailerLite quiz group | shippable |
| `POST /api/bonus-claim` | `app/api/bonus-claim/route.ts:12` | Bonus-claim capture (no UI caller yet) | shippable API, no caller |
| `POST /api/contact` | `app/api/contact/route.ts:36` | Contact form → Resend to support inbox | shippable |
| `POST /api/downloads/sign` | `app/api/downloads/sign/route.ts:10` | Signed download URL, auth + rate-limit gated | shippable |
| `POST /api/track` | `app/api/track/route.ts:17` | Consent-gated client analytics ingest | shippable |
| `GET /api/health` | `app/api/health/route.ts:2` | Health check — reports live config-derived `paymentsLive`/`subscriptionsLive` (updated in Phase 5; was previously hardcoded `false`) | shippable |
| `GET/POST /api/cron/launch-day` | `app/api/cron/launch-day/route.ts:1` | Vercel cron launch-day fulfillment (kill-switch gated) | shippable |
| `/api/cron/launch-day/dry-run` | `app/api/cron/launch-day/dry-run/route.ts` | Dry-run harness for the above | shippable |
| `/api/cron/pre-launch-check` | `app/api/cron/pre-launch-check/route.ts` | Pre-launch readiness cron (scheduled `30 15 16 11 *`, `vercel.json`) | shippable |
| `GET /api/auth/callback` | `app/auth/callback/route.ts` | Supabase auth callback | shippable |
| `GET /api/logout` | `app/logout/route.ts` | Sign-out | shippable |

Cron schedule confirmed in `vercel.json` (2 crons: `/api/cron/launch-day` hourly, `/api/cron/pre-launch-check` once).

**Noise/legacy verdict:** No orphan "noise" route files found. `/api/webhooks/stripe` is an
intentional compat shim (`app/api/webhooks/stripe/route.ts:1-14`), and `/author` + `/order` are
intentional redirect aliases (`app/author/page.tsx:11`, `app/order/page.tsx:14`). The prior
audit's dead components (`EmailSignup`, `AnalyticsEvent`) are already deleted per
`docs/WIRING-AUDIT.md:18`.

---

## 2. Data flow & integrations

Config resolution is centralized in `lib/env.ts` — every integration returns a
`RuntimeConfigResult` and **degrades gracefully when env is absent** (`ok:false` → skip,
never throw). Definitions: `lib/env.ts:93` (Stripe), `:121/:127` (Supabase), `:142` (MailerLite),
`:165` (Resend).

| Integration | Where used (cite) |
|---|---|
| **Supabase** | `lib/supabase/server.ts:28` (`createServerSupabaseClient`), `:41` (session client), `lib/supabase/browser.ts`, `lib/supabase/client.ts`; consumed by `app/api/subscribe/route.ts:49`, `app/api/stripe/webhook/route.ts:12`, `lib/events/server-analytics.ts:22` |
| **Stripe** | `lib/stripe.ts:7` (`getStripe`), `:13` (`getStripeForWebhook`); consumed by `app/api/checkout/route.ts:28`, `app/api/stripe/webhook/route.ts:82` |
| **MailerLite** | `lib/email/mailerlite.ts:34` (`upsertSubscriber`, POST to `connect.mailerlite.com` `:41`); consumed by subscribe/free-chapter/quiz/bonus-claim + webhook |
| **Resend** | `lib/email/resend.ts:8` (`sendTransactionalEmail`, POST to `api.resend.com/emails` `:13`); templates `:36-98` |
| **Turnstile** | `lib/turnstile.ts:11` (`verifyTurnstileToken`, POST to `challenges.cloudflare.com` `:20`); consumed by every public form route |
| **Sentry** | `instrumentation.ts:1` (server/edge init `:8-11`, guarded by DSN `:5`), `instrumentation-client.ts:5` (browser init, guarded `:5`), `onRequestError` `instrumentation.ts:15` |
| **PostHog** | `components/PostHogProvider.tsx:5,29` (`posthog.init`, consent-gated `:27`), mounted in `app/layout.tsx:47`; keys via `lib/env.ts:175-176` |
| **GA4 / SpeedInsights** | `components/GoogleAnalytics.tsx:38` (consent-gated), `SpeedInsights` in `app/layout.tsx:47` |

### Funnel wiring status

| Funnel | Status | Evidence |
|---|---|---|
| **Pre-order / checkout (F1)** | **WIRED** (code); env-blocked in prod | `PreorderCheckout.tsx:32` → `app/api/checkout/route.ts:18` creates a real Stripe session `:43-50`. Fulfillment chain complete: webhook `app/api/stripe/webhook/route.ts:96` → `handleCheckoutCompleted` `:20` writes `orders`+`purchases`, tags MailerLite `customers` `:51`, sends Resend `:52-53`. Refund path `:103` → `revokeEntitlementForRefund` `:59`. **Prod 502 is env/config, not code — see §3.** |
| **Free-chapter (F-lead)** | **WIRED** | `FreeChapterForm.tsx:22` → `app/api/free-chapter/route.ts:13`: MailerLite `:20`, `magnet_leads` insert `:30`, Resend `sendFreeChapter` `:22`. Degrades: email body depends on `curls-free` bucket links (`links.configured`, `free-chapter/route.ts:43`). |
| **Newsletter/subscribe** | **WIRED** | `NewsletterForm.tsx:78` → `app/api/subscribe/route.ts`: MailerLite `:36`, Supabase upsert+event `:51-52`, Resend welcome `:45`. (Prior silent Supabase-write bug fixed per `docs/WIRING-AUDIT.md:20-28`.) |
| **Quiz (F2)** | **WIRED** (now live) | `app/quiz/page.tsx:27` renders `QuizFlow`; `QuizFlow.tsx:46` → `app/api/quiz/route.ts:16` tags MailerLite `quiz` group `:26`. Worksheet delivery is via owner's MailerLite automation and degrades to `captured_pending_config` if `MAILERLITE_GROUP_QUIZ` unset (`quiz/route.ts:33`). NOTE: `docs/WIRING-AUDIT.md:15` (dated 2026-07-01) still says "built, not wired" — **stale**; page now imports and renders `QuizFlow` (`app/quiz/page.tsx:3,27`). |
| **Challenge** | **WIRED** (as newsletter capture) | `app/challenge/page.tsx:29,48` uses `NewsletterForm source="challenge"` → `/api/subscribe`. No dedicated challenge automation in code; relies on MailerLite. |
| **Bonus-claim** | **STUBBED / BROKEN funnel (no UI caller)** | API route is real and wired (`app/api/bonus-claim/route.ts:12`: MailerLite `:20`, Resend `:21`, Supabase `bonus_claims` insert `:23`), but `app/bonus-claim/page.tsx` has **no form and no fetch** (grep = 0 hits) and no other component calls `/api/bonus-claim` (fetch grep §below). Intentional per `docs/WIRING-AUDIT.md:16` ("requires Michael's approval"). |

Client→API fetch map (grep `fetch("/api/…`): `ContactForm.tsx:33`, `DownloadList.tsx:31`,
`FreeChapterForm.tsx:22`, `NewsletterForm.tsx:78`, `PreorderCheckout.tsx:32`, `QuizFlow.tsx:46`.
No component fetches `/api/bonus-claim` — confirms the bonus funnel has no live caller.

---

## 3. Checkout / 502 root cause

Handler: `app/api/checkout/route.ts`. Relevant code:

```
28  const stripe = getStripe();
29  if (!stripe) return NextResponse.json({ ok:false, error:{ code:"config_missing" } }, { status:503 });
...
42  try {
43    const session = await stripe.checkout.sessions.create({ mode:"payment", line_items, ... });
...
52    return NextResponse.json({ ok:true, url: session.url });
53  } catch {
54    return NextResponse.json({ ok:false, error:{ code:"stripe_error" } }, { status:502 });
55  }
```

`getStripe()` (`lib/stripe.ts:7-11`) returns `null` only when `getStripeConfig()` reports missing
keys (`lib/env.ts:100-102` requires `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PREORDER`,
`STRIPE_PRICE_ID_REGULAR`). If any are **absent**, the route returns **503 `config_missing`**
(`checkout/route.ts:29`), *not* 502.

**Verdict — env/config issue, not a code bug.** A **502** is emitted *only* from the `catch` at
`checkout/route.ts:53-54`, which fires when `stripe.checkout.sessions.create()` **throws** — i.e.
the Stripe SDK was successfully constructed (so the key is *present*) but the live API call
rejected it. The classic causes, in order of likelihood:

1. **Stale/invalid `STRIPE_SECRET_KEY`** in Vercel Production (present but wrong → Stripe returns
   401 `authentication_error`, thrown → 502). This matches the playbook suspicion exactly.
2. **Price ID that doesn't exist / belongs to another account or mode** — `resolveServerPriceId`
   (`lib/stripe.ts:19-25`) passes `STRIPE_PRICE_ID_PREORDER`/`_REGULAR` straight into
   `line_items` (`checkout/route.ts:39`); a bad price → Stripe `resource_missing`, thrown → 502.

The code path is correct and defensively written (mode/paused check `:22-23`, config check
`:26,29`, add-on guard `:33-34`). The distinguishing evidence: **missing env → 503; wrong/stale
env → 502.** Production reporting a 502 (per `docs/GO-LIVE-BLOCKERS.md:9-15`) therefore points at
a *populated-but-wrong* Stripe credential/price in Vercel, resolved by correcting the value and
**redeploying** (env changes need a redeploy). This is corroborated by `docs/GO-LIVE-BLOCKERS.md:11-15`.

Secondary note: the `catch {}` swallows the Stripe error with no logging (`checkout/route.ts:53`),
so the specific Stripe error code is not surfaced to logs — verifying the exact failure requires
either adding logging or checking the Stripe Dashboard → Developers → Logs. UNVERIFIED which of
cause (1) vs (2) is live in prod; settled by reading Stripe API logs or Vercel runtime logs for
the failing request (no runtime access in this phase).

---

## 4. Env var health

Schema of record: `lib/env.ts:5-51` (Zod; all `.optional()`). Table below cross-references the
declared/expected vars against actual `process.env.*` usage (grep across `*.ts,*.tsx`).

| Env var | In `.env.example`? | Referenced in code (cite) |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes `.env.example:11` | `lib/env.ts:84` |
| `NEXT_PUBLIC_LAUNCH_MODE` | yes `:16` | `lib/env.ts:89` |
| `NEXT_PUBLIC_LAUNCH_STATE` | yes `:15` | `config/launchState.ts` (grep: 1 hit; **not** in `lib/env.ts` schema) |
| `RELEASE_DATE` | yes `:17` | grep: 1 hit (`content/site.ts` → `siteConfig.releaseDate`, used `app/api/cron/launch-day/route.ts:18`); **not** in `lib/env.ts` schema |
| `SUPPORT_EMAIL` | yes `:18` | `lib/env.ts:166,168` |
| `NEXT_PUBLIC_SUPABASE_URL` | yes `:21` | `lib/env.ts:122,124,128,134` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes `:22` | `lib/env.ts:122,124,128,135` |
| `SUPABASE_SERVICE_ROLE_KEY` | yes `:23` | `lib/env.ts:128,135` |
| `SUPABASE_STORAGE_BUCKET` | yes `:24` | `lib/env.ts:137` |
| `STRIPE_SECRET_KEY` | yes `:27` | `lib/env.ts:106,116,118` |
| `STRIPE_WEBHOOK_SECRET` | yes `:28` | `lib/env.ts:107,116,118` |
| `STRIPE_PRICE_ID_PREORDER` | yes `:29` | `lib/env.ts:100,108` |
| `STRIPE_PRICE_ID_REGULAR` | yes `:30` | `lib/env.ts:100,109` |
| `STRIPE_PRICE_ID_CARD_DECK` | yes `:31` | `lib/env.ts:110` |
| `RESEND_API_KEY` | yes `:49` | `lib/env.ts:166,168` |
| `RESEND_FROM_EMAIL` | yes `:50` | `lib/env.ts:166,168` |
| `MAILERLITE_API_KEY` | yes `:35` | `lib/env.ts:143,147` |
| `MAILERLITE_GROUP_*` (11 groups) | yes `:36-46` | `lib/env.ts:149-159` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | yes `:53` | `lib/env.ts:10` (+ form components) |
| `TURNSTILE_SECRET_KEY` | yes `:54` | `lib/turnstile.ts:12` |
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | yes `:60` | `lib/env.ts:173` |
| `GA4_API_SECRET` | yes `:61` | `lib/env.ts:174` |
| `NEXT_PUBLIC_POSTHOG_KEY` / `_HOST` | yes `:62-63` | `lib/env.ts:175-176` |
| `NEXT_PUBLIC_SENTRY_DSN` | yes `:66` | `instrumentation.ts:4`, `instrumentation-client.ts:3` |
| `SENTRY_ORG` / `_PROJECT` / `_AUTH_TOKEN` | yes `:67-69` | grep: 1 hit each (build-time / `next.config.ts`) |
| `ADMIN_EMAILS` | yes `:72` | grep: 2 hits (admin gating) |
| `CRON_SECRET` | yes `:73` | grep: 12 hits (cron auth) |
| `LAUNCH_FULFILLMENT_ENABLED` | yes `:78` | grep: 8 hits (`lib/launch-fulfillment.ts`) |
| `LAUNCH_DRYRUN_TEST_EMAIL` / `LAUNCH_OWNER_EMAIL` | yes `:80,82` | `lib/env.ts:49-50`; `launch-day/route.ts:30` |
| `ALLOW_DEMO_SESSION` | yes `:83` | `lib/supabase/server.ts:65` (grep: 6 hits) — must be ABSENT in prod |
| `NEXT_PUBLIC_THANKYOU_VIDEO_ID` | yes `:89` | `lib/env.ts:11` |
| `VERCEL_ENV` / `NEXT_RUNTIME` / `CI` | (Vercel-provided) | `instrumentation.ts:7,8,10`; test files |

**Findings:**
- Every `.env.example` var is referenced somewhere in code. No orphan required vars found.
- **Schema drift:** `NEXT_PUBLIC_LAUNCH_STATE` and `RELEASE_DATE` are documented in
  `.env.example:15,17` and read by `config/launchState.ts` / `content/site.ts`, but are **not**
  declared in the Zod schema `lib/env.ts:5-51`. Not a crash risk (they're read via raw
  `process.env`), but they bypass validation. The `envOrDefault` helper (`lib/env.ts:74-77`)
  exists specifically because a blank `RELEASE_DATE` once crashed the prod build (comment
  `lib/env.ts:63-72`).
- **`.env.sandbox.example` diverges from `.env.example`** (keys-only diff): sandbox declares
  extra vars *not* present in the code's env schema or the prod example — `DOWNLOAD_TOKEN_SECRET`,
  `MAILERLITE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `POSTHOG_PERSONAL_API_KEY`,
  `SENTRY_DSN` (note: code uses `NEXT_PUBLIC_SENTRY_DSN`, not `SENTRY_DSN`),
  `STRIPE_PRICE_ID_BUNDLE/_MEMBERSHIP_MONTHLY/_YEARLY/_WORKSHEETS`, `NEXT_PUBLIC_*_PRICE`,
  `ALLOW_PRODUCTION_DOMAIN_FOR_SANDBOX`. These appear to be **aspirational/legacy** (membership,
  worksheets, bundle products) with no code referencing them — grep of `process.env` (§ top)
  shows none of them used. Prod example omits them.

---

## 5. Banned tokens

Command run:
```
grep -rniE "2B9999|C9A961" --include=*.ts --include=*.tsx --include=*.css --include=*.js --include=*.mjs .   (node_modules excluded)
```
Result — **1 hit, and it is a test guard (not a violation):**

```
tests/security-static.test.ts:25:  const deprecatedValues = ["0E0D0B","B89968","1F6F6B","2B9999","C9A961"].map((value) => `#${value}`);
```

This is the ACISS palette regression test that asserts the banned colors are absent from source
(`tests/security-static.test.ts:25`). The tokens also appear as documentation in
`public/motion/motion-manifest.json` (`"bannedTokens": ["#2B9999","#C9A961"]`) — that is JSON, not
matched by the `.ts/.tsx/.css/.js/.mjs` grep, and is a declarative guard, not a style usage.

**Verdict: zero real violations.** Both occurrences are guards/manifests, not applied colors.

---

## 6. Existing docs — prior audit findings (`docs/*.md`)

- **`docs/SITE_AUDIT_2026-06-20.md:11`** — Code-complete & green on toolchain; not launch-ready due
  to *external* config/binary content (keys, deliverables, domain, legal), not code.
- **`docs/SITE_AUDIT_2026-06-30.md:13-22`** — Re-verification: still code-complete, green,
  structurally secure; no critical/high defects; 4 new low/med hardening items. Toolchain evidence
  table `:27-34` (60 tests pass, build exit 0).
- **`docs/GO-LIVE-BLOCKERS.md:9-30`** — Two blockers, both dashboard-not-code: (1) prod checkout
  **502**, most consistent with stale `STRIPE_SECRET_KEY`/price-ID in Vercel; (2) set launch env
  vars (`NEXT_PUBLIC_LAUNCH_STATE`, `RELEASE_DATE`, `MAILERLITE_GROUP_QUIZ`, Turnstile, Resend).
- **`docs/WIRING-AUDIT.md:9-58`** — Per-form wiring matrix; documents the fixed silent-Supabase
  newsletter bug (`:20-28`); notes a **live** MailerLite "Customers (DRAFT)" automation that will
  fire on first sale (`:45`); flags two Stripe webhook paths and unconfirmed dashboard destination
  (`:48-58`). NOTE: its Quiz row (`:15`) is now stale (quiz is live).
- **`docs/WHAT_TO_DO_NEXT.md:1-31`** — Operator runbook: local run steps, `.env.local` template,
  "fill keys, fail-safe when absent". References old paths (`author-site/`) and prices.
- **`docs/MISSING-INFORMATION.md`** — Open items the audits could not verify (Resend
  SPF/DKIM/DMARC, Turnstile pass-rate, whether `curls-free`/`curls-deliverables` buckets contain
  expected files) per `docs/WIRING-AUDIT.md:87-90`.
- **`docs/VERCEL-ENV-VARIABLES.md`** — Full env reference w/ descriptions + live MailerLite group
  IDs (referenced from `.env.example:7`).
- Others present: `AUDIT-2026-07-02-ERROR-DOC.md`, `ELEVATION-PLAN-2026-07-02.md`,
  `FUNNEL-TESTING-CHECKLIST.md`, `LAUNCH-FINALIZATION-GUIDE.md`, `TASK-C-SERVICE-AUDIT.md`,
  `curls-launch-day-runbook.md`, `mailerlite-launch-campaigns.md`, plus `docs/website-v4/`.

---

## 7. Motion assets

`public/` inventory (`ls public`):
- **Scroll-scrub source video present:** `public/curl-scrub.mp4` (1.71 MB) + `public/curl-scrub.webm`
  (1.65 MB) + poster `public/curl-poster.jpg`. Used by `app/book/page.tsx:24` (`ScrollScrubVideo`)
  and `app/about/page.tsx:25` (`MouseScrubVideo`).
- **`/journey` frame system present and complete:** `public/journey-frames/d/` = **90 frames**,
  `public/journey-frames/m/` = **90 frames** (desktop + mobile). Driven by
  `components/journey/CinematicJourney.tsx:35` (`framePath` → `/journey-frames/{dir}/f-NNN.webp`);
  header comment `CinematicJourney.tsx:10` states the 90 WebP frames were extracted from
  `curl-scrub.mp4`.
- **`motion-manifest.json` EXISTS:** `public/motion/motion-manifest.json` (Phase "3.5 Motion
  Library", generated 2026-07-08). Declares Higgsfield/Kling-generated image-to-video assets, an
  `assets[]` list (e.g. asset "A" hero-door: `/motion/hero-door.webm|.mp4|.webp`, status
  `DELIVERED`), palette (incl. `bannedTokens`), and delivery budget (`deliveredWebmTotalKB: 4522`
  of `budgetKB: 12000`). Alongside it: `public/motion/README.md`.
- **Gap — manifest assets not on disk:** `public/motion/` currently contains only `README.md` and
  `motion-manifest.json`; the referenced media files (`/motion/hero-door.webm` etc.) are **not
  present** in `public/motion/` (`ls public/motion` shows 2 files). The manifest describes assets
  that are declared DELIVERED but whose binaries are absent from the repo — UNVERIFIED whether they
  live elsewhere (e.g. external storage/CDN); settled by checking the storage bucket or a later
  motion-integration commit. No code yet references `/motion/*.webm` (grep of motion refs shows
  only `journey-frames` and `curl-scrub` consumers).
- Other statics: `book-cover-thumb.webp`, `curl-front.jpg`, `curl-reveal.jpg`, `gateway-cover.jpg`,
  `og-default.png`, `protected-spreads.webp`.

---

## Cross-cutting observations (verified)
1. Every integration fails safe on missing config (`RuntimeConfigResult` pattern, `lib/env.ts`),
   so absent env → graceful skip, never a crash. This is why prod symptoms are 502/degraded, not
   500s.
2. `/api/health` now derives `paymentsLive`/`subscriptionsLive` from config presence
   (`app/api/health/route.ts`, updated in Phase 5) — a real readiness signal. (At the time of the
   original Phase 1 scan it returned hardcoded `false`.)
3. Two live-schema generations coexist in Supabase per `docs/WIRING-AUDIT.md:62-83` (10 legacy
   tables, 0 refs; 9 live tables incl. `magnet_leads`). Code table list: `lib/supabase/server.ts:7-23`.
