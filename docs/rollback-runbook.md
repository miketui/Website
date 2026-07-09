# Deploy & Rollback Runbook — curlscontemplation.beauty

**Phase 7 (DEPLOY).** Authored 2026-07-09. Operator-facing. Builds on
`docs/current-state.md` (Phase 1), `docs/rebuild-plan.md` (Phase 2 + pre-mortem), and
`docs/commerce-runbook.md` (Phase 5). Release date of record: **2026-11-24**.

> ### [GATE] — NOTHING IN THIS RUNBOOK WAS EXECUTED BY THE AGENT
> No production deploy, promotion, rollback, env change, or credential read/rotation was
> performed. Every step marked **[GATE]** is a human checkpoint that the owner (Michael)
> must perform or explicitly approve, because it deploys, changes prod config, charges a
> card, or touches PII/live credentials. The agent cannot do these.

**Verified deployment target (Vercel API, this session):**

| Fact | Value |
|---|---|
| Team | `mikes-projects` (`team_7O6qPJlJQIL4rALhRXEgFIJD`) |
| Scope slug (CLI `--scope`) | `mikes-projects-1e9a868e` |
| Project | `website` (`prj_SyCWL5ZUvAXol76cu1kc8WdsORMS`) |
| Production source | `main` branch (auto-deploys, **READY**, turbopack) |
| Current READY production deploy (**rollback candidate**) | `dpl_4F6PJ7mzf35Z2sAgDZQiWq3VoJMf` — commit `73b06fa`, target `production` |
| Preview/branch deploys | **ERROR before build starts** — known preview-env config issue, NOT code (see §3d) |

---

## 1. Go-live sequence (gated)

Production deploys from `main` are healthy. Previews are currently broken by an
owner-gated Vercel dashboard issue (§3d), so the "push preview → smoke the preview URL"
step below is blocked until the owner fixes preview env/protection. Two paths are given:
the **ideal** path (once previews work) and the **current fallback** (production-only,
with rollback armed as the safety net).

### Ideal path (once previews are fixed — §3d)
1. **Push the release branch.** Vercel builds a Preview deployment automatically.
2. **Run the smoke suite against the Preview URL** (see §5 + the smoke checklist below).
   No card charge here — this is presence/render/consent checking only.
3. **[GATE] Owner "promote".** Michael reviews the preview and explicitly approves
   promotion. Do not proceed without this.
4. **[GATE] Promote to production.** Merge to `main` (auto-deploys) **or** promote the
   exact previewed deployment in the Vercel dashboard ("Promote to Production") so the
   bytes that were smoked are the bytes that ship.
5. **Verify build + runtime logs.** Vercel → Project `website` → Deployments: confirm the
   new production deploy is **READY**. Open **Logs (Runtime)**, exercise the site, and
   confirm no `[checkout] stripe.checkout.sessions.create failed` lines and no unexpected
   errors.
6. **[GATE] Arm observability** (§4) — confirm Sentry/GA4/PostHog are receiving events.
7. **Post-deploy smoke** (§5 health probe + smoke checklist) against the **production**
   URL. For the money path, run the gated **$1 live-test** from
   `docs/commerce-runbook.md` §2 — **[GATE]** because it charges a real (refundable) card
   and can trigger the live MailerLite "Customers — Post-Purchase Onboarding (DRAFT)"
   automation (approve/pause it first, `docs/commerce-runbook.md` [GATE]).

### Current fallback path (previews broken)
1. **[GATE] Owner fixes preview env/deployment protection** (§3d) — preferred, restores
   the ideal path. If launch cannot wait:
2. **[GATE] Merge to `main`** to deploy straight to production, **with rollback pre-armed**:
   note the current READY deploy `dpl_4F6PJ7…` (commit `73b06fa`) as the instant-rollback
   target *before* merging.
3. Immediately run steps 5–7 above. If anything fails, execute the **one-command
   rollback** (§2) to `dpl_4F6PJ7…`.

### Smoke checklist (run against preview URL, then production URL)
- `GET /api/health` → `{ ok:true, paymentsLive:true, subscriptionsLive:true }` (§5).
- Home `/` and `/preorder` render; primary CTA reads the launch-state copy (Preorder).
- Consent banner present; **no** GA4/PostHog network calls fire before "Allow analytics".
- Free-chapter form submits (lead capture) — non-charging.
- `[GATE]` $1 checkout end-to-end (production only) per `docs/commerce-runbook.md` §2.

---

## 2. The ONE-COMMAND rollback

