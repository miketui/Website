# 10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md — ACISS × Felt × Textura-Inspired Experience System

## Purpose
This file gives Codex the missing design/styling/motion layer for the Curls & Contemplation author-commerce platform.

The goal is not a normal author website. The goal is a premium editorial web experience that makes visitors feel:
1. seen as working beauty professionals,
2. emotionally understood before they are sold,
3. curious enough to stay,
4. confident enough to preorder or buy,
5. safe enough to create an account and download paid files.

Reference inspiration:
- Textura agency’s site uses spaced editorial typography, strong emotional positioning, bespoke/elite-brand framing, immersive 3D/motion language, featured-work sequencing, and “felt/remembered/desired” positioning.
- Do not clone Textura’s assets, layout, code, copy, brand, or exact interactions.
- Translate the *principles* into an original Curls & Contemplation system: hair movement, curl trails, editorial book surfaces, black/gold/jade luxury, and emotionally staged conversion.

## Core design thesis
**The first three sections must make the visitor feel something before asking them to buy.**

Sequence:
1. **Recognition:** “You learned the craft. Nobody taught you the business.”
2. **Relief:** “There is a path; you are not behind.”
3. **Authority:** “This book comes from someone who has lived the freelance/on-set world.”

Only after those emotional beats should the page push the preorder/buy argument.

## ACISS visual law
- Black leads.
- Gold elevates.
- Jade distinguishes.
- White Gold softens.
- Motion must feel like hair, not tech demo.

Locked palette:
```css
:root {
  --aciss-obsidian: #111111;
  --aciss-antique-gold: #B08D57;
  --aciss-white-gold: #D8D1C5;
  --aciss-deep-jade: #145B4B;
  --aciss-soft-jade-mist: #C7D9D2;
}
```

## Typography direction
Use editorial contrast:
- Display: Cormorant Garamond or another high-trust editorial serif.
- Body/UI: Inter or another modern readable sans.
- Section labels: spaced uppercase, restrained, not gimmicky.
- Pull quotes: large serif, high contrast, short lines.
- Do not overuse letter spacing on body text. Use it for labels, hero title accents, and motion moments only.

## Motion principles
Use Motion/Framer-compatible React animations only when they improve emotional flow.

Rules:
- Must honor `prefers-reduced-motion`.
- Must not block purchase, auth, checkout, dashboard, or downloads.
- Must use transform and opacity first.
- Avoid layout-thrashing mousemove handlers.
- Use requestAnimationFrame for cursor effects.
- No heavy 3D on checkout/auth/downloads.
- Home can have the richest motion.
- Commerce routes must be elegant, fast, and stable.
- Legal pages should be mostly static.

## Signature interaction: Curl Cursor Trail
Create an original interaction inspired by the Textura-style “letters chase the mouse” effect, but make it brand-native.

Component:
`components/motion/CurlCursorTrail.tsx`

Behavior:
- Small curl glyphs, hair-strand arcs, or SVG curl particles softly follow the cursor.
- Particles should feel like curls following motion, not literal Textura letters.
- Use 6–12 particles max on desktop.
- Disable on touch devices.
- Disable under `prefers-reduced-motion`.
- Disable on auth, checkout, dashboard, downloads, legal pages.
- Use `pointer-events: none`.
- Color alternates between Antique Gold and Deep Jade with low opacity.
- Should be subtle enough to feel premium, not playful/cartoonish.

Suggested glyph set:
```ts
const CURL_GLYPHS = ["∿", "〰", "⌁", "◜", "◝", "◞", "◟"];
```

Better option:
Use tiny inline SVG curls instead of text glyphs:
- stroke: currentColor
- no fill
- strokeLinecap round
- 16–28px
- opacity 0.12–0.4
- blur 0–1.5px

## Signature interaction: Magnetic Curl CTA
Component:
`components/motion/MagneticCurlButton.tsx`

