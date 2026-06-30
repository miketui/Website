/**
 * Book Gateway e2e verification (plain-node Playwright script).
 *
 * Re-verifies the portable subset of the standalone gateway's 17 checks
 * against the React app. Run with:
 *   E2E_BASE_URL=http://localhost:3100 node tests/e2e/gateway.e2e.mjs
 */

import { chromium } from "playwright";

const BASE = process.env.E2E_BASE_URL || "http://localhost:3100";
const OVERLAY = "#book-gateway";

const results = [];
const consoleErrors = [];
const pageErrors = [];

function record(id, name, pass, detail = "") {
  results.push({ id, name, pass, detail: String(detail) });
}

async function trackedPage(context, label) {
  const page = await context.newPage();
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(`[${label}] ${msg.text()}`);
  });
  page.on("pageerror", (err) => {
    pageErrors.push(`[${label}] ${err.message}`);
  });
  return page;
}

function waitForStatus(page, timeout = 10000) {
  return page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll('[aria-live="polite"]')).some((el) =>
        (el.textContent || "").includes("Homepage revealed")
      ),
    undefined,
    { timeout }
  );
}

function waitForOpenedState(page, timeout = 4000) {
  return page.waitForFunction(
    () => {
      const gw = document.getElementById("book-gateway");
      return !gw || gw.classList.contains("is-opening") || gw.classList.contains("is-entered") || gw.classList.contains("is-revealed");
    },
    undefined,
    { timeout }
  );
}

function waitForCtaArrived(page, timeout = 15000) {
  return page.waitForFunction(
    () => {
      const action = document.querySelector("#book-gateway .gw-action");
      return !!action && Number(getComputedStyle(action).opacity) > 0.5;
    },
    undefined,
    { timeout }
  );
}

async function desktopRun(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await trackedPage(context, "desktop");
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });

    // (a) gateway overlay present at load with loader visible
    try {
      await page.waitForSelector(OVERLAY, { state: "attached", timeout: 15000 });
      const loaderState = await page.evaluate(() => {
        const loader = document.querySelector("#book-gateway .gw-loader");
        if (!loader) return { ok: false, detail: "no loader element" };
        const cs = getComputedStyle(loader);
        return {
          ok: !loader.classList.contains("is-done") && cs.visibility !== "hidden" && Number(cs.opacity) > 0.1,
          detail: `is-done=${loader.classList.contains("is-done")} visibility=${cs.visibility} opacity=${cs.opacity}`
        };
      });
      record("a", "Gateway overlay present at load with loader visible", loaderState.ok, loaderState.detail);
    } catch (err) {
      record("a", "Gateway overlay present at load with loader visible", false, err.message);
    }

    // (b) "Open your mind" button appears, height >= 44px
    let box = null;
    try {
      await page.waitForSelector("#openMind", { state: "visible", timeout: 15000 });
      await waitForCtaArrived(page);
      box = await page.locator("#openMind").boundingBox();
      record("b", "'Open your mind' button appears, height >= 44px", !!box && box.height >= 44, `height=${box ? box.height : "n/a"}px`);
    } catch (err) {
      record("b", "'Open your mind' button appears, height >= 44px", false, err.message);
    }

    // (c) click reveals homepage: opened/fading state, h1 visible, pointer-events none
    try {
      await page.click("#openMind");
      await waitForOpenedState(page);
      const pointerEvents = await page.evaluate(() => {
        const gw = document.getElementById("book-gateway");
        return gw ? getComputedStyle(gw).pointerEvents : "removed";
      });
      await page.waitForSelector("main h1", { state: "visible", timeout: 10000 });
      const pass = pointerEvents === "none" || pointerEvents === "removed";
      record("c", "Click opens the book and reveals the homepage (pointer-events released)", pass, `gateway pointer-events=${pointerEvents}, h1 visible`);
    } catch (err) {
      record("c", "Click opens the book and reveals the homepage (pointer-events released)", false, err.message);
    }

    // (d) aria-live announcement
    try {
      await waitForStatus(page);
      record("d", "aria-live announces 'Homepage revealed. You are inside the book.'", true);
    } catch (err) {
      record("d", "aria-live announces 'Homepage revealed. You are inside the book.'", false, err.message);
    }

    // overlay unmounts after the transition ends
    await page.waitForSelector(OVERLAY, { state: "detached", timeout: 10000 }).catch(() => {});

    // (j) second visit in same context (sessionStorage set) skips the gateway
    try {
      await page.goto(BASE, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("main h1", { state: "visible", timeout: 15000 });
      await page.waitForTimeout(1500);
      const overlayCount = await page.locator(OVERLAY).count();
      record("j", "Second visit (sessionStorage set) skips straight to the homepage", overlayCount === 0, `overlay count after 1.5s = ${overlayCount}`);
    } catch (err) {
      record("j", "Second visit (sessionStorage set) skips straight to the homepage", false, err.message);
    }
  } finally {
    await context.close();
  }
}

