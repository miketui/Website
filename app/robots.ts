import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/book", "/order", "/preorder", "/buy", "/free-chapter", "/chapters", "/chapter/", "/worksheets", "/blog", "/blog/", "/about", "/author", "/media-kit", "/faq", "/contact", "/quiz", "/challenge", "/journey"],
        disallow: ["/admin", "/dashboard", "/downloads", "/bonus-claim", "/login", "/signup", "/thank-you", "/quiz/results/", "/resources", "/api/"]
      }
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl
  };
}
