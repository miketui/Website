"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * CurlDraw — a single gold curl that draws itself when it enters the viewport.
 * Powered by anime.js v4 (https://animejs.com), loaded from its official ESM
 * distribution at runtime so package.json/pnpm-lock stay untouched (no frozen-
 * lockfile build risk on Vercel). Fails silent + static if the import or the
 * network is unavailable; honors prefers-reduced-motion.
 */

const ANIME_ESM = "https://cdn.jsdelivr.net/npm/animejs@4.0.2/+esm";
// Bundler-safe dynamic import (Next/Turbopack won't try to resolve the URL).
const importAnime = new Function("u", "return import(u)") as (u: string) => Promise<{ animate: (t: unknown, o: Record<string, unknown>) => unknown }>;

export function CurlDraw({ className }: { className?: string }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const quiet = useReducedMotion();

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    if (quiet) {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      return;
    }
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        importAnime(ANIME_ESM)
          .then(({ animate }) => {
            if (cancelled) return;
            animate(path, { strokeDashoffset: [length, 0], duration: 2200, ease: "inOutQuad" });
          })
          .catch(() => {
            // anime.js unreachable — just show the finished curl.
            path.style.strokeDashoffset = "0";
          });
      },
      { threshold: 0.4 }
    );
    observer.observe(path);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [quiet]);

  return (
    <svg viewBox="0 0 320 80" fill="none" aria-hidden="true" className={className}>
      <path
        ref={pathRef}
        d="M8 56 C 60 8, 96 8, 118 40 C 138 70, 96 78, 88 54 C 82 34, 120 22, 160 34 C 210 49, 234 18, 270 26 C 296 32, 306 44, 312 40"
        stroke="#B08D57"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
