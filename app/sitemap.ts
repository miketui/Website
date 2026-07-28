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
//    Still excluded on this ground: /worksheets, which keeps an authored
//    `noIndex: true` in its pageMetadata() call.
//
//    The policy pages and /media-kit were noindex until 2026-07-28, when the
//    owner made them indexable: visible policy pages are a standard trust
//    signal for a site taking payments, and a media kit exists to be found by
//    press. Their `noIndex` flags were removed in the same change that added
//    them below — tests/seo-contract.test.ts fails if the two ever drift apart.

const primaryRoutes = ["/", "/book", "/preorder", "/buy", "/pricing-kit", "/daily-directives", "/subscribe", "/reset", "/quiz", "/journey", "/blog", "/about", "/faq", "/contact"];

// Indexable, but not acquisition surfaces. Split out so they carry a lower
// priority and a yearly change frequency — legal text is stable, and letting
// it compete with /book or /preorder for crawl attention would be backwards.
const secondaryRoutes = ["/privacy", "/terms", "/cookies", "/refund-policy", "/preorder-policy", "/digital-delivery-policy", "/accessibility", "/media-kit"];

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
  const secondaryEntries = secondaryRoutes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3
  }));
  const blogEntries = posts.map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.5
  }));
  return [...primaryEntries, ...secondaryEntries, ...blogEntries];
}
