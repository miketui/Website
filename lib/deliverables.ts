/** Pure, client-safe deliverable metadata. No server-only imports here — this
 * file is used by both client components (DownloadList) and server code
 * (lib/downloads.ts). Never add a server-only import to this file. */
export const deliverables = {
  epub: { slug: "epub", label: "EPUB", path: "books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub" },
  pdf: { slug: "pdf", label: "PDF", path: "books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf" },
  card_deck: { slug: "card_deck", label: "Affirmation Card Deck (PDF)", path: "cards/Affirmation-Deck-v1.pdf" }
} as const;

export type DeliverableSlug = keyof typeof deliverables;
