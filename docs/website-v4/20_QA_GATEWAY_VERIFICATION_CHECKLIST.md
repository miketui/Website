<!--
Gateway Experience QA Checklist — Curls & Contemplation
========================================================

Run this checklist on Preview/Staging before moving to Production.
Test on both desktop (1440x900) and mobile (390x844).
-->

# 20_QA_GATEWAY_VERIFICATION_CHECKLIST

## Pre-Test Setup

### Clear Session Storage (Fresh Visit Simulation)

**Desktop Chrome DevTools:**
```javascript
// Open DevTools (F12 or Cmd+Option+J)
// Go to Application → Session Storage
// Right-click → Clear All
// Or paste in console:
sessionStorage.clear();
// Then reload the page
location.reload();
```

**Mobile Safari (iOS):**
```
Settings → Safari → Advanced → Website Data
Search for your domain → Remove
Then open site in new tab
```

---

## Phase 1: Loader (0–0.7s)

| ✓ | Item | Desktop | Mobile | Notes |
|---|------|---------|--------|-------|
| [ ] | Obsidian background fills viewport | ✅ | ✅ | Should be `#111111` with subtle radial gradient |
| [ ] | "Curls & Contemplation" text fades in with letter-spacing | ✅ | ✅ | Font: Cormorant Garamond, 0.42em tracking |
| [ ] | Ampersand (&) is gold color | ✅ | ✅ | Should be `#B08D57` (antique gold) |
| [ ] | Horizontal hairline rule draws from left → right | ✅ | ✅ | Stroke: gold, animated via `stroke-dashoffset` |
| [ ] | Loader disappears after 0.7s | ✅ | ✅ | Transition: `opacity 0.7s ease` |
| [ ] | Status message announced to screen readers | ✅ | ✅ | `aria-label="Curls and Contemplation is opening"` |

---

## Phase 2: Atmosphere Canvas (0.7–2.5s)

| ✓ | Item | Desktop | Mobile | Notes |
|---|------|---------|--------|-------|
| [ ] | 2D canvas fills full viewport | ✅ | ✅ | `<canvas ref={canvasRef} className="gw-atmosphere"` |
| [ ] | Particles (jade + gold dots) float upward | ✅ | ✅ | ~80–120 particles, depth-based sizing |
| [ ] | Aurora gradient follows cursor softly | ✅ | ✅ | Radial gradient shifts via `--gw-aura-x/y` CSS vars |
| [ ] | Film grain overlay animates subtly | ✅ | ✅ | Pattern shift every keyframe, `opacity: 0.14` |
| [ ] | No jerky motion or frame drops | ✅ | ✅ | DPR capped at 2; `requestAnimationFrame` throttles |
| [ ] | Reduced-motion: single calm frame (no loop) | ✅ | ✅ | If `prefers-reduced-motion: reduce`, canvas renders once |

---

## Phase 3: Book Emergence (0–2.5s, Ready Gate ~0.1s after canvas start)

| ✓ | Item | Desktop | Mobile | Notes |
|---|------|---------|--------|-------|
| [ ] | Book appears from far background (blur) | ✅ | ✅ | Starts at `translateZ(-1100px)`, blur(18px) |
| [ ] | Book smoothly arrives at camera (blur → sharp) | ✅ | ✅ | Final state: `translateZ(0)`, blur(0) |
| [ ] | 3D book cover visible (with placeholder or real image) | ✅ | ✅ | `--gw-cover: url("/gateway-cover.jpg")` |
| [ ] | Book has gold rim lighting + shadow | ✅ | ✅ | `box-shadow: inset + drop-shadow` |
| [ ] | Book rocks subtly left ↔ right during arrival | ✅ | ✅ | `gwBookEditorialRock` keyframe: rotateY -24° → +12° |
| [ ] | Shadow beneath book (soft, blurred) | ✅ | ✅ | `gw-book-shadow`: radial gradient, `filter: blur(18px)` |
| [ ] | Book is tilted toward cursor (±4°) | ✅ | ⚠️ | Desktop: cursor-driven; Mobile: centered (no fine pointer) |
| [ ] | Glint animates across book cover | ✅ | ✅ | `gwCoverGlint`: linear gradient swipe, 0.1s delay |
| [ ] | Reduced-motion: book appears instantly, no tilt | ✅ | ✅ | Animations disabled; positioned at final state |

---

## Phase 4: Headline Reveal (1–2.15s)

