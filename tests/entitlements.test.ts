import { describe, expect, it } from "vitest";
import { checkDownloadEntitlement } from "@/lib/entitlements";

describe("entitlements", () => {
  it("denies non-buyers by default", async () => {
    await expect(checkDownloadEntitlement("user_without_purchase", "epub")).resolves.toMatchObject({ allowed: false });
  });
});
