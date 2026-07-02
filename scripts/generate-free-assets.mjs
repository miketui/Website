#!/usr/bin/env node
/**
 * Generates every FREE funnel deliverable as print-ready PDFs, using the
 * book's own ACISS design system (styles + fonts from the v13 EPUB) so the
 * free assets feel like pages of the book they're selling.
 *
 *   node scripts/generate-free-assets.mjs --epub-dir /path/to/extracted-epub
 *
 * --epub-dir must point at an extracted v13 EPUB (the folder containing
 * OEBPS/). Outputs land in assets/free-bucket/ mirroring the `curls-free`
 * bucket paths (see lib/free-assets.ts and content/funnels.ts):
 *
 *   chapter-1/Curls-Ch1-Excerpt.pdf
 *   checklists/Pricing-Confidence-Checklist.pdf
 *   quiz/worksheet-{underpriced-artist,invisible-talent,burned-out-booked,almost-ceo}.pdf
 *   challenge/day-{1..5}-*.pdf
 *
 * Chromium: set PLAYWRIGHT_CHROMIUM_PATH if playwright's managed browser
 * isn't installed (e.g. /opt/pw-browsers/chromium in the CC sandbox).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const epubDirIndex = args.indexOf("--epub-dir");
const epubDirValue = epubDirIndex >= 0 ? args[epubDirIndex + 1] : undefined;
const EPUB_DIR = epubDirValue && !epubDirValue.startsWith("--") ? resolve(epubDirValue) : null;
if (!EPUB_DIR) {
  console.error("Usage: node scripts/generate-free-assets.mjs --epub-dir /path/to/extracted-epub");
  process.exit(1);
}
const XHTML_DIR = join(EPUB_DIR, "OEBPS/xhtml");
const OUT_DIR = resolve(process.cwd(), "assets/free-bucket");
const SITE = "https://curlscontemplation.beauty";

/* ---------- shared HTML scaffolding (book design system) ---------- */

