Curls & Contemplation — MailerLite Automation Email Library

**Prepared for:** Michael David
**Launch date:** Tuesday, November 24, 2026
**Primary sender:** Michael David | Curls & Contemplation
**Reply-to:** info@curlscontemplation.beauty

## Connected-account audit

The connected MailerLite account currently contains 12 subscriber groups and 9 draft automations. The audit found 3 subscribers in Website Signups and 0 in the remaining groups. The existing automation email steps contain no usable subject lines or body copy. Multiple drafts are duplicated or still reference the retired Free Chapter offer. No automation was activated, edited, deleted, or sent during the audit.

| Group | Subscribers | Decision | Purpose |
|---|---:|---|---|
| Website Signups | 3 | KEEP | General opt-in entry point. |
| Pricing Confidence Kit | 0 | KEEP | Approved lead-magnet group. |
| Preorders | 0 | KEEP | Paid preorder customers. |
| Customers | 0 | KEEP | Paid customers with active entitlement. |
| Abandoned Checkout | 0 | KEEP | Checkout recovery; always exclude paid customers. |
| Bonus Claim Started | 0 | KEEP | Workbook/bonus claim started but not completed. |
| Bonus Claim Completed | 0 | KEEP | Workbook/bonus access completed. |
| Refunded | 0 | KEEP / SUPPRESS | Operational status; exclude from sales automations. |
| Quiz / Blind-Spot | 0 | KEEP | Quiz follow-up segment. |
| VIP / Early Readers | 0 | KEEP AS SEGMENT | Use for targeted campaigns, not a core automation yet. |
| Blog Readers | 0 | KEEP AS SEGMENT | Use for content-interest segmentation. |
| Free Chapter | 0 | ARCHIVE / DO NOT USE | Retired offer; replaced by Pricing Confidence Kit. |

## Locked commercial facts

- Digital-edition preorder: $17.99
- Official release: Tuesday, November 24, 2026
- Preorder includes the digital workbook at no additional cost.
- Post-launch digital edition: $19.99
- Post-launch workbook: $19.99 separately unless explicitly bundled.
- Digital Daily Directive individual set: $7.99
- Complete 12-set digital bundle: $59
- Do not upload or deliver the EPUB before launch.
- Marketing copy must sell the transformation without revealing protected chapter, worksheet, quiz, or internal book content.

## Placeholder map

| Placeholder | Use |
|---|---|
| [FIRST NAME] | Subscriber first name; use a fallback such as “there.” |
| [PRICING KIT LINK] | Secure or public download link for The Stylist’s 10-Minute Pricing Confidence Kit. |
| [ORDER LINK] | Canonical state-aware order page. |
| [CHECKOUT RECOVERY LINK] | Restored Stripe checkout or order page. |
| [CUSTOMER PORTAL LINK] | Authenticated customer library/orders page. |
| [BOOK ACCESS LINK] | Secure, expiring book access link sent by Resend. |
| [WORKBOOK ACCESS LINK] | Secure workbook download or claim link. |
| [CARDS ACCESS LINK] | Secure Digital Daily Directive Affirmation Cards library/download link. |
| [QUIZ RESULT NAME] | Stored quiz-result label. |
| [QUIZ RESULT SUMMARY] | One-sentence personalized result summary. |
| [QUIZ STRENGTH] | Personalized strength statement. |
| [QUIZ RISK] | Personalized blind-spot statement. |
| [QUIZ NEXT STEP] | Personalized next action. |
| [SUPPORT LINK] | Contact/support page or mailto link. |
| [FEEDBACK LINK] | Reader/customer feedback form. |

## Global sender and build rules

- From name: Michael David | Curls & Contemplation
- Reply-to: info@curlscontemplation.beauty
- Use one primary CTA per message. Secondary links should be text links unless operationally necessary.
- Use a first-name fallback such as “there.”
- Add the required physical mailing address and unsubscribe footer through MailerLite.
- Use conditions and exit rules so buyers do not receive abandoned-cart or non-buyer sales messages.
- Secure order, access, refund, and delivery messages belong in Resend; MailerLite handles consent-based marketing and lifecycle education.

# Automation 1: Website Signups — Welcome & Orientation

**Trigger:** Subscriber joins Website Signups and has marketing consent.
**Goal:** Confirm the relationship, establish the brand promise, and direct the subscriber toward the Pricing Confidence Kit or book journey.
**Exclusions / exit rules:** Unsubscribed, Refunded, suppressed, or already in Customers when the message is purchase-focused.

## Email 1.1 — Welcome to the journey

**Timing:** Immediately
**Subject:** Welcome to Curls & Contemplation
**Preview text:** Beyond the craft. Into the calling.
**Button:** Begin Here
**Destination:** [PRICING KIT LINK]

Hi [FIRST NAME],

Welcome to Curls & Contemplation.

This space was created for hairstylists who know their work is more than what appears in the final image. It is for the artist behind the artistry — the person carrying the preparation, pressure, growth, business decisions, self-doubt, ambition, and vision that the outside world rarely sees.

You will receive practical tools, thoughtful guidance, launch updates, and invitations designed to help you build a creative career with greater clarity, structure, and self-respect.

