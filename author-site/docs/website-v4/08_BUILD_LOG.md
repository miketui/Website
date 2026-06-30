<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 08_BUILD_LOG — Prompt 2 Documentation Package

## Prompt 2 scope
Create the full v4 planning/spec package under `author-site/docs/website-v4/` only. Do not scaffold the Next.js app, do not create `author-site/`, do not modify release/book/build/archive/publishing files, do not use real API keys, and do not activate live payments.

## Files created
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

## Conflicts resolved
- Old v3 website materials referenced Vite/Bun/SQLite and older pricing. v4 locks Next.js App Router, TypeScript strict, Tailwind, Supabase, Stripe, Resend, MailerLite, and Vercel.
- Old v3 pricing references `$15.99` preorder and `$17.99` regular were superseded. v4 uses `$17.99` preorder/direct launch and `$19.99` regular direct.
- Older `FINAL` artifact names in the release manifest are superseded by v8 release artifacts.
- Deprecated palette values are documented as banned/deprecated and replaced with locked ACISS tokens.
- Subscription-ready schema is planned without activating a subscription offer.

## Release artifact names confirmed
- EPUB: `release/Curls-and-Contemplation-v8-20260610.epub`.
- PDF: `release/CurlsAndContemplation-POD-Royal-v8-20260610.pdf`.
- These are production source artifacts for later upload to Supabase private Storage, not web-public files.

## Pricing normalization
- Preorder/direct launch: `$17.99`.
- Regular direct: `$19.99`.
- Kindle external bare ebook: `$9.99`.
- Paperback/POD external placeholder: `$29.99`.

## Claims-gating decisions
- No awards, bestseller language, testimonials, sales numbers, celebrity/name claims, or guaranteed outcomes are asserted.
- Author/industry credibility claims beyond basic book facts are tagged `[VERIFY: claims-evidence.md]`.
- Legal pages remain outlines until human/attorney review.

## What was intentionally not built yet
- No `author-site/` app scaffold.
- No Next.js routes or package files.
- No Supabase migrations executed.
- No Stripe products created or live payments activated.
- No release EPUB/PDF copied or moved.
- No web build/test commands run because the app does not exist yet.

## Recommendation for Prompt 3
Scaffold `author-site/` as a strict TypeScript Next.js App Router project using the specs in `author-site/docs/website-v4/01` through `11`; implement route shells, ACISS tokens, core components, typed config, `.env.example` variable names only, Supabase migrations, Stripe test-mode route handlers with signature-verified webhook, protected-download server logic, MailerLite/Resend typed integration stubs, tests, and then run `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` from `author-site/`.

## Prompt 3 — Next.js author-commerce app scaffold (2026-06-10)

### Scope
- Created the actual app scaffold under `author-site/` using Next.js App Router, TypeScript strict, Tailwind, Supabase, Stripe, Resend, MailerLite, analytics, and Vercel-ready conventions.
- Did not modify EPUB, POD, release, archive, or publishing build files.
- Did not copy paid release artifacts into `author-site/public/`.
- Did not add real API keys or live payment credentials.
- Did not activate a live subscription offer; membership/subscription items remain schema/env placeholders only.

