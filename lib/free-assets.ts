export const FREE_BUCKET = "curls-free";

/** Free lead-magnet assets live in the PUBLIC bucket only. Paid files never appear here. */
export const freeAssets = {
  pricingChecklist: { label: "Pricing Confidence Checklist (PDF)", path: "checklists/Pricing-Confidence-Checklist.pdf" }
} as const;

export type FreeAssetKey = keyof typeof freeAssets;

export function publicFreeAssetUrl(path: string): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${FREE_BUCKET}/${path}`;
}

export function pricingKitLink() {
  return publicFreeAssetUrl(freeAssets.pricingChecklist.path);
}
