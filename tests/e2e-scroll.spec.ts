import { test, expect, type Page } from "@playwright/test";

/**
 * Scroll-choreography gate (real-input probe).
 *
 * Headless Chromium throttles rAF-driven state on synthetic `window.scrollTo`
 * jumps — scroll-driven UI reads one interaction stale. Every assertion here
 * therefore drives REAL wheel input (`mouse.wheel`); see
 * docs/AUDIT-2026-07-02-ERROR-DOC.md (addendum). This spec exists because a
 * static-gate-green build shipped a scene-ghosting bug that only a real-input
 * probe caught.
 */

const HOLD = 'section[aria-label="Inside the book — three scenes"]';

async function sceneOpacities(page: Page) {
  return page.evaluate((sel) => {
    const figs = [...document.querySelectorAll(`${sel} figure`)];
    return figs.map((f) => Number(getComputedStyle(f).opacity));
  }, HOLD);
}

test.describe("launch navigation", () => {
  test("desktop nav carries the five-item launch IA with aria-current", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator('nav[aria-label="Primary navigation"] a');
    await expect(nav).toHaveText(["Home", "About the Book", "About the Author", "Order", "Contact"]);
    await expect(page.locator('nav[aria-label="Primary navigation"] a[aria-current="page"]')).toHaveText("Home");
  });

  test("Order routes to the preorder checkout", async ({ page }) => {
    await page.goto("/");
    await page.locator('nav[aria-label="Primary navigation"] a', { hasText: "Order" }).click();
    await page.waitForURL("**/preorder");
    expect(await page.locator("button, a").filter({ hasText: /preorder|checkout/i }).count()).toBeGreaterThan(0);
  });

  test("mobile nav mirrors the same five items", async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("/");
    await page.locator('button[aria-label="Open menu"]').click();
    await expect(page.locator('nav[aria-label="Mobile navigation"] a')).toHaveText([
      "Home",
      "About the Book",
      "About the Author",
      "Order",
      "Contact"
    ]);
    await page.close();
  });
});

test.describe("scroll-aware header", () => {
  test("transparent at top, obsidian glass after real scroll", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header.sticky");
    await expect
      .poll(() => header.evaluate((el) => getComputedStyle(el).backgroundColor))
      .toBe("rgba(0, 0, 0, 0)");
    await page.mouse.wheel(0, 600);
    await expect
      .poll(() => header.evaluate((el) => getComputedStyle(el).backgroundColor), { timeout: 4000 })
      .toBe("rgba(17, 17, 17, 0.85)");
  });
});

test.describe("editorial camera-hold choreography", () => {
  test("scenes hand over 1→2→3 with no re-entry ghosting", async ({ page }) => {
    await page.goto("/");
    // Locate the track's absolute top at rest, then approach with real input.
    const top = await page.evaluate((sel) => {
      const el = document.querySelector(sel)!;
      return el.getBoundingClientRect().top + window.scrollY;
    }, HOLD);
    await page.evaluate((y) => window.scrollTo({ top: y - 200, behavior: "instant" }), top);
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(300);

    const peaks = [0, 0, 0];
    let scene3PeakedAt = -1;
    const samples: number[][] = [];
    for (let i = 0; i < 16; i++) {
      await page.mouse.wheel(0, 110);
      await page.waitForTimeout(220);
      const ops = await sceneOpacities(page);
      samples.push(ops);
      ops.forEach((o, s) => {
        peaks[s] = Math.max(peaks[s], o);
      });
      if (scene3PeakedAt < 0 && ops[2] > 0.9) scene3PeakedAt = i;
      // The hard regression assertion: once scene 3 owns the frame, scenes 1
      // and 2 must be gone and stay gone (the ghosting bug this spec exists for).
      if (scene3PeakedAt >= 0 && i > scene3PeakedAt) {
        expect.soft(ops[0], `scene 1 re-entered at step ${i}: ${JSON.stringify(samples)}`).toBeLessThan(0.05);
        expect.soft(ops[1], `scene 2 re-entered at step ${i}: ${JSON.stringify(samples)}`).toBeLessThan(0.05);
      }
    }
    // Every scene must have owned the frame at some point.
    expect(peaks[0], `scene 1 never presented: ${JSON.stringify(samples)}`).toBeGreaterThan(0.9);
    expect(peaks[1], `scene 2 never presented: ${JSON.stringify(samples)}`).toBeGreaterThan(0.9);
    expect(peaks[2], `scene 3 never presented: ${JSON.stringify(samples)}`).toBeGreaterThan(0.9);
  });

  test("reduced motion renders static stacked panels, no sticky pin", async ({ browser }) => {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator(`${HOLD} figure`)).toHaveCount(3);
    await expect(page.locator(`${HOLD} .sticky`)).toHaveCount(0);
    await page.close();
  });
});