### App files created
- Core app config: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`, `middleware.ts`, `.env.example`, `README.md`.
- App Router pages: public, auth/customer, admin, API, dynamic chapter, and dynamic blog routes from the Prompt 3 route list.
- Components: shared commerce/editorial/auth/legal components plus motion/design components for curl trail, magnetic CTA, page transition, scroll reveal, book tilt, and chapter pathway.
- Content/config: `content/site.ts`, `content/book.ts`, `content/chapters.ts`, `content/blog.ts`, `content/worksheets.ts`, `content/faq.ts`, `content/legal-outlines.ts`.
- Libraries: launch mode, env parsing, Supabase clients, Stripe wrapper, entitlements/download signing, email wrappers, analytics/event recording, SEO/schema, admin security, and subscription placeholder modules.
- Supabase migration: `supabase/migrations/0001_author_commerce.sql` with required commerce/customer/analytics/admin tables, RLS enablement, customer self-read policies, service-role/admin intent, and subscription-ready placeholders.
- Tests: launch CTA switching, locked prices, no paid files in public, deprecated hex guard, non-buyer entitlement denial, bad/missing Stripe webhook signature 400, and analytics event exports.

### Commands run and results
- `cd author-site && pnpm install` — passed. Installed Next.js 16.2.9, React 19.2.7, Stripe 22.2.0, Supabase JS 2.108.1, Tailwind 3.4.19, Vitest 4.1.8, and supporting packages. Initial install warned about ignored optional build scripts and peer ranges but completed.
- `cd author-site && pnpm lint` — initially failed because ESLint 10 was incompatible with `eslint-config-next` peer plugins; fixed by pinning ESLint and `@eslint/js` to the ESLint 9 line. A follow-up lint error for `React.ReactNode` and anonymous config export was fixed. Final rerun passed.
- `cd author-site && pnpm typecheck` — initially failed because TypeScript 6 flagged `baseUrl` deprecation and then caught Button prop narrowing plus a pinned Stripe API-version mismatch. Added `ignoreDeprecations`, narrowed Button props safely, and let Stripe use the installed SDK default API version. Final reruns passed.
- `cd author-site && pnpm test` — initially failed because the deprecated-color test included the forbidden hex strings in its own source. Reworked the test to construct the patterns without committing forbidden hex literals. Final rerun passed: 6 files, 9 tests.
- `cd author-site && pnpm build` — passed. Next generated 49 app routes successfully. Build emitted a framework warning that the `middleware` convention is deprecated in favor of `proxy`, but the requested `middleware.ts` remains in place for Prompt 3 compatibility.
- `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E '#0E0D0B|#B89968|#1F6F6B|#2B9999|#C9A961' author-site author-site/docs/website-v4 || true` — completed. Matches are only in the locked docs token spec where deprecated colors are documented as forbidden; no new app-code usage was reported.
- `find author-site/public -type f | grep -Ei '.(epub|pdf)$' && exit 1 || true` — passed with no EPUB/PDF files in public.

### Fixes applied
- Pinned ESLint to a compatible major line for `eslint-config-next`.
- Added TypeScript 6 deprecation acknowledgement for `baseUrl`.
- Fixed `Button` link/button prop narrowing.
- Removed stale explicit Stripe API version to compile against installed Stripe SDK types.
- Adjusted static security test so it does not itself contain deprecated color literals.

### What is real vs scaffolded
Real in this scaffold:
- Route tree, app configuration, ACISS tokens, locked price config, launch-mode CTA switching, server-side checkout price selection, webhook signature verification path, protected download denial/signing path, admin allowlist gate, private Storage object-path references, event map, internal analytics insert scaffold, and Supabase migration/RLS intent.

Still scaffolded / requires production setup:
- Supabase project credentials, actual private Storage bucket upload, Stripe live/test products and webhook endpoint, MailerLite groups/automations, Resend templates, Turnstile verification, real admin data views, GA4/PostHog browser activation, final legal copy, final domain, final external Kindle/paperback links, and production deployment.

### Security notes
- No `.env` values or real credentials were committed.
- Paid EPUB/PDF artifacts were not copied into `public/`.
- Checkout fails closed when Stripe server env/price IDs are absent.
- Webhook rejects missing/bad signature with 400.
- Downloads deny by default when no authenticated entitlement is found.
- Admin pages are noindex and gated by an `ADMIN_EMAILS` scaffold; production should also back this with `admin_users` table checks.

### Recommendation for Prompt 4
Prompt 4 should harden the immersive design/motion pass: convert `middleware.ts` to the newer Next.js `proxy` convention while preserving requested protections, refine responsive page layouts, expand reduced-motion testing, add screenshots for the visible home/preorder/download states, and replace placeholder copy with final claim-verified excerpts from `06_WEBSITE_COPY_v4.md` without inventing new claims.

## Prompt 4 — Immersive Design, Motion, Responsive Polish, and Claim-Safe UX Hardening (2026-06-10)

### Scope
- Hardened only the existing Next.js author-commerce app under `author-site/` plus Prompt 4 documentation and QA notes.
- Did **not** modify EPUB, POD, book manuscript, release artifacts, archive files, or publishing build files.
- Did **not** use real API keys, activate live payments, deploy production, or create a live subscription offer.

### Pre-edit audit findings
- Initial `git status --short` showed existing untracked `tools/` and `validation-reports/` directories from prior validation work; Prompt 4 did not alter publishing artifacts.
- Initial `find author-site -maxdepth 4 -type f | sort | sed 's#^#- #' | head -250` confirmed the scaffold already contained all required app routes, route handlers, motion components, ACISS styles, tests, Supabase migration, and app README.
- Home page existed but its first three sections were structurally minimal and did not yet carry the required Recognition → Problem/Relief → Authority/path emotional pacing.
- Motion components existed but needed stronger route exclusions, reduced-motion behavior, focus states, coarse-pointer disabling, and lower-impact transform/opacity animation.
- Checkout/auth/download/admin/legal surfaces were readable but visually sparse; they needed low-motion polish, clearer empty/scaffold states, and mobile-safe spacing.

### Files changed
- Updated public and utility routes across `author-site/app/` for stronger ACISS hierarchy, safer copy, responsive sections, and clear CTA hierarchy.
- Reworked immersive components: `BookHero`, `BookMockup`, `Header`, `LaunchModeCTA`, design shells, and admin/customer/legal utility shells.
- Hardened motion files: `CurlCursorTrail`, `MagneticCurlButton`, `BookTilt`, `ChapterPathway`, `PageTransition`, `ScrollReveal`, and `ReducedMotionProvider`.
- Added route/motion policy helpers: `author-site/lib/route-policy.ts` and `author-site/lib/motion-policy.ts`.
- Migrated `author-site/middleware.ts` to `author-site/proxy.ts` for Next.js 16 while preserving protected-route noindex behavior.
- Added `author-site/public/.gitkeep` so static security checks can inspect an empty public directory without placing paid assets there.
- Added tests: `tests/motion-static.test.ts` and `tests/route-protection.test.ts`; updated launch CTA expectations for the locked visible CTA labels.

### Design and motion improvements
- Home section 1 now leads with Recognition: “You learned the craft. Nobody taught you the business,” includes layered book presence, direct preorder CTA, free chapter CTA, subtle hairline visual styling, and only claim-safe credibility language.
- Home section 2 now names the unspoken problem across pricing, networking, on-set etiquette, burnout, leadership, and freelance uncertainty.
- Home section 3 now presents the four-part pathway with worksheets/resources/career-map context and a bridge to preorder/book exploration.
- Public pages received a consistent premium PageHero system, editorial panels, mobile-first spacing, ACISS-only colors, and clearer one-primary-action hierarchy.
- Auth, dashboard, downloads, admin, and legal pages remain low-motion, readable, and scaffold-explicit.
- Curl cursor trail is desktop/fine-pointer only, disabled for reduced motion and excluded routes, uses pointer-events none, low opacity SVG strand marks, and requestAnimationFrame updates.
- Magnetic CTA now has subtle hover-only magnetism, visible keyboard focus, reduced-motion fallback, disabled/loading safeguards, and readable label treatment.
- Book tilt, pathway, scroll reveal, and page transitions now avoid heavy animation on checkout/auth/dashboard/download/admin/legal routes and fall back to static states under reduced motion.

### Middleware/proxy decision
- Installed Next.js resolved to `16.2.9`; Next.js 16 supports the `proxy.ts` convention and deprecates `middleware.ts`.
- Migrated the existing middleware logic to `author-site/proxy.ts` using `export function proxy(request)` and preserved `x-author-site` plus `X-Robots-Tag: noindex, nofollow` for protected route prefixes.
- Removed `author-site/middleware.ts` to avoid the Next.js 16 deprecation warning.

### Screenshot attempt result
- Started Next.js dev server successfully at `http://127.0.0.1:3000`.
- Ran `pnpm dlx playwright@latest install chromium`; Playwright browser download completed.
- Screenshot capture failed before rendering because Playwright Chromium could not load the required system library `libatk-1.0.so.0` in this container.
- No screenshot PNGs were produced; this is an environment dependency blocker, not an app build blocker.

