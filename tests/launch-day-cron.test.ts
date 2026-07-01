import { describe, expect, it, vi, afterEach } from "vitest";
import { hasLaunchArrived, GET } from "@/app/api/cron/launch-day/route";
import { siteConfig } from "@/content/site";

describe("launch-day cron", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reports launch as arrived once today reaches releaseDate", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(`${siteConfig.releaseDate}T00:00:00Z`));
    expect(hasLaunchArrived()).toBe(true);
  });

  it("reports launch as not yet arrived before releaseDate", () => {
    vi.useFakeTimers();
    const dayBefore = new Date(`${siteConfig.releaseDate}T00:00:00Z`);
    dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);
    vi.setSystemTime(dayBefore);
    expect(hasLaunchArrived()).toBe(false);
  });

  it("rejects an unauthorized request when CRON_SECRET is configured", async () => {
    const original = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-secret";
    try {
      const response = await GET(new Request("http://localhost/api/cron/launch-day"));
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error.code).toBe("unauthorized");
    } finally {
      process.env.CRON_SECRET = original;
    }
  });

  it("no-ops safely before launch day even with a valid secret", async () => {
    const original = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test-secret";
    vi.useFakeTimers();
    const dayBefore = new Date(`${siteConfig.releaseDate}T00:00:00Z`);
    dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);
    vi.setSystemTime(dayBefore);
    try {
      const response = await GET(new Request("http://localhost/api/cron/launch-day", { headers: { authorization: "Bearer test-secret" } }));
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.launched).toBe(false);
    } finally {
      process.env.CRON_SECRET = original;
    }
  });
});
