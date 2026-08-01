import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeForWebhook } from "@/lib/stripe";
import { getStripeWebhookConfig } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { sendDailyDirectivesAccess, sendDownloadAccess, sendOrderConfirmation, sendRefundAccessRevoked, sendWorkbookAccess } from "@/lib/email/resend";
import { upsertSubscriber } from "@/lib/email/mailerlite";

/**
 * Records RECEIPT of an event — deliberately not completion.
 *
 * `processed_at` stays null until fulfillment actually succeeds
 * (`markWebhookProcessed`). Writing it here, as this function used to, made
 * every failed fulfillment permanent: the handler would throw after the row
 * was already stamped, Stripe would retry, the retry would match a stamped row
 * and be dismissed as a duplicate, and a paid order would silently never be
 * fulfilled. Only a *completed* event may suppress a retry.
 */
export async function recordWebhookEvent(event: Stripe.Event) {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false as const, skipped: true as const, reason: "config_missing" as const };
  const { data: existing } = await supabase.from("webhook_events").select("id, processed_at").eq("provider_event_id", event.id).maybeSingle();
  // Only a finished event is a duplicate. A row with processed_at null is a
  // previous attempt that failed — Stripe is retrying, and it must reprocess.
  if (existing?.processed_at) return { ok: true as const, duplicate: true as const };
  const { error } = await supabase.from("webhook_events").upsert({ provider: "stripe", provider_event_id: event.id, event_type: event.type, payload: event, processed_at: null }, { onConflict: "provider_event_id" });
  if (error) return { ok: false as const, skipped: true as const, reason: "record_failed" as const };
  return { ok: true as const, duplicate: false as const };
}

