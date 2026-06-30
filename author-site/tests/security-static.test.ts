import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
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
    const files = walk(process.cwd()).filter((file) => !file.includes("node_modules") && !file.includes(".next") && !file.includes("/docs/") && !file.includes("/setup/") && /\.(ts|tsx|css|md|mjs|json)$/.test(file));
    const offenders = files.filter((file) => deprecatedValues.some((value) => readFileSync(file, "utf8").includes(value)));
    expect(offenders).toEqual([]);
  });
});
