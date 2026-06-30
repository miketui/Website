# Author Site Audit — Curls & Contemplation

**Date:** 2026-06-20
**Scope:** `author-site/` (Next.js App Router author-commerce platform)
**Branch:** `claude/brave-goldberg-svuzrq`
**Method:** Full file inspection + live toolchain run in this environment.

---

## 0. Headline verdict

The site is **code-complete and green on the toolchain**, but **not launch-ready** because it
is intentionally waiting on *external configuration and binary content*, not code. The build,
types, and tests all pass right now. What is "missing" is almost entirely: real provider keys,
the actual book/worksheet files uploaded to storage, a domain, and human legal review.

- **Emotional first impression (first 3 seconds):** Present and well-built — a cinematic
  "book gateway" intro. Strong, but with three caveats (see §3). **Grade: B+.**
- **Cursor feature:** **Enabled and live** site-wide (the "CurlTrail" glyph cursor). See §4.
- **Biggest real gaps:** no `.env.local` values wired, no binary deliverables uploaded to
  Supabase, domain undecided, legal copy is outline-only. See §5.

---

## 1. Toolchain evidence (run 2026-06-20 in this environment)

| Command | Result |
|---|---|
| `pnpm install` | ✅ exit 0 (clean) |
| `pnpm typecheck` (`tsc --noEmit`) | ✅ 0 errors |
| `pnpm test` (vitest) | ✅ 13 files / **60 tests passed** |
| `pnpm build` (`next build`) | ✅ exit 0 — all routes compile |

The build output reports `ƒ Proxy (Middleware)` — i.e. `proxy.ts` *is* the active Next.js
middleware (newer Next naming). So although `AGENTS.md` lists `middleware.ts` as a required
file, there is **no actual gap**: the middleware exists as `proxy.ts` and runs. It only sets
`noindex` headers on protected routes — auth enforcement lives in the page/route layer (§6).

---

## 2. Route & capability coverage

Every public, auth, admin, and API route required by `author-site/AGENTS.md` exists and builds.

- **Public (22):** `/`, `/book`, `/preorder`, `/buy`, `/free-chapter`, `/chapters`,
  `/chapter/[slug]` (4 SSG), `/blog`, `/blog/[slug]`, `/resources`, `/worksheets`, `/about`,
  `/media-kit`, `/faq`, `/contact`, `/privacy`, `/terms`, `/refund-policy`, `/preorder-policy`,
  `/digital-delivery-policy`, `/cookies`, `/accessibility` — all present.
- **Funnel/staged:** `/quiz`, `/quiz/results/[archetype]` (4 SSG), `/challenge`, `/thank-you`
  — present; staged pages are `noindex` + robots-disallowed.
- **Auth/customer:** `/signup`, `/login`, `/logout`, `/dashboard`, `/downloads`,
  `/bonus-claim` — present.
- **Admin:** `/admin`, `/admin/orders`, `/admin/subscribers`, `/admin/claims`,
  `/admin/content`, `/admin/analytics` — present, gated by `requireAdmin()`.
- **API:** `/api/checkout`, `/api/stripe/webhook`, `/api/downloads/sign`, `/api/subscribe`,
  `/api/free-chapter`, `/api/bonus-claim`, `/api/track`, `/api/health` — present.

**Design system & immersive layer** (all reduced-motion-safe): ACISS tokens
(`styles/aciss-tokens.css`), `BookGateway`, `CurlTrail`, `BookTilt`, `MagneticCurlButton`,
`ChapterPathway`, `ScrollReveal`, `PageTransition`, `ReducedMotionProvider`.

---

## 3. First three seconds — does it reach the viewer's emotions?

**Short answer: yes, deliberately — but read the caveats.**

The intended first impression is the **`BookGateway`** overlay (`components/gateway/BookGateway.tsx`),
shown full-screen on first visit:

1. ~1.05s loader: a gold hairline drawn across obsidian under the "Curls & Contemplation"
   wordmark.
2. Atmosphere canvas (jade/gold particles + aurora), a book rising from depth, a kinetic
   masked headline *"A book that opens like a threshold,"* and a magnetic **"Open your mind"**
   CTA.
3. Click → the book "opens" into the homepage (fade + wash), announced to screen readers.

This is genuinely emotional design — it targets *curiosity / anticipation / premium calm*,
which matches the `AGENTS.md` "Textura-style emotional first impression" requirement. It is
SSR-safe, fully skippable ("Skip intro"), and honors `prefers-reduced-motion` (calm crossfade).

**Three caveats that hold it back from an A:**

1. **First-visit only.** The gateway is gated by `sessionStorage` (`curls-gateway-seen`). On
   every revisit the cinematic is skipped and the user lands directly on `BookHero`. So the
   "emotional 3 seconds" is *not* the consistent first impression for returning visitors — for
   them it's the hero (which is fine, but it means the cinematic is a one-time event).

2. **The emotional *recognition copy* sits behind a click.** The single most emotionally
   resonant line on the site is the hero H1 — *"You learned the craft. Nobody taught you the
   business."* (`components/BookHero.tsx:14`). On a first visit that line is *behind* the
   gateway. The gateway's own copy ("a book that opens like a threshold") is atmospheric and
   abstract, not pain-aware. A first-timer feels *mood* in 3s but doesn't yet feel *seen*.

3. **The homepage is missing an explicit "Relief" beat.** `AGENTS.md` requires the first three
   home sections to be **Recognition → Relief → Authority/path**. Current order
   (`app/page.tsx`) is: Hero (recognition) → "The unspoken problem" (more recognition) → "The
   path forward" (authority). There is **no distinct Relief section** — the "it's not your
   fault / there is a calmer way" exhale is implied, not staged. This is a real, actionable gap
   against the project's own spec.

