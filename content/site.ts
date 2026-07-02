import { envOrDefault } from "@/lib/env";

export const siteConfig = {
  name: "Curls & Contemplation",
  author: "Michael David",
  legalAuthor: "Michael David Warren Jr.",
  subtitle: "A Freelance Hairstylist's Guide to Creative Excellence",
  description:
    "Your craft is not the problem — the missing business map is. Pricing, networking, on-set etiquette, and leadership for freelance hairstylists.",
  siteUrl: envOrDefault(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  supportEmail: envOrDefault(process.env.SUPPORT_EMAIL, "support@example.com"),
  releaseDate: envOrDefault(process.env.RELEASE_DATE, "2026-11-17"),
  storageBucket: envOrDefault(process.env.SUPABASE_STORAGE_BUCKET, "curls-deliverables"),
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
