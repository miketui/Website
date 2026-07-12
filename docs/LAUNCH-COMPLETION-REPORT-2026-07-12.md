# Curls & Contemplation — Launch Completion Report

**Prepared:** July 12, 2026
**Canonical site:** `curlscontemplation.beauty`
**Canonical repository:** `miketui/Website`
**Launch date:** Tuesday, November 24, 2026

## Final status

The website source, paid-product catalog, pricing-kit funnel, quiz worksheets, author presentation, SEO copy, and post-purchase entitlement logic are updated and verified locally. Stripe and the required MailerLite group are updated in the connected live accounts. No charge, payment link, campaign send, or fabricated testimonial was created.

Two connected-service items require owner access before the full production loop can be called complete:

1. The connected Supabase account does not have access to the website project `jmfbosczwbfugbjsshwf`; the files are prepared but were not uploaded to an unrelated project.
2. Resend is connected through Zapier, but the available connector actions cannot read sending-domain DNS verification. Domain status must be confirmed in the Resend dashboard.

## What changed on the website

### Offer and checkout

- Kept one stable `/order` route that sends preorder visitors to `/preorder` and post-launch visitors to `/buy`.
- Locked the direct preorder at **$17.99** and regular direct price at **$19.99**.
- Preserved the automatic preorder entitlement: the **$19.99 Idea-to-Action Workbook is free with every preorder**.
- Kept the workbook as a separate **$19.99** product after launch.
- Replaced the obsolete single affirmation deck with **Daily Directives**:
  - complete 12-set digital bundle: **$59**;
  - 12 individual digital sets: **$7.99 each**;
  - 31 cards per set; 372 cards total.
- Added server-side SKU allowlisting, Stripe price resolution, checkout metadata, purchase entitlements, signed-download paths, refund revocation, dashboard labels, and cart support for the bundle and every individual set.

### Daily Directives storefront

- Added `/daily-directives` with all 12 approved set names, cover-back previews, individual add-to-cart controls, and a bundle value explanation.
- Added the 12 supplied cover-back images to public marketing assets only.
- Kept all paid card fronts out of the public repository.

### Lead magnet and email bridge

- Removed the public free-chapter offer.
- Added `/pricing-kit` and `/api/pricing-kit` for the **Pricing Confidence Checklist**.
- Updated homepage, navigation, footer, paused-checkout fallback, blog CTAs, journey CTAs, 404, thank-you page, schema, robots, and sitemap to use the checklist-only funnel.
- Created the MailerLite group `Pricing Confidence Kit` with ID `192789958246794286`.
- Updated the Resend checklist-delivery template and welcome-email bridge to the preorder offer.

### Book positioning and SEO

- Used the final 467-page interior PDF as the content authority.
- Updated SEO copy around creative identity, networking, mentorship, pricing, digital visibility, leadership, financial wisdom, ethics, AI, resilience, well-being, and texture-inclusive practice.
- Matched the manuscript subtitle: **A Stylist’s Interactive Journey**.
- Removed unverified Kindle and paperback price claims; store availability is now described as pending confirmation.
- Expanded the FAQ to answer audience, experience level, format, preorder, workbook, privacy, refund, and external-edition questions.
- Removed the four-part marketing pathway, chapter-preview pages, public chapter CTAs, and public chapter structured-data action.

### Author and emotional design

- Optimized the supplied author photo to a 29 KB WebP and added it to the homepage and About page with accessible alt text.
- Added a full-screen contemplation pause and retained reduced-motion-safe cinematic behavior.
- No synthetic author, synthetic testimonial, or fake stylist story was added.

## Generated and verified files

### Public `curls-free` bucket

- `checklists/Pricing-Confidence-Checklist.pdf` — 2 pages, 107,998 bytes.
- `quiz/worksheet-underpriced-artist.pdf` — 2 pages, 107,310 bytes.
- `quiz/worksheet-invisible-talent.pdf` — 2 pages, 107,370 bytes.
- `quiz/worksheet-burned-out-booked.pdf` — 2 pages, 107,344 bytes.
- `quiz/worksheet-almost-ceo.pdf` — 2 pages, 107,262 bytes.
- Existing five challenge PDFs remain in the public upload manifest.

Every new PDF was rendered to images and visually inspected. There were no clipped lines, overlaps, missing glyphs, or broken page transitions.

### Private `curls-deliverables` bucket

- `workbook/Idea-to-Action-Workbook.pdf` — 21 pages, 110,257 bytes.
- `daily-directives/Daily-Directives-Complete-12-Set-Bundle.zip` — 384 images, 76,577,499 bytes.
- 12 files under `daily-directives/sets/` — 32 images per ZIP (31 cards plus the set back).

