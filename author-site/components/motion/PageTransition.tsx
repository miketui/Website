"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const quiet = useReducedMotion() || isDecorativeMotionExcludedRoute(pathname);
  return <div className={clsx(!quiet && "motion-safe:animate-[fadeIn_260ms_ease-out]")}>{children}</div>;
}