| ✓ | Item | Desktop | Mobile | Notes |
|---|------|---------|--------|-------|
| [ ] | Kicker ("Curls & Contemplation") fades in | ✅ | ✅ | 0.68rem, gold, 0.8s delay |
| [ ] | Line 1 rises from bottom ("You learned the craft.") | ✅ | ✅ | `transform: translateY(110%)` → `0`, 1.15s delay 0.5s |
| [ ] | Line 2 rises from bottom ("Nobody taught you the business.") | ✅ | ✅ | Same animation, 0.66s delay |
| [ ] | Text color is white-gold (ivory) | ✅ | ✅ | `#D8D1C5` |
| [ ] | Font is serif (Cormorant Garamond or fallback) | ✅ | ✅ | Georgia, Times New Roman fallback |
| [ ] | Line height is snug (0.98) | ✅ | ✅ | No extra vertical spacing |
| [ ] | Text scales down on mobile | ✅ | ✅ | `clamp(1.9rem, 11vw, 3.1rem)` |
| [ ] | Reduced-motion: text visible (no transform animation) | ✅ | ✅ | `animation: none; transform: translateY(0)` |

---

## Phase 5: CTA Arrival & Interaction (1.9–3s)

| ✓ | Item | Desktop | Mobile | Notes |
|---|------|---------|--------|-------|
| [ ] | "Open your mind" button appears from below | ✅ | ✅ | `gwButtonArrives` keyframe, 0.8s duration |
| [ ] | "Click to step inside" helper text below | ✅ | ✅ | Small gray text, 0.72rem |
| [ ] | Button glows with gold shadow | ✅ | ✅ | `box-shadow: 0 18px 60px ... 0 0 42px rgba(176,141,87,0.16)` |
| [ ] | Button breathing animation (shadow pulse) | ✅ | ✅ | `gwCtaBreathe` keyframe at 3s delay |
| [ ] | On hover: button lifts 2px + scales 1.02 | ✅ | ⚠️ | Desktop only (no hover on mobile) |
| [ ] | On hover: shadow brightens | ✅ | ⚠️ | Desktop only |
| [ ] | On focus-visible: gold outline visible | ✅ | ✅ | `outline: 2px solid` + `outline-offset: 3px` |
| [ ] | On click: no default navigation (yet) | ✅ | ✅ | Triggers `enterHome(false)` function |
| [ ] | Button label is uppercase & semibold | ✅ | ✅ | `font-weight: 900`, `letter-spacing: 0.22em` |
| [ ] | Reduced-motion: button visible but no breathing | ✅ | ✅ | Animation disabled; static shadow |

---

## Phase 6: Book Opening (Click Behavior)

| ✓ | Item | Desktop | Mobile | Notes |
|---|------|---------|--------|-------|
| [ ] | Copy fades out ("You learned the craft...") | ✅ | ✅ | Opacity transition 0.4s |
| [ ] | CTA button fades out | ✅ | ✅ | Opacity transition 0.4s |
| [ ] | Book cover swings open (rotateY -160°) | ✅ | ✅ | Transition 0.9s cubic-bezier |
| [ ] | Inside message appears ("Welcome" / "Open the door") | ✅ | ✅ | Fades in as cover opens |
| [ ] | Light bloom expands from book center | ✅ | ✅ | `gwBloomOut` keyframe: scale(0) → scale(16) |
| [ ] | Ivory-gold wash flashes across viewport | ✅ | ✅ | `gwWashCross` keyframe: opacity 0→1→0 |
| [ ] | Book flies toward camera & enlarges | ✅ | ✅ | `gwFlyThrough` keyframe: scale 1 → 8.5, `translateZ` increases |
| [ ] | Book becomes blurry as it approaches | ✅ | ✅ | `filter: blur(10px)` at end state |
| [ ] | Pointer events disabled during opening | ✅ | ✅ | `.is-opening .gw-gate { pointer-events: none }` |

---

## Phase 7: Transition to Homepage

| ✓ | Item | Desktop | Mobile | Notes |
|---|------|---------|--------|-------|
| [ ] | Book settles smaller in corner (is-entered state) | ✅ | ✅ | `gwBookSettle` keyframe: scale 0.66 → 0.72 |
| [ ] | Aurora backdrop dims slightly | ✅ | ✅ | Opacity 1 → 0.22, transform: scale(0.92) |
| [ ] | Homepage content visible beneath | ✅ | ✅ | Curl trail, header, hero section |
| [ ] | Gateway overlay fades to transparent (is-revealed) | ✅ | ✅ | `opacity: 0` after 1.1s transition |
| [ ] | Total gateway duration: ~3–3.5s (normal) or <1s (skip) | ✅ | ✅ | Depends on motion preference |
| [ ] | SR-only announcement: "Homepage revealed. You are inside the book." | ✅ | ✅ | Polite live region updates |

