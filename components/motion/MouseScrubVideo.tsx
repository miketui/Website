"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

/**
 * Mouse-controlled video scrub (Atoms guide, skill 03). Mouse X across the
 * band maps to video.currentTime: ratio = clamp(x / width) → targetTime =
 * ratio × duration. Seeking only — the video is muted, playsInline,
 * preload="auto" and never plays. mousemove stores the target; a single rAF
 * loop eases the displayed time toward it and writes currentTime at most
 * once per frame, stopping when settled and restarting on the next move.
 *
 * Touch-only devices, reduced motion, and excluded routes get the poster
 * still (no video element mounted).
 */
export function MouseScrubVideo({ src, webmSrc, poster, className, children }: { src: string; webmSrc?: string; poster: string; className?: string; children?: ReactNode }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pathname = usePathname() ?? "/";
  const reduced = useReducedMotion();
  const quiet = reduced || isDecorativeMotionExcludedRoute(pathname);

  useEffect(() => {
    if (quiet) return undefined;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return undefined;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return undefined;

    let raf = 0;
    let duration = 0;
    let target = 0;
    let displayed = -1;

    /* Document-space metrics cached on mount/resize — reading layout inside
       pointermove would force a synchronous reflow between the rAF writes. */
    let rectLeft = 0;
    let rectWidth = 1;

    const measure = () => {
      const rect = section.getBoundingClientRect();
      rectLeft = rect.left + window.scrollX;
      rectWidth = rect.width || 1;
    };

    const tick = () => {
      raf = 0;
      if (!duration) return;
      displayed = displayed < 0 ? target : displayed + (target - displayed) * 0.16;
      if (Math.abs(target - displayed) < 1 / 60) displayed = target;
      video.currentTime = displayed;
      if (displayed !== target) raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMeta = () => { duration = video.duration || 0; };
    const onMove = (event: PointerEvent) => {
      if (!duration) return;
      const ratio = Math.min(1, Math.max(0, (event.pageX - rectLeft) / rectWidth));
      target = ratio * duration;
      wake();
    };

    video.pause();
    if (video.readyState >= 1) onMeta();
    else video.addEventListener("loadedmetadata", onMeta);
    measure();
    section.addEventListener("pointermove", onMove);
    window.addEventListener("resize", measure);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      section.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [quiet]);

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className ?? ""}`}>
      {quiet ? (
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${poster})` }} />
      ) : (
        /* object-fit: cover (swap to `contain` to letterbox instead).
           H.264 first for hardware decode; VP9 covers codec-less builds. */
        <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover" poster={poster} muted playsInline preload="auto" aria-hidden="true" tabIndex={-1}>
          <source src={src} type="video/mp4" />
          {webmSrc && <source src={webmSrc} type="video/webm" />}
        </video>
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/20 to-obsidian/55" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
