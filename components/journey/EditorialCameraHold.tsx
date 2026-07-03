"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * Editorial camera-hold (elevation pass, 2026-07-02).
 *
 * The inspiration reference's signature move: a tall track pins a
 * full-viewport media stage; as the reader scrolls, three scenes
 * cross-dissolve with a slow 1.06 → 1.0 settle — a camera pulling focus —
 * while a micro-label + serif display line trades places over the image.
 * Atoms combined-build compliant: this is a new module assembled INTO the
 * existing flow (Journey entrance → camera-hold → cursor reveal), reusing
 * only art already committed to the project — no stock, no external URLs.
 *
 * Perf: transform/opacity only, driven by motion/react useScroll (rAF-
 * batched, passive). Reduced motion / no-JS: the scenes render as ordinary
 * stacked panels — every line stays in the server HTML for crawlers.
 */
const SCENES = [
  {
    src: "/curl-poster.jpg",
    alt: "Spiral curls emerging from obsidian darkness under a single antique-gold light",
    kicker: "The craft was never the question",
    line: "Your hands already know.",
    detail: "Sixteen chapters for everything after the chair — priced, pitched, protected."
  },
  {
    src: "/curl-front.jpg",
    alt: "Dark curls in deep emerald shadow, waiting for the light",
    kicker: "The part nobody photographs",
    line: "The business learned alone, the expensive way.",
    detail: "Pricing scripts, set-day protocol, a rhythm that refills what the calendar drains."
  },
  {
    src: "/gateway-cover.jpg",
    alt: "Curls & Contemplation book cover",
    kicker: "July 14 · direct from the author",
    line: "Here is the map.",
    detail: "Preorder the EPUB edition — delivered to your account, protected, yours."
  }
] as const;

function Scene({ progress, index, count, scene }: { progress: MotionValue<number>; index: number; count: number; scene: (typeof SCENES)[number] }) {
  // Each scene owns an equal window of track progress, with soft shoulders.
  // The keyframe arrays span the FULL 0→1 domain explicitly (values pinned at
  // both ends) so a scene can never re-enter outside its window regardless of
  // interpolation/clamp behavior at the domain edges.
  const start = index / count;
  const end = (index + 1) / count;
  const fade = 0.35 / count;
  const first = index === 0;
  const last = index === count - 1;
  const eps = 0.0001;
  const inputs = [0, Math.max(start, eps), Math.min(start + fade, 1 - eps), Math.max(end - fade, eps), Math.min(end, 1 - eps), 1];
  const outputs = [first ? 1 : 0, first ? 1 : 0, 1, 1, last ? 1 : 0, last ? 1 : 0];
  const opacity = useTransform(progress, inputs, outputs);
  // The focus-pull: image settles from 1.06 to 1.0 across its window, and
  // holds those endpoints across the rest of the domain.
  const scale = useTransform(progress, [0, Math.max(start, eps), Math.min(end, 1 - eps), 1], [1.06, 1.06, 1, 1]);
  const copyY = useTransform(progress, [0, Math.max(start, eps), Math.min(start + fade, 1 - eps), 1], [28, 28, 0, 0]);

  return (
    <motion.figure style={{ opacity }} className="absolute inset-0 m-0">
      <motion.div style={{ scale }} className="absolute inset-0 will-change-transform">
        <Image src={scene.src} alt={scene.alt} fill sizes="100vw" className="object-cover" priority={false} />
        {/* Obsidian scrim keeps the serif line at WCAG contrast over any frame. */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/45 to-obsidian/25" />
      </motion.div>
      <motion.figcaption style={{ y: copyY }} className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-5xl px-5 pb-20 md:px-6 md:pb-28">
        <p className="editorial-kicker mb-4">{scene.kicker}</p>
        <p className="hero-display font-display text-4xl leading-tight text-white md:text-6xl">{scene.line}</p>
        <p className="mt-4 max-w-xl text-base leading-7 text-whitegold/80 md:text-lg">{scene.detail}</p>
      </motion.figcaption>
    </motion.figure>
  );
}

export function EditorialCameraHold() {
  const trackRef = useRef<HTMLElement | null>(null);
  const quiet = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });

  if (quiet) {
    // Static fallback: same copy and art, ordinary flow, no pinning.
    return (
      <section aria-label="Inside the book — three scenes">
        {SCENES.map((scene) => (
          <figure key={scene.line} className="relative m-0 min-h-[70vh] overflow-hidden">
            <Image src={scene.src} alt={scene.alt} fill sizes="100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/45 to-obsidian/25" />
            <figcaption className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-5xl px-5 pb-16 md:px-6">
              <p className="editorial-kicker mb-4">{scene.kicker}</p>
              <p className="hero-display font-display text-4xl leading-tight text-white md:text-6xl">{scene.line}</p>
              <p className="mt-4 max-w-xl text-base leading-7 text-whitegold/80 md:text-lg">{scene.detail}</p>
            </figcaption>
          </figure>
        ))}
      </section>
    );
  }

  return (
    <section ref={trackRef} aria-label="Inside the book — three scenes" className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-obsidian">
        {SCENES.map((scene, i) => (
          <Scene key={scene.line} progress={scrollYProgress} index={i} count={SCENES.length} scene={scene} />
        ))}
        {/* Hairline progress cue, gold — quiet, luxury, no numerals. */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="absolute inset-x-0 bottom-0 block h-px origin-left bg-antique/80"
        />
      </div>
    </section>
  );
}
