# Launch audit 2026-07-31 — P0 remediation status

Tracks the audit's P0 findings against what this branch changed. Written to be
read alongside the audit, not to replace it.

**Nothing here is a merge approval.** Per `CLAUDE.md` gate 1, `main` is
Vercel-tracked and a merge is a production deploy. This branch stops at the PR.

---

## Closed in code on this branch

| ID | Finding | What changed |
|---|---|---|
| P0.1 (partial) | Frozen install fails; no `start` script; trailing-slash site URL | Lockfile regenerated with pnpm 10 (`--frozen-lockfile` passes, parses clean under duplicate detection, 713 packages / 714 snapshots, one importer). Added `start: next start`. `getSiteUrl()` now strips trailing slashes, so Stripe success/cancel URLs stop inheriting the double slash. |
| P0.3 | Two launch resolvers; display price could disagree with Stripe; UTC release instant; 14-vs-15-day window | `resolveLaunchOffer()` in `config/launchState.ts` is now the single server-owned resolver returning state, price tier, display price, Stripe tier, gift eligibility, and release instant. `lib/launch-mode.ts` and `lib/stripe.ts` no longer resolve anything themselves. Release instant is midnight **America/Los_Angeles**. `LAUNCH_WINDOW_DAYS = 14`, stated once. |
| P0.4 | Workbook chargeable inside a preorder that includes it free | `/api/checkout` deletes the workbook line item before Stripe is called whenever a qualifying book is in the cart. Independent of request shape — stale cart, direct POST, and second tab all hit the same gate. Cart drawer stops suggesting it and renders "Included free". |
| P0.5 | Order, entitlement, and refund write errors ignored | Order upsert, the legacy book-entitlement fallback, refund lookup, and refund revocation are all checked. Failures throw or return non-2xx so `processed_at` stays null and Stripe retries. |
| P0.6 | Launch email could send, fail to stamp, report success, and resend hourly | `deliverLaunchCopy` claims the send first (`.is("launch_email_sent_at", null)`, atomic across concurrent crons), releases the claim on provider failure, refuses to send without a purchase row, and treats a failed audit write as a failed job. The cron never retries a buyer whose email already left. |
| P0.8 | Forms reported success with no durable record | `lib/lead-intake.ts` enforces one rule across `/api/subscribe`, `/api/pricing-kit`, `/api/quiz`, `/api/contact`: success only after a durable system of record accepted the lead. Otherwise 502 `delivery_failed`. Front-end delivery states now match the API's (the pricing-kit form compared against a state name the API never returned, so every visitor got the pending page). |

Regression locks: `tests/launch-audit-2026-07-31.test.ts`.

---

## Flagged and held — NOT changed on this branch

### P0.7 — legal and consumer promises (blocking, needs owner + counsel)

Privacy, terms, cookies, refund, preorder, delivery, and accessibility pages
still describe themselves as drafts pending attorney review, and the cart's
14-day refund promise is not backed by approved policy text.

This is authored content and a legal commitment. Per `CLAUDE.md` gate 2 it is
reported, not edited. Proposed sequence, for approval:

1. Counsel reviews and returns final text.
2. Cart, FAQ, receipt, and checkout consent are aligned word-for-word on the
   refund window and delivery promise.
3. Checkout stays disabled until approved policies are published.
4. Unfinished legal pages get `noIndex` — and `sitemap.ts` is updated in the
   same commit, or `tests/seo-contract.test.ts` fails.

### P0.2 — public `403` (blocking, infrastructure not repository)

The canonical domain returns `403` to signed-out browsers and the default
Vercel alias redirects to Vercel authentication. Nothing in this repository
causes or can fix that — it is Deployment Protection, WAF, team SSO, or domain
routing in the Vercel project. Needs an owner with dashboard access to identify
which, allow the production domain publicly, and reverify from two
unauthenticated networks plus a crawler user agent.

### Copy touched while fixing code — please confirm before merge

Three strings changed as a consequence of the resolver work. They are factual
corrections against the locked table in `AGENTS.md`, not rewrites, but they are
copy and they are listed here rather than assumed:

| Location | Was | Now | Why |
|---|---|---|---|
| `app/buy/page.tsx` (hero) | "$19.99 **fifteen days** after release" | "$19.99 **14 days** after release" | Contradicted the 14-day window; now rendered from `LAUNCH_WINDOW_DAYS`. |
| `app/buy/page.tsx` (checkout note) | same "fifteen days" phrasing | same fix | As above. |
| Header / hero CTA in the launch window | "Buy the Book — $19.99" | "Buy the Book — $17.99" | `AGENTS.md` prices preorder **and** launch at $17.99. The old code moved to $19.99 the moment the state flipped, which is the price-mismatch defect itself. |

**The third row is a pricing behavior change and deserves an explicit yes.** It
makes the code match the locked pricing table; if the table is what is stale,
say so and the resolver's one line changes instead.

### Deliberately out of scope

P1 and P2 items — Supabase project selection and migrations, live Stripe
test-purchase pass, provider DNS/verification, claims-evidence ledger, EPUB/PDF
format consistency, placeholder blog and media kit, schema launch-awareness,
conversion events and UTM persistence, proof program, mobile/keyboard/screen-
reader QA, favicon and manifest, CSP, rate limits. These need either owner
decisions, provider credentials, or authored content, and none is a code-only
fix.

---

## Verification run on this branch

```
pnpm install --frozen-lockfile   Already up to date
pnpm security:audit              No known vulnerabilities found
pnpm typecheck                   exit 0
pnpm lint                        exit 0
pnpm test                        139 passed (20 files)
pnpm build                       exit 0 — 70 routes generated
pnpm check:deliverables          passed
```

Test count moved 110 → 139; the 29 new tests are the P0 regression locks plus
the rewritten launch-CTA suite. `tests/order-launch-transition.test.ts` was
re-anchored to `releaseInstant()` — its offsets were measured from UTC midnight,
so it passed while the live site would have flipped eight hours early.

Not run here (needs live credentials or a browser): `pnpm check:checkout`,
`pnpm test:a11y`, `pnpm test:e2e`, `pnpm check:sandbox` beyond the deliverables
check.
