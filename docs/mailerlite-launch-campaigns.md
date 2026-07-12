# MailerLite production journeys — November 24, 2026

Authoritative copy: `docs/MAILERLITE-AUTOMATION-EMAIL-LIBRARY.md`, supplied July 12, 2026. The exact subjects, bodies, CTA destinations, and timing rules were loaded through the connected MailerLite account wherever its API permits.

## Canonical workflow inventory

| Workflow | Trigger group | MailerLite ID | Email count |
|---|---|---:|---:|
| Website Signups — Welcome & Orientation | Website Signups | `192795044280796190` | 2 |
| Pricing Confidence Kit — Delivery & Activation | Pricing Confidence Kit | `192795046686229893` | 3 |
| Core Nurture — Beyond the Craft | Core Nurture — Non-Buyers | `192795049449228005` | 5 |
| Quiz — Blind-Spot Follow-up | Quiz / Blind-Spot | `192795053311132895` | 3 |
| Preorders — Reservation & Reinforcement | Preorders | `192795055972419267` | 2 |
| Customers — Post-Purchase Onboarding | Customers | `192795058197497739` | 4 |
| Abandoned Checkout — Recovery | Abandoned Checkout | `192795061713372667` | 3 |
| Bonus Claim Started — Workbook Reminders | Bonus Claim Started | `192795267020358662` | 2 |
| Bonus Claim Completed — Access Active | Bonus Claim Completed | `192795274605758257` | 1 |
| Digital Daily Directives — Delivery & Use | Digital Directive Customers | `192795281369073567` | 4 |

The source describes nine funnels. There are ten workflow records because Bonus Claim Started and Bonus Claim Completed are distinct triggers and cannot safely share one linear workflow.

## Fixed-date preorder sends

These are scheduled campaigns because relative automation delays would send late to customers who preorder closer to launch:

| Send | Campaign ID | Scheduled |
|---|---:|---|
| One month until Curls & Contemplation | `192795454682957112` | October 25, 2026 at 09:00 account time |
| One week until release | `192795457777304695` | November 17, 2026 at 09:00 account time |
| Tomorrow, the journey begins | `192795460957636199` | November 23, 2026 at 09:00 account time |

All three are in MailerLite `ready` status and target only the Preorders group.

## Forms and personalization

Created embedded, double-opt-in forms:

- Subscription Intake — `192794813012116816`.
- Pricing Confidence Kit — `192794813955835273`.
- Blind-Spot Quiz Capture — `192794814849222306`.

Created fields: professional role, career stage, primary interest, marketing consent source, product type, product name, order status, order number, five quiz-result fields, and customer portal URL.

Created groups:

- Core Nurture — Non-Buyers — `192794786755773469`.
- Digital Directive Customers — `192794787632383140`.

The retired Free Chapter group is named `ARCHIVED — Free Chapter (Do Not Use)`. Nine obsolete/duplicate draft automations were deleted.

## Provider limitation and activation

MailerLite’s connected API can create triggers, delays, subjects, forms, groups, fields, and campaigns, but it explicitly cannot create the visual HTML design for an automation email. An automation with undesigned email steps is marked incomplete and MailerLite will not activate it. The connector also exposes no supported activation action.

Therefore the three fixed-date campaigns are scheduled and live, while each trigger-based workflow needs its automation emails opened in the MailerLite editor, designed using the approved source copy, and switched on. Do not change the subjects, timing, URLs, sender, or reply-to during that dashboard step.

Sender: `Michael David | Curls & Contemplation <info@curlscontemplation.beauty>`
Reply-to: `info@curlscontemplation.beauty`

Launch-day secure book delivery remains a Resend transaction initiated by the website on November 24 after the canonical EPUB is uploaded. It is not a MailerLite marketing send.
