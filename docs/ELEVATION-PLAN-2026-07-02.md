# Elevation Plan — Immersive Experience & Navigation
**Design north star:** the uploaded inspiration recording — dark-luxury editorial commerce: full-bleed cinematic imagery on near-black, warm gold light, oversized serif display type, sticky media panels with copy trading places over them, uppercase micro-labels, hairline dividers, ghost CTAs. Mapped 1:1 onto ACISS: Obsidian `#111111` is the stage, Antique Gold `#B08D57` is the light, White Gold `#D8D1C5` is the voice, Cormorant Garamond is the typeface. *Black leads. Gold elevates. Jade distinguishes.*

**Atoms guide compliance (combined-build intent: assemble existing + create missing):**
- 01 Image Reveal → **exists** (`CursorReveal`, homepage) — kept.
- 03 Mouse Scrub → **exists** (`MouseScrubVideo`, /about) — kept.
- 04 Scroll Scrub → **exists** (`ScrollScrubVideo`, /book, real `curl-scrub.mp4/webm`) — kept; not duplicated on home (repetition dulls the move).
- 02 Scroll-Triggered Video → deliberately not added: the homepage entrance is already the `JourneyExperience` camera walk; a play-once gate in front of it would double-gate the fold. Documented decision, reversible.
- 05 Combined flow → the homepage now reads: **camera enters the book (Journey) → editorial camera-hold (new) → cursor reveal → pathway → capture**.

## Shipped in this pass
1. **`lib/navigation.ts`** — single source of truth for the five-item launch IA: Home / About the Book / About the Author / Order / Contact. Desktop, mobile, and any future surface consume the same array. Order resolves to `/preorder` (checkout lives there; flips to `/buy` automatically with `NEXT_PUBLIC_LAUNCH_MODE=launched` via the existing LaunchModeCTA).
2. **`components/SiteHeader.tsx`** (client) + thin server `Header` — scroll-aware: fully transparent over the cinematic entrance, condensing into obsidian glass with a gold hairline after 24px of scroll (motion/react spring, transform/opacity only). Active route carried by a shared-layout gold underline (`layoutId`) + `aria-current="page"`. 44px+ targets. Zero CLS (fixed heights).
3. **`components/MobileNav.tsx`** — consumes the shared nav, staggered panel entrance (motion/react `AnimatePresence`), Escape/scroll-lock/portal behavior preserved, honors reduced motion.
4. **`components/journey/EditorialCameraHold.tsx`** — the inspiration recording's signature move, built with motion/react `useScroll` + `useTransform`: a 260vh track pins a full-viewport media stage; three scenes (existing art: `curl-poster`, `curl-front`, `gateway-cover`) cross-dissolve with a slow 1.06→1.0 settle (camera pulling focus) while micro-label + serif display copy trades places. Reduced-motion/no-JS: renders the three panels as ordinary stacked sections — copy never hidden from crawlers.
5. **`motion` dependency added** (`motion/react` — never framer-motion).
6. Homepage assembly updated; all existing sections, SEO copy, JSON-LD, and funnel CTAs untouched.

## Higgsfield (discretion exercised)
Skipped generation this pass — the repo carries a locked, art-directed asset set (`curl-*` series shot in the brand light), and injecting AI plates 12 days out risks visual drift for marginal gain. If you want one, the highest-leverage shot is a single **order-page atmosphere plate**: "macro spiral curl in obsidian darkness, one antique-gold rim light, shallow depth, negative space left third, 21:9" — say the word and I'll run it and wire it.

## Post-launch backlog (from error doc)
Webhook helper extraction (P2-8), dependency pinning (P2-9), contact form (P3-11), F3 challenge capture opening.
