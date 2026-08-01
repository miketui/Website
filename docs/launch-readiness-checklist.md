# Launch readiness — step-by-step

**Release target:** November 24, 2026 · **Status of this document:** verified against live provider APIs on 2026-08-01.

Every "Verified" line below was checked against the actual service, not inferred
from the repository. Every "Unverified" line needs a credential or a dashboard
this session does not have.

---

## The three findings that block everything else

These were not in the 2026-07-31 audit's P0 list — two of them are the *cause*
of items that were listed with unknown origin.

### 1. Production has never deployed successfully — one character is why

`NEXT_PUBLIC_SITE_URL` in Vercel **Production** is set with a trailing slash.
`scripts/check-prod-env.mjs` treated that as a hard failure, so `pnpm build`
exited 1 on every production deploy. Confirmed in the build log for the most
recent one:

```
[check-prod-env] Production build blocked:
  ✗ NEXT_PUBLIC_SITE_URL is "[REDACTED]" — a trailing slash produces double-slash URLs
Error: Command "pnpm run build" exited with 1
```

Every `target: production` deployment in the project's recent history is in
`ERROR` state. **This is the real cause of the audit's P0.2 403** — the custom
domain has no healthy production deployment behind it. Deployment protection is
*not* the cause; see finding 2.

Fixed two ways, because both were wrong:

- The guard now treats a trailing slash as a **warning**. Both readers already
  normalize it, so it changes nothing at runtime — blocking on it converted a
  cosmetic nit into a total outage. Missing / localhost / non-https still fail
  the build, because those produce genuinely wrong output.
- **You should still fix the value** to `https://curlscontemplation.beauty`
  (no trailing slash) in Vercel → Settings → Environment Variables → Production.

### 2. Deployment protection is already configured correctly

```
ssoProtection:      enabled, deploymentType "all_except_custom_domains"
passwordProtection: disabled
trustedIps:         disabled
```

This is the right setting for a public storefront: previews stay behind Vercel
Auth, the custom domain is exempt. **Do not disable it.** The audit's
observation that the `.vercel.app` alias redirects to Vercel authentication is
this setting working as intended, not a defect. Once a production deployment
succeeds, the custom domain should serve publicly with no change here.

### 3. The Supabase project is INACTIVE, and MailerLite belongs to a different book

```
Supabase  jmfbosczwbfugbjsshwf   status: INACTIVE   (migrations query: connection timeout)
```

That project ref is the one `AGENTS.md` names as production. While it is paused
there is no database, no auth, and no storage — so checkout fulfillment,
entitlements, downloads, the launch-day cron, and every lead form are
non-functional. Resume it before any test purchase.

MailerLite authenticates fine, but the account contains **no Curls &
Contemplation groups at all**:

| Groups that exist | Groups the code expects |
|---|---|
| 7 × "Finder's Book — …", 1 × "Website Signups" | `subscribers`, `pricing_kit`, `preorders`, `customers`, `abandoned_checkout`, `bonus_claim_started`, `bonus_claim_completed`, `refunded`, `blog_readers`, `vip_early_readers`, `quiz`, `core_nurture`, `digital_directive_customers` |

The hardcoded fallback IDs in `lib/env.ts` (`192789958246794286` for
pricing_kit, `192794786755773469` for core_nurture, `192794787632383140` for
digital_directive_customers) match **none** of the 8 groups in this account, so
every `upsertSubscriber` call fails against live MailerLite today.

**Separate and urgent:** four automations named `DRAFT — … — DO NOT ENABLE` are
`enabled: true`, including *Refund Handling* and *Readiness Lead Nurture*. They
belong to a different product. Anyone landing in those groups receives
wrong-book email. This is outside this repository and was not changed here —
decide and act on it in the MailerLite dashboard.

---

## Third-party configuration status

| Service | Verified state | Action |
|---|---|---|
| **Vercel — build** | All production deploys ERROR; preview READY | Fix `NEXT_PUBLIC_SITE_URL`, redeploy, confirm READY on `main` |
| **Vercel — protection** | SSO on, custom domains exempt | None — already correct |
| **Supabase** | `jmfbosczwbfugbjsshwf` **INACTIVE**, unreachable | Resume project, then apply migrations `0001`–`0007` |
| **MailerLite — auth** | Authenticated, account 2202141 | None |
| **MailerLite — groups** | 8 groups, **0** for this book | Create all 13, set `MAILERLITE_GROUP_*`, remove stale fallback IDs from `lib/env.ts` |
| **MailerLite — automations** | 4 "DO NOT ENABLE" drafts are live | Review and disable |
| **Stripe** | **Unverified** — needs live keys | `pnpm check:checkout` |
| **Resend** | **Unverified** — needs domain/DNS access | Confirm domain authentication |
| **Turnstile** | **Unverified** | Confirm keys, fail-closed in production |
| **GA4 / PostHog / Sentry** | **Unverified** | Confirm production event flow |
| **Search Console / Bing** | **Unverified** | Confirm ownership, submit sitemap |

