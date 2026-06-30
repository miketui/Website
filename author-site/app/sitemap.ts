import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { chapters } from "@/content/chapters";
import { siteConfig } from "@/content/site";

const publicRoutes = ["/", "/book", "/preorder", "/buy", "/free-chapter", "/chapters", "/blog", "/resources", "/worksheets", "/about", "/media-kit", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routeEntries = publicRoutes.map((route) => ({ url: `${siteConfig.siteUrl}${route}`, lastModified: now, changeFrequency: "weekly" as const, priority: route === "/" ? 1 : 0.7 }));
  const chapterEntries = chapters.map((chapter) => ({ url: `${siteConfig.siteUrl}/chapter/${chapter.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 }));
  const blogEntries = posts.map((post) => ({ url: `${siteConfig.siteUrl}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "monthly" as const, priority: 0.5 }));
  return [...routeEntries, ...chapterEntries, ...blogEntries];
}
