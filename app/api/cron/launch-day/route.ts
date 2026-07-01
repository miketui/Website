import { NextResponse } from "next/server";
import { siteConfig } from "@/content/site";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendDownloadAccess } from "@/lib/email/resend";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { analyticsEvents } from "@/lib/analytics";

const BOOK_SLUG = "curls-and-contemplation";

export function hasLaunchArrived(): boolean {
  const release = new Date(`${siteConfig.releaseDate}T00:00:00Z`);
  const now = new Date();
  return now.getTime() >= release.getTime();
}

/**
 * Vercel Cron hits this daily (see vercel.json). Runs on ANY date, but only
 * does real work once launch day has actually arrived, and only ever sends
 * one launch-day email per purchase (launch_email_sent_at gates re-sends).
 * Reuses the existing, already-approved sendDownloadAccess template rather
 * than inventing new customer-facing copy — FLAG-AND-HOLD applies to
 * automation output exactly as it does to manual sends.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }

  if (!hasLaunchArrived()) {
    return NextResponse.json({ ok: true, launched: false, releaseDate: siteConfig.releaseDate });
  }

  const supabase = createServerSupabaseClient(true);
  if (!supabase) {
    return NextResponse.json({ ok: false, error: { code: "config_missing" } }, { status: 503 });
  }

  const { data: pending, error } = await supabase
    .from("purchases")
    .select("id, email")
    .eq("book_slug", BOOK_SLUG)
    .eq("entitlement_status", "active")
    .is("launch_email_sent_at", null)
    .not("email", "is", null);

  if (error) {
    return NextResponse.json({ ok: false, error: { code: "storage_error", message: error.message } }, { status: 500 });
  }

  const results: { email: string; sent: boolean }[] = [];
  for (const purchase of pending ?? []) {
    if (!purchase.email) continue;
    const result = await sendDownloadAccess(purchase.email);
    if (result.ok) {
      await supabase.from("purchases").update({ launch_email_sent_at: new Date().toISOString() }).eq("id", purchase.id);
    }
    results.push({ email: purchase.email, sent: result.ok });
  }

  await recordServerEvent({
    eventName: analyticsEvents.purchaseRecorded,
    route: "/api/cron/launch-day",
    metadata: { launchDayCron: true, recipientCount: results.length, sentCount: results.filter((r) => r.sent).length },
    operational: true
  });

  return NextResponse.json({ ok: true, launched: true, releaseDate: siteConfig.releaseDate, processed: results.length, sent: results.filter((r) => r.sent).length });
}
