import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { sendBonusClaimReceived } from "@/lib/email/resend";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";

const schema = z.object({ email: z.string().email(), note: z.string().max(1000).optional(), turnstileToken: z.string().optional() });

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await request.json().catch(() => ({})) : Object.fromEntries((await request.formData()).entries());
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_bonus_claim" } }, { status: 400 });
  const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, requestIp(request));
  if (!turnstile.ok) return NextResponse.json({ ok: false, error: { code: "turnstile_failed", reason: turnstile.reason } }, { status: 403 });

  const mailerlite = await upsertSubscriber(parsed.data.email, "bonus_claim_started", { source: "bonus_claim" });
  const resend = await sendBonusClaimReceived(parsed.data.email);
  const supabase = createServerSupabaseClient(true);
  if (supabase) await supabase.from("bonus_claims").insert({ email: parsed.data.email, note: parsed.data.note, status: "started" });
  await recordServerEvent({ eventName: analyticsEvents.bonusClaimSubmitted, route: "/api/bonus-claim", metadata: { databaseConfigured: Boolean(supabase), turnstileSkipped: turnstile.skipped }, operational: true });
  return NextResponse.json({ ok: true, status: supabase ? "recorded" : "manual_review_scaffold", mailerlite, resend });
}
