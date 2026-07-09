# Port Spec — Immersive Redesign → Next.js app

**Goal:** ship the immersive redesign (`docs/redesign/curls-contemplation-redesign.html`) as the live curlscontemplation.beauty — old CSS discarded, all motion wired, cover→curl→reveal intro, revamped SEO + CTA funnels. **Execute in a build-capable session (Claude Code in the repo) or by a dev.** Do NOT merge until `npm run build && npm test && npm run lint` are green (paste output in the PR) — the launch gate from docs/rollback-runbook.md.

Branch: `redesign/immersive-landing-prototype` (PR #21). Add port commits here.

## Guardrails (locked)
- ACISS tokens only: Obsidian #111111, Antique Gold #B08D57, White Gold #D8D1C5, Deep Jade #145B4B, Jade Mist #C7D9D2. Banned: #2B9999, #C9A961. Display face Libre Baskerville (Cinzel retired). Reuse aciss.css — don't fork.
- Pen name “Michael David” only. Never the legal name in copy/metadata/JSON-LD.
- Real footage only. No generated hair/faces. C portrait + K hands stay poster-only (deferred).
- Funnels locked — wire, don't redesign. Reuse existing routes.
- Motion via existing MotionAsset (manifest-driven, IntersectionObserver, reduced-motion→poster). Feed the manifest; don't hand-roll <video>.

## Reuse (confirm exact paths on read)
- Components: MotionAsset, Section (wraps ScrollReveal), ScrollReveal, KineticHeadline, PreorderCountdown, CinematicJourney (/journey), GoogleAnalytics, PostHogProvider, consent banner.
- Config/libs: config/launchState.ts (launch-state + deliveryCopy), content/site.ts (RELEASE_DATE=2026-11-24), lib/env.ts (getStripeConfig, getMailerLiteConfig, getLaunchMode), lib/stripe.ts (resolveServerPriceId, checkoutUrls), lib/analytics.ts.
- Motion manifest: public/motion/motion-manifest.json. Assets: A hero-door, B unfurling, D room, F chapter-peek, I burst (thank-you), L crown, J kinetic headline.

## New / changed components
1. components/intro/CoverReveal.tsx (NEW) — immersive open: cover (typographic ACISS + gold-swirl SVG, or hf_ cover video once added) → on enter/auto/scroll, cover scales+fades while unfurling (B) swirls behind → reveals app. Respect prefers-reduced-motion (skip to revealed); set body.revealed for nav/hero. Fire once per session (cookie/session, not localStorage).
2. components/nav/SiteNav.tsx (revamp) — sticky, hidden until revealed, solid on scroll. Links: The Book · The Journey · For Stylists · Free Chapter · Preorder(CTA→launch-state).
3. app/page.tsx (revamp) — Hero (hero-door + KineticHeadline) → The Book (unfurling) → The Journey (room → /journey) → For Stylists (3 pillars, REPLACES the old 4-part block) → Preorder (crown + launch-state price/date) → Free Chapter (chapter-peek + capture) → slim Author → Footer.
4. About/author — delete the 4-part structure; single slim bio, pen name only.
5. app/layout.tsx — consent banner, analytics providers, fonts (Libre Baskerville + Cormorant Garamond), global ACISS tokens. Remove old CSS the redesign supersedes.

## SEO (technical/on-page, in code)
> /seo-machine is a content/keyword skill (blog posts, clusters, gap analysis) — use it for a launch content plan, NOT for this port. On-page SEO belongs in the Next.js metadata API.
- Per-route metadata export (title, description, canonical, OG, Twitter, og:image).
- JSON-LD Book + Person (author “Michael David”, publisher “TAYLKOMB LLC”, datePublished 2026-11-24) — no legal name.
- app/sitemap.ts + app/robots.ts; real alt on meaningful media, empty alt on decorative. Preserve Phase 6 WCAG AA + headers.

## CTA → funnel wiring (locked funnels; wire to existing endpoints)
- Preorder CTA → launch-state → POST /api/checkout (Stripe resolveServerPriceId) → /thank-you (fires burst I). Price/date from launch-state, not hardcoded.
- Free Chapter → POST /api/free-chapter (Turnstile) → MailerLite free_chapter + Resend Chapter 1 → /thank-you tripwire.
- Quiz → QuizFlow → POST /api/quiz → MailerLite quiz group.
- Challenge → POST /api/subscribe (source=challenge).

## hf cover video
- Add uploaded hf_…mp4 to public/motion/cover-open.mp4 (+ .webm + -poster.webp if possible); register in motion-manifest.json; point CoverReveal at it (poster + reduced-motion fallbacks). Until added, CoverReveal uses the SVG/typographic cover.

## Acceptance checklist (paste in PR #21 before merge)
- [ ] npm run build exit 0 · npm test green · npm run lint 0 warnings (pasted).
- [ ] Banned-token grep clean; no legal name anywhere.
- [ ] Intro respects prefers-reduced-motion; motion degrades to posters; CLS ~0.
- [ ] /api/health → paymentsLive:true, subscriptionsLive:true; checkout returns a session (no 502).
- [ ] Consent-gated analytics: nothing fires before “Allow analytics”.
- [ ] Lighthouse mobile pass; axe a11y clean.
- [ ] Merge = production deploy → its own [GATE] approval; rollback target noted.

## Execution options
- A (recommended): run this spec in Claude Code inside the repo — reads the full tree, ports every component, runs build/test/lint, opens a verified PR.
- B: port here in verifiable slices (start: tokens + CoverReveal + hero); run the build after each and confirm green before the next.
