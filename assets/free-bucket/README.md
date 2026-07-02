# Free funnel assets — staged for the `curls-free` bucket

Every file in this folder mirrors its exact path in the **public** Supabase
Storage bucket `curls-free`. These are the free lead-magnet deliverables the
funnels reference (see `lib/free-assets.ts` and `content/funnels.ts`):

| Path | Funnel surface |
|---|---|
| `chapter-1/Curls-Ch1-Excerpt.pdf` | Free Chapter tripwire (`/free-chapter`) |
| `checklists/Pricing-Confidence-Checklist.pdf` | Free Chapter email companion |
| `quiz/worksheet-*.pdf` (4) | Blind-Spot Quiz result pages (`/quiz`) |
| `challenge/day-*.pdf` (5) | 5-Day Price/Pitch/Protect Challenge (`/challenge`) |

**Paid files never live here or anywhere in this repo** — the v13 EPUB, the
POD PDF, and the Idea-to-Action Workbook go straight to the private
`curls-deliverables` bucket (see `docs/curls-launch-day-runbook.md`).

Upload everything: `node scripts/upload-deliverables.mjs` (uses
`SUPABASE_SERVICE_ROLE_KEY`; add `--private-dir` for the paid files).

Regenerate from the v13 EPUB: `node scripts/generate-free-assets.mjs --epub-dir <extracted-epub>`.