**Recommended (low-risk) improvements** — see WHAT_TO_DO_NEXT.md §7:
- Add a one-line pain-aware hook inside the gateway so first-timers feel *seen* in 3s.
- Insert a short **Relief** section between "The unspoken problem" and "The path forward."
- Consider replaying the gateway for genuinely new sessions only (current behavior is fine;
  just confirm it's the intent).

---

## 4. Cursor feature — is it enabled?

**Yes. It is enabled and live across the site.**

- Component: `components/CurlTrail.tsx` (gold "curl" glyph that follows the pointer and spawns
  small curl marks + the sequential letters of the word `CURLS` along the movement path; a
  tap-burst fires on touch devices).
- Mount: `components/SiteCurlTrail.tsx` is rendered in `app/layout.tsx`, so it is **site-wide
  by default**.
- **Intentionally excluded** on auth, commerce (`/buy`, `/checkout`), legal, and utility routes
  (`/dashboard`, `/downloads`, `/admin`, `/bonus-claim`, `/thank-you`) via
  `lib/route-policy.ts` — so it never distracts during checkout, login, or downloads
  (this satisfies the frontend rule "no heavy decorative motion on checkout/auth/admin/legal/
  download flows").
- **Safe:** no-ops under `prefers-reduced-motion`, `pointer-events: none` (never blocks clicks
  or selection), SSR-safe, fixed particle pool with full cleanup on unmount.

**Nothing to enable** — it already works. If you want it on more/fewer pages, edit the prefix
lists in `lib/route-policy.ts`. If you want a different trailing word or density, the
`CurlTrail` props (`word`, `spawnDistance`, `maxParticles`, `lifetime`) are the knobs.

---

## 5. What's missing (the real gaps)

None of these are code defects. They are the launch checklist. Grouped by type:

### A. Configuration — **blockers for any live behavior**
- **No `.env.local`.** `.env.example` lists every variable *name* (correct, per security
  rules) but no values exist. Nothing is wired to Supabase/Stripe/MailerLite/Resend/Turnstile.
- **Domain undecided.** `NEXT_PUBLIC_SITE_URL` is unset; `siteConfig.siteUrl` falls back to
  `http://localhost:3000` (`content/site.ts:6`).

### B. Binary deliverables — **not uploaded to storage**
The code points at these storage objects, but the files are not in any bucket yet:
- **Paid (private `curls-deliverables`):** the EPUB and POD PDF. Source files live in the repo
  at `release/` and must be uploaded to Supabase private storage — **never** to `public/`.
- **Free (public `curls-free`):** Chapter-1 excerpt, Pricing Confidence Checklist
  (`lib/free-assets.ts`).
- **Products/funnels:** Affirmation Deck (`lib/downloads.ts`), Companion Workbook, 4 quiz
  worksheets, 5 challenge-day PDFs (`content/funnels.ts`).

✅ Verified: **no paid files are in `public/`** today, and all paid references are storage
paths, not public URLs. `public/` currently holds only `og-default.png` and `gateway-cover.jpg`.

### C. Providers — scaffolded, not connected (production intentionally gated)
- Supabase project + migration `0001_author_commerce.sql` applied; private bucket created.
- Stripe products/prices ($17.99 preorder, $19.99 regular) + webhook endpoint (test mode).
- MailerLite groups (10) + Resend verified sender (SPF/DKIM/DMARC).
- Turnstile keys; GA4 / PostHog / Sentry (all optional, consent-gated).

### D. Content
- **Real book cover:** the hero shows a CSS-rendered `BookMockup`, not a real cover image
  (`components/BookMockup.tsx`). A real cover render would lift the first impression.
- **Blog:** only 2 stub posts (`content/blog.ts`).
- **Thank-you video:** `NEXT_PUBLIC_THANKYOU_VIDEO_ID` empty → falls back to a pull-quote panel.

### E. Legal & claims (human review required)
- Legal pages are **outlines** (`content/legal-outlines.ts`) — need attorney review before
  launch.
- Credibility claims are traceable to `claims-evidence.md`. Note: `book.credibilityNote` still
  contains a `[VERIFY: claims-evidence.md]` marker, but it is **not rendered anywhere public**
  (data only) — safe, but tidy it before it ever gets surfaced.

### F. Nits (low priority)
- `.env.sandbox.example:55` defines `TURNSTILE_SITE_KEY` (no `NEXT_PUBLIC_` prefix), which is
  not a variable the code reads. Only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
  are used. Harmless, but misleading — remove or correct.
- `/dashboard` renders placeholder copy without a session guard. It exposes no sensitive data,
  but it neither redirects nor personalizes when signed out. Consider gating or clearly
  labeling it as a signed-in surface.

---

## 6. Security posture (brief)

Strong, and consistent with `.claude/rules/security.md`:
- Stripe webhook verifies signature before minting entitlements; refund revokes entitlement.
- Downloads fail closed: server-side entitlement check + signed URLs from a private bucket +
  3-downloads / 7-day cap (`app/api/downloads/sign/route.ts`, `lib/downloads.ts`).
- Admin surfaces gated by `requireAdmin()` (session + `ADMIN_EMAILS` allowlist).
- **Watch item (already mitigated):** spoofable `cc_demo_*` session cookies are honored only
  when `ALLOW_DEMO_SESSION=1`. Confirm this is **never set in production** (it must stay empty
  in `.env.example`, which it is).

---

## 7. One-line summary

> The website is built, green, and secure; it is waiting on keys, files, a domain, and a
> lawyer — not on engineering. The cinematic intro and the curl cursor both work; the homepage
> just needs an explicit "Relief" beat and an earlier emotional hook to fully land the first
> three seconds.

See **`docs/WHAT_TO_DO_NEXT.md`** for the ordered setup runbook and the `.env.local` template.
