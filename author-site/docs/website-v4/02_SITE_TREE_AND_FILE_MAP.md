<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 02_SITE_TREE_AND_FILE_MAP — v4 Production File Plan

## 1. Purpose
This document defines the professional production file tree for the future Next.js app. Prompt 2 does **not** create the app. Prompt 3 should create `author-site/` exactly as the implementation home unless a newer authoritative app appears.

## 2. Current docs tree after Prompt 2
```text
author-site/docs/website-v4/
├── 00_REPO_AUDIT.md                         # controlling repo truth source
├── 01_WEBSITE_PRD_v4.md                      # product/backend/security PRD
├── 02_SITE_TREE_AND_FILE_MAP.md              # this file
├── 03_ACISS_TOKENS_SPEC_v2.md                # ACISS design tokens
├── 04_FUNNEL_v4.md                           # funnel/email/analytics map
├── 05_PAGE_PLAN_WIREFRAMES.md                # route-by-route page plans
├── 06_WEBSITE_COPY_v4.md                     # paste-ready copy
├── 07_WORKFLOW_AND_KEYS.md                   # setup/env/key workflow
├── 08_BUILD_LOG.md                           # Prompt 2 build log
├── 09_LAUNCH_QA_CHECKLIST.md                 # launch QA gates
├── 10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md
└── 11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md
```

## 3. Future app tree for Prompt 3
```text
author-site/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── logout/page.tsx
│   │   └── signup/page.tsx
│   ├── (customer)/
│   │   ├── bonus-claim/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── downloads/page.tsx
│   ├── (legal)/
│   │   ├── accessibility/page.tsx
│   │   ├── cookies/page.tsx
│   │   ├── digital-delivery-policy/page.tsx
│   │   ├── preorder-policy/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── refund-policy/page.tsx
│   │   └── terms/page.tsx
│   ├── admin/
│   │   ├── analytics/page.tsx
│   │   ├── claims/page.tsx
│   │   ├── content/page.tsx
│   │   ├── orders/page.tsx
│   │   ├── page.tsx
│   │   └── subscribers/page.tsx
│   ├── api/
│   │   ├── bonus-claim/route.ts
│   │   ├── checkout/route.ts
│   │   ├── downloads/sign/route.ts
│   │   ├── free-chapter/route.ts
│   │   ├── health/route.ts
│   │   ├── stripe/webhook/route.ts
│   │   ├── subscribe/route.ts
│   │   └── track/route.ts
│   ├── blog/[slug]/page.tsx
│   ├── blog/page.tsx
│   ├── book/page.tsx
│   ├── buy/page.tsx
│   ├── chapter/[slug]/page.tsx
│   ├── chapters/page.tsx
│   ├── contact/page.tsx
│   ├── faq/page.tsx
│   ├── free-chapter/page.tsx
│   ├── layout.tsx
│   ├── media-kit/page.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── preorder/page.tsx
│   ├── resources/page.tsx
│   ├── thank-you/page.tsx
│   ├── worksheets/page.tsx
│   ├── error.tsx
│   ├── globals.css
│   ├── loading.tsx
│   └── sitemap.ts
├── components/
│   ├── admin/AdminShell.tsx
│   ├── analytics/ConsentBanner.tsx
│   ├── book/BookTiltHero.tsx
│   ├── book/ChapterPathway.tsx
│   ├── commerce/CheckoutButton.tsx
│   ├── commerce/PriceCard.tsx
│   ├── customer/DashboardCard.tsx
│   ├── customer/DownloadList.tsx
│   ├── forms/BonusClaimForm.tsx
│   ├── forms/ContactForm.tsx
│   ├── forms/EmailCaptureForm.tsx
│   ├── layout/Footer.tsx
│   ├── layout/Header.tsx
│   ├── motion/CurlCursorTrail.tsx
│   ├── motion/MagneticCurlCTA.tsx
│   ├── motion/PageTransition.tsx
│   ├── motion/ScrollReveal.tsx
│   ├── seo/JsonLd.tsx
│   └── ui/{Button,Card,Container,Field,Section}.tsx
├── content/
│   ├── book.ts
│   ├── blog.ts
│   ├── chapters.ts
│   ├── copy.ts
│   ├── faq.ts
│   ├── legal.ts
│   ├── resources.ts
│   └── site.ts
├── lib/
│   ├── admin.ts
│   ├── analytics.ts
│   ├── auth.ts
│   ├── config.ts
│   ├── downloads.ts
│   ├── mailerlite.ts
│   ├── resend.ts
│   ├── security.ts
│   ├── stripe.ts
│   ├── supabase-admin.ts
│   ├── supabase-browser.ts
│   ├── supabase-server.ts
│   ├── turnstile.ts
│   ├── validation.ts
│   └── webhook-idempotency.ts
├── public/
│   ├── favicon.ico
│   ├── og/
│   │   └── default-og.png                  # marketing image only, no paid book files
│   └── robots.txt
├── supabase/
│   └── migrations/
│       ├── 0001_initial_commerce_schema.sql
│       ├── 0002_rls_policies.sql
│       ├── 0003_storage_bucket_policies.sql
│       ├── 0004_analytics_and_consent.sql
│       └── 0005_subscription_placeholders.sql
├── tests/
│   ├── api.checkout.test.ts
│   ├── api.downloads.test.ts
│   ├── api.stripe-webhook.test.ts
│   ├── accessibility-smoke.test.ts
│   ├── route-map.test.ts
│   └── token-contrast.test.ts
├── .env.example
├── README.md
├── eslint.config.mjs
├── middleware.ts
├── next.config.ts
├── package.json
├── playwright.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## 4. Required app files
Compile-critical in Prompt 3:
- `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `middleware.ts`.
- `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/not-found.tsx`, `app/error.tsx`, `app/loading.tsx`.
- Every route `page.tsx` listed in the PRD.
- Every API `route.ts` listed in the PRD.
- Core libs: config, validation, Supabase server/admin/browser clients, Stripe, downloads, MailerLite, Resend, analytics, auth/admin checks.
- Supabase migrations.

