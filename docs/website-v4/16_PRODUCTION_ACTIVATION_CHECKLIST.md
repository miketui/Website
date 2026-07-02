# Prompt 8 Production Activation Checklist

Production is blocked until every gate below is complete, documented, and approved by Michael. Do not activate live payments, production deploy, or public preorder traffic before these gates pass.

## Gate 1 — Content and claims

- [ ] All public claims verified against `marketing/website/claims-evidence.md`.
- [ ] No fake testimonials.
- [ ] No fake urgency/scarcity.
- [ ] No bestseller guarantee or unverified bestseller badge.
- [ ] No celebrity, award, training, client, or press claim unless substantiated and approved.
- [ ] Legal review complete.
- [ ] Privacy, terms, refund, preorder, digital delivery, cookies, and accessibility pages approved.

## Gate 2 — Domain and brand

- [ ] Final domain selected.
- [ ] DNS plan complete.
- [ ] Final logo approved.
- [ ] Final cover/product imagery approved.
- [ ] Social OG images approved.
- [ ] Favicon/app icons approved.
- [ ] External Kindle link approved.
- [ ] External paperback/POD link approved.

## Gate 3 — Supabase production

- [ ] Production Supabase project created.
- [ ] Migration applied.
- [ ] RLS verified with owner/admin/customer/anonymous cases.
- [ ] Private bucket `curls-deliverables` created with public access disabled.
- [ ] EPUB uploaded to `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
- [ ] PDF uploaded to `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`.
- [ ] Signed URL tested for an entitled user.
- [ ] Unauthorized download denied.
- [ ] Refunded/revoked download denied.
- [ ] No paid EPUB/PDF files placed in `author-site/public/`.

## Gate 4 — Stripe production

- [ ] Live direct preorder / launch product created at `$17.99`.
- [ ] Live regular direct product created at `$19.99`.
- [ ] Live prices created and mapped to env.
- [ ] Live webhook endpoint created for `/api/stripe/webhook`.
- [ ] Webhook replay/test complete.
- [ ] Checkout success flow verified.
- [ ] Refund/revocation flow verified.
- [ ] Live mode intentionally approved by Michael.

## Gate 5 — Email providers

- [ ] Resend domain verified.
- [ ] SPF verified.
- [ ] DKIM verified.
- [ ] DMARC verified.
- [ ] Transactional emails tested.
- [ ] MailerLite groups created.
- [ ] MailerLite automations reviewed.
- [ ] No accidental broadcast sent.

## Gate 6 — Analytics and monitoring

- [ ] GA4, PostHog, or both chosen.
- [ ] Consent mode verified.
- [ ] Operational server-side events verified.
- [ ] No signed URLs, secrets, tokens, full card data, or unnecessary PII in analytics metadata.
- [ ] Sentry configured.
- [ ] Error monitoring tested.

## Gate 7 — Vercel Preview

- [ ] Preview deployed from root directory `author-site`.
- [ ] Preview env vars set with sandbox/test values only.
- [ ] Mobile QA complete.
- [ ] Desktop QA complete.
- [ ] Lighthouse/performance checked.
- [ ] Accessibility checked.
- [ ] Stripe test checkout flow verified.
- [ ] Supabase protected download test flow verified.
- [ ] Provider-backed sandbox verification report updated.

## Gate 8 — Production launch

- [ ] Production env vars set.
- [ ] Production deploy approved by Michael.
- [ ] Production smoke test complete.
- [ ] Live purchase/download test complete with intentional approved payment.
- [ ] Post-launch monitoring active.
- [ ] Rollback/disable plan confirmed.
