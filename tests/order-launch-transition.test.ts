import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getLaunchState, daysToRelease } from "@/config/launchState";
import { siteConfig } from "@/content/site";

/**
 * Guards the launch-morning failure documented in the 2026-07-27 audit.
 *
 * /order is the stable conversion terminus — every campaign, email, and nav
 * link points at it. It redirects to /preorder or /buy based on the launch
 * state, which is date-derived whenever NEXT_PUBLIC_LAUNCH_STATE is unset.
 *
 * Under `export const dynamic = "force-static"` that redirect target was
 * frozen at build time: on launch morning /order would have kept routing
 * buyers to preorder pricing until someone redeployed. These tests fail if
 * either half of that regresses — the state machine or the render mode.
 */

const RELEASE = new Date(`${siteConfig.releaseDate}T00:00:00Z`);
const DAY = 86_400_000;
const at = (offsetDays: number) => new Date(RELEASE.getTime() + offsetDays * DAY);

describe("/order launch transition", () => {
  const saved = {
    state: process.env.NEXT_PUBLIC_LAUNCH_STATE,
    mode: process.env.NEXT_PUBLIC_LAUNCH_MODE
  };

  beforeEach(() => {
    // Exercise the date-derived fallback — the configuration the site is
    // expected to run in, and the one the launch-day flip depends on.
    delete process.env.NEXT_PUBLIC_LAUNCH_STATE;
    delete process.env.NEXT_PUBLIC_LAUNCH_MODE;
  });

  afterEach(() => {
    if (saved.state === undefined) delete process.env.NEXT_PUBLIC_LAUNCH_STATE;
    else process.env.NEXT_PUBLIC_LAUNCH_STATE = saved.state;
    if (saved.mode === undefined) delete process.env.NEXT_PUBLIC_LAUNCH_MODE;
    else process.env.NEXT_PUBLIC_LAUNCH_MODE = saved.mode;
  });

  it("is PREORDER the day before release", () => {
    expect(getLaunchState(at(-1))).toBe("PREORDER");
  });

  it("flips to LAUNCH on release day", () => {
    expect(getLaunchState(at(0))).toBe("LAUNCH");
  });

  it("stays LAUNCH one day after release", () => {
    expect(getLaunchState(at(1))).toBe("LAUNCH");
  });

  it("settles to EVERGREEN after the 14-day launch window", () => {
    expect(getLaunchState(at(15))).toBe("EVERGREEN");
  });

  it("routes to /preorder before release and /buy from release day onward", () => {
    const target = (now: Date) => (getLaunchState(now) === "PREORDER" ? "/preorder" : "/buy");
    expect(target(at(-1))).toBe("/preorder");
    expect(target(at(0))).toBe("/buy");
    expect(target(at(30))).toBe("/buy");
  });

  it("counts down to zero across the boundary", () => {
    expect(daysToRelease(at(-1))).toBeGreaterThan(0);
    expect(daysToRelease(at(1))).toBeLessThanOrEqual(0);
  });
});

describe("/order render mode", () => {
  const source = readFileSync(resolve(process.cwd(), "app/order/page.tsx"), "utf8");

  it("is not force-static — the redirect target must resolve per request", () => {
    expect(source).not.toMatch(/dynamic\s*=\s*["']force-static["']/);
  });

  it("declares force-dynamic explicitly", () => {
    expect(source).toMatch(/dynamic\s*=\s*["']force-dynamic["']/);
  });
});
