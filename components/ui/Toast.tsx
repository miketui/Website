"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Toaster — shadcn/ui toast pattern (https://ui.shadcn.com), implemented
 * dependency-free on the site's chrome tokens. Fire from anywhere:
 *   window.dispatchEvent(new CustomEvent("cc:toast", { detail: { title, description } }))
 * Anatomy mirrors shadcn's ToastViewport/Toast/ToastTitle/ToastDescription;
 * swap in the generated shadcn components 1:1 later if the design system grows.
 */

interface ToastDetail {
  title: string;
  description?: string;
}
interface ToastItem extends ToastDetail {
  id: number;
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let id = 0;
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      if (!detail?.title) return;
      const item = { ...detail, id: ++id };
      setToasts((prev) => [...prev.slice(-2), item]);
      window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== item.id)), 3600);
    };
    window.addEventListener("cc:toast", onToast);
    return () => window.removeEventListener("cc:toast", onToast);
  }, []);

  return (
    <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="pointer-events-auto rounded-md border border-antique/35 bg-obsidian/95 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <p className="text-sm font-semibold text-white">{toast.title}</p>
            {toast.description ? <p className="mt-1 text-sm text-whitegold/70">{toast.description}</p> : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function toast(detail: ToastDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("cc:toast", { detail }));
}
