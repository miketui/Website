# MailerLite launch setup — November 24, 2026

MailerLite does **not** need nine automations. Groups are segmentation labels; automations are the small number of journeys triggered by those labels. Duplicating an automation for every group would increase double-send risk.

## Canonical automation set

| Automation | Trigger group | State now | Purpose |
|---|---|---|---|
| Pricing Confidence Kit nurture | `Pricing Confidence Kit` (`192789958246794286`) | Build, review, then enable | Deliver checklist immediately; 5–7 useful notes; bridge to preorder |
| Customer onboarding | `Customers` (`189927259391395798`) | Build, review, then enable | Receipt expectations, protected account, workbook access, support path |
| Abandoned checkout | `Abandoned Checkout` (`189927264762202014`) | Build, review, then enable | One reminder after 24 hours; no pressure sequence |
| Launch-day EPUB delivery | `Preorders` (`189927254041560661`) | Keep disabled until November 24 | Send the canonical EPUB link on launch morning after the file and dry run pass |

The quiz group can have a short worksheet follow-up sequence after quiz delivery is verified. It is a fifth optional journey, not one of nine required launch automations.

## Required groups

- `Pricing Confidence Kit` — created July 12, 2026; ID `192789958246794286`.
- `Preorders` — ID `189927254041560661`.
- `Customers` — ID `189927259391395798`.
- `Abandoned Checkout` — ID `189927264762202014`.
- `Refunded` — ID `189927280131180245`.
- `Quiz / Blind-Spot` — ID `191751931239073670`.

Other existing groups may remain for reporting and future segmentation, but they do not each need an automation.

## Dates and sender

- Launch: Tuesday, **November 24, 2026**.
- Recommended sender: `Michael David · Curls & Contemplation <info@curlscontemplation.beauty>`.
- Reply-to: `support@curlscontemplation.beauty`.
- Authenticate the sending domain with MailerLite before enabling any sequence.

## Safety gate

Do not enable the launch-day delivery automation until the EPUB exists at the locked private path, a signed URL is generated successfully, and a dry-run email reaches the owner inbox. The EPUB is intentionally absent today.