const printOverrides = `
  html { font-size: 100%; }
  body { background: #fff; margin: 0; }
  .page-break { page-break-after: always; break-after: page; height: 0; }
  .x-cover { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;
    text-align: center; background: linear-gradient(160deg, #006666 0%, #008080 55%, #00A86B 140%); color: #fff; padding: 3rem 2.5rem; }
  .x-cover .kicker { font-family: 'Montserrat', Arial, sans-serif; font-weight: 700; font-size: 0.72rem; letter-spacing: 0.34em; color: #E0C564; text-transform: uppercase; }
  .x-cover .rule { width: 72px; height: 2px; background: #D4AF37; margin: 1.4rem auto; }
  .x-cover h1 { font-family: 'Libre Baskerville', Georgia, serif; font-weight: 700; font-size: 2.6rem; line-height: 1.12; margin: 0.4rem 0 0.6rem; }
  .x-cover .amp { color: #D4AF37; }
  .x-cover .subtitle { font-family: 'Libre Baskerville', Georgia, serif; font-style: italic; font-size: 1.02rem; color: rgba(255,255,255,0.92); max-width: 30ch; margin: 0 auto; }
  .x-cover .author { font-family: 'Montserrat', Arial, sans-serif; font-size: 0.8rem; letter-spacing: 0.28em; text-transform: uppercase; margin-top: 2.2rem; color: rgba(255,255,255,0.85); }
  .x-cta { min-height: 96vh; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 3rem 2.6rem; }
  .x-cta h2 { font-family: 'Libre Baskerville', Georgia, serif; font-size: 1.7rem; color: #006666; line-height: 1.25; }
  .x-cta p { font-family: 'Libre Baskerville', Georgia, serif; font-size: 0.98rem; color: #444; line-height: 1.7; max-width: 46ch; margin: 0.7rem auto; }
  .x-cta .price { font-family: 'Montserrat', Arial, sans-serif; font-weight: 700; color: #B8962E; }
  .x-cta .button { display: inline-block; margin: 1.4rem auto 0.4rem; padding: 0.95rem 2.6rem; border-radius: 999px; background: #008080; color: #fff;
    font-family: 'Montserrat', Arial, sans-serif; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; font-size: 0.78rem; text-decoration: none; }
  .x-cta .url { font-family: 'Montserrat', Arial, sans-serif; font-size: 0.8rem; color: #008080; letter-spacing: 0.06em; }
  .ws-head { border-bottom: 3px solid #008080; padding-bottom: 0.9rem; margin-bottom: 1.4rem; }
  .ws-head .kicker { font-family: 'Montserrat', Arial, sans-serif; font-weight: 700; font-size: 0.68rem; letter-spacing: 0.3em; color: #B8962E; text-transform: uppercase; }
  .ws-head h1 { font-family: 'Libre Baskerville', Georgia, serif; font-size: 1.85rem; color: #006666; margin: 0.35rem 0 0.35rem; line-height: 1.15; }
  .ws-head .lede { font-family: 'Libre Baskerville', Georgia, serif; font-style: italic; color: #444; font-size: 0.95rem; margin: 0; }
  .ws-section { margin: 1.35rem 0; page-break-inside: avoid; }
  .ws-section h2 { font-family: 'Montserrat', Arial, sans-serif; font-size: 0.95rem; letter-spacing: 0.08em; text-transform: uppercase; color: #008080; border-left: 4px solid #D4AF37; padding-left: 0.6rem; margin: 0 0 0.5rem; }
  .ws-section p, .ws-section li { font-family: 'Libre Baskerville', Georgia, serif; font-size: 0.92rem; color: #333; line-height: 1.65; }
  .ws-line { border-bottom: 1px solid #b9d6d6; height: 1.85rem; }
  .ws-check { display: flex; gap: 0.6rem; align-items: flex-start; margin: 0.5rem 0; font-family: 'Libre Baskerville', Georgia, serif; font-size: 0.92rem; color: #333; line-height: 1.5; }
  .ws-check .box { flex: 0 0 auto; width: 0.95rem; height: 0.95rem; border: 2px solid #008080; border-radius: 3px; margin-top: 0.18rem; }
  table.ws-table { width: 100%; border-collapse: collapse; margin: 0.6rem 0; }
  table.ws-table th { background: #008080; color: #fff; font-family: 'Montserrat', Arial, sans-serif; font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; padding: 0.45rem 0.55rem; text-align: left; }
  table.ws-table td { border: 1px solid #cfe3e3; padding: 0.85rem 0.55rem; font-family: 'Libre Baskerville', Georgia, serif; font-size: 0.88rem; }
  table.ws-table tr:nth-child(even) td { background: #f4faf8; }
  .ws-callout { background: rgba(0,128,128,0.07); border-left: 4px solid #008080; padding: 0.75rem 0.9rem; font-family: 'Libre Baskerville', Georgia, serif; font-style: italic; font-size: 0.9rem; color: #006666; margin: 1rem 0; }
  .ws-footer { margin-top: 1.6rem; padding-top: 0.7rem; border-top: 2px solid #D4AF37; display: flex; justify-content: space-between; align-items: baseline; }
  .ws-footer .brand { font-family: 'Montserrat', Arial, sans-serif; font-size: 0.66rem; letter-spacing: 0.24em; text-transform: uppercase; color: #B8962E; }
  .ws-footer .cta { font-family: 'Montserrat', Arial, sans-serif; font-size: 0.7rem; color: #008080; }
`;

function docShell(title, bodyHtml) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<title>${title}</title>
<link href="../style/fonts.css" rel="stylesheet"/>
<link href="../style/style.css" rel="stylesheet"/>
<style>${printOverrides}</style>
</head><body>${bodyHtml}</body></html>`;
}

const lines = (n) => Array.from({ length: n }, () => '<div class="ws-line"></div>').join("");
const checks = (items) => items.map((t) => `<div class="ws-check"><span class="box"></span><span>${t}</span></div>`).join("");
const section = (h, inner) => `<div class="ws-section"><h2>${h}</h2>${inner}</div>`;
const wsFooter = `<div class="ws-footer"><span class="brand">Curls &amp; Contemplation · Michael David</span><span class="cta">The full system is in the book → ${SITE.replace("https://", "")}</span></div>`;

function worksheetDoc({ kicker, title, lede, sections }) {
  return docShell(title, `<main style="padding:0.35in 0.15in;">
