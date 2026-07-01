# Launch Finalization Guide
**Curls & Contemplation — curlscontemplation.beauty**

This walks through everything left to finalize the site and get the real files in the right place. Read the first section carefully — it corrects a common and costly mistake before you make it.

---

## 1. Where your digital files actually go — NOT the website folder

This repo (`miketui/Website`) is **public on GitHub**. Anything committed to it is downloadable by anyone, forever, in the commit history, even if you delete it later. **Do not put the EPUB, POD PDF, or Affirmation Card Deck PDF into this repo.** The code already assumes they *won't* be there — it fetches them from a private, access-controlled Supabase Storage bucket via short-lived signed URLs, gated behind a real purchase check (`lib/entitlements.ts` → `checkDownloadEntitlement`).

### Paid files → private bucket `curls-deliverables`
Exact paths the code expects (from `lib/downloads.ts` — these are not suggestions, the code will 404 if the object isn't at this exact path):

| File | Exact Supabase Storage path | Bucket |
|---|---|---|
| EPUB | `books/curls-and-contemplation/epub/Curls-and-Contemplation-v8-20260610.epub` | `curls-deliverables` (private) |
| POD PDF | `books/curls-and-contemplation/pdf/CurlsAndContemplation-POD-Royal-v8-20260610.pdf` | `curls-deliverables` (private) |
| Affirmation Card Deck PDF | `cards/Affirmation-Deck-v1.pdf` | `curls-deliverables` (private) |

**If your actual production files have different version numbers** (e.g., the v11 recto-imposition build from the book-production project instead of v8), update the paths in `lib/downloads.ts` and `content/site.ts` (`deliverables.epub` / `deliverables.pdf`) to match, then re-upload under the new filename — don't silently overwrite `v8` with different content at the same path, since that breaks any signed URL cached in an email a customer already received.

**How to upload:** Supabase Dashboard → Storage → `curls-deliverables` bucket → create the folder structure above → upload. Confirm the bucket's public access is **OFF** (private) — I can verify this via `Supabase:get_advisors` once the project is restored (see audit doc, Blocker B1).

### Free lead-magnet files → public bucket `curls-free`
From `lib/free-assets.ts`:

| File | Exact path | Bucket |
|---|---|---|
| Chapter 1 excerpt PDF | `chapter-1/Curls-Ch1-Excerpt.pdf` | `curls-free` (public) |
| Pricing Confidence Checklist PDF | `checklists/Pricing-Confidence-Checklist.pdf` | `curls-free` (public) |

These are meant to be publicly fetchable (that's the whole point of a lead magnet) — the `curls-free` bucket should have public read access ON.

### What actually belongs in the git repo
Only static site assets that ship with the build: `public/gateway-cover.jpg`, `public/og-default.png`, favicon, any image referenced by `next/image`. If you ever want a downloadable *free* PDF or image asset that isn't sensitive, `public/` is fine for it — but anything with a price tag goes in Storage, never in `public/` or committed anywhere in this repo.

---

## 2. Contact page — social links

**Current state:** `app/contact/page.tsx` has zero social links. It's a mailto CTA and a short list of what to include in a support email. I checked the entire codebase for any existing handles (Instagram, TikTok, X/Twitter, YouTube, Facebook, LinkedIn, Threads, Pinterest) — **none exist anywhere.** I'm not going to invent placeholder URLs; that's exactly the kind of fabricated content this project's standards explicitly forbid.

**What I need from you, per platform you want listed:**
- Platform name
- Full profile URL (e.g., `https://www.instagram.com/yourusername`)
- Whether it should also appear in the footer (currently the footer has no social row either — same fix, same data needed)

**Once you give me the list, I will:**
1. Add a `socials` array to `content/site.ts` (single source of truth — footer and contact page both read from it, so you only ever update it in one place).
2. Build a small `SocialLinks` component with accessible labels (`aria-label="Instagram"` etc., not just a bare icon) and real `rel="me noopener noreferrer"` + `target="_blank"` on each link.
3. Render it on `/contact` and in the footer.
4. Add `sameAs` to the `personJsonLd()` schema in `lib/schema.ts` — this is what tells Google "these profiles belong to this author," which matters for Knowledge Panel eligibility down the line.

---

## 3. Full environment variable checklist (Vercel → Project → Settings → Environment Variables → Production)

This is the complete, authoritative list from `lib/env.ts` — every one of these is read somewhere in the app. ✅ = confirmed live via connector this session. ⚠️ = code confirms the shape needed but I cannot read Vercel's actual stored value from any tool available to me — you need to check the Vercel dashboard directly.

**Public:**
- `NEXT_PUBLIC_SITE_URL` — should be `https://curlscontemplation.beauty` ⚠️
- `NEXT_PUBLIC_LAUNCH_MODE` — `preorder` | `launched` | `paused` ⚠️
- `NEXT_PUBLIC_SUPABASE_URL` ⚠️
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ⚠️
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` ⚠️
- `NEXT_PUBLIC_THANKYOU_VIDEO_ID` — YouTube video ID for the post-checkout thank-you embed ⚠️
- `NEXT_PUBLIC_GA4_MEASUREMENT_ID` — should match `properties/448841433` if that's the right property (see audit H4) ⚠️
- `NEXT_PUBLIC_POSTHOG_KEY` — `phc_xvdZWvwD8hpFrppQTfrqeBDSY3JGXzQy4YMKxpUKuJ5c` if you're keeping PostHog (needs SDK code first, see audit H4) — optional, can be left unset
- `NEXT_PUBLIC_POSTHOG_HOST` — optional

**Server-only:**
- `SUPABASE_SERVICE_ROLE_KEY` ⚠️
- `SUPABASE_STORAGE_BUCKET` — defaults to `curls-deliverables` if unset, fine to leave unset
- `STRIPE_SECRET_KEY` ⚠️
- `STRIPE_WEBHOOK_SECRET` — **will change** once you fix the webhook URL (audit B2) — grab the new signing secret after re-pointing the endpoint
- `STRIPE_PRICE_ID_PREORDER` ⚠️
- `STRIPE_PRICE_ID_REGULAR` ⚠️
- `STRIPE_PRICE_ID_BUNDLE` — optional
- `STRIPE_PRICE_ID_CARD_DECK` — needed for the Affirmation Deck order bump (audit L1)
- `STRIPE_PRICE_ID_WORKSHEETS` — needed if selling worksheets standalone
- `RESEND_API_KEY` ⚠️
- `RESEND_FROM_EMAIL` — must be on a domain verified in Resend
- `SUPPORT_EMAIL` ⚠️
- `MAILERLITE_API_KEY` ⚠️
- `MAILERLITE_GROUP_SUBSCRIBERS` through `MAILERLITE_GROUP_VIP_EARLY_READERS` (11 vars) — **exact IDs in `TASK-C-SERVICE-AUDIT.md` §H2**, all groups now exist live
- `TURNSTILE_SECRET_KEY` ⚠️
- `ADMIN_EMAILS` — comma-separated allowlist for `isAdminUser()`
- `GA4_API_SECRET` — for server-side GA4 Measurement Protocol events, optional
- `RELEASE_DATE` — drives the tier-flip pricing math (`lib/schema.ts` `tierFlipDate()`), confirm this is your real launch date, not the `2026-06-10` code default

**Explicitly confirm ABSENT from production:**
- `ALLOW_DEMO_SESSION` — must not be set to `"1"` in production (audit M3)

---

## 4. Order of operations to actually finish this

1. **Restore Supabase** (blocker B1) — one word from you and I fire it.
2. **Fix the Stripe webhook URL** (blocker B2) — manual, ~5 minutes in the Stripe Dashboard, steps in the audit doc.
3. **Paste the full env var list above into Vercel Production**, redeploy.
4. **Upload the real EPUB/PDF/Card Deck files** to `curls-deliverables` at the exact paths in §1, and the two free assets to `curls-free`.
5. **Give me your social handles** so I can build the contact-page + footer social links.
6. **Decide on login/signup** (blocker B3) — say go and I'll build real Supabase magic-link auth + wire the dashboard to real purchase data.
7. **Decide on Sentry + PostHog** — say go and I'll install and wire both properly, or tell me to drop one/both from the env schema if you don't want them.
8. Run every test in `FUNNEL-TESTING-CHECKLIST.md` against the fixed site.
