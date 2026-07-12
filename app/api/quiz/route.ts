import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";
import { quizArchetypes } from "@/content/funnels";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const archetypeSlugs = quizArchetypes.map((a) => a.slug) as [string, ...string[]];
const schema = z.object({
  email: z.string().email(),
  archetype: z.enum(archetypeSlugs),
  turnstileToken: z.string().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_quiz_submission" } }, { status: 400 });

  const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, requestIp(request));
  if (!turnstile.ok) return NextResponse.json({ ok: false, error: { code: "turnstile_failed", reason: turnstile.reason } }, { status: 403 });

  // Capture into the quiz group tagged with the archetype; the worksheet itself
  // is delivered by the owner's MailerLite automation (asset upload is a held
  // launch item, so delivery degrades gracefully until the group ID is set).
  const result = quizArchetypes.find((archetype) => archetype.slug === parsed.data.archetype)!;
  const resultUrl = `https://curlscontemplation.beauty/quiz/results/${result.slug}`;
  const mailerlite = await upsertSubscriber(parsed.data.email, "quiz", {
    marketing_consent_source: "quiz",
    primary_interest: result.focus,
    quiz_result_name: result.name,
    quiz_result_summary: result.diagnosis,
    quiz_strength: result.strength,
    quiz_risk: result.risk,
    quiz_next_step: result.nextStep,
    quiz_result_url: resultUrl
  });
  const supabase = createServerSupabaseClient(true);
  if (supabase) {
    await supabase.from("quiz_leads").upsert({ email: parsed.data.email, archetype: parsed.data.archetype, marketing_consent: true, updated_at: new Date().toISOString() }, { onConflict: "email" });
  }
  await recordServerEvent({
    eventName: analyticsEvents.quizCompleted,
    route: "/api/quiz",
    metadata: { archetype: parsed.data.archetype, mailerliteSkipped: mailerlite.skipped, turnstileSkipped: turnstile.skipped, databaseConfigured: Boolean(supabase) },
    operational: true
  });
  return NextResponse.json({ ok: true, mailerlite, delivery: mailerlite.ok ? "list_tagged" : "captured_pending_config" });
}
