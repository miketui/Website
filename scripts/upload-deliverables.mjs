#!/usr/bin/env node
/**
 * Uploads funnel deliverables to Supabase Storage. Idempotent (upsert).
 *
 *   Free assets  → public bucket  `curls-free`         (from assets/free-bucket/ in this repo)
 *   Paid assets  → private bucket `curls-deliverables` (from --private-dir; NEVER committed to git)
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... \
 *     node scripts/upload-deliverables.mjs [--private-dir /path/to/files] [--dry-run]
 *
 * Private files expected inside --private-dir (flat, by filename):
 *   Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub
 *   Idea-to-Action-Workbook-MDW.pdf
 *
 * The v13 POD interior PDF is a print artifact for KDP/third-party POD only —
 * it is not a site deliverable and does not belong in Supabase Storage.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const FREE_BUCKET = "curls-free";
const PRIVATE_BUCKET = "curls-deliverables";
const FREE_DIR = resolve(process.cwd(), "assets/free-bucket");

const privateTargets = [
  { file: "Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub", path: "books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub", required: true },
  { file: "Idea-to-Action-Workbook-MDW.pdf", path: "workbooks/Idea-to-Action-Workbook-MDW.pdf", required: false }
];

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0]);
  process.exit(0);
}
const dryRun = args.includes("--dry-run");
const privateDirIndex = args.indexOf("--private-dir");
const privateDirValue = privateDirIndex >= 0 ? args[privateDirIndex + 1] : undefined;
if (privateDirIndex >= 0 && (!privateDirValue || privateDirValue.startsWith("--"))) {
  console.error("--private-dir requires a directory path.");
  process.exit(1);
}
const privateDir = privateDirValue ? resolve(privateDirValue) : null;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!dryRun && (!url || !key)) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const contentTypeFor = (path) => (path.endsWith(".epub") ? "application/epub+zip" : path.endsWith(".pdf") ? "application/pdf" : "application/octet-stream");

async function uploadAll() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = dryRun ? null : createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  let failures = 0;

  async function upload(bucket, storagePath, localPath) {
    const label = `${bucket}/${storagePath}`;
    if (dryRun) {
      console.log(`[dry-run] would upload ${relative(process.cwd(), localPath)} → ${label}`);
      return;
    }
    const body = readFileSync(localPath);
    const { error } = await supabase.storage.from(bucket).upload(storagePath, body, { contentType: contentTypeFor(storagePath), upsert: true });
    if (error) {
      failures += 1;
      console.error(`✗ ${label}: ${error.message}`);
    } else {
      console.log(`✓ ${label} (${(body.length / 1024).toFixed(0)} KB)`);
    }
  }

  const freeFiles = walk(FREE_DIR).filter((file) => /\.pdf$/i.test(file));
  if (freeFiles.length === 0) console.warn(`No free assets found under ${relative(process.cwd(), FREE_DIR)} — skipping ${FREE_BUCKET}.`);
  for (const file of freeFiles) {
    const storagePath = relative(FREE_DIR, file).split("\\").join("/");
    await upload(FREE_BUCKET, storagePath, file);
  }

  if (!privateDir) {
    console.warn("No --private-dir given — skipping private bucket uploads (v13 EPUB, workbook).");
  } else {
    for (const target of privateTargets) {
      const local = join(privateDir, target.file);
      if (!existsSync(local)) {
        const level = target.required ? "error" : "warn";
        console[level](`${target.required ? "✗ REQUIRED" : "– optional"} private file missing locally: ${target.file}`);
        if (target.required) failures += 1;
        continue;
      }
      await upload(PRIVATE_BUCKET, target.path, local);
    }
  }

  if (failures > 0) {
    console.error(`\n${failures} upload(s) failed.`);
    process.exit(1);
  }
  console.log("\nAll requested uploads completed.");
}

await uploadAll();