There are two independent rollback mechanisms. **Use the Vercel instant rollback first**
(it is a metadata pointer swap — seconds, no rebuild). Use the git revert only when the
bad artifact must not exist at all or when the last-good deploy is also bad.

### A. Vercel instant rollback (DEFAULT — use for any prod incident)
Re-points the production alias to the last-known-good READY deployment. No rebuild.

**One command:**
```bash
vercel rollback dpl_4F6PJ7mzf35Z2sAgDZQiWq3VoJMf --scope mikes-projects-1e9a868e
```
(`dpl_4F6PJ7mzf35Z2sAgDZQiWq3VoJMf` = commit `73b06fa`, the current READY production
deployment — the verified rollback candidate. Substitute the last-good deployment ID/URL
if a newer good production deploy exists at incident time.)

**Dashboard equivalent (no CLI):** Vercel → Project `website` → Deployments → select the
last READY production deployment (`dpl_4F6PJ7…`) → **⋯ → Instant Rollback / Promote to
Production**.

**Use when:** a just-shipped production deploy is broken (checkout down, runtime errors,
bad render) and a prior READY production deploy is known good. This is the launch-night
safety net — fastest recovery, fully reversible.

### B. Git-side revert (use when the code itself must be undone)
Removes the bad commit from `main` and lets Vercel build a clean new production deploy.

```bash
git revert <bad-commit-sha>      # creates an inverse commit; no history rewrite
git push origin main             # Vercel auto-builds + deploys the reverted main
```
(If a whole merge must go, `git revert -m 1 <merge-sha>`.)

**Use when:** the defect is in the code/config baked into the artifact and you need `main`
to reflect the good state (e.g. a bad migration reference, a committed wrong value, or the
last-good Vercel deploy is *also* affected so there's nothing good to instant-roll-back
to). Slower than A (requires a rebuild) but it corrects the source of truth.

**Rule of thumb:** incident on production right now → **A** (instant, seconds). Bad code on
`main` that must not ship again → **B**. Often you do **A** first to stop the bleeding, then
**B** to fix `main` before the next deploy.

> Env-var note: correcting a Vercel **environment variable** does NOT roll anything back
> and does NOT take effect until a **redeploy** (`docs/commerce-runbook.md` §1). A rollback
> (A) reuses the prior deploy's env snapshot; if the incident was an env value, fix the env
> then redeploy, don't just roll back.

---

## 3. Failure-mode decision tree

### (a) Checkout returns 502
**Symptom:** `POST /api/checkout` → `502 { code: "stripe_error" }`; buyers can't pay.
**Meaning:** `stripe.checkout.sessions.create()` **threw** — the Stripe SDK was built (key
is *present*) but the live API rejected the call. Missing env would instead return **503
`config_missing`** (`app/api/checkout/route.ts:30`), not 502. So 502 = a populated-but-wrong
Stripe value. Full procedure in `docs/commerce-runbook.md` §1.

First checks (now diagnosable — Phase 5 added logging + Sentry to the catch block,
`app/api/checkout/route.ts:54-74`):
1. **Vercel → Logs (Runtime)**, filter `/api/checkout`, read
   `[checkout] stripe.checkout.sessions.create failed` → note `type`/`code`.
2. **Sentry** — the same exception is captured (guarded, `route.ts:70`); open the issue for
   the stack + Stripe error.
3. **Stripe → Developers → Logs** — the failed request names the exact error.

Fix by error code:
- `authentication_error` (HTTP 401) → `STRIPE_SECRET_KEY` is stale/invalid/wrong-mode. Set
  the correct **live** key in Vercel (Production) → **[GATE] redeploy**.
- `resource_missing` ("No such price") → a price ID is bad. Fix
  `STRIPE_PRICE_ID_PREORDER` / `STRIPE_PRICE_ID_REGULAR` (and `STRIPE_PRICE_ID_CARD_DECK`
  if the deck bump is on) to live-mode IDs from the **same account** as the key → **[GATE]
  redeploy**.
- Env changes require a redeploy to take effect — a save alone does nothing.
- Instant relief while diagnosing: set `NEXT_PUBLIC_LAUNCH_MODE=paused` (redeploy) — every
  primary CTA falls back to "Read Chapter 1 Free" → `/free-chapter`, so the site keeps
  converting to email while payments are down (`config/launchState.ts`, per
  `docs/rebuild-plan.md` §2).

