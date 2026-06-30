import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { decorativeMotionExcludedPrefixes, isDecorativeMotionExcludedRoute } from "@/lib/route-policy";
import { shouldDisableCurlTrail } from "@/lib/motion-policy";

describe("immersive motion safety", () => {
  it("disables curl cursor for reduced motion", () => {
    expect(shouldDisableCurlTrail("/", true)).toBe(true);
  });

  it.each(["/login", "/signup", "/buy", "/dashboard", "/downloads", "/admin", "/privacy", "/terms", "/accessibility"])("disables decorative motion on %s", (pathname) => {
    expect(isDecorativeMotionExcludedRoute(pathname)).toBe(true);
    expect(shouldDisableCurlTrail(pathname, false)).toBe(true);
  });

  it("keeps public editorial routes eligible for tasteful motion", () => {
    expect(decorativeMotionExcludedPrefixes).not.toContain("/book");
    expect(shouldDisableCurlTrail("/book", false)).toBe(false);
  });

  it("curl trail uses a non-interactive overlay, fine pointer gate and reduced-motion gate", () => {
    const source = readFileSync(join(process.cwd(), "components/CurlTrail.tsx"), "utf8");
    expect(source).toContain('pointerEvents: "none"');
    expect(source).toContain("(hover: hover) and (pointer: fine)");
    expect(source).toContain("(prefers-reduced-motion: reduce)");
    expect(source).toContain("requestAnimationFrame");
    expect(source).toContain("createElementNS");
  });

  it("magnetic CTA includes focus-visible and reduced-motion fallback", () => {
    const source = readFileSync(join(process.cwd(), "components/motion/MagneticCurlButton.tsx"), "utf8");
    expect(source).toContain("focus-visible:ring-2");
    expect(source).toContain("useReducedMotion");
    expect(source).toContain("disabled");
  });
});
