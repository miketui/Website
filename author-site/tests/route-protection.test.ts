import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isProtectedRoute } from "@/lib/route-policy";

describe("route protection and indexing policy", () => {
  it.each(["/dashboard", "/downloads", "/bonus-claim", "/admin", "/admin/orders"])("marks %s as protected", (pathname) => {
    expect(isProtectedRoute(pathname)).toBe(true);
  });

  it("uses Next.js proxy convention and noindex headers for protected surfaces", () => {
    const proxy = readFileSync(join(process.cwd(), "proxy.ts"), "utf8");
    expect(proxy).toContain("export function proxy");
    expect(proxy).toContain("X-Robots-Tag");
    expect(proxy).toContain("noindex, nofollow");
  });

  it("protected pages opt out of indexing metadata", () => {
    const seo = readFileSync(join(process.cwd(), "lib/seo.ts"), "utf8");
    expect(seo).toContain("index: false");
    expect(seo).toContain("follow: false");
  });
});
