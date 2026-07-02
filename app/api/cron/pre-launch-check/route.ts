import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/env";
import { sendTransactionalEmail } from "@/lib/email/resend";

/**
 * Scheduled for July 13 (24h before launch, see vercel.json): runs the
 * launch-day dry-run against the internal route and emails the owner a
 * plain-English pass/fail report so launch morning starts with evidence,
 * not hope. Subject gets the [⚠️ ACTION REQUIRED] prefix when anything —
 * a warning, a failed send, an unreachable bucket — is off.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ ok: false, error: { code: "unauthorized" } }, { status: 401 });
  }

  const owner = process.env.LAUNCH_OWNER_EMAIL;
  const base = getSiteUrl().replace(/\/$/, "");
  let report: Record<string, unknown> = {};
  let pass = false;
  try {
    const response = await fetch(`${base}/api/cron/launch-day/dry-run`, {
      headers: cronSecret ? { authorization: `Bearer ${cronSecret}` } : undefined,
      cache: "no-store"
    });
    report = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    pass = response.ok && report.ok === true && (!Array.isArray(report.warnings) || report.warnings.length === 0);
  } catch (error) {
    report = { error: error instanceof Error ? error.message : "dry-run fetch failed" };
    pass = false;
  }

  if (owner) {
    const subject = pass
      ? "Pre-launch check passed — fulfillment chain is green"
      : "[⚠️ ACTION REQUIRED] Pre-launch check found problems";
    const summary = pass
      ? "The launch-day dry run completed with no warnings. Signed URL generated, delivery email sent, audit row written. You are clear to flip LAUNCH_FULFILLMENT_ENABLED tomorrow morning per docs/curls-launch-day-runbook.md."
      : "The launch-day dry run FAILED or returned warnings. Do NOT flip the kill-switch until this is resolved. Full JSON report below.";
    const json = JSON.stringify(report, null, 2);
    await sendTransactionalEmail({
      to: owner,
      subject,
      html: `<p>${summary}</p><pre>${json.replace(/</g, "&lt;")}</pre>`,
      text: `${summary}\n\n${json}`
    });
  }

  return NextResponse.json({ ok: true, pass, ownerNotified: Boolean(owner), report });
}
