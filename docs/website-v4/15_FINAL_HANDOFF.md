# Prompt 8 Final Handoff — Curls & Contemplation Author Site

**Date:** 2026-06-10  
**Branch at handoff:** `work`  
**Base commit observed before Prompt 8:** `f444839`  
**Final app path:** `author-site/`  
**Production status:** **NO-GO** until activation gates pass.  
**Preview status:** **GO for Vercel Preview after sandbox env vars are configured.**

## A. Executive summary

Prompt 8 consolidated the full author-commerce website into one self-contained root folder, `author-site/`. The app is a Next.js App Router + TypeScript strict + Tailwind build with Supabase Auth/Database/private Storage scaffolding, Stripe Checkout/webhook scaffolding, Resend/MailerLite wrappers, consent-aware analytics plumbing, protected-download server logic, sandbox verification scripts, and launch QA documentation.

The site remains intentionally production locked: no production deploy was run, no live Stripe/Supabase/Resend/MailerLite keys were added, no live payments were activated, and no paid EPUB/PDF files were copied into public assets.

### What passed in the Prompt 8 audit

- Folder consolidation target is `author-site/`.
- `author-site/package.json`, `author-site/app/`, `author-site/docs/website-v4/`, `author-site/setup/`, and sandbox scripts exist.
- Local release artifacts remain outside website public assets:
  - `release/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
  - `release/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`
- Locked private Supabase bucket remains `curls-deliverables`.
- Locked private object paths remain:
  - `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
  - `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`

### What remains blocked

- Michael must provide sandbox provider credentials through secure runtime env vars or Vercel Preview env, not committed files.
- Michael must approve legal copy, claims, final launch date, domain, email sender/domain, final product imagery, and external Kindle/Paperback links.
- Production remains blocked until the production activation checklist is complete.

## B. Built features

- **Next.js App Router site:** public marketing pages, auth/customer pages, admin surfaces, and API routes are scaffolded under `author-site/app/`.
- **ACISS immersive design system:** ACISS palette, editorial typography, immersive sections, scroll reveal, page transitions, curl cursor trail, magnetic CTA, chapter pathway, and book tilt components are present.
- **Home flow:** the homepage preserves the Recognition → Relief/Unspoken Problem → Authority/path pacing required by Prompt 4.
- **Public routes:** `/`, `/book`, `/preorder`, `/buy`, `/free-chapter`, `/chapters`, `/chapter/[slug]`, `/blog`, `/blog/[slug]`, `/resources`, `/worksheets`, `/about`, `/media-kit`, `/faq`, `/contact`, and policy pages.
- **Auth/customer routes:** `/signup`, `/login`, `/logout`, `/dashboard`, `/downloads`, `/bonus-claim`, and `/thank-you`.
- **Admin routes:** `/admin`, `/admin/orders`, `/admin/subscribers`, `/admin/claims`, `/admin/content`, and `/admin/analytics`.
- **API routes:** `/api/checkout`, `/api/stripe/webhook`, `/api/downloads/sign`, `/api/subscribe`, `/api/free-chapter`, `/api/bonus-claim`, `/api/track`, and `/api/health`.
- **Stripe checkout scaffold:** one-time direct checkout support for preorder/regular prices, with live key patterns rejected by sandbox checks.
- **Stripe webhook scaffold:** signature verification and entitlement/refund event handling are represented.
- **Supabase migration/RLS scaffold:** commerce, entitlement, analytics, admin, and subscription-ready tables are represented in `supabase/migrations/0001_author_commerce.sql`.
- **Protected downloads:** server-side entitlement checks and private Storage signed URL planning are present. Downloads deny by default without valid entitlement/provider setup.
- **Private Storage plan:** paid deliverables must be uploaded to private bucket `curls-deliverables` at the locked object paths only.
- **Resend/MailerLite wrappers:** transactional and list automation wrappers exist, with provider calls requiring env configuration.
- **Analytics/event map:** consent-aware client events and sanitized server-side operational events are scaffolded.
- **Sandbox scripts:** env, public deliverables, Supabase Storage path, and Stripe test-mode scripts are present.
- **Test suite:** static security, route protection, launch mode, entitlements, analytics, Stripe webhook, sandbox readiness, and motion tests are present.
- **Launch QA docs:** final handoff, production activation checklist, final QA report, and Vercel Preview deployment guide are included.

