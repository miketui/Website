# Rebuild Plan — curlscontemplation.beauty

**Phase 2 (PLAN).** Authored 2026-07-09. Builds directly on `docs/current-state.md`
(Phase 1, authoritative). This is **one** implementable plan, not a menu. Repo is
mature and code-complete; the prod checkout 502 is an **env/config** issue, not a
code bug (`docs/current-state.md` §3). Nothing here contradicts Phase 1.

Release date of record: **2026-11-24** (`content/site.ts:24`). Preorder price
**$17.99**, regular **$19.99** (`content/book.ts:2-3`). Today is inside the
PREORDER runway, before the 14-day countdown window.

---

## 1. Final page map

### Target set (playbook) vs. what exists

The playbook names six felt destinations: `/`, `/preorder`, `/book`,
`/free-chapter`, `/about`, `/reset`. Five of the six **already exist and are
shippable**. Only `/reset` is net-new. Everything else in the repo is classified
KEEP / REDIRECT / KILL below.

### The six target routes

| Route | Exists? | Decision | Notes |
|---|---|---|---|
| `/` | yes (`app/page.tsx`) | **KEEP** | Felt home. "The book is the door." Already shippable, protects LCP by deferring the cinematic experience to `/journey`. |
| `/preorder` | yes (`app/preorder/page.tsx`) | **KEEP** | PRIMARY commerce until 2026-11-24. Hosts `PreorderCheckout` → real Stripe session. Countdown surfaces automatically inside the 14-day window via `getPreorderSubPhase` — no launch-morning edit. |
| `/book` | yes (`app/book/page.tsx`) | **KEEP** | Synopsis, look-inside (`ScrollScrubVideo`), endorsements, JSON-LD. Endorsements must be real (see pre-mortem "fabricated stats"). |
| `/free-chapter` | yes (`app/free-chapter/page.tsx`) | **KEEP** | Tripwire funnel entry. `FreeChapterForm` → `/api/free-chapter`, WIRED. Sitewide secondary CTA. |
| `/about` | yes (`app/about/page.tsx`) | **KEEP** | Michael's story, "the why." Breathing portrait via `MouseScrubVideo`. Canonical/indexed. |
| `/reset` | **no** | **BUILD (thin)** | RESET Method soft framing. See "Decision: /reset" below. |

### Decision: `/reset`

`/reset` does **not** exist and no dedicated "RESET Method" content module exists in
the repo (grep for RESET/reset returns only incidental copy in `content/chapters.ts:46-50`
— the "Contemplation" chapter — and `password_reset` analytics keys; the only
capitalized "RESET Method" lives in `BUILD-PLAYBOOK.md`, i.e. the playbook itself).

**Decision: BUILD `/reset` as a thin static content page**, sourced from existing
chapter/site copy — do NOT invent a new taxonomy, product, or funnel.

- Content basis: reframe the existing "Contemplation" chapter takeaways
  (`content/chapters.ts:44-52`) into the RESET Method's soft narrative. No new data model.
- Constraints: **soft, no medical claims.** No "reduces cortisol / treats burnout /
  clinically…" language. Frame as reflective practice, not therapy.
- CTA: inherits the sitewide launch-state CTAs (primary Pre-order, secondary Free
  chapter) — it is a content/SEO page, not a new funnel.
- Effort: single `app/reset/page.tsx` + a `content/reset.ts` copy object. Add to
  `app/sitemap.ts` and nav. No API, no form, no new env.
- Fallback if Michael has no approved RESET copy by build time: ship `/reset` as a
  `permanentRedirect` to `/book#reset` (an anchored section) rather than fabricate a
  method. Redirect is reversible once copy lands.

### Existing routes NOT in the target set — KEEP / REDIRECT / KILL

Guiding rule from the task: **do not delete legal/admin/auth/dashboard
infrastructure.** Justify every cut. Bias to KEEP (repo is mature; cuts create
404s/SEO loss for little gain). Consolidate only where a route is inert or a pure
duplicate of a target destination.

**KEEP — infrastructure (non-negotiable):**

| Route | Why keep |
|---|---|
| `/privacy` `/terms` `/cookies` `/refund-policy` `/preorder-policy` `/digital-delivery-policy` `/accessibility` | Legal/consent surface. Required for Stripe, CCPA/CPRA, digital-goods refunds. |
| `/login` `/signup` `/logout` `/auth/callback` | Supabase OTP auth. Gates dashboard/downloads. |
| `/dashboard` `/downloads` | Buyer entitlement + signed downloads. Post-purchase fulfillment UI. |
| `/admin` (+ `/analytics` `/claims` `/content` `/orders` `/subscribers`) | Email-allowlist gated operator console. Internal, noindex. |
| `/thank-you` | Post-conversion terminus (Stripe success_url + funnel confirmations). |
| All `/api/*` route handlers, `robots.ts`, `sitemap.ts`, `not-found.tsx`, `global-error.tsx` | Backend + framework. Untouched. |

