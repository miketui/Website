import { siteConfig } from "@/content/site";
import { DOWNLOAD_CAP, DOWNLOAD_WINDOW_DAYS, checkDownloadEntitlement, type DeliverableKind, type DownloadDenialReason } from "@/lib/entitlements";
import { getSupabaseServerConfig } from "@/lib/env";
import { createServerSupabaseClient, type SessionUser } from "@/lib/supabase/server";
import { deliverables, type DeliverableSlug } from "@/lib/deliverables";

export const PRIVATE_BUCKET = "curls-deliverables";
export const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24;

export { deliverables, type DeliverableSlug };
export type SignedDownloadResult =
  | { allowed: true; url: string; expiresInSeconds: number; label: string }
  | { allowed: false; reason: DownloadDenialReason };

export function isSafePrivateDeliverablePath(path: string) {
  return !path.startsWith("/") && !path.includes("release/") && !path.includes("public/") && (path.endsWith(".epub") || path.endsWith(".pdf") || path.endsWith(".zip"));
}

export async function createSignedDownloadUrl(user: SessionUser | null, slug: DeliverableSlug): Promise<SignedDownloadResult> {
  const entitlement = await checkDownloadEntitlement(user, slug as DeliverableKind);
  if (!entitlement.allowed) return entitlement;

  const config = getSupabaseServerConfig(true);
  if (!config.ok) return { allowed: false, reason: "config_missing" };
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { allowed: false, reason: "config_missing" };

  const item = deliverables[slug];
  if (!isSafePrivateDeliverablePath(item.path)) return { allowed: false, reason: "storage_error" };

  // Claim the slot BEFORE minting the URL. The old order — mint, then read the
  // count, then write count + 1 — allowed two concurrent requests to read the
  // same value and both succeed, and it compared against a lifetime counter
  // rather than the seven-day window. claim_download_slot does the window
  // count and the increment inside one transaction under a row lock.
  const { data: claim, error: claimError } = await supabase.rpc("claim_download_slot", {
    p_purchase_id: entitlement.purchaseId,
    p_user_id: entitlement.user.id,
    p_deliverable_slug: slug,
    p_cap: DOWNLOAD_CAP,
    p_window_days: DOWNLOAD_WINDOW_DAYS
  });
  if (claimError || !claim) return { allowed: false, reason: "storage_error" };

  const claimed = claim as { allowed: boolean; reason?: DownloadDenialReason; event_id?: string };
  if (!claimed.allowed) return { allowed: false, reason: claimed.reason ?? "download_limit_reached" };

  const bucket = config.value.bucket || siteConfig.storageBucket || PRIVATE_BUCKET;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(item.path, SIGNED_URL_TTL_SECONDS);
  if (error || !data?.signedUrl || data.signedUrl.includes("/release/")) {
    // The buyer never received a URL, so the slot must go back.
    if (claimed.event_id) await supabase.rpc("release_download_slot", { p_event_id: claimed.event_id });
    return { allowed: false, reason: "storage_error" };
  }

  return { allowed: true, url: data.signedUrl, expiresInSeconds: SIGNED_URL_TTL_SECONDS, label: item.label };
}
