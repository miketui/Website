# Curls & Contemplation — Launch-Day Runbook

**Launch:** Tuesday, **2026-11-17**. The fulfillment cron (`/api/cron/launch-day`) runs **hourly** (see `vercel.json`); the kill-switch keeps every run a no-op until you flip it, and each run sends at most 50 buyers so the function always finishes inside Vercel's execution limit — a larger backlog drains over the following hours automatically.
**Owner:** Michael David. **Scope:** getting the v13 EPUB to every paid buyer automatically, with a kill-switch between the cron and their inboxes. (The POD interior PDF is a print artifact for KDP/third-party POD — the site never delivers it.)

---

## The safety model in one paragraph

The launch-day cron does **nothing** unless `LAUNCH_FULFILLMENT_ENABLED` is exactly the string `"true"` in Vercel Production. When it is off, the cron returns HTTP 200 `{ status: "disabled" }` (200 on purpose — Vercel must not retry a deliberate block) and logs `launch_fulfillment_blocked_by_killswitch`. When it is on, a guard chain still runs before any send: CRON_SECRET → release date reached → private bucket reachable → v13 EPUB object present → Resend configured → eligible-buyer sanity check. Any guard failure aborts with zero emails sent, logs `launch_fulfillment_guard_failed`, and emails `LAUNCH_OWNER_EMAIL`.

## Timeline

| When (America/Los_Angeles) | Action |
|---|---|
| **Now / any day** | Run the dry-run curl below. Prove the chain end-to-end against your test address. |
| **2026-11-16 07:30** | Automatic: `/api/cron/pre-launch-check` runs the dry run and emails you a pass/fail report. Subject prefixed `[⚠️ ACTION REQUIRED]` if anything is off. |
| **2026-11-17 06:30–06:55** | Pre-flip verification (checklist below). |
| **2026-11-17 ~06:55** | Flip the switch (30+ min before the 07:00 cron): Vercel Dashboard → **Website** project → Settings → Environment Variables → Production → set `LAUNCH_FULFILLMENT_ENABLED=true` → **redeploy** (env changes need a deploy). CLI alternative: `vercel env rm LAUNCH_FULFILLMENT_ENABLED production && echo "true" \| vercel env add LAUNCH_FULFILLMENT_ENABLED production && vercel redeploy` |
| **2026-11-17 07:00** | Cron fires (next hourly tick after the flip). Paid, unfulfilled buyers get a 30-day signed EPUB link, 50 per run until the backlog is empty (`remainingAfterBatch` in the response shows what's left). `purchases.launch_email_sent_at` gates re-sends; the hourly cadence also picks up late buyers automatically. |
| **2026-11-17 07:15** | Verify (checklist below). If `remainingAfterBatch` was non-zero, re-check after the next hourly run. |

## Verify BEFORE flipping the switch

1. **Dry run green** — the curl below returns `"ok": true` with empty `warnings`, and the test email landed with a working link.
2. **Bucket healthy** — `curls-deliverables` (private) contains `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub`.
3. **Resend deliverability green** — no bounces/complaints spike on the dashboard; sending domain still verified.
4. **Counts reconcile** — MailerLite `Customers` group count ≈ Supabase `purchases` rows with `entitlement_status='active'`. A large gap means the pipeline is leaking; investigate before flipping.

## Verify AFTER the cron fires

- Cron response (Vercel → Deployments → Functions log): `sent` equals eligible-buyer count, `failures` empty.
- Spot-check one real buyer email (BCC yourself via a test purchase beforehand if possible).
- `select count(*) from download_events where event_type='launch_ebook_delivery';` matches `sent`.
- `select count(*) from purchases where launch_email_sent_at is not null;` matches.

## IF SOMETHING LOOKS WRONG

**Leave (or flip back) `LAUNCH_FULFILLMENT_ENABLED=false` first. Then diagnose.** Do not delete rows — the audit trail matters.

Rollback SQL (marks the last hour's launch deliveries rolled back and re-arms those buyers for the next cron run):

```sql
-- 1. Tag the affected audit rows (do NOT delete):
update download_events
set metadata = metadata || '{"rolled_back": true}'::jsonb
where event_type = 'launch_ebook_delivery'
  and created_at > now() - interval '60 minutes';

-- 2. Re-arm those purchases so the next enabled cron run re-sends:
update purchases
set launch_email_sent_at = null, updated_at = now()
where launch_email_sent_at > now() - interval '60 minutes';
```

Then: fix the root cause (bad object, expired domain, wrong template), re-run the dry run until green, and flip the switch again. Signed URLs already sent cannot be revoked individually — if the wrong FILE went out, replace the object at the same storage path (links point at the path, not the bytes) and re-send.

## Dry-run harness — run this today

```bash
curl -sS -H "Authorization: Bearer $CRON_SECRET" \
  https://curlscontemplation.beauty/api/cron/launch-day/dry-run | jq
```

Expected: `{ "ok": true, "dry_run": true, "test_email": "...", "url_expires_at": "...", "warnings": [] }` — plus the actual delivery email in the `LAUNCH_DRYRUN_TEST_EMAIL` inbox with a signed link that downloads the v13 EPUB. The dry run intentionally ignores the kill-switch (test any time), writes `download_events.event_type='launch_ebook_dryrun'`, and never touches `purchases`.

## Env vars this system reads

| Var | Purpose |
|---|---|
| `LAUNCH_FULFILLMENT_ENABLED` | Kill-switch. Only `"true"` sends. Default false. |
| `LAUNCH_DRYRUN_TEST_EMAIL` | The one address dry runs deliver to. |
| `LAUNCH_OWNER_EMAIL` | Guard-failure alerts + November 16 pre-launch report. |
| `CRON_SECRET` | Bearer token protecting all three cron/dry-run routes. |

## Uploading the deliverables

Storage objects the launch chain depends on (private bucket `curls-deliverables`):

- `books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub` — **required**
- `workbooks/Idea-to-Action-Workbook-MDW.pdf` — buyer companion, staged for the ascension ladder (not yet surfaced in the dashboard)

The v13 POD interior PDF (`Curls-and-Contemplation-v13-KDP-POD-RECTO-FINAL.pdf`) is a print artifact for KDP/third-party POD only — it is not uploaded to Storage and the launch email never links it.

Free assets (public bucket `curls-free`) are staged in-repo under `assets/free-bucket/` mirroring their bucket paths. Upload everything with:

```bash
SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... \
  node scripts/upload-deliverables.mjs --private-dir /path/to/private-files
```

(See `scripts/upload-deliverables.mjs --help`. Free assets upload from the repo automatically; private files are never committed to git, so point `--private-dir` at the folder holding the v13 EPUB and workbook.)
