"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import manifest from "@/public/motion/motion-manifest.json";

/**
 * MotionAsset — one Higgsfield motion clip, wired straight from the authoritative
 * manifest (public/motion/motion-manifest.json). It is built to survive the
 * repo's current reality: the binary .webm / .mp4 / -poster.webp files are NOT
 * committed yet (they arrive later in cc-motion-library.zip), so this component
 * NEVER shows a broken-image icon and NEVER shifts layout.
 *
 * Degradation ladder (best → worst source available), all at zero CLS because the
 * box reserves the manifest aspect ratio up front:
 *   1. reduced motion / DEFERRED / PENDING → poster image only, no <video> mounted
 *   2. poster 404s → the ACISS gradient placeholder shows through (onError hides img)
 *   3. video 404s → poster (or gradient) stays; <video> just never paints
 *
 * Playback is IntersectionObserver-gated (plays at ≥25% in view, pauses when out).
 * Triggers, read from the manifest:
 *   • (default)      loop while in view
 *   • "scroll-once"  play once on first view, then hold the last frame (F)
 *   • "event-once"   stay on the poster; play once when a window CustomEvent named
 *                    by `playOnEvent` fires (I burst → e.g. "purchase-success")
 * There is no audio track; video is always muted.
 */

type ManifestAsset = {
  id: string;
  name: string;
  status: string;
  file?: string;
  mp4?: string;
  poster?: string;
  aspect?: string;
  trigger?: string;
};

const assets = manifest.assets as ManifestAsset[];

/** "9:16" → "9 / 16" for the CSS aspect-ratio property. Falls back to 16 / 9. */
function aspectRatio(aspect?: string): string {
  if (!aspect) return "16 / 9";
  const [w, h] = aspect.split(":");
  return w && h ? `${w} / ${h}` : "16 / 9";
}

/** Gradient placeholder derived only from the five locked ACISS tokens. Gold-warm
 *  for the ceremonial beats (hero, burst, crown), deep-jade for everything else. */
function placeholderGradient(id: string): string {
  const gold = ["A", "I", "L"].includes(id);
  const end = gold ? "var(--aciss-antique-gold)" : "var(--aciss-deep-jade)";
  return `radial-gradient(120% 90% at 50% 38%, color-mix(in srgb, var(--aciss-white-gold) 12%, transparent), transparent 60%), linear-gradient(140deg, var(--aciss-obsidian) 12%, color-mix(in srgb, ${end} 55%, var(--aciss-obsidian)) 100%)`;
}

export function MotionAsset({
  id,
  className,
  priority = false,
  playOnEvent,
  children
}: {
  id: string;
  className?: string;
  priority?: boolean;
  /** Window CustomEvent name that plays an "event-once" asset (e.g. "purchase-success"). */
  playOnEvent?: string;
  /** Optional overlay content (headline / caption) rendered above the media. */
  children?: ReactNode;
}) {
  const asset = assets.find((a) => a.id === id);
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [posterOk, setPosterOk] = useState(true);

  const status = asset?.status ?? "PENDING";
  const delivered = status === "DELIVERED";
  const eventDriven = Boolean(playOnEvent) || asset?.trigger === "event-once";
  // A <video> is only ever mounted for DELIVERED assets with motion allowed.
  const showVideo = Boolean(asset) && delivered && !reduced;

  useEffect(() => {
    if (!showVideo) return undefined;
    const video = videoRef.current;
    const el = containerRef.current;
    if (!video || !el || !asset) return undefined;

    const trigger = asset.trigger;
    const loops = !trigger || (trigger !== "scroll-once" && trigger !== "event-once");
    video.loop = loops;

    // "event-once": hold the poster until the named success event fires, then
    // play exactly once. No IntersectionObserver playback.
    if (eventDriven) {
      if (!playOnEvent) return undefined;
      const onEvent = () => {
        video.currentTime = 0;
        void video.play().catch(() => {});
      };
      window.addEventListener(playOnEvent, onEvent);
      return () => window.removeEventListener(playOnEvent, onEvent);
    }

    // Scroll-gated playback (default loop, or "scroll-once" plays once and holds).
    let playedOnce = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        if (inView) {
          if (trigger === "scroll-once") {
            if (!playedOnce) {
              playedOnce = true;
              void video.play().catch(() => {});
            }
          } else {
            void video.play().catch(() => {});
          }
        } else if (trigger !== "scroll-once") {
          // scroll-once holds its last frame after ending; others pause off-screen.
          video.pause();
        }
      },
      { threshold: [0, 0.25, 0.5, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showVideo, eventDriven, playOnEvent, asset]);

  // Unknown id: render nothing rather than an empty gradient box.
  if (!asset) return null;

  const poster = asset.poster;
  const ratio = aspectRatio(asset.aspect);

  return (
    <div
      ref={containerRef}
      className={["relative isolate overflow-hidden", className ?? ""].join(" ").trim()}
      style={{ aspectRatio: ratio, background: placeholderGradient(id) }}
      role="img"
      aria-label={asset.name}
    >
      {/* Poster sits beneath the video and above the gradient. If it 404s we hide
          it and the ACISS gradient remains — no broken-image icon, ever. */}
      {poster && posterOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          onError={() => setPosterOk(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}

      {showVideo ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="none"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* WebM primary, MP4 fallback — order per the manifest delivery note. */}
          {asset.file ? <source src={asset.file} type="video/webm" /> : null}
          {asset.mp4 ? <source src={asset.mp4} type="video/mp4" /> : null}
        </video>
      ) : null}

      {/* DEFERRED (C portrait, K hands) and PENDING assets are poster-only: no
          <video> is mounted and real footage is still required. */}
      {!delivered ? <>{/* TODO motion asset {id}: real footage required */}</> : null}

      {children ? (
        <div className="pointer-events-none absolute inset-0">
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/70 via-obsidian/10 to-transparent" />
          <div className="pointer-events-auto relative z-10 flex h-full w-full flex-col items-center justify-end p-6 text-center md:p-10">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
