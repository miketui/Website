"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

const links = [
  { href: "/book", label: "The Book" },
  { href: "/chapters", label: "Chapters" },
  { href: "/free-chapter", label: "Free Chapter" },
  { href: "/resources", label: "Resources" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Close on Escape; lock scroll while open. Links close on click below.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-whitegold/25 text-whitegold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          {open ? (
            <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
      </button>
      {open
        ? createPortal(
            <div id="mobile-menu" className="fixed inset-0 top-[64px] z-40 flex flex-col overflow-y-auto bg-obsidian px-6 py-8 md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-whitegold/10 py-4 font-display text-3xl text-white transition hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/preorder"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-antique px-6 py-3 font-semibold text-obsidian"
          >
            Preorder — $17.99
          </Link>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
