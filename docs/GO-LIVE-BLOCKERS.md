# Go-Live — the two remaining blockers

Everything code-side for the PRD v2 build is on `main` and building green. Two
things remain, and neither is code — both live in the Vercel/Stripe dashboards.
Clear these and Funnel 1 can launch.

---

## Blocker 1 — Production checkout returns HTTP 502 (the real launch gate)

`POST /api/checkout` fails in production; Supabase shows **zero** orders,
webhook events, or entitlements ever recorded. The code path is correct — the
production **environment** is not. Most consistent with a stale
`STRIPE_SECRET_KEY` (or a missing/typo'd price-ID var) in Vercel Production,
left behind by the `.env` rotation.

### Fix
1. Vercel → project **`website`** → **Settings → Environment Variables →
   Production**. Reveal and correct whichever of these is stale/blank:
   - `STRIPE_SECRET_KEY` — live secret key (`sk_live_…`)
   - `STRIPE_PRICE_ID_PREORDER` — the **$17.99** Digital Bundle (Preorder) price (`price_1TguBE`)
   - `STRIPE_PRICE_ID_REGULAR` — the $19.99 regular price
   - `STRIPE_PRICE_ID_CARD_DECK` — an **active** $7.99 price, **or** remove the
     bump from `/preorder` + `/buy` if no real $7.99 price exists yet
   - `STRIPE_WEBHOOK_SECRET` — signing secret matching the live webhook endpoint
2. **Redeploy** production (env changes don't apply until redeploy).
3. Confirm which webhook route Stripe is actually calling — the canonical
   handler is `app/api/stripe/webhook/route.ts`; `app/api/webhooks/stripe` is a
   shim alias. Point the Stripe Dashboard endpoint at one and match its signing
   secret to `STRIPE_WEBHOOK_SECRET`.

### Prove it (do this before driving any launch traffic)
- [ ] Run **one test-mode purchase** end to end: checkout session → webhook
      (signature-verified) → `orders` + `entitlements` row written → Resend
      delivery email received.
- [ ] Confirm `direct_ebook` resolves to **$17.99** (`price_1TguBE`).
- [ ] Confirm `webhook_events` actually writes (it's currently 0).
- [ ] Refund the test order and confirm the entitlement is revoked.
- [ ] Investigate the anomalous small live Stripe charges before launch (card-
      testing risk → payout freeze); turn on Radar rules.

---

## Blocker 2 — Set the launch env vars in Vercel Production

The PRD v2 launch-state machine and the newly-wired funnels read these. Blank
or wrong values degrade gracefully (no crash), but the funnels won't fully fire
until they're set.

| Variable | Set to | Why |
|---|---|---|
| `NEXT_PUBLIC_LAUNCH_STATE` | `PREORDER` | Drives all site copy/CTAs/badges; flip to `LAUNCH` on release morning, `EVERGREEN` after |
| `RELEASE_DATE` | `2026-11-24` | Countdown + delivery copy source of truth |
| `MAILERLITE_GROUP_QUIZ` | `191751931239073670` | Quiz funnel (F2) capture tag — created live per the audit |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | live site key | Anti-bot on quiz, contact, newsletter forms |
| `TURNSTILE_SECRET_KEY` | live secret | Server-side Turnstile verification |
| `RESEND_API_KEY` + sender domain (SPF/DKIM/DMARC) | live | Contact form + free-chapter + order delivery email |

After setting, **redeploy** and confirm:
- [ ] `NEXT_PUBLIC_LAUNCH_STATE=PREORDER` → hero shows the preorder CTA + "Coming November 24" chip
- [ ] Quiz submit lands the email in the MailerLite quiz group with the archetype tag
- [ ] Challenge signup lands in the list (`source="challenge"`)
- [ ] Contact form sends (intent-prefixed subject) to the support inbox

---

## Not on this gate (ships independently)
The cinematic `/journey`, the immersion layer, and SEO changes are already live
on `main` and don't touch the money path. They wait on nothing here.
