import { describe, expect, it } from "vitest";
import { analyticsEvents, isAnalyticsEventName, sanitizeAnalyticsMetadata } from "@/lib/analytics";
import { buildCheckoutMetadata, resolveServerPriceId } from "@/lib/stripe";
import { deliverables, isSafePrivateDeliverablePath } from "@/lib/downloads";
import { checkDownloadEntitlement } from "@/lib/entitlements";
import { mailerLiteGroups, upsertSubscriber } from "@/lib/email/mailerlite";
import { downloadAccessTemplate, orderConfirmationTemplate, sendDownloadAccess, sendOrderConfirmation } from "@/lib/email/resend";
import { adminEmailAllowlist, requireAdmin } from "@/lib/security";

describe("Prompt 5 checkout hardening", () => {
  it("ignores client-provided price and selects server-side price IDs", () => {
    process.env.STRIPE_SECRET_KEY = "placeholder";
    process.env.STRIPE_PRICE_ID_PREORDER = "price_preorder_server";
    process.env.STRIPE_PRICE_ID_REGULAR = "price_regular_server";
    expect(resolveServerPriceId("preorder", "direct_ebook")).toMatchObject({ ok: true, priceId: "price_preorder_server" });
    expect(resolveServerPriceId("launched", "direct_ebook")).toMatchObject({ ok: true, priceId: "price_regular_server" });
    const metadata = buildCheckoutMetadata({ product: "direct_ebook", sourcePage: "/preorder", customerEmail: "reader@example.com" });
    expect(metadata).toMatchObject({ book_slug: "curls-and-contemplation", source_page: "/preorder", customer_email: "reader@example.com" });
  });

  it("paused checkout fails closed", () => {
    expect(resolveServerPriceId("paused", "direct_ebook")).toMatchObject({ ok: false, reason: "checkout_paused" });
  });
});

describe("Prompt 5 protected downloads", () => {
  it("denies unauthenticated and no-config paths safely", async () => {
    await expect(checkDownloadEntitlement(null, "epub")).resolves.toEqual({ allowed: false, reason: "unauthenticated" });
  });

  it("uses private bucket paths, never local release/public paths", () => {
    expect(deliverables.epub.path).toBe("books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub");
    expect(deliverables.pdf.path).toBe("books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf");
    expect(Object.values(deliverables).every((item) => isSafePrivateDeliverablePath(item.path))).toBe(true);
    expect(JSON.stringify(deliverables)).not.toContain("release/");
    expect(JSON.stringify(deliverables)).not.toContain("public/");
  });
});

describe("Prompt 5 email providers", () => {
  it("maps all required MailerLite groups", () => {
    expect(mailerLiteGroups).toMatchObject({ subscribers: "Subscribers", free_chapter: "Free Chapter", vip_early_readers: "VIP / Early Readers" });
  });

  it("rejects invalid email and skips missing API keys safely", async () => {
    delete process.env.MAILERLITE_API_KEY;
    delete process.env.RESEND_API_KEY;
    await expect(upsertSubscriber("not-email", "subscribers")).resolves.toMatchObject({ ok: false, reason: "invalid_email" });
    await expect(upsertSubscriber("reader@example.com", "subscribers")).resolves.toMatchObject({ ok: false, skipped: true });
    await expect(sendOrderConfirmation("bad", "order_1")).resolves.toMatchObject({ ok: false, reason: "invalid_recipient" });
    await expect(sendDownloadAccess("reader@example.com")).resolves.toMatchObject({ ok: false, skipped: true });
    expect(orderConfirmationTemplate("order_1").subject).toContain("order");
    expect(downloadAccessTemplate().subject).toContain("download");
  });
});

describe("Prompt 5 analytics and admin", () => {
  it("contains required event names and strips sensitive fields", () => {
    expect(isAnalyticsEventName(analyticsEvents.scrollDepth50)).toBe(true);
    expect(isAnalyticsEventName(analyticsEvents.downloadLimitReached)).toBe(true);
    expect(sanitizeAnalyticsMetadata({ signedUrl: "https://secret", token: "abc", safe: "ok" })).toEqual({ safe: "ok" });
  });

  it("supports admin allowlist checks without exposing customer data", async () => {
    process.env.ADMIN_EMAILS = "owner@example.com";
    expect(adminEmailAllowlist()).toContain("owner@example.com");
    await expect(requireAdmin({ id: "u1", email: "reader@example.com" })).resolves.toMatchObject({ ok: false });
    await expect(requireAdmin({ id: "u2", email: "owner@example.com" })).resolves.toMatchObject({ ok: true });
  });
});
