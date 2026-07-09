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

## Binaries — now present

The real Higgsfield binaries from `cc-motion-library.zip` are committed here for
the six DELIVERED assets: `hero-door`, `unfurling`, `room`, `chapter-peek`,
`burst`, `crown` — each as `.webm` (primary) + `.mp4` (fallback) + real
`-poster.webp`. Shipped `.webm` payload ≈ 4.5 MB (budget 12 MB). `MotionAsset`
resolves them straight from `motion-manifest.json` with no code change.

Still placeholders (real footage required, poster-only by design): `portrait`
(asset C) and `hands` (asset K) — tiny ACISS-gradient stand-ins from
`scripts/gen-motion-posters.mjs`. When that footage lands, drop the real
`portrait.*` / `hands.*` here and flip their manifest `status` to `DELIVERED`.
Re-run `node scripts/gen-motion-posters.mjs` any time you need to regenerate the
remaining placeholders.
