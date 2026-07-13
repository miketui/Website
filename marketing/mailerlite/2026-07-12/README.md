# MailerLite Copy/Paste-Ready Package

Prepared July 12, 2026. Contains 25 complete HTML emails: 22 automation messages plus the three scheduled preorder campaigns.

## Global setup

- From name: `MD` (approved)
- From email: `info@curlscontemplation.beauty`
- Reply-to: `info@curlscontemplation.beauty`
- Keep every replacement workflow inactive until design, preview, dry-run, and owner approval are complete.
- Paste each HTML file into MailerLite's Custom HTML editor or import it as the message source.
- Copy the exact subject and preheader from `setup-matrix.csv`.
- Keep MailerLite's required footer block enabled so the account postal address auto-populates. Each HTML file also contains working `{$unsubscribe}` and `{$preferences}` links.
- Do not paste a public URL for paid files. Workbook/card buttons point to authenticated website routes.
- The Pricing Kit button points to the new public Detailed Pricing Guide path. It will work after the prepared Supabase bundle is uploaded.
- Quiz messages use verified fields: `{$quiz_result_name}`, `{$quiz_result_summary}`, `{$quiz_strength}`, `{$quiz_risk}`, `{$quiz_next_step}`, and new `{$quiz_result_url}`.

## Migration order

1. Open the corresponding `FIXED DRAFT ... DO NOT ENABLE` automation.
2. Select the email step and set internal name, subject, preheader, sender, and reply-to from the matrix.
3. Paste/import the matching HTML file. Confirm MailerLite reports the unsubscribe requirement satisfied.
4. Preview with a test profile containing all merge fields. Verify every button and footer link.
5. Run MailerLite's dry-run tool. Send a test only to an owner-approved address.
6. Activate the replacement only after every email in that workflow passes; keep the old workflow paused until the replacement is confirmed.
7. Archive/delete old workflows only under a separate explicit cleanup approval.

## Email index

| Email | Internal name | Timing | Subject | Preheader | File |
|---|---|---|---|---|---|
| 2.1 | Kit delivery | Immediately | `Your Pricing Confidence Kit is ready` | A practical first step toward pricing with clarity, not apology. | `html/email-2.1-kit-delivery.html` |
| 2.2 | Activation prompt | 1 day later | `Before you change your prices, answer this` | The number is rarely the whole problem. | `html/email-2.2-activation-prompt.html` |
| 2.3 | Bridge to paid offer | 3 days later | `Your talent needs a structure that can hold it` | Skill can open the door. Structure helps you remain in the room. | `html/email-2.3-bridge-to-paid-offer.html` |
| 4.1 | Personalized result | Immediately | `Your creative-career blind spot: {$quiz_result_name}` | This is not a flaw. It is a pattern you can work with. | `html/email-4.1-personalized-result.html` |
| 4.2 | Pattern interruption | 2 days later | `Your blind spot usually appears before the decision` | Notice the moment the pattern begins — not only the consequence. | `html/email-4.2-pattern-interruption.html` |
| 4.3 | Book bridge | 3 days later | `What changes when you can finally see the pattern?` | Awareness creates a choice where habit once decided. | `html/email-4.3-book-bridge.html` |
| 5.1 | Preorder welcome | Immediately after payment | `Your Curls & Contemplation preorder is confirmed` | Your launch-day access is reserved for November 24, 2026. | `html/email-5.1-preorder-welcome.html` |
| 5.2 | Emotional reinforcement | 2 days later | `You did not simply preorder a book` | You reserved time for a more intentional conversation with your career. | `html/email-5.2-emotional-reinforcement.html` |
| 5.3 | Thirty-day countdown | October 25, 2026 | `One month until Curls & Contemplation` | Your digital edition and preorder workbook arrive November 24. | `html/email-5.3-thirty-day-countdown.html` |
| 5.4 | Seven-day countdown | November 17, 2026 | `One week until release` | Your reserved access goes live Tuesday, November 24. | `html/email-5.4-seven-day-countdown.html` |
| 5.5 | Tomorrow reminder | November 23, 2026 | `Tomorrow, the journey begins` | Your digital edition and workbook arrive on November 24. | `html/email-5.5-tomorrow-reminder.html` |
| 6.1 | Reader welcome | 1 day after access becomes active | `A quiet way to begin Curls & Contemplation` | You do not need to rush through a journey designed for reflection. | `html/email-6.1-reader-welcome.html` |
| 6.2 | Integration prompt | 3 days later | `Do not turn reflection into another performance` | The goal is an honest answer, not an impressive one. | `html/email-6.2-integration-prompt.html` |
| 6.3 | Workbook guidance or offer | 7 days later | `Give the insight somewhere to live` | Reflection becomes more useful when it can become a decision, practice, or plan. | `html/email-6.3-workbook-guidance-or-offer.html` |
| 6.4 | Feedback and advocacy | 14 days later | `What is staying with you?` | Your response can help shape how this work continues. | `html/email-6.4-feedback-and-advocacy.html` |
| 7.1 | Gentle reminder | 1 hour after abandonment | `Your Curls & Contemplation checkout is still open` | Return when you are ready — your place was not lost. | `html/email-7.1-gentle-reminder.html` |
| 7.2 | Objection handling | 24 hours later | `A few details before you decide` | Release date, delivery, workbook access, and what your preorder includes. | `html/email-7.2-objection-handling.html` |
| 7.3 | Final recovery | 72 hours after abandonment | `Should I close the loop?` | One final link to complete your order, with no pressure to continue. | `html/email-7.3-final-recovery.html` |
| 8.1 | Incomplete claim reminder | 2 hours after Bonus Claim Started | `Finish activating your included workbook` | Your preorder benefit is waiting in your customer portal. | `html/email-8.1-incomplete-claim-reminder.html` |
| 8.2 | Second claim reminder | 24 hours later if still incomplete | `Your preorder workbook is still unclaimed` | Complete the final step so it appears in your library. | `html/email-8.2-second-claim-reminder.html` |
| 8.3 | Claim completed | Immediately after Bonus Claim Completed | `Your workbook access is active` | The digital workbook has been added to your customer library. | `html/email-8.3-claim-completed.html` |
| 9.1 | Cards delivery | Immediately after payment | `Your Digital Daily Directive cards are ready` | Open your set and choose the directive that meets you today. | `html/email-9.1-cards-delivery.html` |
| 9.2 | Usage ritual | 1 day later | `A three-minute ritual for your directive cards` | Read. Reflect. Respond. | `html/email-9.2-usage-ritual.html` |
| 9.3 | Habit reinforcement | 4 days later | `Do not collect affirmations — practice one` | The value is not in how many cards you read. | `html/email-9.3-habit-reinforcement.html` |
| 9.4 | Bundle upsell or owner feedback | 10 days later | `Ready for the complete 12-set collection?` | Expand your directive library or share how you are using the collection. | `html/email-9.4-bundle-upsell-or-owner-feedback.html` |
