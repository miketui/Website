"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MotionAsset } from "@/components/motion/MotionAsset";

/**
 * Immersive open: typographic ACISS cover → on enter/auto/scroll the cover
 * scales + fades while the unfurling swirl (asset B) settles behind it → the
 * app reveals beneath. Fires once per session (cookie `cc_cover_seen`).
 *
 * Pre-paint: the layout inline script raises html[data-cc-cover] (obsidian
 * curtain, cover.css) on the first "/" visit so the page never flashes before
 * this hydrates. This component owns the rich overlay above that curtain and
 * removes the attribute when the intro ends. prefers-reduced-motion skips
 * straight to the revealed app. On returning visits / non-home routes the
 * attribute is absent and this renders nothing.
 */

const SEEN_COOKIE = "cc_cover_seen";
const REVEAL_EVENT = "cc:revealed";
const AUTO_ENTER_MS = 700;
const SWIRL_MS = 600;
const EXIT_MS = 500;

function markRevealed() {
  document.documentElement.removeAttribute("data-cc-cover");
  document.body.classList.add("cc-revealed");
  window.dispatchEvent(new CustomEvent(REVEAL_EVENT));
}

export function CoverReveal() {
  const [active, setActive] = useState(false);
  const [swirling, setSwirling] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const enteringRef = useRef(false);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  }, []);

  const reveal = useCallback(() => {
    try {
      document.cookie = `${SEEN_COOKIE}=1; path=/; max-age=86400; SameSite=Lax`;
    } catch {
      /* cookies unavailable — the intro simply replays next load */
    }
    // Crossfade into the real selling hero and release pointer interaction
    // immediately. The headline listens for cc:revealed so its kinetic entrance
    // begins during this dissolve instead of finishing behind the cover.
    setExiting(true);
    markRevealed();
    later(() => setGone(true), EXIT_MS);
  }, [later]);

  const enter = useCallback(
    (fast: boolean) => {
      if (enteringRef.current) return;
      enteringRef.current = true;
      if (fast) {
        reveal();
        return;
      }
      setSwirling(true);
      later(reveal, SWIRL_MS);
    },
    [later, reveal]
  );

  useEffect(() => {
    // All decisions run inside a frame so no state update is synchronous in the
    // effect body. The pre-paint curtain (html[data-cc-cover]) covers the page
    // until this resolves, so there is nothing to flash.
    let cleanupWheel = () => {};
    const raf = requestAnimationFrame(() => {
      const shouldPlay = document.documentElement.hasAttribute("data-cc-cover");
      if (!shouldPlay) {
        // Returning visit or non-home route: nothing to reveal, mark done so the
        // nav (which waits for cc:revealed) shows immediately.
        markRevealed();
        setGone(true);
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        enter(true);
        return;
      }
      setActive(true);
      // The cover is act one, not a gate: begin the handoff inside the first
      // second and expose the real hero at roughly 1.3s after hydration.
      const auto = later(() => enter(false), AUTO_ENTER_MS);
      const onWheel = () => {
        window.clearTimeout(auto);
        enter(false);
      };
      window.addEventListener("wheel", onWheel, { passive: true, once: true });
      window.addEventListener("touchmove", onWheel, { passive: true, once: true });
      cleanupWheel = () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchmove", onWheel);
      };
    });
    return () => {
      cancelAnimationFrame(raf);
      cleanupWheel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((id) => window.clearTimeout(id));
      list.length = 0;
    };
  }, []);

  if (gone || !active) return null;

  return (
    <div
      id="cc-cover"
      className={[swirling ? "is-swirling" : "", exiting ? "is-gone" : ""].join(" ").trim()}
      role="dialog"
      aria-label="Curls and Contemplation — enter the journey"
    >
      <div className="cc-swirl" aria-hidden="true">
        <MotionAsset id="B" fill priority />
      </div>
      <div className="cc-card">
        <p className="font-display text-3xl leading-tight text-white">CURLS</p>
        <p className="font-accent text-2xl italic text-mist">&amp;</p>
        <p className="font-display text-lg tracking-[0.12em] text-white">CONTEMPLATION</p>
        <p className="mt-3 font-accent text-base italic text-whitegold/80">A Stylist&rsquo;s Interactive Journey</p>
        <p className="cc-promise mt-5 max-w-[15rem] text-sm leading-5 text-whitegold/90">
          You learned the craft. Nobody taught you the business.
        </p>
        <p className="mt-auto text-[0.6rem] uppercase tracking-[0.34em] text-antique">Michael David</p>
      </div>
      <button
        type="button"
        onClick={() => enter(false)}
        className="cc-enter inline-flex items-center rounded-sm border border-whitegold/35 px-7 py-3 text-sm text-whitegold transition-colors hover:border-antique hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
      >
        Enter the journey
      </button>
    </div>
  );
}