A strong place to begin is The Stylist’s 10-Minute Pricing Confidence Kit. It will help you examine the value, labor, and structure behind your pricing without forcing you into someone else’s formula.

[BUTTON: Begin Here]

Curls & Contemplation arrives Tuesday, November 24, 2026.

With intention,
Michael David

---

## Email 1.2 — What this space will never ask you to become

**Timing:** 2 days later
**Subject:** You do not have to become less creative to become more secure
**Preview text:** Structure is not the enemy of artistry.
**Button:** Explore the Book
**Destination:** [ORDER LINK]

Hi [FIRST NAME],

There is a false choice many creatives are taught to accept: either remain fully devoted to the art or become “business-minded” enough to survive.

You should not have to choose.

Structure can protect your creativity. Clear boundaries can preserve your energy. Better systems can make room for stronger work. Financial awareness can support experimentation instead of shrinking it.

Curls & Contemplation was created from that belief. It is not a demand to abandon the artist you are. It is an invitation to build a life and career capable of holding that artist more fully.

The digital edition is available for preorder for $17.99 and releases Tuesday, November 24, 2026. Preorder customers receive the digital workbook at no additional cost.

[BUTTON: Explore the Book]

With intention,
Michael David

---

# Automation 2: Pricing Confidence Kit — Delivery & Activation

**Trigger:** Subscriber joins Pricing Confidence Kit.
**Goal:** Deliver the approved lead magnet, prompt immediate use, and transition engaged subscribers into the broader nurture journey.
**Exclusions / exit rules:** Do not re-enroll someone who has already completed this automation unless they explicitly request the resource again.

## Email 2.1 — Kit delivery

**Timing:** Immediately
**Subject:** Your Pricing Confidence Kit is ready
**Preview text:** A practical first step toward pricing with clarity, not apology.
**Button:** Download Your Kit
**Destination:** [PRICING KIT LINK]

Hi [FIRST NAME],

Your copy of The Stylist’s 10-Minute Pricing Confidence Kit is ready.

This is not a generic “raise your prices” worksheet. It is a short, focused tool designed to help you identify what your current pricing is actually carrying — your time, preparation, tools, education, administration, recovery, creative labor, and the standard of care attached to your name.

Set aside ten quiet minutes. Answer honestly. You do not need to solve your entire business today; you only need a clearer view of what is true.

[BUTTON: Download Your Kit]

Keep this email so you can return to the resource whenever your services, costs, or career direction change.

With intention,
Michael David

P.S. Curls & Contemplation releases Tuesday, November 24, 2026. I will share thoughtful updates as the journey continues.

---

## Email 2.2 — Activation prompt

**Timing:** 1 day later
**Subject:** Before you change your prices, answer this
**Preview text:** The number is rarely the whole problem.
**Button:** Reopen the Kit
**Destination:** [PRICING KIT LINK]

Hi [FIRST NAME],

Before changing a single number, ask yourself one question:

What must my work pay for — beyond the visible service?

Your rate is carrying more than appointment time. It may also be carrying preparation, travel, product, equipment, communication, revisions, cleanup, continuing education, administrative work, creative direction, physical recovery, and the reputation you have spent years building.

When those realities remain unnamed, pricing can begin to feel emotional, arbitrary, or apologetic. Naming them does not automatically determine the final price, but it gives you a stronger foundation for deciding.

Return to the Pricing Confidence Kit and review the places where you minimized, omitted, or absorbed costs without acknowledging them.

[BUTTON: Reopen the Kit]

Clarity first. Then strategy.

Michael David

---

## Email 2.3 — Bridge to paid offer

**Timing:** 3 days later
**Subject:** Your talent needs a structure that can hold it
**Preview text:** Skill can open the door. Structure helps you remain in the room.
**Button:** Preorder the Digital Edition
**Destination:** [ORDER LINK]

Hi [FIRST NAME],

Talent matters. Taste matters. Technique matters.

But a sustainable creative career also requires something less visible: a structure capable of supporting the person doing the work.

That means understanding your value without turning every decision into a referendum on your worth. It means creating boundaries that protect both the relationship and the result. It means building systems that reduce chaos without flattening your creativity.

Curls & Contemplation was written for that deeper work — the space between what you create and how you are able to keep creating.

The digital edition is available for preorder for $17.99. It releases Tuesday, November 24, 2026, and preorder customers receive the digital workbook at no additional cost.

[BUTTON: Preorder the Digital Edition]

Beyond the craft. Into the calling.

Michael David

---

# Automation 3: Core Nurture — Beyond the Craft

**Trigger:** Subscriber completes the welcome or Pricing Confidence Kit sequence and is not in Preorders or Customers.
**Goal:** Build trust through transformation-focused storytelling and invite the subscriber to preorder without revealing protected book content.
**Exclusions / exit rules:** Preorders, Customers, Refunded, unsubscribed, or anyone currently in an abandoned-checkout sequence.

## Email 3.1 — The unseen career

**Timing:** 1 day after entry
**Subject:** The final image never tells the whole story
**Preview text:** There is always a person behind the polish.
**Button:** Read the Book Story
**Destination:** [ORDER LINK]

Hi [FIRST NAME],

A finished look can appear effortless.

The image does not show the early call time, the preparation, the revisions, the pressure, the physical demand, the quiet self-correction, the emotional intelligence, or the choices made in seconds that took years to learn.

