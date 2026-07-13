# Launch Completion Runbook — July 12, 2026

This is the evidence-first procedure for completing the remaining launch work.
Never paste credential values into chat, logs, screenshots, commits, or this
document. Do not enable automations, send email, charge or refund a card, write
customer PII, merge to `main`, deploy Production, or delete/archive campaigns
without Michael's separate explicit approval for that action.

## Current checkpoint

| Area | Current state | Next action |
|---|---|---|
| GitHub | Draft PR #31; CI run 75 is green, including Chromium E2E | Review; merge requires approval |
| MailerLite automation HTML | 0 of 22 bodies imported | Complete the dashboard procedure below |
| MailerLite scheduled HTML | 3 of 3 bodies imported into new unscheduled `DO NOT SEND` drafts | Preview and compare; do not send |
| Supabase Storage | Four buckets exist; zero remote objects | Securely run the prepared uploader |
| Vercel | Production is READY; Preview created from the PR | Verify environment names and Preview routes |
| Resend | Domain reports verified and sending enabled | Confirm SPF, DKIM, and DMARC; approved test only |
| Stripe | Connector is present; no transaction performed | Run test-mode acceptance only after approval |

## 1. MailerLite — install the 22 automation bodies

Source files are under `marketing/mailerlite/2026-07-12/html/`. Use
`marketing/mailerlite/2026-07-12/setup-matrix.csv` as the exact source of
internal name, subject, preheader, sender, reply-to, CTA, destination, and
timing. Do not rewrite the supplied copy.

For each workflow below:

1. Open the listed `FIXED DRAFT ... DO NOT ENABLE` automation.
2. Confirm the automation toggle is inactive before editing.
3. Open the first email step, then choose its design/content editor.
4. Select **Custom HTML** or **Import HTML**, depending on the dashboard label.
5. Paste/import the exact listed HTML file into the message body.
6. Copy the exact internal name, subject, preheader, From name, From email, and
   Reply-to from `setup-matrix.csv`.
7. Keep MailerLite's required account footer/address block enabled. Confirm
   `{$unsubscribe}` and `{$preferences}` are accepted.
8. Save the email, return to the automation, and repeat for the next step.
9. Do not enable the automation.

| Order | Inactive automation | HTML files to install |
|---:|---:|---|
| 1 | `192829194505291071` | `email-2.1-kit-delivery.html`, `email-2.2-activation-prompt.html`, `email-2.3-bridge-to-paid-offer.html` |
| 2 | `192829198284359504` | `email-4.1-personalized-result.html`, `email-4.2-pattern-interruption.html`, `email-4.3-book-bridge.html` |
| 3 | `192829201493001563` | `email-5.1-preorder-welcome.html`, `email-5.2-emotional-reinforcement.html` |
| 4 | `192829203885852588` | `email-6.1-reader-welcome.html`, `email-6.2-integration-prompt.html`, `email-6.3-workbook-guidance-or-offer.html`, `email-6.4-feedback-and-advocacy.html` |
| 5 | `192829208307696992` | `email-7.1-gentle-reminder.html`, `email-7.2-objection-handling.html`, `email-7.3-final-recovery.html` |
| 6 | `192829212186380173` | `email-8.1-incomplete-claim-reminder.html`, `email-8.2-second-claim-reminder.html` |
| 7 | `192829215088837803` | `email-8.3-claim-completed.html` |
| 8 | `192829216933283343` | `email-9.1-cards-delivery.html`, `email-9.2-usage-ritual.html`, `email-9.3-habit-reinforcement.html`, `email-9.4-bundle-upsell-or-owner-feedback.html` |

### Automation acceptance pass

1. Re-read the step order and delays against
   `docs/MAILERLITE-REPLACEMENT-MIGRATION-2026-07-12.md`.
2. Preview every message with an owner-controlled test profile. For Quiz, fill
   `quiz_result_name`, `quiz_result_summary`, `quiz_strength`, `quiz_risk`,
   `quiz_next_step`, and `quiz_result_url` and verify no placeholder remains.
3. Check every CTA and footer link. Paid files must use authenticated website
   routes; never replace them with public Storage URLs.
4. Confirm payment/refund exits flow 7, completion exits flow 8A, and bundle
   owners bypass the flow-9 bundle upsell.
5. Run MailerLite's dry-run feature. A real test send requires Michael's
   explicit approval and the exact recipient address.
6. Record PASS/FAIL for every message and exit path. Leave all workflows
   inactive until every result is PASS.

## 2. MailerLite — scheduled campaign bodies

The supplied HTML is already installed in these new drafts:

