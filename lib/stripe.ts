import Stripe from "stripe";
import { getLaunchMode, getSiteUrl, getStripeConfig, getStripeWebhookConfig, type LaunchMode } from "@/lib/env";

export type CheckoutProduct = "direct_ebook";
export type PriceTier = "preorder" | "regular";

export function getStripe() {
  const config = getStripeConfig();
  if (!config.ok) return null;
  return new Stripe(config.value.secretKey);
}

export function getStripeForWebhook() {
  const config = getStripeWebhookConfig();
  if (!config.ok) return null;
  return new Stripe(config.value.secretKey);
}

export function resolveServerPriceId(mode: LaunchMode, _product: CheckoutProduct) {
  const config = getStripeConfig();
  if (!config.ok) return { ok: false as const, reason: "config_missing" as const, missing: config.missing };
  if (mode === "paused") return { ok: false as const, reason: "checkout_paused" as const };
  const priceId = mode === "launched" ? config.value.regularPriceId : config.value.preorderPriceId;
  return { ok: true as const, priceId, tier: (mode === "launched" ? "regular" : "preorder") as PriceTier };
}

/** $7.99 Affirmation Card Deck order bump — only offered when its price ID is configured. */
export function resolveCardDeckPriceId(): string | undefined {
  const config = getStripeConfig();
  return config.ok ? config.value.cardDeckPriceId : undefined;
}

export function buildCheckoutMetadata(input: {
  product: CheckoutProduct;
  sourcePage?: string;
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign", string>>;
  customerEmail?: string;
  cardDeck?: boolean;
}) {
  const launchMode = getLaunchMode();
  return {
    book_slug: "curls-and-contemplation",
    launch_mode: launchMode,
    price_tier: launchMode === "launched" ? "regular" : "preorder",
    product: input.product,
    card_deck: input.cardDeck ? "true" : "false",
    source_page: input.sourcePage ?? "unknown",
    utm_source: input.utm?.utm_source ?? "",
    utm_medium: input.utm?.utm_medium ?? "",
    utm_campaign: input.utm?.utm_campaign ?? "",
    ...(input.customerEmail ? { customer_email: input.customerEmail } : {})
  };
}

export function checkoutUrls() {
  const siteUrl = getSiteUrl();
  const mode = getLaunchMode();
  return {
    successUrl: `${siteUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${siteUrl}/${mode === "launched" ? "buy" : "preorder"}`
  };
}