**KEEP — commerce/funnel/content (support the target set):**

| Route | Why keep |
|---|---|
| `/order` | **Stable conversion terminus.** Nav/emails/campaigns point here forever; it redirects to `/preorder` or `/buy` by launch state (`app/order/page.tsx:14-16`). This is the mechanism that makes "no launch-morning edit" true. KEEP. |
| `/buy` | Post-launch checkout. Dormant during PREORDER but the LAUNCH/EVERGREEN destination `/order` redirects to. Removing it breaks launch. KEEP. |
| `/quiz` `/quiz/results/[archetype]` | Funnel 2, now LIVE (`app/quiz/page.tsx:27` renders `QuizFlow`). Secondary lead capture. KEEP. |
| `/challenge` | 5-day email challenge → `/api/subscribe`. Lead capture. KEEP. |
| `/journey` | Cinematic scroll (90 WebP frames present on disk). Isolated route protects `/` LCP by design. KEEP. |
| `/blog` `/blog/[slug]` | SEO content + `NewsletterForm`. KEEP. |
| `/chapters` `/chapter/[slug]` | Look-inside / chapter previews. Feed `/book`. KEEP. |
| `/faq` `/contact` `/resources` `/worksheets` `/media-kit` | Support, press, and utility pages. Low-cost, SEO/trust value. KEEP. |
| `/author` | `permanentRedirect("/about")` alias (`app/author/page.tsx:11`). Harmless, preserves inbound links. KEEP. |

**REDIRECT:**

| Route | → Target | Why |
|---|---|---|
| `/bonus-claim` | `permanentRedirect` → `/free-chapter` | The page is **inert**: no form, no fetch, no UI caller for `/api/bonus-claim` (`docs/current-state.md` §2, WIRING-AUDIT: "requires Michael's approval"). Rather than ship a dead page or fabricate a funnel, redirect to the working lead magnet. The `/api/bonus-claim` handler stays in code (harmless, gated) so the funnel can be re-activated later by restoring a form — reversible. |
| `/author` | (already) → `/about` | Listed above; keep as-is. |

**KILL:** _None._ No orphan/noise page routes exist (`docs/current-state.md` §1
"Noise/legacy verdict"). The prior audit's dead components were already deleted.
`/api/webhooks/stripe` is an intentional compat shim — **not** killed.

**Net change to routes:** build 1 (`/reset`), redirect 1 (`/bonus-claim`), keep the
rest. This is a **reconciliation, not a teardown** — consistent with a code-complete
repo whose real gap is env/config and content, not structure.

---

## 2. Primary / secondary CTA — mapped to the launch-state system

**Sitewide primary CTA = Pre-order. Secondary = Free chapter.** This must require
**zero launch-morning code edits**.

It already does, via `config/launchState.ts`:

- Every CTA reads from `getLaunchStateCopy()`, which derives label + href from a
  single env value `NEXT_PUBLIC_LAUNCH_STATE` (PREORDER | LAUNCH | EVERGREEN), with
  legacy `NEXT_PUBLIC_LAUNCH_MODE` and date-derived fallback
  (`config/launchState.ts:53-65`). A blank/invalid value never crashes or
  blank-renders — it falls back to the date-derived state off `RELEASE_DATE`.
- **Primary CTA** = `heroCta` + `finalCtaLabel`. In PREORDER these read
  "Preorder the Journey — $17.99" → **`/order`** (`config/launchState.ts:110,121`),
  which redirects to `/preorder`. On/after 2026-11-24 the same code auto-swaps to
  "Get the Book" → `/order` → `/buy`. No edit needed — the date crosses the release
  boundary and `dateDerivedState()` flips.
- **Secondary CTA** = Free chapter. `emailCaptureFraming` + the `/free-chapter`
  link render alongside the primary in all states. Keep the secondary CTA pointing
  at `/free-chapter` regardless of launch state (it is state-independent).
- **Countdown** surfaces automatically: `getPreorderSubPhase()` returns `building`
  now (quiet "Coming November 24" chip) and flips to `countdown` (ticking timer)
  inside the final 14 days (`config/launchState.ts:73-75, 112-115`). No edit.
- **Pause safety valve**: if checkout must be disabled (bad Stripe env, incident),
  set `NEXT_PUBLIC_LAUNCH_MODE=paused` — every primary CTA falls back to
  "Read Chapter 1 Free" → `/free-chapter` (`config/launchState.ts:69-71,101,110`).
  This is the operator's instant kill-switch that keeps the site converting to email
  even while payments are down.

