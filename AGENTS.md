# AGENTS.md

Project facts for `miketui/Website`. Tool-agnostic — read by Claude Code, Codex, Cursor, and any other agent.

**Working rules — gates, verification, gotchas — live in `CLAUDE.md`.** This file holds only *what the project is*. Do not duplicate content between the two; the previous version of this file went stale precisely because it did.

*Last verified against the codebase: 2026-07-27.*

---

## Identity

The direct-to-consumer commerce site for **Curls & Contemplation: A Stylist's Interactive Journey** by **Michael David** — a 467-page interactive business guide for working hairstylists, covering creative identity, pricing, networking, on-set practice, digital visibility, leadership, financial decisions, resilience, AI, ethics, and texture-inclusive work.

- **Domain:** `curlscontemplation.beauty`
- **Publisher:** TAYLKOMB LLC
- **Launch:** **November 24, 2026.** Any reference to July 14, 2026 is stale.
- **Author name:** the pen name **Michael David**, everywhere and without exception. His legal name must never appear in this repo, its metadata, its commit history, or any public-facing surface.

The Next.js app lives at the **repository root**. There is no `author-site/` directory; earlier docs claiming otherwise were wrong.

---

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 3 · Motion · Node 22 · pnpm 10

Supabase (auth, database, storage) · Stripe Checkout · MailerLite · Resend · Turnstile · Sentry · PostHog · Vercel Speed Insights · deployed on Vercel.

Supabase production project: `jmfbosczwbfugbjsshwf`. Buckets: `curls-deliverables` (private, fulfillment) and `curls-free` (public, lead magnets).

---

## Pricing — locked

Source of truth is `content/book.ts`. Do not hardcode prices anywhere else.

| SKU | Price |
|---|---|
| Direct digital — preorder / launch | **$17.99** |
| Direct digital — regular | **$19.99** |
| Daily Directives bundle (12 sets, 372 cards) | $59 |
| Idea-to-Action Workbook | paid post-launch; **free with any preorder that includes the book** |

The preorder gift rule lives in the Stripe webhook handler: `price_tier === "preorder"` grants the workbook automatically. Post-launch it is paid-only.

---

## Launch state machine

One value drives site-wide copy, CTAs, badges, urgency, and pricing: `NEXT_PUBLIC_LAUNCH_STATE` ∈ `PREORDER | LAUNCH | EVERGREEN`. Legacy `NEXT_PUBLIC_LAUNCH_MODE` (`preorder | launched | paused`) still maps onto it; `paused` is a commerce overlay that routes checkout CTAs to the free pricing kit.

Resolution order: valid `LAUNCH_STATE` → valid legacy `LAUNCH_MODE` → **date-derived from `RELEASE_DATE`** (before it → PREORDER, within 14 days after → LAUNCH, later → EVERGREEN).

All state strings live in `config/launchState.ts`. Do not scatter ternaries.

---

## Route map

47 pages, 18 API routes. Categories matter more than the full list:

**Conversion terminus** — `/order`. Campaigns, emails, and nav point here permanently; it redirects to `/preorder` or `/buy` based on launch state. Must stay dynamically rendered.

**Redirect aliases** — `/author` → `/about`, `/chapters` and `/chapter/[slug]` → `/book`, `/free-chapter` and `/challenge` → `/pricing-kit`, `/bonus-claim` → funnel. Crawlable via robots so link equity passes through, but absent from `sitemap.xml`.

**Gated** — `/workbook`, `/downloads`, `/dashboard`, `/resources`, `/admin/*`. Entitlement- or session-checked server-side; `noIndex` and disallowed in robots.

**Duplicate** — `/website` renders the same `CinematicJourney` component as `/journey` and canonicals to it.

**Indexable — primary.** Home, `/book`, `/preorder`, `/buy`, `/pricing-kit`, `/daily-directives`, `/subscribe`, `/reset`, `/quiz`, `/journey`, `/blog`, `/about`, `/faq`, `/contact`, plus blog posts. The acquisition surfaces.

**Indexable — secondary.** The policy pages (`/privacy`, `/terms`, `/cookies`, `/refund-policy`, `/preorder-policy`, `/digital-delivery-policy`, `/accessibility`) and `/media-kit`. Made indexable 2026-07-28 by owner decision: visible policy pages are a standard trust signal for a site taking payments, and a media kit exists to be found by press. They sit in `secondaryRoutes` in `sitemap.ts` at priority 0.3 / yearly so stable legal text does not compete with `/book` or `/preorder` for crawl attention.

Together these two groups are exactly what `sitemap.xml` lists — 24 URLs.

`/worksheets` keeps an authored `noIndex: true` and stays out of the sitemap. Changing any page's `noIndex` requires updating `sitemap.ts` in the same commit; `tests/seo-contract.test.ts` fails if the two drift apart.

---

## Funnels — locked architecture

Wire it. Do not redesign it.

