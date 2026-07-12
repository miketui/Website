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

`Pricing Confidence Kit` was created with ID `192789958246794286`. The website uses this group instead of the former manuscript-giveaway segment. See `docs/mailerlite-launch-campaigns.md`; four core automations are enough, and launch-day EPUB delivery stays disabled until November 24.

## Supabase

Target project: `jmfbosczwbfugbjsshwf`. The reconnected account exposes `supabase-teal-prism` (`comfnluqjhnmbxfvvjeo`) and `supabase-crimson-pillar` (`dlwurqmedtwcacollpeq`), but both have zero website tables, users, or stored objects. The connector still cannot access the documented production project, so no files were uploaded to a different project. Reconnect the website project—or intentionally initialize and switch Vercel to a replacement project—then run:

```bash
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
node scripts/upload-deliverables.mjs --private-dir /tmp/curls-deliverables
```

The upload set contains the free checklist and quiz worksheets, the 21-page workbook, the $59 bundle ZIP, and 12 individual-set ZIPs. The EPUB is intentionally absent.

## Resend

Resend is connected through Zapier and the application templates are wired. Zapier exposes contacts, segments, and email sending but not sending-domain/DNS inspection. Verify `curlscontemplation.beauty` in Resend and confirm `RESEND_FROM_EMAIL` plus `SUPPORT_EMAIL` in Vercel before any live send.
