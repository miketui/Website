# CODEX_CLOUD_ENVIRONMENT.md — Settings to Use in Codex

## Environment target
Repository: `miketui/Last2`  
Branch: `main`  
Working directory: repo root  
App path Codex should create: `author-site/`

## Setup script
Use the included `setup.sh` in the Codex cloud environment setup field.

Codex cloud setup scripts run before the agent edits code. They are the right place to install:
- Node/package tools
- Java/OpenJDK
- EPUBCheck
- Poppler/Ghostscript
- Playwright Chromium dependencies
- Python validation tools

## Internet access
Recommended:
- Setup phase: internet ON, because dependencies and EPUBCheck must be downloaded.
- Agent phase: limited internet only if Codex needs to read current vendor docs.

If using limited internet, allow:
- `registry.npmjs.org`
- `npmjs.com`
- `github.com`
- `raw.githubusercontent.com`
- `objects.githubusercontent.com`
- `w3c.github.io`
- `supabase.com`
- `stripe.com`
- `vercel.com`
- `resend.com`
- `mailerlite.com`
- `developers.openai.com`

## Secrets
Do not put real Stripe/Supabase/MailerLite/Resend/Vercel secrets into repo files.

For this build task, prefer mocked tests and `.env.example`. Real secrets should be set later in:
- Vercel project environment variables
- Supabase dashboard
- Stripe dashboard/webhook settings
- MailerLite dashboard
- Resend dashboard

## Codex task sequence
Run as four Codex tasks, not one giant task, for cleaner diffs.

### Task 1 — Audit and v4 specs
Paste `CODEX_MASTER_PROMPT.md`, but tell Codex:
"Complete TASK A and TASK B only. Create author-site/docs/website-v4. Do not build the app yet."

### Task 2 — Scaffold app
"Using author-site/docs/website-v4 as locked source, create the Next.js app under author-site. Include all pages, components, content, lib files, migrations, .env.example, README, and tests. Do not use real secrets."

### Task 3 — Integration hardening
"Audit auth, Stripe, Supabase, protected downloads, RLS migrations, webhook idempotency, admin gating, SEO/schema, and no-public-paid-file rules. Add or fix tests."

### Task 4 — Build and PR
"Run install/lint/typecheck/test/build. Fix failures. Produce final build log and PR-ready summary."

## Human gates before production
Do not deploy live payments until:
- Domain chosen
- Release date locked
- Stripe real products/prices created
- Supabase project and private bucket created
- EPUB/PDF uploaded to private Supabase Storage
- Legal/trust pages approved
- Test checkout and webhook verified
- Download entitlement test passes


### Task 5 — Design/motion hardening
"Using `10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md`, upgrade the first three home sections, page transitions, curl cursor trail, magnetic CTA, book tilt, chapter pathway, and page-by-page visual styling. Keep checkout/auth/download routes fast and low-motion. Honor reduced motion. Do not copy Textura assets/code/copy."

### Task 6 — Backend analytics/subscription hardening
"Using `11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md`, verify Supabase schema/RLS intent, Stripe webhook idempotency, MailerLite group mapping, Resend transactional flows, GA4 event map, server-side analytics table, future subscription placeholders, Sentry, Turnstile, Vercel env docs, and admin surfaces."
