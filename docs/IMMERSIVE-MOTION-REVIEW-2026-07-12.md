# Immersive Motion Review — July 12, 2026

## Outcome

`/website` now serves the established cinematic experience already used by `/journey`. It reuses one implementation and one asset set, preventing duplicate downloads and divergent motion behavior.

## Verified implementation

| Gate | Evidence | Result |
|---|---|---|
| Scroll-driven visual narrative | `CinematicJourney` maps scroll progress to a 90-frame canvas sequence with five dwell regions. | Pass |
| 3D/depth impression | Cover-scaled cinematic frames, layered editorial overlays, depth markers, and ambient particle canvas. | Pass |
| Desktop assets | `public/journey-frames/d/f-001.webp` through `f-090.webp`; 3,897,586 bytes. | Pass |
| Mobile assets | `public/journey-frames/m/f-001.webp` through `f-090.webp`; 1,551,168 bytes. | Pass |
| Accessibility | Static server-rendered document remains when `prefers-reduced-motion` is active. | Pass |
| Constrained devices | Static fallback remains for Save-Data and devices reporting less than 2 GB memory. | Pass |
| Performance | Frames load in a critical every-sixth-frame pass, then batches; desktop is below 5 MB and mobile below 2 MB. | Pass |
| Route coverage | `/website` renders `CinematicJourney` with launch-state CTA copy. | Pass |

The effect is canvas-based pseudo-3D depth, not WebGL geometry. That choice fits the existing visual system and avoids adding a heavy 3D runtime to launch-critical pages.

## Animated-website skill checkpoint

The source clip `public/curl-scrub.mp4` is 5.04 seconds, 1280×720, H.264, 24 fps, and 121 source frames. The reviewed extraction proposal is 90 WebP frames at quality 80 over a 400vh scroll track. The skill requires explicit user confirmation before extraction; existing production frames were therefore audited but not overwritten.

## Preview acceptance

1. Open `/website` at desktop and mobile widths.
2. Confirm the first frame appears before the loader exits and scrub direction follows scroll direction.
3. Confirm no blank canvas occurs during rapid scrolling.
4. Enable reduced motion and confirm the complete static content and CTA remain usable.
5. Enable Save-Data or emulate a low-memory device and confirm the static fallback remains.
6. Confirm no horizontal overflow, console errors, or image/frame 404s.
