import { createRequire } from "node:module";
import { test, expect } from "@playwright/test";

/**
 * Accessibility gate.
 *
 * axe-core has been a devDependency since the project started and was never
 * imported anywhere (2026-07-27 audit) — the site shipped an /accessibility
 * route with no automated verification behind it. This closes that.
 *
 * Uses the plain `axe-core` bundle injected into the page rather than adding
 * @axe-core/playwright, so no new dependency enters the tree.
 *
 * Scope: WCAG 2.0/2.1 A and AA. Fails on `serious` and `critical` only —
 * `minor`/`moderate` are reported to the console so they stay visible without
 * blocking a launch on cosmetic contrast nits.
 */

const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve("axe-core/axe.min.js");

const COVER_SEEN = { name: "cc_cover_seen", value: "1", url: "http://127.0.0.1:3100" };

// The public surface that converts: funnel entries, product pages, and the
// routes carrying structured data.
const ROUTES = ["/", "/book", "/preorder", "/buy", "/pricing-kit", "/quiz", "/faq", "/blog", "/about", "/contact"];

type AxeNode = { target: string[]; failureSummary?: string };
type AxeViolation = { id: string; impact: string | null; help: string; helpUrl: string; nodes: AxeNode[] };
type AxeResult = { violations: AxeViolation[] };

const BLOCKING = new Set(["serious", "critical"]);

for (const route of ROUTES) {
  test(`a11y: ${route} has no serious or critical violations`, async ({ page, context }) => {
    await context.addCookies([COVER_SEEN]);
    await page.goto(route, { waitUntil: "domcontentloaded" });

    // Motion and the cover reveal settle before the tree is measured.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(500);

    await page.addScriptTag({ path: AXE_PATH });

    const results = (await page.evaluate(async () => {
      // @ts-expect-error injected by addScriptTag
      return await window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
        resultTypes: ["violations"]
      });
    })) as AxeResult;

    const blocking = results.violations.filter((v) => BLOCKING.has(v.impact ?? ""));
    const advisory = results.violations.filter((v) => !BLOCKING.has(v.impact ?? ""));

    if (advisory.length) {
      console.log(`[a11y] ${route} — ${advisory.length} non-blocking: ${advisory.map((v) => `${v.id}(${v.impact})`).join(", ")}`);
    }

    const report = blocking
      .map((v) => {
        const where = v.nodes.slice(0, 3).map((n) => `      ${n.target.join(" ")}`).join("\n");
        return `  [${v.impact}] ${v.id} — ${v.help}\n${where}\n      ${v.helpUrl}`;
      })
      .join("\n\n");

    expect(blocking.length, blocking.length ? `\n${route} accessibility failures:\n\n${report}\n` : "").toBe(0);
  });
}
