import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/** Directories that can never contain app source — pruned during the walk
 *  (not after) so the scan stays fast enough for the 5s test timeout on
 *  slower filesystems (observed ~90s unpruned on Windows). */
const PRUNED_DIRS = new Set(["node_modules", ".next", ".git", "docs", "setup"]);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (PRUNED_DIRS.has(name)) return [];
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe("static security checks", () => {
  it("does not place paid epub/pdf files in public", () => {
    const files = walk(join(process.cwd(), "public"));
    expect(files.filter((file) => /\.(epub|pdf)$/i.test(file))).toEqual([]);
  });

  it("does not use deprecated hex colors in app source", () => {
    const deprecatedValues = ["0E0D0B", "B89968", "1F6F6B", "2B9999", "C9A961"].map((value) => `#${value}`);
    // Scan only files where a color is actually *applied* — TS/TSX/CSS/MJS. Markdown
    // docs and JSON manifests (e.g. the motion manifest's `bannedTokens` field) legitimately
    // list these hexes precisely to forbid them; scanning them flags the guard's own
    // reference data as a violation. Applied styling can only live in the scanned types.
    const files = walk(process.cwd()).filter((file) => /\.(ts|tsx|css|mjs)$/.test(file));
    const offenders = files.filter((file) => deprecatedValues.some((value) => readFileSync(file, "utf8").includes(value)));
    expect(offenders).toEqual([]);
  });
});
