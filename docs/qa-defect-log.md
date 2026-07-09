# QA Defect Log — curlscontemplation.beauty (Phase 6, QA GATE)

Generated 2026-07-09. Exit criterion: **P0 = 0, P1 = 0**, full gate green
(`build` / `lint` / `typecheck` / `test` / banned-hex grep). Both criteria met.

Environment note: this pass runs with **absent runtime env** (no live Stripe /
Supabase / MailerLite / Resend / Turnstile keys), so pages render in the
intended fail-safe/degraded mode. Structural QA (a11y, layout, headers, static
security, copy) is fully valid in that mode. **Live payment / opt-in e2e could
NOT be executed here — it requires real keys we do not have, and no checkout was
faked.**

Tooling: axe-core 4.12 (WCAG 2.0/2.1/2.2 A+AA tags) driven by Playwright
chromium (`scripts/a11y-audit.mjs`), plus `scripts/mobile-qa.mjs` for
overflow / tap-target measurement at 375/390/430px.

---

## Severity counts (final)

| Severity | Open | Fixed this pass |
|---|---|---|
| **P0 blocker** | 0 | 0 |
| **P1 major** | 0 | 1 |
| **P2 minor** | 4 | 2 |
| **P3 nit** | 3 | 0 |
| Documented non-issues | 3 | — |

---

## P0 — Blockers
None found.

## P1 — Major (FIXED)

### P1-1 — Color-contrast below WCAG 2.2 AA (SC 1.4.3) — FIXED
axe flagged `serious` color-contrast on `/preorder`: `text-whitegold/55`
("Releasing November 24") over obsidian computes ~**4.46:1**, under the 4.5:1
minimum for small text.
- **Remediation:** bumped the muted small-text token from `/55`→`/70` (~6.5:1).
  Applied to the flagged node and the sibling instances of the same muted-label
  pattern to prevent regression:
  - `app/preorder/page.tsx:40` (`/55`→`/70`) — the flagged node
  - `app/page.tsx:117` (`/50`→`/70`) and `app/page.tsx:121` (`/55`→`/70`)
  - `app/about/page.tsx:31` (`/55`→`/70`)
  - `components/PreorderCountdown.tsx:72` (`/55`→`/70`)
- ACISS-only: `whitegold` is a locked token; opacity change only, no new hex.
- **Verified:** axe re-run → **0 violations across all 7 routes**.

---

## P2 — Minor

### P2-1 — No Content-Security-Policy header (OPEN, documented)
`next.config.ts` sets `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options` and (now) HSTS + Permissions-Policy, but there is **no CSP**.
- **Why not fixed here:** a correct CSP for this app is not a one-line add — the
  layout ships inline `<script>` (gateway curtain + JSON-LD via
  `dangerouslySetInnerHTML`, `app/layout.tsx:47`) and loads Stripe, PostHog, GA4,
  Vercel Speed Insights. A blind `script-src` would break the site. It needs a
  nonce/hash-based policy built and smoke-tested against every third party — out
  of scope for a surgical QA fix.
- **Remediation (recommended):** add a nonce-based CSP in `proxy.ts` (per-request
  nonce → inline scripts) with `script-src`/`connect-src`/`frame-src`
  allowlists for Stripe/PostHog/GA4/Sentry/Vercel, then verify in a staged env.

### P2-2 — HSTS + Permissions-Policy headers absent (FIXED)
Standard hardening headers were missing.
- **Remediation:** added to `next.config.ts` `headers()`:
  `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` and
  `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`.
- **Verified:** `curl -I` on the running server returns both.

### P2-3 — No generic per-IP rate limiting on public POST routes (OPEN)
`/api/subscribe`, `/api/free-chapter`, `/api/contact`, `/api/quiz`,
`/api/checkout` have **no IP/token-bucket rate limiter**. Abuse protection today
is **Cloudflare Turnstile** (`lib/turnstile.ts`, verified on every public form
route) plus an entitlement quota on downloads (`/api/downloads/sign` enforces
"3 downloads / 7 days", `app/api/downloads/sign/route.ts`).
- **Why not fixed here:** true rate limiting on Vercel serverless needs an
  external store (e.g. Upstash Redis) — **infra, not code.** Not inventing infra.