---

## Step by step

### Stage 1 — get the site reachable (blocks everything)

1. Set `NEXT_PUBLIC_SITE_URL=https://curlscontemplation.beauty` in Vercel Production — no trailing slash.
2. Confirm `RELEASE_DATE=2026-11-24`, `CRON_SECRET` (≥16 chars), and that `ALLOW_DEMO_SESSION` is **not** `1`. All three fail the build if wrong.
3. Confirm the Vercel build command is `pnpm build`, not a bare `next build` — a bare command skips the env guard entirely.
4. Redeploy `main`. Confirm the deployment reaches `READY`.
5. Load `https://curlscontemplation.beauty` **signed out, from two networks**. Expect 200.
6. Check `/robots.txt`, `/sitemap.xml`, `/`, `/preorder`, `/buy`, `/book`, `/faq`, `/blog`, and a policy page all return their intended status.

### Stage 2 — restore the data layer

7. Resume the Supabase project and wait for it to report ACTIVE.
8. Apply migrations `0001`–`0007`. Migration `0007` provides `claim_download_slot`, which enforces the download cap — the app-side count is advisory only.
9. Confirm buckets: `curls-deliverables` (private) and `curls-free` (public).
10. Confirm the v13 EPUB exists at the exact path in `lib/deliverables.ts`. The launch cron aborts if it is missing.
11. Confirm auth redirect URLs point at the production domain.
12. Re-check every Supabase env name against `lib/env.ts` — **four** naming schemes coexist and a project-reference mismatch previously broke checkout.

### Stage 3 — email and lists

13. Create the 13 MailerLite groups; set each `MAILERLITE_GROUP_*` variable.
14. Delete the stale hardcoded fallback IDs in `lib/env.ts` once real IDs are set — a wrong fallback fails silently in a way a missing one does not.
15. Resolve the live `DRAFT — … — DO NOT ENABLE` automations.
16. Verify Resend domain authentication and production sending.
17. Send one real message through `/api/contact` and confirm it arrives.

### Stage 4 — prove the money path

18. `pnpm check:checkout` — a real Stripe test-mode call. Catches rotated keys and wrong-account price IDs.
19. Verify `STRIPE_PRICE_ID_PREORDER` = $17.99 and `_REGULAR` = $19.99 in the **same** Stripe account as `STRIPE_SECRET_KEY`.
20. Note: `_SET_01..12` are marked optional in the smoke test, so a typo reads as "not configured" rather than as an error. Check each name against `.env.example`, **and** against the env mapping in `.github/workflows/ci.yml` — fixing one side only re-creates the silent skip.
21. Full test purchase: checkout → webhook → order row → entitlement → email → signed download.
22. Confirm a preorder that includes the book **cannot** be charged for the workbook. Try it with a stale cart and a direct POST, not just the UI.
23. Replay the same Stripe event. Confirm nothing duplicates.
24. Inject a database failure during fulfillment. Confirm a non-2xx and a Stripe retry — not a 200.
25. Refund it. Confirm entitlement revocation and the audit row.

### Stage 5 — legal (needs counsel, not code)

26. Get privacy, terms, cookies, refund, preorder timing, digital delivery, accessibility, retention, and governing law reviewed.
27. Decide the refund window. The cart no longer quotes one — it links to the policy instead, because it previously promised "14-day refund policy" while the policy said the window was not final.
28. Align cart, FAQ, receipt, and checkout consent word-for-word with the approved text.
29. When final: delete `noIndex: true` from the seven policy pages **and** restore them to `secondaryRoutes` in `app/sitemap.ts` **in the same commit** — `tests/seo-contract.test.ts` fails if they drift.

### Stage 6 — measurement and pre-flight

30. Verify GA4, PostHog, Sentry, Search Console, Bing. Submit the sitemap.
31. Confirm consent gating: no marketing analytics before consent.
32. Add conversion events and UTM persistence through to Stripe (audit P1.8 — not built).
33. `pnpm test:a11y` and `pnpm qa:mobile` against the deployed site. Both pass in CI against a local build; neither has run against production.
34. Set `LAUNCH_FULFILLMENT_ENABLED=true` about 30 minutes before the launch cron — not earlier.
35. Dry-run the launch cron against a test cohort, including partial failures.
36. Record the rollback target and confirm the cron schedule in `vercel.json`.

---

## What the code now guarantees

Landed in PR #48 and the follow-up branch:

- One launch resolver. Displayed price and Stripe price cannot disagree.
- $17.99 while preordering; $19.99 from the release instant — midnight **America/Los_Angeles**, not UTC.
- The gifted workbook cannot be charged, enforced server-side.
- Order, entitlement, and refund writes are checked; failures make Stripe retry.
- Launch email claims its slot before sending, so a stamp failure cannot cause hourly resends.
- Lead forms return 502 rather than claiming success when nothing durable accepted the lead.

None of that helps until Stage 1 and Stage 2 are done. The code is ready for a
database and a domain it does not currently have.
