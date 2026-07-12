// a11y-audit.mjs — axe-core (WCAG 2.2 AA) audit via Playwright chromium.
// Loads each target route against a locally running `next start` server and
// reports axe violations. Run with the server up on PORT (default 4321):
//   node scripts/a11y-audit.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core");
const axeSource = readFileSync(axePath, "utf8");

const PORT = process.env.PORT || "4321";
const BASE = `http://localhost:${PORT}`;
const ROUTES = ["/", "/preorder", "/book", "/about", "/pricing-kit", "/daily-directives", "/reset", "/contact"];

const browser = await chromium.launch(
  process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}
);
let total = 0;
const summary = [];

for (const route of ROUTES) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.evaluate(axeSource);
  const results = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] }
    });
  });
  const violations = results.violations;
  total += violations.length;
  summary.push({ route, count: violations.length });
  console.log(`\n=== ${route} — ${violations.length} violation type(s) ===`);
  for (const v of violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
    for (const node of v.nodes.slice(0, 4)) {
      console.log(`      ${node.target.join(" ")}`);
      const snippet = (node.html || "").replace(/\s+/g, " ").slice(0, 140);
      console.log(`      html: ${snippet}`);
    }
  }
  await page.close();
}

console.log("\n===== SUMMARY =====");
for (const s of summary) console.log(`  ${s.route}: ${s.count}`);
console.log(`  TOTAL violation types: ${total}`);
await browser.close();
process.exit(0);
