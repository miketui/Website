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
  return !path.startsWith("/") && !path.includes("release/") && !path.includes("public/") && (path.endsWith(".epub") || path.endsWith(".pdf"));
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

  const bucket = config.value.bucket || siteConfig.storageBucket || PRIVATE_BUCKET;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(item.path, SIGNED_URL_TTL_SECONDS);
  if (error || !data?.signedUrl || data.signedUrl.includes("/release/")) return { allowed: false, reason: "storage_error" };

  await supabase.from("download_events").insert({
    user_id: entitlement.user.id,
    purchase_id: entitlement.purchaseId,
    deliverable_slug: slug,
    event_type: "download_signed_url_created",
    metadata: { cap: DOWNLOAD_CAP, window_days: DOWNLOAD_WINDOW_DAYS }
  });
  await supabase.from("purchases").update({ download_count: entitlement.downloadsUsed + 1, updated_at: new Date().toISOString() }).eq("id", entitlement.purchaseId);
  return { allowed: true, url: data.signedUrl, expiresInSeconds: SIGNED_URL_TTL_SECONDS, label: item.label };
}
