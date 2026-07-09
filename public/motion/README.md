# /public/motion — Higgsfield motion library

`motion-manifest.json` here is authoritative (Phase 3.5, generated 2026-07-08).
The binary assets are produced in Cowork + Higgsfield and delivered in
`cc-motion-library.zip`. Drop the contents of that zip's `motion/` folder here so
every `file` / `mp4` / `poster` path in the manifest resolves.

Expected binaries (per manifest, DELIVERED assets):

| id | webm | mp4 | poster |
|----|------|-----|--------|
| A hero-door | hero-door.webm | hero-door.mp4 | hero-door-poster.webp |
| B unfurling | unfurling.webm | unfurling.mp4 | unfurling-poster.webp |
| D room | room.webm | room.mp4 | room-poster.webp |
| F chapter-peek | chapter-peek.webm | chapter-peek.mp4 | chapter-peek-poster.webp |
| I burst | burst.webm | burst.mp4 | burst-poster.webp |
| L crown | crown.webm | crown.mp4 | crown-poster.webp |

DEFERRED (real footage required, poster-only until then): C portrait, K hands.
IN-CODE (no binary): J kinetic type — built as Cormorant Garamond SVG/CSS.

The `<MotionAsset>` component degrades gracefully: it renders the poster when a
video source is missing or `prefers-reduced-motion: reduce` is set, so the pages
build and render without the binaries — they just show posters until the zip is
placed here.
