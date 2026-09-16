import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hasReleaseInstantArrived, releaseInstant } from "@/config/launchState";
import { createSignedDownloadUrl } from "@/lib/downloads";
import { getSessionUser } from "@/lib/supabase/server";
import { POST } from "@/app/api/downloads/sign/route";

vi.mock("@/lib/supabase/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/supabase/server")>();
  return {
    ...actual,
    getSessionUser: vi.fn()
  };
});

const buyer = { id: "buyer-1", email: "buyer@example.com" };

function signRequest(deliverable: string) {
  return new Request("http://localhost/api/downloads/sign", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ deliverable })
  });
}

describe("book EPUB sign — release-date gate", () => {
  const originalLaunchState = process.env.NEXT_PUBLIC_LAUNCH_STATE;

  beforeEach(() => {
    vi.mocked(getSessionUser).mockResolvedValue(buyer);
  });

  afterEach(() => {
    vi.useRealTimers();
    if (originalLaunchState === undefined) delete process.env.NEXT_PUBLIC_LAUNCH_STATE;
    else process.env.NEXT_PUBLIC_LAUNCH_STATE = originalLaunchState;
  });

  it("reuses releaseInstant (Pacific midnight), not UTC midnight", () => {
    // UTC midnight on RELEASE_DATE is still the evening before in America/Los_Angeles.
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-24T00:00:00.000Z"));
    expect(hasReleaseInstantArrived()).toBe(false);
    vi.setSystemTime(releaseInstant());
    expect(hasReleaseInstantArrived()).toBe(true);
  });

  it("refuses to sign the book EPUB before the release instant", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(releaseInstant().getTime() - 60_000));
    await expect(createSignedDownloadUrl(buyer, "epub")).resolves.toEqual({
      allowed: false,
      reason: "not_yet_released"
    });
  });

  it("sign endpoint returns 403 not_yet_released for pre-launch book EPUB", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(releaseInstant().getTime() - 60_000));
    const response = await POST(signRequest("epub"));
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "not_yet_released" }
    });
  });

  it("does not let NEXT_PUBLIC_LAUNCH_STATE unlock the EPUB before releaseInstant", async () => {
    process.env.NEXT_PUBLIC_LAUNCH_STATE = "LAUNCH";
    vi.useFakeTimers();
    vi.setSystemTime(new Date(releaseInstant().getTime() - 60_000));
    await expect(createSignedDownloadUrl(buyer, "epub")).resolves.toEqual({
      allowed: false,
      reason: "not_yet_released"
    });
  });

  it("does not gate the workbook PDF on the book release instant", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(releaseInstant().getTime() - 60_000));
    const result = await createSignedDownloadUrl(buyer, "workbook");
    expect(result.allowed).toBe(false);
    if (!result.allowed) expect(result.reason).not.toBe("not_yet_released");
  });

  it("does not apply the release gate to Daily Directives", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(releaseInstant().getTime() - 60_000));
    const result = await createSignedDownloadUrl(buyer, "daily_directives_bundle");
    expect(result.allowed).toBe(false);
    if (!result.allowed) expect(result.reason).not.toBe("not_yet_released");
  });

  it("unauthenticated book EPUB stays 401, even before launch", async () => {
    vi.mocked(getSessionUser).mockResolvedValue(null);
    vi.useFakeTimers();
    vi.setSystemTime(new Date(releaseInstant().getTime() - 60_000));
    await expect(createSignedDownloadUrl(null, "epub")).resolves.toEqual({
      allowed: false,
      reason: "unauthenticated"
    });
    const response = await POST(signRequest("epub"));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      ok: false,
      error: { code: "unauthenticated" }
    });
  });

  it("drops the date gate once releaseInstant has arrived", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(releaseInstant());
    const result = await createSignedDownloadUrl(buyer, "epub");
    expect(result.allowed).toBe(false);
    if (!result.allowed) expect(result.reason).not.toBe("not_yet_released");
  });
});
