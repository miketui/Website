# AGENTS.md — Curls & Contemplation Codex Build Rules

## Project identity
Build the production-ready author-commerce platform for **Curls & Contemplation: A Freelance Hairstylist's Guide to Creative Excellence** by **Michael David Warren Jr. / Michael David**.

This repository currently contains book, EPUB/POD, validation, and marketing handoff materials. Treat the publishing build as source material. Do not damage or rewrite the EPUB/PDF build system while creating the website.

## Current source-of-truth files to inspect first
Before coding, read and summarize:

- `README.md`
- `release/BUILD-MANIFEST.md`
- `marketing/website/00_README.md`
- `marketing/website/01_WEBSITE_PRD_FINAL.md`
- `marketing/website/02_SITEMAP.md`
- `marketing/website/03_ACISS_TOKENS_SPEC.md`
- `marketing/website/06_PRE_MORTEM.md`
- `marketing/website/14_SECURITY_LEGAL_QA.md`
- `marketing/website/17_WEBSITE_COPY.md`
- `marketing/website/claims-evidence.md`
- `release/` artifact names and checksums

If the requested V8 EPUB path does not exist, report the exact release artifact names and use the newest EPUB confirmed by `release/BUILD-MANIFEST.md` only after explicitly documenting the mismatch.

## Locked decisions
- Stack: **Next.js App Router + TypeScript strict + Tailwind + Supabase Auth/Database/Storage + Stripe Checkout + Resend + MailerLite + Vercel**.
- Site location: create the new web app under `author-site/` unless a newer authoritative web app already exists.
- Pricing: **$17.99 preorder/direct launch price** and **$19.99 regular direct price**. Kindle remains **$9.99 external**. Paperback remains **$29.99 external/POD placeholder** unless a source file says otherwise.
- Palette: use ACISS premium tokens:
  - Obsidian Black `#111111`
  - Antique Gold `#B08D57`
  - White Gold `#D8D1C5`
  - Deep Jade `#145B4B`
  - Soft Jade Mist `#C7D9D2`
- Brand law: Black leads. Gold elevates. Jade distinguishes.
- Launch modes: `preorder`, `launched`, `paused`.
- Domain: unknown. Use `{{DOMAIN}}` in docs and `NEXT_PUBLIC_SITE_URL` in code.
- EPUB/PDF files: never place paid files in `public/`.

## Non-negotiable security rules
- Never expose API keys, tokens, secrets, private storage URLs, customer data, or `.env` values.
- Create `.env.example` with variable names only.
- Do not hardcode live Stripe/Supabase/Vercel/MailerLite/Resend credentials.
- Downloads must be protected by server-side entitlement checks.
- Paid deliverables must be delivered from Supabase private Storage using signed URLs or secure server routes.
- Stripe webhooks must verify signatures.
- Refunds must revoke entitlement.
- Admin routes must require authorization and must not be visible to normal users.
- Legal copy is an outline until human/attorney approval.

## Work protocol
1. Inspect the repo and write `author-site/docs/website-v4/00_REPO_AUDIT.md`.
2. Produce the updated spec package before code:
   - `author-site/docs/website-v4/01_WEBSITE_PRD_v4.md`
   - `author-site/docs/website-v4/02_SITE_TREE_AND_FILE_MAP.md`
   - `author-site/docs/website-v4/03_ACISS_TOKENS_SPEC_v2.md`
   - `author-site/docs/website-v4/04_FUNNEL_v4.md`
   - `author-site/docs/website-v4/05_PAGE_PLAN_WIREFRAMES.md`
   - `author-site/docs/website-v4/06_WEBSITE_COPY_v4.md`
   - `author-site/docs/website-v4/07_WORKFLOW_AND_KEYS.md`
   - `author-site/docs/website-v4/08_BUILD_LOG.md`
   - `author-site/docs/website-v4/09_LAUNCH_QA_CHECKLIST.md`
   - `author-site/docs/website-v4/10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md`
   - `author-site/docs/website-v4/11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md`
