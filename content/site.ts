import { envOrDefault } from "@/lib/env";

/**
 * A trailing slash on NEXT_PUBLIC_SITE_URL produced double-slash URLs in
 * sitemap.xml and robots.txt (`…beauty//book`) — a real crawl defect flagged
 * by the 2026-07-08 live audit. Every consumer concatenates `${siteUrl}${path}`,
 * so the base must never end in "/".
 */
function normalizeSiteUrl(value: string | undefined, fallback: string): string {
  return envOrDefault(value, fallback).replace(/\/+$/, "");
}

export const siteConfig = {
  name: "Curls & Contemplation",
  author: "Michael David",
  legalAuthor: "Michael David Warren Jr.",
  tagline: "For the freelance hairstylist who wants to lead.",
  subtitle: "A Freelance Hairstylist's Guide to Creative Excellence",
  description:
    "Your craft is not the problem — the missing business map is. Pricing, networking, on-set etiquette, and leadership for freelance hairstylists.",
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000"),
  supportEmail: envOrDefault(process.env.SUPPORT_EMAIL, "support@example.com"),
  /* PRD v2: launch is Tuesday, November 24, 2026. Env override still wins. */
  releaseDate: envOrDefault(process.env.RELEASE_DATE, "2026-11-24"),
  storageBucket: envOrDefault(process.env.SUPABASE_STORAGE_BUCKET, "curls-deliverables"),
  external: {
    kindle: "#kindle-link-pending",
    paperback: "#paperback-link-pending"
  }
} as const;
