import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { sendWelcomeEmail } from "@/lib/email/resend";
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

const schema = z.object({ email: z.string().email(), source: z.string().max(80).optional(), utm: utmSchema, turnstileToken: z.string().optional() });

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
  const mailerlite = await upsertSubscriber(parsed.data.email, "subscribers", { source: parsed.data.source ?? "site", ...definedUtm });

  // Autonomous welcome email. The NewsletterForm success state promises "check
  // your inbox for the welcome note", and there is no MailerLite automation on
  // the signup group to honor that — so send it directly via Resend, matching
  // the free-chapter/bonus-claim pattern. Skips gracefully (skipped:true) if
  // Resend isn't configured. The .catch() guarantees a network/timeout failure
  // in the underlying fetch can never throw past this line — the signup (and the
  // Supabase writes below) must still succeed even if email delivery is down.
  const resend = await sendWelcomeEmail(parsed.data.email).catch(
    () => ({ ok: false as const, skipped: false as const, reason: "provider_error" as const })
  );

  const supabase = createServerSupabaseClient(true);
  if (supabase) {
    await supabase.from("subscribers").upsert({ email: parsed.data.email, source: parsed.data.source ?? "site", updated_at: new Date().toISOString() }, { onConflict: "email" });
    await supabase.from("subscriber_events").insert({ email: parsed.data.email, event_type: "email_signup_completed", provider: "site", metadata: { source: parsed.data.source ?? "site", ...definedUtm } });
  }
  await recordServerEvent({ eventName: analyticsEvents.emailSignupCompleted, route: "/api/subscribe", source: parsed.data.source, metadata: { mailerliteSkipped: mailerlite.skipped, resendSkipped: resend.skipped }, operational: true });
  return NextResponse.json({ ok: true, mailerlite, resend, database: supabase ? "recorded" : "skipped_config_missing" });
}