Creative work is often celebrated only after its complexity has been hidden.

Curls & Contemplation begins with respect for the person behind the polish. It asks what becomes possible when the stylist’s inner life, business decisions, creative identity, and long-term well-being are treated as part of the work — not as distractions from it.

You deserve more than visibility for the result. You deserve a career designed with equal care for the person creating it.

[BUTTON: Read the Book Story]

With intention,
Michael David

---

## Email 3.2 — Permission to want more

**Timing:** 2 days later
**Subject:** You can love the craft and still need more from the career
**Preview text:** Gratitude and ambition can exist together.
**Button:** Explore Curls & Contemplation
**Destination:** [ORDER LINK]

Hi [FIRST NAME],

Loving what you do does not require pretending that every part of the career is working.

You can be grateful for the opportunities and still want stronger boundaries. You can honor the people who taught you and still choose a different path. You can appreciate your progress and still admit that survival mode is no longer enough.

That tension is not disloyalty. It is information.

Sometimes the next stage of a creative life begins when you stop asking, “Should I be satisfied?” and begin asking, “What would make this sustainable, honest, and aligned?”

Curls & Contemplation is an invitation into that question — without asking you to abandon your artistry or become someone unrecognizable to yourself.

[BUTTON: Explore Curls & Contemplation]

Michael David

---

## Email 3.3 — Reframing structure

**Timing:** 3 days later
**Subject:** Structure can be an act of self-respect
**Preview text:** A system should support your artistry, not suffocate it.
**Button:** Reserve Your Copy
**Destination:** [ORDER LINK]

Hi [FIRST NAME],

Many creatives resist structure because they have only experienced it as control: rigid expectations, narrow definitions of success, or systems built without their reality in mind.

But the right structure feels different.

It protects time. It clarifies decisions. It makes follow-through easier. It creates evidence when emotion becomes loud. It helps you distinguish between a temporary challenge and a pattern that requires change.

Most importantly, structure can return energy to the art by reducing the number of avoidable fires surrounding it.

The goal is not to become mechanical. The goal is to stop asking your creativity to carry responsibilities that better systems should hold.

The digital edition of Curls & Contemplation is available for preorder for $17.99.

[BUTTON: Reserve Your Copy]

With intention,
Michael David

---

## Email 3.4 — Brand promise

**Timing:** 3 days later
**Subject:** Beyond the craft. Into the calling.
**Preview text:** The next chapter of your career may require a deeper conversation.
**Button:** Enter the Journey
**Destination:** [ORDER LINK]

Hi [FIRST NAME],

Technique can teach you how to execute.

Experience can teach you how to adapt.

But there comes a point when the question becomes larger than how well you can perform the work. You begin asking what the work is building, what it is costing, what it is teaching, and who you are becoming through it.

That is the threshold behind Curls & Contemplation.

It is a reflective, practical journey for stylists who are ready to look beyond the immediate assignment and toward the career, identity, and legacy taking shape underneath it all.

No spoilers. No borrowed blueprint. No demand that your path resemble anyone else’s.

Only a more intentional conversation between the craft you have developed and the calling you are still defining.

[BUTTON: Enter the Journey]

Michael David

---

## Email 3.5 — Direct preorder invitation

**Timing:** 3 days later
**Subject:** Reserve Curls & Contemplation for November 24
**Preview text:** Preorder the digital edition for $17.99 and receive the workbook at no additional cost.
**Button:** Preorder for $17.99
**Destination:** [ORDER LINK]

Hi [FIRST NAME],

Curls & Contemplation releases Tuesday, November 24, 2026.

The digital edition is now available for preorder for $17.99. Your preorder reserves launch-day access and includes the digital workbook at no additional cost.

This book is for the stylist who is ready to move beyond reacting to the next opportunity and begin shaping a career with greater intention. It honors the artistry while making room for the systems, reflection, self-trust, and long-term thinking required to sustain it.

Your secure access will be delivered automatically on release day. You will not need to return to checkout or request the files manually.

[BUTTON: Preorder for $17.99]

Thank you for considering this journey.

With intention,
Michael David

---

# Automation 4: Quiz — Blind-Spot Follow-up

**Trigger:** Subscriber joins Quiz / Blind-Spot with result fields populated.
**Goal:** Deliver a useful personalized result, deepen reflection, and guide the subscriber toward the book.
**Exclusions / exit rules:** Do not send until [QUIZ RESULT NAME], [QUIZ RESULT SUMMARY], [QUIZ STRENGTH], [QUIZ RISK], and [QUIZ NEXT STEP] are populated.

## Email 4.1 — Personalized result

**Timing:** Immediately
**Subject:** Your creative-career blind spot: [QUIZ RESULT NAME]
**Preview text:** This is not a flaw. It is a pattern you can work with.
**Button:** See Your Next Step
**Destination:** [QUIZ RESULTS PAGE]

Hi [FIRST NAME],

Your result is: [QUIZ RESULT NAME].

[QUIZ RESULT SUMMARY]

The strength inside this pattern is [QUIZ STRENGTH]. That quality has likely helped you navigate pressure, create opportunities, or maintain momentum when circumstances were uncertain.

The risk is [QUIZ RISK]. A strength becomes a blind spot when it begins making decisions automatically — especially when the cost is your energy, clarity, compensation, or creative direction.

