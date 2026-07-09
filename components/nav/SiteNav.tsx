"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { CartButton, CartDrawer } from "@/components/nav/CartDrawer";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * Immersive site nav — unchanged behavior (sticky, transparent-over-hero,
 * obsidian glass after 24px, cover-reveal aware) + the site-wide cart.
 * CartButton renders on desktop and mobile clusters; CartDrawer mounts once
 * here so the cart is reachable from every route (layout mounts SiteNav
 * globally). Requires <CartProvider> above it in app/layout.tsx.
 */

const links = [
  { href: "/book", label: "The Book" },
  { href: "/journey", label: "The Journey" },
  { href: "/#stylists", label: "For Stylists" },
  { href: "/free-chapter", label: "Free Chapter" }
] as const;

export function SiteNav({ preorder }: { preorder: { href: string; label: string } }) {
  const quiet = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (document.documentElement.hasAttribute("data-cc-cover")) setRevealed(false);
    });
    const onRevealed = () => setRevealed(true);
    window.addEventListener("cc:revealed", onRevealed);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("cc:revealed", onRevealed);
    };
  }, []);

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
        "sticky top-0 z-30",
        quiet ? "" : "transition-[transform,background-color,border-color,backdrop-filter] duration-500",
        revealed ? "translate-y-0" : "-translate-y-full",
        scrolled ? "border-b border-antique/25 bg-obsidian/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      ].join(" ")}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5 md:px-6">
        <Link
          href="/"
          className="font-display text-xl leading-none text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique sm:text-2xl"
        >
          Curls <span className="text-antique">&amp;</span> Contemplation
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-whitegold/80 transition-colors hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={preorder.href}
            className="inline-flex items-center rounded-sm bg-antique px-5 py-2.5 text-sm font-semibold text-obsidian transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          >
            {preorder.label}
          </Link>
          <CartButton />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <CartButton />
          <Link
            href={preorder.href}
            className="inline-flex min-h-11 items-center rounded-full border border-antique/70 px-3 py-2 text-xs font-semibold text-whitegold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
          >
            {preorder.label}
          </Link>
          <MobileNav items={[...links, preorder]} />
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}
