"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CurlTrail — pointer-following glyph trail for desktop + mobile.
 *
 * Mechanic
 * --------
 * Spawns short-lived curl glyphs and sequential letters of `word` along the
 * pointer/touch path. Letters are interleaved by `letterEvery` (default every
 * 2nd particle is a letter). All particles transform/opacity only, recycled
 * from a fixed pool, and removed via full cleanup on unmount.
 *
 * Safety
 * ------
 * - `prefers-reduced-motion: reduce` → no-ops everywhere, reactive to live OS toggle.
 * - SSR-safe: no `window`/`document` access during render; hydration mismatch-free.
 * - `pointer-events: none` overlay — zero interference with links, inputs, selection.
 * - All listeners passive; no scroll blocking on touch.
 * - SVG built via `createElementNS` + `setAttribute` (no innerHTML interpolation).
 * - `pointercancel` + `touchcancel` reset trail anchor (iOS system-gesture safe).
 */

interface CurlTrailProps {
  /** Letters spawned sequentially along the trail. Default `"CURLS"`. */
  word?: string;
  /** Every Nth particle is a letter; the rest are curl marks. Default `2`. */
  letterEvery?: number;
  /** Pixels traveled between spawns. Lower = denser trail. Default `24`. */
  spawnDistance?: number;
  /** ms a particle lives before fade-out. Default `950`. */
  lifetime?: number;
  /** Hard cap on active particles. Default `40`. */
  maxParticles?: number;
  /** Letter size range in px. Default `[13, 16]`. */
  letterSize?: [number, number];
  /** Curl glyph size range in px. Default `[10, 17]`. */
  curlSize?: [number, number];
  /** Render a small head glyph that follows the pointer (fine pointers only). Default `true`. */
  cursorHead?: boolean;
  /** Enable trail + tap burst on touch devices. Default `true`. */
  touch?: boolean;
  /** Glyphs spawned per tap on touch devices. Default `6`. */
  tapBurst?: number;
  /** CSS selector for light-background sections that should use dark tones. Default `".light"`. */
  lightSelector?: string;
  /** Stroke colors used on dark backgrounds. */
  darkBgTones?: string[];
  /** Stroke colors used on light backgrounds. */
  lightBgTones?: string[];
  /** Font family for letter particles. */
  fontFamily?: string;
  /** Overlay z-index. Default `9999`. */
  zIndex?: number;
}

const GOLD = "#B08D57";
const WHITE_GOLD = "#D8D1C5";
const JADE = "#145B4B";
const JADE_MIST = "#C7D9D2";
const OBSIDIAN = "#111111";

// Curl mark path — small, fluid, neutral. Reads as a "curl" gesture at 10–17px.
const CURL_PATH =
  "M3 12 C 3 7, 9 7, 9 12 C 9 17, 15 17, 15 12 C 15 7, 21 7, 21 12";
const CURSOR_HEAD_PATH =
  "M4 12 C 4 6, 12 6, 12 12 C 12 18, 20 18, 20 12";

const DEFAULT_FONT =
  '"Cormorant Garamond", "Cormorant", Georgia, "Times New Roman", serif';