/** Stamps completion. Called only after fulfillment has fully succeeded. */
export async function markWebhookProcessed(eventId: string) {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false as const };
  const { error } = await supabase.from("webhook_events").update({ processed_at: new Date().toISOString() }).eq("provider_event_id", eventId);
  return { ok: !error };
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email ?? session.customer_email ?? undefined;
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false as const, skipped: true as const, reason: "config_missing" as const };
  const amount = session.amount_total ?? 0;
  // Checked, not fire-and-forget. This upsert used to discard its error and
  // fall through to `if (order?.id)`, which is falsy on failure — so the
  // handler skipped every entitlement, returned ok, and the event was stamped
  // processed. A paid buyer with no order row and no access, permanently.
  const { data: order, error: orderError } = await supabase.from("orders").upsert({
    email,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
    status: "paid",
    amount_cents: amount,
    currency: session.currency ?? "usd",
    metadata: session.metadata ?? {}
  }, { onConflict: "stripe_checkout_session_id" }).select("id").single();
  if (orderError || !order?.id) {
    // Throwing keeps processed_at null, so Stripe's retry reprocesses. The
    // upsert key is the checkout session, so the retry is safe to repeat.
    throw new Error(`Order write failed for session ${session.id}: ${orderError?.message ?? "no order row returned"}`);
  }
  // Block retained (rather than dedented) so this change stays reviewable as a
  // guard clause; `order.id` is non-null from here down.
  {
    // Cart-aware: the book row is written unless metadata explicitly says the
    // cart excluded it (workbook-only or deck-only purchases).
    if (session.metadata?.book_included !== "false") {
      const bookRow = { order_id: order.id, email, book_slug: "curls-and-contemplation", status: "active", entitlement_status: "active" };
      const { error: bookError } = await supabase.from("purchases").upsert(bookRow, { onConflict: "order_id,book_slug" });
      if (bookError) {
        // Migration 0002 not applied yet: fall back to the legacy unique(order_id)
        // key so the buyer's book entitlement is never lost. The fallback's own
        // error was previously discarded — meaning both writes could fail while
        // the handler reported success and Stripe stopped retrying.
        const { error: legacyBookError } = await supabase.from("purchases").upsert(bookRow, { onConflict: "order_id" });
        if (legacyBookError) {
          throw new Error(`Book entitlement failed for order ${order.id}: ${bookError.message} / ${legacyBookError.message}`);
        }
      }
    }
    const dailyDirectiveSkus = (session.metadata?.daily_directives_skus ?? "").split(",").filter(Boolean);
    for (const sku of dailyDirectiveSkus) {
      const bookSlug = sku === "daily_directives_bundle" ? "daily-directives-bundle" : sku.replaceAll("_", "-");
      const { error: directiveError } = await supabase.from("purchases").upsert({ order_id: order.id, email, book_slug: bookSlug, status: "active", entitlement_status: "active" }, { onConflict: "order_id,book_slug" });
      if (directiveError) { throw new Error(`Daily Directives entitlement failed: ${directiveError.message}`); }
    }
    // Preorder gift (owner-approved 2026-07-09): every preorder that includes
    // the book also receives the Idea-to-Action Workbook free. Post-launch the
    // workbook is paid-only via the cart/Ascension.
    //
    // `workbook_gift` is written by the server at checkout and is authoritative.
    // The `price_tier === "preorder"` fallback covers sessions created before
    // that flag existed and must stay for replay safety.
    //
    // Under the current pricing rule the two agree — both end at the release
    // instant. They have not always: an earlier rule held preorder pricing
    // through the 14-day launch window while the workbook was already paid
    // again, and inferring the gift from the tier is what turned that into a
    // silent overcharge. Keep reading the explicit flag first.
    const preorderGift =
      session.metadata?.book_included !== "false" &&
      (session.metadata?.workbook_gift === "true" ||
        (session.metadata?.workbook_gift === undefined && session.metadata?.price_tier === "preorder"));
    if (session.metadata?.workbook === "true" || preorderGift) {
      const { error: workbookError } = await supabase.from("purchases").upsert({ order_id: order.id, email, book_slug: "companion-workbook", status: "active", entitlement_status: "active" }, { onConflict: "order_id,book_slug" });
      if (workbookError) {
        throw new Error(`Workbook entitlement failed: ${workbookError.message}`);
      }
    }
  }
  if (email) {
    await supabase.from("subscriber_events").insert({ email, event_type: "customer_created_from_checkout", provider: "stripe", metadata: { checkout_session_id: session.id } });
    await upsertSubscriber(email, "customers", { source: "stripe_checkout" });
    if (session.metadata?.price_tier === "preorder" && session.metadata?.book_included !== "false") {
      await upsertSubscriber(email, "preorders", { source: "stripe_checkout", product_type: "book_preorder", order_status: "paid", order_number: order?.id ?? session.id });
    }
    if ((session.metadata?.daily_directives_skus ?? "").length > 0) {
      await upsertSubscriber(email, "digital_directive_customers", { source: "stripe_checkout", product_type: "daily_directives", product_name: session.metadata?.daily_directives_skus ?? "Daily Directives", order_status: "paid", order_number: order?.id ?? session.id });
    }
    const orderId = order?.id ?? session.id;
    const isPreorder = session.metadata?.price_tier === "preorder" && session.metadata?.book_included !== "false";
    if (isPreorder) await sendOrderConfirmation(email, orderId);
    if (session.metadata?.price_tier === "regular" && session.metadata?.book_included !== "false") await sendDownloadAccess(email);
    if (session.metadata?.workbook === "true" && !isPreorder) await sendWorkbookAccess(email, orderId);
    if ((session.metadata?.daily_directives_skus ?? "").length > 0) {
      await sendDailyDirectivesAccess(email, orderId, session.metadata?.daily_directives_skus ?? "Daily Directives", `$${(amount / 100).toFixed(2)}`);
    }
  }
  await recordServerEvent({ eventName: analyticsEvents.purchaseRecorded, route: "/api/stripe/webhook", metadata: { checkoutSessionId: session.id, amount }, operational: true });
  return { ok: true as const };
}

export async function revokeEntitlementForRefund(charge: Stripe.Charge) {
  const paymentIntent = typeof charge.payment_intent === "string" ? charge.payment_intent : undefined;
  const email = charge.billing_details?.email ?? undefined;
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false as const, skipped: true as const, reason: "config_missing" as const };
  const { data: order, error: lookupError } = await supabase.from("orders").select("id,email").eq("stripe_payment_intent_id", paymentIntent ?? "").maybeSingle();
  if (lookupError) return { ok: false as const, skipped: true as const, reason: "order_lookup_failed" as const };
  // Revokes every entitlement on the order (book, Daily Directives, and workbook).
  // The revocation error used to be discarded, so a refunded buyer could keep
  // full access while Stripe was told the refund had been handled.
  if (order?.id) {
    const { error: revokeError } = await supabase
      .from("purchases")
      .update({ status: "refunded", entitlement_status: "revoked", refunded_at: new Date().toISOString(), revoked_at: new Date().toISOString() })
      .eq("order_id", order.id);
    if (revokeError) return { ok: false as const, skipped: true as const, reason: "revoke_failed" as const };
  }
  const notifyEmail = email ?? order?.email;
  if (notifyEmail) {
    await upsertSubscriber(notifyEmail, "refunded", { source: "stripe_refund" });
    await sendRefundAccessRevoked(notifyEmail);
  }
  await recordServerEvent({ eventName: analyticsEvents.refundRecorded, route: "/api/stripe/webhook", metadata: { paymentIntentPresent: Boolean(paymentIntent) }, operational: true });
  return { ok: true as const };
}

