import { deliverables } from "@/lib/deliverables";
import { getResendConfig } from "@/lib/env";
import { sendLaunchDelivery } from "@/lib/email/resend";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const PRIVATE_BUCKET = "curls-deliverables";
/** Launch links live longer than dashboard links — 30 days per the launch spec. */
export const LAUNCH_SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 30;
export const LAUNCH_SIGNED_URL_TTL_DAYS = 30;
export const BOOK_SLUG = "curls-and-contemplation";

type SupabaseServer = NonNullable<ReturnType<typeof createServerSupabaseClient>>;

/**
 * Kill-switch. The launch-day cron does nothing unless this is exactly the
 * string "true" in the environment — so an accidental cron fire, a wrong-date
 * deploy, or a broken bucket can never mass-send bad links. Flip it in Vercel
 * Production ~30 minutes before the launch cron (see
 * docs/curls-launch-day-runbook.md).
 */
export function launchFulfillmentEnabled(): boolean {
  return process.env.LAUNCH_FULFILLMENT_ENABLED === "true";
}

export type LaunchGuardResult = { ok: true; warnings: string[] } | { ok: false; failed: string; warnings: string[] };

/**
 * Guard chain run before any fulfillment work. Verifies the private bucket is
 * reachable, the v13 EPUB object actually exists at the locked path, and
 * Resend is configured. Never throws — a guard failure is a result, not an
 * exception, so callers can alert and abort cleanly.
 */
export async function verifyLaunchPreconditions(supabase: SupabaseServer): Promise<LaunchGuardResult> {
  const warnings: string[] = [];

  if (!getResendConfig().ok) return { ok: false, failed: "resend_not_configured", warnings };

  const epubPath = deliverables.epub.path;
  const folder = epubPath.split("/").slice(0, -1).join("/");
  const name = epubPath.split("/").at(-1) ?? "";
  const { data, error } = await supabase.storage.from(PRIVATE_BUCKET).list(folder, { search: name, limit: 1 });
  if (error) return { ok: false, failed: `bucket_unreachable: ${error.message}`, warnings };
  if (!data?.some((item) => item.name === name)) return { ok: false, failed: `epub_object_missing: ${epubPath}`, warnings };

  return { ok: true, warnings };
}

export type LaunchDeliveryOutcome = {
  email: string;
  sent: boolean;
  reason?: string;
  epubUrlExpiresAt?: string;
};

/**
 * Delivers the book to a single buyer: signs the EPUB, sends the launch
 * email, writes the audit `download_events` row, and — for real (non-dry-run)
 * sends — stamps `purchases.launch_email_sent_at` so the daily cron never
 * double-sends. Dry runs write a distinct event type and never touch
 * `purchases`. The print PDF is a POD artifact (KDP paperback), not a site
 * deliverable — the site delivers the EPUB only.
 */
export async function deliverLaunchCopy(
  supabase: SupabaseServer,
  buyer: { email: string; purchaseId?: string; userId?: string },
  options: { dryRun: boolean }
): Promise<LaunchDeliveryOutcome> {
  const epub = await supabase.storage.from(PRIVATE_BUCKET).createSignedUrl(deliverables.epub.path, LAUNCH_SIGNED_URL_TTL_SECONDS);
  if (epub.error || !epub.data?.signedUrl) {
    return { email: buyer.email, sent: false, reason: `sign_epub_failed: ${epub.error?.message ?? "no url"}` };
  }

  /**
   * Claim the send BEFORE calling Resend.
   *
   * This used to send first and stamp `launch_email_sent_at` afterwards,
   * discarding the stamp's error. A stamp failure therefore produced a
   * *reported success* with the row still eligible — and the cron runs hourly,
   * so the buyer received the launch email again every hour until someone
   * noticed. Sending twice is a trust incident; claiming first turns the same
   * failure into a retry, which is not.
   *
   * The `.is("launch_email_sent_at", null)` predicate makes the claim atomic:
   * two overlapping cron invocations race on the same row and exactly one gets
   * a row back. If the send then fails, the claim is released below so the next
   * run picks the buyer up again.
   */
  const claimedAt = new Date().toISOString();
  if (!options.dryRun) {
    if (!buyer.purchaseId) {
      // Without a purchase row there is nothing to mark, so nothing prevents a
      // resend. Refuse rather than send an unbounded number of times.
      return { email: buyer.email, sent: false, reason: "missing_purchase_id" };
    }
    const { data: claimed, error: claimError } = await supabase
      .from("purchases")
      .update({ launch_email_sent_at: claimedAt, updated_at: claimedAt })
      .eq("id", buyer.purchaseId)
      .is("launch_email_sent_at", null)
      .select("id");
    if (claimError) return { email: buyer.email, sent: false, reason: `claim_failed: ${claimError.message}` };
    if (!claimed?.length) return { email: buyer.email, sent: false, reason: "already_sent" };
  }

  const result = await sendLaunchDelivery(buyer.email, { epubUrl: epub.data.signedUrl, expiresDays: LAUNCH_SIGNED_URL_TTL_DAYS });
  if (!result.ok) {
    if (!options.dryRun && buyer.purchaseId) {
      // Release the claim so the next cron retries this buyer. Guarded on the
      // exact timestamp we wrote, so a concurrent successful send is never
      // un-marked.
      await supabase
        .from("purchases")
        .update({ launch_email_sent_at: null, updated_at: new Date().toISOString() })
        .eq("id", buyer.purchaseId)
        .eq("launch_email_sent_at", claimedAt);
    }
    return { email: buyer.email, sent: false, reason: "skipped" in result && result.skipped ? "resend_not_configured" : "provider_error" };
  }

  const expiresAt = new Date(Date.now() + LAUNCH_SIGNED_URL_TTL_SECONDS * 1000).toISOString();
  // The audit row is checked work: a delivery nobody can evidence later is not
  // a delivery anyone can reconcile. The email did go out, so this is reported
  // as a failed job (for alerting) without releasing the claim — re-sending to
  // fix a missing audit row would be the worse trade.
  const { error: auditError } = await supabase.from("download_events").insert({
    user_id: buyer.userId ?? null,
    purchase_id: buyer.purchaseId ?? null,
    deliverable_slug: deliverables.epub.slug,
    event_type: options.dryRun ? "launch_ebook_dryrun" : "launch_ebook_delivery",
    metadata: { dry_run: options.dryRun, url_expires_at: expiresAt, claimed_at: options.dryRun ? null : claimedAt }
  });
  if (auditError) {
    return { email: buyer.email, sent: false, reason: `audit_write_failed_after_send: ${auditError.message}`, epubUrlExpiresAt: expiresAt };
  }

  return { email: buyer.email, sent: true, epubUrlExpiresAt: expiresAt };
}

/**
 * Cap per cron invocation so the function always finishes inside Vercel's
 * execution limit (~50 sends × ~0.9s each ≈ 45s < 60s maxDuration). The cron
 * runs hourly post-launch, so a backlog larger than one batch drains within
 * hours, not days.
 */
export const LAUNCH_SEND_BATCH_LIMIT = 50;

/** Paid-not-yet-fulfilled buyers, per the existing schema (no invented tables). */
export async function eligibleLaunchBuyers(supabase: SupabaseServer, limit = LAUNCH_SEND_BATCH_LIMIT) {
  return supabase
    .from("purchases")
    .select("id, email, user_id", { count: "exact" })
    .eq("book_slug", BOOK_SLUG)
    .eq("entitlement_status", "active")
    .is("launch_email_sent_at", null)
    .not("email", "is", null)
    .order("created_at", { ascending: true })
    .limit(limit);
}
