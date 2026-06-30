"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { isDecorativeMotionExcludedRoute } from "@/lib/route-policy";

export function BookTilt({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const pathname = usePathname() ?? "/";
  const disabled = reduced || isDecorativeMotionExcludedRoute(pathname);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");

  return (
    <div
      className="book-tilt transform-gpu transition-transform duration-300 ease-out motion-reduce:transform-none"
      style={{ transform: disabled ? undefined : transform }}
      onPointerMove={(event) => {
        if (disabled || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        setTransform(`perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 7}deg) translateZ(0)`);
      }}
      onPointerLeave={() => setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)")}
    >
      {children}
    </div>
  );
}
