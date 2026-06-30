# Prompt 8 Final QA Report

**Date:** 2026-06-10  
**Scope:** final folder consolidation, handoff package, launch-readiness audit, content/SEO/legal hardening, Vercel Preview readiness, and production go/no-go documentation.  
**Final app folder:** `author-site/`  
**Production status:** **NO-GO**.  
**Preview status:** **GO after sandbox env/provider setup.**

## Commands run and results

| Command | Result | Notes |
|---|---:|---|
| `git status --short` | Pass | Showed expected moves from `apps/author-site/` and `docs/website-v4/` into `author-site/`, plus Prompt 8 edits. |
| `find apps/author-site -maxdepth 3 -type f \| sort \| sed 's#^#- #' \| head -300 \|\| true` | Pass | Pre-consolidation audit command ran before moving. |
| `find docs/website-v4 -maxdepth 1 -type f \| sort \|\| true` | Pass | Pre-consolidation audit command ran before moving. |
| `find release -maxdepth 2 -type f \| sort` | Pass | Confirmed V8 EPUB/PDF release artifacts remain in `release/`. |
| `find author-site -maxdepth 3 -type f \| sort \| sed 's#^#- #' \| head -300` | Pass | Confirmed consolidated website folder. |
| `test -d author-site` | Pass | Root website folder exists. |
| `test -f author-site/package.json` | Pass | App package exists at new root. |
| `test -d author-site/app` | Pass | App Router folder exists. |
| `test -d author-site/docs/website-v4` | Pass | Website docs moved under app folder. |
| `test ! -d apps/author-site` | Pass | Old app path removed. |
| `pnpm install` | Pass | Dependencies installed from `author-site/`. pnpm warned that some dependency build scripts were ignored by default. |
| `pnpm lint` | Pass | ESLint completed with `--max-warnings=0`. |
| `pnpm typecheck` | Pass | TypeScript completed with `tsc --noEmit`. |
| `pnpm test` | Pass after fix | Initial run failed because the deprecated-color static test scanned consolidated docs/setup history. The test was narrowed to app source by excluding `/docs/` and `/setup/`; rerun passed 11 files / 49 tests. |
| `pnpm build` | Pass | Next.js production build completed and generated `/robots.txt` and `/sitemap.xml`. |
| `pnpm check:sandbox` | Pass with expected skipped provider probes | Missing sandbox env is allowed; dangerous live values fail. Supabase/Stripe remote probes skipped due missing credentials. |
| `pnpm check:sandbox-env` | Pass with missing provider config report | Reported missing sandbox Supabase, Stripe, Resend, MailerLite, Turnstile, and analytics values. |
| `pnpm check:deliverables` | Pass | No paid EPUB/PDF files or public paid-file URLs under app public assets. |
| `pnpm check:supabase-storage` | Pass with expected remote skip | Locked bucket/path strings verified; remote probe skipped without Supabase env. |
| `pnpm check:stripe-test` | Pass with expected skip | No live key patterns detected; skipped without Stripe test env. |
| `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E 'sk_live_|rk_live_|whsec_live|supabase_service_role=|STRIPE_SECRET_KEY=.+|RESEND_API_KEY=.+|MAILERLITE_API_KEY=.+|SUPABASE_SERVICE_ROLE_KEY=.+' author-site .env.example \|\| true` | Pass | Documentation-only matches may include recorded scan commands; no real secret values were committed. |
| `find author-site/public -type f \| grep -Ei '\\.(epub\|pdf)$' && exit 1 \|\| true` | Pass | No paid EPUB/PDF files in public assets. |
| `test ! -f author-site/.env.local` | Pass | No local env file committed. |
| `test ! -f author-site/.env.sandbox` | Pass | No sandbox env file committed. |
| `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E 'apps/author-site\|docs/website-v4\|cd apps/author-site\|Root directory: apps/author-site\|root directory: apps/author-site' author-site AGENTS.md README.md 2>/dev/null \|\| true` | Reviewed | Remaining `docs/website-v4` matches are intentional inside the new valid path `author-site/docs/website-v4` or relative `docs/website-v4` references. No `apps/author-site` operational references remain. |

## Route coverage

- Public marketing routes are present and build successfully: `/`, `/book`, `/preorder`, `/buy`, `/free-chapter`, `/chapters`, `/chapter/[slug]`, `/blog`, `/blog/[slug]`, `/resources`, `/worksheets`, `/about`, `/media-kit`, `/faq`, `/contact`.
- Legal/policy routes are present and marked as draft/noindex: `/privacy`, `/terms`, `/refund-policy`, `/preorder-policy`, `/digital-delivery-policy`, `/cookies`, `/accessibility`.
- Auth/customer routes are present and noindex: `/signup`, `/login`, `/logout`, `/dashboard`, `/downloads`, `/bonus-claim`, `/thank-you`.
- Admin routes are present and noindex/dynamic: `/admin`, `/admin/orders`, `/admin/subscribers`, `/admin/claims`, `/admin/content`, `/admin/analytics`.
- API routes are present: `/api/checkout`, `/api/stripe/webhook`, `/api/downloads/sign`, `/api/subscribe`, `/api/free-chapter`, `/api/bonus-claim`, `/api/track`, `/api/health`.