Behavior:
- CTA subtly moves 3–8px toward cursor on hover.
- A curl ring or hairline orbit wraps the button.
- On hover, the ring resolves into a clean underline or border shimmer.
- Button text must remain readable.
- Use this only for primary CTAs:
  - Preorder — $17.99
  - Buy the Book — $19.99
  - Get Chapter 1 Free
  - Download Your Book

Accessibility:
- Normal button focus ring required.
- Keyboard users must get visible focus state.
- Reduced motion gets static hover/focus style.

## Page transition system
Component:
`components/motion/PageTransition.tsx`

Use a restrained editorial transition:
- Fade in page shell: 160–240ms
- First section rises 12px: 280–420ms
- Background wash shifts from obsidian to deep jade gradient very subtly
- Never animate layout during checkout/auth form submission
- Route transitions must not break Next.js streaming/Suspense

## 3D / immersive hero system
Use 3D only where it earns attention.

Home hero:
- 3D book mockup or layered cover panels.
- Slow parallax tilt on mouse movement.
- Floating paper/strand/curl elements.
- Light source: antique gold rim, jade shadow.
- Static fallback image required.
- Motion disabled on reduced motion.

Book page:
- Less motion than home.
- Book cover, pages, worksheet cards, and “inside the book” chapter stack.

Preorder page:
- Focused and fast.
- Only one hero movement: book + bonus cards gently reveal.

Dashboard/downloads:
- No decorative 3D. Use trust, clarity, and speed.

## First-three-sections emotional structure

### Home page
Section 1 — Recognition Hero
- Headline: “You learned the craft. Nobody taught you the business.”
- Visual: 3D book + slow curls/strands floating behind it.
- Motion: curl cursor trail active; hero book tilt; staggered headline reveal.
- CTA: Preorder — $17.99
- Secondary: Read Chapter 1 Free

Section 2 — The Unspoken Problem
- Copy angle: stylists are skilled but unsupported in pricing, networking, leadership, burnout.
- Visual: split editorial cards: Craft / Business / Longevity.
- Motion: cards reveal as visitor scrolls; subtle hairline dividers draw in.

Section 3 — The Relief / Path
- Copy angle: 16 chapters that turn scattered experience into a deliberate career path.
- Visual: chapter pathway ribbon or vertical “career spine.”
- Motion: path draws downward; chapter dots light in gold/jade.

### Book page
Section 1 — Book as Object
- Large book cover, premium product presentation.
- CTA: Preorder/Buy based on launch mode.
- Motion: 3D book tilt, restrained.

Section 2 — What This Solves
- Pricing, on-set etiquette, network, burnout, leadership.
- Use “before/after” emotional cards.

Section 3 — Inside the Book
- Chapter groups, worksheets, reflection prompts.
- Motion: tabs/cards, not heavy animation.

### Preorder page
Section 1 — Offer
- “Preorder the direct edition.”
- Price: $17.99.
- Bonus promise only if actual deliverables exist or are marked pending.
- CTA: Preorder — $17.99.

Section 2 — Why Direct
- EPUB + PDF + worksheets/bonus dashboard.
- Clear Amazon $9.99 comparison without shaming.

Section 3 — What Happens Next
- Preorder → confirmation → bonus claim/account → launch email → download.

### Buy page
Section 1 — Choose Your Format
- Product cards.
- CTA: Buy the Book — $19.99.

Section 2 — Delivery Trust
- Secure checkout, account access, private download.
- No gimmick motion.

Section 3 — What You Get
- EPUB/PDF/worksheets/dashboard.

### Free Chapter
Section 1 — Promise
- “Read the first chapter before you decide.”
- Email capture.
Section 2 — What You’ll Learn
- 3 bullets.
Section 3 — Bridge
- “If this sounds like the career you’re building, the book continues the path.”

