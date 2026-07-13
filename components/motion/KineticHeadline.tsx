"use client";

import { useEffect, useRef, useState, type ElementType, type Ref } from "react";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * KineticHeadline — motion asset "J" (kinetic type), built in code as Cormorant
 * Garamond rather than as a rendered video (per the manifest: status IN-CODE).
 * Words rise and fade in on a gentle stagger the first time the line scrolls into
 * view. Under prefers-reduced-motion the whole line is simply present — no
 * transform, no stagger, no observer — so nothing animates and nothing shifts.
 * The reserved layout is identical in both states (CLS-safe).
 */
export function KineticHeadline({
  text,
  as: Tag = "h2",
  className,
  accentFrom,
  waitForEvent
}: {
  text: string;
  as?: ElementType;
  className?: string;
  /** Zero-based word index from which the remaining words render in antique gold. */
  accentFrom?: number;
  /** Optional window event that starts the reveal (used for coordinated entrances). */
  waitForEvent?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Under reduced motion the line is already shown via `shown` below — no
    // observer, and nothing to set here.
    if (reduced) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    // On a first homepage visit, wait for the cover dissolve. Without this
    // coordination the headline can complete its reveal behind the opaque
    // intro. Returning visitors have no cover attribute and use the observer
    // path immediately.
    if (waitForEvent && document.documentElement.hasAttribute("data-cc-cover")) {
      const reveal = () => setVisible(true);
      window.addEventListener(waitForEvent, reveal, { once: true });
      return () => window.removeEventListener(waitForEvent, reveal);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, waitForEvent]);

  // Collapse any run of whitespace so no empty <span> gets a transition/delay.
  const words = text.trim().split(/\s+/);
  const shown = visible || reduced;

  return (
    <Tag
      ref={ref as Ref<HTMLHeadingElement>}
      className={["font-display leading-[0.95] text-white", className ?? ""].join(" ").trim()}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className={["inline-block whitespace-pre", accentFrom !== undefined && i >= accentFrom ? "text-antique" : ""].join(" ").trim()}
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(0.4em)",
            transition: reduced ? undefined : "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
            transitionDelay: reduced ? undefined : `${i * 80}ms`
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
