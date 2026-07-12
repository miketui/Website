# Curls & Contemplation — Launch Verification

**Verified:** July 12, 2026  
**Launch:** Tuesday, November 24, 2026  
**Repository:** `miketui/Website` at deployed commit `a314d6348596a45a03dc6e1acb3f47c7755975cd`  
**Rule:** `MD` is the approved MailerLite automation sender name. It is not a finding.

## Executive verdict

**GO WITH CONDITIONS.** The website project, Vercel deployment, canonical Supabase project, MailerLite groups, automations, campaigns, and local rendered pages are reachable. Do not call the marketing system launch-ready until the MailerLite step order/preheaders/sender-domain defects below are corrected, Supabase deliverables are uploaded, Resend domain status is confirmed in its dashboard, and an approved test purchase passes.

## MailerLite automations — clean/dirty evidence

All ten requested automations were re-read and are paused (`enabled: false`). This is the correct safe state for dashboard repair. Triggers and group IDs match the intended groups. The standard `{$account}`, `{$url}`, and `{$unsubscribe}` tags are MailerLite system tags and are not treated as unresolved defects. The custom `{$quiz_result_name}` tag is valid: the live field `quiz_result_name` exists. The connected MailerLite1 app exposes subject/plain-text and delay-duration updates, but not step reordering, HTML-body/internal-name editing, automation preheaders, or automation sender editing. Since every dirty workflow requires at least one unsupported operation, no partial live writes were made. The structural fixes remain a dashboard handoff rather than a misleading partial-fix claim.

| Automation | Trigger | Live step chain | Verdict | Findings |
|---|---|---|---|---|
| 2 — Pricing Confidence Kit (`192795046686229893`) | Joins Pricing Confidence Kit (`192789958246794286`) | 1d delay → Kit delivery → Pricing question → 3d delay → Talent/structure | **DIRTY** | Delivery should be immediate, then 1d, then 3d. All three preheaders are missing. |
| 4 — Quiz / Blind-Spot (`192795053311132895`) | Joins Quiz / Blind-Spot (`191751931239073670`) | 3d delay → personalized-result subject → pattern email → 2d delay → personalized-result subject | **DIRTY** | Intended order is personalized result immediately → 2d → pattern email → 3d → book bridge. Internal names and subjects are attached to the wrong steps. Preheaders are missing. |
| 5 — Preorders (`192795055972419267`) | Joins Preorders (`189927254041560661`) | Emotional reinforcement → confirmation → 2d delay | **DIRTY** | Intended order is confirmation immediately → 2d → emotional reinforcement. Both live preheaders belong to different messages. |
| 6 — Customers (`192795058197497739`) | Joins Customers (`189927259391395798`) | 14d → reader welcome → workbook subject → 1d → 3d → workbook subject → 7d → feedback subject | **DIRTY** | Entire chain is out of order. Intended order is 1d/welcome → 3d/reflection → 7d/workbook → 14d/feedback. Internal names and subjects are mismatched; all preheaders are missing. |
| 7 — Abandoned Checkout (`192795061713372667`) | Joins Abandoned Checkout (`189927264762202014`) | 48h → reminder → 1h → details → 23h → final | **DIRTY** | Intended cumulative schedule is 1h/reminder → +23h/details → +48h/final (72h total). First preheader is missing. Paid/refunded exit behavior still needs a test purchase/refund. |
| 8A — Bonus Claim Started (`192795267020358662`) | Joins Bonus Claim Started (`189927270563972991`) | Reminder 1 → Reminder 2 → 2h → 22h | **DIRTY** | Both emails currently precede the delays. Intended order is 2h → Reminder 1 → 22h → Reminder 2. Preheaders do not match the approved preview copy. |
| 8B — Bonus Claim Completed (`192795274605758257`) | Joins Bonus Claim Completed (`189927275564631964`) | Access-active email immediately | **DIRTY** | Step order and subject are correct. Sender is `info@michaeldavidjr.beauty`, not the approved brand domain; preheader is missing. |
| 9 — Digital Daily Directives (`192795281369073567`) | Joins Digital Directive Customers (`192794787632383140`) | Upsell subject → ritual → practice → 4d → upsell subject → 1d → 10d | **DIRTY** | Delivery email is missing from the immediate position; internal names/subjects are crossed. Intended order: delivery immediately → 1d/ritual → +3d/practice (day 4) → +6d/upsell (day 10). Sender domains/casing are inconsistent and all preheaders are missing. |

