# Launch Execution Evidence — July 12, 2026

This report records the follow-up execution against `main` commit
`009e8c9b6dda67f0fb95a0e12ec6aec84ea1e777`. No Production deployment,
automation activation, campaign send, payment, refund, customer-data write, or
destructive cleanup was performed.

## Clean / dirty / blocked

| Area | Result | Evidence |
|---|---|---|
| GitHub source | CLEAN | Repository `miketui/Website` cloned from `main`; corrective work isolated on `codex/launch-assets-worksheet-20260712`. |
| Dependency install | CLEAN WITH NOTE | `pnpm install --frozen-lockfile` completed after routing pnpm's cache into the writable workspace. pnpm reported four ignored dependency build scripts; no broad build-script approval was granted. |
| Lint | CLEAN | `pnpm lint` passed with zero warnings. |
| TypeScript | CLEAN | `pnpm typecheck` passed. |
| Unit tests | CLEAN | 16 test files passed; 76 tests passed. |
| Production build | CLEAN | Next.js production build completed and generated 71 routes/pages. |
| Built-route HTTP smoke | CLEAN | `/`, `/preorder`, `/pricing-kit`, and `/website` each returned HTTP 200 from the local production server. |
| Public deliverables check | CLEAN | Repository check found no paid PDF/EPUB under `public` and no public paid-file URL. |
| Playwright install | BLOCKED LOCALLY / FIXED IN CI | The local sandbox received a zero-byte/truncated archive. GitHub Actions downloaded Chromium successfully; its first run exposed a cache-path mismatch between install and test, corrected by setting one job-level `PLAYWRIGHT_BROWSERS_PATH`. |
| E2E/browser screenshots | PENDING CI RERUN | The first local and CI runs stopped before page execution because the executable was searched for in the wrong/missing cache. The corrective workflow patch aligns install and test paths. |
| Supabase schema/RLS | CLEAN WITH NOTE | Canonical project is healthy; 21 public tables have RLS enabled. Security advisor reports nine INFO notices for RLS-enabled tables with no policies; confirm these are intentionally server-only/deny-all. |
| Supabase Storage | DIRTY / BLOCKED | All four buckets exist and contain zero objects. Twelve public PDFs and 14 private files were prepared and passed archive integrity plus uploader dry run. Binary upload is blocked because no server secret is available to this workspace and the connector exposes no binary upload action. |
| EPUB | BLOCKED | Canonical v13 EPUB was not included in the supplied files. |
| Vercel project | CLEAN WITH NOTE | Project `website` is connected; latest Production deployment is READY at the merge commit. Environment-name listing remains blocked because the native connector omits it and the Zapier helper fails against the Vercel app transport. |
| Vercel runtime | DIRTY / HISTORICAL | The 7-day error view contains six checkout failures from July 9 caused by a missing Stripe price on an older deployment. Confirm no recurrence after the current merge. |
| Zapier | CLEAN WITH NOTE | MailerLite, Resend, Vercel, GitHub, Stripe, and other actions are enabled. The repaired Vercel env-name helper still fails at runtime and is recorded BLOCKED. |
| MailerLite automations | DIRTY / SAFE | All original and replacement workflows remain inactive. The 22 automation HTML bodies remain dashboard-only because the automation API action cannot update visual HTML. |
| MailerLite scheduled campaigns | DIRTY / SAFE | Existing Oct 25, Nov 17, and Nov 23 campaigns remain READY, correctly targeted to Preorders, and still report null API preheaders. They were not unscheduled or altered. |
| MailerLite HTML imports | CLEAN / DRAFT ONLY | Exact supplied HTML for 5.3, 5.4, and 5.5 was imported into three new unscheduled drafts labeled `DO NOT SEND`; approved sender/reply-to and Preorders targeting were used. |
| Resend | CLEAN WITH NOTE | `curlscontemplation.beauty` is verified and sending is enabled. SPF/DKIM/DMARC detail still requires dashboard/DNS confirmation; no email was sent. |
| Stripe | CONNECTED / TEST BLOCKED | Connected account identity was verified. No checkout, charge, refund, webhook replay, or customer mutation was performed. |

## Prepared Supabase asset map

Public bucket `curls-free`:

- five challenge PDFs;
- four quiz-result worksheets;
- Pricing Confidence Checklist;
- Chapter I public excerpt;
- Chapter I printable worksheet.

Private bucket `curls-deliverables`:

- `workbook/Idea-to-Action-Workbook.pdf`;
- complete 12-set Daily Directives bundle;
- 12 individual Daily Directives ZIP archives at the locked paths in
  `lib/deliverables.ts`.

All 13 ZIP archives passed `unzip -t`. The uploader dry run mapped every file to
the intended bucket-relative path. The private EPUB path remains optional and
missing.

## MailerLite draft imports

| Email | Draft campaign | State |
|---|---:|---|
| 5.3 — Thirty-day countdown | `192835731823003432` | Draft, unscheduled, unsent |
| 5.4 — Seven-day countdown | `192835735038985384` | Draft, unscheduled, unsent |
| 5.5 — Tomorrow reminder | `192835738135430798` | Draft, unscheduled, unsent |

The three READY scheduled originals were intentionally left untouched because
MailerLite rejects content updates unless a campaign is returned to draft.
Unscheduling them requires explicit owner approval.

## Remaining approval gates

1. Provide the Supabase server secret through an approved secure shell/CI
   environment, then run the prepared uploader and remote verifier.
2. Provide the canonical v13 EPUB if it should be included.
3. Approve unscheduling the three READY campaigns before replacing their HTML,
   or copy the validated draft content in the dashboard while preserving dates.
4. Install Chromium in CI/a machine image or allow a non-truncated Playwright
   CDN download, then run desktop, iPhone 13, reduced-motion, console, frame,
   and overflow gates.
5. Confirm Vercel environment-variable names in the dashboard. Keep
   `LAUNCH_FULFILLMENT_ENABLED=false`.
6. Run Stripe test checkout/refund and launch dry run only after the required
   test addresses and test-mode scope are explicitly approved.
7. Production deployment, workflow activation, campaign sending, and cleanup
   remain separate approval-gated actions.
