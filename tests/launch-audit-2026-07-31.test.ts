import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  LAUNCH_WINDOW_DAYS,
  RELEASE_TIMEZONE,
  getLaunchState,
  releaseInstant,
  resolveLaunchOffer
} from "@/config/launchState";
import { priceConfig } from "@/content/book";
import { siteConfig } from "@/content/site";
import { summarizeLeadIntake } from "@/lib/lead-intake";

const repoFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

/**
 * Regression locks for the P0 findings in the 2026-07-31 launch-readiness
 * audit. Each block names the defect it prevents from returning; a failure
 * here means a launch blocker has been reintroduced, not that a test is fussy.
 */

describe("P0.3 — one launch state, price, date, and timezone", () => {
  it("resolves the release instant in America/Los_Angeles, not UTC", () => {
    // Midnight Pacific on 2026-11-24 is 08:00 UTC (PST, UTC-8). Deriving it as
    // `${date}T00:00:00Z` flipped every price and CTA at 4:00 p.m. Pacific on
    // November 23 — buyers would have seen launch pricing a day early.
    expect(RELEASE_TIMEZONE).toBe("America/Los_Angeles");
    expect(releaseInstant().toISOString()).toBe("2026-11-24T08:00:00.000Z");
  });

  it("is still PREORDER at 4:00 p.m. Pacific the day before release", () => {
    // This literal stays absolute on purpose: `${date}T00:00:00Z` is exactly
    // the value the old UTC-based code used as the release instant. Asserting
    // it is STILL preorder is the regression itself, and deriving it from
    // releaseInstant() would erase what the test is checking.
    expect(getLaunchState(new Date("2026-11-24T00:00:00Z"))).toBe("PREORDER");
    expect(getLaunchState(new Date(releaseInstant().getTime() - 60_000))).toBe("PREORDER");
  });

  it("flips to LAUNCH exactly at the Pacific release instant", () => {
    expect(getLaunchState(releaseInstant())).toBe("LAUNCH");
  });

  it("displays the same price tier that Stripe will charge", () => {
    // The audit's decisive money-path defect: the UI read LAUNCH_STATE while
    // checkout read the legacy LAUNCH_MODE, so the site could show one price
    // and Stripe resolve another. Both now come from this one object.
    for (const now of [new Date("2026-06-01T00:00:00Z"), new Date("2026-11-25T00:00:00Z"), new Date("2027-03-01T00:00:00Z")]) {
      const offer = resolveLaunchOffer(now);
      const expected = offer.priceTier === "preorder" ? priceConfig.preorderDirect : priceConfig.regularDirect;
      expect(offer.amountDollars).toBe(expected.amount);
      expect(offer.amountCents).toBe(expected.cents);
      expect(offer.priceLabel).toBe(`$${expected.amount.toFixed(2)}`);
    }
  });

  it("charges $17.99 only while preordering (owner decision, 2026-08-01)", () => {
    const preorder = resolveLaunchOffer(new Date("2026-06-01T00:00:00Z"));
    expect(preorder.state).toBe("PREORDER");
    expect(preorder.priceTier).toBe("preorder");
    expect(preorder.amountDollars).toBe(17.99);
  });

  it("moves to $19.99 at the release instant, not 14 days later", () => {
    // The discount ends when the book ships. LAUNCH_WINDOW_DAYS shapes badges
    // and urgency copy only — it must never move the price.
    //
    // Offsets are derived from releaseInstant() so this survives a RELEASE_DATE
    // change. The absolute value of that instant is pinned once, in the
    // timezone test above — asserting it again here would only duplicate the
    // conversion math, and deriving it there would make that test tautological.
    const release = releaseInstant().getTime();

    const oneMinuteBefore = resolveLaunchOffer(new Date(release - 60_000));
    expect(oneMinuteBefore.priceTier).toBe("preorder");
    expect(oneMinuteBefore.amountDollars).toBe(17.99);

    const atRelease = resolveLaunchOffer(new Date(release));
    expect(atRelease.state).toBe("LAUNCH");
    expect(atRelease.priceTier).toBe("regular");
    expect(atRelease.amountDollars).toBe(19.99);
  });

  it("stays at $19.99 through the launch window and into evergreen", () => {
    for (const iso of ["2026-11-30T00:00:00Z", "2026-12-20T00:00:00Z"]) {
      const offer = resolveLaunchOffer(new Date(iso));
      expect(offer.priceTier).toBe("regular");
      expect(offer.amountDollars).toBe(19.99);
    }
  });

  it("has no surface still promising the retired launch-window discount", () => {
    // Fixing /buy alone left five surfaces — including the welcome email and
    // the Book/Product JSON-LD — telling buyers $17.99 held for 15 days after
    // release while checkout charged $19.99 from the release instant. A price
    // promise in an email or in structured data is as binding as one on a
    // page, and is far easier to miss.
    const surfaces = [
      "app/buy/page.tsx",
      "app/preorder/page.tsx",
      "app/thank-you/page.tsx",
      "components/PreorderCheckout.tsx",
      "lib/email/resend.ts",
      "lib/schema.ts"
    ];
    for (const surface of surfaces) {
      const source = repoFile(surface);
      expect(source, `${surface} still promises a post-release discount window`).not.toMatch(
        /fifteen days|days after release|holds through/i
      );
    }
  });

  it("advertises the resolver's price in structured data, not a hardcoded tier", () => {
    const schema = repoFile("lib/schema.ts");
    expect(schema).toContain("resolveLaunchOffer");
    // priceValidUntil was RELEASE_DATE + 15 days, a rule that no longer exists.
    expect(schema).not.toContain("tierFlipDate");
  });

  it("prices the workbook from its own SKU, never from the book's price", () => {
    // The workbook is a separate Stripe price (STRIPE_PRICE_ID_WORKBOOK) that
    // happens to equal the book's regular price today — so copy derived from
    // priceConfig.regularDirect would silently follow a book price change.
    expect(priceConfig.workbook.amount).toBe(19.99);
    expect(repoFile("lib/cart.tsx")).toContain("priceConfig.workbook.amount");
    expect(repoFile("app/buy/page.tsx")).toContain("priceConfig.workbook.amount");
  });

  it("states the launch window length exactly once", () => {
    // Code and copy disagreed (14 vs 15 days) and neither could be called
    // authoritative. Every surface now renders LAUNCH_WINDOW_DAYS.
    expect(LAUNCH_WINDOW_DAYS).toBe(14);
    expect(repoFile("app/buy/page.tsx")).not.toContain("fifteen days");
  });

  it("keeps checkout off the legacy launch-mode resolver", () => {
    const checkout = repoFile("app/api/checkout/route.ts");
    expect(checkout).toContain("resolveLaunchOffer");
    expect(checkout).not.toContain("getLaunchMode");
    expect(repoFile("lib/stripe.ts")).not.toContain("getLaunchMode");
  });
});

