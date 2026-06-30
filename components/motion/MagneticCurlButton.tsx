"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  "aria-label"?: string;
};

export function MagneticCurlButton({ href, children, className, variant = "primary", disabled = false, loading = false, ...props }: Props) {
  const reduced = useReducedMotion();
  const [transform, setTransform] = useState("translate3d(0,0,0)");
  const interactive = !reduced && !disabled && !loading;

  const classes = clsx(
    "group relative inline-flex min-h-12 items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
    "disabled:pointer-events-none disabled:opacity-60",
    variant === "primary" && "bg-antique text-obsidian shadow-gold hover:bg-mist",
    variant === "secondary" && "border border-antique/70 text-whitegold hover:bg-antique hover:text-obsidian",
    className
  );

  const content = (
    <>
      <span aria-hidden="true" className="pointer-events-none absolute -left-6 top-1/2 h-10 w-14 -translate-y-1/2 rounded-[60%] border border-current opacity-20 transition group-hover:translate-x-3 motion-reduce:transform-none" />
      <span className="relative z-10">{loading ? "Preparing…" : children}</span>
    </>
  );

  if (disabled) {
    return (
      <span aria-disabled="true" className={classes}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      {...props}
      onPointerMove={(event) => {
        if (!interactive || event.pointerType === "touch") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.045;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.045;
        setTransform(`translate3d(${x}px, ${y}px, 0)`);
      }}
      onPointerLeave={() => setTransform("translate3d(0,0,0)")}
      onBlur={() => setTransform("translate3d(0,0,0)")}
      style={{ transform }}
      className={classes}
    >
      {content}
    </Link>
  );
}
