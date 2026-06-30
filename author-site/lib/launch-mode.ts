import { priceConfig } from "@/content/book";

export type LaunchMode = "preorder" | "launched" | "paused";

export function getLaunchMode(value = process.env.NEXT_PUBLIC_LAUNCH_MODE): LaunchMode {
  if (value === "launched" || value === "paused" || value === "preorder") return value;
  return "preorder";
}

export function getLaunchCta(mode: LaunchMode = getLaunchMode()) {
  switch (mode) {
    case "launched":
      return { label: `Buy the Book — $${priceConfig.regularDirect.amount.toFixed(2)}`, href: "/buy", helper: "Direct EPUB/PDF bundle with protected account delivery.", priceTier: "regular" as const };
    case "paused":
      return { label: "Read Chapter 1 Free", href: "/free-chapter", helper: "Direct checkout is paused while the release is reviewed.", priceTier: "paused" as const };
    default:
      return { label: `Preorder — $${priceConfig.preorderDirect.amount.toFixed(2)}`, href: "/preorder", helper: "Direct from the author — delivered to your account.", priceTier: "preorder" as const };
  }
}

export function resolveStripePriceId(mode: LaunchMode, product: "direct_ebook" | "bundle" | "worksheets") {
  if (product === "bundle") return process.env.STRIPE_PRICE_ID_BUNDLE;
  if (product === "worksheets") return process.env.STRIPE_PRICE_ID_WORKSHEETS;
  return mode === "launched" ? process.env.STRIPE_PRICE_ID_REGULAR : process.env.STRIPE_PRICE_ID_PREORDER;
}
