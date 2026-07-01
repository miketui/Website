import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { sendFreeChapter } from "@/lib/email/resend";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";
import { freeChapterLinks } from "@/lib/free-assets";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().email(), turnstileToken: z.string().optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_email" } }, { status: 400 });

  const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, requestIp(request));
  if (!turnstile.ok) return NextResponse.json({ ok: false, error: { code: "turnstile_failed", reason: turnstile.reason } }, { status: 403 });

  const mailerlite = await upsertSubscriber(parsed.data.email, "free_chapter", { source: "free_chapter" });
  const links = freeChapterLinks();
  const resend = await sendFreeChapter(parsed.data.email, links.configured ? links : undefined);

  // Lead magnet tracking: activates a table that previously had zero code
  // references. One row per claim (not an upsert) — repeat requests from the
  // same email are legitimate signal, not duplicates to collapse, matching
  // the append-only pattern already used by subscriber_events/download_events.
  const supabase = createServerSupabaseClient(true);
  if (supabase) {
    await supabase.from("magnet_leads").insert({
      email: parsed.data.email,
      magnet_slug: "free-chapter",
      delivered_at: resend.ok ? new Date().toISOString() : null
    });
  }

  await recordServerEvent({
    eventName: analyticsEvents.freeChapterRequested,
    route: "/api/free-chapter",
    metadata: { mailerliteSkipped: mailerlite.skipped, resendSkipped: resend.skipped, turnstileSkipped: turnstile.skipped, linksConfigured: links.configured, supabaseSkipped: !supabase },
    operational: true
  });
  return NextResponse.json({ ok: true, mailerlite, resend, delivery: resend.ok ? "email_sent" : "email_not_configured_no_public_link" });
}