Your next step is simple: [QUIZ NEXT STEP].

Do not treat this result as a label. Use it as a mirror. The purpose is not to judge the pattern; it is to notice when the pattern is choosing for you.

[BUTTON: See Your Next Step]

With intention,
Michael David

---

## Email 4.2 — Pattern interruption

**Timing:** 2 days later
**Subject:** Your blind spot usually appears before the decision
**Preview text:** Notice the moment the pattern begins — not only the consequence.
**Button:** Review Your Result
**Destination:** [QUIZ RESULTS PAGE]

Hi [FIRST NAME],

Most blind spots do not announce themselves as mistakes.

They often arrive as familiar thoughts: “I should just make it work.” “This opportunity may not come again.” “I do not want to seem difficult.” “I will deal with the details later.”

By the time the consequence appears, the pattern has already shaped the decision.

This week, notice the sentence that tends to appear immediately before you overextend, underprice, avoid a conversation, abandon a plan, or say yes without enough information.

That sentence is valuable data. Write it down. Then ask: What would I choose if I did not have to obey this thought automatically?

Your result is not the end of the assessment. It is the beginning of a more conscious response.

[BUTTON: Review Your Result]

Michael David

---

## Email 4.3 — Book bridge

**Timing:** 3 days later
**Subject:** What changes when you can finally see the pattern?
**Preview text:** Awareness creates a choice where habit once decided.
**Button:** Explore the Digital Edition
**Destination:** [ORDER LINK]

Hi [FIRST NAME],

Awareness does not solve everything instantly, but it creates something essential: a choice.

Once you can see the pattern, you can begin building a different response around it. That may look like a pricing rule, a preparation checklist, a boundary, a decision deadline, a recovery practice, or a clearer definition of what an aligned opportunity actually means to you.

Curls & Contemplation was created to support that kind of intentional career-building — practical enough to use, reflective enough to meet the person behind the professional identity.

The digital edition releases Tuesday, November 24, 2026. Preorder access is $17.99 and includes the digital workbook at no additional cost.

[BUTTON: Explore the Digital Edition]

Beyond the craft. Into the calling.

Michael David

---

# Automation 5: Preorders — Reservation & Countdown

**Trigger:** Successful Stripe preorder adds subscriber to Preorders.
**Goal:** Reassure the buyer, clarify delivery, strengthen anticipation, and reduce support questions before release.
**Exclusions / exit rules:** Refunded customers. Remove from Abandoned Checkout immediately after successful payment.

## Email 5.1 — Preorder welcome

**Timing:** Immediately after payment
**Subject:** Your Curls & Contemplation preorder is confirmed
**Preview text:** Your launch-day access is reserved for November 24, 2026.
**Button:** View Your Order
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

Thank you. Your preorder for the digital edition of Curls & Contemplation is confirmed.

Release date: Tuesday, November 24, 2026
Preorder price: $17.99
Included at no additional cost: the digital workbook
Delivery: automatic secure access by email and through your customer portal

You do not need to purchase again or request the files manually. Your access will be activated on release day and sent to the email used at checkout.

The EPUB is intentionally not available before launch. This keeps every preorder aligned with the official release and ensures you receive the finalized files.

[BUTTON: View Your Order]

Please save this email and make sure info@curlscontemplation.beauty can reach your inbox.

With gratitude,
Michael David

---

## Email 5.2 — Emotional reinforcement

**Timing:** 2 days later
**Subject:** You did not simply preorder a book
**Preview text:** You reserved time for a more intentional conversation with your career.
**Button:** Return to Your Order
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

Thank you again for preordering Curls & Contemplation.

A preorder is a transaction, but it can also be a declaration: that the next stage of your career deserves reflection before another season disappears into urgency.

This journey will not ask you to reject the path that brought you here. It will invite you to examine what should continue, what needs support, and what may no longer deserve automatic access to your time, energy, or identity.

Between now and November 24, keep one question nearby:

What do I want my creative life to make possible — not only professionally, but personally?

You do not need the perfect answer. Notice what comes up.

[BUTTON: Return to Your Order]

With intention,
Michael David

---

## Email 5.3 — Thirty-day countdown

**Timing:** October 25, 2026
**Subject:** One month until Curls & Contemplation
**Preview text:** Your digital edition and preorder workbook arrive November 24.
**Button:** Check Your Access Details
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

We are one month away.

Curls & Contemplation releases Tuesday, November 24, 2026, and your launch-day access is already reserved.

Before release, take a moment to confirm that the email in your customer portal is correct. That address will receive your secure delivery message. You will also be able to access your order through the portal.

Your preorder includes:
• The finalized digital edition
• The digital workbook at no additional cost
• Automatic release-day access

No EPUB or download file will be sent before the official release.

[BUTTON: Check Your Access Details]

Thank you for being part of the beginning.

Michael David

---

## Email 5.4 — Seven-day countdown

**Timing:** November 17, 2026
**Subject:** One week until release
**Preview text:** Your reserved access goes live Tuesday, November 24.
**Button:** View Your Order
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

One week from today, Curls & Contemplation will be released.

Your preorder is complete. Your digital edition and included workbook will be delivered automatically on Tuesday, November 24, 2026.