export async function POST(request: Request) {
  const config = getStripeWebhookConfig();
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!config.ok || !signature) return NextResponse.json({ ok: false, error: { code: "signature_missing_or_config_missing" } }, { status: 400 });
  const stripe = getStripeForWebhook();
  if (!stripe) return NextResponse.json({ ok: false, error: { code: "config_missing" } }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, config.value.webhookSecret);
  } catch {
    return NextResponse.json({ ok: false, error: { code: "bad_signature" } }, { status: 400 });
  }

  const recorded = await recordWebhookEvent(event);
  // Storage is unreachable or misconfigured. This used to fall through to the
  // switch and return 200 with nothing written — Stripe saw success and never
  // retried, so the order was lost. 503 tells Stripe to retry.
  if (!recorded.ok) {
    return NextResponse.json({ ok: false, error: { code: "reason" in recorded ? recorded.reason : "record_failed" } }, { status: 503 });
  }
  if ("duplicate" in recorded && recorded.duplicate) return NextResponse.json({ ok: true, duplicate: true });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const result = await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        // A skipped fulfillment is a failure, not a success. Surfacing it as a
        // non-2xx keeps processed_at null so Stripe's retry reprocesses it.
        if (!result.ok) return NextResponse.json({ ok: false, error: { code: result.reason } }, { status: 503 });
        await recordServerEvent({ eventName: analyticsEvents.checkoutCompleted, route: "/api/stripe/webhook", metadata: { stripeEventId: event.id }, operational: true });
        break;
      }
      case "payment_intent.succeeded":
        await recordServerEvent({ eventName: analyticsEvents.checkoutCompleted, route: "/api/stripe/webhook", metadata: { stripeEventId: event.id, paymentIntent: true }, operational: true });
        break;
      case "charge.refunded": {
        const result = await revokeEntitlementForRefund(event.data.object as Stripe.Charge);
        if (!result.ok) return NextResponse.json({ ok: false, error: { code: result.reason } }, { status: 503 });
        break;
      }
      case "checkout.session.expired": {
        // Funnel 1: one compliant abandoned-checkout reminder is sent from
        // MailerLite (+24h automation, owner-gated); here we only tag the group.
        const expired = event.data.object as Stripe.Checkout.Session;
        const abandonedEmail = expired.customer_details?.email ?? expired.customer_email ?? undefined;
        if (abandonedEmail) await upsertSubscriber(abandonedEmail, "abandoned_checkout", { source: "stripe_checkout_expired" });
        await recordServerEvent({ eventName: analyticsEvents.paymentFailed, route: "/api/stripe/webhook", metadata: { stripeEventId: event.id, expired: true }, operational: true });
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await recordServerEvent({ eventName: analyticsEvents.purchaseRecorded, route: "/api/stripe/webhook", metadata: { stripeEventId: event.id, subscriptionPlaceholder: true }, operational: true });
        break;
      default:
        // Nothing to fulfill, so nothing can fail: stamp it so Stripe stops.
        await markWebhookProcessed(event.id);
        return NextResponse.json({ ok: true, ignored: true });
    }
  } catch (error) {
    // processed_at is still null, so the retry will reprocess rather than be
    // dismissed as a duplicate. This is the whole point of the split.
    return NextResponse.json(
      { ok: false, error: { code: "fulfillment_failed", message: error instanceof Error ? error.message : "unknown" } },
      { status: 500 }
    );
  }

  const stamped = await markWebhookProcessed(event.id);
  // Fulfillment succeeded but the completion stamp did not land. Reporting
  // success here would be safe for the buyer but leaves the event replayable;
  // a 503 makes Stripe retry, and the handlers upsert on stable keys.
  if (!stamped.ok) return NextResponse.json({ ok: false, error: { code: "mark_processed_failed" } }, { status: 503 });

  return NextResponse.json({ ok: true, received: true });
}
