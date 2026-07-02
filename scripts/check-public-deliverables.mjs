#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const epubPath = "books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub";
const forbiddenPublicUrlPatterns = [
  /public\/[A-Za-z0-9/_-]+\.(?:epub|pdf)\b/i,
  /href=["'][^"']*release\/[^"']*\.(?:epub|pdf)["']/i,
  /src=["'][^"']*release\/[^"']*\.(?:epub|pdf)["']/i,
  /https?:\/\/[^\s"']+\.(?:epub|pdf)\b/i
];

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (full.includes("node_modules") || full.includes(".next")) return [];
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export function checkPublicDeliverables({ appDir = process.cwd() } = {}) {
  const publicDir = resolve(appDir, "public");
  const publicPaidFiles = walk(publicDir).filter((file) => /\.(epub|pdf)$/i.test(file));
  const offenders = publicPaidFiles.map((file) => relative(appDir, file));

  const searchableFiles = walk(appDir).filter((file) => /\.(?:ts|tsx|js|jsx|mjs|md|json|html|css)$/i.test(file));
  for (const file of searchableFiles) {
    const rel = relative(appDir, file);
    const text = readFileSync(file, "utf8");
    if (forbiddenPublicUrlPatterns.some((pattern) => pattern.test(text))) offenders.push(`${rel} references a paid file as a public URL`);
  }

  const allText = searchableFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  if (!allText.includes(epubPath)) offenders.push(`missing intended private EPUB path: ${epubPath}`);

  return { ok: offenders.length === 0, offenders };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = checkPublicDeliverables();
  if (!result.ok) {
    console.error("Public deliverables check failed:");
    for (const offender of result.offenders) console.error(`- ${offender}`);
    process.exit(1);
  }
  console.log("Public deliverables check passed: no paid EPUB/PDF files or public paid-file URLs found under app public assets.");
}
