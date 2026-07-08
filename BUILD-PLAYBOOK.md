# CURLS & CONTEMPLATION — COMPLETE REBUILD PLAYBOOK
### curlscontemplation.beauty · $25K studio build · ships before Nov 24, 2026

---

## HOW TO USE THIS (read once, then never again)

1. **PART A** runs in **Cowork** (or Higgsfield directly). It generates the 8 motion assets. Copy each prompt, run its loop, lock the result.
2. **PART B** runs in **Claude Code**. Each phase is ONE copy-paste prompt that makes Code loop on its own until it passes a gate. You paste, you walk away, you come back to working code.
3. **PART C** is the hands-video recipe — only if you find the footage.
4. **PART D** is the 6-command quick start if you just want to go.

Drop this file in your repo root as `BUILD-PLAYBOOK.md` so every Claude Code session can read it.

---

## THE LAWS (paste into `CLAUDE.md` — every Code session inherits these)

```
1. Do the whole thing. No partial output. No stopping halfway.
2. Never talk back. Execute.
3. Make no mistakes. Verify before stating. Never guess.
4. Boil the ocean. Incomplete answers are wrong answers.
5. Think before answering. Max reasoning depth before the first line of code.
6. Go beyond the basics. No default-theme choices. This was commissioned at $25,000.

LOCKED — do not violate:
- Palette: Obsidian #111111 · Antique Gold #B08D57 · White Gold #D8D1C5 ·
  Deep Jade #145B4B · Soft Jade Mist #C7D9D2
- Retired tokens BANNED: #2B9999 and #C9A961
- Type: Cormorant Garamond (display) + Inter (body)
- Four-funnel architecture is LOCKED. Wire it, never redesign it.
- Do NOT depict TAYLKOMB comb geometry anywhere (patent CIP gates disclosure).
- Do NOT generate photorealistic Black faces or hair-as-subject — real footage only.
- No production deploy, card charge, or PII write without an explicit [GATE] approval.
```

---

## RUNTIME MAP — what runs where

| Phase | Runs in | Output |
|---|---|---|
| 0 Inventory | Cowork | tool/skill/MCP table |
| 1 Investigate | Claude Code | Current State Report + file:line evidence |
| 2 Plan | Claude Code | `docs/rebuild-plan.md` + pre-mortem |
| 3 Design tokens | Claude Code | `styles/aciss.css` + component spec |
| 3.5 Motion Library | **Cowork + Higgsfield** | 8 files in `/public/motion/` + manifest |
| 4 Home + Pre-order | Claude Code | 2 shipped pages |
| 5 Commerce + 502 fix | Claude Code | live checkout + 2 funnels |
| 6 QA gate | Claude Code | zero P0/P1 defect log |
| 7 Deploy | Claude Code + [GATE] | production + rollback runbook |

Handoff between Cowork and Code = one committed file: `/public/motion/motion-manifest.json`.
Cowork writes it. Code reads it. Code kicks rejects back with a one-line regenerate note.

---
---

# PART A — THE HIGGSFIELD MOTION LIBRARY

**The creative rule for this site:** never be literal about hair. You read the *feeling* in under 2 seconds; you realize it's hair a beat later. That delay is the emotion.

**The loop for every asset (do this exactly):**
```
1. Create the board once:  boards_create_new_board  "CC-Motion-Direction"
2. generate_image  with the STILL prompt below.
3. Score against 4 gates:
     (a) palette locked to the ACISS hex above
     (b) emotional read in under 2 seconds
     (c) non-obvious — no beauty-ad cliché
     (d) negative space reserved for headline/CTA
   Fail any gate -> change EXACTLY ONE variable -> regenerate. Max 4 image tries, then lock.
4. Lock still -> generate_video (or motion_control) with the MOTION prompt.
   Score: seamless loop, scroll-dwell pacing, believable weight.
   Fail -> change ONE variable -> regenerate. Max 3 motion tries, then lock.
5. upscale_video -> export WebM + MP4 -> capture poster WebP -> write the manifest row.
```
**The one-variable menu** (change only one per iteration): `light angle` · `coil scale` · `grain amount` · `palette bleed` · `crop / aspect` · `camera dwell` · `particle density`.

---

## ASSET A — HERO "The Book Is The Door"  ·  home, above the fold  ·  ≤4MB · 12s loop

**STILL prompt:**
> A closed hardcover book floating in an obsidian void, faint antique-gold light seeping from its edges as if something inside is waking. Cinematic, reverent, A24, deep matte black background, single warm gold rim light. Wide negative space above the book for a headline. No text, no hands. Palette: obsidian #111111 ground, antique gold #B08D57 edge glow, white gold #D8D1C5 highlight. 16:9.