A simple way to prepare: choose the place where you want to begin. It does not have to be elaborate. A quiet hour, a notebook nearby, and enough space to read without treating reflection like another task to rush through is enough.

Watch for a secure delivery email from Curls & Contemplation on launch day. If it does not appear, check Promotions and Spam before contacting support.

[BUTTON: View Your Order]

Seven days.

With gratitude,
Michael David

---

## Email 5.5 — Tomorrow reminder

**Timing:** November 23, 2026
**Subject:** Tomorrow, the journey begins
**Preview text:** Your digital edition and workbook arrive on November 24.
**Button:** Confirm Your Portal Access
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

Tomorrow, Curls & Contemplation is released.

Your secure access email will include the finalized digital edition and the digital workbook included with your preorder. Your customer portal will also reflect the active order after release.

Before tomorrow:
• Confirm you can open the customer portal
• Add info@curlscontemplation.beauty to your contacts
• Make sure the email used at checkout is still accessible

There is nothing else you need to purchase or submit.

[BUTTON: Confirm Your Portal Access]

Thank you for trusting this work before it entered the world.

Tomorrow, we move beyond the craft and into the calling.

Michael David

---

# Automation 6: Customers — Post-Purchase Onboarding

**Trigger:** Subscriber joins Customers after entitlement is active. Use product fields to branch book, workbook, and cards messaging.
**Goal:** Help customers access what they purchased, begin with intention, use the workbook appropriately, and provide support or feedback pathways.
**Exclusions / exit rules:** Refunded, access revoked, or unresolved payment dispute.

## Email 6.1 — Reader welcome

**Timing:** 1 day after access becomes active
**Subject:** A quiet way to begin Curls & Contemplation
**Preview text:** You do not need to rush through a journey designed for reflection.
**Button:** Open Your Library
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

Now that your access is active, I want to offer one suggestion before you begin:

Do not rush.

Curls & Contemplation was not designed to become another piece of content you consume quickly and forget. Give yourself permission to pause, mark what resonates, return to a question, or close the book when reflection needs room.

You do not have to complete everything in order for the experience to be valuable. Begin where your attention feels most honest, while preserving the intended sequence whenever possible.

Your customer portal is the home for your active purchases and available downloads.

[BUTTON: Open Your Library]

Thank you for reading.

With intention,
Michael David

---

## Email 6.2 — Integration prompt

**Timing:** 3 days later
**Subject:** Do not turn reflection into another performance
**Preview text:** The goal is an honest answer, not an impressive one.
**Button:** Return to Your Library
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

Creative professionals are often skilled at producing the answer a room expects.

Reflection requires something different.

As you move through Curls & Contemplation, notice when you begin editing yourself for an imaginary audience. The useful answer is not always the most polished answer. Sometimes it is the sentence you almost did not write because it felt too simple, too uncomfortable, or too true.

Let the process be private enough to be honest.

Your customer library remains available whenever you are ready to continue.

[BUTTON: Return to Your Library]

Michael David

---

## Email 6.3 — Workbook guidance or offer

**Timing:** 7 days later
**Subject:** Give the insight somewhere to live
**Preview text:** Reflection becomes more useful when it can become a decision, practice, or plan.
**Button:** Open the Workbook
**Destination:** [WORKBOOK ACCESS LINK]
**Build note:** Branch the CTA: preorder customers go directly to access; post-launch book-only customers go to the workbook product page.

Hi [FIRST NAME],

An insight can feel powerful in the moment and disappear as soon as the next assignment, client, or deadline arrives.

The workbook gives your reflection somewhere to live. Use it to capture decisions, name patterns, and translate what you are noticing into actions you can revisit.

If you preordered, the digital workbook is already included at no additional cost and should appear in your customer library.

If you purchased the book after launch without the workbook, the workbook is available separately for $19.99.

[BUTTON: Open the Workbook]

Use the pages as tools, not tests. There is no perfect way to complete them.

With intention,
Michael David

---

## Email 6.4 — Feedback and advocacy

**Timing:** 14 days later
**Subject:** What is staying with you?
**Preview text:** Your response can help shape how this work continues.
**Button:** Share Your Reflection
**Destination:** [FEEDBACK LINK]

Hi [FIRST NAME],

You have had some time with Curls & Contemplation, and I would value hearing what is staying with you.

Not a perfect review. Not a summary. Just the moment, question, or shift that continues to return after you close the book.

Your feedback helps me understand how the work is meeting readers and where the larger Curls & Contemplation ecosystem can serve stylists more meaningfully.

[BUTTON: Share Your Reflection]

Thank you for giving this journey your time and attention.

With gratitude,
Michael David

---

# Automation 7: Abandoned Checkout — Recovery

**Trigger:** Checkout is started but no successful payment is recorded. Add to Abandoned Checkout only when consent and email capture are valid.
**Goal:** Recover genuine purchase intent without pressure, answer common concerns, and preserve trust.
**Exclusions / exit rules:** Immediately exit anyone in Preorders, Customers, Refunded, or with a completed Stripe order.

## Email 7.1 — Gentle reminder

**Timing:** 1 hour after abandonment
**Subject:** Your Curls & Contemplation checkout is still open
**Preview text:** Return when you are ready — your place was not lost.
**Button:** Return to Checkout
**Destination:** [CHECKOUT RECOVERY LINK]