The canonical EPUB is intentionally absent and remains locked to:

`books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`

## Stripe catalog completed

| Product | Live one-time price |
|---|---:|
| Daily Directives — Complete 12-Set Digital Bundle | $59.00 |
| Daily Directives — Set 01 through Set 12 | $7.99 each |
| Idea-to-Action Workbook | $19.99 |
| Curls & Contemplation preorder | $17.99 |
| Curls & Contemplation regular | $19.99 |

The obsolete $7.99 price attached to the former single deck product is inactive. The bundle and all 12 individual products have the new verified prices as their defaults. No transaction was created.

## MailerLite: do all nine need setup?

**No.** Groups are segmentation labels; they do not each need an automation. The canonical launch setup is four automations:

1. Pricing Confidence Kit nurture — build/review, then enable.
2. Customer onboarding — build/review, then enable.
3. Abandoned checkout — one reminder after 24 hours; build/review, then enable.
4. Launch-day EPUB delivery — keep disabled until November 24 after the EPUB and dry run pass.

A short quiz-result follow-up can be added later as a fifth optional journey. Do not duplicate sequences for every group, and do not enable the launch delivery early.

## Resend configuration status

- Zapier connection: confirmed.
- Application API integration and transactional templates: configured in code.
- Live email send: not performed.
- Domain/DNS verification: must be checked in Resend because the connector does not expose the domain API.

Required dashboard check:

1. Open Resend → Domains → `curlscontemplation.beauty`.
2. Confirm domain status is **Verified** and SPF/DKIM records pass.
3. Confirm Vercel has `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `SUPPORT_EMAIL` for Production.
4. Send one approved test to the owner inbox, then verify reply-to and inbox placement.

## Supabase status and exact next action

The reconnected Supabase connector can currently see two active Vercel Marketplace projects:

- `supabase-teal-prism` (`comfnluqjhnmbxfvvjeo`) — healthy, with empty `public` and `private` buckets; zero objects, zero auth users, no website tables, migrations, or Edge Functions.
- `supabase-crimson-pillar` (`dlwurqmedtwcacollpeq`) — healthy but completely uninitialized; zero buckets, objects, auth users, website tables, migrations, or Edge Functions.

Neither is the website project recorded in the deployed configuration and repository documentation. The connector still returns `You do not have permission to perform this action` for production project `jmfbosczwbfugbjsshwf`. Prior production deployment history also says quiz files had already been uploaded, while both visible projects contain zero objects. That mismatch confirms it would be unsafe to select either new project or upload files there.

After reconnecting the Supabase account that owns the website project, run the prepared idempotent uploader with the correct project URL and service key. It uploads all prepared public/private files and skips the absent EPUB without failing.

## What “tracked `.env`” means

A tracked `.env` is an environment file containing configuration or secrets that was committed to Git. Repository history was audited: no real `.env` secret file was ever committed in this repository; only example templates were tracked. Secret rotations were reported complete. Continue keeping real secrets in Vercel/provider dashboards and never in Git or a `NEXT_PUBLIC_` variable.

## Verification evidence

- ESLint: passed.
- TypeScript: passed.
- Vitest: 15 files, 71 tests passed.
- Paid-deliverable public-path scan: passed.
- Next.js 16.2.9 production build: passed; 67 pages generated.
- HTTP render checks: `/`, `/daily-directives`, `/pricing-kit`, `/preorder`, `/book`, `/about`, and `/faq` returned 200 with the expected SEO titles.
- PDF visual QA: passed for the checklist, all four quiz worksheets, and the 21-page workbook.
- Digital card archive: 12 sets verified at 31 fronts plus one back each; complete bundle verified at 384 images.

## Owner checklist now

- [ ] Reconnect Supabase to project `jmfbosczwbfugbjsshwf` (or explicitly replace the production Vercel Supabase URL with a newly initialized canonical project), then upload/verify all prepared files.
- [ ] Confirm Resend domain verification and run one approved transactional test.
- [ ] Build/review the three prelaunch MailerLite automations; keep launch delivery disabled.
- [ ] Test checkout on iOS Safari and Android Chrome with an approved Stripe test-mode transaction.
- [ ] Test hero motion on both phones; reduced-motion should show still imagery.
- [ ] Upload the canonical EPUB later and run the launch-day dry run.
- [ ] Add only real, approved testimonials and a real author video when available.

## Recommended next move

Reconnect the correct Supabase project first. It is the only blocker preventing the prepared workbook and all Daily Directives files from becoming real protected customer downloads.
