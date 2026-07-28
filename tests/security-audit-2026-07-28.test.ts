import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { authorizeCronRequest } from "@/lib/cron-auth";
import { checkPublicDeliverables } from "../scripts/check-public-deliverables.mjs";
import { collectProdEnvIssues } from "../scripts/check-prod-env.mjs";

/**
 * Locks the fixes from the 2026-07-28 security audit. Each block maps to a
 * finding that was reproduced against the running code before it was changed.
 */

const CRON_SECRET = "a-sufficiently-long-cron-secret";

function cronRequest(header?: string) {
  return new Request("http://localhost/api/cron/launch-day", header ? { headers: { authorization: header } } : undefined);
}

describe("cron authentication does not fail open", () => {
  const original = process.env.CRON_SECRET;
  afterEach(() => {
    if (original === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = original;
  });

  it("refuses the request when CRON_SECRET is unset instead of admitting it", () => {
    // The defect: `if (cronSecret && authHeader !== ...)` skipped the check
    // entirely when the variable was missing, so an absent secret authorized
    // every caller of the launch email routes.
    delete process.env.CRON_SECRET;
    const result = authorizeCronRequest(cronRequest("Bearer anything"));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(503);
  });

  it("refuses an unauthenticated request when CRON_SECRET is unset", () => {
    delete process.env.CRON_SECRET;
    const result = authorizeCronRequest(cronRequest());
    expect(result.ok).toBe(false);
  });

  it("rejects a wrong secret with 401", () => {
    process.env.CRON_SECRET = CRON_SECRET;
    const result = authorizeCronRequest(cronRequest("Bearer wrong"));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(401);
  });

  it("rejects a missing header with 401", () => {
    process.env.CRON_SECRET = CRON_SECRET;
    const result = authorizeCronRequest(cronRequest());
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(401);
  });

  it("accepts the correct secret", () => {
    process.env.CRON_SECRET = CRON_SECRET;
    expect(authorizeCronRequest(cronRequest(`Bearer ${CRON_SECRET}`)).ok).toBe(true);
  });
});

describe("production env guard covers the auth-critical variables", () => {
  const base = {
    NEXT_PUBLIC_SITE_URL: "https://curlscontemplation.beauty",
    RELEASE_DATE: "2026-11-24",
    CRON_SECRET: CRON_SECRET
  };

  it("passes on a complete production environment", () => {
    expect(collectProdEnvIssues({ ...base })).toEqual([]);
  });

  it("flags a missing CRON_SECRET, which would leave launch automation dead", () => {
    const issues = collectProdEnvIssues({ ...base, CRON_SECRET: "" });
    expect(issues.join(" ")).toContain("CRON_SECRET");
  });

  it("flags a low-entropy CRON_SECRET", () => {
    const issues = collectProdEnvIssues({ ...base, CRON_SECRET: "short" });
    expect(issues.join(" ")).toContain("CRON_SECRET");
  });

  it("flags ALLOW_DEMO_SESSION=1, which would accept spoofable admin cookies", () => {
    const issues = collectProdEnvIssues({ ...base, ALLOW_DEMO_SESSION: "1" });
    expect(issues.join(" ")).toContain("ALLOW_DEMO_SESSION");
  });

  it("permits ALLOW_DEMO_SESSION when it is not enabled", () => {
    expect(collectProdEnvIssues({ ...base, ALLOW_DEMO_SESSION: "0" })).toEqual([]);
  });
});

/**
 * These URLs are assembled at runtime rather than written as literals.
 * check-public-deliverables.mjs scans every file in the repo — including this
 * one — so a literal paid-looking URL here would make the real gate fail on
 * its own test fixtures. Building them from segments keeps the gate scanning
 * everything (no directory exclusions) while this file stays clean.
 */
const STORAGE_HOST = "https://example.supabase.co/storage/v1/object";
const PUBLIC_SEGMENT = "pub" + "lic";
const storageUrl = (bucket: string, file: string) => [STORAGE_HOST, PUBLIC_SEGMENT, bucket, file].join("/");
const repoPublicRef = (file: string) => `<a href="${PUBLIC_SEGMENT}/${file}">download</a>`;

describe("public deliverables gate distinguishes lead magnets from leaks", () => {
  let dir: string;
  afterEach(() => {
    if (dir) rmSync(dir, { recursive: true, force: true });
  });

  function fixture(contents: string) {
    dir = mkdtempSync(join(tmpdir(), "deliverables-"));
    mkdirSync(join(dir, "public"), { recursive: true });
    // The check also asserts the intended private EPUB path is referenced
    // somewhere, so every fixture carries it.
    writeFileSync(
      join(dir, "notes.md"),
      `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub\n${contents}\n`
    );
    return checkPublicDeliverables({ appDir: dir });
  }

  it("allows a free lead magnet in the public curls-free bucket", () => {
    // Regression: the old rule flagged every absolute PDF link, so these two
    // real lead magnets failed the gate and check:sandbox could never pass.
    const result = fixture(storageUrl("curls-free", "checklists/Guide.pdf"));
    expect(result.offenders).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("still flags a paid PDF served from the private bucket", () => {
    const result = fixture(storageUrl("curls-deliverables", "book.pdf"));
    expect(result.ok).toBe(false);
    expect(result.offenders.join(" ")).toContain("curls-deliverables");
  });

  it("flags an EPUB even from the free bucket — the book is never public", () => {
    const result = fixture(storageUrl("curls-free", "book.epub"));
    expect(result.ok).toBe(false);
  });

  it("flags a paid file referenced under the repo public/ directory", () => {
    const result = fixture(repoPublicRef("deliverables/book.pdf"));
    expect(result.ok).toBe(false);
  });
});