Hi [FIRST NAME],

It looks like you began checking out for Curls & Contemplation but did not complete the order.

Your checkout may have been interrupted, or you may simply need more time. Either is completely fine.

You can return using the link below. Before launch, the digital edition is $17.99 and includes the digital workbook at no additional cost. Secure access will be delivered automatically on Tuesday, November 24, 2026.

[BUTTON: Return to Checkout]

No action is required if you decided not to continue.

With intention,
Michael David

---

## Email 7.2 — Objection handling

**Timing:** 24 hours later
**Subject:** A few details before you decide
**Preview text:** Release date, delivery, workbook access, and what your preorder includes.
**Button:** Review Your Order
**Destination:** [CHECKOUT RECOVERY LINK]

Hi [FIRST NAME],

Before you decide whether Curls & Contemplation is right for you, here are the details most readers want confirmed:

• Digital edition preorder: $17.99
• Official release: Tuesday, November 24, 2026
• Preorder workbook: included at no additional cost
• Delivery: automatic by email and customer portal
• EPUB availability: release day, not before
• Support: available through info@curlscontemplation.beauty

The book is designed for stylists who want a more intentional relationship with their creativity, career decisions, business structure, and long-term well-being — without reducing the work to a generic formula.

[BUTTON: Review Your Order]

Choose from clarity, not urgency.

Michael David

---

## Email 7.3 — Final recovery

**Timing:** 72 hours after abandonment
**Subject:** Should I close the loop?
**Preview text:** One final link to complete your order, with no pressure to continue.
**Button:** Complete Your Order
**Destination:** [CHECKOUT RECOVERY LINK]

Hi [FIRST NAME],

I am closing the loop on the Curls & Contemplation checkout you started.

If you still intend to preorder, you can complete the order below. The preorder price is $17.99 and includes the digital workbook at no additional cost. Release-day access is automatic on Tuesday, November 24, 2026.

[BUTTON: Complete Your Order]

If the timing is not right, no explanation is needed. You will remain connected to the broader Curls & Contemplation community only according to the email preferences you selected.

With respect,
Michael David

---

# Automation 8: Bonus Claim — Workbook Access

**Trigger:** Preorder customer begins the included workbook claim or activation process.
**Goal:** Help eligible preorder customers complete access and confirm successful activation.
**Exclusions / exit rules:** Refunded or ineligible orders. Exit immediately once added to Bonus Claim Completed.

## Email 8.1 — Incomplete claim reminder

**Timing:** 2 hours after Bonus Claim Started
**Subject:** Finish activating your included workbook
**Preview text:** Your preorder benefit is waiting in your customer portal.
**Button:** Complete Workbook Access
**Destination:** [WORKBOOK ACCESS LINK]

Hi [FIRST NAME],

You started activating the digital workbook included with your Curls & Contemplation preorder, but the process was not completed.

Your workbook is included at no additional cost because your order was placed during the preorder period. Use the link below to finish activation and add it to your customer library.

[BUTTON: Complete Workbook Access]

If the link has expired or your order is not appearing correctly, contact support and include the email used at checkout.

Michael David

---

## Email 8.2 — Second claim reminder

**Timing:** 24 hours later if still incomplete
**Subject:** Your preorder workbook is still unclaimed
**Preview text:** Complete the final step so it appears in your library.
**Button:** Claim the Workbook
**Destination:** [WORKBOOK ACCESS LINK]

Hi [FIRST NAME],

Your digital workbook is still waiting to be added to your customer library.

Because you preordered Curls & Contemplation, the workbook is included at no additional cost. Complete the claim before the link expires so your access is recorded correctly.

[BUTTON: Claim the Workbook]

If you have already completed the process and this message crossed with your activation, you can disregard it.

With intention,
Michael David

---

## Email 8.3 — Claim completed

**Timing:** Immediately after Bonus Claim Completed
**Subject:** Your workbook access is active
**Preview text:** The digital workbook has been added to your customer library.
**Button:** Open the Workbook
**Destination:** [WORKBOOK ACCESS LINK]

Hi [FIRST NAME],

Your digital workbook access is active.

The workbook has been added to your customer library and is available through the link below.

[BUTTON: Open the Workbook]

Use it as a working companion to Curls & Contemplation. You may type into the fillable version, print selected pages, or return to the prompts over time as your career evolves.

There is no requirement to complete every page at once. The value is in using the right tool when the right question appears.

With intention,
Michael David

---

# Automation 9: Digital Daily Directive Affirmation Cards — Delivery & Use

**Trigger:** Successful purchase of an individual digital card set or the complete 12-set digital bundle. Create a dedicated group: Digital Directive Customers.
**Goal:** Deliver the files, teach a distinctive use ritual, increase repeat use, and offer the complete bundle only to individual-set buyers.
**Exclusions / exit rules:** Refunded or disputed orders. Do not upsell the complete bundle to customers who already own it.

## Email 9.1 — Cards delivery

**Timing:** Immediately after payment
**Subject:** Your Digital Daily Directive cards are ready
**Preview text:** Open your set and choose the directive that meets you today.
**Button:** Open Your Card Library
**Destination:** [CARDS ACCESS LINK]