### Tests added / improved
- Added static and policy tests for curl cursor reduced-motion disabling, excluded route patterns, pointer-events none, fine pointer gate, and requestAnimationFrame use.
- Added static test coverage for MagneticCurlButton focus-visible/reduced-motion/disabled safeguards.
- Added route protection tests for protected route prefixes, proxy convention, and noindex metadata behavior.
- Preserved and updated locked pricing and launch-mode CTA tests.
- Static security checks continue to assert deprecated colors are absent and paid EPUB/PDF files are not in `public/`.

### Commands run and results
- PASS: `git status --short`
- PASS: `find author-site -maxdepth 4 -type f | sort | sed 's#^#- #' | head -250`
- PASS: `cd author-site && pnpm install`
- FAIL then fixed: `cd author-site && pnpm lint` initially flagged synchronous setState in motion effects; fixed by deferring pointer-media initialization and avoiding immediate effect state clearing.
- PASS after fix: `cd author-site && pnpm lint`
- PASS: `cd author-site && pnpm typecheck`
- FAIL then fixed: `cd author-site && pnpm test` initially found a missing `public/` directory and a too-literal noindex string assertion; fixed with `public/.gitkeep` and metadata-aligned assertions.
- PASS after fix: `cd author-site && pnpm test`
- PASS: `cd author-site && pnpm build`
- PASS: `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E '#0E0D0B|#B89968|#1F6F6B|#2B9999|#C9A961' author-site || true`
- PASS: `find author-site/public -type f | grep -Ei '.(epub|pdf)$' && exit 1 || true`
- WARNING: `pnpm dlx playwright@latest screenshot ...` blocked by missing container library `libatk-1.0.so.0`.

### What is real vs scaffolded
- Real: ACISS-aligned responsive UI structure, route pages, noindex/proxy headers for protected surfaces, motion route exclusions, reduced-motion handling, static/security tests, private-delivery references, locked pricing, and claim-safe copy discipline.
- Scaffolded: Stripe checkout activation, Supabase Auth sessions, Supabase private Storage signed URL delivery, MailerLite/Resend production sends, admin data, analytics dashboards, media-kit assets, and any future subscription/resource-library offer.

### Remaining visual risks
- Browser screenshots could not be generated in this environment; a human should run Playwright or Vercel preview screenshots on a machine with Chromium system dependencies.
- Final typography should be reviewed once production fonts/assets are approved.
- Book mockup remains CSS-rendered until final approved cover art is provided.
- Copy is intentionally conservative; any stronger author credibility language requires fresh evidence and approval through `marketing/website/claims-evidence.md`.

### Recommendation for Prompt 5
- Prompt 5 should focus on backend/security implementation hardening only after owner-provided sandbox credentials are available: Supabase Auth/DB/RLS/private Storage wiring, Stripe Checkout/webhook integration with signature verification, entitlement creation/revocation, Resend/MailerLite test-mode flows, and admin data access checks. Do not activate production payments or subscriptions until Michael explicitly approves the offer and keys.

## Prompt 5 — Backend, Security, Analytics, Supabase, Stripe, Entitlement, Email, Admin-Data, and Integration Hardening (2026-06-10)

### Scope
- Hardened the existing app under `author-site/` for sandbox-ready Supabase, Stripe Checkout/webhooks, protected downloads, entitlement checks, Resend, MailerLite, consent-aware analytics, admin gates, and static security checks.
- Did **not** modify EPUB, POD, book, release, archive, or publishing build files.
- Did **not** copy paid EPUB/PDF files into `public/`, commit real secrets, activate live payments, deploy production, or create a live subscription offer.

### Pre-edit audit findings
- `git status --short` showed pre-existing untracked `tools/` and `validation-reports/`; these were not touched.
- API routes existed but were scaffold-light: checkout used Zod but trusted only basic product input; webhook verified signatures but had no typed idempotent handlers; downloads denied by default in tests but needed typed reasons and private locked paths; subscribe/free-chapter/bonus-claim needed safer typed fallback responses.
- `lib/env.ts` parsed all env at import time but needed separate public/server helpers, route-level runtime config results, and no build-time production-secret requirement.
- Supabase clients existed but needed browser/server separation, service-role confinement, current user helpers, and admin allowlist/admin_users readiness.
- Migration contained the core tables but needed stronger checks, subscription-ready inactive fields, detailed RLS policy intent, admin policies, and private bucket notes.
- MailerLite/Resend wrappers skipped missing config but needed typed groups/templates and invalid-email handling.
- Analytics event map needed the full Prompt 5 taxonomy, consent behavior, and metadata sanitization.

### Files changed
- Backend/API: `app/api/checkout/route.ts`, `app/api/stripe/webhook/route.ts`, `app/api/downloads/sign/route.ts`, `app/api/subscribe/route.ts`, `app/api/free-chapter/route.ts`, `app/api/bonus-claim/route.ts`, `app/api/track/route.ts`.
- Libraries: `lib/env.ts`, `lib/stripe.ts`, `lib/entitlements.ts`, `lib/downloads.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/email/mailerlite.ts`, `lib/email/resend.ts`, `lib/analytics.ts`, `lib/events/server-analytics.ts`, `lib/security.ts`.
- UI/admin/customer: `components/AnalyticsEvent.tsx`, `components/ConsentBanner.tsx`, `app/downloads/page.tsx`, `content/site.ts`.
- Database: `supabase/migrations/0001_author_commerce.sql`.
- Tests: `tests/prompt5-backend.test.ts`, `tests/static-security-prompt5.test.ts`, plus existing analytics/security/webhook tests remain active.
- Docs/env: `author-site/.env.example`, `author-site/README.md`, `author-site/docs/website-v4/07_WORKFLOW_AND_KEYS.md`, `author-site/docs/website-v4/09_LAUNCH_QA_CHECKLIST.md`, this build log.

