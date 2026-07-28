import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

/**
 * `allow` keeps the redirect aliases (/order, /author, /challenge) crawlable
 * on purpose: they carry inbound campaign and legacy links, and letting Google
 * follow the redirect passes equity to the real destination. They are absent
 * from sitemap.xml — crawlable, not advertised.
 *
 * `disallow` covers everything gated or non-indexable: admin, session-gated
 * surfaces, entitlement-gated deliverables (/workbook, /downloads), the quiz
 * result permalinks, and the API. /workbook was added 2026-07-27 — it renders
 * the purchased workbook itself behind a server-side entitlement check and
 * must never be indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/book", "/order", "/preorder", "/buy", "/pricing-kit", "/daily-directives", "/worksheets", "/blog", "/blog/", "/about", "/author", "/media-kit", "/faq", "/contact", "/quiz", "/challenge", "/journey"],
        disallow: ["/admin", "/dashboard", "/downloads", "/workbook", "/bonus-claim", "/login", "/signup", "/thank-you", "/quiz/results/", "/resources", "/api/"]
      }
    ],
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`
    // `host` intentionally dropped: it is a Yandex-only directive that Google
    // has never supported and now ignores outright.
  };
}