## C. Final folder structure

```text
author-site/
├── README.md
├── AGENTS.md
├── package.json
├── pnpm-lock.yaml
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── vitest.config.ts
├── next-env.d.ts
├── proxy.ts
├── .env.example
├── .env.sandbox.example
├── .gitignore
├── app/
├── components/
├── content/
├── lib/
├── public/
├── scripts/
├── styles/
├── supabase/
│   ├── migrations/
│   └── seed.sandbox.sql
├── tests/
├── docs/
│   └── website-v4/
│       ├── 00_REPO_AUDIT.md
│       ├── 01_WEBSITE_PRD_v4.md
│       ├── 02_SITE_TREE_AND_FILE_MAP.md
│       ├── 03_ACISS_TOKENS_SPEC_v2.md
│       ├── 04_FUNNEL_v4.md
│       ├── 05_PAGE_PLAN_WIREFRAMES.md
│       ├── 06_WEBSITE_COPY_v4.md
│       ├── 07_WORKFLOW_AND_KEYS.md
│       ├── 08_BUILD_LOG.md
│       ├── 09_LAUNCH_QA_CHECKLIST.md
│       ├── 10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md
│       ├── 11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md
│       ├── 12_SANDBOX_INTEGRATION_RUNBOOK.md
│       ├── 13_SANDBOX_TEST_RESULTS_TEMPLATE.md
│       ├── 14_SANDBOX_VERIFICATION_REPORT.md
│       ├── 15_FINAL_HANDOFF.md
│       ├── 16_PRODUCTION_ACTIVATION_CHECKLIST.md
│       ├── 17_FINAL_QA_REPORT.md
│       └── 18_VERCEL_PREVIEW_DEPLOYMENT_GUIDE.md
└── setup/
    ├── CODEX_MASTER_PROMPT.md
    ├── CODEX_CLOUD_ENVIRONMENT.md
    ├── 10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md
    ├── 11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md
    └── setup.sh
```

## D. Real vs scaffolded

| Status | Items | Notes |
|---|---|---|
| Real and tested locally | Next.js app files, route shells, ACISS styling, motion components, typed content, SEO helpers, robots/sitemap, schema helpers, tests, sandbox check scripts | Local validation commands must be rerun after every edit from `author-site/`. |
| Real but requires sandbox credentials | Supabase Auth/DB/private Storage calls, Stripe test checkout, Stripe webhook replay, Resend send, MailerLite group mapping, Turnstile verification, analytics destinations | Configure through Vercel Preview env or local uncommitted runtime env only. |
| Scaffolded only | Admin operational dashboards, final editorial blog copy, worksheets/resources offer, future subscription/resource library schema placeholders | Do not advertise subscriptions in v1. |
| Blocked by human/provider setup | Final domain, DNS, Vercel project, Supabase project, Stripe products/prices/webhook, Resend sender, MailerLite automations, Turnstile, GA4/PostHog/Sentry | Michael/operator action required. |
| Blocked by legal/brand approval | Privacy, terms, refund, preorder, digital delivery, cookies, accessibility copy, claims, final author bio, final product imagery | Attorney/human approval required before production. |

## E. Required third-party setup checklist

### Vercel Preview

- [ ] Create/import Vercel project.
- [ ] Set **Root Directory** to `author-site`.
- [ ] Set install command: `pnpm install`.
- [ ] Set build command: `pnpm build`.
- [ ] Keep output as `.next`.
- [ ] Configure Preview env vars only.
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the Vercel Preview URL.

