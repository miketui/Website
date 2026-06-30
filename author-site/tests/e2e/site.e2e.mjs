/**
 * Full-site E2E sweep (plain-node Playwright).
 * Usage: build + start the app, then `E2E_BASE_URL=http://localhost:3100 node tests/e2e/site.e2e.mjs`
 * Covers: every public route renders with an h1 and zero console/page errors,
 * Funnel 1 happy path in sandbox mode, graceful checkout fallback, mobile
 * 390x844 overflow checks, reduced-motion context, desktop 1440x900.
 */
import { chromium } from "playwright";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3100";
const results = [];
const check = (name, pass, detail = "") => {
  results.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"} · ${name}${detail ? ` — ${detail}` : ""}`);
};

const routes = [
  "/", "/book", "/preorder", "/buy", "/free-chapter", "/thank-you", "/chapters",
  "/chapter/creative-excellence", "/blog", "/resources", "/worksheets", "/about",
  "/media-kit", "/faq", "/contact", "/quiz", "/quiz/results/underpriced-artist",
  "/challenge", "/privacy", "/terms", "/refund-policy", "/accessibility",
  "/login", "/signup", "/downloads", "/dashboard"
];

const browser = await chromium.launch();

// --- Desktop sweep: every route, console clean, h1 present -----------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  for (const route of routes) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    const status = res?.status() ?? 0;
    const h1 = await page.locator("h1").count();
    check(`route ${route}`, status === 200 && h1 >= 1 && errors.length === 0,
      `status=${status} h1=${h1} consoleErrors=${errors.length}${errors.length ? ` [${errors[0]}]` : ""}`);
    await page.close();
  }
  await ctx.close();
}

// --- Funnel 1 happy path (sandbox: providers skip, API still returns ok) ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/free-chapter`, { waitUntil: "networkidle" });
  await page.evaluate(() => sessionStorage.setItem("curls-gateway-seen", "1"));
  await page.fill("#free-chapter-email", "e2e-test@example.com");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/thank-you", { timeout: 15000 }).catch(() => {});
  check("funnel1 free-chapter → thank-you pivot", page.url().includes("/thank-you"), page.url());
  const cta = page.locator('a[href="/preorder"]', { hasText: "17.99" }).first();
  check("thank-you pivot shows preorder CTA at $17.99", (await cta.count()) > 0);
  const tierFlip = await page.getByText("$19.99").count();
  check("thank-you pivot carries honest tier-flip line", tierFlip > 0);
  await page.close();
  await ctx.close();
}

// --- Checkout graceful fallback without Stripe keys ------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/preorder`, { waitUntil: "networkidle" });
  const bump = page.locator('input[name="card-deck"]');
  check("preorder shows $7.99 card-deck order bump", (await bump.count()) === 1);
  await bump.check();
  await page.click('form button[type="submit"]');
  const alert = page.locator('[role="alert"]');
  await alert.waitFor({ timeout: 10000 }).catch(() => {});
  const alertText = (await alert.count()) ? await alert.first().textContent() : "";
  check("checkout without keys fails gracefully (no crash, honest message)", Boolean(alertText && alertText.length > 10), alertText?.slice(0, 60) ?? "");
  await page.close();
  await ctx.close();
}

// --- Mobile 390x844: no horizontal overflow on key pages -------------------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  for (const route of ["/", "/free-chapter", "/preorder", "/thank-you", "/book", "/quiz"]) {
    const page = await ctx.newPage();
    if (route === "/") await page.addInitScript(() => sessionStorage.setItem("curls-gateway-seen", "1"));
    await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth);
    check(`mobile ${route} no horizontal scroll`, overflow <= 0, `overflowPx=${overflow}`);
    await page.close();
  }
  await ctx.close();
}

// --- Reduced motion context -------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const h1 = await page.locator("h1").count();
  check("reduced-motion homepage renders clean", h1 >= 1 && errors.length === 0, `h1=${h1} errors=${errors.length}`);
  await page.close();
  await ctx.close();
}

// --- API health -------------------------------------------------------------
{
  const ctx = await browser.newContext();
  const res = await ctx.request.get(`${BASE}/api/health`);
  check("/api/health responds 200", res.status() === 200, `status=${res.status()}`);
  await ctx.close();
}

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("FAILED:", failed.map((f) => f.name).join("; "));
  process.exit(1);
}