**Build implication:** the rebuild's job is to ensure **every** hero, nav, and
footer CTA in the target pages consumes `getLaunchStateCopy()` (and `/reset` inherits
it) — never a hardcoded "Preorder" string. Add a lint/test guard asserting no
literal order/preorder CTA hrefs bypass `/order`. Launch morning = flip one Vercel
env var (or let the date do it), then redeploy.

---

## 3. Build order — phases 3 → 7

`[GATE]` = human checkpoint required **before** the step, because it charges a card,
stores PII, deploys, or changes prod config. Gates are approval points, not code.

### Phase 3 — Structure & content reconciliation (no prod risk)
- 3.1 Build `/reset` (thin static page + `content/reset.ts`, soft framing, no medical
  claims) OR redirect `/reset` → `/book#reset` if copy not approved.
- 3.2 Redirect `/bonus-claim` → `/free-chapter` (`permanentRedirect`).
- 3.3 Audit every CTA in `/`, `/book`, `/about`, `/preorder`, `/free-chapter`,
  `/reset` to consume `getLaunchStateCopy()`; add the "no hardcoded order href" test.
- 3.4 Update `app/sitemap.ts` + nav for `/reset`; confirm `/bonus-claim` drops out.
- 3.5 Verify no fabricated stats/endorsements in `/book` and `/` copy (content pass,
  ties to pre-mortem). Remove or source-attribute any unverifiable claim.
- Exit: `npm run build` exit 0, existing test suite green (60 tests), typecheck clean.

### Phase 4 — Observability for the 502 (code-side, safe)
- 4.1 Add structured error logging in `app/api/checkout/route.ts` catch block so the
  **exact** Stripe error code (`authentication_error` vs `resource_missing`) reaches
  Vercel logs / Sentry. Currently the `catch {}` swallows it (`checkout/route.ts:53`).
  This is the only code-side action possible on the 502 — the fix itself is env-level.
- 4.2 Make `/api/health` a real probe (or clearly label it static) — it currently
  hardcodes `paymentsLive:false` (`app/api/health/route.ts:2`), a misleading readiness
  signal.
- Exit: a deliberately-wrong test key locally produces a logged, specific Stripe error.

### Phase 5 — [GATE] Env correction + prod checkout fix
- **[GATE — changes prod config, enables charging a card]**
- 5.1 In Vercel Production, correct `STRIPE_SECRET_KEY` and verify
  `STRIPE_PRICE_ID_PREORDER` / `STRIPE_PRICE_ID_REGULAR` exist in the **same**
  Stripe account+mode as the key (Phase 1 §3 root cause). Dashboard action, not code.
- 5.2 Resolve env schema drift: add `NEXT_PUBLIC_LAUNCH_STATE` and `RELEASE_DATE` to
  the Zod schema in `lib/env.ts` (currently read raw, bypass validation —
  `docs/current-state.md` §4). Set launch env: `NEXT_PUBLIC_LAUNCH_STATE=PREORDER`,
  `MAILERLITE_GROUP_QUIZ`, Turnstile keys, Resend keys/domain.
- 5.3 Confirm `ALLOW_DEMO_SESSION` and `ALLOW_PRODUCTION_DOMAIN_FOR_SANDBOX` are
  ABSENT in prod.
- 5.4 **[GATE] Redeploy** (env changes require redeploy) and read the 4.1 logs to
  confirm the 502 is gone.
- Exit: checkout returns a real Stripe session URL in prod.

### Phase 6 — [GATE] End-to-end funnel + fulfillment verification
- **[GATE — charges a real card / stores PII / triggers live email]**
- 6.1 Live Stripe test purchase → confirm webhook (`/api/stripe/webhook`) writes
  `orders`+`purchases`, tags MailerLite `customers`, sends Resend receipt.
- 6.2 **[GATE] Verify the MailerLite "Customers (DRAFT)" automation** before the first
  real sale — WIRING-AUDIT flags it as live-and-draft; it will fire on first purchase
  (`docs/current-state.md` §6). Confirm content or pause it.
- 6.3 Free-chapter + newsletter + quiz captures store PII correctly (Supabase +
  MailerLite) with Turnstile + consent gating verified.
- 6.4 Confirm `curls-free` / `curls-deliverables` buckets contain the actual files
  (open item, `docs/MISSING-INFORMATION.md`).
- Exit: one full buy → receipt → download works; one full lead → email works.

### Phase 7 — [GATE] Launch readiness + go-live
- **[GATE — prod deploy to real customers]**
- 7.1 Perf/accessibility pass: LCP/CLS on `/` and `/preorder`, reduced-motion
  honored, motion-manifest assets either present or gated (see pre-mortem).