async function keyboardRun(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await trackedPage(context, "keyboard");
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#openMind", { state: "attached", timeout: 15000 });
    let focused = false;
    for (let i = 0; i < 40 && !focused; i++) {
      await page.keyboard.press("Tab");
      focused = await page.evaluate(() => document.activeElement && document.activeElement.id === "openMind");
    }
    if (!focused) throw new Error("Tab never reached #openMind");
    await page.keyboard.press("Enter");
    await page.waitForSelector("main h1", { state: "visible", timeout: 10000 });
    await waitForStatus(page);
    record("e", "Keyboard path: Tab reaches #openMind, Enter opens the homepage", true, "focused=#openMind");
  } catch (err) {
    record("e", "Keyboard path: Tab reaches #openMind, Enter opens the homepage", false, err.message);
  } finally {
    await context.close();
  }
}

async function skipRun(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await trackedPage(context, "skip");
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#book-gateway .gw-skip", { state: "attached", timeout: 15000 });
    const started = Date.now();
    await page.click("#book-gateway .gw-skip", { timeout: 10000 });
    await page.waitForFunction(
      () => {
        const gw = document.getElementById("book-gateway");
        return !gw || getComputedStyle(gw).pointerEvents === "none";
      },
      undefined,
      { timeout: 3000 }
    );
    await page.waitForSelector("main h1", { state: "visible", timeout: 3000 });
    await waitForStatus(page, 3000);
    const elapsed = Date.now() - started;
    record("f", "Skip intro jumps straight to a usable homepage quickly", elapsed < 2000, `usable ${elapsed}ms after skip click`);
  } catch (err) {
    record("f", "Skip intro jumps straight to a usable homepage quickly", false, err.message);
  } finally {
    await context.close();
  }
}

async function reducedMotionRun(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await trackedPage(context, "reduced-motion");
  try {
    const started = Date.now();
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    // book present + button usable immediately (no 5s emergence timeline)
    await page.waitForSelector("#openMind", { state: "visible", timeout: 10000 });
    await page.click("#openMind", { timeout: 5000 });
    const clickMs = Date.now() - started;
    await waitForOpenedState(page);
    await page.waitForSelector("main h1", { state: "visible", timeout: 5000 });
    await waitForStatus(page, 5000);
    await page.waitForSelector(OVERLAY, { state: "detached", timeout: 8000 });
    record(
      "g",
      "Reduced motion: CTA usable immediately, homepage reveals via calm crossfade",
      clickMs < 4000,
      `CTA clicked ${clickMs}ms after navigation start; crossfade completed`
    );
  } catch (err) {
    record("g", "Reduced motion: CTA usable immediately, homepage reveals via calm crossfade", false, err.message);
  } finally {
    await context.close();
  }
}

async function mobileRun(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 3
  });
  const page = await trackedPage(context, "mobile");
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(OVERLAY, { state: "attached", timeout: 15000 });
    const noScrollDuring = await page.evaluate(
      () => (document.scrollingElement ? document.scrollingElement.scrollWidth : 0) <= window.innerWidth
    );
    await waitForCtaArrived(page);
    await page.tap("#openMind");
    await page.waitForSelector("main h1", { state: "visible", timeout: 10000 });
    await waitForStatus(page);
    const noScrollAfter = await page.evaluate(
      () => (document.scrollingElement ? document.scrollingElement.scrollWidth : 0) <= window.innerWidth
    );
    record(
      "h",
      "Mobile 390x844: no horizontal scroll, tap opens the book",
      noScrollDuring && noScrollAfter,
      `noScroll gateway=${noScrollDuring}, homepage=${noScrollAfter}`
    );
  } catch (err) {
    record("h", "Mobile 390x844: no horizontal scroll, tap opens the book", false, err.message);
  } finally {
    await context.close();
  }
}

async function main() {
  const browser = await chromium.launch();
  try {
    await desktopRun(browser);
    await keyboardRun(browser);
    await skipRun(browser);
    await reducedMotionRun(browser);
    await mobileRun(browser);
  } finally {
    await browser.close();
  }

  // (i) zero console errors and zero pageerrors across all runs
  const errorCount = consoleErrors.length + pageErrors.length;
  record(
    "i",
    "Zero console errors and zero page errors across all runs",
    errorCount === 0,
    errorCount === 0 ? "" : [...consoleErrors, ...pageErrors].slice(0, 5).join(" | ")
  );

  const order = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  results.sort((x, y) => order.indexOf(x.id) - order.indexOf(y.id));

  const idW = 4;
  const nameW = Math.max(...results.map((r) => r.name.length)) + 2;
  console.log("");
  console.log(`${"#".padEnd(idW)}${"Check".padEnd(nameW)}${"Result".padEnd(8)}Detail`);
  console.log("-".repeat(idW + nameW + 8 + 40));
  for (const r of results) {
    console.log(`${r.id.padEnd(idW)}${r.name.padEnd(nameW)}${(r.pass ? "PASS" : "FAIL").padEnd(8)}${r.detail}`);
  }
  const failed = results.filter((r) => !r.pass);
  console.log("");
  console.log(failed.length === 0 ? `All ${results.length} checks passed.` : `${failed.length}/${results.length} checks FAILED.`);
  if (consoleErrors.length || pageErrors.length) {
    console.log("\nConsole errors:");
    consoleErrors.forEach((e) => console.log(`  ${e}`));
    console.log("Page errors:");
    pageErrors.forEach((e) => console.log(`  ${e}`));
  }
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
