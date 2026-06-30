# Author Site Audit — Curls & Contemplation

**Date:** 2026-06-30
**Scope:** `author-site/` (Next.js App Router author-commerce platform)
**Branch:** `claude/author-site-audit-z2i5n7`
**Method:** Full source inspection of security-critical paths + live toolchain run in this environment.
**Prior audit:** `docs/SITE_AUDIT_2026-06-20.md` (still accurate; this is a fresh re-verification plus newly surfaced hardening items).

---

## 0. Headline verdict

The site remains **code-complete, green on the full toolchain, and structurally secure.** It is
**not launch-ready** for the same reasons as the prior audit: it is waiting on *external
configuration and binary content* (provider keys, uploaded deliverables, a domain, attorney
review), not on engineering.

This pass re-ran the entire toolchain and the project's own sandbox-safety scripts — all pass —
and read the commerce/auth/download/webhook code line by line. The core money-and-entitlement
paths are sound. I found **no critical or high-severity defects.** I did surface **four
low/medium hardening items** that are new relative to the 2026-06-20 report (§5).

---

## 1. Toolchain evidence (run 2026-06-30 in this environment)

| Command | Result |
|---|---|
| `pnpm install` | ✅ exit 0 |
| `pnpm typecheck` (`tsc --noEmit`) | ✅ 0 errors |
| `pnpm lint` (`eslint . --max-warnings=0`) | ✅ 0 warnings |
| `pnpm test` (vitest) | ✅ 13 files / **60 tests passed** |
| `pnpm build` (`next build`) | ✅ exit 0 — all routes compile; `ƒ Proxy (Middleware)` active |
| `pnpm check:sandbox` | ✅ all four scripts pass (env readiness, no public paid files, storage paths valid, no live Stripe keys) |

`check:deliverables` confirms **no paid EPUB/PDF and no public paid-file URLs** under web assets.
`check:stripe-test` confirms **no live key patterns** are present. No secrets are committed
(`git grep` for `sk_live_`/`whsec_`/service-role JWTs matches only documentation describing the
scan command). `public/` holds only `og-default.png` and `gateway-cover.jpg`.

---

## 2. Security posture — verified by reading the code

Strong and consistent with `.claude/rules/security.md` and `author-site/AGENTS.md`.

**Payments / entitlements (verified):**
- Stripe webhook verifies the signature with `constructEvent` **before** any DB write or
  entitlement mint; bad/absent signature → 400 (`app/api/stripe/webhook/route.ts:81-90`).
- Webhook is **idempotent** — events are de-duped via `webhook_events.provider_event_id` before
  processing (`recordWebhookEvent`).
- Entitlements are only minted from Stripe-verified `checkout.session.completed`; the
  order-bump deck row is gated on `session.metadata.card_deck === "true"`, which is set
  server-side from the actual paid line item.
- **Refund revokes access:** `charge.refunded` sets `status=refunded`,
  `entitlement_status=revoked` for *every* purchase on the order (book + bump).
- **Checkout cannot be price-tampered:** the client may send `price`/`priceId`, but the route
  ignores them and resolves the price ID server-side from launch mode + product
  (`app/api/checkout/route.ts:25`, `resolveServerPriceId`). A requested-but-unavailable add-on
  fails loudly (503) rather than silently dropping.

**Downloads (verified — fail closed):**
- `/api/downloads/sign` requires a session, checks the entitlement, and only then mints a signed
  URL from the **private** `curls-deliverables` bucket with a 24h TTL and a 3-download / 7-day
  cap (`lib/downloads.ts`, `lib/entitlements.ts`).
- Path allowlist: `isSafePrivateDeliverablePath` rejects absolute paths and any `release/` or
  `public/` path, and the result is rejected if the signed URL contains `/release/`.

**Auth / admin (verified):**
- Admin pages call `requireAdmin()` (session + `ADMIN_EMAILS` allowlist + `admin_users` table)
  and render a gated message otherwise (`app/admin/page.tsx`, `lib/security.ts`).
- Spoofable `cc_demo_*` cookies are honored **only** when `ALLOW_DEMO_SESSION=1`, which is empty
  in both `.env.example` files and must never be set in production
  (`lib/supabase/server.ts:37`).
- Database **RLS is enabled on all 17 tables** with per-user `auth.uid()` policies and
  admin-read policies; the public can only insert safe `subscribers`/`bonus_claims` rows
  (`supabase/migrations/0001_author_commerce.sql:182-259`). Server routes that need to bypass
  RLS use the service-role client deliberately.

---

## 3. First three seconds & cursor feature (unchanged — still good)

No regressions since 2026-06-20. The `BookGateway` cinematic intro (first-visit, `sessionStorage`
gated, SSR-safe, fully skippable, reduced-motion crossfade) and the site-wide `CurlTrail` cursor
(excluded on auth/commerce/legal/utility routes via `lib/route-policy.ts`, `pointer-events:none`,
no-op under reduced motion) are both live and working. The two product-design notes from the
prior audit still stand and remain the highest-leverage *non-blocking* improvements:
1. Add a pain-aware hook **inside** the gateway so first-timers feel *seen* in 3s (the strongest
   line — "You learned the craft. Nobody taught you the business." — currently sits behind the
   gateway click).
