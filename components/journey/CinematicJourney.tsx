"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * /journey — the full cinematic video journey (animated-website pipeline).
 *
 * 90 WebP frames extracted from public/curl-scrub.mp4 drive a scroll-scrubbed
 * canvas: the macro curl clip plays under five editorial overlays whose scroll
 * pacing "almost stops" at each section (Gaussian dwell remap), ending on the
 * one gold state-driven CTA. ACISS-bound throughout.
 *
 * Progressive enhancement, fail closed: the server HTML renders the full
 * static document (.cj-static — copy, poster, CTA) and the cinema chrome
 * activates only when the effect confirms JS, motion preference, and a
 * capable device. Reduced-motion, no-JS, saveData, and low-memory visitors
 * keep the ordinary page. Engine: one lerped rAF, transform/opacity/canvas
 * only, no scroll-jacking, fully reversible.
 */

const FRAME_COUNT = 90;
const LERP = 0.09;
const DWELL_CENTERS = [0.07, 0.28, 0.5, 0.72, 0.92];
const DWELL_WIDTH = 0.045;
const DWELL_PEAK = 3.5;
const REMAP_N = 1500;
/** Overlay windows in remapped progress space, centered on the dwells. */
const SECTIONS = DWELL_CENTERS.map((c, i) => ({
  showAt: Math.max(0, c - (i === 0 ? 0.07 : 0.075)),
  hideAt: i === DWELL_CENTERS.length - 1 ? 1.01 : c + 0.075
}));

const framePath = (dir: "d" | "m", index: number) => `/journey-frames/${dir}/f-${String(index + 1).padStart(3, "0")}.webp`;

/** Inverse-CDF dwell remap: scroll fraction → frame progress that slows at
 *  each dwell center (more scroll consumed per unit of progress there). */
function buildRemap(): (raw: number) => number {
  const cdf = new Float64Array(REMAP_N + 1);
  let acc = 0;
  for (let i = 0; i <= REMAP_N; i++) {
    const q = i / REMAP_N;
    let density = 1;
    for (const c of DWELL_CENTERS) {
      const dist = (q - c) / DWELL_WIDTH;
      density += DWELL_PEAK * Math.exp(-dist * dist);
    }
    acc += density;
    cdf[i] = acc;
  }
  for (let i = 0; i <= REMAP_N; i++) cdf[i] = (cdf[i] - cdf[0]) / (cdf[REMAP_N] - cdf[0]);
  return (raw: number) => {
    const target = Math.min(1, Math.max(0, raw));
    let lo = 0;
    let hi = REMAP_N;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    if (lo === 0) return 0;
    const span = cdf[lo] - cdf[lo - 1];
    const frac = span > 0 ? (target - cdf[lo - 1]) / span : 0;
    return (lo - 1 + frac) / REMAP_N;
  };
}

type CinematicJourneyProps = {
  ctaHref: string;
  ctaLabel: string;
  finalLine: string;
};

