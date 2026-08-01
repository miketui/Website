import { resolveLaunchOffer, type LaunchOffer } from "@/config/launchState";

/**
 * Header / hero CTA copy.
 *
 * This file used to own a *second* launch resolver reading
 * NEXT_PUBLIC_LAUNCH_MODE directly, which is how the header could advertise
 * $19.99 while checkout charged $17.99 (2026-07-31 audit, P0.3). It now
 * renders whatever `resolveLaunchOffer()` decides and decides nothing itself.
 */

/** Legacy env vocabulary, retained because NEXT_PUBLIC_LAUNCH_MODE still ships. */
export type LaunchMode = "preorder" | "launched" | "paused";

export function getLaunchCta(offer: LaunchOffer = resolveLaunchOffer()) {
  if (offer.checkoutPaused) {
    return {
      label: "Get the Free Pricing Kit",
      href: "/pricing-kit",
      helper: "Direct checkout is paused while the release is reviewed.",
      priceTier: "paused" as const
    };
  }
  if (offer.state === "PREORDER") {
    return {
      label: `Preorder — ${offer.priceLabel}`,
      href: "/preorder",
      helper: "Direct from the author — delivered to your account.",
      priceTier: offer.priceTier
    };
  }
  return {
    label: `Buy the Book — ${offer.priceLabel}`,
    href: "/buy",
    helper: "Direct EPUB edition with protected account delivery.",
    priceTier: offer.priceTier
  };
}
