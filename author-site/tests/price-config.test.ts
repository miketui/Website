import { describe, expect, it } from "vitest";
import { priceConfig } from "@/content/book";

describe("price config", () => {
  it("keeps locked pricing", () => {
    expect(priceConfig.preorderDirect.amount).toBe(17.99);
    expect(priceConfig.regularDirect.amount).toBe(19.99);
    expect(priceConfig.kindleExternal.amount).toBe(9.99);
    expect(priceConfig.paperbackExternal.amount).toBe(29.99);
  });
});
