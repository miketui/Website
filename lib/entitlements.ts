import { createServerSupabaseClient, type SessionUser } from "@/lib/supabase/server";
import { orEquals } from "@/lib/supabase/filters";

export type DeliverableKind = "epub" | "card_deck" | "workbook" | "preorder_bonus";
export type DownloadDenialReason = "unauthenticated" | "no_purchase" | "refunded" | "revoked" | "download_limit_reached" | "config_missing" | "storage_error";
export type PurchaseStatus = "active" | "refunded" | "canceled" | "past_due" | "revoked";
export type EntitlementResult =
  | { allowed: true; purchaseId: string; downloadsUsed: number; user: SessionUser }
  | { allowed: false; reason: DownloadDenialReason };

export const DOWNLOAD_CAP = 3;
export const DOWNLOAD_WINDOW_DAYS = 7;

export function productEntitlements(): Record<DeliverableKind, boolean> {
  return { epub: true, card_deck: true, workbook: false, preorder_bonus: false };
}

/** Maps a deliverable kind to the purchases.book_slug that entitles it. */
export function entitlementSlugFor(deliverable: DeliverableKind): string {
  return deliverable === "card_deck" ? "affirmation-deck" : "curls-and-contemplation";
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
  if ((purchase.download_count ?? 0) >= DOWNLOAD_CAP) return { allowed: false, reason: "download_limit_reached" };
  return { allowed: true, purchaseId: purchase.id as string, downloadsUsed: purchase.download_count ?? 0, user: normalizedUser };
}