describe("P0.4 — the gifted workbook can never be charged", () => {
  it("gifts the workbook during preorder and sells it afterwards", () => {
    expect(resolveLaunchOffer(new Date("2026-06-01T00:00:00Z")).workbookIncludedFree).toBe(true);
    // "paid post-launch" (AGENTS.md): the launch window keeps preorder pricing
    // while the workbook is already a paid product again. price_tier is
    // therefore NOT a valid proxy for gift eligibility.
    expect(resolveLaunchOffer(new Date("2026-11-30T00:00:00Z")).workbookIncludedFree).toBe(false);
    expect(resolveLaunchOffer(new Date("2027-03-01T00:00:00Z")).workbookIncludedFree).toBe(false);
  });

  it("drops the workbook line item server-side, before Stripe is called", () => {
    const checkout = repoFile("app/api/checkout/route.ts");
    // The deletion must happen before the workbook line item is built, so no
    // request shape — stale cart, direct POST, second tab — can slip past it.
    const gate = checkout.indexOf('skus.delete("workbook")');
    const lineItem = checkout.indexOf('if (skus.has("workbook"))');
    expect(gate).toBeGreaterThan(-1);
    expect(lineItem).toBeGreaterThan(gate);
    expect(checkout).toContain("offer.workbookIncludedFree");
  });

  it("grants the gift from the server's own flag, with a replay-safe fallback", () => {
    const webhook = repoFile("app/api/stripe/webhook/route.ts");
    expect(webhook).toContain('session.metadata?.workbook_gift === "true"');
    // Sessions created before the flag existed must still be fulfilled.
    expect(webhook).toContain("session.metadata?.workbook_gift === undefined");
  });

  it("does not upsell a product the order already includes", () => {
    expect(repoFile("components/nav/CartDrawer.tsx")).toContain("cart.workbookGifted");
  });
});

describe("P0.5 — payment fulfillment is checked work", () => {
  const webhook = repoFile("app/api/stripe/webhook/route.ts");

  it("fails the event when the order row does not land", () => {
    // The upsert used to discard its error and fall through to `if (order?.id)`,
    // which is falsy on failure: every entitlement was skipped, the response
    // was 200, and the event was stamped processed. Paid, no access, forever.
    expect(webhook).toContain("orderError");
    expect(webhook).toContain("Order write failed for session");
  });

  it("fails the event when both book-entitlement writes fail", () => {
    expect(webhook).toContain("legacyBookError");
    expect(webhook).toContain("Book entitlement failed for order");
  });

  it("fails the refund when revocation does not land", () => {
    expect(webhook).toContain("revokeError");
    expect(webhook).toContain('reason: "revoke_failed"');
    expect(webhook).toContain('reason: "order_lookup_failed"');
  });
});