<header class="ws-head"><p class="kicker">${kicker}</p><h1>${title}</h1><p class="lede">${lede}</p></header>
${sections.join("\n")}
${wsFooter}
</main>`);
}

/* ---------- worksheet content ---------- */

const quizWorksheets = [
  {
    out: "quiz/worksheet-underpriced-artist.pdf",
    kicker: "Blind-Spot Quiz · Your Archetype",
    title: "The Underpriced Artist — Rate Floor Worksheet",
    lede: "Your hands are senior. Your prices are junior. This page closes the gap with arithmetic, not a pep talk.",
    sections: [
      section("1 · What a service actually costs you", `<table class="ws-table"><tr><th>Line item</th><th>Per month ($)</th></tr>
        <tr><td>Product, tools, kit replenishment</td><td></td></tr><tr><td>Chair rent / studio / travel</td><td></td></tr>
        <tr><td>Insurance, licenses, education</td><td></td></tr><tr><td>Software, booking, card fees</td><td></td></tr>
        <tr><td>The salary you intend to pay yourself</td><td></td></tr><tr><td><strong>Total monthly cost of being you</strong></td><td></td></tr></table>`),
      section("2 · Your rate floor", `<p>Total monthly cost ÷ client-facing hours you actually book (not hours you're “available”) = the hourly number below which every appointment quietly costs you money.</p>${lines(2)}
        <div class="ws-callout">If your current signature-service price sits below this floor, the discomfort you feel quoting it is not fear — it's accuracy.</div>`),
      section("3 · Say it out loud", `<p>Write the exact sentence you will say the next time a client asks your rate. No apology clause. No “but.” Then read it aloud twice.</p>${lines(3)}`),
      section("4 · The 30-day raise plan", checks([
        "Pick the one service where you are most underpriced and set its corrected price today.",
        "Tell your next three bookings the new rate — existing clients get one cycle of notice, not a discount.",
        "Track every flinch: note who said yes without blinking. (Most will.)",
        "On day 30, run this sheet again with real numbers."
      ]))
    ]
  },
  {
    out: "quiz/worksheet-invisible-talent.pdf",
    kicker: "Blind-Spot Quiz · Your Archetype",
    title: "The Invisible Talent — Visibility Plan",
    lede: "The work is excellent and the room doesn't know it. Visibility is the client experience starting before the chair.",
    sections: [
      section("1 · Where does your work currently get seen?", `<table class="ws-table"><tr><th>Surface</th><th>Last updated</th><th>Shows your best work? (y/n)</th></tr>
        <tr><td>Portfolio / website</td><td></td><td></td></tr><tr><td>Instagram / TikTok grid</td><td></td><td></td></tr>
        <tr><td>Google / booking profile</td><td></td><td></td></tr><tr><td>Word of mouth (what do clients say?)</td><td></td><td></td></tr></table>`),
      section("2 · Proof inventory", `<p>List five finished looks from the last 90 days that deserve to be seen, and where each one will be posted this week.</p>${lines(5)}`),
      section("3 · Three rooms you're not in", `<p>Name three rooms — a set, an assisting gig, an association, a stylist's DMs — where the people who book work like yours actually are. One concrete step into each:</p>${lines(4)}`),
      section("4 · The introduction script", `<p>Complete it, then send it to one person today: “I'm ______, I do ______ — the piece of my work I'd love to show you is ______.”</p>${lines(3)}`)
    ]
  },
  {
    out: "quiz/worksheet-burned-out-booked.pdf",
    kicker: "Blind-Spot Quiz · Your Archetype",
    title: "The Burned-Out Booked — Energy Ledger",
    lede: "A full calendar that quietly empties you is a rhythm problem wearing a busy costume. The ledger tells the truth.",
    sections: [
      section("1 · The ledger", `<table class="ws-table"><tr><th>Service / client type</th><th>Income</th><th>Energy cost (1–10)</th><th>Keep · Reprice · Release</th></tr>
        <tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr>
        <tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></table>
        <div class="ws-callout">Anything high-energy-cost and low-income is paying you in exhaustion. That's the row to reprice or release first.</div>`),
      section("2 · Calendar redesign", checks([
        "Block one weekday that never takes bookings — recovery is a business expense.",
        "Cluster same-type services on the same days (context-switching is an invisible energy tax).",
        "Set a hard last-appointment time and put it in your booking rules tonight.",
        "Raise the price of the single most draining service by enough that yes feels fair."
      ])),
      section("3 · The boundary script", `<p>Write the two sentences you'll use when a request breaks your new rules (late add-on, day-off booking, “quick” extra). Kind, short, final.</p>${lines(3)}`),
      section("4 · What refills you", `<p>Three things that reliably restore you, and the day this week each one goes on the calendar — with the same weight as a paying client.</p>${lines(3)}`)
    ]
  },
  {
    out: "quiz/worksheet-almost-ceo.pdf",
    kicker: "Blind-Spot Quiz · Your Archetype",
    title: "The Almost-CEO — Instinct to System Map",
    lede: "You already lead. This page turns instinct into a repeatable map you can scale without losing the craft.",
    sections: [
      section("1 · Codify your standards", `<p>List four things you always do that make your work yours — the things an assistant would have to learn to represent you.</p>${lines(4)}`),
      section("2 · What only you can do", `<table class="ws-table"><tr><th>Task on your plate</th><th>Only-me? (y/n)</th><th>If no — who / what takes it</th></tr>
        <tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>`),
      section("3 · The 90-day CEO block", `<p>One recurring hour per week that is CEO time — pricing, pipeline, positioning. Which hour, and what is the first agenda?</p>${lines(3)}`),
      section("4 · The next room", checks([
        "Name the leadership room you belong in next (education, on-set lead, studio owner, brand work).",
        "Identify the one person already there whose path you can study — and reach out this week.",
        "Write the 3-sentence version of your vision and read it before every CEO block.",
        "Date your first delegated task — this month, not “someday.”"
      ]))
    ]
  }
];