### Backend/security improvements
- Environment helpers now fail safely at route runtime with typed `config_missing` results and expose `getSiteUrl`, `getLaunchMode`, `getStripeConfig`, `getSupabaseServerConfig`, `getMailerLiteConfig`, `getResendConfig`, and `getAnalyticsConfig` without logging secret values.
- Server-side Supabase helper confines service-role usage to server modules and adds session/admin helper support.
- API responses avoid raw stack traces and return typed error codes.
- Static tests check no `.env.local`, no paid EPUB/PDF in public, no release/public paths returned from download API, webhook raw body/signature verification, and no service-role key in client components.

### Supabase/RLS improvements
- Migration now includes `profiles`, `products`, `prices`, `orders`, `purchases`, `download_tokens`, `download_events`, `bonus_claims`, `subscribers`, `subscriber_events`, `consent_log`, `webhook_events`, `analytics_events`, `gate_ledger`, `admin_users`, and inactive membership placeholders.
- Product/price/purchase schema supports future subscription data (`products.type`, `prices.interval`, purchase statuses) without making a live subscription offer.
- RLS comments explain own-profile, own-purchase, own-download metadata, bonus claim, subscriber insert, admin, and service-role intentions.
- Private bucket note locks storage to `curls-deliverables` with server-generated signed URLs only.

### Stripe checkout/webhook improvements
- Checkout validates with Zod, ignores client price/priceId, selects price IDs server-side by launch mode, blocks paused mode, builds success/cancel URLs from `NEXT_PUBLIC_SITE_URL`, optionally passes valid customer email, and writes safe metadata.
- Webhook reads raw body via `request.text()`, verifies `STRIPE_WEBHOOK_SECRET`, rejects missing/bad signatures with 400, records idempotency through `webhook_events`, and scaffolds handlers for checkout completion, payment intent success, refunds, expired checkout sessions, and subscription event placeholders.
- Checkout completion helper creates order/purchase/subscriber/analytics/email intents when Supabase and providers are configured; refund helper revokes entitlement in the mocked/sandbox path.

### Download entitlement improvements
- Downloads deny by default, require a session, check active purchase by user ID or email, deny refunded/revoked/canceled/past_due purchases, enforce a 3 downloads / 7 days cap scaffold, use a 24-hour signed URL TTL, and never return local `release/` or app `public/` paths.
- Locked private target paths are `books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub` and `books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf` in bucket `curls-deliverables`.

### MailerLite/Resend improvements
- MailerLite has typed group mapping for Subscribers, Free Chapter, Preorders, Customers, Abandoned Checkout, Bonus Claim Started, Bonus Claim Completed, Refunded, Blog Readers, and VIP / Early Readers.
- Resend has typed helper/templates for order confirmation, download access, free chapter delivery, bonus claim received, refund/access revoked, and support receipt.
- Missing provider config skips safely; invalid emails are rejected; no API key values are logged or returned.

### Analytics improvements
- Central event map now includes Prompt 5 marketing, commerce, auth, customer, and design/experience names.
- `/api/track` validates event names with Zod, respects consent for client analytics, allows operational server events, and strips sensitive metadata such as tokens, signed URLs, keys, email, payment/card fields.
- Consent banner stores explicit analytics choice and keeps operational security/order/download events separate from marketing consent.

### Tests added/updated
- Added Prompt 5 backend tests for server-side price selection, paused checkout, metadata, private deliverable paths, unauthenticated denial, MailerLite mapping/skips, Resend templates/skips, analytics sanitization, and admin allowlist behavior.
- Added Prompt 5 static security tests for local env files, paid public files, release path leakage, webhook signature verification, and service-role key client leakage.

### Commands run and results
- `git status --short` — passed; pre-existing untracked `tools/` and `validation-reports/` noted.
- `find author-site/app/api -maxdepth 5 -type f | sort` — passed.
- `find author-site/lib -maxdepth 5 -type f | sort` — passed.
- `find author-site/supabase -maxdepth 5 -type f | sort` — passed.
- `find author-site/tests -maxdepth 3 -type f | sort` — passed.
- `cd author-site && pnpm install` — passed; installed dependencies from lockfile. Warning: optional build scripts for `sharp`/`unrs-resolver` were ignored by pnpm policy.
- `cd author-site && pnpm typecheck` — initially failed before install because `node_modules` were absent; passed after `pnpm install`.
- `cd author-site && pnpm test` — initially failed because `server-only` was not available in Vitest and legacy analytics aliases expected Prompt 4 names; removed that import and kept backward-compatible aliases. Final run passed: 10 files, 41 tests.
- `cd author-site && pnpm lint` — initially failed on synchronous `setState` in `ConsentBanner`; fixed with lazy state initialization. Final run passed.
- Final build/static security commands are recorded after validation below.

### What is real vs scaffolded
- Real: typed fail-closed routes, server-side Stripe price selection, raw-body webhook verification, idempotency table writes when configured, entitlement denial/signing path, private storage paths, migration/RLS policy intent, email provider wrappers, analytics sanitization/consent scaffolding, admin allowlist/admin_users gate, static security tests.
- Scaffolded: Supabase project connection, actual Storage bucket/object upload, Stripe test products/prices/webhook endpoint, Resend verified sender/domain, MailerLite group IDs/automations, Turnstile remote verification, GA4/PostHog activation, real admin data tables UI, and any future subscription offer.

### Credentials missing in this environment
- Missing/unused sandbox credentials: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PREORDER`, `STRIPE_PRICE_ID_REGULAR`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SUPPORT_EMAIL`, `MAILERLITE_API_KEY`, MailerLite group IDs, `TURNSTILE_SECRET_KEY`, GA4/PostHog optional keys.
- Tests used mocks/static assertions and safe skipped-provider responses where credentials were absent.

### Risk register
- Supabase SQL must be applied to a sandbox project and RLS verified with anon/authenticated/service-role clients before production.
- Stripe webhook idempotency and order/purchase writes require sandbox event replay with test price IDs.
- Download cap currently uses purchase `download_count`; production may need rolling-window enforcement via `download_events` query before launch.
- Resend free-chapter delivery intentionally does not include a fake public URL; final asset/email attachment strategy needs approval.
- Admin pages are gated and noindex but still scaffolded; production data views should be built behind server-only admin routes.

