import { readFileSync, globSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Locks the SEO fixes from the 2026-07-27 audit so they cannot silently
 * regress. Each assertion maps to a defect that shipped to production.
 */

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

describe("sitemap contract", () => {
  const sitemap = read("app/sitemap.ts");

  it("excludes redirect routes", () => {
    // These call redirect(); listing them makes Search Console report
    // "Page with redirect" and wastes crawl budget. /order is the PRD
    // conversion terminus and was previously listed.
    for (const route of ['"/order"', '"/author"', '"/chapters"', '"/challenge"', '"/free-chapter"']) {
      expect(sitemap).not.toContain(route);
    }
  });

  it("excludes entitlement-gated routes", () => {
    for (const route of ['"/workbook"', '"/downloads"', '"/dashboard"', '"/resources"']) {
      expect(sitemap).not.toContain(route);
    }
  });

  it("excludes /website, which canonicals to /journey", () => {
    expect(sitemap).not.toContain('"/website"');
    expect(sitemap).toContain('"/journey"');
  });

  it("emits the root without a trailing slash, matching the canonical", () => {
    expect(sitemap).toContain('route === "/" ? siteConfig.siteUrl');
  });

  it("never lists a route whose page declares noIndex", () => {
    // A sitemap entry says "index this"; a noindex meta says "do not".
    // Shipping both is the same class of contradictory signal as listing a
    // redirect. Rather than hardcoding a list that drifts, this reads every
    // page's own pageMetadata() call and cross-checks it against the sitemap.
    const pages = globSync("app/**/page.tsx", { cwd: process.cwd() });
    const offenders: string[] = [];

    for (const page of pages) {
      const source = read(page);
      if (!/noIndex:\s*true/.test(source)) continue;
      // Derive the route from the file path: app/privacy/page.tsx -> /privacy
      const route = `/${page.replace(/^app\//, "").replace(/\/page\.tsx$/, "")}`;
      if (route.includes("[")) continue; // dynamic segments are not listed literally
      if (sitemap.includes(`"${route}"`)) offenders.push(route);
    }

    expect(offenders, `noindex routes present in sitemap.ts: ${offenders.join(", ")}`).toEqual([]);
  });
});

describe("robots contract", () => {
  const robots = read("app/robots.ts");

  it("disallows the entitlement-gated workbook", () => {
    expect(robots).toContain('"/workbook"');
  });

  it("drops the Yandex-only host directive Google ignores", () => {
    expect(robots).not.toMatch(/^\s*host:/m);
  });
});

describe("canonical contract", () => {
  it("root layout sets no blanket canonical", () => {
    // A canonical on the root layout is inherited by every page that does not
    // override it, so any new route added without pageMetadata() would declare
    // itself a duplicate of the homepage. A missing canonical is lintable; a
    // wrong one is invisible.
    const layout = read("app/layout.tsx");
    expect(layout).not.toMatch(/alternates:\s*\{\s*canonical/);
  });

  it("the 404 page is noindex and does not claim to be the homepage", () => {
    const notFound = read("app/not-found.tsx");
    expect(notFound).toContain("pageMetadata(");
    expect(notFound).toContain("noIndex: true");
  });

  it("the gated workbook is noindex", () => {
    expect(read("app/workbook/page.tsx")).toContain("noIndex: true");
  });
});

describe("performance contract", () => {
  it("scrub videos do not eagerly preload multi-megabyte sources", () => {
    // curl-scrub.mp4 is 1.7MB and renders on /book and /about. preload="auto"
    // pulled it before the fold settled on cellular.
    for (const f of ["components/motion/ScrollScrubVideo.tsx", "components/motion/MouseScrubVideo.tsx"]) {
      expect(read(f)).not.toContain('preload="auto"');
    }
  });
});