**MOTION prompt (after still locks):**
> Over 12 seconds: the book slowly opens, pages fanning like breath, antique-gold particles spilling upward and outward, the interior glowing deep jade #145B4B before the light resolves into a soft doorway of white-gold light. Seamless loop back to the closed book. Slow, sacred, no camera shake. Silent.

**Iteration example:** if the gold glow floods the headline space → *"lower the edge glow 30%, keep the upper third obsidian for headline space."*

**Manifest row:**
```json
{ "id":"A","file":"/motion/hero-door.webm","mp4":"/motion/hero-door.mp4",
  "poster":"/motion/hero-door-poster.webp","placement":"home ATF",
  "weightKB":4000,"reducedMotion":"poster" }
```

---

## ASSET B — "The Unfurling" (emotional hair)  ·  home mid-scroll  ·  ≤1.5MB · 8s loop

**STILL prompt:**
> Extreme macro of a single spiraling coil of textured black hair catching a thin rim of warm gold against a matte obsidian void — shot like a fern frond mid-unfurl or a ribbon of smoke waking. Shallow depth of field, reverent, intimate. No face, no product — pure form and light. Palette: obsidian #111111, antique gold #B08D57 rim, faint soft jade mist #C7D9D2 in the deepest shadow. 9:16.

**MOTION prompt:**
> The coil slowly relaxes and unfurls over 8 seconds like something waking, then re-coils to loop seamlessly. Micro dust motes drift. No camera move. Silent.

**Manifest row:**
```json
{ "id":"B","file":"/motion/unfurling.webm","mp4":"/motion/unfurling.mp4",
  "poster":"/motion/unfurling-poster.webp","placement":"home mid-scroll",
  "weightKB":1500,"reducedMotion":"poster" }
```

---

## ASSET C — Michael, the breathing portrait  ·  about hero  ·  ≤1.5MB · 10s

Start from a REAL portrait of Michael. Use `motion_control` on the still — do not generate a face.

**MOTION prompt (motion_control on real still):**
> Add only the smallest life: a slow breath, one blink, a subtle head settle over 10 seconds. Warm gold key light, obsidian background. It should read as a photograph that quietly breathes — never as CGI. Seamless loop. Silent.

**Manifest row:**
```json
{ "id":"C","file":"/motion/portrait.webm","mp4":"/motion/portrait.mp4",
  "poster":"/motion/portrait-poster.webp","placement":"about hero",
  "weightKB":1500,"reducedMotion":"poster" }
```

---

## ASSET D — The Contemplation Room  ·  book→about transition  ·  ≤1.5MB · 8s loop

**STILL prompt:**
> An abstract minimalist interior in deep obsidian, a single tall window pouring soft white-gold light onto a stone plinth that holds a closed book. Dust motes suspended in the beam, floor washed in soft jade mist. Quiet, sacred, architectural, cinematic. No people. Palette: obsidian #111111, white gold #D8D1C5 light, soft jade mist #C7D9D2 floor, antique gold #B08D57 on the book edge. 16:9.

**MOTION prompt:**
> Slow 8-second dolly-in toward the plinth, dust motes drifting through the light beam, the book edge catching a slow gold shimmer. Seamless loop. Silent.

**Manifest row:**
```json
{ "id":"D","file":"/motion/room.webm","mp4":"/motion/room.mp4",
  "poster":"/motion/room-poster.webp","placement":"book to about transition",
  "weightKB":1500,"reducedMotion":"poster" }
```

---

## ASSET F — Free-Chapter page peek  ·  /free-chapter  ·  ≤400KB · 4s scroll-triggered

**STILL prompt:**
> A book opening to its first chapter page against obsidian, a thin antique-gold underline beginning to draw itself beneath the chapter title area. Clean, editorial, inviting. Palette: obsidian #111111, cream page, antique gold #B08D57 underline. 4:3.

**MOTION prompt:**
> 4 seconds: the cover lifts to the first page, the gold underline draws left-to-right beneath the title zone, then holds. Plays once on scroll-into-view. Silent.

**Manifest row:**
```json
{ "id":"F","file":"/motion/chapter-peek.webm","mp4":"/motion/chapter-peek.mp4",
  "poster":"/motion/chapter-peek-poster.webp","placement":"/free-chapter CTA",
  "weightKB":400,"reducedMotion":"poster","trigger":"scroll-once" }
```

---

## ASSET I — Gold particle burst  ·  post-purchase / milestones  ·  ≤400KB · 2s one-shot

