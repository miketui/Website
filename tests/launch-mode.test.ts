import { describe, expect, it } from "vitest";
import { getLaunchCta, type LaunchMode } from "@/lib/launch-mode";

describe("launch mode CTA", () => {
  it.each([
    ["preorder", "Preorder — $17.99"],
    ["launched", "Buy the Book — $19.99"],
    ["paused", "Get the Free Pricing Kit"]
  ] as Array<[LaunchMode, string]>)("switches %s copy", (mode, label) => {
    expect(getLaunchCta(mode).label).toBe(label);
  });
});
