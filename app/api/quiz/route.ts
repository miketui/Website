import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertSubscriber } from "@/lib/email/mailerlite";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";
import { quizArchetypes } from "@/content/funnels";

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
  const mailerlite = await upsertSubscriber(parsed.data.email, "quiz", { source: "quiz", archetype: parsed.data.archetype });
  await recordServerEvent({
    eventName: analyticsEvents.quizCompleted,
    route: "/api/quiz",
    metadata: { archetype: parsed.data.archetype, mailerliteSkipped: mailerlite.skipped, turnstileSkipped: turnstile.skipped },
    operational: true
  });
  return NextResponse.json({ ok: true, mailerlite, delivery: mailerlite.ok ? "list_tagged" : "captured_pending_config" });
}