- 7.2 Legal/consent final check (CCPA/CPRA banner, policy links live).
- 7.3 Confirm launch-state auto-transition dry-run (`/api/cron/launch-day/dry-run`)
  and `pre-launch-check` cron.
- 7.4 **[GATE] Final prod deploy** + smoke test the primary CTA path end to end.
- Exit: site converts (preorder + free chapter) with full fulfillment.

---

## 4. Pre-mortem

Each risk labeled **Tiger** (real, act now), **Paper Tiger** (overblown, cheap to
disprove), or **Elephant** (unspoken, structural). Each has a one-line **kill
criterion** (what makes it dead/handled) and the **cheapest test**.

| # | Risk | Type | Kill criterion | Cheapest test |
|---|---|---|---|---|
| 1 | **502 / Stripe env** — prod checkout throws on `sessions.create()` (stale key or wrong-account/mode price ID). | **Tiger** | Prod `/api/checkout` returns a real session URL and logs show no Stripe error for 5 consecutive attempts. | Read Stripe Dashboard → Developers → Logs for the failing request; it names `authentication_error` (bad key) vs `resource_missing` (bad price) in seconds. |
| 2 | **Missing motion binaries** — `motion-manifest.json` declares assets DELIVERED but `/motion/*.webm|mp4|webp` are absent from disk (`docs/current-state.md` §7); a future component referencing them 404s / breaks layout. | **Paper Tiger** | No code references `/motion/*` OR the files exist on disk/CDN with poster fallbacks. | `grep -r "/motion/" app components` — currently zero consumers, so nothing is broken today. Confirms it's latent, not live. |
| 3 | **Fabricated stats / endorsements (FTC)** — invented sales numbers, review counts, or unverified testimonials on `/` or `/book`. | **Tiger** | Every stat/quote on the site maps to a verifiable source or is removed; sign-off from Michael. | Content grep for numerals + quotation marks on `/` and `/book`; manually verify each against a real source. |
| 4 | **Reduced-motion / perf (LCP/CLS)** — cinematic scrub video + 90-frame journey hurt LCP or ignore `prefers-reduced-motion`. | **Paper Tiger** | `/` and `/preorder` LCP < 2.5s, CLS < 0.1, and reduced-motion shows a static poster. | Lighthouse mobile on `/` + `/preorder`; toggle OS reduced-motion and confirm the poster (not video) renders. Journey is already isolated to `/journey` by design. |
| 5 | **MailerLite draft automation firing on first sale** — a live "Customers (DRAFT)" automation triggers on the first real purchase with unfinished content (`docs/current-state.md` §6, WIRING-AUDIT). | **Tiger** | The automation is either completed-and-approved or paused before Phase 6 test purchase. | Open MailerLite → Automations; check the Customers automation status and last-edited. One dashboard glance. |
| 6 | **Env schema drift** — `NEXT_PUBLIC_LAUNCH_STATE` + `RELEASE_DATE` read raw, bypass Zod (`lib/env.ts`); a blank `RELEASE_DATE` previously crashed a prod build (comment `lib/env.ts:63-72`). | **Elephant** | Both vars are in the Zod schema and a blank value degrades gracefully in a build test. | Set `RELEASE_DATE=""` locally and run `npm run build`; it must not crash (the `envOrDefault` guard should hold — verify, don't assume). |
| 7 | **Legal / consent (CCPA/CPRA)** — analytics (PostHog/GA4) or PII capture fires before consent, or policy pages are stale/unlinked. | **Elephant** | Consent gate blocks all non-essential trackers pre-consent AND all 7 legal pages render current copy linked from the footer. | Load site in a fresh browser, open Network tab, confirm no PostHog/GA4 calls before accepting consent; click every footer legal link. |

### Extra Elephant worth naming
- **Two coexisting Supabase schema generations** (10 legacy tables, 0 refs; 9 live) —
  `docs/current-state.md` cross-cutting §3. Not a launch blocker, but a silent write to
  the wrong generation would corrupt fulfillment. Kill criterion: Phase 6.1 test
  purchase lands in the **live** `orders`/`purchases` tables. Cheapest test: inspect the
  row written by the test purchase.

---

## Summary of decisions

- **Build order** is content-first (Phase 3, safe) → observability (Phase 4, safe) →
  then three consecutive **[GATE]** phases (env fix, funnel verification, go-live)
  because everything that charges a card, stores PII, or deploys must be human-approved.
- The 502 fix is **env-level (Vercel + redeploy), gated**; code-side we add only error
  logging (Phase 4.1) to surface the exact Stripe failure.
- CTAs need **no launch-morning edit** — they already flow through
  `config/launchState.ts` and the date-derived state machine.