const challengeWorksheets = [
  {
    out: "challenge/day-1-rate-floor.pdf",
    kicker: "5-Day Challenge · Day 1 · Price",
    title: "Price Like a Professional — The Rate Floor",
    lede: "Today you find the number below which every appointment costs you money — then you stop quoting below it.",
    sections: [
      section("1 · Monthly cost of being you", `<table class="ws-table"><tr><th>Line item</th><th>$ / month</th></tr>
        <tr><td>Product, tools, kit</td><td></td></tr><tr><td>Rent / travel / studio</td><td></td></tr><tr><td>Insurance, education, software, fees</td><td></td></tr>
        <tr><td>Your salary (the one you'd accept from an employer)</td><td></td></tr><tr><td><strong>Total</strong></td><td></td></tr></table>`),
      section("2 · The floor", `<p>Total ÷ hours you actually serve clients each month = your rate floor. Write it big:</p>${lines(2)}`),
      section("3 · Tonight's action", checks([
        "Compare your three most-booked services to the floor.",
        "Correct the worst offender's price before you sleep.",
        "Write tomorrow's quote sentence — no apology clause."
      ]))
    ]
  },
  {
    out: "challenge/day-2-networking-script.pdf",
    kicker: "5-Day Challenge · Day 2 · Pitch",
    title: "The Room You're Not In — Networking Script",
    lede: "Some people walk into a room and the room adjusts. Today you write the script nobody handed you.",
    sections: [
      section("1 · Pick the room", `<p>The one room (set, salon, association, artist's team) that would change your next twelve months:</p>${lines(2)}`),
      section("2 · Build the script", `<p><em>Who you are:</em> one sentence, craft-first.</p>${lines(2)}<p><em>The specific work you want to be known for:</em></p>${lines(2)}<p><em>The ask — small, concrete, easy to grant:</em></p>${lines(2)}`),
      section("3 · Send it", checks([
        "Say the script out loud until it stops sounding like a script.",
        "Send one message today to someone in that room.",
        "Log the reply (or silence) — both are data, neither is a verdict."
      ]))
    ]
  },
  {
    out: "challenge/day-3-set-day-checklist.pdf",
    kicker: "5-Day Challenge · Day 3 · Pitch",
    title: "Etiquette That Books Repeat Work — Set-Day Checklist",
    lede: "Nobody trains you on when to speak, when to disappear, or how fast to move when the schedule collapses. Now it's written down.",
    sections: [
      section("Before call time", checks([
        "Kit packed against the brief, not against habit — plus the one thing nobody asked for.",
        "Names memorized: photographer, producer, key MUA, talent handler.",
        "Arrive 15 early; find your station and the power outlets before you're asked."
      ])),
      section("On set", checks([
        "Match the room's volume. The set's energy is the client.",
        "Fix quietly; flag loudly only what risks the shot.",
        "When the schedule collapses, your job is speed without visible stress.",
        "Touch-ups: be near, not hovering. Watch the monitor, not your phone."
      ])),
      section("After wrap", checks([
        "Leave the station cleaner than you found it.",
        "Thank the two people who made your work possible today — by name.",
        "Within 48h: one follow-up message with a specific detail from the day."
      ])),
      section("Your additions", `<p>The three rules you've learned by flinching — write them so you never relearn them:</p>${lines(3)}`)
    ]
  },
  {
    out: "challenge/day-4-energy-income-audit.pdf",
    kicker: "5-Day Challenge · Day 4 · Protect",
    title: "The Burnout Ledger — Energy vs. Income Audit",
    lede: "The book stays full, the hands stay steady, and something underneath runs on fumes. Today you audit that part.",
    sections: [
      section("1 · Ledger", `<table class="ws-table"><tr><th>Regular service / client</th><th>Income</th><th>Energy (1–10)</th><th>Keep · Reprice · Release</th></tr>
        <tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></table>`),
      section("2 · Protect one thing", `<p>The single boundary that would return the most energy (a day, an hour, a service, a client type) — and the sentence that enforces it:</p>${lines(3)}`),
      section("3 · Tonight", checks([
        "Put the recovery block on next week's calendar before any booking can take it.",
        "Draft the reprice/release message for the worst ledger row.",
        "Tell one person your new boundary — witnesses make it real."
      ]))
    ]
  },
  {
    out: "challenge/day-5-career-map.pdf",
    kicker: "5-Day Challenge · Day 5 · The Pitch",
    title: "Put It Together — Your Career Map",
    lede: "Four days of pieces become one page you can act on. This is the map nobody handed you.",
    sections: [
      section("1 · The floor (Day 1)", `<p>My rate floor is ______. The service I corrected: ______. First yes at the new price:</p>${lines(1)}`),
      section("2 · The room (Days 2–3)", `<p>The room I'm entering, the person I contacted, and the next touchpoint:</p>${lines(2)}`),
      section("3 · The boundary (Day 4)", `<p>What I now protect, in one sentence:</p>${lines(2)}`),
      section("4 · 90-day map", `<table class="ws-table"><tr><th>Horizon</th><th>The move</th><th>Done by</th></tr>
        <tr><td>30 days</td><td></td><td></td></tr><tr><td>60 days</td><td></td><td></td></tr><tr><td>90 days</td><td></td><td></td></tr></table>
        <div class="ws-callout">The chapters of Curls &amp; Contemplation are sequenced to walk this exact map — pricing, visibility, rhythm, leadership — with a worksheet in every one.</div>`)
    ]
  }
];

