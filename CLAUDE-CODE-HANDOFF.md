# Claude Code Handoff — Remaining Launch Work

Use this after reviewing `docs/LAUNCH-VERIFICATION-2026-07-12.md`. Do not merge, deploy Production, send marketing email, charge a card, delete a campaign, or modify customer data without Michael's explicit approval.

## 1. MailerLite dashboard punchlist

All ten workflows were re-read on July 12, 2026 and are now paused (`enabled: false`). This is the safe state for dashboard editing. The connected MailerLite1 app exposes subject/plain-text and delay-duration updates, but it cannot reorder steps, update HTML bodies/internal names, set automation preheaders, or change automation sender addresses. Every dirty workflow requires at least one unsupported operation, so partial writes were intentionally avoided to prevent new subject/body mismatches. In MailerLite, correct each paused automation against `docs/MAILERLITE-AUTOMATION-EMAIL-LIBRARY.md`, test with an approved test subscriber, then re-enable only after acceptance.

| Automation | Required dashboard correction | Acceptance criteria |
|---|---|---|
| `192795046686229893` | Put Kit delivery first; wait 1 day; send pricing question; wait 3 days; send talent/structure. Add approved preview text to all 3 emails. | Test subscriber receives 2.1 immediately, 2.2 after simulated 1d, 2.3 after simulated 3d; subjects and internal names match. |
| `192795053311132895` | Personalized result immediately; wait 2d; pattern interruption; wait 3d; book bridge. Reattach each subject/internal name to its matching body. Add preview text. | `quiz_result_name` renders from the verified field; no bracket placeholder remains; three subjects/bodies are aligned. |
| `192795055972419267` | Confirmation immediately; wait 2d; emotional reinforcement. Replace crossed preview text. | Confirmation is first and names November 24; reinforcement is second. |
| `192795058197497739` | Wait 1d/welcome; wait 3d/reflection; wait 7d/workbook; wait 14d/feedback. Reattach subjects/internal names and add previews. | Four bodies, subjects, names, delays, and CTAs match Automation 6 source exactly. |
| `192795061713372667` | Wait 1h/reminder; wait 23h/details; wait 48h/final. Add the first preview. Confirm successful payment immediately removes/excludes the subscriber. | Total sends occur at approximately 1h, 24h, and 72h; paid/refunded subscribers receive nothing further. |
| `192795267020358662` | Wait 2h; Reminder 1; wait 22h; Reminder 2. Replace previews with approved copy. | Completed claims exit immediately; no reminder fires after completion. |
| `192795274605758257` | Change sender email to `info@curlscontemplation.beauty`; add approved preview. | One immediate access email; brand-domain sender; correct workbook link. |
| `192795281369073567` | Delivery immediately; wait 1d/ritual; wait 3d/practice; wait 6d/bundle-or-feedback. Repair crossed subjects/internal names, normalize sender to `info@curlscontemplation.beauty`, add previews, and branch bundle owners away from the upsell. | Individual-set and bundle-owner test paths both pass; no bundle owner receives the bundle upsell. |

Scheduled campaigns:

1. Add the exact preview text from Automation 5 emails 5.3, 5.4, and 5.5.
2. Confirm all three target **Preorders only** and use the correct account timezone.
3. Confirm IDs/dates: `192795454682957112` (Oct 25), `192795457777304695` (Nov 17), `192795460957636199` (Nov 23), all 09:00 account time.
4. Leave draft `192808511238833684` unsent. Archive/delete only after Michael approves that destructive cleanup.

## 2. Vercel environment and redeploy gate

1. Use the 13-key exact-value table in `docs/LAUNCH-VERIFICATION-2026-07-12.md`.
2. Verify all keys by name in project `website`; do not expose secret values in logs or commits.
3. Ensure `LAUNCH_FULFILLMENT_ENABLED=false`, and configure approved addresses for `LAUNCH_DRYRUN_TEST_EMAIL` and `LAUNCH_OWNER_EMAIL` plus a strong `CRON_SECRET`.
4. Redeploy Preview first. Run lint, typecheck, unit tests, build, and the three-page browser check.
5. Production redeployment requires a fresh explicit approval.