### Dashboard
Section 1 — Welcome
- Clear “You’re in.”
Section 2 — Purchases
- Download buttons.
Section 3 — Worksheets / Next best action
- Calm, clear, zero decorative motion.

## Page-by-page formatting requirements

### `/`
- Background: obsidian.
- Hero: full viewport minimum 86vh on desktop, 72vh mobile.
- Use a luxury editorial grid.
- Primary CTA visible above fold.
- Curl cursor trail active on desktop.
- 3D book mockup allowed.
- First 3 sections must be immersive and emotional.

### `/book`
- Product detail page, still premium.
- Use long-form sales argument with sticky preorder/buy card on desktop.
- Chapter cards in four parts.
- Pull quote blocks.

### `/preorder`
- Conversion page.
- Fewer links.
- Sticky bottom CTA on mobile.
- Price and bonus box visible early.
- Explain release timing honestly.

### `/buy`
- Post-launch commerce.
- Product cards.
- Trust badges.
- Refund/digital delivery note.
- Low-motion.

### `/free-chapter`
- Lead capture page.
- Soft jade mist background sections.
- Form must be frictionless.
- Clear privacy reassurance.

### `/chapters` and `/chapter/[slug]`
- Editorial reading preview.
- Chapter index should feel like a table of contents becoming a pathway.
- Individual chapter previews should end with one CTA.

### `/blog` and `/blog/[slug]`
- SEO-readable, not overanimated.
- Blog cards use editorial image placeholders and category labels.
- Related posts and book CTA.

### `/resources` and `/worksheets`
- Card grid with labels: Free, Email-gated, Customer-only.
- Locked items show upgrade/buy CTA.
- Do not fake available downloads.

### `/about`
- Story-first.
- Credibility claims must be verified.
- Use portrait placeholder if no approved author image exists.
- Motion: slow reveal timeline.

### `/media-kit`
- Utility page.
- Minimal motion.
- Download assets only if assets exist.

### `/faq`
- Accordion.
- Search/filter optional.
- Trust-focused.

### Auth pages
- Calm, premium, fast.
- No curl cursor trail.
- No heavy 3D.
- Use small book/brand mark only.

### Legal pages
- Static, readable, accessible.
- No decorative cursor/motion.

## Required design/motion components
Codex must create or scaffold:

```text
components/motion/CurlCursorTrail.tsx
components/motion/MagneticCurlButton.tsx
components/motion/PageTransition.tsx
components/motion/ScrollReveal.tsx
components/motion/BookTilt.tsx
components/motion/ChapterPathway.tsx
components/motion/ReducedMotionProvider.tsx
components/design/Section.tsx
components/design/EditorialGrid.tsx
components/design/PullQuote.tsx
components/design/AcissDivider.tsx
components/design/ExperienceCard.tsx
components/design/StickyPurchaseCard.tsx
```

## Required style files
Codex must create:

```text
author-site/app/globals.css
author-site/styles/aciss-tokens.css
author-site/styles/motion.css
author-site/styles/typography.css
author-site/styles/page-experiences.css
```

## Performance budget
- Home initial JS must stay reasonable.
- Lazy-load heavy motion/3D components.
- No decorative component should block LCP.
- Use static fallback for book mockup.
- Avoid autoplay video unless explicitly approved.
- Use `next/image` for raster images.
- Prefer CSS/SVG for curl effects.

## Accessibility requirements
- `prefers-reduced-motion` honored everywhere.
- Buttons remain buttons/links semantically.
- Cursor effects never hide real cursor or content.
- Keyboard focus visible.
- Color contrast WCAG 2.2 AA.
- Form errors are announced.
- No motion-only information.

## Codex acceptance criteria
Codex is not done until:
- This design guide is reflected in generated components and page layouts.
- Every page has a clear visual setup and section hierarchy.
- First three home sections use emotion-first flow.
- Curl cursor trail exists and is safely disabled where inappropriate.
- Magnetic CTA exists.
- Build passes or blockers are documented.
