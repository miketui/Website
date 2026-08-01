"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { priceConfig } from "@/content/book";
import { dailyDirectives, dailyDirectiveSets, dailyDirectiveSku, type DailyDirectiveSku } from "@/content/daily-directives";
import { toast } from "@/components/ui/Toast";

/**
 * Site-wide cart (PRD: "cart on all pages").
 *
 * SKUs are a fixed server-side allowlist — the client never sends price IDs.
 * The server resolves each sku to the correct Stripe price for the current
 * launch mode (preorder vs regular for the book). Quantities are capped at 1
 * per sku: these are digital entitlements, not inventory.
 *
 * Persistence: localStorage (this is the deployed Next.js site, not an
 * artifact sandbox). Guarded for SSR + storage-denied environments.
 */

export type CartSku = "book" | "daily_directives_bundle" | "workbook" | DailyDirectiveSku;

export interface CartCatalogEntry {
  sku: CartSku;
  name: string;
  tagline: string;
  /** Display price in dollars; the book's real tier is resolved server-side. */
  price: number;
  regularPrice?: number;
}

const directiveEntries = Object.fromEntries(
  dailyDirectiveSets.map((set) => {
    const sku = dailyDirectiveSku(set.number);
    return [sku, { sku, name: `Daily Directives — ${set.title}`, tagline: `31 digital affirmation cards · Set ${String(set.number).padStart(2, "0")}`, price: dailyDirectives.individualPrice }];
  })
) as Record<DailyDirectiveSku, CartCatalogEntry>;

export const CART_CATALOG: Record<CartSku, CartCatalogEntry> = {
  book: {
    sku: "book",
    name: "Curls & Contemplation — Digital Edition",
    tagline: "EPUB + PDF · 16 chapters · every worksheet",
    price: priceConfig.preorderDirect.amount,
    regularPrice: priceConfig.regularDirect.amount
  },
  daily_directives_bundle: {
    sku: "daily_directives_bundle",
    name: dailyDirectives.bundleName,
    tagline: `${dailyDirectives.totalCards} digital affirmation cards · all 12 sets`,
    price: dailyDirectives.bundlePrice
  },
  workbook: {
    sku: "workbook",
    name: "The Idea-to-Action Workbook",
    tagline: "21-page buyer companion · interactive on-site + printable PDF",
    price: priceConfig.workbook.amount
  },
  ...directiveEntries
};

const STORAGE_KEY = "cc-cart-v1";

interface CartContextValue {
  items: CartSku[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  /**
   * Server's launch-offer decision, passed down from the root layout — the
   * client never derives it (RELEASE_DATE is a server-only variable, so a
   * client-side recomputation would silently read the hardcoded fallback).
   * When true the workbook ships free with a qualifying book order, so it must
   * not be priced, suggested, or charged alongside the book. The server
   * enforces the same rule again in /api/checkout; this only keeps the UI
   * honest.
   */
  workbookGifted: boolean;
  /** True when this sku is currently included free rather than sold. */
  isGifted: (sku: CartSku) => boolean;
  add: (sku: CartSku) => void;
  remove: (sku: CartSku) => void;
  has: (sku: CartSku) => boolean;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartSku[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is CartSku => typeof s === "string" && s in CART_CATALOG);
  } catch {
    return [];
  }
}

export function CartProvider({ children, workbookGifted = false }: { children: ReactNode; workbookGifted?: boolean }) {
  const [items, setItems] = useState<CartSku[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStored();
    if (stored.length > 0) {
      // Run update in microtask to avoid React strict mode cascading render warnings
      queueMicrotask(() => setItems(stored));
    }
    queueMicrotask(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage denied — cart still works for the session */
    }
  }, [items, hydrated]);

  const isGifted = useCallback(
    (sku: CartSku) => sku === "workbook" && workbookGifted && items.includes("book"),
    [workbookGifted, items]
  );

  const add = useCallback((sku: CartSku) => {
    setItems((prev) => {
      if (prev.includes(sku)) return prev;
      toast({ title: "Added to cart", description: CART_CATALOG[sku].name });
      return [...prev, sku];
    });
    setIsOpen(true);
  }, []);
  const remove = useCallback((sku: CartSku) => setItems((prev) => prev.filter((s) => s !== sku)), []);
  const has = useCallback((sku: CartSku) => items.includes(sku), [items]);
  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      // A gifted line contributes $0 — the drawer total must match the amount
      // Stripe will actually charge, which excludes the gifted workbook.
      subtotal: items.reduce((sum, sku) => sum + (isGifted(sku) ? 0 : CART_CATALOG[sku].price), 0),
      isOpen,
      workbookGifted,
      isGifted,
      add,
      remove,
      has,
      clear,
      open,
      close
    }),
    [items, isOpen, workbookGifted, isGifted, add, remove, has, clear, open, close]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
