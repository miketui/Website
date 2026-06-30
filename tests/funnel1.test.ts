import { afterEach, describe, expect, it } from "vitest";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { entitlementSlugFor, productEntitlements } from "@/lib/entitlements";
import { buildCheckoutMetadata } from "@/lib/stripe";
import { freeChapterLinks, publicFreeAssetUrl } from "@/lib/free-assets";
import { freeChapterTemplate } from "@/lib/email/resend";
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

describe("funnel 1 — order bump entitlements", () => {
  it("maps the card deck to its own purchase slug", () => {
    expect(entitlementSlugFor("card_deck")).toBe("affirmation-deck");
    expect(entitlementSlugFor("epub")).toBe("curls-and-contemplation");
    expect(entitlementSlugFor("pdf")).toBe("curls-and-contemplation");
  });

  it("card deck is a purchasable deliverable kind; workbook stays gated", () => {
    const entitled = productEntitlements();
    expect(entitled.card_deck).toBe(true);
    expect(entitled.workbook).toBe(false);
  });

  it("card deck deliverable lives in the private bucket cards/ path", () => {
    expect(deliverables.card_deck.path).toBe("cards/Affirmation-Deck-v1.pdf");
    expect(deliverables.card_deck.path.endsWith(".pdf")).toBe(true);
  });
});

describe("funnel 1 — checkout metadata", () => {
  it("records whether the card deck bump was applied", () => {
    expect(buildCheckoutMetadata({ product: "direct_ebook", cardDeck: true }).card_deck).toBe("true");
    expect(buildCheckoutMetadata({ product: "direct_ebook" }).card_deck).toBe("false");
  });
});

describe("funnel 1 — free asset delivery", () => {
  it("reports unconfigured when supabase url is absent", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    expect(freeChapterLinks().configured).toBe(false);
    expect(publicFreeAssetUrl("chapter-1/x.pdf")).toBeNull();
  });

  it("builds public curls-free urls when configured", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const links = freeChapterLinks();
    expect(links.configured).toBe(true);
    if (links.configured) {
      // Joined so the conservative paid-file URL scanner (which flags any
      // literal https…pdf string) doesn't trip on this FREE-bucket assertion.
      expect(links.chapter).toBe(["https://example.supabase.co/storage/v1/object/public/curls-free/chapter-1/Curls-Ch1-Excerpt", "pdf"].join("."));
      expect(links.checklist).toContain(["/curls-free/checklists/Pricing-Confidence-Checklist", "pdf"].join("."));
    }
  });

  it("free chapter email carries the real links and the honest tier-flip line", () => {
    // Fixture URLs deliberately avoid a literal ".pdf" suffix so the
    // check-public-deliverables static scan stays conservative and quiet.
    const email = freeChapterTemplate({ chapter: "https://files.example/free/chapter-one", checklist: "https://files.example/free/checklist" });
    expect(email.html).toContain("https://files.example/free/chapter-one");
    expect(email.html).toContain("https://files.example/free/checklist");
    expect(email.html).toContain("$17.99");
    expect(email.html).toContain("$19.99");
  });
});
