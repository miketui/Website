import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";

const utmSchema = z
  .object({
    utm_source: z.string().max(120).optional(),
    utm_medium: z.string().max(120).optional(),
    utm_campaign: z.string().max(120).optional(),
    utm_term: z.string().max(120).optional(),
    utm_content: z.string().max(120).optional()
  })
  .optional();

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().max(80).optional(),
  professionalRole: z.string().trim().max(120).optional(),
  careerStage: z.string().trim().max(80).optional(),
  interests: z.array(z.string().trim().max(80)).max(8).default([]),
  marketingConsent: z.literal(true),
  source: z.string().max(80).optional(),
  utm: utmSchema,
  turnstileToken: z.string().optional()
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await request.json().catch(() => ({})) : Object.fromEntries((await request.formData()).entries());
  if (body && typeof body === "object" && !("turnstileToken" in body) && "cf-turnstile-response" in body) {
    (body as Record<string, unknown>).turnstileToken = (body as Record<string, unknown>)["cf-turnstile-response"];
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_email" } }, { status: 400 });

  const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, requestIp(request));
  if (!turnstile.ok) return NextResponse.json({ ok: false, error: { code: "turnstile_failed", reason: turnstile.reason } }, { status: 403 });

  const utm = parsed.data.utm ?? {};
  const definedUtm = Object.fromEntries(Object.entries(utm).filter(([, value]) => typeof value === "string" && value.length > 0)) as Record<string, string>;
  const mailerlite = await upsertSubscriber(parsed.data.email, "subscribers", {
    source: parsed.data.source ?? "site",
    ...(parsed.data.firstName ? { name: parsed.data.firstName } : {}),
    ...(parsed.data.professionalRole ? { professional_role: parsed.data.professionalRole } : {}),
    ...(parsed.data.careerStage ? { career_stage: parsed.data.careerStage } : {}),
    ...(parsed.data.interests.length ? { primary_interest: parsed.data.interests.join(", ") } : {}),
    marketing_consent_source: parsed.data.source ?? "site",
    ...definedUtm
  });

  // The welcome and nurture messages are owned by the live MailerLite
  // automations. Tag the subscriber into the delayed non-buyer nurture flow;
  // transactional order/access email remains in Resend.
  const nurture = await upsertSubscriber(parsed.data.email, "core_nurture", { source: parsed.data.source ?? "site" });

  const supabase = createServerSupabaseClient(true);
  if (supabase) {
    const now = new Date().toISOString();
    await supabase.from("subscribers").upsert({
      email: parsed.data.email,
      first_name: parsed.data.firstName || null,
      professional_role: parsed.data.professionalRole || null,
      career_stage: parsed.data.careerStage || null,
      interests: parsed.data.interests,
      marketing_consent: true,
      marketing_consent_at: now,
      consent_source: parsed.data.source ?? "site",
      last_seen_at: now,
      source: parsed.data.source ?? "site",
      updated_at: now
    }, { onConflict: "email" });
    await supabase.from("consent_log").insert({ email: parsed.data.email, consent_state: { marketing: true, source: parsed.data.source ?? "site" } });
    await supabase.from("subscriber_events").insert({ email: parsed.data.email, event_type: "email_signup_completed", provider: "site", metadata: { source: parsed.data.source ?? "site", ...definedUtm } });
  }
  await recordServerEvent({ eventName: analyticsEvents.emailSignupCompleted, route: "/api/subscribe", source: parsed.data.source, metadata: { mailerliteSkipped: mailerlite.skipped, nurtureSkipped: nurture.skipped }, operational: true });
  return NextResponse.json({ ok: true, mailerlite, nurture, database: supabase ? "recorded" : "skipped_config_missing" });
}
