import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { siteConfig } from "@/content/site";

// Inclusion rule: a URL belongs here only if it returns 200 with indexable
// content. Three categories are deliberately absent.
//
// 1. Redirect routes. /order, /author, /chapters, /challenge, /free-chapter,
//    and /chapter/[slug] all call redirect(). Listing a redirecting URL makes
//    Search Console report "Page with redirect" and burns crawl budget.
//    /order in particular is the PRD conversion terminus — campaigns still
//    point at it and robots.txt still allows it, so link equity passes through
//    the redirect; it just must not be advertised as a destination.
// 2. Gated routes. /workbook, /downloads, /dashboard, /resources are
//    entitlement- or session-gated (see lib/route-policy.ts + proxy.ts).
//    Members-only content stays out of the index.
// 3. Duplicates. /website is a campaign alias rendering the same
//    CinematicJourney component as /journey; only /journey is listed, and
//    /website canonicals to it.
//
// Blog stays public: it's the organic-search acquisition surface. Funnel
// entries (/quiz, /pricing-kit) are indexed landing targets per PRD v2 §3.2 —
// present here, absent from primary nav.

// 4. noindex routes. A sitemap entry says "index this"; a noindex meta says
//    "do not". Shipping both is a contradictory signal, the same defect as
//    listing a redirect. Every page below emits `index, follow`.
//
//    Deliberately excluded on this ground: the policy pages (/privacy, /terms,
//    /cookies, /refund-policy, /preorder-policy, /digital-delivery-policy,
//    /accessibility) plus /worksheets and /media-kit — all carry an authored
//    `noIndex: true` in their pageMetadata() call. /worksheets and /media-kit
//    were listed here while noindex before this change.
//
//    If any of those should be indexed — policy pages are a reasonable trust
//    signal for a commerce site — flip `noIndex` in the page first, then add
//    the route here. The two must be changed together.

const primaryRoutes = ["/", "/book", "/preorder", "/buy", "/pricing-kit", "/daily-directives", "/subscribe", "/reset", "/quiz", "/journey", "/blog", "/about", "/faq", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const primaryEntries = primaryRoutes.map((route) => ({
    // Root is emitted WITHOUT a trailing slash to match the homepage canonical
    // byte for byte. Next normalizes metadata URLs under trailingSlash:false,
    // so the emitted canonical is the bare origin; a bare origin and
    // origin+slash are two different URL strings to a crawler.
    url: route === "/" ? siteConfig.siteUrl : `${siteConfig.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "/" ? 1 : 0.7
  }));
  const blogEntries = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));
  return [...primaryEntries, ...blogEntries];
}