type Particle = {
  el: HTMLSpanElement | SVGSVGElement;
  born: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rot: number;
  drot: number;
  isLetter: boolean;
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

function makeSvgCurl(size: number, color: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("fill", "none");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", CURL_PATH);
  path.setAttribute("stroke", color);
  path.setAttribute("stroke-width", "1.6");
  path.setAttribute("stroke-linecap", "round");
  svg.appendChild(path);
  return svg;
}

export default function CurlTrail({
  word = "CURLS",
  letterEvery = 2,
  spawnDistance = 24,
  lifetime = 950,
  maxParticles = 40,
  letterSize = [13, 16],
  curlSize = [10, 17],
  cursorHead = true,
  touch = true,
  tapBurst = 6,
  lightSelector = ".light",
  darkBgTones = [GOLD, WHITE_GOLD, JADE_MIST],
  lightBgTones = [JADE, OBSIDIAN, GOLD],
  fontFamily = DEFAULT_FONT,
  zIndex = 9999,
}: CurlTrailProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<SVGSVGElement>(null);

  // SSR-safe gating. Both start `false` so server render and client first paint
  // match. Real values are computed after mount.
  const [fine, setFine] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Reactive media-query subscription. Fixes hydration mismatch AND keeps the
  // trail honest if the user toggles OS-level reduced-motion mid-session.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const fineMql = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduceMql = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Intentional one-time post-mount sync: both states must start false on the
    // server and resolve to real media-query values after hydration. The single
    // extra render is the SSR-safety mechanism, not a cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFine(fineMql.matches);
    setReduceMotion(reduceMql.matches);

    const onFine = (e: MediaQueryListEvent) => setFine(e.matches);
    const onReduce = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    fineMql.addEventListener("change", onFine);
    reduceMql.addEventListener("change", onReduce);
    return () => {
      fineMql.removeEventListener("change", onFine);
      reduceMql.removeEventListener("change", onReduce);
    };
  }, []);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (reduceMotion) return;
    if (!fine && !touch) return;

    const showHead = cursorHead && fine;
    const head = showHead ? headRef.current : null;

    const pool: Particle[] = [];
    let counter = 0; // drives the sequential letter index + curl/letter cadence
    let lastX = 0;
    let lastY = 0;
    let hasAnchor = false;
    let acc = 0;
    let headX = -9999;
    let headY = -9999;
    let renderedHeadX = -9999;
    let renderedHeadY = -9999;
    let rafId = 0;
    let lastFrame = performance.now();

    const isOverLight = (x: number, y: number): boolean => {
      const el = document.elementFromPoint(x, y);
      if (!el) return false;
      return !!(el as Element).closest(lightSelector);
    };

    const pickColor = (x: number, y: number): string => {
      const pool = isOverLight(x, y) ? lightBgTones : darkBgTones;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const spawn = (x: number, y: number) => {
      if (pool.length >= maxParticles) {
        const oldest = pool.shift();
        if (oldest) oldest.el.remove();
      }

      const i = counter++;
      const isLetter = i % letterEvery === 0;
      const color = pickColor(x, y);

      let el: HTMLSpanElement | SVGSVGElement;
      if (isLetter) {
        const letterIndex = Math.floor(i / letterEvery) % word.length;
        const ch = word[letterIndex] ?? "C";
        const size = rand(letterSize[0], letterSize[1]);
        const span = document.createElement("span");
        span.textContent = ch;
        span.setAttribute("aria-hidden", "true");
        span.style.position = "absolute";
        span.style.left = "0";
        span.style.top = "0";
        span.style.fontFamily = fontFamily;
        span.style.fontSize = `${size}px`;
        span.style.fontWeight = "500";
        span.style.color = color;
        span.style.letterSpacing = "0.04em";
        span.style.pointerEvents = "none";
        span.style.willChange = "transform, opacity";
        el = span;
      } else {
        const size = rand(curlSize[0], curlSize[1]);
        const svg = makeSvgCurl(size, color);
        svg.style.position = "absolute";
        svg.style.left = "0";
        svg.style.top = "0";
        svg.style.pointerEvents = "none";
        svg.style.willChange = "transform, opacity";
        el = svg;
      }

      const dx = rand(-22, 22);
      const dy = rand(-26, -6);
      const rot = rand(-18, 18);
      const drot = rand(-30, 30);
      el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      el.style.opacity = "0.95";
      layer.appendChild(el);

      pool.push({
        el,
        born: performance.now(),
        x,
        y,
        dx,
        dy,
        rot,
        drot,
        isLetter,
      });
    };

    const track = (x: number, y: number) => {
      if (!hasAnchor) {
        lastX = x;
        lastY = y;
        hasAnchor = true;
        return;
      }
      const ddx = x - lastX;
      const ddy = y - lastY;
      const dist = Math.hypot(ddx, ddy);
      acc += dist;
      lastX = x;
      lastY = y;
      while (acc >= spawnDistance) {
        spawn(x, y);
        acc -= spawnDistance;
      }
    };

    const resetAnchor = () => {
      hasAnchor = false;
      acc = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || e.pointerType === "pen") {
        headX = e.clientX;
        headY = e.clientY;
        track(e.clientX, e.clientY);
      }
    };
    const onPointerLeave = () => {
      headX = -9999;
      headY = -9999;
      resetAnchor();
    };
    const onPointerCancel = () => {
      resetAnchor();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!touch) return;
      const t = e.touches[0];
      if (!t) return;
      // Tap burst: small fan of glyphs at the touch point.
      for (let i = 0; i < tapBurst; i++) {
        spawn(t.clientX + rand(-6, 6), t.clientY + rand(-6, 6));
      }
      lastX = t.clientX;
      lastY = t.clientY;
      hasAnchor = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!touch) return;
      const t = e.touches[0];
      if (!t) return;
      track(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      if (!touch) return;
      resetAnchor();
    };
    const onTouchCancel = () => {
      if (!touch) return;
      resetAnchor();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("pointercancel", onPointerCancel, { passive: true });
    if (touch) {
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      window.addEventListener("touchcancel", onTouchCancel, { passive: true });
    }

    const frame = (now: number) => {
      const dt = Math.min(64, now - lastFrame);
      lastFrame = now;

      // Head glyph lerp.
      if (head) {
        if (headX < 0) {
          head.style.opacity = "0";
        } else {
          renderedHeadX += (headX - renderedHeadX) * 0.22;
          renderedHeadY += (headY - renderedHeadY) * 0.22;
          head.style.opacity = "1";
          head.style.transform = `translate(${renderedHeadX - 11}px, ${
            renderedHeadY - 11
          }px)`;
        }
      }

      // Particle update.
      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        if (!p) continue;
        const age = now - p.born;
        if (age >= lifetime) {
          p.el.remove();
          pool.splice(i, 1);
          continue;
        }
        const t = age / lifetime;
        // Cubic ease-out displacement; particle drifts up-and-out.
        const ease = 1 - Math.pow(1 - t, 3);
        const x = p.x + p.dx * ease;
        const y = p.y + p.dy * ease;
        const r = p.rot + p.drot * ease;
        const opacity = 0.95 * (1 - t);
        p.el.style.transform = `translate(${x}px, ${y}px) rotate(${r}deg)`;
        p.el.style.opacity = String(opacity);
        // dt is intentionally unused for displacement (ease is age-based) but
        // is referenced here so static analyzers don't flag the binding.
        void dt;
      }

      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointercancel", onPointerCancel);
      if (touch) {
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("touchcancel", onTouchCancel);
      }
      for (const p of pool) p.el.remove();
      pool.length = 0;
    };
    // Effect deps are intentionally limited to the values that meaningfully
    // change behavior at runtime. Array/tuple props (letterSize, curlSize,
    // darkBgTones, lightBgTones) are read inside `spawn()` via closure; if a
    // parent passes inline literals, including them here would force tear-down
    // on every parent render. Consumers that want runtime updates to those
    // values should `useMemo` them at the call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    word,
    letterEvery,
    spawnDistance,
    lifetime,
    maxParticles,
    cursorHead,
    touch,
    tapBurst,
    lightSelector,
    fontFamily,
    zIndex,
    fine,
    reduceMotion,
  ]);

  return (
    <>
      <div
        ref={layerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex,
          overflow: "hidden",
        }}
      />
      {cursorHead && fine && !reduceMotion && (
        <svg
          ref={headRef}
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 22,
            height: 22,
            pointerEvents: "none",
            zIndex: zIndex + 1,
            willChange: "transform, opacity",
            opacity: 0,
          }}
        >
          <path
            d={CURSOR_HEAD_PATH}
            stroke={GOLD}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </svg>
      )}
    </>
  );
}
