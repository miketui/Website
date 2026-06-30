export const siteConfig = {
  name: "Curls & Contemplation",
  author: "Michael David",
  legalAuthor: "Michael David Warren Jr.",
  subtitle: "A Freelance Hairstylist's Guide to Creative Excellence",
  description:
    "Your craft is not the problem — the missing business map is. Pricing, networking, on-set etiquette, and leadership for freelance hairstylists.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  supportEmail: process.env.SUPPORT_EMAIL ?? "support@example.com",
  releaseDate: process.env.RELEASE_DATE ?? "2026-06-10",
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "curls-deliverables",
  deliverables: {
    epub: "books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub",
    pdf: "books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf"
  },
  external: {
    kindle: "#kindle-link-pending",
    paperback: "#paperback-link-pending"
  }
} as const;

export const acissPalette = {
  obsidianBlack: "#111111",
  antiqueGold: "#B08D57",
  whiteGold: "#D8D1C5",
  deepJade: "#145B4B",
  softJadeMist: "#C7D9D2"
} as const;
