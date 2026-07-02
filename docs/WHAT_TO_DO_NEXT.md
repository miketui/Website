# What To Do Next — Curls & Contemplation setup runbook

**For:** Michael David Warren Jr. (and any operator)
**Companion to:** `docs/SITE_AUDIT_2026-06-20.md`
**Golden rule:** Real secret values go in `author-site/.env.local` (git-ignored) or the Vercel
dashboard — **never committed to the repo.** `.env.example` holds variable *names only*.

> ⚠️ **About the ".env info please store" request:** no actual key/value pairs came through
> with your message — there was nothing to store. So I did **not** commit any secrets (which I
> couldn't do anyway under the project's security rules). Instead, §1 below is a ready-to-fill
> `.env.local` template. Paste your real values into `author-site/.env.local` locally, or into
> Vercel's env settings for deploys. If you want me to wire specific values, paste them and I'll
> put them only in the git-ignored local file.

---

## 0. Run it locally (2 minutes)

```bash
cd author-site
pnpm install
cp .env.example .env.local      # then fill values (see §1)
pnpm dev                        # http://localhost:3000
```

Sanity commands (all currently pass):

```bash
pnpm typecheck && pnpm test && pnpm build
pnpm check:sandbox              # safe readiness checks, no secrets printed
```

---

## 1. `.env.local` template (fill, do not commit)

Copy this into `author-site/.env.local`. Leave anything you don't have yet **blank** — the app
fails safe when keys are absent. Start in **sandbox/test mode only**.

```dotenv
# ---- Site / launch ----
NEXT_PUBLIC_SITE_URL=http://localhost:3000      # later: https://yourdomain.com
NEXT_PUBLIC_LAUNCH_MODE=preorder                # preorder | launched | paused
NEXT_PUBLIC_PREORDER_PRICE=17.99
NEXT_PUBLIC_REGULAR_PRICE=19.99
NEXT_PUBLIC_KINDLE_PRICE=9.99
NEXT_PUBLIC_PAPERBACK_PRICE=29.99
RELEASE_DATE=2026-06-10

# ---- Supabase (Project Settings > API) ----
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=                       # server-only, never NEXT_PUBLIC
SUPABASE_STORAGE_BUCKET=curls-deliverables

# ---- Stripe (TEST mode keys only until launch) ----
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PREORDER=
STRIPE_PRICE_ID_REGULAR=
STRIPE_PRICE_ID_CARD_DECK=                       # optional order-bump
STRIPE_PRICE_ID_BUNDLE=
STRIPE_PRICE_ID_WORKSHEETS=
STRIPE_PRICE_ID_MEMBERSHIP_MONTHLY=              # future, keep empty in v1
STRIPE_PRICE_ID_MEMBERSHIP_YEARLY=               # future, keep empty in v1

# ---- Email: Resend (transactional) ----
RESEND_API_KEY=
RESEND_FROM_EMAIL=
SUPPORT_EMAIL=

# ---- Email: MailerLite (marketing groups) ----
MAILERLITE_API_KEY=
MAILERLITE_GROUP_SUBSCRIBERS=
MAILERLITE_GROUP_FREE_CHAPTER=
MAILERLITE_GROUP_PREORDERS=
MAILERLITE_GROUP_CUSTOMERS=
MAILERLITE_GROUP_ABANDONED_CHECKOUT=
MAILERLITE_GROUP_BONUS_CLAIM_STARTED=
MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED=
MAILERLITE_GROUP_REFUNDED=
MAILERLITE_GROUP_BLOG_READERS=
MAILERLITE_GROUP_VIP_EARLY_READERS=
MAILERLITE_WEBHOOK_SECRET=

# ---- Cloudflare Turnstile (bot protection on forms) ----
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# ---- Internal secrets ----
DOWNLOAD_TOKEN_SECRET=                            # random 32+ char string
CRON_SECRET=                                      # random 32+ char string
ADMIN_EMAILS=you@example.com                      # comma-separated allowlist

# ---- DEMO SESSION: leave EMPTY. Never set to 1 in production. ----
ALLOW_DEMO_SESSION=

# ---- Optional analytics / observability (consent-gated) ----
NEXT_PUBLIC_THANKYOU_VIDEO_ID=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
GA4_API_SECRET=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
POSTHOG_PERSONAL_API_KEY=
```

**Where each value lives in production:** Vercel → Project → Settings → Environment Variables.
Keep **Preview** and **Production** scopes separate; use Stripe/Supabase *sandbox* projects for
Preview. Anything prefixed `NEXT_PUBLIC_` is exposed to the browser — never put a secret there.

---

## 2. Supabase (database, auth, storage)

