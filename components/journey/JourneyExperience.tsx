"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getLaunchStateCopy } from "@/config/launchState";

/**
 * "The Book Is the Door" — scroll-scrubbed homepage journey (treatment v6).
 *
 * The landing is the closed book (real cover art). Scrolling opens the cover
 * and walks the camera into the pages, through four worlds (Craft, Mirror,
 * Practice, Bloom — one funnel card each), then hands off to the normal
 * server-rendered document, which carries all SEO copy. This component is a
 * progressive enhancement: until its effect sets <html data-journey="on">,
 * every journey layer is display:none and the tracks are 0vh (styles/
 * journey.css), so no-JS, crawlers, and prefers-reduced-motion all get the
 * ordinary page. One lerped rAF engine drives everything; transform/opacity
 * only, no scroll-jacking, fully reversible (scroll up walks back out and
 * the cover closes).
 */

const WORLDS = [
  { key: "craft", num: "01", name: "The Craft", window: [0.1, 0.3], z: -350 },
  { key: "mirror", num: "02", name: "The Mirror", window: [0.34, 0.54], z: -1480 },
  { key: "practice", num: "03", name: "The Practice", window: [0.58, 0.76], z: -2610 },
  { key: "bloom", num: "04", name: "The Bloom", window: [0.8, 0.96], z: -3760 }
] as const;
const DEPTH = 4400;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function ramp(p: number, stops: number[], values: number[]) {
  if (p <= stops[0]) return values[0];
  for (let i = 1; i < stops.length; i++) {
    if (p <= stops[i]) return lerp(values[i - 1], values[i], (p - stops[i - 1]) / (stops[i] - stops[i - 1]));
  }
  return values[values.length - 1];
}

