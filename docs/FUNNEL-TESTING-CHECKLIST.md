# Funnel, Signup & Login Testing Checklist
**Curls & Contemplation — curlscontemplation.beauty**

Legend: 🟢 testable right now · 🔴 blocked (dependency broken, see `TASK-C-SERVICE-AUDIT.md`) · 🟡 testable but incomplete (degrades silently, won't error, just won't fully work)

---

## 0. Pre-flight — confirm these before testing anything else
- [ ] 🔴 Supabase restored (audit B1) — until then, every "confirm it landed in the database" step below will fail even if the form itself works.
- [ ] 🔴 Stripe webhook re-pointed to `/api/stripe/webhook` (audit B2) — until then, no purchase completes end-to-end no matter how correctly you pay.
- [ ] All 27 env vars from the Finalization Guide §3 are set in Vercel Production, and a fresh deploy has run since setting them (env var changes require a redeploy to take effect).

---

## 1. Newsletter signup (footer + blog CTA) — 🟡 testable now, verify DB separately after B1 is fixed
Route: `POST /api/subscribe` (`app/api/subscribe/route.ts`)

1. Go to any page, scroll to the footer. Confirm the "Letters worth reading" band renders.
2. Enter a real test email you control. Submit.
3. **Expected on success:** form swaps to "Thank you" state, message reads *"You're in. Check your inbox for the welcome note."*
4. Check the test inbox — **currently will NOT receive a welcome note** (audit H1: zero MailerLite automations exist yet). This is expected until an automation is built; don't treat a missing welcome email as a bug in the form itself.
5. In MailerLite Dashboard → Subscribers, confirm the test email appears in the **Website Signups** group within ~1 minute.
6. Repeat from `/blog/[any-post]` — same form, `source="blog"` instead of `source="footer"`. Confirm both submissions tag correctly (check the subscriber's custom field/source in MailerLite if visible).
7. Try an invalid email (`not-an-email`) — confirm client-side `type="email"` blocks submission, and if you bypass that, confirm the API returns `{ok:false, error:{code:"invalid_email"}}`.
8. **After Supabase is restored:** re-submit a new test email, then query `subscribers` and `subscriber_events` tables — confirm a row exists with `event_type: "email_signup_completed"`.

## 2. Free chapter funnel — 🟡 testable now, download links depend on separate config
Route: `POST /api/free-chapter` (`app/api/free-chapter/route.ts`) → redirects to `/thank-you`

1. Go to `/free-chapter`. Submit a real test email.
2. **Expected:** redirect to `/thank-you` (or `/thank-you?delivery=pending`).
3. Check inbox for the chapter email. **This depends on `freeChapterLinks()` in `lib/free-assets.ts` resolving** — which requires `NEXT_PUBLIC_SUPABASE_URL` to be set AND the two files actually uploaded to the public `curls-free` bucket (Finalization Guide §1). If either is missing, the email still sends but with generic "delivery configured later" copy instead of real links — test both states deliberately.
4. Confirm the subscriber lands in MailerLite's **Free Chapter** group.
5. Confirm the actual PDF links in the email resolve (200, not 404/403) if you've uploaded the files.

## 3. Quiz funnel — 🔴 STAGED/HELD, do not test as if live
Routes: `/quiz` (noindex), `POST /api/quiz`

1. Confirm `/quiz` currently shows `StagedNotice` and is `noindex` — this is intentional, not a bug. It was deliberately held back from a prior session's decision.
2. If/when you decide to un-stage it: confirm `MAILERLITE_GROUP_QUIZ` env var is set to `191751931239073670` (created live this session, see audit), remove the `StagedNotice` gate, remove `noindex`, add it to `sitemap.ts`, then re-run this whole checklist against it fresh.

## 4. Checkout — direct ebook, bundle, worksheets, + card-deck order bump — 🔴 fully blocked until B1 + B2 fixed
Route: `POST /api/checkout` → Stripe Checkout → `checkout.session.completed` webhook → `/dashboard?checkout=success`

1. Use Stripe **test mode** keys for all of this, not live keys.
2. From `/preorder` (or `/buy` if `NEXT_PUBLIC_LAUNCH_MODE=launched`), start checkout for the base ebook. Confirm you land on Stripe's hosted checkout page with the correct price shown for the current launch mode (preorder vs. regular).
3. Toggle the Affirmation Card Deck add-on if the UI exposes it. Confirm the line item appears in the Stripe Checkout session at $7.99, and that `STRIPE_PRICE_ID_CARD_DECK` is set — if it's missing, the API should return `{code:"card_deck_unavailable"}`, 503, not silently drop the add-on. **Test the missing-price-id case deliberately** — this is a real code path (`app/api/checkout/route.ts`), not a hypothetical.
4. Complete payment with Stripe's test card `4242 4242 4242 4242`.
5. Confirm redirect to `/dashboard?checkout=success` with the "Payment received" banner.
6. **This is the step that currently fails silently:** check Stripe Dashboard → Webhooks → your endpoint → confirm the `checkout.session.completed` event shows `200`, not `404`. If B2 isn't fixed yet, it'll be 404 and nothing past this point will have happened.
7. Once B1 + B2 are fixed: confirm a row exists in `orders` (status `paid`) and `purchases` (book + card-deck if purchased, `entitlement_status: "active"`).
8. Confirm the order-confirmation and download-access emails arrive via Resend.
9. Confirm the subscriber moved to MailerLite's **Customers** group.
10. Test a refund in Stripe test mode → confirm `charge.refunded` fires → `purchases.status` flips to `refunded`, `entitlement_status` to `revoked`, subscriber moves to **Refunded** group, and a "refund processed, access revoked" email sends.
11. Test cart abandonment: start checkout, close the tab without paying, wait for Stripe's `checkout.session.expired` (or trigger it manually in test mode) → confirm the subscriber tags into **Abandoned Checkout**. Remember: this tag currently does nothing further (audit H1, no automation built) — that's expected, not a bug, until you approve an abandoned-cart email sequence.

## 5. Signup / Login / Dashboard — 🔴 BLOCKED, not buildable to test yet
This is not a "test and report bugs" section — **there is no working code to test.** `components/AuthForm.tsx` has no submit handler at all (audit B3). Clicking either button currently does nothing but reload the page.

- [ ] Confirm this for yourself: go to `/signup`, open browser dev tools → Network tab, click "Create account" with an email typed in. **Expected right now:** no network request fires at all.
- [ ] Do not test "logging in with a real purchase email" — there's no session creation logic yet to test.
- [ ] Once I build real Supabase Auth wiring (say the word, per the Finalization Guide), re-test:
  - Sign up with a fresh email → confirm a Supabase Auth user is created and (if magic-link) a real confirmation email arrives.
  - Log in with the same email used at checkout → confirm `/dashboard` shows real purchase rows, not the current static placeholder text.
  - Log in with an email that has *no* purchases → confirm dashboard shows an honest empty state, not an error.
  - Attempt `/api/downloads/sign` while logged in with an entitled account → confirm a real signed URL returns, valid for 24h (`SIGNED_URL_TTL_SECONDS`).
  - Attempt the same while logged in with a refunded/revoked account → confirm `403` with `{code:"revoked"}` or `{code:"refunded"}`.
  - Attempt the same while logged out → confirm `401` with `{code:"unauthenticated"}`.
  - Download the same deliverable 4 times in a row → confirm the 4th attempt returns `{code:"download_limit_reached"}` (cap is 3 per 7 days, `DOWNLOAD_CAP`/`DOWNLOAD_WINDOW_DAYS` in `lib/entitlements.ts`).

## 6. Bonus claim — 🟡 fully coded, testable now (independent of the Supabase outage's worse effects)
Route: `POST /api/bonus-claim` (`app/api/bonus-claim/route.ts`)

1. Submit a test email + optional note.
2. Confirm `{ok:true, status: "manual_review_scaffold"}` while Supabase is down, or `{status:"recorded"}` once it's restored.
3. Confirm subscriber tags into **Bonus Claim Started** in MailerLite.
4. Confirm a "Bonus claim received" email arrives via Resend.
5. Once Supabase is back: confirm a row lands in `bonus_claims`.

## 7. Contact page — 🟡 testable now for the mailto flow; social links don't exist yet
1. Confirm the "Email Support" button opens a mail client addressed to `siteConfig.supportEmail`.
2. Social link testing is N/A until you supply handles (Finalization Guide §2) and I build the component — track this as a follow-up, not a current bug.

## 8. General cross-cutting checks
- [ ] Every form above: confirm Turnstile actually blocks a scripted/automated submission when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` are set — try submitting via `curl` directly to the API route without a token and confirm `403 turnstile_failed`.
- [ ] Confirm `NEXT_PUBLIC_LAUNCH_MODE` behaves correctly in all three states (`preorder`, `launched`, `paused`) — especially `paused`, which should return `503 checkout_paused` from `/api/checkout` and should be exercised deliberately, not just assumed.
- [ ] Confirm `robots.txt` / `sitemap.xml` correctly exclude `/quiz`, `/login`, `/signup`, `/dashboard`, `/media-kit`, `/worksheets` (noindex routes) — spot-check a few in Google Search Console's URL Inspection tool once live.