### Supabase sandbox/project

- [ ] Create sandbox Supabase project.
- [ ] Apply `author-site/supabase/migrations/0001_author_commerce.sql`.
- [ ] Verify RLS policies.
- [ ] Create private bucket `curls-deliverables` with public access disabled.
- [ ] Upload EPUB to `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
- [ ] Upload PDF to `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`.
- [ ] Confirm unauthorized download is denied.
- [ ] Confirm valid entitlement creates a short-lived signed URL.
- [ ] Confirm refund/revocation denies future access.

### Stripe test mode

- [ ] Create one-time test product/price for direct preorder / launch: `$17.99`.
- [ ] Create one-time test product/price for regular direct: `$19.99`.
- [ ] Set `STRIPE_PRICE_ID_PREORDER` and `STRIPE_PRICE_ID_REGULAR` to test price IDs.
- [ ] Add a test webhook endpoint for `/api/stripe/webhook`.
- [ ] Verify `checkout.session.completed` creates entitlement.
- [ ] Verify `charge.refunded` revokes entitlement.
- [ ] Do not add live keys until Michael approves production activation.

### Resend

- [ ] Configure sandbox/test API key in secure env only.
- [ ] Verify sender/domain in sandbox where possible.
- [ ] Test transactional emails to approved test recipients only.
- [ ] Complete SPF/DKIM/DMARC before production.

### MailerLite

- [ ] Create sandbox groups for subscribers, free chapter, preorders, customers, abandoned checkout, bonus claim started/completed, refunded, blog readers, and VIP/early readers.
- [ ] Map all group IDs in env.
- [ ] Test add/update and group assignment.
- [ ] Do not send production broadcasts from preview.

### Turnstile

- [ ] Add sandbox/test site and secret keys.
- [ ] Confirm missing/invalid Turnstile fails safely for high-risk submissions.

### GA4/PostHog/Sentry

- [ ] Decide GA4, PostHog, or both.
- [ ] Configure Preview env only.
- [ ] Confirm consent behavior before marketing analytics runs.
- [ ] Configure Sentry DSN for preview error monitoring.

### Final domain

- [ ] Michael chooses final domain.
- [ ] DNS plan is approved.
- [ ] `NEXT_PUBLIC_SITE_URL` is updated only for the target environment.

## F. Security and compliance state

- No real secrets were intentionally committed.
- No paid EPUB/PDF files are in `author-site/public/`.
- Protected/admin/customer pages are configured noindex through metadata and/or robots.
- Checkout fails closed without required Stripe env.
- Downloads deny by default without valid entitlement and provider configuration.
- Stripe webhooks verify signatures.
- Admin authorization is scaffolded through allowlist/admin-user patterns and must be verified against production Supabase.
- Analytics metadata is designed to be sanitized and must not store signed URLs, secrets, tokens, full card data, or unnecessary PII.
- Consent behavior blocks marketing analytics until accepted.
- Legal copy is a draft outline and not attorney-approved.

## G. Michael decisions still needed

- [ ] Final domain.
- [ ] Final release date.
- [ ] Final launch mode: `preorder`, `launched`, or `paused`.
- [ ] Final legal approval.
- [ ] Final claims approval against `marketing/website/claims-evidence.md`.
- [ ] Final author bio claims.
- [ ] Final cover/product imagery.
- [ ] Final Kindle link.
- [ ] Final paperback link.
- [ ] Final refund/preorder/digital delivery policy approval.
- [ ] Final email sender/domain.
- [ ] GA4, PostHog, or both.
- [ ] Whether future subscription/resource library remains hidden.

## H. Go/no-go recommendation

- **GO for Vercel Preview** after sandbox env is configured and preview smoke tests pass.
- **NO-GO for Production** until every production activation gate in `16_PRODUCTION_ACTIVATION_CHECKLIST.md` passes and Michael intentionally approves live payments/production deploy.
