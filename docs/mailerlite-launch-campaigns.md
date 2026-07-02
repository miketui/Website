# Launch-reminder campaigns — paste-ready (blocked only on MailerLite domain auth)

MailerLite rejects campaign senders until a custom business domain is authenticated.
**First:** MailerLite dashboard → Settings → Domains → authenticate `curlscontemplation.beauty` (add the DKIM/SPF records it shows to your DNS). Then create these two campaigns exactly as below.

Also included: the Post-Purchase email (the API can't edit that automation while it's active — toggle it OFF in the dashboard first, then paste this in, then re-enable).

---

## Campaign 1 — T-7
- **Name:** Launch T-7 — One week until your book arrives
- **To:** group `Preorders` (189927254041560661)
- **From:** Michael David · Curls & Contemplation `<info@curlscontemplation.beauty>` · Reply-to `support@curlscontemplation.beauty`
- **Schedule:** Tuesday **November 10, 2026, 9:00 AM ET**
- **Subject:** One week. Your book arrives automatically.

> One week from today — Tuesday, November 17 — the complete digital edition of **Curls & Contemplation** lands in this inbox automatically. You don't need to do anything: the download link arrives launch morning, tied to this email address.
>
> Two useful things while you wait:
>
> 1. If your inbox filters aggressively, add *delivery@curlscontemplation.beauty* to your contacts now so launch morning goes smoothly.
> 2. If you haven't re-read Chapter 1 since you preordered, it's a good week for it — the book picks up exactly where it leaves off.
>
> One more note from me the day before launch, then the book itself.
>
> — Michael David
> curlscontemplation.beauty

## Campaign 2 — T-24h
- **Name:** Launch T-24h — Tomorrow morning
- **To:** group `Preorders` (189927254041560661)
- **From/Reply-to:** same as above
- **Schedule:** Monday **November 16, 2026, 9:00 AM ET**
- **Subject:** Tomorrow morning, this inbox.

> Tomorrow is launch day.
>
> Sometime after 10:00 AM ET on November 17, an email from *delivery@curlscontemplation.beauty* arrives with your download link for the complete digital edition — all sixteen chapters, every worksheet. The link is yours for 30 days, and after that the book stays available any time from your dashboard at curlscontemplation.beauty.
>
> Nothing to do tonight except maybe clear twenty minutes for tomorrow. Chapter II is where the map starts moving.
>
> If the email hasn't arrived by noon ET, check spam first, then just reply here — a person answers.
>
> Thank you for betting on this book early. It mattered.
>
> — Michael David

## Post-Purchase Onboarding email (for automation 191755296825148903)
**Steps:** dashboard → Automations → "Customers — Post-Purchase Onboarding (DRAFT)" → toggle **OFF** → edit email 1 → paste below → re-enable.
- **Subject:** You're in. Here's exactly what happens between now and November 17.

> Thank you — genuinely. Preordering a first book from an independent author is a bet on a person, and I don't take it lightly.
>
> So here's the whole plan, no mystery:
>
> **Now:** your receipt is already in your inbox, and your purchase is locked to your email.
>
> **November 17, launch morning:** the full book lands in this inbox automatically — a download link for the complete digital edition. No waiting on me to press send; the system does it the moment launch opens.
>
> **Between now and then:** I'll send a short note the week before launch so you know it's coming, and one the day before. That's it. No daily hype.
>
> If anything looks wrong at any point — wrong email, no receipt, questions about the files — just reply to this message. A person answers.
>
> Read the free chapter again tonight if you want a head start: curlscontemplation.beauty/free-chapter
>
> — Michael David

---

### What's already live in MailerLite (built this session, all INACTIVE until you enable)
- **Free Chapter — 7-Email Nurture** (id 191865358033880537): 7 emails / 6 delays over ~11 days, full copy loaded. Review → enable.
- **Quiz — Blind-Spot Result Nurture** (id 191865519800845919): 3 emails / 2 delays, full copy loaded. Review → enable **when the quiz funnel activates**.
- **Abandoned Checkout +24h** (existing draft, id 191755291758430199): email copy now loaded. Review → enable.
- Old 1-step "Free Chapter — Welcome (DRAFT)" (id 191755283433785235) is superseded by the 7-email nurture — recommend deleting to avoid double-sends.