### Recommendation for Prompt 6
Prompt 6 should connect sandbox credentials only: create a Supabase sandbox project, apply the migration, create the private `curls-deliverables` bucket, upload the two locked release artifacts to the private paths, create Stripe test-mode products/prices/webhook endpoint, configure Resend/MailerLite sandbox settings, run webhook/download/email integration tests against sandbox, and keep production/live activation blocked until QA/legal/domain approvals are complete.

### Final Prompt 5 validation results
- `cd author-site && pnpm install` — passed; lockfile already up to date.
- `cd author-site && pnpm lint` — passed after fixing the consent banner state initialization.
- `cd author-site && pnpm typecheck` — passed.
- `cd author-site && pnpm test` — passed: 10 test files, 41 tests.
- `cd author-site && pnpm build` — passed; Next generated 49 routes and kept protected/admin/API routes dynamic where expected.
- `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E '#0E0D0B|#B89968|#1F6F6B|#2B9999|#C9A961' author-site || true` — passed; no deprecated hex values found in app code.
- `find author-site/public -type f | grep -Ei '.(epub|pdf)$' && exit 1 || true` — passed; no paid EPUB/PDF files found in app public assets.
- a recursive secret-pattern scan over app/docs/env-example paths — passed; no real secret-looking values found.

## Prompt 6 — Sandbox Integration Readiness and Safe Sandbox Wiring (2026-06-10)

### Scope
- Prepared sandbox integration readiness for Supabase, Stripe, private downloads, Resend, MailerLite, Turnstile, and analytics under the locked app `author-site/`.
- Did **not** use production/live API keys, activate live payments, deploy production, create or advertise a live subscription offer, or copy paid EPUB/PDF files into public assets.
- Did **not** modify EPUB, POD, book, release, archive, or publishing build files.
- Preserved Prompt 4 immersive UX work and Prompt 5 backend/security hardening.

### Pre-edit audit findings
- `git status --short` showed pre-existing untracked `tools/` and `validation-reports/` directories. Prompt 6 did not edit or stage them.
- API route audit confirmed existing handlers for bonus claim, checkout, downloads signing, free chapter, health, Stripe webhook, subscribe, and track under `author-site/app/api/`.
- Library audit confirmed existing modules for environment parsing, Supabase server/client setup, Stripe checkout metadata/price selection, protected downloads, entitlements, Resend, MailerLite, analytics, server analytics, route/security policy, schema, SEO, and subscription placeholders.
- Supabase audit confirmed `author-site/supabase/migrations/0001_author_commerce.sql` exists with product/price/order/purchase/download/subscriber/analytics/admin/membership tables and RLS intent.
- Tests audit confirmed Prompt 5 tests already covered analytics, entitlements, launch mode, motion static checks, price config, backend wrappers, route protection, security static checks, and Stripe webhook behavior.
- Release artifact audit confirmed the locked local artifacts remain under `release/`: `Curls-and-Contemplation-v8-20260610.epub` and `CurlsAndContemplation-POD-Royal-v8-20260610.pdf`.
- `.env.example` contains variable names only; no real secrets were present.
- README already documented private Storage, Stripe server-side price selection, webhook signature verification, secure downloads, and production activation gates, but needed a full Prompt 6 sandbox integration section.
- Sandbox credentials were not present in this Codex environment during Prompt 6, so remote provider checks were safely skipped and documented instead of treated as failures.

### Files changed
- Created `author-site/docs/website-v4/12_SANDBOX_INTEGRATION_RUNBOOK.md` with step-by-step Supabase, Stripe test mode, Resend, MailerLite, Turnstile, analytics, and Vercel Preview setup.
- Created `author-site/docs/website-v4/13_SANDBOX_TEST_RESULTS_TEMPLATE.md` for Michael/Codex to record sandbox verification without secrets.
- Created `author-site/.env.sandbox.example` with safe placeholders only and explicit no-secret warnings.
- Created `author-site/scripts/check-sandbox-env.mjs`, `check-public-deliverables.mjs`, `verify-supabase-storage-paths.mjs`, and `stripe-test-mode-check.mjs`.
- Updated `author-site/package.json` with `check:sandbox-env`, `check:deliverables`, `check:supabase-storage`, `check:stripe-test`, and aggregate `check:sandbox` scripts.
- Created `author-site/tests/sandbox-integration-readiness.test.ts` and `tests/mjs-scripts.d.ts`.
- Created `author-site/supabase/seed.sandbox.sql` with placeholder test products/prices only.
- Updated `author-site/README.md`, `author-site/docs/website-v4/07_WORKFLOW_AND_KEYS.md`, and `author-site/docs/website-v4/09_LAUNCH_QA_CHECKLIST.md` with sandbox credential gates, RLS/storage checks, webhook replay, email provider verification, analytics consent checks, and production lock guidance.
- Updated root `.gitignore` to keep local `.env.local` and `.env.sandbox` files out of git.

### Sandbox integration readiness created
- Supabase: locked private bucket/object paths are codified, private bucket setup is documented, migration/RLS verification steps are documented, and `pnpm check:supabase-storage` verifies static paths plus optionally probes the remote bucket/objects when service-role sandbox credentials exist.
- Stripe: test-mode products/prices/webhook setup is documented, live key patterns are blocked, and `pnpm check:stripe-test` safely skips missing credentials.
- Private downloads: `pnpm check:deliverables` fails if paid `.epub`/`.pdf` files appear in `author-site/public/` or paid file paths are advertised as public URLs.
- Resend/MailerLite: sandbox sender/group setup and expected transactional/group-assignment tests are documented; production broadcasts remain blocked.
- Turnstile: sandbox/test key behavior and safe missing-key handling are documented.
- Analytics: GA4/PostHog sandbox and consent-mode behavior are documented; signed URLs, secrets, tokens, and full PII remain forbidden in event payloads.

