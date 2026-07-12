"use client";

import { Button } from "@/components/Button";
import { useCart, type CartSku } from "@/lib/cart";
import type { ReactNode } from "react";

export function AddToCartButton({ sku, children, className }: { sku: CartSku; children: ReactNode; className?: string }) {
  const cart = useCart();
  const added = cart.has(sku);
  return (
    <Button type="button" onClick={() => (added ? cart.open() : cart.add(sku))} className={className}>
      {added ? "View in cart" : children}
    </Button>
  );
}