**STILL prompt:**
> A single point of antique-gold light on pure obsidian, poised to burst. Minimal, ceremonial. Palette: obsidian #111111, antique gold #B08D57. 1:1.

**MOTION prompt:**
> 2 seconds: a controlled burst of antique-gold particles blooming outward from center then settling, like quiet celebration. Plays once on success events (checkout complete, quiz complete, chapter download). Silent.

**Manifest row:**
```json
{ "id":"I","file":"/motion/burst.webm","mp4":"/motion/burst.mp4",
  "poster":"/motion/burst-poster.webp","placement":"post-purchase overlay",
  "weightKB":400,"reducedMotion":"static-gold-dot","trigger":"event-once" }
```

---

## ASSET K — "The Hands" (emotional core)  ·  about + preorder  ·  ≤1.5MB · 10s

**PREFERRED: real footage of Michael's hands (see PART C).** Generative fallback only if no footage exists:

**STILL prompt (fallback):**
> Intimate extreme close-up: two dark-skinned hands moving with tenderness through a crown of natural black coils, warm antique-gold backlight haloing the strands, obsidian background dissolving to shadow. The feeling of being cared for — ritual, inheritance, sanctuary. Heavy film grain, cinematic, sacred. No faces — only hands, hair, and light. Palette: obsidian #111111, antique gold #B08D57 halo, white gold #D8D1C5 highlight. 4:5.

**MOTION prompt:**
> 10 seconds of slow, tender motion — hands moving gently through the coils, gold light breathing. Dreamlike, reverent. Seamless loop. Silent.

**Manifest row:**
```json
{ "id":"K","file":"/motion/hands.webm","mp4":"/motion/hands.mp4",
  "poster":"/motion/hands-poster.webp","placement":"about + preorder emotional beat",
  "weightKB":1500,"reducedMotion":"poster","source":"real-footage-preferred" }
```

---

## ASSET L — "The Crown"  ·  /preorder hero  ·  ≤2MB · 10s loop

**STILL prompt:**
> Silhouette of a person crowned with voluminous natural coils, backlit by a rising wash of white-gold light like a slow dawn. Deep obsidian foreground falling to pure black. The outermost coils catch a single thin rim of antique gold. Reverent, regal, editorial, cinematic, A24. Wide negative space in the upper third for a headline. No facial features — pure silhouette and halo. Palette: obsidian #111111 ground, white gold #D8D1C5 dawn, antique gold #B08D57 rim. 16:9.

**MOTION prompt:**
> Over 10 seconds the dawn light rises almost imperceptibly, a few gold particles drift up through the coils, the silhouette breathes once. Seamless loop back to darkness. No camera move. Silent.

**Iteration example:** if dawn washes out the headline zone → *"lower the dawn 30%, push it lower-right, keep the upper third deep obsidian."*

**Manifest row:**
```json
{ "id":"L","file":"/motion/crown.webm","mp4":"/motion/crown.mp4",
  "poster":"/motion/crown-poster.webp","placement":"/preorder hero",
  "weightKB":2000,"reducedMotion":"poster" }
```

---

## ASSET J — Kinetic type  ·  all pages  ·  IN-CODE, not Higgsfield

Book quotes in Cormorant Garamond animating on as section intros. Cheaper and crisper in SVG/CSS.
Higgsfield only supplies the ambient video *behind* the type. Built in Phase 4.

---

**PART A exit check:** 8 files in `/public/motion/`, every one under its weight cap, `motion-manifest.json` committed. Total motion payload ≤ 12MB. If total > 12MB, re-export the heaviest asset at 720p and loop back.

---
---

# PART B — CLAUDE CODE (the self-iterating loop prompts)

Each phase below is ONE prompt. Paste it into Claude Code. It loops on its own and only exits when the gate passes with real command output. Run them in order.

---

## PHASE 1 — INVESTIGATE (paste into Claude Code)

```
Read BUILD-PLAYBOOK.md and CLAUDE.md first.

GOAL: a Current State Report I can trust, every finding backed by file:line evidence.

LOOP until every claim has evidence:
  1. Map the repo: routes, components, data flow, which funnels are wired vs stubbed,
     Supabase tables touched, Stripe endpoints, MailerLite hooks, env var health.
  2. Confirm the POST /api/checkout 502 root cause — trace the handler, print the code,
     name the exact failure (suspected stale STRIPE_SECRET_KEY in Vercel).
  3. Grep the whole codebase for banned tokens #2B9999 and #C9A961. List every hit file:line.
  4. For any claim you cannot back with a file:line or a command output, mark it
     UNVERIFIED and go find the evidence. Do not exit with UNVERIFIED claims.

OUTPUT: docs/current-state.md — what exists, what's broken, what's noise, what's off-brand,
what's missing. Every line cites file:line or command output.

Do not fix anything in this phase. Read and report only.
```

