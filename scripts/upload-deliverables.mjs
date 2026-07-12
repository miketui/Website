#!/usr/bin/env node
/**
 * Uploads funnel deliverables to Supabase Storage. Idempotent (upsert).
 *
 *   Free assets  → public bucket  `curls-free`         (from assets/free-bucket/ in this repo)
 *   Paid assets  → private bucket `curls-deliverables` (from --private-dir; NEVER committed to git)
 *
 * Usage:
 *   SUPABASE_SECRET_KEY=... NEXT_PUBLIC_SUPABASE_URL=... \
 *     node scripts/upload-deliverables.mjs [--public-dir /path/to/free-files] [--private-dir /path/to/files] [--dry-run]
 *
 * Private files mirror the storage paths under --private-dir:
 *   workbook/Idea-to-Action-Workbook.pdf
 *   daily-directives/Daily-Directives-Complete-12-Set-Bundle.zip
 *   daily-directives/sets/Daily-Directives-Set-01-....zip through Set 12
 * The EPUB is optional and is uploaded only when present.
 *
 * The v13 POD interior PDF is a print artifact for KDP/third-party POD only —
 * it is not a site deliverable and does not belong in Supabase Storage.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const FREE_BUCKET = "curls-free";
const PRIVATE_BUCKET = "curls-deliverables";
const DEFAULT_FREE_DIR = resolve(process.cwd(), "assets/free-bucket");

const privateTargets = [
  { file: "workbook/Idea-to-Action-Workbook.pdf", path: "workbook/Idea-to-Action-Workbook.pdf", required: true },
  { file: "daily-directives/Daily-Directives-Complete-12-Set-Bundle.zip", path: "daily-directives/Daily-Directives-Complete-12-Set-Bundle.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-01-Permission-to-Begin.zip", path: "daily-directives/sets/Daily-Directives-Set-01-Permission-to-Begin.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-02-The-Discipline-of-Showing-Up.zip", path: "daily-directives/sets/Daily-Directives-Set-02-The-Discipline-of-Showing-Up.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-03-Visible-on-Purpose.zip", path: "daily-directives/sets/Daily-Directives-Set-03-Visible-on-Purpose.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-04-The-Price-of-Your-Gifts.zip", path: "daily-directives/sets/Daily-Directives-Set-04-The-Price-of-Your-Gifts.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-05-Boundaries-Build-the-Brand.zip", path: "daily-directives/sets/Daily-Directives-Set-05-Boundaries-Build-the-Brand.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-06-Creative-Recovery.zip", path: "daily-directives/sets/Daily-Directives-Set-06-Creative-Recovery.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-07-Trust-Your-Taste.zip", path: "daily-directives/sets/Daily-Directives-Set-07-Trust-Your-Taste.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-08-Rooms-I-Belong-In.zip", path: "daily-directives/sets/Daily-Directives-Set-08-Rooms-I-Belong-In.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-09-The-Courage-to-Pivot.zip", path: "daily-directives/sets/Daily-Directives-Set-09-The-Courage-to-Pivot.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-10-Built-from-Evidence.zip", path: "daily-directives/sets/Daily-Directives-Set-10-Built-from-Evidence.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-11-Legacy-in-Motion.zip", path: "daily-directives/sets/Daily-Directives-Set-11-Legacy-in-Motion.zip", required: true },
  { file: "daily-directives/sets/Daily-Directives-Set-12-The-Version-Im-Becoming.zip", path: "daily-directives/sets/Daily-Directives-Set-12-The-Version-Im-Becoming.zip", required: true },
  { file: "books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub", path: "books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub", required: false }
];

const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log(readFileSync(new URL(import.meta.url), "utf8").split("*/")[0]);
  process.exit(0);
}
const dryRun = args.includes("--dry-run");
const publicDirIndex = args.indexOf("--public-dir");
const publicDirValue = publicDirIndex >= 0 ? args[publicDirIndex + 1] : undefined;
if (publicDirIndex >= 0 && (!publicDirValue || publicDirValue.startsWith("--"))) {
  console.error("--public-dir requires a directory path.");
  process.exit(1);
}
const freeDir = publicDirValue ? resolve(publicDirValue) : DEFAULT_FREE_DIR;
const privateDirIndex = args.indexOf("--private-dir");
const privateDirValue = privateDirIndex >= 0 ? args[privateDirIndex + 1] : undefined;
if (privateDirIndex >= 0 && (!privateDirValue || privateDirValue.startsWith("--"))) {
  console.error("--private-dir requires a directory path.");
  process.exit(1);
}
const privateDir = privateDirValue ? resolve(privateDirValue) : null;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!dryRun && (!url || !key)) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY (legacy SUPABASE_SERVICE_ROLE_KEY is also supported).");
  process.exit(1);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const contentTypeFor = (path) => (path.endsWith(".epub") ? "application/epub+zip" : path.endsWith(".pdf") ? "application/pdf" : path.endsWith(".zip") ? "application/zip" : "application/octet-stream");

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

  const freeFiles = walk(freeDir).filter((file) => /\.pdf$/i.test(file));
  if (freeFiles.length === 0) console.warn(`No free assets found under ${relative(process.cwd(), freeDir)} — skipping ${FREE_BUCKET}.`);
  for (const file of freeFiles) {
    const storagePath = relative(freeDir, file).split("\\").join("/");
    await upload(FREE_BUCKET, storagePath, file);
  }

  if (!privateDir) {
    console.warn("No --private-dir given — skipping private bucket uploads.");
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
