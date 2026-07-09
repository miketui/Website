import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { getLaunchMode } from "@/lib/env";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import {
  buildCheckoutMetadata,
  checkoutUrls,
  getStripe,
  resolveCardDeckPriceId,
  resolveServerPriceId,
  resolveWorkbookPriceId
} from "@/lib/stripe";

/**
 * Checkout accepts BOTH shapes:
 *  1. Legacy single-product body (PreorderCheckout / LaunchModeCTA):
 *       { product: "direct_ebook", addCardDeck?: boolean, ... }
 *  2. Cart body (site-wide CartDrawer):
 *       { items: [{ sku: "book" | "card_deck" | "workbook" }], ... }
 *
 * The sku → Stripe price mapping lives entirely server-side (env-configured
 * price IDs). Clients can never inject a price or price ID; unknown skus are
 * rejected. The book's tier still follows the launch-mode machine.
 */

const cartSku = z.enum(["book", "card_deck", "workbook"]);

const checkoutSchema = z.object({
  product: z.enum(["direct_ebook"]).default("direct_ebook"),
  addCardDeck: z.boolean().default(false),
  items: z.array(z.object({ sku: cartSku })).max(3).optional(),
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

  const mode = getLaunchMode();
  if (mode === "paused") {
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
    if (parsed.data.addCardDeck) skus.add("card_deck");
  }
  if (skus.size === 0) {
    return NextResponse.json({ ok: false, error: { code: "empty_cart", message: "Your cart is empty." } }, { status: 400 });
  }

  const lineItems: { price: string; quantity: number }[] = [];
  let bookTier: "preorder" | "regular" | undefined;

  if (skus.has("book")) {
    const resolved = resolveServerPriceId(mode, "direct_ebook");
    if (!resolved.ok) {
      return NextResponse.json(
        { ok: false, error: { code: resolved.reason, message: "Checkout is not configured.", missing: "missing" in resolved ? resolved.missing : undefined } },
        { status: 503 }
      );
    }
    bookTier = resolved.tier;
    lineItems.push({ price: resolved.priceId, quantity: 1 });
  }
  if (skus.has("card_deck")) {
    const cardDeckPriceId = resolveCardDeckPriceId();
    // Never silently drop a paid add-on the buyer asked for.
    if (!cardDeckPriceId) {
      return NextResponse.json({ ok: false, error: { code: "card_deck_unavailable", message: "The Affirmation Card Deck isn't available right now." } }, { status: 503 });
    }
    lineItems.push({ price: cardDeckPriceId, quantity: 1 });
  }
  if (skus.has("workbook")) {
    const workbookPriceId = resolveWorkbookPriceId();
    if (!workbookPriceId) {
      return NextResponse.json({ ok: false, error: { code: "workbook_unavailable", message: "The Idea-to-Action Workbook isn't available right now." } }, { status: 503 });
    }
    lineItems.push({ price: workbookPriceId, quantity: 1 });
  }

  const metadata = buildCheckoutMetadata({
    product: parsed.data.product,
    sourcePage: parsed.data.sourcePage,
    utm: parsed.data.utm,
    customerEmail: parsed.data.customerEmail,
    cardDeck: skus.has("card_deck"),
    workbook: skus.has("workbook"),
    bookIncluded: skus.has("book")
  });
  const urls = checkoutUrls();

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
        launchMode: mode,
        priceTier: bookTier ?? "none",
        skus: Array.from(skus).join(","),
        cardDeck: skus.has("card_deck"),
        workbook: skus.has("workbook")
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
