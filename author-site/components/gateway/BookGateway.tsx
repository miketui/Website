"use client";

/**
 * Cinematic Book Gateway — React port of the verified standalone
 * "canvas-book-opening-centered-gateway" experience.
 *
 * Renders nothing on the server and on first client paint, then mounts a
 * fixed full-viewport overlay (z-index 9000, above the site header) via a
 * layout effect. Sequence: loader act one -> atmosphere canvas + film grain
 * -> book emerges from depth -> kinetic masked headline -> "Open your mind"
 * CTA. Opening the book fades the overlay to reveal the app's real homepage
 * beneath, announces it via aria-live, releases pointer events and finally
 * unmounts itself. Honors prefers-reduced-motion reactively and skips
 * entirely when sessionStorage "curls-gateway-seen" is set.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

const SEEN_KEY = "curls-gateway-seen";
const STATUS_MESSAGE = "Homepage revealed. You are inside the book.";

/** useLayoutEffect on the client, useEffect during SSR (silences the SSR warning). */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  hue: "jade" | "gold";
  depth: number;
};

export function BookGateway() {
  /* Phase state. Everything starts false so the server HTML and the first
     client paint are identical (no hydration mismatch). */
  const [overlayMounted, setOverlayMounted] = useState(false);
  const [gone, setGone] = useState(false);
  const [ready, setReady] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [opening, setOpening] = useState(false);
  const [entered, setEntered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [washing, setWashing] = useState(false);
  const [status, setStatus] = useState("");
  const [reduceMotion, setReduceMotion] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const openMindRef = useRef<HTMLButtonElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const reduceMotionRef = useRef(false);
  const insideRef = useRef(false);
  const enteringRef = useRef(false);
  const pointerRef = useRef({ x: 0.5, y: 0.46 });
  const timeoutsRef = useRef<number[]>([]);

  /* setTimeout wrapper so every pending timer is cleared on unmount. */
  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  /* Session gate: mount the overlay before paint on first visit only. */
  useIsomorphicLayoutEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) {
      setGone(true);
    } else {
      setOverlayMounted(true);
    }
  }, []);

  /* prefers-reduced-motion, observed reactively via matchMedia. */
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reduceMotionRef.current = media.matches;
      setReduceMotion(media.matches);
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  /* Clear every pending timer when the component unmounts. */
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      timeouts.length = 0;
    };
  }, []);

  /* Scroll lock while the overlay owns the viewport + loader hand-off. */
  useEffect(() => {
    if (!overlayMounted || gone) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const loaderMs = reduceMotionRef.current ? 350 : 1050;
    later(() => setReady(true), loaderMs);
    /* Safety: never trap the visitor behind the curtain. */
    later(() => setReady(true), 3200);
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayMounted, gone, later]);

  /* The single gated cinematic moment: the 2D canvas atmosphere.
     DPR capped at 2; paused while document.hidden; one calm still frame
     under reduced motion. */
  useEffect(() => {
    if (!overlayMounted || gone) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    const still = reduceMotion;

    const seedParticles = () => {
      const count = Math.min(118, Math.max(56, Math.floor(width / 13)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.35,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.random() * 0.19 - 0.025,
        alpha: Math.random() * 0.55 + 0.13,
        hue: Math.random() > 0.72 ? ("jade" as const) : ("gold" as const),
        depth: Math.random() * 0.8 + 0.2
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const inside = insideRef.current;
      const cx = inside ? width * 0.27 : width * (0.5 + (pointerRef.current.x - 0.5) * 0.08);
      const cy = inside ? height * 0.43 : height * (0.46 + (pointerRef.current.y - 0.46) * 0.08);
      const aurora = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.55);
      aurora.addColorStop(0, inside ? "rgba(20,91,75,.18)" : "rgba(20,91,75,.26)");
      aurora.addColorStop(0.18, inside ? "rgba(188,161,120,.075)" : "rgba(188,161,120,.11)");
      aurora.addColorStop(0.62, "rgba(17,17,17,.02)");
      aurora.addColorStop(1, "rgba(17,17,17,0)");
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx * p.depth;
        p.y += p.vy * p.depth;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        const pulse = 0.64 + Math.sin(t * 0.0012 + p.x * 0.02) * 0.36;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === "jade" ? `rgba(20,91,75,${p.alpha * 0.72})` : `rgba(188,161,120,${p.alpha})`;
        ctx.shadowBlur = p.hue === "jade" ? 16 : 12;
        ctx.shadowColor = p.hue === "jade" ? "rgba(20,91,75,.45)" : "rgba(188,161,120,.42)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = window.requestAnimationFrame(draw);
    };

    const drawStill = () => {
      /* Reduced motion: one calm frame of atmosphere, no loop. */
      ctx.clearRect(0, 0, width, height);
      const aurora = ctx.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.46, Math.max(width, height) * 0.55);
      aurora.addColorStop(0, "rgba(20,91,75,.22)");
      aurora.addColorStop(0.18, "rgba(188,161,120,.09)");
      aurora.addColorStop(1, "rgba(17,17,17,0)");
      ctx.fillStyle = aurora;
      ctx.fillRect(0, 0, width, height);
    };

    const start = () => {
      if (still) {
        drawStill();
      } else if (!running) {
        running = true;
        raf = window.requestAnimationFrame(draw);
      }
    };
    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };
    const onResize = () => {
      resize();
      if (still) drawStill();
    };
    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    resize();
    start();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [overlayMounted, gone, reduceMotion]);

  /* The page answers the cursor: stage tilt, aurora bias, magnetic CTA.
     Fine pointers only; disabled under reduced motion. */
  useEffect(() => {
    if (!overlayMounted || gone || reduceMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let tiltTX = 0;
    let tiltTY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let magnetActive = false;
    let raf = 0;

    const magnetize = (cx: number, cy: number) => {
      const button = openMindRef.current;
      if (!button || insideRef.current) return;
      const r = button.getBoundingClientRect();
      if (!r.width) return;
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      const radius = 150;
      const label = labelRef.current;
      if (dist < radius) {
        const pull = 1 - dist / radius;
        button.style.transform = `translate(${dx * pull * 0.18}px,${dy * pull * 0.18}px)`;
        if (label) label.style.transform = `translate(${dx * pull * 0.07}px,${dy * pull * 0.07}px)`;
        magnetActive = true;
      } else if (magnetActive) {
        button.style.transform = "";
        if (label) label.style.transform = "";
        magnetActive = false;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerRef.current.x = event.clientX / w;
      pointerRef.current.y = event.clientY / h;
      if (insideRef.current) return;
      /* subtle stage tilt toward the cursor (±4°) */
      tiltTY = (pointerRef.current.x - 0.5) * 8; /* rotateY */
      tiltTX = (0.5 - pointerRef.current.y) * 6; /* rotateX */
      /* aurora hotspot follows softly */
      const root = rootRef.current;
      if (root) {
        root.style.setProperty("--gw-aura-x", `${46 + (pointerRef.current.x - 0.5) * 10}%`);
        root.style.setProperty("--gw-aura-y", `${44 + (pointerRef.current.y - 0.46) * 8}%`);
      }
      /* magnetic gold CTA */
      magnetize(event.clientX, event.clientY);
    };

    const tiltLoop = () => {
      tiltX += (tiltTX - tiltX) * 0.08;
      tiltY += (tiltTY - tiltY) * 0.08;
      const tilt = tiltRef.current;
      if (!insideRef.current && tilt) {
        tilt.style.setProperty("--gw-tilt-x", `${tiltX.toFixed(3)}deg`);
        tilt.style.setProperty("--gw-tilt-y", `${tiltY.toFixed(3)}deg`);
        tilt.style.transform = `rotateX(${tiltX.toFixed(3)}deg) rotateY(${tiltY.toFixed(3)}deg)`;
      }
      raf = window.requestAnimationFrame(tiltLoop);
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    raf = window.requestAnimationFrame(tiltLoop);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      window.cancelAnimationFrame(raf);
    };
  }, [overlayMounted, gone, reduceMotion]);

  /* The homepage beneath becomes the page; the overlay fades + releases. */
  const reveal = useCallback(() => {
    insideRef.current = true;
    setRevealed(true);
    setStatus(STATUS_MESSAGE);
    document.body.style.overflow = "";
    /* Fallback unmount in case transitionend never fires. */
    later(() => setGone(true), 2200);
  }, [later]);

  /* The opening: the book opens INTO the homepage. */
  const enterHome = useCallback(
    (fast: boolean) => {
      if (enteringRef.current || insideRef.current) return;
      enteringRef.current = true;
      insideRef.current = true;
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage unavailable (private mode) — gateway simply replays */
      }

      if (fast) {
        /* Skip intro: jump straight to the revealed state. */
        setSkipped(true);
        setOpening(false);
        setEntered(true);
        reveal();
        return;
      }

      if (reduceMotionRef.current) {
        /* dignified path: calm crossfade, same destination */
        setOpening(true);
        later(() => {
          setOpening(false);
          setEntered(true);
          reveal();
        }, 480);
        return;
      }

      /* Act 1 — cover swings open, light pours out (0–.9s) */
      setOpening(true);
      /* Act 2 — the wash blinks as the camera crosses the page */
      setWashing(true);
      /* Act 3 — beyond the threshold: the homepage breathes in. */
      later(() => {
        setOpening(false);
        setEntered(true);
        reveal();
      }, 1250);
      later(() => setWashing(false), 1900);
    },
    [later, reveal]
  );

  /* Unmount the overlay once its fade-out transition ends. */
  useEffect(() => {
    if (!revealed) return;
    const root = rootRef.current;
    if (!root) return;
    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === root && event.propertyName === "opacity") setGone(true);
    };
    root.addEventListener("transitionend", onTransitionEnd);
    return () => root.removeEventListener("transitionend", onTransitionEnd);
  }, [revealed]);

  const overlay =
    overlayMounted && !gone ? (
      <div
        id="book-gateway"
        ref={rootRef}
        className={clsx(
          ready && "is-ready",
          skipped && "is-skipped",
          opening && "is-opening",
          entered && "is-entered",
          revealed && "is-revealed"
        )}
        aria-hidden={revealed || undefined}
      >
        <p className="gw-sr-only">
          Cinematic book opening gateway. The book rises from the back of the scene toward you, an Open Your Mind
          button appears, and choosing it opens the book into the homepage. A Skip intro button is available at the
          top right.
        </p>

        {/* Act one: the loader draws a gold hairline across obsidian. */}
        <div className={clsx("gw-loader", ready && "is-done")} role="status" aria-hidden={ready} aria-label="Curls and Contemplation is opening">
          <div className="gw-loader-mark">
            <span className="gw-loader-word">
              Curls <em>&amp;</em> Contemplation
            </span>
            <svg className="gw-loader-rule" viewBox="0 0 260 34" aria-hidden="true" focusable="false">
              <line x1="0" y1="17" x2="260" y2="17" />
            </svg>
          </div>
        </div>

        <canvas ref={canvasRef} className="gw-atmosphere" aria-hidden="true" />

        <section className="gw-gate" aria-label="Cinematic book opening gateway">
          <div className="gw-copy" aria-hidden="true">
            <p className="gw-kicker">Curls &amp; Contemplation</p>
            <h2 className="gw-title">
              <span className="gw-line">
                <span>A book that opens</span>
              </span>
              <span className="gw-line">
                <span>like a threshold.</span>
              </span>
            </h2>
          </div>

          <div className="gw-book-scene" aria-hidden="true">
            <div className="gw-book-tilt" ref={tiltRef}>
              <div className="gw-book-stage">
                <div className="gw-book-shadow" />
                <div className="gw-book">
                  <div className="gw-back-cover" />
                  <div className="gw-inside-paper">
                    <div className="gw-inside-message">
                      <strong>Welcome</strong>
                      <span>Open the door</span>
                    </div>
                  </div>
                  <div className="gw-page-stack" />
                  <div className="gw-spine" />
                  <div className="gw-book-cover" />
                </div>
              </div>
            </div>
          </div>

          <div className="gw-bloom" aria-hidden="true" />

          <div className="gw-action">
            <button id="openMind" ref={openMindRef} className="gw-open-mind" type="button" onClick={() => enterHome(false)}>
              <span ref={labelRef} className="gw-btn-label">
                Open your mind
              </span>
            </button>
            <small>Click to step inside</small>
          </div>
        </section>

        <button className="gw-skip" type="button" onClick={() => enterHome(true)}>
          Skip intro
        </button>
        <div className={clsx("gw-wash", washing && "is-flashing")} aria-hidden="true" />
        <div className="gw-grain" aria-hidden="true" />
      </div>
    ) : null;

  return (
    <>
      {/* Persistent polite live region: announces the reveal and survives the
          overlay's unmount so assistive tech hears the full announcement. */}
      <div className="gw-sr-only" aria-live="polite" role="status">
        {status}
      </div>
      {overlay}
    </>
  );
}
