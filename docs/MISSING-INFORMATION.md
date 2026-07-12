# Remaining Owner Actions — Curls & Contemplation

## Required before end-to-end production fulfillment

1. Reconnect the Supabase connector to the account that owns project `jmfbosczwbfugbjsshwf`, or explicitly confirm that production is being migrated to a replacement ref. The current connection exposes two healthy but empty Vercel-created projects (`comfnluqjhnmbxfvvjeo` and `dlwurqmedtwcacollpeq`), while the documented production project still returns a permission error. The prepared files were not uploaded to the wrong destination.
2. In Resend, verify the sending domain and its SPF/DKIM records, then confirm `RESEND_FROM_EMAIL` and `SUPPORT_EMAIL` in the Vercel project. The connected Zapier actions cannot read domain verification status.
3. In MailerLite, review and enable only the canonical automations documented in `docs/mailerlite-launch-campaigns.md`. Do not enable launch-day EPUB delivery until November 24, 2026.
4. Upload `Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub` later to `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`, then run the launch-day dry run.
5. Record or upload a real 60-second author welcome video if desired. The site has a polished fallback and does not use a synthetic person.
6. Add real approved testimonials only when they exist; none were fabricated.

## Clarification: tracked `.env`

A tracked `.env` is a secret-bearing environment file committed into Git history. The July 12 audit found no real `.env` file in this repository history—only example templates. Secret rotations were still reported complete, and secrets must remain in provider dashboards/Vercel, never in Git.
