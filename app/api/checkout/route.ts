import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { resolveLaunchOffer } from "@/config/launchState";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import {
  buildCheckoutMetadata,
  checkoutUrls,
  getStripe,
  resolveDailyDirectivesBundlePriceId,
  resolveDailyDirectivesSetPriceId,
  resolveServerPriceId,
  resolveWorkbookPriceId
} from "@/lib/stripe";
import type { DailyDirectiveSku } from "@/content/daily-directives";

/**
 * Checkout accepts BOTH shapes:
 *  1. Legacy single-product body (PreorderCheckout / LaunchModeCTA):
 *       { product: "direct_ebook", addDailyDirectives?: boolean, ... }
 *  2. Cart body (site-wide CartDrawer):
 *       { items: [{ sku: server-allowlisted catalog sku }], ... }
 *
 * The sku → Stripe price mapping lives entirely server-side (env-configured
 * price IDs). Clients can never inject a price or price ID; unknown skus are
 * rejected. The book's tier still follows the launch-mode machine.
 */

const directiveSetSkus = [
  "daily_directives_set_01", "daily_directives_set_02", "daily_directives_set_03", "daily_directives_set_04",
  "daily_directives_set_05", "daily_directives_set_06", "daily_directives_set_07", "daily_directives_set_08",
  "daily_directives_set_09", "daily_directives_set_10", "daily_directives_set_11", "daily_directives_set_12"
] as const;
const cartSku = z.enum(["book", "daily_directives_bundle", "workbook", ...directiveSetSkus]);

const checkoutSchema = z.object({
  product: z.enum(["direct_ebook"]).default("direct_ebook"),
  addDailyDirectives: z.boolean().default(false),
  items: z.array(z.object({ sku: cartSku })).max(15).optional(),
  sourcePage: z.string().max(120).optional(),
  utm: z
    .object({
      utm_source: z.string().max(80).optional(),
      utm_medium: z.string().max(80).optional(),
      utm_campaign: z.string().max(120).optional()
    })
    .optional(),
  customerEmail: z.string().email().optional(),
  price: z.unknown().optional(),
  priceId: z.unknown().optional()
});