---

## Phase 8: Skip Button (Always Available)

| ✓ | Item | Desktop | Mobile | Notes |
|---|------|---------|--------|-------|
| [ ] | Skip button visible top-right after loader fades | ✅ | ✅ | `.gw-skip` appears at 0.6s + 0.2s delay |
| [ ] | Skip button text: "Skip intro" | ✅ | ✅ | `text-transform: uppercase`, 0.68rem |
| [ ] | Skip button semi-transparent with backdrop blur | ✅ | ✅ | `background: rgba(17,17,17,0.55)`, `backdrop-filter: blur(12px)` |
| [ ] | Skip button is keyboard-accessible (Tab order) | ✅ | ✅ | Before "Open your mind" button |
| [ ] | On click: all gateway animations jump to final state | ✅ | ✅ | `.is-skipped` class sets `animation-delay: -20s` |
| [ ] | On click: homepage revealed instantly | ✅ | ✅ | No transition; reveal happens immediately |
| [ ] | Skip button hidden during opening + entered states | ✅ | ✅ | `#book-gateway.is-opening .gw-skip { opacity: 0; pointer-events: none }` |
| [ ] | Reduced-motion: Skip button hidden | ✅ | ✅ | `@media (prefers-reduced-motion)` sets `display: none` |

---

## Phase 9: Session Storage Gate (Repeat Visits)

| ✓ | Item | Test Procedure | Result | Notes |
|---|------|---|---|---|
| [ ] | First visit: gateway plays | Load page with clear sessionStorage | ✅ | `sessionStorage` is empty |
| [ ] | First visit: after opening, `sessionStorage.curls-gateway-seen` = "1" | Inspect sessionStorage in DevTools after clicking button | ✅ | Set by `BookGateway.tsx` line 341 |
| [ ] | Repeat visit (same session): gateway skipped | Reload page (Cmd+R / Ctrl+R) **without** clearing sessionStorage | ✅ | Checks for "1" value |
| [ ] | Repeat visit: homepage loads directly | Verify homepage renders without overlay | ✅ | `setGone(true)` called immediately |
| [ ] | New session/tab: gateway plays again | Open new tab, go to `/` | ✅ | New sessionStorage context |
| [ ] | Incognito/Private mode: gateway plays | Open site in incognito/private window | ✅ | SessionStorage unavailable; caught in try/catch |

---

## Phase 10: Reduced-Motion Verification

**System Setting Change (macOS):**
```bash
# Simulate reduced-motion in terminal
defaults write com.apple.universalaccess reduceMotionEnabled 1
# Reload browser
# Undo:
defaults write com.apple.universalaccess reduceMotionEnabled 0
```

**DevTools Simulation (all browsers):**
```
DevTools → Rendering → Emulate CSS media feature prefers-reduced-motion: reduce
Reload page
```

| ✓ | Item | Expected | Result |
|---|------|----------|--------|
| [ ] | Atmosphere: single still frame (no particle loop) | Canvas renders once, static | ✅ |
| [ ] | Book: appears instantly at final position | No `gwBookFromBackToFront` animation | ✅ |
| [ ] | Headline: all text visible (no stagger) | Kicker + both lines visible | ✅ |
| [ ] | CTA: no breathing animation | Button visible, shadow static | ✅ |
| [ ] | CTA: no hover lift (transform disabled) | On hover, no movement | ✅ |
| [ ] | Opening: calm 450ms crossfade (no fly-through) | Overlay fades out smoothly | ✅ |
| [ ] | Skip button: hidden | Not rendered (display: none) | ✅ |
| [ ] | Curl trail: not rendered | No particle trail on pointer move | ✅ |

---

## Phase 11: Accessibility (Keyboard + Screen Reader)