describe("P0.6 — launch delivery is idempotent", () => {
  const fulfillment = repoFile("lib/launch-fulfillment.ts");

  it("claims the send before calling the email provider", () => {
    // Sending first and stamping afterwards meant a failed stamp produced a
    // reported success with the row still eligible — and the cron runs hourly.
    const claim = fulfillment.indexOf('.is("launch_email_sent_at", null)');
    const send = fulfillment.indexOf("await sendLaunchDelivery");
    expect(claim).toBeGreaterThan(-1);
    expect(send).toBeGreaterThan(claim);
  });

  it("releases the claim when the provider rejects the send", () => {
    expect(fulfillment).toContain("launch_email_sent_at: null");
    expect(fulfillment).toContain('.eq("launch_email_sent_at", claimedAt)');
  });

  it("refuses to send when there is no row that could record the send", () => {
    expect(fulfillment).toContain('reason: "missing_purchase_id"');
  });

  it("treats a failed audit write as a failed job", () => {
    expect(fulfillment).toContain("audit_write_failed_after_send");
  });

  it("never retries a buyer whose email already left", () => {
    const cron = repoFile("app/api/cron/launch-day/route.ts");
    expect(cron).toContain("emailAlreadyLeft");
  });
});

describe("P0.8 — forms cannot report success without a system of record", () => {
  it("fails when nothing durable accepted the lead", () => {
    const result = summarizeLeadIntake(
      [
        { system: "mailerlite:pricing_kit", accepted: false, detail: "config_missing" },
        { system: "supabase:magnet_leads", accepted: false, detail: "config_missing" }
      ],
      "mailerlite:pricing_kit"
    );
    expect(result.accepted).toBe(false);
    expect(result.delivery).toBe("delivery_failed");
    expect(result.failures).toHaveLength(2);
  });

  it("reports pending — not sent — when only storage accepted", () => {
    const result = summarizeLeadIntake(
      [
        { system: "mailerlite:pricing_kit", accepted: false, detail: "provider_error" },
        { system: "supabase:magnet_leads", accepted: true }
      ],
      "mailerlite:pricing_kit"
    );
    expect(result.accepted).toBe(true);
    expect(result.delivery).toBe("recorded_pending_delivery");
    expect(result.systemsOfRecord).toEqual(["supabase:magnet_leads"]);
  });

  it("reports delivered only when the delivery system accepted", () => {
    const result = summarizeLeadIntake([{ system: "mailerlite:pricing_kit", accepted: true }], "mailerlite:pricing_kit");
    expect(result.delivery).toBe("delivered");
  });

  it("returns a non-2xx from every lead endpoint on total failure", () => {
    for (const route of ["app/api/subscribe/route.ts", "app/api/pricing-kit/route.ts", "app/api/quiz/route.ts", "app/api/contact/route.ts"]) {
      const source = repoFile(route);
      expect(source, `${route} must gate its success response`).toContain("LEAD_INTAKE_FAILED_STATUS");
      expect(source, `${route} must not report success unconditionally`).toContain("if (!intake.accepted)");
    }
  });

  it("agrees with the front end on delivery state names", () => {
    // The pricing-kit form compared against "email_sent", which the API has
    // never returned — so every visitor got the pending page regardless.
    const form = repoFile("components/PricingKitForm.tsx");
    expect(form).toContain('json.delivery === "delivered"');
    expect(form).not.toContain("email_sent");
    expect(form).toContain("delivery_failed");
  });
});

describe("P0.1 — deployability", () => {
  it("ships the production start script operational tooling expects", () => {
    const pkg = JSON.parse(repoFile("package.json"));
    expect(pkg.scripts.start).toBe("next start");
  });

  it("strips a trailing slash from the site URL used for Stripe redirects", async () => {
    const previous = process.env.NEXT_PUBLIC_SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://curlscontemplation.beauty/";
    try {
      // Imported fresh so the module reads the value set above.
      const { getSiteUrl } = await import("@/lib/env");
      expect(getSiteUrl().endsWith("/")).toBe(false);
    } finally {
      if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
      else process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  });

  it("keeps the release date on the locked launch day", () => {
    expect(siteConfig.releaseDate).toBe("2026-11-24");
  });
});