3. Scaffold or update the actual app under `author-site/`.
4. Use small, reviewable commits/diffs. Do not rewrite unrelated book files.
5. Run validation before completion.

## Required website capabilities
Public:
- `/`
- `/book`
- `/preorder`
- `/buy`
- `/free-chapter`
- `/chapters`
- `/chapter/[slug]`
- `/blog`
- `/blog/[slug]`
- `/resources`
- `/worksheets`
- `/about`
- `/media-kit`
- `/faq`
- `/contact`
- `/privacy`
- `/terms`
- `/refund-policy`
- `/preorder-policy`
- `/digital-delivery-policy`
- `/cookies`
- `/accessibility`

Auth/customer:
- `/signup`
- `/login`
- `/logout`
- `/dashboard`
- `/downloads`
- `/bonus-claim`

Admin:
- `/admin`
- `/admin/orders`
- `/admin/subscribers`
- `/admin/claims`
- `/admin/content`

API:
- `/api/checkout`
- `/api/stripe/webhook`
- `/api/downloads/sign`
- `/api/subscribe`
- `/api/free-chapter`
- `/api/bonus-claim`
- `/api/track`
- `/api/health`

## Required technical files
At minimum, generate:

- `author-site/package.json`
- `author-site/next.config.ts`
- `author-site/tsconfig.json`
- `author-site/tailwind.config.ts`
- `author-site/postcss.config.mjs`
- `author-site/middleware.ts`
- `author-site/app/layout.tsx`
- `author-site/app/page.tsx`
- all route files listed above
- reusable components under `author-site/components/`
- data/config under `author-site/content/` and `author-site/lib/`
- Supabase migrations under `author-site/supabase/migrations/`
- tests under `author-site/tests/`
- `author-site/.env.example`
- `author-site/README.md`

## Test/build commands
From `author-site/`, run every available command:

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

If a command does not exist, add it or document why it is not applicable. Do not claim completion until build passes or the failure is explicitly documented with a narrow remediation plan.

## Copy rules
Use Michael’s voice: warm, premium, direct, specific, no generic AI phrasing. Do not use fake urgency, fake reviews, fake awards, invented testimonials, fake bestseller claims, or unverified celebrity/name claims. Every credibility claim must be tagged in docs and traceable to `claims-evidence.md`.

## Final response required from Codex
End with:
- Files created/changed
- Build/test results
- What is real vs scaffolded
- Remaining keys/assets/domain decisions
- Security risks found
- Pull request or branch name


## Immersive design and motion rules
Use `10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md` as a hard requirement.

Reference Textura-style principles only:
- emotional first impression,
- spaced editorial typography,
- immersive but tasteful 3D/motion,
- strong page transitions,
- featured-experience pacing,
- cursor-follow delight.

Do not clone Textura. Build an original Curls & Contemplation interaction:
- curl/hair-strand cursor trail,
- magnetic curl CTA,
- book tilt,
- chapter pathway,
- scroll reveal,
- page transition.

First three home sections must be:
1. Recognition
2. Relief
3. Authority/path

Motion must honor `prefers-reduced-motion`, must not hurt checkout/auth/download UX, and must never replace readable copy.

## Backend, analytics, subscription rules
Use `11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md` as a hard requirement.

The app must include:
- Supabase Auth/DB/private Storage setup,
- Stripe one-time checkout,
- Stripe webhook with signature verification,
- MailerLite groups/automation mapping,
- Resend transactional email,
- GA4 event map with consent behavior,
- internal server-side analytics events table,
- subscription-ready schema placeholders for future membership/resource library,
- admin-ready analytics/orders/subscribers/claims surfaces.

Do not activate paid subscriptions in v1 unless Michael explicitly approves. Make the schema ready, not the offer live.