| Email | New draft ID | Required date after approval |
|---|---:|---|
| 5.3 — Thirty-day countdown | `192835731823003432` | October 25, 2026 at 09:00 account time |
| 5.4 — Seven-day countdown | `192835735038985384` | November 17, 2026 at 09:00 account time |
| 5.5 — Tomorrow reminder | `192835738135430798` | November 23, 2026 at 09:00 account time |

1. Open each draft and compare body, subject, preheader, sender, reply-to, CTA,
   and target group against the matrix.
2. Confirm the target is **Preorders only** and preview at desktop/mobile width.
3. Leave the three existing READY campaigns untouched until Michael chooses
   whether to unschedule and replace them. Their IDs are `192795454682957112`,
   `192795457777304695`, and `192795460957636199`.
4. Leave draft `192808511238833684` unsent. Cleanup is a separate approval.

## 3. Supabase — upload and verify deliverables

1. In an approved secure shell or CI secret store, configure only:
   `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and
   `SUPABASE_STORAGE_BUCKET=curls-deliverables`. Do not echo their values.
2. Unpack the supplied upload bundle outside the repository.
3. Confirm its public directory contains the 12 prepared PDFs and its private
   directory contains the workbook PDF plus 13 Daily Directives archives.
4. Run:

```bash
node scripts/upload-deliverables.mjs \
  --public-dir /secure/path/Supabase-Upload-Ready-20260712/curls-free \
  --private-dir /secure/path/Supabase-Upload-Ready-20260712/curls-deliverables
pnpm check:supabase-storage
```

5. Confirm all expected paths exist in project `comfnluqjhnmbxfvvjeo`.
6. Confirm `curls-free` objects are public, `curls-deliverables` objects are
   private, authenticated entitled users receive working signed URLs, and an
   unauthenticated request cannot fetch paid files.
7. Add the canonical v13 EPUB only when supplied. Never upload the POD interior.

## 4. Vercel — Preview gate

1. Open project `website` and inspect environment-variable **names only** for
   Preview and Production against the 13-key table in
   `docs/LAUNCH-VERIFICATION-2026-07-12.md`.
2. Confirm `LAUNCH_FULFILLMENT_ENABLED=false`; confirm the owner/dry-run address
   keys and `CRON_SECRET` exist without exposing their values.
3. Open the PR Preview deployment and check `/`, `/preorder`, `/pricing-kit`,
   and `/website` at desktop and iPhone 13 widths.
4. Confirm no console/page errors, horizontal overflow, missing frames, or
   broken reduced-motion fallback. GitHub CI run 75 already passes the
   repository's automated Chromium gate.
5. Do not redeploy or promote Production without fresh explicit approval.

## 5. Resend — DNS and transactional acceptance

1. In Resend, confirm the domain is Verified and sending enabled.
2. Confirm SPF and DKIM pass in Resend; confirm DMARC at the DNS provider.
3. Obtain explicit approval containing the exact recipient address.
4. Send one transactional test only. Verify brand-domain From/Reply-to, inbox
   arrival, expected template alias, secure link, and absence of tokens in logs.

## 6. Stripe and fulfillment — test mode only

Obtain explicit approval before performing this test because it writes test
records and exercises email/list integrations.

1. Confirm the Stripe account is in test mode.
2. Complete one new preorder checkout with owner-controlled test data.
3. Verify the webhook creates one order/entitlement and replay is idempotent.
4. Verify the subscriber enters Preorders/Customers and exits Abandoned
   Checkout; verify dashboard/download entitlement appears.
5. Issue a test refund and verify entitlement is revoked and recovery stops.
6. Run the November 23 dry run. Require `ok: true`, empty warnings, delivery
   only to `LAUNCH_DRYRUN_TEST_EMAIL`, and one `launch_ebook_dryrun` record with
   no purchase mutation.
7. Confirm `LAUNCH_FULFILLMENT_ENABLED=false` after the test.

## 7. Final approval checklist

- [ ] All 22 automation bodies installed and previewed.
- [ ] All three scheduled campaign bodies compared and approved.
- [ ] MailerLite send order, delays, exits, senders, subjects, and preheaders pass.
- [ ] Supabase expected objects exist; paid objects remain private.
- [ ] Resend SPF, DKIM, and DMARC pass; approved owner inbox test passes.
- [ ] Stripe test purchase, replay, entitlement, and refund pass.
- [ ] November 23 dry run passes without purchase mutation.
- [ ] Vercel Preview passes manual browser review.
- [ ] GitHub PR review passes and merge is explicitly approved.
- [ ] Production deployment is explicitly approved.
- [ ] Only after every item above: separately approve workflow activation and
      any change to `LAUNCH_FULFILLMENT_ENABLED`.

Record connector limitations as **BLOCKED**, never PASS. Keep old MailerLite
workflows paused through a monitoring window; archive/delete only after a
separate destructive-cleanup approval.
