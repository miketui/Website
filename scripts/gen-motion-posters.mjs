#!/usr/bin/env node
/**
 * gen-motion-posters.mjs — write tiny ACISS-gradient placeholder posters so every
 * DELIVERED and DEFERRED asset's `poster` path in motion-manifest.json resolves
 * locally. These are PLACEHOLDERS: the real -poster.webp files from
 * cc-motion-library.zip overwrite them in place.
 *
 * Preferred path: render a small gradient WebP with `sharp` (present in the pnpm
 * store even though it isn't hoisted to the project root). Fallback: copy the
 * existing public/book-cover-thumb.webp to each poster path so nothing 404s.
 * Every output stays well under 40KB.
 *
 * Colors are restricted to the five locked ACISS hexes — no banned tokens.
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, copyFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "public/motion/motion-manifest.json");
const fallbackPoster = path.join(root, "public/book-cover-thumb.webp");

const OBSIDIAN = "#111111";
const ANTIQUE = "#B08D57";
const WHITEGOLD = "#D8D1C5";
const DEEP_JADE = "#145B4B";

/** Resolve sharp from the project or from the pnpm store; null if unavailable. */
function loadSharp() {
  try {
    return require("sharp");
  } catch {
    /* not hoisted — look in the pnpm store */
  }
  const pnpmDir = path.join(root, "node_modules/.pnpm");
  if (existsSync(pnpmDir)) {
    const hit = readdirSync(pnpmDir).find((d) => /^sharp@/.test(d));
    if (hit) {
      try {
        return require(path.join(pnpmDir, hit, "node_modules/sharp"));
      } catch {
        /* fall through to copy fallback */
      }
    }
  }
  return null;
}

/** Small pixel dimensions at the manifest aspect (longest side 160px). */
function dims(aspect) {
  const [w, h] = (aspect ?? "16:9").split(":").map(Number);
  if (!w || !h) return { width: 160, height: 90 };
  const scale = 160 / Math.max(w, h);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

function svg(id, width, height) {
  const gold = ["A", "I", "L"].includes(id);
  const end = gold ? ANTIQUE : DEEP_JADE;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${OBSIDIAN}"/>
      <stop offset="1" stop-color="${end}"/>
    </linearGradient>
    <radialGradient id="bloom" cx="0.5" cy="0.38" r="0.65">
      <stop offset="0" stop-color="${WHITEGOLD}" stop-opacity="0.30"/>
      <stop offset="1" stop-color="${WHITEGOLD}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#base)"/>
  <rect width="${width}" height="${height}" fill="url(#bloom)"/>
</svg>`;
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const targets = manifest.assets.filter(
  (a) => a.poster && (a.status === "DELIVERED" || a.status === "DEFERRED")
);

// Safety: by default, never overwrite a poster that already exists — the real
// -poster.webp files from cc-motion-library.zip live at these same paths, so a
// blind re-run would clobber real footage with placeholders. Pass --force to
// regenerate every placeholder intentionally (e.g. after deleting stale ones).
const force = process.argv.includes("--force");

const sharp = loadSharp();
const mode = sharp ? "sharp gradient" : "copy fallback";
console.log(`[gen-motion-posters] mode: ${mode} — ${targets.length} candidates${force ? " (--force: overwrite)" : " (skip existing)"}`);

let done = 0;
let skipped = 0;
for (const asset of targets) {
  const out = path.join(root, "public", asset.poster.replace(/^\//, ""));
  if (!force && existsSync(out)) {
    console.log(`  – ${asset.id.padEnd(2)} ${asset.poster}  (exists, kept)`);
    skipped += 1;
    continue;
  }
  if (sharp) {
    const { width, height } = dims(asset.aspect);
    await sharp(Buffer.from(svg(asset.id, width, height)))
      .webp({ quality: 72 })
      .toFile(out);
  } else {
    copyFileSync(fallbackPoster, out);
  }
  const kb = (readFileSync(out).length / 1024).toFixed(1);
  console.log(`  ✓ ${asset.id.padEnd(2)} ${asset.poster}  (${kb} KB)`);
  done += 1;
}

console.log(`[gen-motion-posters] wrote ${done} placeholder poster(s).`);
