"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

/**
 * Scroll-controlled video scrub (Atoms guide, skill 04). A tall track pins a
 * full-viewport video; scroll progress through the track maps continuously to
 * video.currentTime — down scrubs forward, up scrubs backward. The video is
 * muted, playsInline, preload="auto" and stays PAUSED for the whole
 * interaction: this is seeking, never playback. A single rAF loop eases the
 * displayed time toward the target and writes currentTime at most once per
 * frame (writing on the raw scroll event causes jitter and black frames).
 * The source is encoded with dense keyframes so seeks land cleanly.
 *
 * Reduced motion / excluded routes: renders the poster still with the copy —
 * no video element is mounted at all.
 */
export function ScrollScrubVideo({ src, webmSrc, poster, trackVh = 240, className, stages, children }: { src: string; webmSrc?: string; poster: string; trackVh?: number; className?: string; stages?: ReactNode[]; children?: ReactNode }) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pathname = usePathname() ?? "/";
  const quiet = useReducedMotion() || isDecorativeMotionExcludedRoute(pathname);
  const [progressPct, setProgressPct] = useState(0);

  useEffect(() => {
    if (quiet) return undefined;
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return undefined;

    let raf = 0;
    let active = false;
    let duration = 0;
    let trackTop = 0;
    let trackRange = 1;
    let target = 0;
    let displayed = -1;
    let lastPct = -1;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      trackTop = rect.top + window.scrollY;
      trackRange = Math.max(1, rect.height - window.innerHeight);
    };

    const retarget = () => {
      if (!duration) return;
      const progress = Math.min(1, Math.max(0, (window.scrollY - trackTop) / trackRange));
      target = progress * duration;
      const pct = Math.round(progress * 100);
      if (pct !== lastPct) { lastPct = pct; setProgressPct(pct); }
    };

    const tick = () => {
      raf = 0;
      if (duration) {
        displayed = displayed < 0 ? target : displayed + (target - displayed) * 0.18;
        if (Math.abs(target - displayed) < 1 / 60) displayed = target;
        // One currentTime write per frame, eased toward the scroll target.
        video.currentTime = displayed;
        if (active && displayed !== target) raf = requestAnimationFrame(tick);
      }
    };
    const wake = () => { retarget(); if (!raf) raf = requestAnimationFrame(tick); };

    const onMeta = () => { duration = video.duration || 0; measure(); wake(); };
    const onScroll = () => { if (active) wake(); };
    const onResize = () => { measure(); if (active) wake(); };

    // The video must stay paused: seek-only interaction, never play().
    video.pause();
    if (video.readyState >= 1) onMeta();
    else video.addEventListener("loadedmetadata", onMeta);

    const observer = new IntersectionObserver(([entry]) => {
      active = Boolean(entry?.isIntersecting);
      if (active) { measure(); wake(); }
    }, { rootMargin: "40% 0px 40% 0px" });
    observer.observe(track);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [quiet]);

  if (quiet) {
    return (
      <section className={`relative overflow-hidden ${className ?? ""}`}>
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${poster})` }} />
        <div aria-hidden="true" className="absolute inset-0 bg-obsidian/45" />
        <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-5 py-20 text-center">{children}{stages?.[0]}</div>
      </section>
    );
  }

  return (
    <div ref={trackRef} className={className} style={{ height: `${trackVh}vh` }}>
      <section className="sticky top-0 h-screen overflow-hidden">
        {/* object-fit: cover (swap to `contain` to letterbox instead).
            H.264 first for hardware decode; VP9 covers codec-less builds. */}
        <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" poster={poster} muted playsInline preload="auto" aria-hidden="true" tabIndex={-1}>
          <source src={src} type="video/mp4" />
          {webmSrc && <source src={webmSrc} type="video/webm" />}
        </video>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-obsidian/55 via-transparent to-obsidian/65" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
          {children}
          {stages && stages.length > 0 && (
            /* The story beats: one caption per act, crossfading with progress */
            <div className="relative grid w-full max-w-3xl place-items-center">
              {stages.map((stage, index) => {
                const act = Math.min(stages.length - 1, Math.floor((progressPct / 100) * stages.length));
                return (
                  <div key={index} className={`col-start-1 row-start-1 transition-opacity duration-700 ${act === index ? "opacity-100" : "opacity-0"}`} aria-hidden={act !== index}>
                    {stage}
                  </div>
                );
              })}
            </div>
          )}
          <div aria-hidden="true" className="absolute bottom-10 left-1/2 w-40 -translate-x-1/2">
            <div className="h-px w-full bg-whitegold/20">
              <div className="h-px bg-antique transition-[width] duration-150 ease-linear" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-2 text-center text-[0.6rem] uppercase tracking-[0.3em] text-whitegold/50">Scroll to walk through</p>
          </div>
        </div>
      </section>
    </div>
  );
}
