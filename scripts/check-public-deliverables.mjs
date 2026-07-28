#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const epubPath = "books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub";
const forbiddenPublicUrlPatterns = [
  // Anchored to a *reference* to the repo's own public/ directory — start of
  // line, quote, whitespace, `(` or `=`. Previously unanchored, so it also
  // matched the "public" path segment inside a Supabase storage URL
  // (/storage/v1/object/public/...), flagging every free lead magnet.
  /(?:^|["'\s(=])public\/[A-Za-z0-9/_-]+\.(?:epub|pdf)\b/im,
  /href=["'][^"']*release\/[^"']*\.(?:epub|pdf)["']/i,
  /src=["'][^"']*release\/[^"']*\.(?:epub|pdf)["']/i
];

// Every absolute link to a document, so each one can be judged individually.
const ABSOLUTE_DOC_URL = /https?:\/\/[^\s"'<>)]+\.(?:epub|pdf)\b/gi;

/**
 * The lead-magnet bucket. `curls-free` is public BY DESIGN — it holds the
 * pricing guide and the other opt-in assets, and the MailerLite emails link
 * straight to it.
 *
 * This allowlist exists because the previous rule flagged *every* absolute
 * http(s) PDF link as a paid leak. That is not a stricter check, it is a
 * broken one: it failed on two legitimate lead magnets, which meant
 * `check:sandbox` could never pass, which meant the gate was never run and
 * therefore protected nothing. A check that cannot pass gets ignored.
 *
 * Paid fulfillment never appears as a literal URL — it is a signed URL minted
 * at request time from the private bucket — so a hardcoded link to anything
 * outside this allowlist is still an error.
 */
const ALLOWED_PUBLIC_DOC_URL = [/\/storage\/v1\/object\/public\/curls-free\//i];

// EPUB is the paid book. It has no legitimate public URL anywhere, including
// the free bucket, so it is never allowlisted.
function isForbiddenDocUrl(url) {
  if (/\.epub\b/i.test(url)) return true;
  return !ALLOWED_PUBLIC_DOC_URL.some((allowed) => allowed.test(url));
}

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

    for (const url of text.match(ABSOLUTE_DOC_URL) ?? []) {
      // Named so the failure says which link is wrong. The old message did not,
      // which is part of why the two false positives went unfixed.
      if (isForbiddenDocUrl(url)) offenders.push(`${rel} links a paid deliverable at a public URL: ${url}`);
    }
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
