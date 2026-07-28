import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/env";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { authorizeCronRequest } from "@/lib/cron-auth";

/**
 * Scheduled for November 23 at 07:30 America/Los_Angeles (24h before the
 * November 24 launch window; see vercel.json): runs the
 * launch-day dry-run against the internal route and emails the owner a
 * plain-English pass/fail report so launch morning starts with evidence,
 * not hope. Subject gets the [⚠️ ACTION REQUIRED] prefix when anything —
 * a warning, a failed send, an unreachable bucket — is off.
 */
export async function GET(request: Request) {
  const auth = authorizeCronRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: { code: auth.code } }, { status: auth.status });
  }

  const owner = process.env.LAUNCH_OWNER_EMAIL;
  const base = getSiteUrl().replace(/\/$/, "");
  let report: Record<string, unknown> = {};
  let pass = false;
  try {
    const response = await fetch(`${base}/api/cron/launch-day/dry-run`, {
      // authorizeCronRequest already established CRON_SECRET is set — it
      // returns 503 otherwise — so this header is now unconditional. It used
      // to be omitted when the secret was absent, which only worked because
      // the dry-run route accepted unauthenticated callers in that case.
      headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
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