### Scheduled campaigns

| Campaign | Live status/date | Subject vs name | Verdict |
|---|---|---|---|
| One month (`192795454682957112`) | Ready — 2026-10-25 09:00 account time | Match | **DIRTY:** preheader missing; recipient group was not exposed by the live read. |
| One week (`192795457777304695`) | Ready — 2026-11-17 09:00 account time | Match | **DIRTY:** preheader missing; recipient group was not exposed by the live read. |
| Tomorrow (`192795460957636199`) | Ready — 2026-11-23 09:00 account time | Match | **DIRTY:** preheader missing; recipient group was not exposed by the live read. |

An extra draft copy exists: `192808511238833684`, “Copy of Preorder Countdown 2026-10-25 — One month until Curls & Contemplation.” Do not send it; archive/delete it only after owner confirmation.

## MailerLite group IDs for Vercel

These 13 IDs were verified against the live MailerLite account during this run. They are identifiers, not credentials.

| Vercel variable | Live group | Exact value |
|---|---|---:|
| `MAILERLITE_GROUP_SUBSCRIBERS` | Website Signups | `182303148544623709` |
| `MAILERLITE_GROUP_PRICING_KIT` | Pricing Confidence Kit | `192789958246794286` |
| `MAILERLITE_GROUP_PREORDERS` | Preorders | `189927254041560661` |
| `MAILERLITE_GROUP_CUSTOMERS` | Customers | `189927259391395798` |
| `MAILERLITE_GROUP_ABANDONED_CHECKOUT` | Abandoned Checkout | `189927264762202014` |
| `MAILERLITE_GROUP_BONUS_CLAIM_STARTED` | Bonus Claim Started | `189927270563972991` |
| `MAILERLITE_GROUP_BONUS_CLAIM_COMPLETED` | Bonus Claim Completed | `189927275564631964` |
| `MAILERLITE_GROUP_REFUNDED` | Refunded | `189927280131180245` |
| `MAILERLITE_GROUP_BLOG_READERS` | Blog Readers | `189927285613135631` |
| `MAILERLITE_GROUP_QUIZ` | Quiz / Blind-Spot | `191751931239073670` |
| `MAILERLITE_GROUP_VIP_EARLY_READERS` | VIP / Early Readers | `191751933392848782` |
| `MAILERLITE_GROUP_CORE_NURTURE` | Core Nurture — Non-Buyers | `192794786755773469` |
| `MAILERLITE_GROUP_DIGITAL_DIRECTIVE_CUSTOMERS` | Digital Directive Customers | `192794787632383140` |

### Vercel execution steps — no deployment performed

1. Open Vercel → team **mike's projects** → project **website** → Settings → Environment Variables.
2. Filter each key above. Update or add the exact group ID for **Production** and **Preview**; use plain/encrypted project variables according to team policy. Group IDs are non-secret, but `MAILERLITE_API_KEY` must remain Sensitive and must never be copied into Git.
3. Confirm these launch variables also exist by **name only**: `LAUNCH_FULFILLMENT_ENABLED`, `LAUNCH_DRYRUN_TEST_EMAIL`, `LAUNCH_OWNER_EMAIL`, and `CRON_SECRET`.
4. Keep `LAUNCH_FULFILLMENT_ENABLED=false` through the November 23 dry run.
5. Save changes. Environment changes apply only to a new deployment; schedule the redeploy as a separate owner-approved action.
6. After redeploy, test only with approved test addresses and Stripe test mode. Do not run a live charge from this checklist.

The Vercel connector verified project `prj_SyCWL5ZUvAXol76cu1kc8WdsORMS`, production domain `curlscontemplation.beauty`, GitHub repo `miketui/Website`, branch `main`, and a READY production deployment. Its Zapier action could not list env metadata, so current live env-name presence remains dashboard verification rather than a completed claim.

## Supabase verification