const pricingChecklist = {
  out: "checklists/Pricing-Confidence-Checklist.pdf",
  kicker: "Free Companion · Curls & Contemplation",
  title: "The Pricing Confidence Checklist",
  lede: "Run this before you quote anyone again. Ten checks between you and a number you can say without flinching.",
  sections: [
    section("Know your number", checks([
      "I know my total monthly cost of operating (product, rent, insurance, software, education, my salary).",
      "I know how many client-facing hours I actually book per month — not hours I'm “available.”",
      "I have divided one by the other. I know my rate floor.",
      "Every listed service currently sits at or above that floor."
    ])),
    section("Say your number", checks([
      "My quote is one sentence with no apology clause and no “but.”",
      "I state the number and then stop talking.",
      "My deposit and cancellation terms are written where clients see them before booking.",
      "Existing clients get one cycle of notice for a raise — notice, not a negotiation."
    ])),
    section("Hold your number", checks([
      "I have a kind, short, final sentence ready for “can you do it for less?”",
      "I track who says yes without blinking — evidence beats fear, and most people blink less than you think."
    ])),
    `<div class="ws-callout">Chapter VI of <em>Curls &amp; Contemplation</em> — “Mastering the Business of Hairstyling” — builds the full pricing system behind this card, with a guided worksheet in every chapter.</div>`
  ]
};

