import { NextResponse } from "next/server";
import { z } from "zod";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";
import { siteConfig } from "@/content/site";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Contact form endpoint (PRD v2 §4.5). Intent-prefixed subjects route the
 * message inside the single support inbox. Turnstile + honeypot guard the
 * surface; the honeypot accepts silently so bots learn nothing.
 */
const intents = ["press", "partnership", "support", "other"] as const;
const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  intent: z.enum(intents),
  message: z.string().min(1).max(4000),
  /** Honeypot — humans never see this field; any value = drop silently. */
  website: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().optional()
});

const intentLabel: Record<(typeof intents)[number], string> = {
  press: "Press",
  partnership: "Partnership",
  support: "Support",
  other: "Contact"
};

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const raw = await request.json().catch(() => ({}));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    // Honeypot triggered or invalid payload: honeypot gets a quiet 200.
    if (typeof raw === "object" && raw !== null && "website" in raw && String((raw as Record<string, unknown>).website ?? "").length > 0) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: { code: "invalid_contact_submission" } }, { status: 400 });
  }

  const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, requestIp(request));
  if (!turnstile.ok) return NextResponse.json({ ok: false, error: { code: "turnstile_failed", reason: turnstile.reason } }, { status: 403 });

  const { name, email, intent, message } = parsed.data;
  const sent = await sendTransactionalEmail({
    to: siteConfig.supportEmail,
    subject: `[${intentLabel[intent]}] ${name} via curlscontemplation.beauty`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p><strong>Intent:</strong> ${intentLabel[intent]}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    text: `From: ${name} <${email}>\nIntent: ${intentLabel[intent]}\n\n${message}`
  });

  const supabase = createServerSupabaseClient(true);
  if (supabase) {
    await supabase.from("contact_submissions").insert({ name, email, intent, message, status: "new", source: "website" });
  }

  await recordServerEvent({
    eventName: analyticsEvents.contactSubmitted,
    route: "/api/contact",
    metadata: { intent, resendSkipped: sent.skipped, databaseConfigured: Boolean(supabase) },
    operational: true
  });

  if (!sent.ok && !sent.skipped) return NextResponse.json({ ok: false, error: { code: "send_failed" } }, { status: 502 });
  // config_missing degrades gracefully: the message is acknowledged and the
  // event recorded so nothing user-facing breaks before Resend DNS is live.
  return NextResponse.json({ ok: true, delivery: sent.ok ? "sent" : "recorded_pending_config" });
}
