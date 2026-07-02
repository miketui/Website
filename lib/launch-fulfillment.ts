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

  const pdfPath = deliverables.pdf.path;
  const pdfFolder = pdfPath.split("/").slice(0, -1).join("/");
  const pdfName = pdfPath.split("/").at(-1) ?? "";
  const pdfCheck = await supabase.storage.from(PRIVATE_BUCKET).list(pdfFolder, { search: pdfName, limit: 1 });
  if (pdfCheck.error || !pdfCheck.data?.some((item) => item.name === pdfName)) {
    warnings.push(`pdf_object_missing: ${pdfPath} — launch email will link EPUB only`);
  }

  return { ok: true, warnings };
}

export type LaunchDeliveryOutcome = {
  email: string;
  sent: boolean;
  reason?: string;
  epubUrlExpiresAt?: string;
};

/**
 * Delivers the book to a single buyer: signs the EPUB (and PDF when present),
 * sends the launch email, writes the audit `download_events` row, and — for
 * real (non-dry-run) sends — stamps `purchases.launch_email_sent_at` so the
 * daily cron never double-sends. Dry runs write a distinct event type and
 * never touch `purchases`.
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
  const pdf = await supabase.storage.from(PRIVATE_BUCKET).createSignedUrl(deliverables.pdf.path, LAUNCH_SIGNED_URL_TTL_SECONDS);
  const pdfUrl = pdf.error || !pdf.data?.signedUrl ? undefined : pdf.data.signedUrl;

  const result = await sendLaunchDelivery(buyer.email, { epubUrl: epub.data.signedUrl, pdfUrl, expiresDays: LAUNCH_SIGNED_URL_TTL_DAYS });
  if (!result.ok) {
    return { email: buyer.email, sent: false, reason: "skipped" in result && result.skipped ? "resend_not_configured" : "provider_error" };
  }

  const expiresAt = new Date(Date.now() + LAUNCH_SIGNED_URL_TTL_SECONDS * 1000).toISOString();
  await supabase.from("download_events").insert({
    user_id: buyer.userId ?? null,
    purchase_id: buyer.purchaseId ?? null,
    deliverable_slug: deliverables.epub.slug,
    event_type: options.dryRun ? "launch_ebook_dryrun" : "launch_ebook_delivery",
    metadata: { dry_run: options.dryRun, url_expires_at: expiresAt, pdf_included: Boolean(pdfUrl) }
  });

  if (!options.dryRun && buyer.purchaseId) {
    await supabase
      .from("purchases")
      .update({ launch_email_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", buyer.purchaseId);
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