- Canonical project reachable: `supabase-teal-prism` (`comfnluqjhnmbxfvvjeo`), `ACTIVE_HEALTHY`, `us-west-1`.
- Project URL matches the repository configuration: `https://comfnluqjhnmbxfvvjeo.supabase.co`.
- Commerce schema exists: 21 public tables, including `products` (15 rows), `prices` (16 rows), `purchases`, `download_events`, `webhook_events`, and intake tables. RLS is enabled on every listed public table.
- Six recorded migrations are present through `rls_and_index_hardening`.
- Storage is **not launch-ready**: `curls-deliverables`, `curls-free`, `private`, and `public` all currently contain zero objects.

No database or Storage mutation was performed. The repository Storage uploader and verifier were corrected to accept the modern server-only `SUPABASE_SECRET_KEY` while retaining the legacy `SUPABASE_SERVICE_ROLE_KEY` fallback. The verifier no longer requires an unrelated public anon/publishable key for its server-side bucket check. Upload remains blocked because the connector has no binary Storage-upload action and the required private files are not present in the repository.

## Resend verification

Zapier confirms the Resend account connection, but its domain action failed because the connector does not support the required authenticated domain-list request. Therefore Resend domain/DNS status is **BLOCKED / NOT RE-VERIFIED**. Existing repository documentation claiming “verified” is historical evidence, not evidence from this run.

Required dashboard acceptance criteria:

- `curlscontemplation.beauty` status is Verified.
- Sending is enabled.
- SPF and DKIM show passing; DMARC exists at the DNS provider.
- Sender `info@curlscontemplation.beauty` is allowed.
- One owner-approved transactional test arrives with correct From, Reply-To, links, and unsubscribe behavior where applicable.

## Rendered FELT pass

Playwright rendered the exact deployed commit locally at 1440 × 1000. `/`, `/preorder`, and `/pricing-kit` each returned 200 with no console errors, page errors, or horizontal overflow.

| Page | FELT gate | Three-anchor assessment | Findings |
|---|---|---|---|
| Home | **PASS WITH NOTES** | Recognition is immediate (“Beauty school taught you hair…”); relief is carried by the client story and reflection pause; authority/path is clear through Book → Journey → preorder. | Strong cinematic pacing and ACISS palette. The visible `paidlike` spacing defect was corrected in this branch. Initial book hero is intentionally restrained but very low contrast at full-page scale. Six images use empty alt text; confirm they are decorative. |
| `/preorder` | **PARTIAL** | Crown/achievement is strong; practical reassurance is clear; checkout path is direct. | “Working hands” is still a gradient placeholder rather than the required real emotional image/footage. Consent banner overlaps the upper page during capture but does not block checkout. |
| `/pricing-kit` | **PASS WITH NOTES** | Pain is named clearly; relief is the one-page/three-decision promise; action path is obvious. | Excellent clarity and hierarchy, but no checklist preview or other visual proof is present. The page feels more functional than immersive. |

Screenshots were generated as `home-felt-desktop.png`, `preorder-felt-desktop.png`, and `pricing-kit-felt-desktop.png` in the verification workspace. Production itself returned 403 to automated browsers, so no claim is made that these are production-domain captures.

## Executed repository fixes

- Added verified Instagram, TikTok, YouTube, and LinkedIn links to the footer.
- Corrected the visible home-page `paidlike` spacing defect.
- Re-anchored the final pre-launch cron from November 16 to **November 23 at 07:30 America/Los_Angeles** (`15:30 UTC`).
- Corrected stale July/November 17 comments.
- Added the missing launch dry-run and owner-email variable names to the production env template.
- Added `/website` as an immersive campaign entry backed by the existing `CinematicJourney`: 90 desktop + 90 mobile WebP frames (5.6 MB total), canvas depth, particles, scroll choreography, and reduced-motion/save-data/low-memory fallbacks.
- Added static regression coverage for `/website`, frame completeness and payload budgets, and motion accessibility gates.
- Updated Supabase upload/verification scripts for the current `SUPABASE_SECRET_KEY` naming and removed the unnecessary anon-key requirement from the server-side Storage verification path.

No PR was merged, no deployment was triggered manually, no email was sent, no charge was made, and no customer data was written.
