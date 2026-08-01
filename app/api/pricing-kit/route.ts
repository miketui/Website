import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";
import { pricingKitLink } from "@/lib/free-assets";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LEAD_INTAKE_FAILED_STATUS, leadIntakeFailure, summarizeLeadIntake, type DurableWrite } from "@/lib/lead-intake";

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

  // Every durable write, checked. `magnet_leads` used to be inserted without
  // examining its error, so an unreachable database and an unconfigured
  // MailerLite together still produced "your kit is on the way".
  const writes: DurableWrite[] = [{ system: "mailerlite:pricing_kit", accepted: mailerlite.ok, detail: mailerlite.ok ? undefined : mailerlite.reason }];
  if (supabase) {
    const { error } = await supabase
      .from("magnet_leads")
      .insert({ email: parsed.data.email, magnet_slug: "pricing-confidence-kit", delivered_at: mailerlite.ok ? new Date().toISOString() : null });
    writes.push({ system: "supabase:magnet_leads", accepted: !error, detail: error?.message });
  } else {
    writes.push({ system: "supabase:magnet_leads", accepted: false, detail: "config_missing" });
  }

  const intake = summarizeLeadIntake(writes, "mailerlite:pricing_kit");
  await recordServerEvent({
    eventName: analyticsEvents.pricingKitRequested,
    route: "/api/pricing-kit",
    metadata: { turnstileSkipped: turnstile.skipped, linkConfigured: Boolean(checklist), delivery: intake.delivery, systemsOfRecord: intake.systemsOfRecord.join(","), failures: intake.failures.map((f) => f.system).join(",") },
    operational: true
  });
  if (!intake.accepted) return NextResponse.json(leadIntakeFailure(intake), { status: LEAD_INTAKE_FAILED_STATUS });
  return NextResponse.json({ ok: true, mailerlite, nurture, delivery: intake.delivery, systemsOfRecord: intake.systemsOfRecord });
}
