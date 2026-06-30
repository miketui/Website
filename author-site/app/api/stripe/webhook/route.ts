import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeForWebhook } from "@/lib/stripe";
import { getStripeWebhookConfig } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { sendDownloadAccess, sendOrderConfirmation, sendRefundAccessRevoked } from "@/lib/email/resend";
import { upsertSubscriber } from "@/lib/email/mailerlite";

export async function recordWebhookEvent(event: Stripe.Event) {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false as const, skipped: true as const, reason: "config_missing" as const };
  const { data: existing } = await supabase.from("webhook_events").select("id, processed_at").eq("provider_event_id", event.id).maybeSingle();
  if (existing?.processed_at) return { ok: true as const, duplicate: true as const };
  await supabase.from("webhook_events").upsert({ provider: "stripe", provider_event_id: event.id, event_type: event.type, payload: event, processed_at: new Date().toISOString() }, { onConflict: "provider_event_id" });
  return { ok: true as const, duplicate: false as const };
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email ?? session.customer_email ?? undefined;
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false as const, skipped: true as const, reason: "config_missing" as const };
  const amount = session.amount_total ?? 0;
  const { data: order } = await supabase.from("orders").upsert({
    email,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
    status: "paid",
    amount_cents: amount,
    currency: session.currency ?? "usd",
    metadata: session.metadata ?? {}
  }, { onConflict: "stripe_checkout_session_id" }).select("id").single();
  if (order?.id) {
    const bookRow = { order_id: order.id, email, book_slug: "curls-and-contemplation", status: "active", entitlement_status: "active" };
    const { error: bookError } = await supabase.from("purchases").upsert(bookRow, { onConflict: "order_id,book_slug" });
    if (bookError) {
      // Migration 0002 not applied yet: fall back to the legacy unique(order_id)
      // key so the buyer's book entitlement is never lost.
      await supabase.from("purchases").upsert(bookRow, { onConflict: "order_id" });
    }
    if (session.metadata?.card_deck === "true") {
      const { error: deckError } = await supabase.from("purchases").upsert({ order_id: order.id, email, book_slug: "affirmation-deck", status: "active", entitlement_status: "active" }, { onConflict: "order_id,book_slug" });
      if (deckError) {
        await recordServerEvent({ eventName: analyticsEvents.purchaseRecorded, route: "/api/stripe/webhook", metadata: { checkoutSessionId: session.id, deckEntitlementFailed: true, hint: "apply migration 0002_order_bump.sql" }, operational: true });
      }
    }
  }
  if (email) {
    await supabase.from("subscriber_events").insert({ email, event_type: "customer_created_from_checkout", provider: "stripe", metadata: { checkout_session_id: session.id } });
    await upsertSubscriber(email, "customers", { source: "stripe_checkout" });
    await sendOrderConfirmation(email, order?.id ?? session.id);
    await sendDownloadAccess(email);
  }
  await recordServerEvent({ eventName: analyticsEvents.purchaseRecorded, route: "/api/stripe/webhook", metadata: { checkoutSessionId: session.id, amount }, operational: true });
  return { ok: true as const };
}

export async function revokeEntitlementForRefund(charge: Stripe.Charge) {
  const paymentIntent = typeof charge.payment_intent === "string" ? charge.payment_intent : undefined;
  const email = charge.billing_details?.email ?? undefined;
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false as const, skipped: true as const, reason: "config_missing" as const };
  const { data: order } = await supabase.from("orders").select("id,email").eq("stripe_payment_intent_id", paymentIntent ?? "").maybeSingle();
  // Revokes every entitlement on the order (book and any order-bump deck).
  if (order?.id) await supabase.from("purchases").update({ status: "refunded", entitlement_status: "revoked", refunded_at: new Date().toISOString(), revoked_at: new Date().toISOString() }).eq("order_id", order.id);
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
  if (recorded.ok && "duplicate" in recorded && recorded.duplicate) return NextResponse.json({ ok: true, duplicate: true });

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      await recordServerEvent({ eventName: analyticsEvents.checkoutCompleted, route: "/api/stripe/webhook", metadata: { stripeEventId: event.id }, operational: true });
      break;
    case "payment_intent.succeeded":
      await recordServerEvent({ eventName: analyticsEvents.checkoutCompleted, route: "/api/stripe/webhook", metadata: { stripeEventId: event.id, paymentIntent: true }, operational: true });
      break;
    case "charge.refunded":
      await revokeEntitlementForRefund(event.data.object as Stripe.Charge);
      break;
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
      return NextResponse.json({ ok: true, ignored: true });
  }

  return NextResponse.json({ ok: true, received: true });
}
