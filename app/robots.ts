import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/book", "/preorder", "/buy", "/free-chapter", "/chapters", "/chapter/", "/worksheets", "/blog", "/blog/", "/about", "/media-kit", "/faq", "/contact"],
        disallow: ["/admin", "/dashboard", "/downloads", "/bonus-claim", "/login", "/signup", "/thank-you", "/quiz", "/challenge", "/resources", "/api/"]
      }
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
    host: siteConfig.siteUrl
  };
}
