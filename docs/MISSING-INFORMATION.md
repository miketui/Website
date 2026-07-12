# Remaining Production Actions — Curls & Contemplation

## Required

1. In Vercel, replace the old Supabase variables with the values in `docs/VERCEL-PRODUCTION-ENV-2026-07-12.env.example`. The project URL and publishable key are provided; copy the server-only `sb_secret_...` value directly from Supabase to Vercel. Never place it in Git or a `NEXT_PUBLIC_` variable.
2. Upload the prepared public PDFs and private workbook/Daily Directives ZIPs to the new Supabase buckets. The connector can apply schema and query the database but exposes no Storage upload action; the files remain prepared under `/tmp/curls-deliverables`. The EPUB stays absent.
3. Open each `LIVE` MailerLite workflow, choose **Design email**, paste/style the matching copy from `docs/MAILERLITE-AUTOMATION-EMAIL-LIBRARY.md`, set sender and reply-to to `info@curlscontemplation.beauty`, and switch it on. MailerLite's API explicitly cannot create automation HTML or activate an incomplete workflow.

## Already complete

- Replacement Supabase project initialized and advisor-hardened.
- Correct storage buckets and live Stripe catalog created in Supabase.
- Stripe catalog and prices verified.
- Resend domain verified; seven transactional templates published.
- Three MailerLite double-opt-in forms and 14 personalization fields created.
- Ten trigger-correct MailerLite workflow shells created; nine obsolete drafts deleted.
- Three preorder countdown campaigns scheduled and in `ready` status.
- Website subscription intake, feedback, contact persistence, quiz persistence, and consent logging implemented.