1. Create a Supabase project; copy URL + anon key + service-role key into `.env.local`.
2. Apply the migration:
   ```bash
   supabase db push
   # or paste supabase/migrations/0001_author_commerce.sql into the SQL editor
   ```
3. Create **two** storage buckets:
   - `curls-deliverables` — **private** (paid EPUB/PDF).
   - `curls-free` — **public** (free excerpt + checklist).
4. Verify RLS is on and the private bucket has **no** public read policy.
5. `pnpm check:supabase-storage` to confirm the path strings.

## 3. Upload the book/worksheet files (see Audit §5.B)

Upload to the **private** bucket `curls-deliverables`:
- EPUB → `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`
- POD PDF → `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`
  (source files are in the repo `release/` folder — do **not** copy them into `public/`)

Upload to the **public** bucket `curls-free`:
- `chapter-1/Curls-Ch1-Excerpt.pdf`
- `checklists/Pricing-Confidence-Checklist.pdf`

Product / funnel files (paths in `content/funnels.ts` & `lib/downloads.ts`): Affirmation Deck,
Companion Workbook, 4 quiz worksheets, 5 challenge-day PDFs. Upload these when those offers go
live (quiz/challenge are staged + noindex today).

## 4. Stripe (test mode first)

1. In **Test mode**, create two one-time prices: `$17.99` preorder and `$19.99` regular; paste
   the price IDs.
2. Set test API keys (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`).
3. Add a webhook to `/api/stripe/webhook` for `checkout.session.completed`,
   `checkout.session.expired`, `charge.refunded`; paste `STRIPE_WEBHOOK_SECRET`.
4. Test end to end:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   stripe trigger checkout.session.completed
   stripe trigger charge.refunded
   pnpm check:stripe-test
   ```
   Confirm: purchase grants entitlement → `/downloads` issues a signed URL; refund revokes it.

## 5. Email (Resend + MailerLite)

- **Resend:** verify the sender domain (SPF, DKIM, DMARC) before any real send; set
  `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `SUPPORT_EMAIL`.
- **MailerLite:** create the 10 groups, paste each `MAILERLITE_GROUP_*` ID, test add/update to a
  sandbox recipient (no production broadcast yet).

## 6. Analytics & consent (optional)

GA4 / PostHog stay off until you accept consent behavior. Server-side operational events
(orders, downloads, security) record without marketing analytics. Add keys only when ready.

## 7. First-three-seconds polish (recommended, from Audit §3)

These are small, high-leverage edits — do them before launch if you want the intro to fully land:
1. Add a **pain-aware one-liner** inside the gateway so first-timers feel *seen* in 3s (not just
   "a book that opens like a threshold"). File: `components/gateway/BookGateway.tsx`.
2. Add an explicit **Relief** section between "The unspoken problem" and "The path forward" so
   the homepage reads Recognition → Relief → Authority (your own spec). File: `app/page.tsx`.
3. (Optional) Drop in a real **book cover** image to replace the CSS `BookMockup` in the hero.

## 8. Cursor feature (already on — tuning only)

The curl cursor is live everywhere except checkout/auth/legal/utility routes. To adjust:
- **Where it shows:** edit prefix lists in `lib/route-policy.ts`.
- **Look/feel:** props on `CurlTrail` (`word`, `spawnDistance`, `maxParticles`, `lifetime`) —
  set them in `components/SiteCurlTrail.tsx`.

## 9. Legal (human gate)

Replace the outlines in `content/legal-outlines.ts` with attorney-reviewed copy for privacy,
terms, refund, preorder, digital-delivery, cookies, accessibility. This is a hard launch gate.

## 10. Deploy

1. **Preview:** Vercel root directory = `author-site`; add **sandbox** env vars to the Preview
   scope; deploy. Smoke test the funnel on the preview URL.
2. **Production:** only after the gate below passes.

### Production activation gate (all must be true)
- [ ] Attorney-approved legal copy live
- [ ] Domain + email DNS (SPF/DKIM/DMARC) verified
- [ ] Supabase RLS verified; paid bucket private; files uploaded
- [ ] Stripe test checkout + webhook + refund all pass
- [ ] Protected download signing + revocation verified
- [ ] `ALLOW_DEMO_SESSION` empty in production
- [ ] No real secrets committed; no paid files in `public/`
- [ ] Final QA + screenshots captured

---

## Quick reference — order of operations

```
local run → fill .env.local → Supabase (db+buckets) → upload files →
Stripe test (checkout/webhook/refund) → email (Resend+MailerLite) →
analytics (optional) → first-3s polish → legal review →
Vercel Preview → production gate → launch
```
