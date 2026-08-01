import { describe, expect, it } from "vitest";
import { getLaunchCta } from "@/lib/launch-mode";
import { resolveLaunchOffer } from "@/config/launchState";

/**
 * The CTA renders the resolver's decision. It no longer reads env itself, so
 * the header can no longer advertise a price checkout will not charge.
 */
describe("launch CTA", () => {
  const preorder = resolveLaunchOffer(new Date("2026-01-01T00:00:00Z"));
  const launchWindow = resolveLaunchOffer(new Date("2026-11-25T12:00:00Z"));
  const evergreen = resolveLaunchOffer(new Date("2027-01-01T00:00:00Z"));

  it("shows the preorder price before release", () => {
    expect(getLaunchCta(preorder).label).toBe("Preorder — $17.99");
  });

  it("moves to the regular price once the book has shipped", () => {
    expect(launchWindow.state).toBe("LAUNCH");
    expect(getLaunchCta(launchWindow).label).toBe("Buy the Book — $19.99");
  });

  it("moves to the regular price at evergreen", () => {
    expect(getLaunchCta(evergreen).label).toBe("Buy the Book — $19.99");
  });

  it("routes to the free pricing kit when checkout is paused", () => {
    expect(getLaunchCta({ ...preorder, checkoutPaused: true })).toMatchObject({
      label: "Get the Free Pricing Kit",
      href: "/pricing-kit"
    });
  });
});
