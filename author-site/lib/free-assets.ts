export const FREE_BUCKET = "curls-free";

/** Free lead-magnet assets live in the PUBLIC bucket only. Paid files never appear here. */
export const freeAssets = {
  chapterOne: { label: "Chapter 1 — free excerpt (PDF)", path: "chapter-1/Curls-Ch1-Excerpt.pdf" },
  pricingChecklist: { label: "Pricing Confidence Checklist (PDF)", path: "checklists/Pricing-Confidence-Checklist.pdf" }
} as const;

export type FreeAssetKey = keyof typeof freeAssets;

export function publicFreeAssetUrl(path: string): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${FREE_BUCKET}/${path}`;
}

export function freeChapterLinks() {
  const chapter = publicFreeAssetUrl(freeAssets.chapterOne.path);
  const checklist = publicFreeAssetUrl(freeAssets.pricingChecklist.path);
  return chapter && checklist
    ? { configured: true as const, chapter, checklist }
    : { configured: false as const };
}