---

## PHASE 2 — PLAN (paste into Claude Code)

```
Read docs/current-state.md.

GOAL: an implementable rebuild plan + a pre-mortem. One plan, not three options.

Produce docs/rebuild-plan.md containing:
  - Final page map, ship exactly these, kill/redirect the rest (justify each cut):
      /            Felt home — "the book is the door"
      /preorder    PRIMARY commerce page until Nov 24 — countdown + offer + Stripe
      /book        The book — synopsis, look-inside, endorsements (no fabricated stats)
      /free-chapter Tripwire funnel entry
      /about       Michael — breathing portrait, the why
      /reset       RESET Method (soft, no medical claims)
  - Primary CTA sitewide = Pre-order. Secondary = Free chapter.
  - Build order with [GATE] markers before anything charges a card, stores PII, or deploys.
  - A pre-mortem: label each risk a Tiger (real), Paper Tiger (overblown), or Elephant
    (unspoken). For each, give a kill criterion and the cheapest test.

Keep it to what's buildable. No taxonomies. Halt after writing the file.
```

---

## PHASE 3 — DESIGN TOKENS (paste into Claude Code)

```
GOAL: one CSS token file and a component spec an engineer could build from blind.

LOOP until the token file compiles and contains zero banned tokens:
  1. Write styles/aciss.css: CSS custom properties for the 5 locked colors, the type
     scale (Cormorant Garamond display / Inter body), spacing scale, radius, shadow,
     motion timing (ease + duration tokens for scroll-dwell pacing).
  2. RUN: grep -rn "2B9999\|C9A961" styles/  → must return nothing.
  3. If it returns anything, replace with the correct locked token, go to 2.
  4. Write docs/components.md: hierarchy rules, button/card/nav states incl. hover/
     focus/disabled, empty states, error states, mobile behavior at 375/390/430px.

Exit only when the grep is clean. Report the grep output as proof.
```

---

## PHASE 4 — BUILD HOME + PRE-ORDER (paste into Claude Code — the big loop)

```
Read motion-manifest.json and docs/components.md.

GOAL: two production pages that read as a $25K bespoke build, LCP < 2.5s, CLS < 0.1.

Build / (home) wiring assets A, B, D, I, J from the manifest.
Build /preorder wiring assets L (hero), K (emotional beat), a live countdown to
2026-11-24, the offer stack (price, what's included, pre-order-only bonus), and the
Stripe CTA.

For every motion asset: IntersectionObserver-gated playback, poster frame fallback,
and honor prefers-reduced-motion (show poster, no video). No HTML <form> in React —
onClick/onChange only. Real humanized copy in Michael's voice — no lorem, no AI throat-
clearing, no em-dash overuse.

LOOP until both pages pass the gate:
  1. Build/edit the page.
  2. RUN the dev server and RUN Lighthouse (or the project's perf script) on both pages.
  3. READ the numbers. Gate = LCP < 2.5s AND CLS < 0.1 AND no console errors AND
     every motion asset has a working poster fallback.
  4. If any metric fails, fix the specific cause (compress asset, reserve dimensions,
     lazy-load, defer) and go to 2.
  5. If an asset is simply too heavy to hit the cap, STOP and write a one-line
     regenerate note into motion-manifest.json for Cowork, then continue with its poster.

Do not claim the gate passed without pasting the Lighthouse output that proves it.
```

---

## PHASE 5 — COMMERCE WIRING + 502 FIX (paste into Claude Code)

```
GOAL: a working checkout and two live funnels — Pre-Order (revenue) and Free Chapter (list).

HARD PREREQUISITE — fix POST /api/checkout 502 first:
  LOOP until a live $1 test purchase writes a row to Supabase:
    1. Confirm/rotate STRIPE_SECRET_KEY in Vercel (via Stripe + Vercel MCP).
    2. Confirm the webhook signing secret matches.
    3. RUN a live $1 test checkout.
    4. RUN a Supabase query to confirm the row landed.
    5. If no row, read the Vercel + Stripe logs, fix the exact failure, go to 3.
  Exit only when the Supabase row is confirmed present. Paste the query result.

Then wire the funnels:
  PRE-ORDER: decide charge-now vs authorize-later and STATE the choice. Create the
  pre_orders table. Wire the Stripe SKU. Build the MailerLite countdown nurture
  sequence — subject lines + send offsets tied to 2026-11-24. Thank-you page fires asset I.
  FREE CHAPTER: opt-in → Supabase write → MailerLite group → deliver the chapter →
  tripwire offer. Map the exact MailerLite group.

[GATE] Before pointing real traffic at either funnel, show me the $1 test result and
the MailerLite sequence, and wait for my "go".

Never touch live keys, RLS, or production MailerLite groups without stating the exact
change first.
```