## 3. Supabase deliverables

Canonical project: `comfnluqjhnmbxfvvjeo`. Schema and RLS exist; all four Storage buckets currently have zero objects.

Required before November 23:

- The repository uploader and verifier now accept the current server-only `SUPABASE_SECRET_KEY`; legacy `SUPABASE_SERVICE_ROLE_KEY` remains a fallback. Never paste either key into chat or a commit.
- Configure `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `SUPABASE_STORAGE_BUCKET=curls-deliverables` in a secure shell/CI environment. The remote verifier no longer incorrectly requires a browser publishable/anon key for a server-side Storage check.

- Upload the public pricing-kit/quiz/challenge PDFs to `curls-free` using the repository manifest.
- Upload private workbook and Daily Directives archives to `curls-deliverables` using the locked paths in `lib/deliverables.ts`.
- Upload the canonical v13 EPUB to `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
- Never upload the POD interior as a site deliverable.
- Run Storage path verification and confirm private objects are not publicly readable.

Acceptance: every expected path exists, paid assets are private, signed URLs work for entitled test users, and an unauthenticated request cannot retrieve paid files.

Current blocker: the Supabase connector does not expose binary Storage upload, all four live buckets are empty, and the private workbook/Daily Directives/EPUB files are not present in this repository. Once the private source directory and server secret are available securely, run:

```bash
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SECRET_KEY=... \
  node scripts/upload-deliverables.mjs --private-dir /secure/path/to/private-deliverables
npm run check:supabase-storage
```

## 4. Resend DNS and transactional test

The Zapier domain checker is blocked. In Resend Dashboard, confirm Verified + sending enabled + SPF/DKIM pass; confirm DMARC with the DNS provider. Then perform one owner-approved transactional test. Do not send until approval includes the recipient address.

Acceptance: correct brand-domain From/Reply-To, inbox arrival, working secure link, no exposed token in logs, and expected template alias.

## 5. Checkout and fulfillment test

Run in Stripe test mode only:

1. New preorder checkout succeeds.
2. Stripe webhook writes order/purchase entitlement once; replay remains idempotent.
3. Customer enters MailerLite Preorders/Customers and exits Abandoned Checkout.
4. Dashboard/download entitlement appears.
5. Test refund revokes entitlement and prevents later marketing recovery.
6. November 23 dry run returns `ok: true`, empty warnings, sends only to `LAUNCH_DRYRUN_TEST_EMAIL`, and writes `launch_ebook_dryrun` without touching purchases.
7. Keep the kill-switch false after the test.

## 6. FELT/design follow-up

- Replace the preorder working-hands gradient placeholder with approved real footage/image; preserve reduced-motion fallback and layout dimensions.
- Consider adding one approved checklist preview to `/pricing-kit` without exposing paid book content.
- Confirm the six home images with empty alt text are decorative; add meaningful alt only where the image conveys content.
- Re-run desktop and mobile screenshots plus console/overflow checks.
- `/website` now renders the same immersive canvas experience as `/journey`: 90 desktop and 90 mobile WebP frames, scroll-depth choreography, ambient particles, and static fallbacks for reduced-motion, save-data, and low-memory visitors. Verify this new route in Preview before Production approval.
- Do not re-extract `public/curl-scrub.mp4` until Michael explicitly approves the proposed 90-frame extraction from the reviewed animated-website skill.

## Final acceptance gate

Do not enable `LAUNCH_FULFILLMENT_ENABLED=true` until all of these are green: MailerLite order/previews/senders, Resend DNS, Supabase objects, Stripe test purchase/refund, November 23 dry run, owner inbox check, and an approved Production deployment.
