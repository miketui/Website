# MailerLite Replacement Migration — July 12, 2026

## Outcome

Eight structurally corrected replacement workflows were created through the connected MailerLite app. Every replacement is inactive (`enabled: false`), has the intended live group trigger, and has its complete parent-chain order re-read after creation. No workflow was activated, no message was sent, no subscriber was added, and the old workflows remain paused.

| Flow | New inactive automation | Verified parent-chain order |
|---|---:|---|
| 2 — Pricing Kit | `192829194505291071` | Kit → 1d → pricing question → 3d → talent/structure |
| 4 — Quiz | `192829198284359504` | personalized result → 2d → pattern → 3d → book bridge |
| 5 — Preorders | `192829201493001563` | confirmation → 2d → reinforcement |
| 6 — Customers | `192829203885852588` | 1d → welcome → 3d → reflection → 7d → workbook → 14d → feedback |
| 7 — Abandoned Checkout | `192829208307696992` | 1h → reminder → 23h → details → 48h → final |
| 8A — Claim Started | `192829212186380173` | 2h → reminder 1 → 22h → reminder 2 |
| 8B — Claim Completed | `192829215088837803` | access-active email immediately |
| 9 — Daily Directives | `192829216933283343` | delivery → 1d → ritual → 3d → practice → 6d → bundle/feedback |

## Copy/paste package

`MailerLite-Copy-Paste-Ready-20260712.zip` contains:

- 22 complete automation-message HTML files;
- the three scheduled campaign HTML files;
- an exact setup matrix containing internal name, subject, preheader, sender, reply-to, timing, button label, destination, and target draft/campaign;
- a migration README.

Every HTML file contains branded CTA markup, a hidden preheader, `{$name|default('there')}`, `{$unsubscribe}`, and `{$preferences}`. The quiz templates use verified live result fields plus the newly created `quiz_result_url` field (`1378106`). The website now populates all quiz result fields at capture time.

## One-time dashboard procedure

1. Keep both old and replacement workflows paused.
2. Open one new `FIXED DRAFT ... DO NOT ENABLE` workflow.
3. For each email step, copy the internal name, subject, preheader, sender, and reply-to from `setup-matrix.csv`.
4. Paste/import the matching HTML file. Keep MailerLite's required account footer enabled so the postal address auto-populates; the template already includes additional unsubscribe and preference links.
5. Preview using a test profile. For the Quiz flow, populate every quiz field and confirm the dynamic result URL.
6. Run the MailerLite dry-run. A real test send requires an owner-approved recipient.
7. Confirm conditions/exits in the dashboard: paid/refunded exit Abandoned Checkout, completed claims exit 8A, and bundle owners do not receive the flow-9 upsell.
8. Activate only the replacement workflow after every step passes. Do not reactivate the old workflow.
9. Leave the old workflow paused through a monitoring window. Archive/delete it only under a separate explicit cleanup approval.

## Acceptance

- Internal names, subjects, HTML bodies, preheaders, sender, and reply-to align.
- All buttons resolve; paid files route through authenticated website pages.
- Unsubscribe and preferences work, and the required physical-address footer remains present.
- Personalization renders without bracket placeholders.
- Timing matches the parent-chain table above.
- Replacement is enabled only after the old workflow is confirmed paused.
