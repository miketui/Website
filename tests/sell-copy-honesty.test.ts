import { existsSync, globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { book } from "@/content/book";
import { bookJsonLd, productJsonLd } from "@/lib/schema";

const repoFile = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

/**
 * Locks the 2026-09-15 CoS honesty pass: page count matches the digital PDF
 * master (384), sell copy does not promise fillable/AcroForm fields, and book
 * product binaries are not in this git tree.
 */
describe("sell-copy honesty — 384 pages, worksheet language, no book binaries", () => {
  it("locks numberOfPages and JSON-LD to the digital PDF master", () => {
    expect(book.numberOfPages).toBe(384);
    expect(bookJsonLd().numberOfPages).toBe(384);
    expect(book.description).toContain("384");
    expect(book.description).toMatch(/worksheet/i);
    expect(book.description).not.toMatch(/interactive guide/i);
    expect(productJsonLd().description).toBe(book.description);
  });

  it("does not advertise 467 pages or fillable form fields on public surfaces", () => {
    const surfaces = globSync("{app,content,components,lib,marketing}/**/*.{ts,tsx,md,html}", {
      cwd: process.cwd()
    });
    const stalePageCount = /467-page|467 pages|numberOfPages:\s*467/i;
    const fillablePromise = /\bfillable\b|AcroForm/i;
    const pageCountHits: string[] = [];
    const fillableHits: string[] = [];

    for (const file of surfaces) {
      const source = repoFile(file);
      if (stalePageCount.test(source)) pageCountHits.push(file);
      if (fillablePromise.test(source)) fillableHits.push(file);
    }

    expect(pageCountHits, `stale 467-page claims in: ${pageCountHits.join(", ")}`).toEqual([]);
    expect(fillableHits, `fillable/AcroForm promises in: ${fillableHits.join(", ")}`).toEqual([]);
  });

  it("has no book product PDF/EPUB in the working tree", () => {
    const forbidden = [
      "assets/free-bucket/chapter/Chapter-1-Free-Excerpt.pdf",
      "assets/free-bucket/chapter-1/Curls-Ch1-Excerpt.pdf",
      "release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub",
      "release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf"
    ];
    for (const path of forbidden) {
      expect(existsSync(resolve(process.cwd(), path)), path).toBe(false);
    }

    const leftovers = globSync("**/*.{epub,EPUB}", { cwd: process.cwd() }).filter(
      (file) => !file.includes("node_modules") && !file.includes(".next")
    );
    expect(leftovers, `book EPUB still in tree: ${leftovers.join(", ")}`).toEqual([]);
  });

  it("does not promise a book PDF alongside the EPUB on cart/checkout/buy surfaces", () => {
    // Fulfillment ships EPUB only. The workbook printable PDF is a separate SKU.
    const surfaces = globSync("{app,content,components,lib}/**/*.{ts,tsx}", {
      cwd: process.cwd()
    });
    const bookBothFormats = /EPUB\s*\+\s*PDF|PDF\s*\+\s*EPUB/i;
    const hits: string[] = [];
    for (const file of surfaces) {
      const source = repoFile(file);
      if (bookBothFormats.test(source)) hits.push(file);
    }
    expect(hits, `EPUB + PDF book claims in: ${hits.join(", ")}`).toEqual([]);

    const cart = repoFile("lib/cart.tsx");
    expect(cart).toContain('tagline: "EPUB · 16 chapters · every worksheet"');
    expect(cart).toContain("printable PDF");
  });
});