- **Remediation (recommended):** add Upstash-backed `@upstash/ratelimit` (or
  Vercel KV) middleware on the public POST routes; keep Turnstile as layer 1.

### P2-4 — `/api/health` returns hardcoded readiness values (OPEN, pre-existing)
`app/api/health/route.ts` hardcodes `paymentsLive:false, subscriptionsLive:false`
— a static string, not a live probe; misleading as a readiness signal
(already noted in `docs/current-state.md` cross-cutting §2 and rebuild-plan 4.2).
- **Remediation:** make it a real probe, or rename/label the field as static.
  Not a launch blocker; no user-facing surface.

---

## P3 — Nits

### P3-1 — Author bio credentials require owner sign-off (FTC) — HOLD
`components/SocialProof.tsx` (`AuthorNote`) states first-person credentials
(assisting Guido Palau/Jimmy Paul/Jawara, Rihanna's day-to-day stylist, Nike
"Greatest Dynasty Ever", Harper's Bazaar/W/Wonderland/Coveteur, Sergio Hudson).
These are **self-sourced from Michael's manuscript "About the Author"** (his IP,
per the in-file comment) — not third-party testimonials or invented stats, so
**not removed** (removing real bio would be wrong; "keep Michael's voice").
- **Remediation:** owner (Michael) confirms each credential is accurate before
  go-live. Code already guardrails this intent.

