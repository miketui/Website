import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";
import { pricingKitLink } from "@/lib/free-assets";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const schema = z.object({ email: z.string().email(), turnstileToken: z.string().optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_email" } }, { status: 400 });
  const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, requestIp(request));
  if (!turnstile.ok) return NextResponse.json({ ok: false, error: { code: "turnstile_failed", reason: turnstile.reason } }, { status: 403 });

  const mailerlite = await upsertSubscriber(parsed.data.email, "pricing_kit", { source: "pricing_kit" });
  const nurture = await upsertSubscriber(parsed.data.email, "core_nurture", { source: "pricing_kit" });
  const checklist = pricingKitLink();
  const supabase = createServerSupabaseClient(true);
  if (supabase) await supabase.from("magnet_leads").insert({ email: parsed.data.email, magnet_slug: "pricing-confidence-kit", delivered_at: mailerlite.ok ? new Date().toISOString() : null });
  await recordServerEvent({ eventName: analyticsEvents.pricingKitRequested, route: "/api/pricing-kit", metadata: { mailerliteSkipped: mailerlite.skipped, nurtureSkipped: nurture.skipped, turnstileSkipped: turnstile.skipped, linkConfigured: Boolean(checklist), supabaseSkipped: !supabase }, operational: true });
  return NextResponse.json({ ok: true, mailerlite, nurture, delivery: mailerlite.ok ? "automation_queued" : "email_not_configured" });
}
