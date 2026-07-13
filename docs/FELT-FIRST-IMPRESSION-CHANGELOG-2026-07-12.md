# FELT First-Impression Changelog — July 12, 2026

## Intent

Make the first homepage visit emotionally legible within two seconds without
blocking the preorder action, weakening reduced-motion behavior, or adding a
heavy animation dependency.

## Changes

| Change | FELT law / pillar |
|---|---|
| Show the supplied motion layer immediately instead of keeping it visually hidden | F — First frame; Loading experience |
| Add the locked recognition line to the cover | F — First frame; UX foundation |
| Begin the automatic handoff at 700ms and expose the hero at about 1.3s | T — Tempo and restraint |
| Fade/unmount the cover by about 1.8s and release pointer interaction during exit | UX foundation; spectacle never blocks action |
| Start the kinetic headline on `cc:revealed` during the cover dissolve | F — First frame; Motion sequencing |
| Preserve immediate static content under reduced motion | T — Tempo and restraint; accessibility guardrail |
| Add a first-visit Chromium test without the `cc_cover_seen` cookie | First-three-seconds acceptance gate |

## Guardrails retained

- ACISS palette only; no new colors.
- Transform/opacity animation only; no layout shift.
- No WebGL or new animation dependency.
- No copy or credibility claim inflation.
- Reduced-motion visitors skip the cover and see the homepage immediately.
