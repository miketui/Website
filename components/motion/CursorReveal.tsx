"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

/**
 * Cursor image-reveal band (Atoms guide, skill 01). Two stacked layers: the
 * FRONT image (the scene asleep — darkened) sits over the REVEAL image (the
 * same curls alive with gold light). A radial mask on FRONT follows the
 * cursor via CSS variables written in a requestAnimationFrame throttle, so
 * moving the pointer brings the light through the dark. CSS mask only — no
 * WebGL. On pointerleave the mask closes and FRONT is whole again.
 *
 * Fallbacks: touch-only devices, reduced motion, and excluded routes get the
 * REVEAL image static (the lush frame, no interaction) — a deliberate
 * brand-side deviation from the guide's "static FRONT" so the band never
 * reads as a black hole on phones.
 */
export function CursorReveal({ frontSrc, revealSrc, alt = "", className, children }: { frontSrc: string; revealSrc: string; alt?: string; className?: string; children?: ReactNode }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frontRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() ?? "/";
  const quiet = useReducedMotion() || isDecorativeMotionExcludedRoute(pathname);

  useEffect(() => {
    const section = sectionRef.current;
    const front = frontRef.current;
    if (!section || !front) return undefined;
    if (quiet || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      front.style.opacity = "0";
      return () => { front.style.opacity = ""; };
    }

    let raf = 0;
    let x = 0;
    let y = 0;
    let radius = 0;
    let targetRadius = 0;

    const paint = () => {
      raf = 0;
      radius += (targetRadius - radius) * 0.16;
      if (Math.abs(targetRadius - radius) < 0.5) radius = targetRadius;
      front.style.setProperty("--reveal-x", `${x.toFixed(1)}px`);
      front.style.setProperty("--reveal-y", `${y.toFixed(1)}px`);
      front.style.setProperty("--reveal-r", `${radius.toFixed(1)}px`);
      if (radius !== targetRadius) raf = requestAnimationFrame(paint);
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(paint); };

    const onMove = (event: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      targetRadius = Math.min(rect.width, 900) * 0.28;
      wake();
    };
    const onLeave = () => { targetRadius = 0; wake(); };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [quiet]);

  const mask = "radial-gradient(circle var(--reveal-r, 0px) at var(--reveal-x, 50%) var(--reveal-y, 50%), transparent 0%, transparent 62%, black 100%)";
  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className ?? ""}`}>
      {/* REVEAL: the lit scene (underneath) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${revealSrc})` }}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
      />
      {/* FRONT: the scene asleep — masked open around the cursor.
          object-fit/background-size: cover (use `contain` to letterbox instead). */}
      <div
        ref={frontRef}
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{ backgroundImage: `url(${frontSrc})`, maskImage: mask, WebkitMaskImage: mask }}
      />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
