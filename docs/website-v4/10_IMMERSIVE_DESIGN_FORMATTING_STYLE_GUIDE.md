<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE — v4 Curls Experience

## 1. Design mandate
The site must feel premium, editorial, emotional, immersive, and conversion-focused. It may reference Textura-style principles only: emotional first impression, spaced editorial typography, immersive 3D/motion, strong page transitions, cursor-follow delight, and bespoke digital experience. Do **not** copy Textura assets, code, copy, layout, or identity.

## 2. Original Curls & Contemplation interaction system
- Hair/curl cursor trail.
- Magnetic curl CTA.
- 3D/layered book hero.
- Chapter pathway.
- Scroll reveals.
- Page transitions.
- Reduced-motion-safe interactions.

## 3. First-three-sections emotional structure
Home page order is locked:
1. **Recognition:** “You learned the craft. Nobody taught you the business.”
2. **Relief:** The visitor is not behind; there is a path.
3. **Authority/path:** The book turns scattered freelance experience into a deliberate career path.

## 4. Page-by-page visual setup
- `/`: Obsidian hero, layered book, hairline gold rules, jade path reveal.
- `/book`: editorial product essay with book mockup and chapter architecture.
- `/preorder`: focused conversion page with minimal distraction and trust/legal notes.
- `/buy`: post-launch product cards, direct bundle first, external Kindle/paperback secondary.
- `/free-chapter`: quiet form page with sample promise and no fake urgency.
- `/chapters`: chapter pathway as a guided route through the book.
- `/chapter/[slug]`: preview article with reading-safe typography.
- `/blog` and `/blog/[slug]`: editorial journal style, high readability.
- `/resources`, `/worksheets`: customer-supportive, practical, calm.
- `/about`: portrait-led, claim-gated, premium biography.
- `/media-kit`: clean press utility; downloadable assets only when approved.
- `/faq`, `/contact`, legal pages: trust-first utility; motion minimal.
- `/signup`, `/login`, `/logout`: calm auth screens; no distracting motion.
- `/dashboard`, `/downloads`, `/bonus-claim`: functional premium surfaces; motion does not interrupt tasks.
- `/admin/*`: utility-first admin shell; no decorative motion.

## 5. 3D/motion rules
- Motion supports comprehension and feeling; it never replaces copy.
- Use CSS transforms and lightweight React effects, not heavy 3D libraries unless approved.
- Keep pointer tilt under 8 degrees.
- Keep parallax under 24px.
- Avoid continuous animation on checkout/auth/download/admin pages.
- Avoid motion that changes layout after user input.

## 6. Curl cursor trail
Component target: `components/motion/CurlCursorTrail.tsx`.

Behavior:
- Small trailing curl strokes follow pointer on fine-pointer devices.
- Uses Deep Jade and Antique Gold with low opacity.
- Disappears over forms, checkout CTAs, auth fields, and when reduced motion is enabled.
- Must not capture pointer events.

## 7. Magnetic curl CTA
Component target: `components/motion/MagneticCurlCTA.tsx`.

Behavior:
- CTA subtly leans/pulls toward cursor within a small radius.
- Focus and keyboard states remain static and clear.
- Disabled during form submission and checkout redirect.
- Reduced motion uses standard hover/focus color only.

## 8. Page transitions
Component target: `components/motion/PageTransition.tsx`.

Behavior:
- Obsidian/gold editorial wipe or fade between marketing pages.
- No long loader before checkout or auth.
- Reduced motion removes slide/wipe and uses instant/fade transition.

## 9. Book tilt
Component target: `components/book/BookTiltHero.tsx`.

Behavior:
- Layered cover/card with soft gold shadow.
- Pointer tilt only on desktop/fine pointer.
- Static image fallback for mobile/reduced motion.
- Must use approved cover artwork when available; no fake cover claims.

## 10. Chapter pathway
Component target: `components/book/ChapterPathway.tsx`.

Behavior:
- Path-like progression through chapters/parts.
- Deep Jade marks active/hovered step.
- Antique Gold marks completed/featured cues.
- Accessible as semantic list/nav.

## 11. Scroll reveals
Component target: `components/motion/ScrollReveal.tsx`.

Behavior:
- Fade/translate content into view once.
- No reveal delay that blocks reading.
- Reduced motion renders content immediately.

## 12. Reduced motion requirements
CSS and JS must check `prefers-reduced-motion`.
When reduced:
- Disable cursor trail.
- Disable magnetic movement.
- Disable parallax and pointer tilt.
- Disable wipe/slide page transitions.
- Keep visible focus and state changes.

## 13. Accessibility requirements
- Maintain WCAG 2.2 AA contrast.
- All interactive effects must be keyboard-accessible or decorative only.
- Decorative motion elements use `aria-hidden="true"`.
- Forms have explicit labels and errors.
- No animation flashes.

## 14. Performance budget
- Initial JS should remain lean; avoid heavy animation/3D packages unless justified.
- Hero imagery optimized through Next image pipeline when available.
- Cursor trail limited to few elements/canvas draw cycle and disabled on low-capability contexts.
- Target Lighthouse performance/accessibility pass before launch.

## 15. Exact components/styles Codex must generate in Prompt 3/4
Prompt 3 should generate:
- `app/globals.css` with ACISS variables and reduced-motion base styles.
- `components/motion/CurlCursorTrail.tsx`.
- `components/motion/MagneticCurlCTA.tsx`.
- `components/motion/PageTransition.tsx`.
- `components/motion/ScrollReveal.tsx`.
- `components/book/BookTiltHero.tsx`.
- `components/book/ChapterPathway.tsx`.
- `components/ui/Button.tsx`, `Card.tsx`, `Container.tsx`, `Section.tsx`.
- Tests or checks for reduced-motion and deprecated tokens.