Hi [FIRST NAME],

Your Digital Daily Directive Affirmation Cards are ready.

Use the link below to open your purchased set or complete 12-set bundle.

[BUTTON: Open Your Card Library]

Individual digital set: $7.99
Complete 12-set digital bundle: $59

These cards are designed to move beyond passive affirmation. Each directive is an invitation to pause, name what is true, and choose one intentional response for the day.

Save this email and bookmark your card library so the experience remains easy to return to.

With intention,
Michael David

---

## Email 9.2 — Usage ritual

**Timing:** 1 day later
**Subject:** A three-minute ritual for your directive cards
**Preview text:** Read. Reflect. Respond.
**Button:** Choose Today’s Directive
**Destination:** [CARDS ACCESS LINK]

Hi [FIRST NAME],

Try this simple three-minute ritual with your Digital Daily Directive cards:

1. Read — Choose one card without overthinking it.
2. Reflect — Ask where this directive meets your current day, decision, or emotion.
3. Respond — Name one action, boundary, conversation, or thought you will practice before the day ends.

The card is not asking you to force positivity. It is asking you to become more intentional about the response available to you.

Return to the same card for several days if it continues to reveal something useful. Repetition is not failure; it is often where integration begins.

[BUTTON: Choose Today’s Directive]

Michael David

---

## Email 9.3 — Habit reinforcement

**Timing:** 4 days later
**Subject:** Do not collect affirmations — practice one
**Preview text:** The value is not in how many cards you read.
**Button:** Return to Your Cards
**Destination:** [CARDS ACCESS LINK]

Hi [FIRST NAME],

It is easy to move quickly through affirmation content and mistake recognition for change.

Instead of reading several cards today, choose one. Keep it visible. Let it interrupt the moment when your usual reaction begins.

Ask:
• What would this directive look like in behavior?
• What would it sound like in a conversation?
• What decision would support it?
• What would I stop doing for the next twenty-four hours?

One practiced directive is more useful than ten saved intentions.

[BUTTON: Return to Your Cards]

With intention,
Michael David

---

## Email 9.4 — Bundle upsell or owner feedback

**Timing:** 10 days later
**Subject:** Ready for the complete 12-set collection?
**Preview text:** Expand your directive library or share how you are using the collection.
**Button:** Explore the Complete Bundle
**Destination:** [CARDS BUNDLE LINK]
**Build note:** Use a condition: single-set buyers receive the bundle CTA; bundle owners receive only the feedback CTA.

Hi [FIRST NAME],

You have had time to experience the Digital Daily Directive format.

If you purchased an individual set and want access to the full collection, the complete 12-set digital bundle is available for $59.

[BUTTON: Explore the Complete Bundle]

If you already own the complete bundle, use this moment differently: choose the set you have returned to most often and share what made it useful.

[BUTTON: Share Your Experience]

The goal is not to create a larger digital library for its own sake. It is to give you the right directive for the season, decision, or inner conversation in front of you.

With gratitude,
Michael David

---

# Transactional Templates — Resend / Stripe / Supabase

These messages are operational and should send even when a customer has not opted into marketing, where legally permitted. They should use authenticated domains, order records, and secure links generated by the website backend.

## Transactional 1 — Marketing consent confirmation

**Timing:** Immediately after form submission when double opt-in is enabled
**Subject:** Confirm your Curls & Contemplation subscription
**Preview text:** One click confirms that you want to receive the resource and future updates.
**Button:** Confirm My Subscription
**Destination:** [CONFIRMATION LINK]

Hi [FIRST NAME],

Please confirm that you want to receive Curls & Contemplation emails and the resource you requested.

[BUTTON: Confirm My Subscription]

After confirmation, your requested resource or welcome email will be delivered automatically.

If you did not submit this request, you can ignore this message.

---

## Transactional 2 — Preorder payment receipt

**Timing:** Immediately after successful Stripe preorder
**Subject:** Payment received — Curls & Contemplation preorder
**Preview text:** Your $17.99 preorder is confirmed for November 24, 2026.
**Button:** View Your Order
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

Payment received. Your Curls & Contemplation digital-edition preorder is confirmed.

Amount paid: $17.99
Release date: Tuesday, November 24, 2026
Included: digital workbook at no additional cost
Order reference: [ORDER NUMBER]

Your finalized files will be delivered automatically on release day. No EPUB or download file is available before launch.

[BUTTON: View Your Order]

For order support, contact info@curlscontemplation.beauty.

---

## Transactional 3 — Launch-day secure delivery

**Timing:** November 24, 2026 after entitlement activation
**Subject:** Your Curls & Contemplation digital edition is ready
**Preview text:** Your secure book and preorder-workbook access is now active.
**Button:** Access Your Digital Edition
**Destination:** [BOOK ACCESS LINK]

Hi [FIRST NAME],

Curls & Contemplation is officially available, and your preorder access is active.

[BUTTON: Access Your Digital Edition]

Your preorder also includes the digital workbook at no additional cost:

[BUTTON: Open Your Workbook]

For security, download links may expire or have a limited number of uses. Your customer portal remains the permanent place to view your order and request refreshed access when eligible.

[BUTTON: Open Customer Portal]

Thank you for being part of the release.

With gratitude,
Michael David

---