## SEO coverage

- `pageMetadata` now centralizes canonical URLs, robots directives, Open Graph, Twitter metadata, and `NEXT_PUBLIC_SITE_URL`-based URL construction.
- `app/robots.ts` blocks protected/admin/customer/API paths and allows public marketing paths.
- `app/sitemap.ts` emits public marketing, chapter, and blog URLs only.
- Dynamic blog and chapter pages now generate route-specific metadata.
- Public metadata remains conservative and avoids unverified celebrity, awards, bestseller, testimonial, or income claims.

## Schema coverage

- Book JSON-LD exists for the book/direct edition.
- Person JSON-LD exists for Michael David / Michael David Warren Jr.
- Product JSON-LD exists for the direct digital edition offer.
- BlogPosting JSON-LD exists for blog detail pages.
- FAQPage JSON-LD exists for `/faq`.
- Schema copy is claim-safe and tied to current conservative content.

## Accessibility notes

- The app uses readable editorial layouts, semantic routes, strong contrast tokens, and policy copy in structured paragraphs.
- Final manual keyboard, screen reader, and Lighthouse accessibility checks remain required in Vercel Preview before production.

## Motion/reduced-motion notes

- Prompt 4 motion components remain in place: curl cursor trail, magnetic CTA, book tilt, chapter pathway, scroll reveal, and page transition.
- The reduced-motion provider and motion CSS remain part of the app.
- Motion must remain decorative and must not block checkout, auth, downloads, or legal/policy reading.

## Backend/security notes

- Checkout and downloads fail closed without provider env and valid entitlement.
- Stripe webhook signature verification remains required.
- Refund/revocation is represented in entitlement flow and must be provider-tested.
- Admin surfaces remain scaffolded and must be verified against Supabase admin authorization before production.
- Analytics metadata must remain sanitized: no signed URLs, secrets, tokens, full card data, or unnecessary PII.

## Sandbox/provider notes

Provider-backed checks were not run against real sandbox services because no sandbox env values were present in the execution environment. This is expected and safe. The next operator must configure sandbox-only values through local uncommitted env or Vercel Preview env, then rerun the sandbox checks and record provider-backed outcomes.

## Public file safety

- No paid `.epub` or `.pdf` files were found in `author-site/public/`.
- Local release files remain in `release/` and must be uploaded only to private Supabase Storage when provider setup begins.

## Secret safety

- No `.env.local` file exists under `author-site/`.
- No `.env.sandbox` file exists under `author-site/`.
- `.env.example` and `.env.sandbox.example` contain variable names/placeholders only.
- Production/live keys were not added.

## Folder consolidation result

- `apps/author-site/` was moved to `author-site/`.
- `docs/website-v4/` was moved to `author-site/docs/website-v4/`.
- Website setup files were moved to `author-site/setup/`.
- Root `AGENTS.md` was replaced with a pointer to `author-site/AGENTS.md`.

## Known risks

- Legal/policy copy is still draft and requires attorney/human approval.
- Claims evidence is incomplete; public copy must not add celebrity, award, testimonial, or bestseller claims until substantiated.
- Provider-backed checkout, webhook, email, MailerLite, Turnstile, analytics, and protected-download flows still need sandbox credentials and real provider verification.
- Final domain, final imagery, final Kindle/Paperback links, and final email sender/domain are unresolved.
- Admin data surfaces are scaffolded and need provider-backed permission testing.

## Remaining blockers

1. Sandbox env setup.
2. Vercel Preview deployment from root directory `author-site`.
3. Supabase sandbox migration/RLS/private Storage verification.
4. Stripe test checkout/webhook/refund verification.
5. Resend/MailerLite sandbox verification.
6. Turnstile and analytics consent verification.
7. Legal approval.
8. Claims approval.
9. Final domain and brand assets.
10. Michael's explicit production/live payment approval.

## Recommended next operator action

Deploy a Vercel Preview from root directory `author-site`, configure sandbox/test env values only, run the smoke tests in `18_VERCEL_PREVIEW_DEPLOYMENT_GUIDE.md`, then fill the provider-backed sections of `13_SANDBOX_TEST_RESULTS_TEMPLATE.md` and this QA report. Do not proceed to production until `16_PRODUCTION_ACTIVATION_CHECKLIST.md` is complete.