### Credential availability and provider test status
- Supabase credentials: missing; static storage path verification passed and remote bucket/object probe skipped safely.
- Stripe credentials: missing; test-mode key check skipped safely after confirming no live key patterns in environment.
- Resend credentials: missing; documented sandbox tests remain blocked until Michael supplies sandbox sender/API credentials.
- MailerLite credentials: missing; documented group add/update tests remain blocked until Michael supplies sandbox API/group IDs.
- Turnstile credentials: missing; sandbox verification remains blocked until sandbox/test keys are supplied.
- Analytics credentials: missing; consent and server-event behavior remain available for static/app testing, but GA4/PostHog sandbox verification is blocked until IDs are supplied.

### Commands run and results
- `git status --short` — passed; showed pre-existing untracked `tools/` and `validation-reports/` plus Prompt 6 working-tree changes.
- `find author-site/app/api -maxdepth 5 -type f | sort` — passed; confirmed Prompt 5 API route files.
- `find author-site/lib -maxdepth 5 -type f | sort` — passed; confirmed Prompt 5 integration/security libraries.
- `find author-site/supabase -maxdepth 5 -type f | sort` — passed; confirmed migration before Prompt 6 seed addition.
- `find author-site/tests -maxdepth 3 -type f | sort` — passed; confirmed existing tests before Prompt 6 readiness test addition.
- `find release -maxdepth 2 -type f | sort` — passed; confirmed locked release artifacts remained outside public.
- `cd author-site && pnpm check:sandbox` — passed; provider credentials missing/skipped where appropriate, no dangerous live values detected, no public paid files detected, static private Storage paths verified.
- `cd author-site && pnpm install` — passed; dependencies installed from lockfile. Warning: optional package build scripts for `sharp` and `unrs-resolver` were ignored by pnpm policy.
- `cd author-site && pnpm typecheck` — initially failed because TypeScript needed declarations for imported `.mjs` check scripts and stricter `execFileSync` env typing; fixed by adding `tests/mjs-scripts.d.ts` and preserving `process.env` in the test env object. Rerun passed.
- `cd author-site && pnpm lint` — initially failed because `NodeJS` was flagged in the declaration helper; fixed by using a plain `Record<string, string | undefined>` type. Rerun passed.
- `cd author-site && pnpm test` — passed; 11 files, 49 tests.

### What remains blocked
- Real Supabase sandbox verification until Michael supplies sandbox project URL, anon key, service role key, and uploads the locked EPUB/PDF to private Storage.
- Stripe checkout/webhook/refund replay until Michael supplies Stripe test-mode keys, price IDs, and webhook secret.
- Resend test sends until Michael supplies sandbox API key and sender/support emails.
- MailerLite group assignment tests until Michael supplies sandbox API key and group IDs.
- Turnstile remote verification until sandbox/test keys are configured.
- GA4/PostHog sandbox verification until sandbox measurement/project IDs are configured.
- Production activation remains blocked: no live keys, no live payments, no production deploy, no live subscription offer.

### Recommendation for Prompt 7
Prompt 7 should use Michael-supplied sandbox credentials to perform real provider verification only in local/preview sandbox scope: apply the Supabase migration, verify RLS and private Storage objects, run Stripe test checkout/webhook/refund replay, send Resend sandbox emails, verify MailerLite sandbox group assignments, test Turnstile, verify analytics consent behavior, and fill out `author-site/docs/website-v4/13_SANDBOX_TEST_RESULTS_TEMPLATE.md` without committing secrets or activating production.

### Final validation addendum
- `cd author-site && pnpm lint && pnpm typecheck && pnpm test && pnpm build && pnpm check:sandbox` — passed after the Prompt 6 fixes above. Build generated 49 app routes and kept production activation untouched.
- `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E 'sk_live_|rk_live_|whsec_live|supabase_service_role=|STRIPE_SECRET_KEY=.+|RESEND_API_KEY=.+|MAILERLITE_API_KEY=.+|SUPABASE_SERVICE_ROLE_KEY=.+' author-site author-site/docs/website-v4 .env.example || true` — passed with documentation-only matches for the recorded scan command and no real secret values.
- `find author-site/public -type f | grep -Ei '.(epub|pdf)$' && exit 1 || true` — passed with no paid EPUB/PDF files in public.


## Prompt 7 — Sandbox Provider Verification and Test-Result Documentation (2026-06-10)

### Scope
- Verified as much sandbox-provider readiness as possible for Supabase, Stripe test mode, private downloads, Resend, MailerLite, Turnstile, analytics, and Vercel Preview readiness without live/production credentials.
- Created `author-site/docs/website-v4/14_SANDBOX_VERIFICATION_REPORT.md` and filled the Prompt 7 results section in `author-site/docs/website-v4/13_SANDBOX_TEST_RESULTS_TEMPLATE.md`.
- Did not modify EPUB, POD, book, release, archive, or publishing build files; did not move paid deliverables into `author-site/public/`.
- Did not activate live payments, create a live subscription offer, or deploy production.

### Prompt 6 state audit findings before editing
- `git status --short` showed pre-existing untracked `tools/` and `validation-reports/` directories. Prompt 7 did not edit or stage them.
- `author-site/scripts/` contained the four Prompt 6 safety scripts: sandbox env, public deliverables, Supabase storage path, and Stripe test-mode checks.
- `author-site/tests/` contained Prompt 4/5/6 static and behavior suites, including `sandbox-integration-readiness.test.ts`.
- `author-site/docs/website-v4/` contained Prompt 6 runbook/template docs through `13_SANDBOX_TEST_RESULTS_TEMPLATE.md`.
- `release/` contained the locked V8 EPUB/PDF artifacts plus manifest/check outputs; those files were not modified.
- Runtime environment did not provide sandbox credentials for Supabase, Stripe, Resend, MailerLite, Turnstile, GA4, or PostHog.

