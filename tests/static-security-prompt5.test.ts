import { describe, expect, it } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (path.includes("node_modules") || path.includes(".next")) return [];
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe("Prompt 5 static security checks", () => {
  it("does not commit local env files or paid files in public", () => {
    const files = walk(process.cwd()).map((file) => relative(process.cwd(), file));
    expect(files).not.toContain(".env.local");
    expect(walk(join(process.cwd(), "public")).filter((file) => /\.(epub|pdf)$/i.test(file))).toEqual([]);
  });

  it("download API does not return local release paths", () => {
    const source = readFileSync(join(process.cwd(), "app/api/downloads/sign/route.ts"), "utf8");
    expect(source).not.toContain("release/");
    expect(source).not.toContain("public/");
  });

  it("webhook reads raw body and verifies signature", () => {
    const source = readFileSync(join(process.cwd(), "app/api/stripe/webhook/route.ts"), "utf8");
    expect(source).toContain("request.text()");
    expect(source).toContain("constructEvent");
    expect(source).toContain("stripe-signature");
  });

  it("bonus claim API verifies Turnstile before provider side effects", () => {
    const source = readFileSync(join(process.cwd(), "app/api/bonus-claim/route.ts"), "utf8");
    expect(source).toContain("verifyTurnstileToken");
    expect(source.indexOf("const turnstile = await verifyTurnstileToken")).toBeLessThan(source.indexOf("const mailerlite = await upsertSubscriber"));
    expect(source).toContain("turnstile_failed");
  });

  it("service role key stays out of client components", () => {
    const files = walk(process.cwd()).filter((file) => /\.(tsx|ts)$/.test(file));
    const clientOffenders = files.filter((file) => readFileSync(file, "utf8").startsWith('"use client"') && readFileSync(file, "utf8").includes("SUPABASE_SERVICE_ROLE_KEY"));
    expect(clientOffenders).toEqual([]);
  });
});