export function CinematicJourney({ ctaHref, ctaLabel, finalLine }: CinematicJourneyProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    /* Device gate (PRD §6.2): constrained devices keep the static page. */
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 2) return;

    const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const canvas = q<HTMLCanvasElement>(".cj-canvas");
    const track = q<HTMLDivElement>(".cj-track");
    const loader = q<HTMLDivElement>(".cj-loader");
    const loaderFill = q<HTMLDivElement>(".cj-loader-fill");
    const loaderPct = q<HTMLDivElement>(".cj-loader-pct");
    const particles = q<HTMLCanvasElement>(".cj-particles");
    const overlays = [...root.querySelectorAll<HTMLDivElement>(".cj-overlay")];
    const markers = [...root.querySelectorAll<HTMLSpanElement>(".cj-marker")];
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !track || overlays.length !== SECTIONS.length) return;

    root.setAttribute("data-cinema", "on");

    /* Letter-split the hero title (idempotent across remounts). */
    const heroTitle = q<HTMLElement>(".cj-split");
    if (heroTitle && !heroTitle.dataset.split) {
      heroTitle.dataset.split = "1";
      const text = heroTitle.textContent ?? "";
      heroTitle.textContent = "";
      [...text].forEach((ch, i) => {
        if (ch === " ") {
          heroTitle.appendChild(document.createTextNode(" "));
          return;
        }
        const s = document.createElement("span");
        s.style.setProperty("--i", String(i));
        s.textContent = ch;
        heroTitle.appendChild(s);
      });
    }

    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const dir: "d" | "m" = mobile ? "m" : "d";
    const remap = buildRemap();

    /* Frame store: decode off-thread when the browser allows. */
    const frames: (ImageBitmap | HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    let loaded = 0;
    let firstPainted = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    size();

    const drawFrame = (index: number) => {
      let frame = frames[index];
      if (!frame) {
        /* Nearest loaded neighbor — never a blank canvas. */
        for (let offset = 1; offset < FRAME_COUNT && !frame; offset++) {
          frame = frames[index - offset] ?? frames[index + offset] ?? null;
        }
        if (!frame) return;
      }
      const fw = frame.width;
      const fh = frame.height;
      const scale = Math.max(canvas.width / fw, canvas.height / fh);
      const dw = fw * scale;
      const dh = fh * scale;
      ctx.drawImage(frame, (canvas.width - dw) / 2, (canvas.height - dh) / 2, dw, dh);
    };

    const onLoaded = () => {
      loaded += 1;
      const pct = Math.round((loaded / FRAME_COUNT) * 100);
      if (loaderFill) loaderFill.style.width = `${pct}%`;
      if (loaderPct) loaderPct.textContent = `${pct}%`;
      if (!firstPainted && frames[0]) {
        firstPainted = true;
        drawFrame(0);
        loader?.classList.add("cj-done");
      }
      if (loaded >= Math.ceil(FRAME_COUNT / 6)) loader?.classList.add("cj-done");
    };

    let cancelled = false;
    const loadFrame = async (index: number) => {
      try {
        if (typeof createImageBitmap === "function") {
          const res = await fetch(framePath(dir, index));
          const blob = await res.blob();
          if (cancelled) return;
          frames[index] = await createImageBitmap(blob);
        } else {
          await new Promise<void>((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
              frames[index] = img;
              resolve();
            };
            img.onerror = () => reject(new Error("frame"));
            img.src = framePath(dir, index);
          });
        }
      } catch {
        /* A 404'd frame falls back to nearest-neighbor at draw time. */
      }
      if (!cancelled) onLoaded();
    };

    /* Critical pass: every 6th frame so scrubbing works immediately; then fill. */
    const critical: number[] = [];
    const rest: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) (i % 6 === 0 ? critical : rest).push(i);
    void Promise.all(critical.map(loadFrame)).then(async () => {
      const BATCH = 10;
      for (let i = 0; i < rest.length && !cancelled; i += BATCH) {
        await Promise.all(rest.slice(i, i + BATCH).map(loadFrame));
      }
    });

    /* Ambient particles. */
    let dots: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];
    const pctx = particles?.getContext("2d") ?? null;
    if (particles && pctx) {
      particles.width = window.innerWidth;
      particles.height = window.innerHeight;
      dots = Array.from({ length: 28 }, () => ({
        x: Math.random() * particles.width,
        y: Math.random() * particles.height,
        r: 0.3 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.1,
        a: 0.05 + Math.random() * 0.3
      }));
    }

    let target = window.scrollY;
    let current = window.scrollY;
    let running = true;
    let raf = 0;

    const metrics = { max: 1 };
    const measure = () => {
      metrics.max = Math.max(1, track.offsetHeight - window.innerHeight);
      size();
      if (particles && pctx) {
        particles.width = window.innerWidth;
        particles.height = window.innerHeight;
      }
    };
    measure();

    const render = () => {
      const trackTop = track.offsetTop;
      const raw = Math.min(1, Math.max(0, (current - trackTop) / metrics.max));
      const p = remap(raw);
      drawFrame(Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1))));

      let active = 0;
      overlays.forEach((overlay, i) => {
        const visible = p >= SECTIONS[i].showAt && p < SECTIONS[i].hideAt;
        overlay.classList.toggle("cj-visible", visible);
        if (p >= SECTIONS[i].showAt) active = i;
      });
      markers.forEach((m, i) => m.classList.toggle("cj-active", i === active));

      if (particles && pctx) {
        pctx.clearRect(0, 0, particles.width, particles.height);
        for (const d of dots) {
          d.x = (d.x + d.vx + particles.width) % particles.width;
          d.y = (d.y + d.vy + particles.height) % particles.height;
          pctx.beginPath();
          pctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          pctx.fillStyle = `rgba(216, 209, 197, ${d.a})`;
          pctx.fill();
        }
      }
    };

    const tick = () => {
      target = window.scrollY;
      current += (target - current) * LERP;
      if (Math.abs(target - current) < 0.4) current = target;
      render();
      if (running) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("resize", measure, { passive: true });

    return () => {
      cancelled = true;
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      root.removeAttribute("data-cinema");
    };
  }, []);

  const skip = () => {
    const track = rootRef.current?.querySelector<HTMLDivElement>(".cj-track");
    if (track) window.scrollTo({ top: track.offsetTop + track.offsetHeight, behavior: "smooth" });
  };

  const overlayCopy = (
    <>
      {/* 1 · Hero */}
      <div className="cj-overlay cj-overlay--center" aria-hidden="true">
        <p className="cj-kicker">Michael David</p>
        <h2 className="cj-title cj-split">Curls &amp; Contemplation</h2>
        <p className="cj-body">A stylist&rsquo;s interactive journey. Scroll — the light moves with you.</p>
      </div>
      {/* 2 · The Calling */}
      <div className="cj-overlay" aria-hidden="true">
        <p className="cj-kicker">The calling</p>
        <h2 className="cj-title">There is a moment when your gift starts <em>asking for more.</em></h2>
        <span className="cj-rule" />
      </div>
      {/* 3 · The Promise */}
      <div className="cj-overlay" aria-hidden="true">
        <p className="cj-kicker">What this is</p>
        <h2 className="cj-title">Not a technique book. <em>A doorway.</em></h2>
        <div className="cj-rows">
          <p className="cj-row"><b>Purpose</b> the work, named for what it actually is</p>
          <p className="cj-row"><b>Freedom</b> a rate you can say once, plainly</p>
          <p className="cj-row"><b>Legacy</b> a practice that outlasts the calendar</p>
        </div>
      </div>
      {/* 4 · Who it's for */}
      <div className="cj-overlay" aria-hidden="true">
        <p className="cj-kicker">Who it&rsquo;s for</p>
        <h2 className="cj-title">The stylist whose chair feels <em>smaller than her vision.</em></h2>
        <p className="cj-body">The underpriced. The invisible. The booked-and-burned-out. The almost-CEO. One of these is a mirror — the journey meets each one where it starts.</p>
      </div>
      {/* 5 · Threshold */}
      <div className="cj-overlay cj-overlay--center">
        <p className="cj-kicker">The threshold</p>
        <h2 className="cj-title">{finalLine}</h2>
        <span style={{ position: "relative", display: "inline-block" }}>
          <span className="cj-portal" aria-hidden="true" />
          <Link className="cj-cta-gold" href={ctaHref}>{ctaLabel}</Link>
        </span>
        <Link className="cj-cta-ghost" href="/free-chapter">or read Chapter 1 free</Link>
      </div>
    </>
  );

  return (
    <div ref={rootRef} className="cj-root">
      {/* Cinema chrome — hidden until the engine confirms JS + motion + device */}
      <div className="cj-loader" aria-hidden="true">
        <div className="cj-loader-inner">
          <p className="cj-loader-mark">Curls &amp; Contemplation</p>
          <div className="cj-loader-bar"><div className="cj-loader-fill" /></div>
          <p className="cj-loader-pct">0%</p>
        </div>
      </div>
      <div className="cj-track">
        <div className="cj-stage">
          <canvas className="cj-canvas" aria-hidden="true" />
          <div className="cj-shade-left" aria-hidden="true" />
          <div className="cj-shade-bottom" aria-hidden="true" />
        </div>
      </div>
      {overlayCopy}
      <canvas className="cj-particles" aria-hidden="true" />
      <div className="cj-vignette" aria-hidden="true" />
      <div className="cj-grain" aria-hidden="true" />
      <div className="cj-markers" aria-hidden="true">
        {SECTIONS.map((_, i) => <span key={i} className="cj-marker" />)}
      </div>
      <button type="button" className="cj-skip" onClick={skip}>Skip the journey</button>

      {/* Static document — the real page for crawlers, no-JS, reduced motion. */}
      <div className="cj-static">
        <p className="editorial-kicker">Michael David</p>
        <h1 className="hero-display mt-4 font-display text-5xl leading-[0.95] text-white md:text-7xl">Curls &amp; Contemplation</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-whitegold/85">A stylist&rsquo;s interactive journey — beyond the craft, into the calling.</p>
        <figure>
          <Image src="/curl-poster.jpg" alt="Spiral curls emerging from obsidian darkness under a single antique-gold light" width={1280} height={720} priority className="h-auto w-full object-cover" />
        </figure>
        <section>
          <p className="editorial-kicker">The calling</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">There is a moment when your gift starts asking for more.</h2>
        </section>
        <section>
          <p className="editorial-kicker">What this is</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Not a technique book. A doorway.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-whitegold/80">Purpose — the work, named for what it actually is. Freedom — a rate you can say once, plainly. Legacy — a practice that outlasts the calendar.</p>
        </section>
        <section>
          <p className="editorial-kicker">Who it&rsquo;s for</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">The stylist whose chair feels smaller than her vision.</h2>
          <p className="mt-4 max-w-2xl leading-8 text-whitegold/80">The underpriced. The invisible. The booked-and-burned-out. The almost-CEO. One of these is a mirror — the journey meets each one where it starts.</p>
        </section>
        <section>
          <p className="editorial-kicker">The threshold</p>
          <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">{finalLine}</h2>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link className="cj-cta-gold" style={{ marginTop: 0 }} href={ctaHref}>{ctaLabel}</Link>
            <Link className="cj-cta-ghost" style={{ marginTop: 0, alignSelf: "center" }} href="/free-chapter">or read Chapter 1 free</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
