import { describe, expect, it } from "vitest";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { checkPublicDeliverables } from "../scripts/check-public-deliverables.mjs";
import { isLiveStripeValue } from "../scripts/check-sandbox-env.mjs";
import { lockedStorage, runSupabaseStorageCheck } from "../scripts/verify-supabase-storage-paths.mjs";

const appDir = process.cwd();
const repoRoot = join(appDir, "../..");
const lockedEpubPath = "books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub";
const lockedPdfPath = "books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf";

describe("Prompt 6 sandbox integration readiness", () => {
  it("ships a sandbox env template without real-looking secrets", () => {
    const envPath = join(appDir, ".env.sandbox.example");
    expect(existsSync(envPath)).toBe(true);
    const text = readFileSync(envPath, "utf8");
    expect(text).toContain("NEVER commit .env.local, .env.sandbox, or real secrets");
    expect(text).toContain("SUPABASE_STORAGE_BUCKET=curls-deliverables");
    expect(text).not.toMatch(new RegExp(`\\b(?:sk|rk|pk)_${"live"}_[A-Za-z0-9]+\\b`));
    expect(text).not.toMatch(new RegExp(`\\bwhsec_${"live"}[A-Za-z0-9_]*\\b`));
    expect(text).not.toMatch(/\bsk_test_[A-Za-z0-9]{16,}\b/);
    const serviceRoleName = "SUPABASE" + "_SERVICE_ROLE_KEY";
    const resendName = "RESEND" + "_API_KEY";
    expect(text).not.toMatch(new RegExp(`\\b${serviceRoleName}=${"eyJ"}`));
    expect(text).not.toMatch(new RegExp(`\\b${resendName}=${"re"}_[A-Za-z0-9]`));
  });

  it("does not commit local secret env files", () => {
    expect(existsSync(join(appDir, ".env.local"))).toBe(false);
    expect(existsSync(join(appDir, ".env.sandbox"))).toBe(false);
  });

  it("sandbox env checker hides secret values", () => {
    const secretValue = "sk_test_super_secret_value_for_output_check";
    const output = execFileSync(process.execPath, ["scripts/check-sandbox-env.mjs"], {
      cwd: appDir,
      env: {
        ...process.env,
        PATH: process.env.PATH ?? "",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        STRIPE_SECRET_KEY: secretValue,
        STRIPE_PRICE_ID_PREORDER: "price_12345preorder",
        STRIPE_PRICE_ID_REGULAR: "price_12345regular"
      },
      encoding: "utf8"
    });
    expect(output).toContain("values hidden");
    expect(output).toContain("STRIPE_SECRET_KEY");
    expect(output).not.toContain(secretValue);
  });

  it("rejects Stripe live key patterns via helper logic", () => {
    const live = "_" + "live" + "_";
    expect(isLiveStripeValue(`sk${live}1234567890abcdef`)).toBe(true);
    expect(isLiveStripeValue(`rk${live}1234567890abcdef`)).toBe(true);
    expect(isLiveStripeValue(`pk${live}1234567890abcdef`)).toBe(true);
    expect(isLiveStripeValue(`whsec${live}1234567890abcdef`)).toBe(true);
    expect(isLiveStripeValue("sk_test_1234567890abcdef")).toBe(false);
  });

  it("private object paths match the locked EPUB/PDF targets", () => {
    expect(lockedStorage.bucket).toBe("curls-deliverables");
    expect(lockedStorage.epub).toBe(lockedEpubPath);
    expect(lockedStorage.pdf).toBe(lockedPdfPath);
    const deliverables = readFileSync(join(appDir, "lib/deliverables.ts"), "utf8");
    expect(deliverables).toContain(lockedEpubPath);
    expect(deliverables).toContain(lockedPdfPath);
    const downloads = readFileSync(join(appDir, "lib/downloads.ts"), "utf8");
    expect(downloads).not.toContain("release/Curls-and-Contemplation");
  });

  it("public deliverables check rejects EPUB/PDF files in public", () => {
    const tempDir = join(tmpdir(), `curls-public-check-${Date.now()}`);
    mkdirSync(join(tempDir, "public"), { recursive: true });
    writeFileSync(join(tempDir, "private-paths.md"), `${lockedEpubPath}\n${lockedPdfPath}\n`);
    writeFileSync(join(tempDir, "public", "paid.epub"), "placeholder");
    const result = checkPublicDeliverables({ appDir: tempDir });
    rmSync(tempDir, { recursive: true, force: true });
    expect(result.ok).toBe(false);
    expect(result.offenders.join("\n")).toContain("paid.epub");
  });

  it("Supabase storage verifier skips safely without credentials", async () => {
    const result = await runSupabaseStorageCheck({ repoRoot, appDir, env: {} });
    expect(result.ok).toBe(true);
    expect(result.remote.skipped).toBe(true);
    expect(result.remote.reason).toContain("Missing NEXT_PUBLIC_SUPABASE_URL");
  });

  it("package.json references all sandbox check scripts", () => {
    const pkg = JSON.parse(readFileSync(join(appDir, "package.json"), "utf8"));
    expect(pkg.scripts["check:sandbox-env"]).toContain("check-sandbox-env.mjs");
    expect(pkg.scripts["check:deliverables"]).toContain("check-public-deliverables.mjs");
    expect(pkg.scripts["check:supabase-storage"]).toContain("verify-supabase-storage-paths.mjs");
    expect(pkg.scripts["check:stripe-test"]).toContain("stripe-test-mode-check.mjs");
    expect(pkg.scripts["check:sandbox"]).toContain("check:sandbox-env");
  });
});
