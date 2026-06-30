"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

export function ScrollReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() ?? "/";
  const quiet = useReducedMotion() || isDecorativeMotionExcludedRoute(pathname);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (quiet) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.16 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [quiet]);

  return (
    <div ref={ref} className={clsx("reveal-block", (visible || quiet) && "is-visible", className)}>
      {children}
    </div>
  );
}
