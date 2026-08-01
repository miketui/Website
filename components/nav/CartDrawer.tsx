"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CART_CATALOG, useCart, type CartSku } from "@/lib/cart";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * CartButton lives in SiteNav on every route; CartDrawer is the slide-in
 * checkout surface. Design tokens: site chrome ACISS (obsidian / antique /
 * whitegold) — this is chrome, not a book-funnel page.
 *
 * SALES13 baked in quietly:
 *  - #2 transformation framing in item taglines
 *  - #6 risk reduction line above the pay button
 *  - #10/#13 the bump suggestion renders as a gift, not a nag — one line, once.
 */

function formatUsd(n: number) {
  return `$${n.toFixed(2)}`;
}

export function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      type="button"
      onClick={open}
      aria-label={count === 0 ? "Open cart (empty)" : `Open cart (${count} item${count === 1 ? "" : "s"})`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-whitegold/25 text-whitegold transition-colors hover:border-antique hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-antique font-body text-[11px] font-bold text-obsidian">
          {count}
        </span>
      )}
    </button>
  );
}

const BUMP_ORDER: CartSku[] = ["daily_directives_bundle", "workbook"];

export function CartDrawer({ sourcePage }: { sourcePage?: string }) {
  const cart = useCart();
  const quiet = useReducedMotion();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Never upsell something the order already includes free. `isGifted` reports
  // the server's launch-offer decision (see lib/cart.tsx); /api/checkout drops
  // the line item regardless, so this only prevents the ask.
  const suggestion = cart.items.includes("book")
    ? BUMP_ORDER.find((sku) => !cart.has(sku) && !(sku === "workbook" && cart.workbookGifted))
    : undefined;

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((sku) => ({ sku })),
          sourcePage: sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : "cart")
        })
      });
      const data = (await response.json()) as { ok: boolean; url?: string; error?: { message?: string } };
      if (data.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setError(data.error?.message ?? "Checkout couldn't start. Please try again.");
    } catch {
      setError("Checkout couldn't start. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.button
            key="cart-scrim"
            type="button"
            aria-label="Close cart"
            onClick={cart.close}
            className="fixed inset-0 z-40 bg-obsidian/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: quiet ? 0 : 0.25 }}
          />
          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-antique/25 bg-obsidian"
            initial={{ x: quiet ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: quiet ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="flex items-center justify-between border-b border-whitegold/10 px-6 py-5">
              <h2 className="font-display text-xl text-white">Your cart</h2>
              <button
                type="button"
                onClick={cart.close}
                aria-label="Close cart"
                className="flex h-10 w-10 items-center justify-center rounded-full text-whitegold/70 transition-colors hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cart.items.length === 0 ? (
                <div className="pt-10 text-center">
                  <p className="text-whitegold/70">Your cart is empty.</p>
                  <button
                    type="button"
                    onClick={() => {
                      cart.add("book");
                    }}
                    className="mt-6 inline-flex items-center rounded-sm bg-antique px-6 py-3 text-sm font-semibold text-obsidian transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
                  >
                    Add the book — {formatUsd(cart.priceOf("book"))}
                  </button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {cart.items.map((sku) => {
                    const item = CART_CATALOG[sku];
                    return (
                      <li key={sku} className="flex items-start justify-between gap-4 border-b border-whitegold/10 pb-5">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="mt-1 text-sm text-whitegold/65">{item.tagline}</p>
                          <button
                            type="button"
                            onClick={() => cart.remove(sku)}
                            className="mt-2 text-xs text-whitegold/50 underline underline-offset-4 transition-colors hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="font-semibold text-antique">{cart.isGifted(sku) ? "Included free" : formatUsd(cart.priceOf(sku))}</p>
                      </li>
                    );
                  })}
                </ul>
              )}

              {suggestion && (
                <div className="mt-6 rounded-lg border border-antique/30 bg-white/[0.03] p-4">
                  <p className="text-sm text-whitegold/85">
                    <span className="font-semibold text-antique">Goes with the book:</span> {CART_CATALOG[suggestion].name} — {CART_CATALOG[suggestion].tagline}.
                  </p>
                  <button
                    type="button"
                    onClick={() => cart.add(suggestion)}
                    className="mt-3 inline-flex items-center rounded-sm border border-antique/60 px-4 py-2 text-sm font-semibold text-antique transition-colors hover:bg-antique hover:text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
                  >
                    Add for {formatUsd(CART_CATALOG[suggestion].price)}
                  </button>
                </div>
              )}
            </div>

            {cart.items.length > 0 && (
              <div className="border-t border-whitegold/10 px-6 py-5">
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm text-whitegold/70">Subtotal</span>
                  <span className="font-display text-2xl">{formatUsd(cart.subtotal)}</span>
                </div>
                {error && (
                  <p role="alert" className="mt-3 text-sm text-red-300">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={checkout}
                  disabled={busy}
                  className="cc-shimmer mt-4 w-full rounded-sm bg-antique px-6 py-3.5 text-sm font-semibold text-obsidian transition-transform hover:-translate-y-0.5 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
                >
                  {busy ? "Opening secure checkout…" : "Checkout securely"}
                </button>
                {/*
                  The refund window is deliberately NOT quoted here. This line
                  promised "14-day refund policy" while /refund-policy said the
                  window was not final — a specific number next to a pay button
                  is a consumer promise, and no approved policy backed it. Link
                  to the policy instead; restore a number only once the approved
                  text names one, and change both surfaces together.
                */}
                <p className="mt-3 text-center text-xs text-whitegold/50">
                  Secure Stripe checkout · instant account delivery ·{" "}
                  <a href="/refund-policy" className="underline underline-offset-2 transition-colors hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique">
                    refund policy
                  </a>
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
