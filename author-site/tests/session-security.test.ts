import { afterEach, describe, expect, it, vi } from "vitest";

const cookieJar = new Map<string, { value: string }>();
vi.mock("next/headers", () => ({
  cookies: async () => ({ get: (name: string) => cookieJar.get(name) })
}));

const ORIGINAL_ALLOW = process.env.ALLOW_DEMO_SESSION;

afterEach(() => {
  cookieJar.clear();
  if (ORIGINAL_ALLOW === undefined) delete process.env.ALLOW_DEMO_SESSION;
  else process.env.ALLOW_DEMO_SESSION = ORIGINAL_ALLOW;
  vi.resetModules();
});

describe("demo-session cookie gating", () => {
  it("ignores spoofable cc_demo_* cookies by default (production posture)", async () => {
    delete process.env.ALLOW_DEMO_SESSION;
    cookieJar.set("cc_demo_email", { value: "victim@example.com" });
    cookieJar.set("cc_demo_user", { value: "attacker-chosen-id" });
    const { getSessionUser } = await import("@/lib/supabase/server");
    // No Supabase config in tests → real-auth fallback returns null.
    expect(await getSessionUser()).toBeNull();
  });

  it("honors demo cookies only with explicit ALLOW_DEMO_SESSION=1 opt-in", async () => {
    process.env.ALLOW_DEMO_SESSION = "1";
    cookieJar.set("cc_demo_email", { value: "demo@example.com" });
    cookieJar.set("cc_demo_user", { value: "demo-user" });
    const { getSessionUser } = await import("@/lib/supabase/server");
    expect(await getSessionUser()).toEqual({ id: "demo-user", email: "demo@example.com" });
  });
});
