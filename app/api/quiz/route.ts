import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";
import { quizArchetypes } from "@/content/funnels";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LEAD_INTAKE_FAILED_STATUS, leadIntakeFailure, summarizeLeadIntake, type DurableWrite } from "@/lib/lead-intake";

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
  const writes: DurableWrite[] = [{ system: "mailerlite:quiz", accepted: mailerlite.ok, detail: mailerlite.ok ? undefined : mailerlite.reason }];
  const supabase = createServerSupabaseClient(true);
  if (supabase) {
    const { error } = await supabase
      .from("quiz_leads")
      .upsert({ email: parsed.data.email, archetype: parsed.data.archetype, marketing_consent: true, updated_at: new Date().toISOString() }, { onConflict: "email" });
    writes.push({ system: "supabase:quiz_leads", accepted: !error, detail: error?.message });
  } else {
    writes.push({ system: "supabase:quiz_leads", accepted: false, detail: "config_missing" });
  }

  // "captured_pending_config" was returned when nothing had captured anything.
  const intake = summarizeLeadIntake(writes, "mailerlite:quiz");
  await recordServerEvent({
    eventName: analyticsEvents.quizCompleted,
    route: "/api/quiz",
    metadata: { archetype: parsed.data.archetype, turnstileSkipped: turnstile.skipped, delivery: intake.delivery, systemsOfRecord: intake.systemsOfRecord.join(","), failures: intake.failures.map((f) => f.system).join(",") },
    operational: true
  });
  if (!intake.accepted) return NextResponse.json(leadIntakeFailure(intake), { status: LEAD_INTAKE_FAILED_STATUS });
  return NextResponse.json({ ok: true, mailerlite, delivery: intake.delivery, systemsOfRecord: intake.systemsOfRecord, resultUrl });
}