### (b) Motion assets not loading
**Symptom:** hero/section motion doesn't play; visuals look bare.
**Meaning:** `public/motion/` currently holds only `README.md` + `motion-manifest.json`;
the binaries the manifest declares DELIVERED (`/motion/*.webm|.mp4|.webp`, e.g.
`hero-door`) are **absent from disk** (`docs/current-state.md` §7). `MotionAsset`/consumers
degrade to poster stills — a graceful degrade, not a crash.
First checks:
1. Confirm what's on disk: `ls public/motion` (expect the 2 metadata files today).
2. Confirm whether anything actually references them: `grep -r "/motion/" app components`
   — currently **zero** consumers, so nothing is broken in production right now (pre-mortem
   risk #2, "Paper Tiger").
Fix (when motion is wired in):
- Drop the delivered `cc-motion-library.zip` contents into `public/motion/` so the
  filenames match `motion-manifest.json`, commit, and deploy. Keep total within the
  manifest budget (`budgetKB: 12000`).
- If binaries aren't ready at go-live: **do not block launch.** Confirm every consumer has
  a `poster`/static fallback (reduced-motion-safe) so missing files degrade to stills, and
  ship. This is a content backfill, not a code fix.

### (c) MailerLite silent (no email / no group tagging)
**Symptom:** signups/purchases don't land in MailerLite; welcome/nurture emails missing.
**Meaning:** MailerLite is config-gated and **fails safe** — absent config → skip, no
throw (`lib/env.ts` `getMailerLiteConfig`). Silence usually = missing/wrong env or an
unconfigured group, not a code fault.
First checks:
1. `GET /api/health` → `subscriptionsLive` must be `true` (`= getMailerLiteConfig().ok`,
   §5). If `false`, `MAILERLITE_API_KEY` is missing → set it, **[GATE] redeploy**.
2. Group not populating a specific funnel → the group env var is unset. Map in
   `docs/commerce-runbook.md` §4 (e.g. quiz needs `MAILERLITE_GROUP_QUIZ`; the quiz route
   degrades to `captured_pending_config` if unset). Set the var → redeploy.
3. Vercel Logs for the funnel route (`/api/subscribe`, `/api/free-chapter`, `/api/quiz`,
   the Stripe webhook) for the MailerLite call result.
**[GATE] before any real customer lands in `customers`:** review/approve or **pause** the
live **"Customers — Post-Purchase Onboarding (DRAFT)"** automation — it is `enabled: true`
and fires on the first purchase (`docs/commerce-runbook.md` §4 / [GATE],
`docs/WIRING-AUDIT.md:45`). One MailerLite dashboard glance; do it before the $1 test.

### (d) Preview deploy failing (KNOWN — owner-gated, does NOT affect production)
**Symptom:** preview/branch deployments go **ERROR before the build starts** — no
build-log events at all — including on unrelated branches (e.g. `copilot/create-github-mcp`,
which only added an MCP config).
**Meaning (verified this session):** this is a **preview-ENVIRONMENT configuration
issue**, NOT code. Local `pnpm build` / lint / typecheck / test are all green on the
rebuild branch, and **production deploys from `main` succeed**. The failure fires before any
build step runs, which points at missing **preview** env vars and/or **deployment
protection** blocking the preview environment.
First checks:
1. Confirm it's environment-scoped: does `main` → production still deploy READY? (Yes, per
   the verified facts.) Does the error appear with zero build-log events? (Yes.) Both
   confirm it's pre-build/env, not code.
2. Vercel → Project `website` → Settings → **Environment Variables**: confirm the
   variables required at build/runtime are also present for the **Preview** environment
   (not just Production).
3. Vercel → Settings → **Deployment Protection**: check whether protection is rejecting
   preview deployments.
**[GATE] Fix (owner, Vercel dashboard):** populate the missing **Preview** env vars and/or
adjust deployment protection so previews build. This is an owner-gated dashboard change.
**It does not affect production** — production stays healthy while previews are broken; the
only impact is the "smoke the preview URL" step of §1 (use the fallback path meanwhile).

---

## 4. Observability arming checklist

All three trackers **fail safe**: no key → they render/do nothing. GA4 and PostHog are also
**consent-gated** (nothing fires until the visitor clicks "Allow analytics"). Arming =
setting the env var (Vercel Production, then redeploy) and confirming events arrive.