1. **Pricing Confidence Kit** (`/pricing-kit`) — the lead magnet. Replaced the retired Free Chapter tripwire.
2. **Stylist Blind-Spot Quiz** (`/quiz`) — four archetypes: underpriced-artist, invisible-talent, burned-out-booked, almost-ceo. Result pages are `noindex`.
3. **Reader Ascension Ladder** — book → Daily Directives → Workbook.

**Retired, deliberately:** the Free Chapter tripwire and the 5-Day Challenge (owner decision, 2026-07-09). Their routes redirect rather than 404. Do not restore either without an explicit instruction.

Daily Directives replaced the earlier card-deck concept.

---

## ACISS design system — locked

| Token | Hex |
|---|---|
| Obsidian Black | `#111111` |
| Antique Gold | `#B08D57` |
| White Gold | `#D8D1C5` |
| Deep Jade | `#145B4B` |
| Soft Jade Mist | `#C7D9D2` |

**Retired and prohibited: `#2B9999` and `#C9A961`.** Grep for them at every gate.

Brand law: *Black leads. Gold elevates. Jade distinguishes.*

Type: Cormorant Garamond for display, Inter for UI. Funnel pages may use their own teal `#008080` / gold `#D4AF37` tokens — those are distinct from site chrome and are not a palette violation.

---

## Content rules

**No-spoiler doctrine (absolute).** No chapter titles, worksheet names, prompt text, interior quiz content, or book structure on any public page. The book's contents are the product.

**Imagery.** No photorealistic Black faces and no hair-as-subject generated imagery — real footage only. Abstract and ambient generated assets are acceptable.

**TAYLKOMB comb geometry must not be depicted anywhere.** A patent CIP gates that disclosure.

**Claims.** Anything factual on a public page must trace to `marketing/website/claims-evidence.md`. Legal copy is an outline until attorney review.

**Never place paid deliverables in `public/`.** Fulfillment is signed-URL only, from the private bucket.

**Voice.** Warm, premium, direct, specific. No generic AI phrasing, no fake urgency, no invented testimonials, awards, review counts, bestseller claims, or celebrity associations.

---

## Security invariants

These are structural, not stylistic. Breaking one is a launch blocker.

- Downloads are gated by **server-side** entitlement checks. Never client-side.
- Paid deliverables are served from the private Supabase bucket via signed URLs or secure server routes — never from `public/`, never as a static path.
- Stripe webhooks **must** verify the signature before acting on the payload.
- A refund must revoke entitlement.
- Admin routes require authorization server-side and must not be discoverable by normal users.
- Price IDs resolve server-side only. A client can never inject or override a price.
- `.env.example` carries variable **names** only — never values. No live Stripe, Supabase, MailerLite, or Resend credential ever gets hardcoded or committed.
- Legal copy is an outline until attorney review.

---

## Motion rules

Original interaction language — curl/hair-strand cursor trail, magnetic CTA, book tilt, chapter pathway, scroll reveal, page transition. Textura-style *principles* (emotional first impression, spaced editorial typography, tasteful depth, strong page transitions) are the reference; do not clone Textura.

The first three home sections are **Recognition → Relief → Authority/path**.

Motion must honor `prefers-reduced-motion`, must never degrade checkout, auth, or download UX, and must never replace readable copy.

---

## Environment

Full list in `.env.example`. The ones that break things when wrong:

| Variable | Why it matters |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Falls back to `http://localhost:3000`. Missing in production poisons sitemap, robots, and every canonical. Guarded — a production build fails without it. |
| `RELEASE_DATE` | Drives the launch state machine when `LAUNCH_STATE` is unset. Blanking it once crashed production. |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Rotated keys and wrong-account price IDs were the historical checkout 502s. |
| `STRIPE_PRICE_ID_PREORDER`, `_REGULAR`, `_WORKBOOK`, `_DAILY_DIRECTIVES_BUNDLE`, `_SET_01..12` | All resolved server-side. Clients can never inject a price. |
| `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET` | Fulfillment and entitlement writes. |
| `MAILERLITE_GROUP_*` | 13 groups. Segmentation depends on exact IDs. |
| `CRON_SECRET` | Guards the launch-day and pre-launch cron routes. |

Vercel cron: `/api/cron/launch-day` hourly, `/api/cron/pre-launch-check` on November 23.

---

## Where things live

```
app/            routes, API handlers, sitemap.ts, robots.ts
components/     UI; components/motion/ for animation and video
lib/            seo.ts (canonicals), schema.ts (JSON-LD), stripe.ts,
                env.ts, cart.ts, entitlements.ts, supabase/
config/         launchState.ts — the launch state machine
content/        book.ts, site.ts, blog — copy and pricing source of truth
scripts/        env guards, checkout smoke test, deliverable checks
tests/          *.test.ts = Vitest, *.spec.ts = Playwright
docs/           audits, MailerLite email library, error docs
supabase/       migrations
```
