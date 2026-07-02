#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { isMeaningfulSandboxValue, loadSandboxEnv } from "./check-sandbox-env.mjs";

export const lockedStorage = {
  bucket: "curls-deliverables",
  epub: "books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub",
  pdf: "books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf"
};

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (full.includes("node_modules") || full.includes(".next")) return [];
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export function verifyLockedPathStrings({ repoRoot = resolve(process.cwd(), "../.."), appDir = process.cwd() } = {}) {
  const appFiles = walk(appDir).filter((file) => /\.(?:ts|tsx|js|jsx|mjs|md|json|sql)$/i.test(file));
  const docFiles = walk(resolve(repoRoot, "author-site/docs/website-v4")).filter((file) => /\.(?:md|sql|json)$/i.test(file));
  const files = [...appFiles, ...docFiles];
  const matches = { epub: [], pdf: [], bucket: [] };
  const publicOffenders = [];

  for (const file of files) {
    const rel = relative(repoRoot, file);
    const text = readFileSync(file, "utf8");
    for (const key of ["epub", "pdf", "bucket"]) {
      if (text.includes(lockedStorage[key])) matches[key].push(rel);
    }
    if (rel.startsWith("author-site/public/") && (text.includes(lockedStorage.epub) || text.includes(lockedStorage.pdf))) {
      publicOffenders.push(rel);
    }
  }

  const missing = Object.entries(matches).filter(([, paths]) => paths.length === 0).map(([key]) => key);
  return { ok: missing.length === 0 && publicOffenders.length === 0, matches, missing, publicOffenders };
}

async function optionalSupabaseCheck(env) {
  const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_STORAGE_BUCKET"];
  const missing = required.filter((name) => !isMeaningfulSandboxValue(env[name]));
  if (missing.length) return { skipped: true, reason: `Missing ${missing.join(", ")}` };
  if (env.SUPABASE_STORAGE_BUCKET !== lockedStorage.bucket) {
    return { skipped: false, ok: false, reason: `SUPABASE_STORAGE_BUCKET must be ${lockedStorage.bucket}.` };
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const bucketResult = await supabase.storage.getBucket(lockedStorage.bucket);
  if (bucketResult.error) return { skipped: false, ok: false, reason: bucketResult.error.message };
  if (bucketResult.data?.public) return { skipped: false, ok: false, reason: "Bucket is public; curls-deliverables must remain private." };

  const objectChecks = await Promise.all(
    [lockedStorage.epub, lockedStorage.pdf].map(async (path) => {
      const folder = path.split("/").slice(0, -1).join("/");
      const name = path.split("/").at(-1);
      const { data, error } = await supabase.storage.from(lockedStorage.bucket).list(folder, { search: name, limit: 1 });
      return { path, ok: !error && Boolean(data?.some((item) => item.name === name)), error: error?.message };
    })
  );
  const missingObjects = objectChecks.filter((check) => !check.ok);
  if (missingObjects.length) return { skipped: false, ok: false, reason: `Missing private objects: ${missingObjects.map((item) => item.path).join(", ")}` };
  return { skipped: false, ok: true };
}

export async function runSupabaseStorageCheck({ repoRoot = resolve(process.cwd(), "../.."), appDir = process.cwd(), env = loadSandboxEnv(appDir) } = {}) {
  const staticResult = verifyLockedPathStrings({ repoRoot, appDir });
  if (!staticResult.ok) return { ok: false, staticResult };
  const remote = await optionalSupabaseCheck(env);
  return { ok: remote.skipped ? true : remote.ok, staticResult, remote };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = await runSupabaseStorageCheck();
  if (!result.staticResult.ok) {
    console.error("Supabase storage path check failed:", JSON.stringify(result.staticResult, null, 2));
    process.exit(1);
  }
  console.log(`Storage path strings verified for bucket ${lockedStorage.bucket}.`);
  if (result.remote.skipped) {
    console.log(`Supabase remote storage check skipped: ${result.remote.reason}.`);
    process.exit(0);
  }
  if (!result.remote.ok) {
    console.error(`Supabase remote storage check failed: ${result.remote.reason}`);
    process.exit(1);
  }
  console.log("Supabase remote storage check passed: private bucket and locked objects are present.");
}