## Transactional 4 — Post-launch purchase delivery

**Timing:** Immediately after successful post-launch book purchase
**Subject:** Your Curls & Contemplation digital edition is ready
**Preview text:** Open your secure digital edition now.
**Button:** Access Your Digital Edition
**Destination:** [BOOK ACCESS LINK]

Hi [FIRST NAME],

Thank you for purchasing the digital edition of Curls & Contemplation.

Amount paid: $19.99
Order reference: [ORDER NUMBER]

[BUTTON: Access Your Digital Edition]

The digital workbook is available separately for $19.99 after launch unless it was specifically included in your order.

[BUTTON: Open Customer Portal]

For access support, contact info@curlscontemplation.beauty.

---

## Transactional 5 — Workbook purchase delivery

**Timing:** Immediately after successful workbook purchase
**Subject:** Your Curls & Contemplation workbook is ready
**Preview text:** Your secure workbook access is now active.
**Button:** Open Your Workbook
**Destination:** [WORKBOOK ACCESS LINK]

Hi [FIRST NAME],

Thank you for purchasing the Curls & Contemplation digital workbook.

Amount paid: $19.99
Order reference: [ORDER NUMBER]

[BUTTON: Open Your Workbook]

You can also access the purchase through your customer portal.

[BUTTON: Open Customer Portal]

For support, contact info@curlscontemplation.beauty.

---

## Transactional 6 — Affirmation cards purchase delivery

**Timing:** Immediately after successful card purchase
**Subject:** Your Digital Daily Directive collection is ready
**Preview text:** Open the digital set or complete 12-set bundle you purchased.
**Button:** Open Your Card Library
**Destination:** [CARDS ACCESS LINK]

Hi [FIRST NAME],

Thank you for purchasing the Digital Daily Directive Affirmation Cards.

Product: [PRODUCT NAME]
Amount paid: [AMOUNT]
Order reference: [ORDER NUMBER]

[BUTTON: Open Your Card Library]

Save this email and use the customer portal whenever you need to retrieve active purchases.

[BUTTON: Open Customer Portal]

For support, contact info@curlscontemplation.beauty.

---

## Transactional 7 — Refund and access update

**Timing:** Immediately after confirmed refund
**Subject:** Your refund has been processed
**Preview text:** Your payment was returned and the related digital access has been updated.
**Button:** View Order Status
**Destination:** [CUSTOMER PORTAL LINK]

Hi [FIRST NAME],

Your refund for [PRODUCT NAME] has been processed.

Refund amount: [AMOUNT]
Order reference: [ORDER NUMBER]
Refund destination: original payment method
Estimated posting time: determined by your bank or card provider

Digital access associated with the refunded order has been revoked or updated according to the refund terms accepted at checkout.

[BUTTON: View Order Status]

For questions about the order record, contact info@curlscontemplation.beauty.

---

# Implementation Decisions

| Action | Requirement |
|---|---|
| Archive or rename “Free Chapter” | The approved lead magnet is Pricing Confidence Kit; do not build new journeys around Free Chapter. |
| Keep only one core nurture workflow | Two duplicate seven-email Free Chapter funnels currently exist. Replace both with Automation 3. |
| Keep only one abandoned checkout workflow | Two duplicate drafts currently exist. Replace both with Automation 7. |
| Create Digital Directive Customers group | Required for product-specific delivery and post-purchase card education. |
| Add custom fields | product_type, product_name, order_status, order_number, quiz_result_name, quiz_result_summary, quiz_strength, quiz_risk, quiz_next_step, customer_portal_url. |
| Use Resend for secure transactional delivery | Unique book, workbook, cards, receipt, and refund messages should not depend on marketing consent. |
| Use MailerLite for consent-based lifecycle marketing | Welcome, nurture, quiz, preorder countdown, onboarding, abandoned checkout, bonus, and cards education. |
| Apply global exits | Successful payment exits abandoned checkout; refund exits all sales/onboarding flows; unsubscribe stops marketing but not required transactional notices. |
| Do not activate yet | Build, proof, test links, verify sender domain, seed test subscribers, and obtain final approval before activation. |

# Pre-Activation QA Checklist

- [ ] Authenticate the sending domain and verify the reply-to mailbox.
- [ ] Replace every bracketed placeholder with a field or tested URL.
- [ ] Confirm the canonical order URL automatically changes from preorder to post-launch state.
- [ ] Confirm the release date is November 24, 2026 in the website, Stripe metadata, Supabase, MailerLite, Resend, and environment configuration.
- [ ] Confirm preorder is $17.99 and includes workbook access at no additional cost.
- [ ] Confirm post-launch book is $19.99 and post-launch workbook is $19.99 separately unless an approved bundle is introduced.
- [ ] Confirm card products are $7.99 per individual digital set and $59 for all 12 sets.
- [ ] Test successful payment exits Abandoned Checkout immediately.
- [ ] Test refund moves the subscriber to Refunded, revokes access, and suppresses onboarding/upsell messages.
- [ ] Test preorder delivery with non-production files or a secure placeholder; do not upload the final EPUB yet.
- [ ] Verify every button on mobile and desktop.
- [ ] Send every message to internal seed addresses before activating workflows.
- [ ] Keep all workflows in draft until final content, link, legal, and delivery review is approved.