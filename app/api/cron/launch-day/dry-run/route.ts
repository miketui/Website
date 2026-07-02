import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { analyticsEvents } from "@/lib/analytics";
import { deliverLaunchCopy, verifyLaunchPreconditions } from "@/lib/launch-fulfillment";

/**
 * Launch-day DRY RUN. Exercises the entire fulfillment chain — signed URL,
 * real Resend send, `download_events` audit row — against exactly one test
 * address (LAUNCH_DRYRUN_TEST_EMAIL). Deliberately does NOT require the
 * LAUNCH_FULFILLMENT_ENABLED kill-switch, so the chain can be proven at any
 * time before launch, and never touches `purchases` (the dryrun event type
 * keeps it out of real fulfillment counts).
 *
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     https://curlscontemplation.beauty/api/cron/launch-day/dry-run
 */
export async function GET(request: Request) {
  const started = Date.now();
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }

  const testEmail = process.env.LAUNCH_DRYRUN_TEST_EMAIL;
  if (!testEmail) {
    return NextResponse.json({ ok: false, error: { code: "config_missing", missing: ["LAUNCH_DRYRUN_TEST_EMAIL"] } }, { status: 503 });
  }

  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: { code: "config_missing", missing: ["SUPABASE_SERVICE_ROLE_KEY"] } }, { status: 503 });
  }

  const warnings: string[] = [];
  const guard = await verifyLaunchPreconditions(supabase);
  if (!guard.ok) {
    return NextResponse.json({ ok: false, error: { code: "guard_failed", failed: guard.failed }, elapsed_ms: Date.now() - started }, { status: 500 });
  }
  warnings.push(...guard.warnings);

  const outcome = await deliverLaunchCopy(supabase, { email: testEmail }, { dryRun: true });
  if (!outcome.sent) warnings.push(`delivery_failed: ${outcome.reason}`);

  await recordServerEvent({
    eventName: analyticsEvents.launchFulfillmentDryRun,
    route: "/api/cron/launch-day/dry-run",
    metadata: { sent: outcome.sent, warnings },
    operational: true
  });

  return NextResponse.json({
    ok: outcome.sent,
    dry_run: true,
    test_email: testEmail,
    url_expires_at: outcome.epubUrlExpiresAt ?? null,
    elapsed_ms: Date.now() - started,
    warnings
  });
}
