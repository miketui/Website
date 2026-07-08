"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

/**
 * Scroll-linked 2.5D depth. Children drift relative to natural scroll at
 * `speed` (positive = crosses the viewport faster than the page, floating
 * toward the viewer; negative = lags behind it, receding like a background
 * layer). Layout metrics are cached on resize; the scroll loop
 * touches transform only (compositor-friendly), runs solely while the layer
 * is near the viewport, and lerps toward the target so motion stays silky.
 * Renders static under reduced motion or on decorative-motion-excluded routes.
 */
export function ParallaxDepth({ speed, depth, maxShift = 90, className, children }: { speed?: number; depth?: number; maxShift?: number; className?: string; children: ReactNode }) {
  // Each depth unit maps to this fraction of viewport height as parallax speed.
  // E.g. depth=-2 recedes gently; depth=1 floats toward the viewer.
  const DEPTH_SPEED_UNIT = 0.07;
  const resolvedSpeed = speed ?? (depth !== undefined ? depth * DEPTH_SPEED_UNIT : 0.14);
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() ?? "/";
  const quiet = useReducedMotion() || isDecorativeMotionExcludedRoute(pathname);

  useEffect(() => {
    if (quiet) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    let raf = 0;
    let active = false;
    let baseCenter = 0;
    let viewportHalf = window.innerHeight / 2;
    let current = 0;
    let target = 0;

    const measure = () => {
      viewportHalf = window.innerHeight / 2;
      const rect = node.getBoundingClientRect();
      // Subtract the applied shift so the cached center stays untranslated.
      baseCenter = rect.top + window.scrollY + rect.height / 2 - current;
    };

    const retarget = () => {
      const delta = (baseCenter - (window.scrollY + viewportHalf)) * resolvedSpeed;
      target = Math.max(-maxShift, Math.min(maxShift, delta));
    };

    const tick = () => {
      raf = 0;
      current += (target - current) * 0.12;
      if (Math.abs(target - current) < 0.1) current = target;
      node.style.transform = `translate3d(0, ${current.toFixed(2)}px, 0)`;
      if (active && current !== target) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      retarget();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => { if (active) wake(); };
    const onResize = () => { measure(); if (active) wake(); };

    const observer = new IntersectionObserver(([entry]) => {
      active = Boolean(entry?.isIntersecting);
      if (active) { measure(); wake(); }
    }, { rootMargin: "25% 0px 25% 0px" });

    measure();
    observer.observe(node);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      node.style.transform = "";
    };
  }, [quiet, resolvedSpeed, maxShift]);

  return <div ref={ref} className={className}>{children}</div>;
}
