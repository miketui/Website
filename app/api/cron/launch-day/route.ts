import { NextResponse } from "next/server";
import { siteConfig } from "@/content/site";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { analyticsEvents } from "@/lib/analytics";
import {
  deliverLaunchCopy,
  eligibleLaunchBuyers,
  launchFulfillmentEnabled,
  verifyLaunchPreconditions
} from "@/lib/launch-fulfillment";

export function hasLaunchArrived(): boolean {
  const release = new Date(`${siteConfig.releaseDate}T00:00:00Z`);
  const now = new Date();
  return now.getTime() >= release.getTime();
}

function isLaunchDayWindow(): boolean {
  const release = new Date(`${siteConfig.releaseDate}T00:00:00Z`);
  const now = new Date();
  return now.getTime() >= release.getTime() && now.getTime() < release.getTime() + 24 * 60 * 60 * 1000;
}

async function alertOwner(subject: string, body: string) {
  const owner = process.env.LAUNCH_OWNER_EMAIL;
  if (!owner) return;
  await sendTransactionalEmail({ to: owner, subject, html: `<p>${body}</p>`, text: body });
}

/**
 * Vercel Cron hits this daily (see vercel.json). Guard chain, in order:
 *  a. CRON_SECRET bearer check.
 *  b. LAUNCH_FULFILLMENT_ENABLED kill-switch — HTTP 200 when off so Vercel
 *     never retries a deliberate block (docs/curls-launch-day-runbook.md).
 *  c. Release date reached (runs daily on purpose: any buyer missed on launch
 *     day is picked up the next day; launch_email_sent_at gates re-sends).
 *  d. Storage + Resend preconditions (bucket reachable, v13 EPUB present).
 *  e. Zero eligible buyers ON LAUNCH DAY itself is suspicious → owner alert.
 * Reuses the approved launch template; FLAG-AND-HOLD applies to automation
 * output exactly as it does to manual sends.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }

  if (!launchFulfillmentEnabled()) {
    await recordServerEvent({
      eventName: analyticsEvents.launchFulfillmentBlocked,
      route: "/api/cron/launch-day",
      metadata: { reason: "kill-switch off" },
      operational: true
    });
    return NextResponse.json({ ok: true, status: "disabled", reason: "kill-switch off" });
  }

  if (!hasLaunchArrived()) {
    return NextResponse.json({ ok: true, launched: false, releaseDate: siteConfig.releaseDate });
  }

  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: { code: "config_missing" } }, { status: 503 });
  }

  const guard = await verifyLaunchPreconditions(supabase);
  if (!guard.ok) {
    await recordServerEvent({
      eventName: analyticsEvents.launchFulfillmentGuardFailed,
      route: "/api/cron/launch-day",
      metadata: { failed: guard.failed },
      operational: true
    });
    await alertOwner("[⚠️ ACTION REQUIRED] Launch fulfillment guard failed", `Launch-day cron aborted before sending anything. Failed guard: ${guard.failed}`);
    return NextResponse.json({ ok: false, error: { code: "guard_failed", failed: guard.failed } }, { status: 500 });
  }

  const { data: pending, error } = await eligibleLaunchBuyers(supabase);
  if (error) {
    return NextResponse.json({ ok: false, error: { code: "storage_error", message: error.message } }, { status: 500 });
  }

  if ((pending?.length ?? 0) === 0) {
    if (isLaunchDayWindow()) {
      await recordServerEvent({
        eventName: analyticsEvents.launchFulfillmentGuardFailed,
        route: "/api/cron/launch-day",
        metadata: { failed: "zero_eligible_buyers_on_launch_day" },
        operational: true
      });
      await alertOwner(
        "[⚠️ ACTION REQUIRED] Launch-day cron found zero eligible buyers",
        "It is launch day and the eligible-buyer query returned 0 rows. Either every buyer is already fulfilled or the purchases pipeline never wrote rows — verify before assuming the former."
      );
    }
    return NextResponse.json({ ok: true, launched: true, processed: 0, sent: 0, warnings: guard.warnings });
  }

  const results: { email: string; sent: boolean; reason?: string }[] = [];
  for (const purchase of pending ?? []) {
    if (!purchase.email) continue;
    let outcome = await deliverLaunchCopy(supabase, { email: purchase.email, purchaseId: purchase.id, userId: purchase.user_id ?? undefined }, { dryRun: false });
    if (!outcome.sent) {
      // One in-run retry per buyer; the daily cron itself is the durable retry.
      outcome = await deliverLaunchCopy(supabase, { email: purchase.email, purchaseId: purchase.id, userId: purchase.user_id ?? undefined }, { dryRun: false });
    }
    results.push({ email: outcome.email, sent: outcome.sent, reason: outcome.reason });
    // Stay under Resend's per-second send cap.
    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  await recordServerEvent({
    eventName: analyticsEvents.launchFulfillmentSent,
    route: "/api/cron/launch-day",
    metadata: { launchDayCron: true, recipientCount: results.length, sentCount: results.filter((r) => r.sent).length, warnings: guard.warnings },
    operational: true
  });

  return NextResponse.json({
    ok: true,
    launched: true,
    releaseDate: siteConfig.releaseDate,
    processed: results.length,
    sent: results.filter((r) => r.sent).length,
    failures: results.filter((r) => !r.sent),
    warnings: guard.warnings
  });
}
