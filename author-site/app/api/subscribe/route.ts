import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";

const schema = z.object({ email: z.string().email(), source: z.string().max(80).optional(), turnstileToken: z.string().optional() });

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

  const mailerlite = await upsertSubscriber(parsed.data.email, "subscribers", { source: parsed.data.source ?? "site" });
  const supabase = createServerSupabaseClient(true);
  if (supabase) {
    await supabase.from("subscribers").upsert({ email: parsed.data.email, source: parsed.data.source ?? "site", updated_at: new Date().toISOString() }, { onConflict: "email" });
    await supabase.from("subscriber_events").insert({ email: parsed.data.email, event_type: "email_signup_completed", provider: "site", metadata: { source: parsed.data.source ?? "site" } });
  }
  await recordServerEvent({ eventName: analyticsEvents.emailSignupCompleted, route: "/api/subscribe", source: parsed.data.source, metadata: { mailerliteSkipped: mailerlite.skipped }, operational: true });
  return NextResponse.json({ ok: true, mailerlite, database: supabase ? "recorded" : "skipped_config_missing" });
}
