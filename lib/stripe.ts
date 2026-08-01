import Stripe from "stripe";
import { getSiteUrl, getStripeConfig, getStripeWebhookConfig } from "@/lib/env";
import { resolveLaunchOffer, type LaunchOffer, type PriceTier } from "@/config/launchState";
import type { DailyDirectiveSku } from "@/content/daily-directives";

export type CheckoutProduct = "direct_ebook";
export type { PriceTier };

// Stripe Price IDs are public catalog identifiers, not credentials. These
// production fallbacks keep checkout wired when the hosting connector cannot
// create environment variables; an env value still overrides each fallback.
const DAILY_DIRECTIVES_PRICE_IDS = {
  bundle: "price_1TsMHLBOxLp64xG9ld3KhLXm",
  "01": "price_1TsMHSBOxLp64xG9G7autXy9",
  "02": "price_1TsMHZBOxLp64xG9nNtYQmoH",
  "03": "price_1TsMHgBOxLp64xG9iFZBVATE",
  "04": "price_1TsMHnBOxLp64xG9DO7jMya7",
  "05": "price_1TsMHuBOxLp64xG9qAIQ7ADG",
  "06": "price_1TsMI0BOxLp64xG9mlNeFhyn",
  "07": "price_1TsMI8BOxLp64xG9v2jDAqAL",
  "08": "price_1TsMIEBOxLp64xG9TdGdQeDA",
  "09": "price_1TsMIKBOxLp64xG9jgkUJnxn",
  "10": "price_1TsMIeBOxLp64xG9mhE0RApF",
  "11": "price_1TsMIRBOxLp64xG93zQOLoJf",
  "12": "price_1TsMIYBOxLp64xG9lMLQcZMq"
} as const;

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

/**
 * The book's Stripe price, resolved from the single launch resolver.
 *
 * Takes the whole `LaunchOffer` rather than a launch string so the price ID and
 * the price the visitor was shown are provably the same decision — the caller
 * cannot pass one state to the display and another to Stripe.
 */
export function resolveServerPriceId(offer: LaunchOffer = resolveLaunchOffer(), _product: CheckoutProduct = "direct_ebook") {
  const config = getStripeConfig();
  if (!config.ok) return { ok: false as const, reason: "config_missing" as const, missing: config.missing };
  if (offer.checkoutPaused) return { ok: false as const, reason: "checkout_paused" as const };
  const priceId = offer.priceTier === "regular" ? config.value.regularPriceId : config.value.preorderPriceId;
  return { ok: true as const, priceId, tier: offer.priceTier };
}

/** $59 complete Daily Directives bundle — optional book order bump. */
export function resolveDailyDirectivesBundlePriceId(): string | undefined {
  const config = getStripeConfig();
  return config.ok ? (config.value.dailyDirectivesBundlePriceId || DAILY_DIRECTIVES_PRICE_IDS.bundle) : undefined;
}

/** $7.99 individual Daily Directives set. */
export function resolveDailyDirectivesSetPriceId(sku: DailyDirectiveSku): string | undefined {
  const setNumber = sku.slice(-2);
  return process.env[`STRIPE_PRICE_ID_DAILY_DIRECTIVES_SET_${setNumber}`] || DAILY_DIRECTIVES_PRICE_IDS[setNumber as keyof typeof DAILY_DIRECTIVES_PRICE_IDS] || undefined;
}

/** $19.99 Idea-to-Action Workbook — buyer companion, cart-only product. */
export function resolveWorkbookPriceId(): string | undefined {
  // Read directly: the workbook is optional and must not make the base
  // config gate stricter (book checkout keeps working if it's unset).
  return process.env.STRIPE_PRICE_ID_WORKBOOK || undefined;
}

export function buildCheckoutMetadata(input: {
  product: CheckoutProduct;
  sourcePage?: string;
  utm?: Partial<Record<"utm_source" | "utm_medium" | "utm_campaign", string>>;
  customerEmail?: string;
  dailyDirectivesSkus?: string[];
  workbook?: boolean;
  bookIncluded?: boolean;
  /** Server's decision that the workbook shipped free with this order. */
  workbookGift?: boolean;
  offer?: LaunchOffer;
}) {
  const offer = input.offer ?? resolveLaunchOffer();
  return {
    book_slug: "curls-and-contemplation",
    launch_state: offer.state,
    // Retained for webhook events written before launch_state existed.
    launch_mode: offer.state === "PREORDER" ? "preorder" : "launched",
    price_tier: offer.priceTier,
    // Authoritative gift flag. `price_tier === "preorder"` is NOT a proxy for
    // it: the launch window keeps preorder pricing while the workbook is a
    // paid product again, so the two diverge for 14 days.
    workbook_gift: input.workbookGift ? "true" : "false",
    product: input.product,
    daily_directives_skus: input.dailyDirectivesSkus?.join(",") ?? "",
    workbook: input.workbook ? "true" : "false",
    book_included: input.bookIncluded === false ? "false" : "true",
    source_page: input.sourcePage ?? "unknown",
    utm_source: input.utm?.utm_source ?? "",
    utm_medium: input.utm?.utm_medium ?? "",
    utm_campaign: input.utm?.utm_campaign ?? "",
    ...(input.customerEmail ? { customer_email: input.customerEmail } : {})
  };
}

export function checkoutUrls(offer: LaunchOffer = resolveLaunchOffer()) {
  const siteUrl = getSiteUrl();
  return {
    successUrl: `${siteUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${siteUrl}/${offer.state === "PREORDER" ? "preorder" : "buy"}`
  };
}
