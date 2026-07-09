# Deploy Notes — 2026-07-09 rebuild

## Production env (Vercel) — copy-paste EXACTLY, never retype
Stripe price IDs contain the letter **O** (as in Oscar), never the digit 0:

```
STRIPE_PRICE_ID_PREORDER=price_1ToQ4BBOxLp64xG9mG2dFSsf
STRIPE_PRICE_ID_REGULAR=price_1TrNBhBOxLp64xG9IjkIvgxk
STRIPE_PRICE_ID_CARD_DECK=price_1ToQ4KBOxLp64xG99tvKXRqA
STRIPE_PRICE_ID_WORKBOOK=price_1ToQ4OBOxLp64xG9vEvykPlw
```

(2026-07-09 incident: PREORDER was entered with a zero — `…BB0xLp…` — producing
`resource_missing` 502s. The account segment is `BOxLp64xG9`, letter O.)

`STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` come from Stripe account
`acct_1TVfhuBOxLp64xG9` (the migrated account). Any env change requires a redeploy.

## MailerLite group IDs (all 11, verified live)
SUBSCRIBERS 182303148544623709 · FREE_CHAPTER 189927249078650673 ·
PREORDERS 189927254041560661 · CUSTOMERS 189927259391395798 ·
ABANDONED_CHECKOUT 189927264762202014 · BONUS_CLAIM_STARTED 189927270563972991 ·
BONUS_CLAIM_COMPLETED 189927275564631964 · REFUNDED 189927280131180245 ·
BLOG_READERS 189927285613135631 · QUIZ 191751931239073670 ·
VIP_EARLY_READERS 191751933392848782

## Storage (Supabase jmfbosczwbfugbjsshwf)
- curls-free/chapter-1/Curls-Ch1-Excerpt.pdf ✅ seeded
- curls-deliverables/workbook/Idea-to-Action-Workbook.pdf ✅ seeded
- curls-deliverables/books/…/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub ❌ pending owner upload
- curls-deliverables/cards/Affirmation-Deck-v1.pdf ❌ pending deck build