---

## PHASE 6 — QA GATE (paste into Claude Code)

```
GOAL: zero P0/P1 defects across function, accessibility, security, copy, and mobile.

LOOP until the defect log has zero P0 and zero P1:
  1. RUN Playwright end-to-end on both funnels (opt-in → payment → confirmation).
  2. RUN a WCAG 2.2 AA audit. Fix contrast, focus order, alt text, reduced-motion.
  3. RUN a security/legal pass: CSP + headers, webhook signature verification, secrets
     scan, rate limiting, PII handling, required legal pages, consent banner (CCPA/CPRA).
  4. RUN a copy pass: humanize every string, remove AI tells, and doublecheck any
     statistic or endorsement claim — delete anything unverifiable.
  5. RUN mobile QA at 375 / 390 / 430px — layout, tap targets, motion payload.
  6. Log every defect with severity + remediation. Fix all P0/P1, go to 1.

Exit only when P0 = 0 and P1 = 0. Paste the passing Playwright run and the final defect log.
```

---

## PHASE 7 — DEPLOY (paste into Claude Code)

```
GOAL: production live, observability armed, one-command rollback documented.

  1. Push a Vercel PREVIEW deploy. Run the smoke suite against the preview URL.
  2. [GATE] Show me the preview URL and smoke results. Wait for my explicit "promote".
  3. On "promote": promote to production, verify build logs, verify runtime.
  4. Arm Sentry + ga4 + PostHog. Confirm events fire.
  5. RUN the post-deploy smoke suite against production.
  6. Write docs/rollback-runbook.md: the ONE command to revert, plus a decision tree
     for the common failure modes (checkout 502, motion not loading, MailerLite silent).

Do not promote without the [GATE] "promote". Paste the production smoke results.
```

---
---

# PART C — THE HANDS VIDEO (only if you find footage)

If you upload a clip of your hands working, here's exactly what happens to turn it into Asset K.

**In this chat (claude.ai) — I have ffmpeg in the container:**
```
1. Extract frames every ~0.5s so I can SEE the clip and pick the strongest 8-10 seconds.
2. Trim to that window.
3. Color-grade toward ACISS: crush blacks to obsidian, warm the highlights to antique gold.
4. Add subtle film grain + a gentle slow-motion dwell.
5. Compress to WebM + MP4 under 1.5MB.
6. Cut a poster WebP from the best frame.
7. Hand you the finished files + the manifest row, ready to wire in Phase 4.
```

**In Claude Code / Cowork with Higgsfield connected — going further:**
```
- media_upload the clip.
- shorts_studio_create to restyle it toward the cinematic direction, OR
- motion_control to use your real hand motion as the driver for other shots.
- image_add_grain / color tools for the final grade.
- upscale_video for retina delivery.
```

**What to shoot if you're capturing fresh (30 seconds is plenty):**
> Extreme close-up, your hands moving slowly through coiled hair, one warm light source
> from behind/above (window or a single lamp), dark backdrop, phone locked on a surface,
> slow deliberate motion. We only need 8-10 usable seconds. Backlight + slow hands = the shot.

Real footage of your hands will out-emotion every generated asset on the site. If it exists, it becomes the heart.

---
---

# PART D — QUICK START (if you just want to go)

```
1. Cowork:      run PART A — generate the 8 motion assets, commit motion-manifest.json
2. Claude Code: paste PHASE 1  → get docs/current-state.md
3. Claude Code: paste PHASE 2  → get docs/rebuild-plan.md + pre-mortem
4. Claude Code: paste PHASE 3  → get styles/aciss.css (banned-token grep clean)
5. Claude Code: paste PHASE 4  → home + preorder shipped, LCP/CLS gate passed
6. Claude Code: paste PHASE 5  → 502 fixed, $1 test lands, 2 funnels wired  [GATE]
7. Claude Code: paste PHASE 6  → zero P0/P1 defects
8. Claude Code: paste PHASE 7  → preview → [GATE] → production + rollback runbook
```

**Order that protects your runway:** motion first (Cowork, async) → home + preorder (revenue) →
checkout fix (you have zero completed purchases right now) → funnels → QA → ship.
The 502 fix in Phase 5 is the single most urgent line item in this entire file.