/* ---------- chapter 1 excerpt ---------- */

function buildChapterExcerpt() {
  const chapterFile = join(XHTML_DIR, "9-chapter-i-unveiling-your-creative-odyssey.xhtml");
  const source = readFileSync(chapterFile, "utf8");
  const main = source.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1];
  if (!main) throw new Error("Could not extract <main> from chapter 1 XHTML");

  const cover = `<section class="x-cover">
    <p class="kicker">Free Chapter · From the Book</p>
    <div class="rule"></div>
    <h1>Curls <span class="amp">&amp;</span><br/>Contemplation</h1>
    <p class="subtitle">A Freelance Hairstylist's Guide to Creative Excellence</p>
    <div class="rule"></div>
    <p class="kicker" style="color:#fff;">Chapter I — Unveiling Your Creative Odyssey</p>
    <p class="author">Michael David</p>
  </section><div class="page-break"></div>`;

  const cta = `<div class="page-break"></div><section class="x-cta">
    <h2>Chapter I is where the book starts.<br/>The business is what it builds.</h2>
    <p>Fifteen more chapters walk the whole map — pricing you can say out loud, networking without the cringe, on-set etiquette, burnout, leadership — with a guided worksheet in every chapter, like the one you just used.</p>
    <p>The direct edition is <span class="price">$17.99</span> through the first fifteen days after release, then $19.99 permanently. No countdown games — just the real schedule.</p>
    <p><span class="button">Preorder the Book</span></p>
    <p class="url">${SITE.replace("https://", "")}/preorder</p>
  </section>`;

  const html = docShell("Curls & Contemplation — Chapter 1 (Free Excerpt)", `${cover}<main>${main}</main>${cta}`);
  const tempPath = join(XHTML_DIR, "__excerpt.html");
  writeFileSync(tempPath, html);
  return tempPath;
}

/* ---------- render ---------- */

async function main() {
  const { chromium } = require("playwright");
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const page = await browser.newPage();

  async function renderFile(htmlPath, outRel, pdfOptions) {
    const out = join(OUT_DIR, outRel);
    mkdirSync(join(out, ".."), { recursive: true });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
    await page.pdf({ path: out, printBackground: true, ...pdfOptions });
    console.log(`✓ ${outRel}`);
  }

  async function renderWorksheet(doc) {
    const tempPath = join(XHTML_DIR, "__worksheet.html");
    writeFileSync(tempPath, worksheetDoc(doc));
    await renderFile(tempPath, doc.out, { format: "Letter", margin: { top: "0.6in", bottom: "0.6in", left: "0.7in", right: "0.7in" } });
  }

  const excerptPath = buildChapterExcerpt();
  await renderFile(excerptPath, "chapter-1/Curls-Ch1-Excerpt.pdf", { width: "6in", height: "9in", margin: { top: "0.55in", bottom: "0.6in", left: "0.6in", right: "0.6in" } });

  await renderWorksheet(pricingChecklist);
  for (const doc of quizWorksheets) await renderWorksheet(doc);
  for (const doc of challengeWorksheets) await renderWorksheet(doc);

  await browser.close();
  console.log(`\nAll free assets written to ${OUT_DIR}`);
}

await main();
