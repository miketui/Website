# Immersive Motion Review — July 12, 2026

## Outcome

`/website` now serves the established cinematic experience already used by `/journey`. It reuses one implementation and one asset set, preventing duplicate downloads and divergent motion behavior.

## Verified implementation

| Gate | Evidence | Result |
|---|---|---|
| Scroll-driven visual narrative | `CinematicJourney` maps scroll progress to a 90-frame canvas sequence with five dwell regions. | Pass |
| 3D/depth impression | Cover-scaled cinematic frames, layered editorial overlays, depth markers, and ambient particle canvas. | Pass |
| Desktop assets | `public/journey-frames/d/f-001.webp` through `f-090.webp`; 3,897,586 bytes. | Pass |
| Mobile/iOS assets | `public/journey-frames/m/f-001.webp` through `f-090.webp`; 1,551,168 bytes. Safari-compatible WebP with an `HTMLImageElement` fallback. | Pass |
| Accessibility | Static server-rendered document remains when `prefers-reduced-motion` is active. | Pass |
| Constrained devices | Static fallback remains for Save-Data and devices reporting less than 2 GB memory. | Pass |
| Performance | Frames load in a critical every-sixth-frame pass, then batches; desktop is below 5 MB and mobile below 2 MB. | Pass |
| Route coverage | `/website` renders `CinematicJourney` with launch-state CTA copy. | Pass |

The effect is canvas-based pseudo-3D depth, not WebGL geometry. That choice fits the existing visual system and avoids adding a heavy 3D runtime to launch-critical pages.

## Animated-website skill checkpoint

The source clip `public/curl-scrub.mp4` is 5.04 seconds, 1280×720, H.264, 24 fps, and 121 source frames. After approval, the skill re-extracted comparison sets at quality 80 and 75. Quality 80 produced 6.25 MB combined. Quality 75 preserved visual detail at frames 1, 45, and 90 and reduced desktop by 118 KB, but increased the mobile/iOS payload by 76 KB. The existing 5.20 MB production set was therefore retained because mobile performance is the higher-risk constraint. The runtime keeps 500vh rather than the extractor's 300vh baseline because its five editorial dwell regions need additional scroll distance.

### Browser installation and rendered gate

The current sandbox allowed the writable Playwright cache but blocked the Chromium CDN with a zero-byte archive. On a Codex/CI machine with browser-download access, run:

```bash
pnpm browser:install
pnpm build
pnpm test:e2e
```

The Playwright gate now binds Next.js to `127.0.0.1`, verifies desktop canvas activation, confirms mobile frame requests in an iPhone 13 context, checks reduced-motion fallback content, captures console/page errors, and rejects horizontal overflow.

## Preview acceptance

1. Open `/website` at desktop and mobile widths.
2. Confirm the first frame appears before the loader exits and scrub direction follows scroll direction.
3. Confirm no blank canvas occurs during rapid scrolling.
4. Enable reduced motion and confirm the complete static content and CTA remain usable.
5. Enable Save-Data or emulate a low-memory device and confirm the static fallback remains.
6. Confirm no horizontal overflow, console errors, or image/frame 404s.
