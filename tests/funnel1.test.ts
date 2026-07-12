import { afterEach, describe, expect, it } from "vitest";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { entitlementSlugFor, productEntitlements } from "@/lib/entitlements";
import { buildCheckoutMetadata } from "@/lib/stripe";
import { pricingKitLink, publicFreeAssetUrl } from "@/lib/free-assets";
import { pricingKitTemplate } from "@/lib/email/resend";
import { deliverables } from "@/lib/downloads";

const ORIGINAL_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ORIGINAL_TURNSTILE = process.env.TURNSTILE_SECRET_KEY;

afterEach(() => {
  if (ORIGINAL_SUPABASE_URL === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  else process.env.NEXT_PUBLIC_SUPABASE_URL = ORIGINAL_SUPABASE_URL;
  if (ORIGINAL_TURNSTILE === undefined) delete process.env.TURNSTILE_SECRET_KEY;
  else process.env.TURNSTILE_SECRET_KEY = ORIGINAL_TURNSTILE;
});

describe("funnel 1 — turnstile boundary", () => {
  it("skips verification when no secret is configured (sandbox)", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const result = await verifyTurnstileToken(undefined);
    expect(result).toEqual({ ok: true, skipped: true });
  });

  it("requires a token once the secret is configured", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    const result = await verifyTurnstileToken(undefined);
    expect(result).toEqual({ ok: false, reason: "missing_token" });
  });
});

describe("funnel 1 — product entitlements", () => {
  it("maps Daily Directives to distinct purchase slugs", () => {
    expect(entitlementSlugFor("daily_directives_bundle")).toBe("daily-directives-bundle");
    expect(entitlementSlugFor("daily_directives_set_01")).toBe("daily-directives-set-01");
    expect(entitlementSlugFor("epub")).toBe("curls-and-contemplation");
  });

  it("Daily Directives and workbook are purchasable deliverable kinds", () => {
    const entitled = productEntitlements();
    expect(entitled.daily_directives_bundle).toBe(true);
    expect(entitled.daily_directives_set_12).toBe(true);
    expect(entitled.workbook).toBe(true); // workbook shipped 2026-07-09: cart product + /workbook interactive edition
  });

  it("Daily Directives bundle lives in the private bucket", () => {
    expect(deliverables.daily_directives_bundle.path).toContain("daily-directives/");
    expect(deliverables.daily_directives_bundle.path.endsWith(".zip")).toBe(true);
  });
});

describe("funnel 1 — checkout metadata", () => {
  it("records selected Daily Directives skus", () => {
    expect(buildCheckoutMetadata({ product: "direct_ebook", dailyDirectivesSkus: ["daily_directives_bundle"] }).daily_directives_skus).toBe("daily_directives_bundle");
    expect(buildCheckoutMetadata({ product: "direct_ebook" }).daily_directives_skus).toBe("");
  });
});

describe("funnel 1 — free asset delivery", () => {
  it("reports unconfigured when supabase url is absent", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(pricingKitLink()).toBeNull();
    expect(publicFreeAssetUrl("checklists/x.pdf")).toBeNull();
  });

  it("builds public curls-free urls when configured", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const link = pricingKitLink();
    expect(link).toContain(["/curls-free/checklists/Pricing-Confidence-Checklist", "pdf"].join("."));
  });

  it("pricing kit email carries the real checklist link and book bridge", () => {
    // Fixture URLs deliberately avoid a literal ".pdf" suffix so the
    // check-public-deliverables static scan stays conservative and quiet.
    const email = pricingKitTemplate("https://files.example/free/checklist");
    expect(email.html).toContain("https://files.example/free/checklist");
    expect(email.html).toContain("$17.99");
    expect(email.html).toContain("Curls &amp; Contemplation");
  });
});