### Files changed
- `author-site/scripts/check-sandbox-env.mjs` — tightened presence detection so placeholder values are treated as missing and included the refunded MailerLite group in sandbox readiness status.
- `author-site/scripts/verify-supabase-storage-paths.mjs` — loads safe sandbox env sources, treats placeholders as missing, checks all required Supabase env names, and enforces the locked bucket name before remote probes.
- `author-site/scripts/stripe-test-mode-check.mjs` — loads safe sandbox env sources, treats placeholders as missing, rejects non-test key patterns, and validates Stripe price ID shape when present.
- `author-site/tests/sandbox-integration-readiness.test.ts` — updated the script-output smoke test to use Stripe price-shaped placeholder IDs.
- `author-site/docs/website-v4/13_SANDBOX_TEST_RESULTS_TEMPLATE.md` — added Prompt 7 filled provider results.
- `author-site/docs/website-v4/14_SANDBOX_VERIFICATION_REPORT.md` — created the verification report.
- `author-site/docs/website-v4/09_LAUNCH_QA_CHECKLIST.md` — added Prompt 7 sandbox verification gates.
- `author-site/README.md` — added Prompt 7 sandbox verification usage notes.

### Commands run
- `git status --short`
- `find author-site/scripts -maxdepth 2 -type f | sort`
- `find author-site/tests -maxdepth 3 -type f | sort`
- `find author-site/docs/website-v4 -maxdepth 1 -type f | sort`
- `find release -maxdepth 2 -type f | sort`
- `cd author-site && pnpm check:supabase-storage`
- `cd author-site && pnpm check:stripe-test`
- `cd author-site && pnpm install`
- `cd author-site && pnpm lint`
- `cd author-site && pnpm typecheck`
- `cd author-site && pnpm test`
- `cd author-site && pnpm build`
- `cd author-site && pnpm check:sandbox`
- `cd author-site && pnpm check:sandbox-env`
- `cd author-site && pnpm check:deliverables`
- `cd author-site && pnpm check:supabase-storage`
- `cd author-site && pnpm check:stripe-test`
- Secret-pattern scan over `author-site`, `author-site/docs/website-v4`, and `.env.example`
- Public paid-file scan under `author-site/public`
- Local env file absence checks for `.env.local` and `.env.sandbox`

### Provider verification result
- Supabase: `SKIPPED — credentials missing` for remote provider checks; static locked bucket/object path checks passed.
- Stripe: `SKIPPED — credentials missing` for test Checkout Session and webhook replay; live/prod key rejection checks passed.
- Resend: `SKIPPED — credentials missing`; no email was sent.
- MailerLite: `SKIPPED — credentials missing`; no subscriber/group mutation was attempted.
- Turnstile: `SKIPPED — credentials missing` for remote validation; fail-safe config posture remains documented.
- Analytics: `SKIPPED — credentials missing` for remote ingestion; local consent/event/sanitization tests passed.
- Vercel Preview: `BLOCKED — human/provider setup required` until sandbox-only env vars are configured in Preview.

### Credentials present/missing
- Present: no provider sandbox credentials were detected in the runtime environment.
- Missing: Supabase, Stripe, Resend, MailerLite, Turnstile, GA4/PostHog, and Vercel Preview provider env values listed in `14_SANDBOX_VERIFICATION_REPORT.md`.

### Sandbox skipped items
- Supabase migration/RLS/private bucket/object signed URL checks.
- Stripe test Checkout Session, webhook replay, and refund/revocation provider flow.
- Resend transactional send verification.
- MailerLite subscriber add/update and group assignment.
- Turnstile remote challenge validation.
- GA4/PostHog sandbox ingestion.

### Failures/fixes
- Improved sandbox check scripts before full validation so placeholder values copied from examples are treated as missing instead of provider-ready.
- Improved Supabase storage verification to list all required missing env names and enforce `SUPABASE_STORAGE_BUCKET=curls-deliverables` before remote checks.
- Improved Stripe verification to reject malformed price IDs when supplied.
- No real provider failure occurred because provider-backed checks were safely skipped due to missing credentials.

### Production lock status
- Production remains locked: no live keys, no live payments, no production deploy, no live subscription offer, and no public paid deliverables.

### Recommendation for Prompt 8
- Prompt 8 should configure sandbox credentials only in secure local/Vercel Preview env, run provider-backed Supabase RLS/private Storage/signed URL checks, Stripe test checkout/webhook/refund replay, Resend/MailerLite sandbox-recipient tests, Turnstile invalid-challenge tests, and analytics consent/ingestion verification before any production launch planning.

---

# Prompt 8 — Final folder consolidation and launch-readiness handoff

## Scope

Prompt 8 consolidated all website-related files into a single root-level `author-site/` folder, created final handoff/activation/QA/preview docs, hardened SEO/schema/legal outlines, verified Vercel Preview readiness, and kept production locked.

## Folder consolidation summary

- Moved `apps/author-site/` to `author-site/`.
- Moved `docs/website-v4/` to `author-site/docs/website-v4/`.
- Moved website setup docs/scripts into `author-site/setup/`.
- Copied the full website instructions into `author-site/AGENTS.md`.
- Replaced root `AGENTS.md` with a minimal pointer to `author-site/AGENTS.md`.
- Merged root website `.env.example` content into `author-site/.env.example` and removed the root `.env.example`.
- Confirmed no paid EPUB/PDF files were copied into `author-site/public/`.

## Files moved

- `apps/author-site/**` → `author-site/**`
- `docs/website-v4/**` → `author-site/docs/website-v4/**`
- `CODEX_MASTER_PROMPT.md` → `author-site/setup/CODEX_MASTER_PROMPT.md`
- `CODEX_CLOUD_ENVIRONMENT.md` → `author-site/setup/CODEX_CLOUD_ENVIRONMENT.md`
- `10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md` → `author-site/setup/10_IMMERSIVE_DESIGN_FORMATTING_STYLE_GUIDE.md`
- `11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md` → `author-site/setup/11_BACKEND_ANALYTICS_SUBSCRIPTION_SETUP.md`
- `setup.sh` → `author-site/setup/setup.sh`

## Files changed

