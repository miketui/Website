# Missing Information — Curls & Contemplation

Everything below needs your input, an asset upload, or a decision. Nothing in
this list is a code bug — the code is ready and waiting for these.

## 🔴 Do first (security, not content)

1. **Revoke your GitHub PAT.** It's been pasted in this chat three times and
   used for real pushes. Go to https://github.com/settings/tokens now.
2. **Make `miketui/Website` private**, or accept that its full commit
   history (including a `.env` file that held live secrets until this
   session) is public. Making it private now doesn't erase what's already
   been scraped, but it stops new exposure.
3. **Rotate every secret** that was in the committed `.env`: Stripe live
   secret key, Supabase service-role key, MailerLite API key, Resend API key,
   Turnstile secret key, Sentry auth token, GA4 API secret, CRON_SECRET,
   and the Vercel API token that was also sitting in that file unused.

## 🟡 Vercel Dashboard — confirm these are set (Production)

`.env` is no longer tracked in git, so Vercel Dashboard is now the *only*
source of truth for every environment variable. Cross-check against
`docs/VERCEL-ENV-VARIABLES.md` for the full list, but the two most likely to
be missing since they were only ever in the removed file:

- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` = `G-58RVYKGCE9` — the GA4 component
  I built silently does nothing without this.
- `RELEASE_DATE` = `2026-07-14` — the code now defaults to this correctly
  even if unset, but setting it explicitly avoids relying on a fallback.

## 🟡 Supabase Storage — files that need to exist

The code requests these exact paths. If they're not there, the corresponding
feature fails silently (signed URL creation returns an error, or the free
asset links render as absent).

**Public bucket `curls-free`:**
- `chapter-1/Curls-Ch1-Excerpt.pdf`
- `checklists/Pricing-Confidence-Checklist.pdf`

**Private bucket `curls-deliverables`** — note the filenames in code still
say `v8`, dated `20260610`. Confirm this matches whatever your final book
build actually is (your notes elsewhere reference a `v11` recto build):
- `books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub`
- `books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf`
- `cards/Affirmation-Deck-v1.pdf`

If your real files use different names, either rename them to match the code
exactly, or tell me the real names and I'll update `content/site.ts` and
`lib/deliverables.ts` to match.

## 🟡 MailerLite — one automation is live with unverified content

`Customers — Post-Purchase Onboarding (DRAFT)` is `enabled: true` right now.
Its trigger and steps exist, but the email body can only be written in the
MailerLite visual editor — not via API. **Check what's actually in that email
before your first real sale**, or a paying customer could receive a blank or
placeholder message. The other two automations (Free Chapter Welcome,
Abandoned Checkout) are correctly disabled and safe.

## 🟡 Stripe — missing Price IDs

Confirmed present: `STRIPE_PRICE_ID_PREORDER`, `STRIPE_PRICE_ID_REGULAR`.
Still needed, if you intend to sell these:
- `STRIPE_PRICE_ID_CARD_DECK` — the $7.99 Affirmation Card Deck order bump.
  Code checks `session.metadata?.card_deck === "true"` to grant this
  entitlement; without a real Price ID, the order-bump can't be offered.
- `STRIPE_PRICE_ID_BUNDLE`, `STRIPE_PRICE_ID_WORKSHEETS` — referenced in
  `lib/env.ts` but not confirmed either way; tell me if these products exist
  yet or should be removed from the code as not-yet-real.

## 🟡 Stripe Dashboard — the webhook 404 source

I can't list your webhook destinations through any available tool. Go to
Stripe Dashboard → Developers → Webhooks and check every destination's
target URL. Only `/api/stripe/webhook` is canonical; anything pointed at
`/api/webhooks/stripe` is the legacy path (still works via the alias, but
finding and removing the stale destination is the only way to confirm the
root cause — not just the symptom — is gone).

## 🟢 Nice to have, not blocking

- `NEXT_PUBLIC_THANKYOU_VIDEO_ID` — the `/thank-you` page has a real,
  polished fallback (a quote card) if you never set this, so this is
  optional. If you record a 60-second welcome video at some point, drop
  the YouTube ID in here.
- Legacy Supabase tables (`users`, `products`, `prices`, `orders_legacy_v1`,
  `order_items`, `entitlements`, `downloads`, `magnet_leads`, `testimonials`,
  `blog_posts`, `audit_log`) — zero code references, zero rows. Safe to drop
  whenever, no rush.
- `EmailSignup` and `AnalyticsEvent` components — built, never placed on any
  page. Either use them somewhere or I can remove them to reduce dead code.
- `/quiz` — real component (`QuizFlow`) exists and posts to a real API route,
  but the live page shows a "coming next" placeholder instead. Tell me when
  you want it switched on.