export function JourneyExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  /* One gold ask at the threshold — label/href flip with the launch state. */
  const journeyCta = getLaunchStateCopy().heroCta;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.removeAttribute("data-cc-gateway");
    if (reduce) return;

    const root = rootRef.current;
    if (!root) return;
    const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
    const world = q<HTMLDivElement>(".jr-world");
    const bookScene = q<HTMLDivElement>(".jr-book-scene");
    const book = q<HTMLDivElement>(".jr-book");
    const cover = q<HTMLDivElement>(".jr-cover");
    const landingCopy = q<HTMLDivElement>(".jr-landing-copy");
    const bookTrack = q<HTMLDivElement>(".jr-book-track");
    const journeyTrack = q<HTMLDivElement>(".jr-journey-track");
    const hero = q<HTMLElement>(".jr-hero");
    const heroLine = q<HTMLParagraphElement>(".jr-h");
    const stations = [...root.querySelectorAll<HTMLDivElement>(".jr-station")];
    const cards = [...root.querySelectorAll<HTMLDivElement>(".jr-card")];
    if (!world || !bookScene || !book || !cover || !bookTrack || !journeyTrack || !hero || !heroLine) return;
    /* Fail closed: journey chrome only appears once every required node exists. */
    document.documentElement.setAttribute("data-journey", "on");

    /* Split the hero line into words client-side only (copy stays intact in the
       server HTML for crawlers/no-JS). Mutating here is React-safe: this subtree
       is static JSX with no state or props, so React never reconciles it after
       mount, and the dataset guard makes the split idempotent across remounts. */
    let words: HTMLElement[] = [];
    if (!heroLine.dataset.split) {
      heroLine.dataset.split = "1";
      const splitInto = (node: Node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === Node.TEXT_NODE) {
            const frag = document.createDocumentFragment();
            (n.textContent ?? "").split(/(\s+)/).forEach((part) => {
              if (!part) return;
              if (/^\s+$/.test(part)) return void frag.appendChild(document.createTextNode(" "));
              const s = document.createElement("span");
              s.className = "jr-w";
              s.textContent = part;
              frag.appendChild(s);
            });
            n.parentNode?.replaceChild(frag, n);
          } else {
            splitInto(n);
          }
        });
      };
      splitInto(heroLine);
    }
    words = [...heroLine.querySelectorAll<HTMLElement>(".jr-w")];

    /* Dust motes in the void. */
    const viewport = q<HTMLDivElement>(".jr-viewport");
    if (viewport && !viewport.dataset.dust) {
      viewport.dataset.dust = "1";
      for (let i = 0; i < 22; i++) {
        const d = document.createElement("span");
        d.className = "jr-dust";
        d.style.left = `${Math.random() * 100}%`;
        d.style.top = `${Math.random() * 100}%`;
        d.style.opacity = (0.15 + Math.random() * 0.4).toFixed(2);
        d.style.animationDuration = `${14 + Math.random() * 22}s`;
        d.style.animationDelay = `${-Math.random() * 20}s`;
        viewport.appendChild(d);
      }
    }

    /* Pointer answers the hand before the wheel does (landing only). */
    let target = window.scrollY;
    let current = window.scrollY;
    let raf = 0;
    let running = false;
    /* Layout metrics are read once per resize, never inside the rAF loop or
       the pointer handler — layout reads there would force thrashing. */
    const metrics = { vh: 1, vw: 1, bMax: 1, heroTop: 0, tTop: 0, tMax: 1 };
    const measure = () => {
      metrics.vh = window.innerHeight;
      metrics.vw = window.innerWidth;
      metrics.bMax = Math.max(1, bookTrack.offsetHeight - metrics.vh * 0.2);
      metrics.heroTop = bookTrack.offsetTop + bookTrack.offsetHeight;
      metrics.tTop = journeyTrack.offsetTop;
      metrics.tMax = Math.max(1, journeyTrack.offsetHeight - metrics.vh);
    };
    measure();

    let tiltX = 0;
    let tiltY = 0;
    const onPointer = (e: PointerEvent) => {
      /* Mouse only — touch-scroll fires pointermove and would jitter the tilt. */
      if (e.pointerType !== "mouse") return;
      tiltY = (e.clientX / metrics.vw - 0.5) * 7;
      tiltX = -(e.clientY / metrics.vh - 0.5) * 4.5;
      /* The book answers the hand even before the first scroll. */
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const render = (y: number) => {
      const { vh, bMax, heroTop, tTop, tMax } = metrics;

      /* Act I — the cover opens; the camera walks into the pages. */
      const bp = clamp(y / bMax, 0, 1);
      if (bp < 1) {
        bookScene.style.display = "block";
        const rot = ramp(bp, [0.04, 0.72], [0, -165]);
        const scale = ramp(bp, [0, 0.7, 1], [1, 1.7, 3.0]);
        cover.style.transform = `rotateY(${rot}deg)`;
        cover.style.setProperty("--jr-hinge", `${clamp(-rot / 165, 0, 1)}`);
        book.style.transform = `translateY(${bp * vh * 0.1}px) rotateX(${bp < 0.05 ? tiltX : 0}deg) rotateY(${bp < 0.05 ? tiltY : 0}deg) scale(${scale})`;
        bookScene.style.opacity = String(ramp(bp, [0.78, 0.98], [1, 0]));
        bookScene.style.pointerEvents = bp > 0.55 ? "none" : "auto";
        if (landingCopy) landingCopy.style.opacity = String(ramp(bp, [0, 0.18], [1, 0]));
      } else {
        bookScene.style.display = "none";
      }

      /* Act II — arrival line floats in, then fully exits before World 1. */
      words.forEach((w, i) => {
        const inP = clamp((y - (heroTop - vh * 0.92) - i * 26) / (vh * 0.45), 0, 1);
        const outP = clamp((y - heroTop - i * 30) / (vh * 0.7), 0, 1);
        w.style.opacity = String(inP * (1 - outP));
        w.style.transform = `translateY(${(1 - inP) * 26 + outP * 42}px)`;
      });

      /* Act III — the four worlds. Camera translateZ through the stations. */
      const wp = clamp((y - tTop) / tMax, 0, 1);
      world.style.transform = `translateZ(${wp * DEPTH}px)`;
      stations.forEach((s, i) => {
        const rel = WORLDS[i].z + wp * DEPTH;
        /* Signed cull: a station that has passed the lens (rel > 0) must never
           render — perspective would blow it up over the grounded content. */
        const d = Math.abs(rel);
        const passed = rel > 110;
        s.style.opacity = passed ? "0" : String(clamp(1 - (d - 160) / 950, 0, 1));
        s.style.visibility = passed || d > 1400 ? "hidden" : "visible";
      });
      /* The world ends where the document begins: fade the whole viewport out
         over the journey's last beats so the grounded flow sits on clean obsidian. */
      const worldFade = ramp(wp, [0.96, 1], [1, 0]);
      if (viewport) {
        viewport.style.opacity = String(worldFade);
        viewport.style.visibility = worldFade === 0 ? "hidden" : "visible";
      }
      const scrim = root.querySelector<HTMLDivElement>(".jr-scrim");
      if (scrim) {
        scrim.style.opacity = String(worldFade);
        scrim.style.visibility = worldFade === 0 ? "hidden" : "visible";
      }

      cards.forEach((c, i) => {
        const [a, b] = WORLDS[i].window;
        const w = clamp((wp - a) / (b - a), 0, 1);
        const op = ramp(w, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
        const sc = ramp(w, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.94]);
        const yy = ramp(w, [0, 0.3, 0.7, 1], [60, 0, 0, -40]);
        const rx = ramp(w, [0, 0.3], [14, 0]);
        c.style.opacity = String(op);
        c.style.visibility = op === 0 ? "hidden" : "visible";
        c.style.transform = `translate(-50%,-50%) translateY(${yy}px) rotateX(${rx}deg) scale(${sc})`;
        c.querySelectorAll<HTMLElement>(".jr-cta").forEach((cta) => {
          /* Hidden cards leave the tab order too — anchors stay focusable
             unless explicitly removed. */
          cta.style.pointerEvents = op > 0.6 ? "auto" : "none";
          cta.tabIndex = op > 0.6 ? 0 : -1;
        });
      });
    };

    const tick = () => {
      current += (target - current) * 0.09;
      if (Math.abs(target - current) < 0.4) {
        current = target;
        running = false;
      }
      render(current);
      if (running) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = window.scrollY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    render(current);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
      document.documentElement.removeAttribute("data-journey");
    };
  }, []);

  const openBook = () => {
    const track = rootRef.current?.querySelector<HTMLDivElement>(".jr-book-track");
    if (track) window.scrollTo({ top: track.offsetHeight * 0.95, behavior: "smooth" });
  };

  const skipJourney = () => {
    const track = rootRef.current?.querySelector<HTMLDivElement>(".jr-journey-track");
    if (track) window.scrollTo({ top: track.offsetTop + track.offsetHeight, behavior: "smooth" });
  };

  return (
    <div ref={rootRef} aria-hidden={false}>
      {/* Fixed 3D world (decorative — real copy lives in the document below) */}
      <div className="jr-viewport" aria-hidden="true">
        <div className="jr-world">
          {/* 01 · The Craft — gold light: skill is warm */}
          <div className="jr-station" style={{ transform: `translate(-50%,-50%) translateZ(${WORLDS[0].z}px)` }}>
            <div className="jr-floor" />
            <div className="jr-wpanel" style={{ top: "34%" }}>
              <span className="jr-kicker">Michael David</span>
              <h3>Curls &amp; Contemplation</h3>
            </div>
            <svg className="jr-curl" style={{ left: "8%", top: "16%", width: 90 }} viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6c-14 9-20 24-16 40 8-2 14-8 17-16 2 8 8 14 16 15 3-16-4-31-17-39z" fill="none" stroke="#B08D57" strokeWidth="1.6" opacity=".9" /></svg>
            <svg className="jr-curl" style={{ right: "10%", top: "58%", width: 70, animationDelay: "1.2s" }} viewBox="0 0 64 64" aria-hidden="true"><path d="M32 6c-14 9-20 24-16 40 8-2 14-8 17-16 2 8 8 14 16 15 3-16-4-31-17-39z" fill="none" stroke="#B08D57" strokeWidth="1.4" opacity=".7" /></svg>
            {/* The wounds, made physical — the camera walks through them */}
            <div className="jr-plate" style={{ left: "18%", top: "62%", transform: "translateZ(140px) rotateY(8deg)" }}>The flinch before the quote<small>Pricing</small></div>
            <div className="jr-plate" style={{ left: "64%", top: "26%", transform: "translateZ(60px) rotateY(-7deg)" }}>Full book. Empty tank.<small>Burnout</small></div>
            <div className="jr-plate" style={{ left: "56%", top: "68%", transform: "translateZ(220px) rotateY(-4deg)" }}>The room you never entered<small>Networking</small></div>
          </div>
          {/* 02 · The Mirror — jade mist: recognition is a cold clear light */}
          <div className="jr-station" style={{ transform: `translate(-50%,-50%) translateZ(${WORLDS[1].z}px)` }}>
            <div className="jr-floor" />
            <div className="jr-mirror" />
            <span className="jr-arch" style={{ top: "20%", transform: "translateX(-160%)" }}>The Underpriced Artist</span>
            <span className="jr-arch" style={{ top: "30%", transform: "translateX(38%)" }}>The Invisible Talent</span>
            <span className="jr-arch" style={{ top: "62%", transform: "translateX(-155%)" }}>The Burned-Out Booked</span>
            <span className="jr-arch" style={{ top: "72%", transform: "translateX(42%)" }}>The Almost-CEO</span>
          </div>
          {/* 03 · The Practice — gold pooled low and warm */}
          <div className="jr-station" style={{ transform: `translate(-50%,-50%) translateZ(${WORLDS[2].z}px)` }}>
            <div className="jr-floor" />
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="jr-tick" style={{ left: `calc(50% + ${(i - 2) * 64}px)`, top: "44%", animationDelay: `${i * 0.2}s` }} />
            ))}
            <div className="jr-plate" style={{ left: "50%", top: "62%", transform: "translate(-50%,0) translateZ(90px)" }}>One small move a day<small>Price &middot; Pitch &middot; Protect</small></div>
          </div>
          {/* 04 · The Bloom — deep jade ground, the book waits ahead */}
          <div className="jr-station" style={{ transform: `translate(-50%,-50%) translateZ(${WORLDS[3].z}px)` }}>
            <div className="jr-floor" />
            <span className="jr-trace" style={{ width: "60%", left: "20%", top: "36%" }} />
            <span className="jr-trace" style={{ width: "44%", left: "30%", top: "56%", animationDelay: ".8s" }} />
            {/* Sixteen chapters, drawn as gold points converging on the book */}
            {Array.from({ length: 16 }, (_, i) => {
              const t = i / 15;
              const x = 14 + t * 36;
              const y = 74 - t * 32 + Math.sin(t * Math.PI) * -6;
              return <span key={i} className="jr-chapterdot" style={{ left: `${i % 2 === 0 ? x : 100 - x}%`, top: `${y}%`, transform: `translateZ(${-40 - t * 260}px)`, animationDelay: `-${t * 1.6}s` }} />;
            })}
            <div className="jr-plate" style={{ left: "50%", top: "66%", transform: "translate(-50%,0) translateZ(120px)" }}>Sixteen chapters. A worksheet in every one.<small>The whole map</small></div>
            <div className="jr-farbook" />
          </div>
        </div>
      </div>
      <div className="jr-scrim" aria-hidden="true" />

      {/* Act I — the closed book. Real cover art; scroll (or click) opens it. */}
      <div className="jr-book-scene">
        <div className="jr-book-stage">
          <div className="jr-book">
            <div className="jr-bookshadow" aria-hidden="true" />
            <div className="jr-bookinner">
            <div className="jr-backboard" />
            <div className="jr-pageedges" />
            <div className="jr-titlepage">
              <div className="jr-tp-eyebrow">Title page</div>
              <h2>Curls &amp; Contemplation</h2>
              <p>A freelance hairstylist&rsquo;s guide to creative excellence. Sixteen chapters. A guided worksheet in every one. One practice.</p>
              <div className="jr-tp-more">Keep scrolling &middot; the journey begins</div>
            </div>
            <div
              className="jr-cover"
              role="button"
              tabIndex={0}
              aria-label="Open the book"
              title="Scroll or click to open the book"
              onClick={openBook}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openBook();
                }
              }}
            >
              <div className="jr-coverfront"><span className="jr-coversheen" aria-hidden="true" /></div>
              <div className="jr-coverinside"><span>for every stylist building the business nobody taught them</span></div>
            </div>
            </div>
          </div>
          <div className="jr-landing-copy">
            <p className="jr-kicker">You learned the craft</p>
            <span className="jr-lineclip"><p className="jr-line">Nobody taught you the business. This book is the door.</p></span>
            <p className="jr-open-cue">Scroll to open the book</p>
          </div>
        </div>
      </div>
      <div className="jr-book-track" aria-hidden="true" />

      {/* Act II — arrival */}
      <header className="jr-hero" aria-hidden="true">
        <p className="jr-h">Stop learning the business the <em>expensive way.</em></p>
        <p>Walk the four rooms of the book. Scroll back any time and you leave the way you came in, cover and all.</p>
      </header>

      {/* Act III — the four worlds. PRD v2 / audit consensus: the journey is
          narrative until the threshold — worlds 01–03 make the reader feel the
          path; only the Bloom asks, once, with the one gold state-driven CTA
          (free chapter rides along as the quiet secondary). No four-door maze. */}
      <div className="jr-journey-track">
        <div className="jr-fg">
          <div className="jr-card">
            <p className="jr-kicker">01 &middot; The Craft</p>
            <h2>The craft was never the problem.</h2>
            <p>Your hands already know. It&rsquo;s everything after the chair that got learned alone, the expensive way.</p>
          </div>
          <div className="jr-card">
            <p className="jr-kicker">02 &middot; The Mirror</p>
            <h2>You&rsquo;re not behind. You were never given the map.</h2>
            <p>The underpriced. The invisible. The booked-and-burned-out. The almost-CEO. One of these is a mirror.</p>
          </div>
          <div className="jr-card">
            <p className="jr-kicker">03 &middot; The Practice</p>
            <h2>Price. Pitch. Protect.</h2>
            <p>One small move a day, on real clients, in the real world &mdash; until the business fits the artist.</p>
          </div>
          <div className="jr-card">
            <p className="jr-kicker">04 &middot; The Bloom</p>
            <h2>That stylist is sixteen chapters away.</h2>
            <p>The whole map, with a worksheet at every step.</p>
            <Link className="jr-cta" href={journeyCta.href}>{journeyCta.label}</Link>
            <Link className="jr-cta jr-cta--ghost" href="/free-chapter">or read Chapter 1 free</Link>
          </div>
        </div>
      </div>

      <button type="button" className="jr-skip" onClick={skipJourney}>Skip the journey</button>
    </div>
  );
}