- `AGENTS.md` — reduced to root pointer only.
- `author-site/AGENTS.md` — website-specific instructions now live inside the consolidated site folder.
- `author-site/README.md` — updated for the new root, final handoff docs, and Vercel Preview root directory.
- `author-site/.env.example` — merged/deduped root/app env names with no real values.
- `author-site/lib/seo.ts` — added canonical URL, Open Graph, Twitter, and noindex helper support.
- `author-site/lib/schema.ts` — added Person, Product, FAQ, and BlogPosting JSON-LD helpers alongside Book schema.
- `author-site/app/robots.ts` — added robots policy for public vs protected/API paths.
- `author-site/app/sitemap.ts` — added sitemap generation for public marketing, blog, and chapter routes.
- `author-site/app/layout.tsx` — added global metadata improvements and Person JSON-LD.
- `author-site/app/book/page.tsx` — added Book/Product JSON-LD.
- `author-site/app/faq/page.tsx` — added FAQ JSON-LD.
- `author-site/app/blog/[slug]/page.tsx` — added dynamic metadata and BlogPosting JSON-LD.
- `author-site/app/chapter/[slug]/page.tsx` — added dynamic metadata.
- `author-site/content/legal-outlines.ts` — expanded draft legal/policy outlines with protected delivery, preorder, refund/revocation, privacy/cookies/analytics, and accessibility notes.
- `author-site/tests/security-static.test.ts` — narrowed deprecated-color app-source scan to exclude consolidated docs/setup history.

## Final handoff documents created

- `author-site/docs/website-v4/15_FINAL_HANDOFF.md`
- `author-site/docs/website-v4/16_PRODUCTION_ACTIVATION_CHECKLIST.md`
- `author-site/docs/website-v4/17_FINAL_QA_REPORT.md`
- `author-site/docs/website-v4/18_VERCEL_PREVIEW_DEPLOYMENT_GUIDE.md`

## Content/SEO/legal fixes made

- Centralized canonical/Open Graph/Twitter metadata behavior through `NEXT_PUBLIC_SITE_URL`.
- Added `robots.txt` and `sitemap.xml` generation.
- Added Book, Person, Product, BlogPosting, and FAQ JSON-LD helpers.
- Added route-specific metadata for dynamic blog/chapter pages.
- Expanded legal pages as draft/pending attorney approval outlines with clear protected-download, preorder, refund/revocation, privacy/cookies, analytics, and accessibility language.
- Kept all copy conservative: no fake urgency, no fake reviews/testimonials, no unverified celebrity claims, no awards, and no bestseller guarantees.

## Commands run

- `git status --short`
- `find apps/author-site -maxdepth 3 -type f | sort | sed 's#^#- #' | head -300 || true`
- `find docs/website-v4 -maxdepth 1 -type f | sort || true`
- `find release -maxdepth 2 -type f | sort`
- `find author-site -maxdepth 3 -type f | sort | sed 's#^#- #' | head -300`
- `test -d author-site`
- `test -f author-site/package.json`
- `test -d author-site/app`
- `test -d author-site/docs/website-v4`
- `test ! -d apps/author-site`
- `cd author-site && pnpm install`
- `cd author-site && pnpm lint`
- `cd author-site && pnpm typecheck`
- `cd author-site && pnpm test`
- `cd author-site && pnpm build`
- `cd author-site && pnpm check:sandbox`
- `cd author-site && pnpm check:sandbox-env`
- `cd author-site && pnpm check:deliverables`
- `cd author-site && pnpm check:supabase-storage`
- `cd author-site && pnpm check:stripe-test`
- `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E 'sk_live_|rk_live_|whsec_live|supabase_service_role=|STRIPE_SECRET_KEY=.+|RESEND_API_KEY=.+|MAILERLITE_API_KEY=.+|SUPABASE_SERVICE_ROLE_KEY=.+' author-site .env.example || true`
- `find author-site/public -type f | grep -Ei '\.(epub|pdf)$' && exit 1 || true`
- `test ! -f author-site/.env.local`
- `test ! -f author-site/.env.sandbox`
- `grep -RIn --exclude-dir=node_modules --exclude-dir=.next -E 'apps/author-site|docs/website-v4|cd apps/author-site|Root directory: apps/author-site|root directory: apps/author-site' author-site AGENTS.md README.md 2>/dev/null || true`

## Pass/fail results

- PASS: `pnpm install`
- PASS: `pnpm lint`
- PASS: `pnpm typecheck`
- PASS after fix: `pnpm test` initially failed because docs/setup history moved inside `author-site/` caused the deprecated-color test to scan documentation. The test was corrected to scan app source and exclude `/docs/` and `/setup/`; rerun passed.
- PASS: `pnpm build`
- PASS with expected missing-provider reports/skips: `pnpm check:sandbox`, `pnpm check:sandbox-env`, `pnpm check:deliverables`, `pnpm check:supabase-storage`, `pnpm check:stripe-test`.
- PASS: no `.env.local` or `.env.sandbox` file exists.
- PASS: no paid EPUB/PDF file exists in `author-site/public/`.
- REVIEWED: path-reference grep still finds valid `author-site/docs/website-v4` and relative `docs/website-v4` references. No operational `apps/author-site` references remain.

## Preview-ready

- The project can be imported into Vercel with root directory `author-site`.
- Preview can run after sandbox/test env values are configured.
- Build passes locally.
- Public/protected route separation, robots, sitemap, schema helpers, and sandbox checks are in place.

## Production-blocked

- Production live payments are not activated.
- Production provider keys are not configured.
- Legal copy is not attorney-approved.
- Claims evidence remains incomplete.
- Final domain, DNS, imagery, email sender/domain, Kindle link, and paperback/POD link remain Michael decisions.
- Supabase/Stripe/Resend/MailerLite/Turnstile/analytics provider-backed sandbox verification remains required.

## Exact next human/operator steps

1. Michael chooses final domain, release date, launch mode, email sender/domain, Kindle link, paperback link, and final imagery.
2. Operator creates Vercel Preview with root directory `author-site`.
3. Operator configures sandbox/test env vars only.
4. Operator applies Supabase sandbox migration, creates private `curls-deliverables` bucket, and uploads locked V8 EPUB/PDF objects.
5. Operator creates Stripe test products/prices/webhook and verifies checkout/refund/revocation.
6. Operator verifies Resend, MailerLite, Turnstile, analytics consent, and Sentry in sandbox/preview.
7. Michael/legal approves claims and policy pages.
8. Only after all production activation gates pass should Michael approve production deploy and live payment activation.
