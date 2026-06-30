import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/stripe/webhook/route";

describe("stripe webhook", () => {
  it("returns 400 when signature/configuration is bad or missing", async () => {
    const response = await POST(new Request("http://localhost/api/stripe/webhook", { method: "POST", body: "{}" }));
    expect(response.status).toBe(400);
  });
});
