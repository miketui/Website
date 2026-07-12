# Curls & Contemplation — Production Reconfiguration Report

**Date:** July 12, 2026

## Replacement Supabase

Canonical replacement: `supabase-teal-prism` (`comfnluqjhnmbxfvvjeo`).

- Six versioned migrations applied successfully.
- 21 public tables have RLS enabled.
- Forms persist into `subscribers`, `consent_log`, `contact_submissions`, `quiz_leads`, `feedback_submissions`, `bonus_claims`, and `magnet_leads` as appropriate.
- Commerce includes orders, purchases, signed-download records, webhook idempotency, refunds, analytics, and admin access.
- Live catalog seeded: 15 products and 16 approved prices.
- Storage buckets created: public `curls-free` and private `curls-deliverables`.
- Security advisor returned only intentional informational notices for service-only tables with RLS and no client policies.

Public project configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=https://comfnluqjhnmbxfvvjeo.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_B5Qcc1ComydWey6dicCQ9Q_leeqEKZV
SUPABASE_STORAGE_BUCKET=curls-deliverables
```

The server secret must be copied directly into Vercel as `SUPABASE_SECRET_KEY`. It is intentionally not printed or committed.

## Website forms

- Existing newsletter placements now record explicit subscription consent and attribution.
- New `/subscribe` intake optionally captures first name, professional role, career stage, and interests.
- Contact submissions are stored in Supabase before/alongside Resend notification.
- Quiz captures are stored in Supabase and assigned to MailerLite.
- New `/feedback` form stores private reflections and explicit permission-to-contact; nothing is published automatically.
- Turnstile and honeypot protections remain in place.

## MailerLite

- Authenticated account verified.
- Created Core Nurture — Non-Buyers and Digital Directive Customers groups.
- Created 14 personalization fields.
- Created three embedded double-opt-in forms.
- Archived the retired Free Chapter group.
- Deleted nine obsolete/duplicate draft workflows.
- Created ten trigger-correct workflows representing the approved nine funnels.
- Corrected all 29 automation subjects in execution order.
- Scheduled the three fixed-date preorder messages; all are `ready`.

Provider limitation: MailerLite's API cannot create the visual HTML content for automation emails, and MailerLite refuses to activate workflows with undesigned steps. The connector exposes no supported activation action. Exact copy is preserved in `docs/MAILERLITE-AUTOMATION-EMAIL-LIBRARY.md`; the remaining dashboard action is documented in `docs/mailerlite-launch-campaigns.md`.

## Resend

- `curlscontemplation.beauty` is verified and sending-enabled.
- Published templates: consent confirmation, preorder receipt, launch-day delivery, post-launch book delivery, workbook delivery, Daily Directives delivery, and refund/access update.
- Website fulfillment calls the published `cc-*` template aliases.
- Sender/reply-to: `info@curlscontemplation.beauty`.

## Stripe

- Connected account verified.
- Book preorder $17.99 and regular $19.99 mapped.
- Workbook $19.99 mapped.
- Daily Directives complete bundle $59 mapped.
- Twelve individual sets at $7.99 each mapped.
- Stripe checkout metadata now assigns Preorders, Customers, and Digital Directive Customers to the correct MailerLite journeys.

## File delivery

All non-EPUB deliverables remain prepared locally. The Supabase connector used here supports database/schema operations but does not expose a Storage upload action. After `SUPABASE_SECRET_KEY` is placed in Vercel or a local secret file, run the idempotent uploader documented in `docs/DEPLOY-NOTES.md`. Do not upload the EPUB before the approved launch-day gate.
