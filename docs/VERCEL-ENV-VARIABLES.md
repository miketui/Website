# Vercel Environment Variables — Curls & Contemplation

Authoritative list, cross-checked two ways: every `process.env.X` reference
in the codebase (excluding `node_modules`/`.next`/`.git`), plus the Zod schema
in `lib/env.ts` (which catches two variables — `NEXT_PUBLIC_GA4_MEASUREMENT_ID`
and `NEXT_PUBLIC_THANKYOU_VIDEO_ID` — that are read through a validated
wrapper object rather than `process.env` directly, so a plain grep misses
them). Set all of these in Vercel Dashboard → Website → Settings →
Environment Variables → **Production**. `.env` is no longer tracked in git,
so this is now the only place these live.

## Site

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://curlscontemplation.beauty` | |
| `NEXT_PUBLIC_LAUNCH_MODE` | `preorder` | One of `preorder` \| `launched` \| `paused` |
| `RELEASE_DATE` | `2026-11-17` | Code now defaults to this if unset or blank — but set it explicitly |
| `SUPPORT_EMAIL` | `support@curlscontemplation.beauty` | |

## Supabase

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jmfbosczwbfugbjsshwf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public-safe, ships to browser |
| `SUPABASE_SERVICE_ROLE_KEY` | **Rotate this** — was exposed in the public repo's `.env` |
| `SUPABASE_STORAGE_BUCKET` | `curls-deliverables` |

## Stripe

| Variable | Notes |
|---|---|
| `STRIPE_SECRET_KEY` | **Rotate this** — was exposed |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` for the "whimsical-celebration" destination |
| `STRIPE_PRICE_ID_PREORDER` | Confirmed present |
| `STRIPE_PRICE_ID_REGULAR` | Confirmed present |
| `STRIPE_PRICE_ID_CARD_DECK` | Needed for the $7.99 order bump — not yet created per prior notes |

*(`STRIPE_PRICE_ID_BUNDLE` and `STRIPE_PRICE_ID_WORKSHEETS` were removed from the codebase — never confirmed real, and the live checkout UI never sent a product type other than `direct_ebook`. `CheckoutProduct` is now just `"direct_ebook"`.)*

## MailerLite — 1 API key + 11 groups, all IDs verified live via API this session

| Variable | Group name | Live ID |
|---|---|---|
| `MAILERLITE_API_KEY` | — | your API key |
| `MAILERLITE_GROUP_SUBSCRIBERS` | Website Signups | `182303148544623709` |
| `MAILERLITE_GROUP_FREE_CHAPTER` | Free Chapter | `189927249078650673` |
| `MAILERLITE_GROUP_PREORDERS` | Preorders | `189927254041560661` |
| `MAILERLITE_GROUP_CUSTOMERS` | Customers | `189927259391395798` |
| `MAILERLITE_GROUP_ABANDONED_CHECKOUT` | Abandoned Checkout | `189927264762202014` |
| `MAILERLITE_GROUP_BONUS_CLAIM_STARTED` | Bonus Claim Started | `189927270563972991` |
| `MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED` | Bonus Claim Completed | `189927275564631964` |
| `MAILERLITE_GROUP_REFUNDED` | Refunded | `189927280131180245` |
| `MAILERLITE_GROUP_BLOG_READERS` | Blog Readers | `189927285613135631` |
| `MAILERLITE_GROUP_QUIZ` | Quiz / Blind-Spot | `191751931239073670` |
| `MAILERLITE_GROUP_VIP_EARLY_READERS` | VIP / Early Readers | `191751933392848782` |

## Resend

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | **Rotate this** — was exposed |
| `RESEND_FROM_EMAIL` | `info@curlscontemplation.beauty` |

## Turnstile (bot protection)

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAAAADiSx5E6b86xImrA` — confirmed live in production HTML |
| `TURNSTILE_SECRET_KEY` | **Rotate this** — was exposed |

## Analytics

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_GA4_MEASUREMENT_ID` | `G-58RVYKGCE9` — **check this is actually set**; the GA4 component ships live but renders nothing without it |
| `GA4_API_SECRET` | **Rotate this** — was exposed. Only needed if/when Measurement Protocol server-side events are added; not required for the standard tag |
| `NEXT_PUBLIC_POSTHOG_KEY` | |
| `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` |

## Sentry — DSN verified live via Sentry MCP this session

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | `https://79379bde875c5981a7150c413b4bc8fa@o4510096051404800.ingest.us.sentry.io/4511657443459072` |
| `SENTRY_ORG` | `miketui` |
| `SENTRY_PROJECT` | `curls-contemplation-website` |
| `SENTRY_AUTH_TOKEN` | **Rotate this** — was exposed |

## Admin / ops

| Variable | Notes |
|---|---|
| `ADMIN_EMAILS` | `warrenm115@gmail.com` |
| `CRON_SECRET` | **Rotate this** — was exposed. Guards `/api/cron/launch-day` |
| `ALLOW_DEMO_SESSION` | **Must be ABSENT in Production** — not `false`, not empty, just not set at all. This flag exists for local/staging testing only; its presence at any truthy-ish value in Production would let someone bypass real auth |

## Optional / cosmetic

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_THANKYOU_VIDEO_ID` | Optional. `/thank-you` has a polished fallback if unset — only add this once you have a real welcome video |

## Not for Vercel Production

- `E2E_BASE_URL` — test-only, used by Playwright/CI, never needed in Production
- `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_TOKEN` — were sitting in the
  old committed `.env` completely unused by any application code (confirmed
  via full-repo grep — zero references). `VERCEL_TOKEN` especially should be
  rotated even though nothing used it, since it was exposed regardless.
- `NEXT_PUBLIC_PREORDER_PRICE`, `NEXT_PUBLIC_REGULAR_PRICE`,
  `NEXT_PUBLIC_KINDLE_PRICE`, `NEXT_PUBLIC_PAPERBACK_PRICE`,
  `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_ID_MEMBERSHIP_MONTHLY`,
  `STRIPE_PRICE_ID_MEMBERSHIP_YEARLY`, `MAILERLITE_WEBHOOK_SECRET`,
  `DOWNLOAD_TOKEN_SECRET`, `POSTHOG_PERSONAL_API_KEY` — all vestigial, zero
  code references anywhere in the repo. Leftovers from an earlier
  architecture (client-side Stripe checkout, a custom download-token scheme)
  that's since been replaced. Removed from the regenerated `.env` and
  `.env.example` entirely.
