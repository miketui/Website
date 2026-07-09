// mobile-qa.mjs — horizontal-overflow + tap-target check at 375/390/430.
import { chromium } from "playwright";

const PORT = process.env.PORT || "4321";
const BASE = `http://localhost:${PORT}`;
const ROUTES = ["/", "/preorder"];
const WIDTHS = [375, 390, 430];

const browser = await chromium.launch(
  process.env.CHROME_BIN ? { executablePath: process.env.CHROME_BIN } : {}
);

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const info = await page.evaluate((vw) => {
      const doc = document.documentElement;
      const scrollW = doc.scrollWidth;
      const overflow = scrollW > vw + 1;
      // Find elements wider than viewport (overflow culprits).
      const wide = [];
      document.querySelectorAll("*").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > vw + 1 && r.right > vw + 1 && r.left >= -1) {
          wide.push(`${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} w=${Math.round(r.width)}`);
        }
      });
      // Tap targets: interactive elements smaller than 44x44.
      const small = [];
      document.querySelectorAll("a,button,input,select,textarea,[role=button]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return; // hidden
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") return;
        if ((r.height < 44 || r.width < 44)) {
          const label = (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 30);
          small.push(`${el.tagName.toLowerCase()} "${label}" ${Math.round(r.width)}x${Math.round(r.height)}`);
        }
      });
      return { scrollW, overflow, wide: wide.slice(0, 8), small: small.slice(0, 12), smallCount: small.length };
    }, width);
    console.log(`\n=== ${route} @ ${width}px === scrollW=${info.scrollW} overflow=${info.overflow}`);
    if (info.wide.length) console.log("  WIDE:", info.wide.join(" | "));
    if (info.smallCount) console.log(`  SMALL TAP TARGETS (${info.smallCount}):`, info.small.join(" | "));
    else console.log("  tap targets OK");
    await page.close();
  }
}
await browser.close();
process.exit(0);
