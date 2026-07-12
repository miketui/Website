import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { siteConfig } from "@/content/site";

// /resources is login-gated (see lib/route-policy.ts + proxy.ts) and is
// intentionally excluded below — search engines should not index
// members-only content. Blog stays public: it's the organic-search
// acquisition surface.
// Funnel entries (/quiz, /pricing-kit) are indexed landing
// targets per PRD v2 §3.2 — present here, absent from primary nav.
const publicRoutes = ["/", "/book", "/order", "/preorder", "/buy", "/pricing-kit", "/daily-directives", "/subscribe", "/reset", "/quiz", "/journey", "/blog", "/worksheets", "/about", "/media-kit", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routeEntries = publicRoutes.map((route) => ({ url: `${siteConfig.siteUrl}${route}`, lastModified: now, changeFrequency: "weekly" as const, priority: route === "/" ? 1 : 0.7 }));
  const blogEntries = posts.map((post) => ({ url: `${siteConfig.siteUrl}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "monthly" as const, priority: 0.5 }));
  return [...routeEntries, ...blogEntries];
}