| Tool | Env var(s) | Gating / init | Confirm events fire |
|---|---|---|---|
| **Sentry** | `NEXT_PUBLIC_SENTRY_DSN` (+ build-time `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` for source maps) | Guarded init: `instrumentation.ts:4-12` (server/edge, returns early if no DSN) and `instrumentation-client.ts:3-12` (browser). No DSN → no init, no throw. `next.config.ts` source-map upload is a no-op without `SENTRY_AUTH_TOKEN`. | Trigger a caught error (e.g. force a checkout 502 in a test) and confirm the issue appears in the Sentry project. Session replay is intentionally OFF (`instrumentation-client.ts:9-10`). |
| **GA4** | `NEXT_PUBLIC_GA4_MEASUREMENT_ID` (+ `GA4_API_SECRET` for server-side) | Consent-gated: `components/GoogleAnalytics.tsx:52` returns null unless consent `granted`; loads gtag.js only after "Allow analytics". | Accept consent, then GA4 **Realtime** report should show your session; confirm a `page_view` on route change. Before consent: Network tab shows **no** googletagmanager call. |
| **PostHog** | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` (default `https://us.i.posthog.com`) | Consent-gated: `components/PostHogProvider.tsx:27,43` — `posthog.init` only when key present **and** consent `granted`; opts out on `denied` (`:40`). | Accept consent, navigate, then PostHog **Activity/Live events** should show `$pageview`. **Note:** only a "Default project" exists in PostHog — **create a dedicated "Curls" project** and point `NEXT_PUBLIC_POSTHOG_KEY` at its key so launch data isn't mixed into the default project. |

Consent verification (pre-mortem #7): load the production site in a fresh browser with the
Network tab open — confirm **no** GA4 or PostHog requests fire *before* accepting the
consent banner, and that they start *after*.

---

## 5. Health check as the post-deploy readiness probe

`GET /api/health` (`app/api/health/route.ts`) is a live, secret-free readiness probe
(Phase 5). It now returns real booleans derived from config presence:
```json
{ "ok": true, "app": "author-site",
  "paymentsLive": <getStripeConfig().ok>,        // Stripe key + prices present
  "subscriptionsLive": <getMailerLiteConfig().ok> } // MailerLite key present
```
Use it as the first post-deploy check: hit `https://<domain>/api/health` and require
`ok:true`, `paymentsLive:true`, `subscriptionsLive:true`.

**Limitation — presence, not correctness:** it only checks that env *exists*. A
wrong-but-present Stripe key still reads `paymentsLive:true` yet throws a 502 at checkout
(§3a). Only the gated **$1 live-test** (`docs/commerce-runbook.md` §2) proves correctness.
So: `/api/health` green is necessary but not sufficient — clear it, then run the $1 test.

---

## 6. Four-credential rotation gate

**[GATE] Confirm all four before / at go-live.** These credentials are high-blast-radius
and must be confirmed correct (and mutually consistent) before pointing real traffic at the
funnels. **Human-gated — the agent must not read or rotate any of them.**

| # | Credential | Why it gates go-live | Confirm |
|---|---|---|---|
| 1 | **`STRIPE_SECRET_KEY`** (+ correlated `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID_PREORDER`, `STRIPE_PRICE_ID_REGULAR`, opt. `STRIPE_PRICE_ID_CARD_DECK`) | Wrong/stale key or a price from another account/mode = the checkout 502 (§3a). Stripe touches **four** correlated secrets that must share one account + one live/test mode; rotating one without the others reintroduces the 502 or breaks fulfillment (`docs/commerce-runbook.md` §1). | Correct **live** key in Vercel Production; price IDs from the same account/mode; webhook secret matches the endpoint. Redeploy, then $1 test. |
| 2 | **`SUPABASE_SERVICE_ROLE_KEY`** | Server-side writes (orders, purchases, leads, entitlements) run with the service-role key. A wrong/rotated key silently fails fulfillment writes despite a successful charge. | Valid current service-role key in Vercel Production; a $1 test purchase must land rows in the **live** `orders`/`purchases` tables (guards the two-schema risk, `docs/rebuild-plan.md` pre-mortem). |
| 3 | **Tracked `.env`** | Any `.env` committed to the repo must contain **no** live secrets — real keys belong only in Vercel env, never in git. A tracked secret is a leaked secret and must be rotated. | Confirm no live credential is committed (`.env.example`/`.env.sandbox.example` are placeholders only). If any real key was ever committed, rotate it and purge. |
| 4 | **GitHub PAT** | A Personal Access Token with repo/deploy scope is a supply-chain key to the codebase and CI/CD. A leaked or over-scoped PAT can push malicious code that auto-deploys to production. | Confirm the PAT is scoped minimally, not committed, and rotate if exposure is suspected. |

Confirming these four is the final pre-launch credential gate; clear it, run the smoke +
$1 test (§1, §5), and only then open the funnels to real traffic.