### P3-2 — Em-dash density on `/` (26 occurrences) — NO ACTION
Reviewed for AI-tell patterns. The prose is deliberate, literary,
contemplative-brand voice (Cormorant Garamond display, reflective cadence). No
"in today's world / elevate / unlock the power / seamless / testament" tells
present; "unlock(s)" appears only as literal product copy ("EPUB unlocks in your
account"). Left as-is per "minimal edits, keep Michael's voice."

### P3-3 — `accent-[#B08D57]` inline hex on preorder checkbox — NO ACTION
`components/PreorderCheckout.tsx:65` uses `accent-[#B08D57]`. `#B08D57` is the
locked ACISS **antique-gold** token, not a banned legacy hex — passes the
`2B9999|C9A961` gate. Cosmetic-only; could be tokenized later.

---

## Documented NON-ISSUES (deliberate — not defects)

### NI-1 — accesslint WCAG 1.2.2 "captions" on motion `<video>` — NOT APPLICABLE
Static linters (accesslint) flag the motion `<video>` elements
(`components/motion/MotionAsset.tsx`) for missing caption tracks (WCAG 1.2.2).
**This does not apply here.** These are **silent, decorative** clips: there is
**no audio track**, they render `muted` + `aria-hidden="true"` + `tabIndex={-1}`,
and the container carries a text alternative via `role="img"` + `aria-label`
(`MotionAsset.tsx:152-153,170-179`). **WCAG 1.2.2 governs captions for
prerecorded _audio_ content; it does not apply to silent decorative video.**
Adding empty `.vtt` caption tracks would be a fake fix and is **deliberately not
done.** (axe-core, correctly, does not flag these.)

### NI-2 — Motion binaries absent from `/motion/*` — LATENT, not live
`public/motion/motion-manifest.json` declares assets `DELIVERED` but the
`.webm/.mp4/-poster.webp` binaries are not committed. `MotionAsset` degrades to
an ACISS gradient placeholder at zero CLS and never shows a broken-image icon
(`MotionAsset.tsx` degradation ladder). No a11y/layout defect results.

### NI-3 — Tap targets < 44px on inline text links — WCAG 2.2 exception
`scripts/mobile-qa.mjs` reports footer/prose text links (~17px tall) below 44px.
WCAG 2.2 SC 2.5.8 (Target Size Minimum, AA) sets the bar at **24×24 CSS px** and
**exempts targets that are inline** in a sentence/block — which is exactly these
links. The 44px figure is SC 2.5.5 (Enhanced, **AAA**), not the AA target.
The one non-inline control that measures small — the order-bump checkbox
(`PreorderCheckout.tsx:65`, 20×20) — is wrapped in a full-width `<label>` with
`p-4` padding, so its real hit area is the entire card. **No AA violation.**

---

## Pass-by-pass results

### 1. Functional / unit
- `pnpm test` → **71 passed / 15 files**, exit 0.
- **Live payment / opt-in e2e: NOT RUN** — requires real Stripe/Supabase/
  MailerLite/Resend/Turnstile keys not present in this environment. No checkout
  was simulated or faked. Webhook signature path reviewed statically (see pass 3).

### 2. Accessibility (WCAG 2.2 AA) — priority
- Audited `/ /preorder /book /about /free-chapter /reset /contact` with
  axe-core via Playwright chromium (`scripts/a11y-audit.mjs`).
- Before: 1 serious violation (P1-1 contrast on `/preorder`).
- After fix: **0 violations across all 7 routes.**
- NI-1 (captions) documented as a deliberate non-issue.

### 3. Security / legal (static)
- **CSP/headers:** `next.config.ts` — added HSTS + Permissions-Policy (P2-2 fixed);
  CSP still recommended (P2-1). X-CTO/Referrer/X-Frame present.
- **Stripe webhook signature:** VERIFIED — `app/api/stripe/webhook/route.ts:87`
  uses `stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)`;
  missing/invalid signature → 400 `bad_signature`; raw body read via
  `request.text()` (not parsed) so the signature stays valid. Idempotency via
  `webhook_events` table dedupe (`:14-16`).
- **Secrets scan:** `git grep -nE "sk_live_|whsec_|service_role" -- . ':!docs' ':!*.md'`
  → only a **test guard** in `tests/sandbox-integration-readiness.test.ts:22`.
  No real secrets committed.
- **Rate limiting:** Turnstile on all public forms + download quota; no generic
  IP limiter (P2-3, infra).
- **Legal pages:** all present — privacy, terms, cookies, refund-policy,
  preorder-policy, digital-delivery-policy (+ accessibility).
- **Consent (CCPA/CPRA):** `components/ConsentBanner.tsx` present, gates
  non-essential analytics (PostHog/GA4 consent-gated per current-state §2);
  "Essential only" opt-out provided.

### 4. Copy / claims (FTC)
- Scanned `/ /book /about /reset /preorder`.
- **No fabricated stats/awards/endorsements.** ProofBand figures (16 chapters /
  4 parts / 16 worksheets / 15 back-matter tools) are sourced to the manuscript
  (`components/design/ProofBand.tsx` comment). `content/testimonials.ts` is
  **empty by design** (real quotes only; component renders nothing).
- Author bio = self-sourced credentials → owner sign-off item (P3-1).
- No AI-tell phrasing to remove (P3-2). No edits needed.

### 5. Mobile QA (375 / 390 / 430px)
- `scripts/mobile-qa.mjs`: **no horizontal overflow** at any width on `/` or
  `/preorder` (scrollWidth == viewport at all three).
- Tap targets: only inline text links + label-wrapped checkbox flagged → NI-3,
  no AA violation.

### 6. Gate (final)
- `pnpm build` → exit 0 (Compiled successfully, 68 static pages generated).
- `pnpm lint` → exit 0 (`--max-warnings=0`).
- `pnpm typecheck` → exit 0.
- `pnpm test` → 71 passed, exit 0.
- `grep -rn "2B9999\|C9A961" app components lib styles` → **CLEAN**.

**GATE GREEN. P0 = 0, P1 = 0.**
