# Curls & Contemplation — Site Audit Error Doc
**Date:** 2026-07-02 · **Repo:** `miketui/Website@main` (`8c…` shallow head) · **Auditor pass:** impeccable / integrity-audit / noosphere topology-first

## Verification evidence (all run this session)

| Gate | Result |
|---|---|
| `pnpm typecheck` | exit 0 — zero errors |
| `pnpm lint` (`--max-warnings=0`) | exit 0 — zero warnings |
| `pnpm test` (vitest) | 15 files, **71/71 passed** |
| `pnpm build` (next build) | exit 0 — compiled, **63/63 pages generated** |
| Retired ACISS tokens (`#2B9999`/`#C9A961`) in source | **none** (only the guard test that bans them) |
| Internal link → route resolution | every `href` target maps to an existing `app/**/page.tsx` — **zero dead links** |
| Client fetch targets (`/api/checkout`, `/api/free-chapter`, `/api/quiz`, `/api/subscribe`, `/api/downloads/sign`) | all five API routes exist with zod validation + env guards |

## Funnel wiring status

| Funnel | Wire | Status |
|---|---|---|
| F1 Free Chapter Tripwire | `/free-chapter` form → `POST /api/free-chapter` → MailerLite | ✅ wired |
| F2 Blind-Spot Quiz | `/quiz` → `POST /api/quiz` → `/quiz/results/[archetype]` | ✅ wired |
| F3 5-Day Challenge | `/challenge` staged notice, no capture form | ⚠️ **intentionally staged** ("registration opens with launch calendar") — not a defect, but F3 has no email capture today |
| F4 Ascension / Purchase | `/preorder` → `PreorderCheckout` → `POST /api/checkout` (Stripe, order-bump guarded) → webhook `/api/stripe/webhook` → Supabase `webhook_events` (idempotent) → Resend (`sendOrderConfirmation`, `sendDownloadAccess`, refund revocation) → MailerLite upsert | ✅ wired in code |
| Newsletter | `CaptureBand` → `POST /api/subscribe` | ✅ wired |
| Contact | `mailto:` support address only | ⚠️ no on-site form (P3 enhancement) |

## Defects & gaps
**P0 — launch blockers (operational, not code):**
1. **Stripe webhook endpoint must exist in the Stripe dashboard** pointing at `https://curlscontemplation.beauty/api/stripe/webhook` with the seven required events, and `STRIPE_WEBHOOK_SECRET` set in Vercel. The code path is ready; the E2E (test-mode checkout → webhook → Supabase row → Resend email) remains unproven this session (no live keys in sandbox — correct). This was the standing P0 and it is still open.
2. **Testimonials array is empty** (`content/testimonials.ts`) — correct per flag-and-hold, but the section renders nothing at launch until real quotes land.

**P1 — required-spec gaps (fixed in this pass):**
3. **Navigation IA does not match the launch spec** (Home · About the Book · About the Author · Order · Contact). Current desktop nav: The Book / Chapters / Free Chapter / Resources(member) / About / Contact — no Home, no Order item. → *Fixed: new shared nav.*
4. **Desktop and mobile navs are two hand-maintained lists that have already drifted** (`MobileNav` includes FAQ + Resources unconditionally; Header marks Resources `memberOnly` but never uses the flag). → *Fixed: single source of truth `lib/navigation.ts`.*
5. **No active-route indication or `aria-current`** anywhere in the nav — wayfinding + WCAG 2.4.8 gap. → *Fixed.*
6. **Header is scroll-inert** — permanent 95% obsidian bar sits on top of the journey's opening frame, diluting the full-bleed camera entrance. → *Fixed: transparent-over-hero → glass-on-scroll.*
7. **`motion` (motion/react) absent from `package.json`** despite being the locked stack default; all animation is hand-rolled rAF. Hand-rolled code is good (kept), but the dependency is required for the elevated header/section choreography. → *Fixed: added.*

**P2 — hardening (documented, deliberately not churned 12 days pre-launch):**
8. `app/api/stripe/webhook/route.ts` exports non-handler functions (`recordWebhookEvent`, `handleCheckoutCompleted`, …) from a route file. Builds today; Next has tightened route-export validation across majors and `"next": "latest"` floats. Post-launch: move helpers to `lib/stripe-webhook.ts` (note: `tests/static-security-prompt5.test.ts` reads this file's source — update together).
9. Runtime deps pinned to `"latest"` (`next`, `stripe`, `clsx`, `react`…). `pnpm-lock.yaml` makes Vercel builds reproducible, so severity is contained — but any lockfile regeneration is a version-jump roulette. Post-launch: pin to installed versions.
10. Legacy webhook alias `/api/webhooks/stripe` re-exports the canonical POST — intentional and documented in-file; keep until Stripe dashboard confirms zero traffic.

**P3 — polish:**
11. Contact page is mailto-only.
12. `/challenge` noindex + staged — ensure it exits staged mode when F3 opens.

## Out-of-scope confirmations
- No secrets or credentials found committed in the working tree scan.
- Reduced-motion, no-JS, and crawler fallbacks in `JourneyExperience` are genuinely progressive (verified: journey layers are `display:none` until `data-journey="on"`).

## Addendum — defect found & fixed during implementation verification
**P1 (introduced-then-caught in this pass):** first cut of `EditorialCameraHold` let scene 1 re-enter behind scene 3 late in the scroll track (opacity climbed 0.20→1.0 instead of holding 0 — caught by real-input Playwright probe, wheel-stepping the track). Root remedy: every scene's opacity/scale/copy keyframes now span the full 0→1 progress domain with pinned endpoints, so no scene can exist outside its window regardless of interpolation edge behavior. Re-verified post-fix: `[1,0,0] → [0,1,0] → [0,0,1]` with clean handovers; the brief obsidian beat between scenes is an intentional cinematic cut, on brand.

**Verification harness note:** headless Chromium throttles rAF on synthetic `window.scrollTo` jumps — scroll-driven state appears one interaction stale. All scroll-choreography assertions in CI must use real input (`mouse.wheel`) as the probes here do.
