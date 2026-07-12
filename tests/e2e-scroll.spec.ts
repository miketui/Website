import { test, expect, devices } from "@playwright/test";

/**
 * Real-input gate for the immersive redesign homepage.
 *
 * Headless Chromium throttles rAF-driven state on synthetic `window.scrollTo`
 * jumps, so scroll-driven UI is exercised with REAL wheel input
 * (`mouse.wheel`); see docs/AUDIT-2026-07-02-ERROR-DOC.md.
 *
 * The cover intro fires once per session (cookie `cc_cover_seen`). Tests seed
 * that cookie so the overlay never intercepts, exactly as a returning visitor
 * sees the site. The previous "Inside the book — three scenes" camera-hold
 * choreography was removed with the homepage rebuild (For Stylists replaced the
 * old block), so those assertions are gone; nav IA, order routing, the
 * scroll-aware header, and reduced-motion safety remain the guarded contract.
 */

const COVER_SEEN = { name: "cc_cover_seen", value: "1", url: "http://127.0.0.1:3100" };
const NAV_IA = ["The Book", "The Journey", "Daily Directives", "Free Pricing Kit", "Preorder"];

test.describe("launch navigation", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([COVER_SEEN]);
  });

  test("desktop nav carries the redesign IA + preorder CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('nav[aria-label="Primary navigation"] a')).toHaveText(NAV_IA);
  });

  test("Preorder CTA routes to the checkout surface", async ({ page }) => {
    await page.goto("/");
    await page.locator('nav[aria-label="Primary navigation"] a', { hasText: "Preorder" }).click();
    await page.waitForURL(/\/(preorder|buy)$/);
    expect(await page.locator("button, a").filter({ hasText: /preorder|checkout|buy/i }).count()).toBeGreaterThan(0);
  });

  test("mobile nav mirrors the same items", async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.context().addCookies([COVER_SEEN]);
    await page.goto("/");
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('nav[aria-label="Mobile navigation"] a')).toHaveText(NAV_IA);
    await page.close();
  });
});

test.describe("scroll-aware header", () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([COVER_SEEN]);
  });

  test("transparent at top, obsidian glass after real scroll", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header.sticky");
    await expect.poll(() => header.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgba(0, 0, 0, 0)");
    await page.mouse.wheel(0, 600);
    await expect
      .poll(() => header.evaluate((el) => getComputedStyle(el).backgroundColor), { timeout: 4000 })
      .toBe("rgba(17, 17, 17, 0.85)");
  });
});

test.describe("immersive homepage", () => {
  test("hero + preorder motion sections render (poster/gradient, CLS-safe)", async ({ page }) => {
    await page.context().addCookies([COVER_SEEN]);
    await page.goto("/");
    // MotionAsset exposes role="img" named from the manifest; the hero is asset A.
    await expect(page.getByRole("img", { name: /hero/i }).first()).toBeVisible();
    await expect(page.locator("#preorder")).toBeVisible();
    await expect(page.locator("#stylists h3")).toHaveCount(3); // three For-Stylists pillars
  });

  test("reduced motion skips the cover intro; homepage is present, not trapped", async ({ browser }) => {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("#cc-cover")).toHaveCount(0);
    await expect(page.locator("#top")).toBeVisible();
    await page.close();
  });
});

test.describe("immersive /website route", () => {
  test("renders the desktop canvas without errors or overflow", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto("/website", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    await expect(page.locator('[data-cinema="on"]')).toBeVisible();
    await expect(page.locator(".cj-canvas")).toBeVisible();
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").filter((entry) => entry.name.includes("/journey-frames/d/")).length)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    expect(errors).toEqual([]);
  });

  test("uses the mobile frame sequence on an iPhone viewport", async ({ browser }) => {
    const page = await browser.newPage({ ...devices["iPhone 13"] });
    await page.goto("/website", { waitUntil: "networkidle" });
    await expect(page.locator('[data-cinema="on"]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => performance.getEntriesByType("resource").filter((entry) => entry.name.includes("/journey-frames/m/")).length)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    await page.close();
  });

  test("keeps the complete static experience when motion is reduced", async ({ browser }) => {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto("/website");
    await expect(page.locator('[data-cinema="on"]')).toHaveCount(0);
    await expect(page.locator(".cj-static")).toBeVisible();
    await expect(page.locator(".cj-static a").last()).toBeVisible();
    await page.close();
  });
});
