# Free funnel assets — staged for the `curls-free` bucket

Every file in this folder mirrors its exact path in the **public** Supabase
Storage bucket `curls-free`. These are the free lead-magnet deliverables the
funnels reference (see `lib/free-assets.ts` and `content/funnels.ts`):

| Path | Funnel surface |
|---|---|
| `checklists/Pricing-Confidence-Checklist.pdf` | Pricing Confidence Kit (`/pricing-kit`) |
| `chapter/Chapter-1-Free-Excerpt.pdf` | Public Chapter I book excerpt |
| `chapter/Chapter-1-Worksheet.pdf` | Chapter I excerpt companion |
| `quiz/worksheet-*.pdf` (4) | Blind-Spot Quiz result pages (`/quiz`) |
| `challenge/day-*.pdf` (5) | 5-Day Price/Pitch/Protect Challenge (`/challenge`) |

**Paid files never live here or anywhere in this repo** — the Daily Directives ZIPs,
the Idea-to-Action Workbook, and later the EPUB go straight to the private
`curls-deliverables` bucket (see `docs/curls-launch-day-runbook.md`).

Upload everything: `node scripts/upload-deliverables.mjs` (uses
`SUPABASE_SERVICE_ROLE_KEY`; add `--private-dir` for the paid files).

Regenerate the checklist, Chapter I companion, quiz worksheets, and private
workbook staging output: `python scripts/generate-launch-pdfs.py`.
