"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { primaryNav, isActiveRoute } from "@/lib/navigation";
import { MobileNav } from "@/components/MobileNav";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * Scroll-aware site header (elevation pass, 2026-07-02).
 *
 * Over the cinematic entrance the bar is fully transparent so the camera
 * owns the frame; after 24px of scroll it condenses into obsidian glass with
 * an antique-gold hairline. The active route carries a shared-layout gold
 * underline (motion layoutId) plus aria-current for assistive tech.
 * Transform/opacity only — the header's box never changes height, so zero CLS.
 * Reduced motion: state still switches (visibility is meaning), transitions
 * drop to none.
 */
export function SiteHeader({ cta, mobileCta }: { cta: ReactNode; mobileCta: { href: string; label: string } }) {
  const pathname = usePathname() ?? "/";
  const quiet = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      className={[
        // sticky (not fixed): keeps its layout slot on all routes — zero page reflow.
        // Over the obsidian hero the transparent state reads as full-bleed anyway.
        "sticky top-0 z-30",
        quiet ? "" : "transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-antique/25 bg-obsidian/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      ].join(" ")}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5 md:px-6">
        <Link
          href="/"
          className="font-display text-xl leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique sm:text-2xl"
        >
          Curls &<span className="block text-antique sm:inline"> Contemplation</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm md:flex">
          {primaryNav.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={[
                  "relative py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique",
                  active ? "text-antique" : "text-whitegold/80 hover:text-antique"
                ].join(" ")}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId={quiet ? undefined : "nav-underline"}
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px block h-px bg-antique"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">{cta}</div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href={mobileCta.href}
            className="inline-flex min-h-11 items-center rounded-full border border-antique/70 px-3 py-2 text-xs font-semibold text-whitegold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
          >
            {mobileCta.label}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