2. Insert an explicit **Relief** beat between "The unspoken problem" and "The path forward" on the
   homepage, to satisfy the spec's Recognition → Relief → Authority ordering.

---

## 4. Route & capability coverage

Every public, staged, auth, admin, and API route required by `author-site/AGENTS.md` exists and
builds (verified in §1 build output). No leaked staged routes in the sitemap; staged funnel pages
are `noindex` + robots-disallowed. This matches the prior audit; no changes.

---

## 5. Findings (new this pass) — hardening, none critical

These are defense-in-depth items. None is a launch blocker on its own, but #1 and #2 are worth
closing before opening the public funnel to traffic.

### F1 — `/api/bonus-claim` does not verify Turnstile (MEDIUM)
`app/api/bonus-claim/route.ts` accepts a `turnstileToken` field in its schema but **never calls
`verifyTurnstileToken`**, unlike `/api/subscribe` and `/api/free-chapter` which both enforce it.
The endpoint is unauthenticated and, per request, writes a `bonus_claims` row **and** sends a
Resend email to the supplied address. That makes it an abuse/email-bomb surface once Resend is
live. **Fix:** mirror the subscribe/free-chapter pattern — verify Turnstile before the upsert and
send. ~3 lines, low risk. (The bonus-claim *page* should already render the widget; confirm it
passes the token through.)

### F2 — No rate limiting on public POST endpoints (LOW–MEDIUM)
`/api/track`, `/api/checkout`, and `/api/bonus-claim` have no rate limiting. Turnstile partially
mitigates `/api/subscribe` and `/api/free-chapter`, but `/api/track` is an unauthenticated
analytics writer (could flood `analytics_events`) and `/api/checkout` creates live Stripe
sessions on every call. **Fix:** add a lightweight IP/edge rate limit (Vercel KV or middleware)
on the unauthenticated mutating routes before launch.

### F3 — PostgREST `.or()` filters interpolate session values as strings (LOW)
`lib/entitlements.ts:35` and `lib/supabase/server.ts:53` build PostgREST filters via template
strings: ``.or(`user_id.eq.${id},email.eq.${email}`)``. The values come from a validated Supabase
session (and the entitlement query is additionally scoped by `book_slug`), so exploitability is
low — but an email containing PostgREST filter metacharacters (e.g. a comma) could alter the
filter shape. **Fix (defensive):** prefer structured `.or()` with explicit `.eq()` chaining or
escape/quote the interpolated values. Low priority.

### F4 — `/dashboard` renders without a session guard (LOW / informational)
Carried over and re-confirmed. `app/dashboard/page.tsx` renders a static shell regardless of auth
state (it links to `/login`, `/downloads`). It exposes **no** sensitive data — actual file
delivery is gated server-side at `/api/downloads/sign` — but the page neither redirects nor
personalizes when signed out. Consider a session-aware redirect or clearer "sign in to see your
orders" treatment. Not a security defect.

---

## 6. Pre-existing gaps (unchanged — launch checklist, not code defects)

- **Config:** no `.env.local` values wired; `NEXT_PUBLIC_SITE_URL` unset → falls back to
  `http://localhost:3000`. All providers are scaffolded and gated, not connected.
- **Binary deliverables:** EPUB, POD PDF, Affirmation Deck, free chapter/checklist, worksheets,
  challenge PDFs are referenced by storage path but not yet uploaded to Supabase Storage (paid →
  private `curls-deliverables`; free → public `curls-free`). **Never** place paid files in
  `public/`.
- **Content:** hero uses a CSS `BookMockup` (a real cover render would lift the first impression);
  blog has 2 stub posts; thank-you video falls back to a pull-quote panel when
  `NEXT_PUBLIC_THANKYOU_VIDEO_ID` is empty.
- **Legal & claims:** legal pages are outlines (`content/legal-outlines.ts`) pending attorney
  review; `book.credibilityNote` still carries a `[VERIFY: claims-evidence.md]` marker — not
  rendered publicly (data only), but tidy it before it could ever surface.
- **Nit:** `.env.sandbox.example` lists `TURNSTILE_SITE_KEY` (no `NEXT_PUBLIC_` prefix), which the
  code never reads — only `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY`. Harmless but
  misleading; remove or correct.

---

## 7. One-line summary

> Re-verified green and secure on 2026-06-30: payments, entitlements, downloads, refunds, admin,
> and RLS all hold up under direct code review. No critical/high defects. Close the
> `/api/bonus-claim` Turnstile gap and add rate limiting on public POST routes before opening the
> funnel; everything else is keys, files, a domain, and a lawyer.

See `docs/WHAT_TO_DO_NEXT.md` for the ordered setup runbook and `.env.local` template.
