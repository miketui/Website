# Deploy Notes — July 12, 2026

## Launch state

- Canonical repository: `miketui/Website`.
- Launch date: Tuesday, November 24, 2026.
- Direct preorder: $17.99.
- Direct regular price: $19.99.
- Idea-to-Action Workbook: free with preorder, $19.99 after launch.
- Daily Directives complete bundle: $59.
- Daily Directives individual sets: $7.99 each.

## Stripe

The live Stripe catalog has one complete-bundle product and 12 individual-set products. The previous $7.99 deck price is inactive. Non-secret verified price IDs have code fallbacks in `lib/stripe.ts`; Vercel environment values may override them.

Never put `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` in Git. The canonical webhook endpoint is `/api/stripe/webhook`.

## MailerLite

The retired Free Chapter group is marked archived. Ten trigger-correct lifecycle workflow shells, 29 exact automation subjects/bodies, three embedded double-opt-in forms, 14 personalization fields, and two new groups were created from the approved 9-funnel library. Three fixed preorder countdown campaigns are scheduled for October 25, November 17, and November 23 at 9:00 in the account timezone. MailerLite's API cannot create the visual email design or activate an incomplete automation; each workflow therefore still requires its final dashboard design/activation action.

## Supabase

Replacement production project: `supabase-teal-prism` (`comfnluqjhnmbxfvvjeo`). Six migrations are applied, 21 RLS-enabled public tables exist, the approved Stripe catalog is seeded (15 products / 16 prices), and `curls-free` plus private `curls-deliverables` buckets exist. Set the modern Vercel URL, publishable key, and server-only secret from `docs/VERCEL-PRODUCTION-ENV-2026-07-12.env.example`, then run:

```bash
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
node scripts/upload-deliverables.mjs --private-dir /tmp/curls-deliverables
```

The upload set contains the free checklist and quiz worksheets, the 21-page workbook, the $59 bundle ZIP, and 12 individual-set ZIPs. The EPUB is intentionally absent.

## Resend

Resend's `curlscontemplation.beauty` domain is verified and sending-enabled. Seven transactional templates are published: consent confirmation, preorder receipt, launch delivery, post-launch book delivery, workbook delivery, Daily Directives delivery, and refund/access update. The application uses their `cc-*` aliases. Confirm `RESEND_API_KEY`, `RESEND_FROM_EMAIL=info@curlscontemplation.beauty`, and `SUPPORT_EMAIL=info@curlscontemplation.beauty` in Vercel.
