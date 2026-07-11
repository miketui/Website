# Curls & Contemplation: Architecture Audit and Gap Report

This document contains a comprehensive audit of the `author-site` repository as of the current build, focusing on mapped architecture, identified gaps, the `POST /api/checkout` 502 error investigation, and brand guideline adherence.

## 1. Repository Map and Architecture

### Routes
The application is built using Next.js App Router. The following routes are present (`app/`):
- **Public Core:** `/` (home), `/about`, `/author`, `/book`, `/journey`
- **Legal/Policies:** `/privacy`, `/terms`, `/cookies`, `/accessibility`, `/digital-delivery-policy`, `/preorder-policy`, `/refund-policy`
- **Funnels & Marketing:** `/quiz`, `/quiz/results/[archetype]`, `/challenge`, `/free-chapter`, `/bonus-claim`, `/media-kit`, `/resources`, `/workbook`, `/worksheets`, `/blog`, `/blog/[slug]`, `/thank-you`
- **Commerce:** `/buy`, `/order`, `/preorder`, `/checkout`
- **Customer/Auth:** `/login`, `/signup`, `/reset`, `/dashboard`, `/downloads`
- **Admin:** `/admin`, `/admin/analytics`, `/admin/claims`, `/admin/content`, `/admin/orders`, `/admin/subscribers`

### API Routes
- **Commerce:** `/api/checkout`, `/api/stripe/webhook` (also `/api/webhooks/stripe/`)
- **Funnels:** `/api/quiz`, `/api/free-chapter`, `/api/subscribe`, `/api/bonus-claim`
- **Other:** `/api/downloads/sign`, `/api/track`, `/api/contact`, `/api/health`, `/api/cron/*`

### Funnels Wired vs Stubbed
- **Funnel 1 (Free Chapter -> Ascend):** Wired. Posts to `/api/free-chapter` and integrates Turnstile, MailerLite, and Resend. (See `app/api/free-chapter/route.ts`)
- **Funnel 2 (Quiz):** Wired. Interactive quiz component (`components/QuizFlow.tsx`) logic exists in `content/funnels.ts` and posts to `/api/quiz`.
- **Funnel 3 (Challenge):** Wired. Challenge signups post to `/api/subscribe` with source "challenge". (See `app/api/subscribe/route.ts`)
- **Funnel 4 (Ascension Ladder / Subscriptions):** Stubbed. Products/prices are listed in `content/funnels.ts` as "PROPOSED, not locked. Activation is the owner's gate." Supabase tables for memberships exist but only as "placeholders" (`supabase/migrations/0001_author_commerce.sql`).

### Supabase Tables
Defined in `supabase/migrations/0001_author_commerce.sql` and `supabase/migrations/0002_order_bump.sql`:
- `profiles`, `products`, `prices`, `orders`, `purchases`, `download_tokens`, `download_events`, `bonus_claims`, `subscribers`, `subscriber_events`, `consent_log`, `webhook_events`, `analytics_events`, `gate_ledger`, `admin_users`, `memberships`, `membership_events`
- **Gap Identified:** A table `magnet_leads` is referenced in `/api/free-chapter/route.ts` (line 25), but `grep -R "magnet_leads" supabase/migrations/` confirms this table was never created in any SQL migration file.

### Stripe Endpoints
- Client creates session via `POST /api/checkout`
- Webhooks handled via `POST /api/stripe/webhook` supporting `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`, and subscription events.

### MailerLite Hooks
- Uses 11 environment variables for distinct groups (e.g., `MAILERLITE_GROUP_SUBSCRIBERS`, `MAILERLITE_GROUP_FREE_CHAPTER`, `MAILERLITE_GROUP_QUIZ`, etc.) referenced in `lib/env.ts` and API routes (`/api/subscribe`, `/api/free-chapter`).

### Environment Variable Health
The `.env.example` lists variables safely. Production values must be injected via Vercel or secure `.env.local`. Keys for Stripe, Supabase, MailerLite, Resend, Turnstile, GA4/PostHog, and Sentry are outlined.

## 2. Investigation: POST /api/checkout 502 Error

**File:** `app/api/checkout/route.ts` (lines 100-112)

**Root Cause:**
The 502 error occurs in the `catch` block wrapping `stripe.checkout.sessions.create`. The server returns a `502 Bad Gateway` whenever the Stripe API call fails. As explicitly commented in the code, historical causes of this exact 502 are:
1. `authentication_error`: A bad or rotated Stripe secret key (`STRIPE_SECRET_KEY` in Vercel environment is stale or invalid).
2. `resource_missing`: The environment contains a price ID from a different Stripe account than the API key, or the product doesn't exist in that environment.

## 3. Brand and Design Tokens Audit

- **ACISS tokens are consistently implemented.** The styling strictly adheres to the locked ACISS palette (`styles/aciss-tokens.css`, `styles/aciss.css`, `tailwind.config.ts`), specifically:
  - Obsidian (`#111111`)
  - Antique Gold (`#B08D57`)
  - White Gold (`#D8D1C5`)
  - Deep Jade (`#145B4B`)
  - Soft Jade Mist (`#C7D9D2`)
- Several derived colors are used via CSS `color-mix`, but they exclusively blend the locked ACISS colors as mandated by the rules. (Verified via `grep -Rnwi "aciss" tailwind.config.ts styles/`)

## 4. Banned Tokens (#2B9999 and #C9A961)

- **Audit Result:** A project-wide grep for the retired tokens `#2B9999` and `#C9A961` across all `app/`, `components/`, `styles/`, and configuration files yielded **zero hits**.
- The codebase is completely clean of the banned tokens.

## 5. Security and QA Gaps

- **Missing Supabase Table:** As mentioned above, the `magnet_leads` table does not exist in any migration file but is actively inserted into by `app/api/free-chapter/route.ts` line 25. This will cause unhandled database insertion errors in production when users request a free chapter.
- **Silent Upsert Failures:** Webhook handlers (`app/api/stripe/webhook/route.ts`) catch failed upserts and record them as analytics events rather than failing the webhook. If `0002_order_bump.sql` isn't applied correctly, order bump metadata triggers silent entitlement failures.
- **Environment Configuration Dependency:** Features fail dynamically based on environment keys. The `502` error from `app/api/checkout/route.ts` is a direct result of Stripe keys being misaligned. Similarly, Turnstile will fail the request if not configured properly, instead of failing open, which is good for security but requires strict environment oversight.