| ✓ | Item | Test | Expected | Result |
|---|------|------|----------|--------|
| [ ] | Gateway description announced | Start screen reader (NVDA, JAWS, VoiceOver) | "Cinematic book opening gateway. The book rises..." | ✅ |
| [ ] | Skip button keyboard accessible | Tab from start → skip button gets focus | Blue outline around button | ✅ |
| [ ] | Skip button activable via Enter/Space | Focus skip button, press Enter or Space | Gateway skipped, homepage revealed | ✅ |
| [ ] | "Open your mind" button keyboard accessible | Tab to button (after skip) | Blue outline visible | ✅ |
| [ ] | "Open your mind" button activable | Focus button, press Enter or Space | Book opens, homepage revealed | ✅ |
| [ ] | Homepage reveals announcement | SR announces when gateway fades | "Homepage revealed. You are inside the book." | ✅ |
| [ ] | Color contrast (WCAG AA) | Run axe DevTools on gateway | All text/button ≥4.5:1 or ≥3:1 (large) | ✅ |
| [ ] | No flashing/strobing | Observe video | No ≥3 flashes per second | ✅ |

---

## Phase 12: Performance & Browser Compatibility

| ✓ | Item | Target | Result | Device |
|---|------|--------|--------|--------|
| [ ] | First paint (FCP): <1.5s | Measure in DevTools Performance tab | <1.5s | Desktop Chrome |
| [ ] | Largest contentful paint (LCP): <2.5s | Measure in DevTools Performance tab | <2.5s | Desktop Chrome |
| [ ] | Frame rate: 60fps (no jank) | Open DevTools → Performance → record 3s | 58–60fps average | Desktop Chrome |
| [ ] | Mobile performance: FCP <2s | Measure on real device | <2s | iPhone 12+ / Android 12+ |
| [ ] | Firefox: gateway renders correctly | Test on Firefox 120+ | All phases visible | Firefox Desktop |
| [ ] | Safari: gateway renders correctly | Test on Safari 17+ | All phases visible | Safari (macOS/iOS) |
| [ ] | Canvas context created without error | Check console for errors | No 404 or canvas errors | All browsers |
| [ ] | No memory leak on repeat gateway (clear sessionStorage + reload 10x) | Measure heap in DevTools | Heap stable ~50–80MB | Desktop |

---

## Phase 13: Visual Verification (Screenshot Comparison)

### Desktop (1440×900)

| State | Expected Visual | Status |
|-------|---|---|
| Loader | Centered text + gold hairline on black | ✅ Screenshot |
| Atmosphere | Particles + aurora, subtle gradient | ✅ Screenshot |
| Book arrival | 3D book cover, centered, tilted | ✅ Screenshot |
| Headline + CTA | "You learned..." text below book; "Open your mind" below that | ✅ Screenshot |
| Book open | Book rotating, light wash flashing | ✅ Screenshot (video preferred) |
| Homepage | Curl trail visible on move; header sticky; content below | ✅ Screenshot |

### Mobile (390×844)

| State | Expected Visual | Status |
|-------|---|---|
| Loader | Full-screen, text centered | ✅ Screenshot |
| Atmosphere | Particles fill viewport | ✅ Screenshot |
| Book arrival | Book smaller (clamp sizing), centered | ✅ Screenshot |
| Headline | Text centered above book, wraps on smaller screens | ✅ Screenshot |
| CTA | Button below book, full width or centered | ✅ Screenshot |
| Homepage | Content flows below; no horizontal scroll | ✅ Screenshot |

---

## Test Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA Lead | __________ | __________ | ⬜ Pending |
| Designer Review | __________ | __________ | ⬜ Pending |
| Accessibility Audit | __________ | __________ | ⬜ Pending |
| Performance Approval | __________ | __________ | ⬜ Pending |

---

## Known Issues

### Issue: Gateway Cover Placeholder

- **Status:** ⚠️ Known
- **Impact:** Visual only (functionality not affected)
- **Resolution:** Replace `/public/gateway-cover.jpg` with real v13 cover

### Issue: [Add others as discovered during QA]

- **Status:** 
- **Impact:** 
- **Resolution:** 

---

## Sign-Off for Deployment

- [ ] All phases 1–13 pass on desktop
- [ ] All phases 1–13 pass on mobile
- [ ] Reduced-motion honored correctly
- [ ] Keyboard + SR navigation works
- [ ] Performance targets met
- [ ] No console errors
- [ ] Gateway cover replaced with real image
- [ ] All stakeholders signed off

**Ready for production:** ⬜ YES / ⬜ NO

---

**Test Date:** __________  
**Tester:** __________  
**Environment:** Staging / Preview / Production
