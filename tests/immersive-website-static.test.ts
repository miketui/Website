import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

describe("immersive /website experience", () => {
  it("renders the cinematic journey at /website", () => {
    const page = readFileSync(join(root, "app/website/page.tsx"), "utf8");
    expect(page).toContain("<CinematicJourney");
    expect(page).toContain('path: "/website"');
  });

  it("ships a complete performance-budgeted frame sequence", () => {
    const frames = (variant: "d" | "m") =>
      readdirSync(join(root, "public/journey-frames", variant)).filter((name) => /^f-\d{3}\.webp$/.test(name));
    const bytes = (variant: "d" | "m") =>
      frames(variant).reduce((total, name) => total + statSync(join(root, "public/journey-frames", variant, name)).size, 0);

    expect(frames("d")).toHaveLength(90);
    expect(frames("m")).toHaveLength(90);
    expect(bytes("d")).toBeLessThan(5 * 1024 * 1024);
    expect(bytes("m")).toBeLessThan(2 * 1024 * 1024);
    expect(existsSync(join(root, "public/curl-scrub.mp4"))).toBe(true);
  });

  it("keeps immersive motion progressive and accessible", () => {
    const component = readFileSync(join(root, "components/journey/CinematicJourney.tsx"), "utf8");
    expect(component).toContain('prefers-reduced-motion: reduce');
    expect(component).toContain("nav.connection?.saveData");
    expect(component).toContain("nav.deviceMemory < 2");
    expect(component).toContain("const FRAME_COUNT = 90");
    expect(component).toContain("getContext(\"2d\")");
    expect(component).toContain("Ambient particles");
    expect(component).toContain("new window.Image()");
    expect(component).toContain('(max-width: 768px)');
  });
});