export async function POST(request: Request) {
  const parsed = checkoutSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: { code: "invalid_request", message: "Invalid checkout request." } }, { status: 400 });
  }

  // One resolver for state, displayed price, and Stripe price tier.
  const offer = resolveLaunchOffer();
  if (offer.checkoutPaused) {
    return NextResponse.json({ ok: false, error: { code: "checkout_paused", message: "Checkout is currently paused." } }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ ok: false, error: { code: "config_missing", message: "Stripe server configuration is missing." } }, { status: 503 });
  }

  // Normalize both request shapes into a deduped sku set.
  const skus = new Set<z.infer<typeof cartSku>>();
  if (parsed.data.items?.length) {
    for (const item of parsed.data.items) skus.add(item.sku);
  } else {
    skus.add("book");
    if (parsed.data.addDailyDirectives) skus.add("daily_directives_bundle");
  }
  if (skus.size === 0) {
    return NextResponse.json({ ok: false, error: { code: "empty_cart", message: "Your cart is empty." } }, { status: 400 });
  }

  const lineItems: { price: string; quantity: number }[] = [];
  let bookTier: "preorder" | "regular" | undefined;

  /**
   * P0.4 — the preorder promise says the Idea-to-Action Workbook is included
   * free, and the webhook grants it on that basis. Left alone, a buyer could
   * still add the workbook to the same cart and be charged $19.99 for
   * something they were about to receive anyway.
   *
   * Enforced here, on the server, because the cart UI can be bypassed
   * entirely: a stale localStorage cart, a direct POST, or a second tab all
   * reach this route with `items: [{sku:"book"},{sku:"workbook"}]`. Order of
   * additions, quantities, and client state are all irrelevant — if the
   * qualifying book is in this cart and the offer gifts the workbook, the
   * workbook line item is not created.
   */
  const workbookGift = skus.has("book") && skus.has("workbook") && offer.workbookIncludedFree;
  if (workbookGift) skus.delete("workbook");

  if (skus.has("book")) {
    const resolved = resolveServerPriceId(offer, "direct_ebook");
    if (!resolved.ok) {
      return NextResponse.json(
        { ok: false, error: { code: resolved.reason, message: "Checkout is not configured.", missing: "missing" in resolved ? resolved.missing : undefined } },
        { status: 503 }
      );
    }
    bookTier = resolved.tier;
    lineItems.push({ price: resolved.priceId, quantity: 1 });
  }
  if (skus.has("daily_directives_bundle")) {
    const bundlePriceId = resolveDailyDirectivesBundlePriceId();
    // Never silently drop a paid add-on the buyer asked for.
    if (!bundlePriceId) {
      return NextResponse.json({ ok: false, error: { code: "daily_directives_unavailable", message: "The Daily Directives bundle isn't available right now." } }, { status: 503 });
    }
    lineItems.push({ price: bundlePriceId, quantity: 1 });
  }
  for (const sku of directiveSetSkus) {
    if (!skus.has(sku)) continue;
    const priceId = resolveDailyDirectivesSetPriceId(sku as DailyDirectiveSku);
    if (!priceId) {
      return NextResponse.json({ ok: false, error: { code: "daily_directives_unavailable", message: "That Daily Directives set isn't available right now." } }, { status: 503 });
    }
    lineItems.push({ price: priceId, quantity: 1 });
  }
  if (skus.has("workbook")) {
    const workbookPriceId = resolveWorkbookPriceId();
    if (!workbookPriceId) {
      return NextResponse.json({ ok: false, error: { code: "workbook_unavailable", message: "The Idea-to-Action Workbook isn't available right now." } }, { status: 503 });
    }
    lineItems.push({ price: workbookPriceId, quantity: 1 });
  }

  const dailyDirectivesSkus = Array.from(skus).filter((sku) => sku === "daily_directives_bundle" || sku.startsWith("daily_directives_set_"));
  const metadata = buildCheckoutMetadata({
    product: parsed.data.product,
    sourcePage: parsed.data.sourcePage,
    utm: parsed.data.utm,
    customerEmail: parsed.data.customerEmail,
    dailyDirectivesSkus,
    workbook: skus.has("workbook"),
    bookIncluded: skus.has("book"),
    // Gifted here, or gifted because a book-only preorder qualifies for it.
    workbookGift: workbookGift || (skus.has("book") && offer.workbookIncludedFree),
    offer
  });
  const urls = checkoutUrls(offer);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: urls.successUrl,
      cancel_url: urls.cancelUrl,
      customer_email: parsed.data.customerEmail,
      metadata
    });
    await recordServerEvent({
      eventName: analyticsEvents.checkoutStarted,
      route: "/api/checkout",
      metadata: {
        product: parsed.data.product,
        launchState: offer.state,
        priceTier: bookTier ?? "none",
        skus: Array.from(skus).join(","),
        dailyDirectives: dailyDirectivesSkus.join(","),
        workbook: skus.has("workbook"),
        workbookGift
      },
      operational: true
    });
    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    // Surface the real Stripe failure class without leaking secrets/PII —
    // (authentication_error → bad/rotated key; resource_missing → price ID
    // from the wrong Stripe account; both were the historical 502 causes).
    const stripeErr = err as { type?: string; code?: string; statusCode?: number; message?: string };
    console.error("[checkout] stripe.checkout.sessions.create failed", {
      type: stripeErr.type,
      code: stripeErr.code,
      statusCode: stripeErr.statusCode,
      message: stripeErr.message
    });
    try {
      Sentry.captureException(err);
    } catch {
      /* diagnostics are best-effort */
    }
    return NextResponse.json({ ok: false, error: { code: "stripe_error", message: "Unable to start checkout." } }, { status: 502 });
  }
}
