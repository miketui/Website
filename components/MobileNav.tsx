"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { primaryNav, isActiveRoute } from "@/lib/navigation";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * Mobile navigation panel. Consumes lib/navigation (same list as desktop —
 * the drift between the two hand-maintained lists is what this replaces).
 * Staggered entrance via motion/react; Escape closes; scroll locks while
 * open; portal keeps it above the journey layers. Reduced motion: panel
 * appears/disappears instantly.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const quiet = useReducedMotion();

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

  // Route change (e.g. back button) should never strand an open panel.
  // Render-phase adjustment (React-sanctioned derived-state pattern) rather
  // than an effect, so no cascading render.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

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
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <motion.div
                  id="mobile-menu"
                  initial={quiet ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={quiet ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="fixed inset-0 top-[72px] z-40 flex flex-col overflow-y-auto bg-obsidian px-6 py-8 md:hidden"
                >
                  <nav aria-label="Mobile navigation" className="flex flex-col">
                    {primaryNav.map((link, i) => {
                      const active = isActiveRoute(pathname, link.href);
                      return (
                        <motion.div
                          key={link.href}
                          initial={quiet ? false : { opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: quiet ? 0 : 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            aria-current={active ? "page" : undefined}
                            className={[
                              "block border-b border-whitegold/10 py-4 font-display text-3xl transition hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique",
                              active ? "text-antique" : "text-white"
                            ].join(" ")}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                  <p className="mt-8 text-xs uppercase tracking-[0.3em] text-whitegold/45">Curls &amp; Contemplation</p>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </div>
  );
}