## 5. Required style files
- `app/globals.css` with ACISS CSS variables.
- `tailwind.config.ts` mapping ACISS tokens.
- Component-level class composition; avoid hardcoded deprecated hex values.
- Token verification test for banned hex values.

## 6. Required motion/design components
Compile-critical if referenced by pages:
- `CurlCursorTrail.tsx`: pointer-follow hair/curl trail, disabled for reduced motion/coarse pointers.
- `MagneticCurlCTA.tsx`: subtle CTA pull with focus-safe fallback.
- `BookTiltHero.tsx`: layered book hero with pointer tilt and static fallback.
- `ChapterPathway.tsx`: chapter progression rail.
- `ScrollReveal.tsx`: IntersectionObserver reveal.
- `PageTransition.tsx`: route transition shell.

## 7. Required backend/lib files
- `lib/config.ts`: typed env access.
- `lib/stripe.ts`: Stripe client and price selection.
- `lib/supabase-admin.ts`: service role server-only client.
- `lib/supabase-server.ts`: auth-aware server client.
- `lib/supabase-browser.ts`: browser auth client.
- `lib/downloads.ts`: entitlement and signed URL logic.
- `lib/mailerlite.ts`: group assignment.
- `lib/resend.ts`: transactional messages.
- `lib/analytics.ts`: server-side event insert and GA4 helpers.
- `lib/turnstile.ts`: bot challenge verification.
- `lib/admin.ts`: admin authorization.
- `lib/validation.ts`: Zod schemas.

## 8. Required Supabase migration files
- `0001_initial_commerce_schema.sql`: products, prices, orders, purchases, profiles, subscribers, claims, downloads.
- `0002_rls_policies.sql`: customer/admin/service policy intent.
- `0003_storage_bucket_policies.sql`: private bucket docs/policy helpers for `curls-deliverables`.
- `0004_analytics_and_consent.sql`: `analytics_events`, `consent_log`.
- `0005_subscription_placeholders.sql`: inactive future membership tables.

## 9. Compile-critical vs docs-only vs placeholder
| Item | Status in Prompt 3 | Notes |
|---|---|---|
| Routes and route handlers | Compile-critical | Every required path must render or return a typed response. |
| ACISS tokens | Compile-critical | Required for visual consistency and tests. |
| Stripe Checkout | Compile-critical server route; test-mode only | Do not activate live payments. |
| Stripe webhook | Compile-critical with signature verification | Use env secret; tests should verify bad signature rejection. |
| Supabase migrations | Compile-critical project artifact | May not be executed in CI without credentials. |
| MailerLite/Resend integrations | Compile-critical stubs with typed clients | Network calls can be mocked in tests. |
| Admin pages | Compile-critical surfaces | Real data may show empty states. |
| Legal pages | Docs/copy content rendered as draft | Attorney review required before production. |
| Subscription tables | Placeholder only | No public paid subscription offer. |
| Release EPUB/PDF files | External release artifacts | Must not be copied into app `public/`. |

## 10. Needs real credentials/assets later
Credentials:
- Supabase URL, anon key, service role key.
- Stripe secret key, webhook secret, price IDs.
- MailerLite API key and group IDs.
- Resend API key and verified sender domain.
- GA4 measurement ID.
- Sentry DSN.
- Turnstile site key and secret key.
- Vercel project env vars.

Assets:
- Final approved cover/3D book art optimized for web.
- OG/social images.
- Author photo and media-kit images with usage rights.
- Uploaded paid EPUB/PDF in Supabase private Storage.
- Free chapter sample asset if delivered as file.

## 11. Explicit exclusions for Prompt 2
- Do not create `author-site/`.
- Do not run app build commands.
- Do not edit `release/`, `book/`, `build/`, `archive/`, or publishing materials.
- Do not store real API keys or secrets.
- Do not activate live payments.
