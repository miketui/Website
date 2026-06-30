import { describe, expect, it } from "vitest";
import { analyticsEvents } from "@/lib/analytics";

describe("analytics event map", () => {
  it("exports expected marketing, commerce, customer, and design events", () => {
    expect(analyticsEvents.ctaClick).toBe("cta_click");
    expect(analyticsEvents.checkoutStarted).toBe("checkout_started");
    expect(analyticsEvents.downloadSigned).toBe("download_signed");
    expect(analyticsEvents.curlTrailSeen).toBe("curl_trail_seen");
  });
});
