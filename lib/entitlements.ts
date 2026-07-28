import { createServerSupabaseClient, type SessionUser } from "@/lib/supabase/server";
import { orEquals } from "@/lib/supabase/filters";
import { deliverables, type DeliverableSlug } from "@/lib/deliverables";

export type DeliverableKind = DeliverableSlug;
export type DownloadDenialReason = "unauthenticated" | "no_purchase" | "refunded" | "revoked" | "download_limit_reached" | "config_missing" | "storage_error";
export type PurchaseStatus = "active" | "refunded" | "canceled" | "past_due" | "revoked";
export type EntitlementResult =
  | { allowed: true; purchaseId: string; downloadsUsed: number; user: SessionUser }
  | { allowed: false; reason: DownloadDenialReason };

export const DOWNLOAD_CAP = 3;
export const DOWNLOAD_WINDOW_DAYS = 7;

export function productEntitlements(): Record<DeliverableKind, boolean> {
  return Object.fromEntries(Object.keys(deliverables).map((slug) => [slug, true])) as Record<DeliverableKind, boolean>;
}

/** Maps a deliverable kind to the purchases.book_slug that entitles it. */
export function entitlementSlugFor(deliverable: DeliverableKind): string {
  if (deliverable === "daily_directives_bundle") return "daily-directives-bundle";
  if (deliverable.startsWith("daily_directives_set_")) return deliverable.replaceAll("_", "-");
  if (deliverable === "workbook") return "companion-workbook";
  return "curls-and-contemplation";
}

export async function checkDownloadEntitlement(user: SessionUser | string | null, deliverable: DeliverableKind | string): Promise<EntitlementResult> {
  const normalizedUser = typeof user === "string" ? { id: user, email: "" } : user;
  const normalizedDeliverable = deliverable as DeliverableKind;
  if (!normalizedUser?.id) return { allowed: false, reason: "unauthenticated" };
  if (!productEntitlements()[normalizedDeliverable]) return { allowed: false, reason: "no_purchase" };

  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { allowed: false, reason: "config_missing" };

  const { data: purchase, error } = await supabase
    .from("purchases")
    .select("id, user_id, email, status, entitlement_status, refunded_at, revoked_at, download_count")
    .eq("book_slug", entitlementSlugFor(normalizedDeliverable))
    .or(orEquals([["user_id", normalizedUser.id], ["email", normalizedUser.email]]))
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !purchase) return { allowed: false, reason: "no_purchase" };
  const status = (purchase.status ?? purchase.entitlement_status) as PurchaseStatus | undefined;
  if (purchase.refunded_at || status === "refunded") return { allowed: false, reason: "refunded" };
  if (purchase.revoked_at || status === "revoked" || status === "canceled" || status === "past_due") return { allowed: false, reason: "revoked" };
  // Advisory only — claim_download_slot is the authority, because a check here
  // and a write later can always interleave. This exists so the UI can show an
  // accurate count without minting a URL.
  //
  // It counts events inside the seven-day window. It used to compare the
  // LIFETIME purchases.download_count against the cap, which never reset, so a
  // buyer who used three downloads was refused permanently — despite the UI
  // telling them the window resets after seven days.
  const windowStart = new Date(Date.now() - DOWNLOAD_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { count: usedInWindow } = await supabase
    .from("download_events")
    .select("id", { count: "exact", head: true })
    .eq("purchase_id", purchase.id)
    .eq("event_type", "download_signed_url_created")
    .gte("created_at", windowStart);

  const downloadsUsed = usedInWindow ?? 0;
  if (downloadsUsed >= DOWNLOAD_CAP) return { allowed: false, reason: "download_limit_reached" };
  return { allowed: true, purchaseId: purchase.id as string, downloadsUsed, user: normalizedUser };
}
