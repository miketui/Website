# Component Spec — curlscontemplation.beauty

Design-system reference for the shipped React components. This documents
**reality** (what the `.tsx` in `components/` actually render today), mapped to
the tokens in `styles/aciss.css` and `styles/aciss-tokens.css`.

- **Palette:** only the five locked ACISS colors and `color-mix()` derivations
  of them. Tailwind aliases: `obsidian` `#111111`, `antique` `#B08D57`,
  `whitegold` `#D8D1C5`, `jade` `#145B4B`, `mist` `#C7D9D2`
  (`tailwind.config.ts`). Banned legacy hexes must never appear.
- **Fonts:** `--font-display` = Cormorant Garamond, `--font-body` = Inter, both
  self-hosted variable fonts wired in `app/fonts.ts`.
- **Focus:** every interactive control uses an antique-gold ring
  (`focus-visible:ring-2 ring-antique`, token `--focus-ring`), and controls over
  obsidian add `ring-offset-2 ring-offset-obsidian` (`--focus-ring-offset`).
- **Tap targets:** minimum 44px (`min-h-11`, token `--tap-target-min`).

---

## 1. Type hierarchy — display vs body

| Role | Family | Token | Where it appears |
|------|--------|-------|------------------|
| Hero display | Cormorant Garamond | `--type-hero` / `--type-display`, `--leading-none` (0.95), `--tracking-tight` | `.hero-display`, page heroes |
| Section heading (h2) | Cormorant Garamond | `--type-h2`, `--leading-none` | `Section.tsx` `font-display text-4xl md:text-6xl` |
| Card title (h3) | Cormorant Garamond | `--type-h3`, `--leading-tight` | `ExperienceCard`, `ProductCard`, `DownloadRow` |
| Lead / standfirst | Inter | `--type-lead`, `--leading-snug` | Section intro paragraphs |
| Body | Inter | `--type-body`, `--leading-normal`–`--leading-relaxed` | `Section` body `leading-8`, card copy |
| Eyebrow / kicker | Inter | `.editorial-kicker`: `--tracking-wider` (0.22em), uppercase, `--color-antique-gold`, 700 | Section eyebrow, "You leave with" |
| Caption / micro-label | Inter | `--type-caption`, `--tracking-widest`, `--text-faint` | footer note, meta |
| Gold serif accent | Cormorant Garamond italic | `.result-line` / `.accent-italic`, `--color-dawn-gold` | outcome lines on cards |

**Rules**

1. Cormorant Garamond (display) is for headings, hero copy, and the italic gold
   accent lines only. Inter (body) is for everything else, including eyebrows,
   buttons, labels, and running text.
2. One display size per visual block; do not stack two hero-scale headings.
3. Headlines are white (`--text-strong`); body is `--text-body` (white-gold),
   secondary body is `--text-muted` (`text-whitegold/85` in components).
4. Never introduce a color into type outside the five; gold-on-text uses the
   `.text-dawn` clip gradient or `--color-dawn-gold`, both derived.

---

## 2. Buttons

Source: `components/Button.tsx` (variants `primary` / `secondary` / `ghost`),
plus inline submit buttons in `NewsletterForm.tsx` and `DownloadList.tsx`.

Shared base: `inline-flex items-center justify-center rounded-full`
(`--radius-pill`) `px-5 py-3` (`--space-5` / `--space-3`), `text-sm`,
`font-semibold` (Inter), `transition`.

### primary
| State | Spec (tokens) |
|-------|---------------|
| Default | bg `--color-antique-gold`, text `--text-on-accent` (obsidian) |
| Hover | adds `--shadow-gold` (`hover:shadow-gold`); no color change |
| Focus-visible | ring `--focus-ring` (2px) + `--focus-ring-offset` offset |
| Disabled | `disabled:opacity-60`, `transition-opacity`, cursor not-allowed; used for submit "Subscribing…" / "Preparing…" busy states |

### secondary
| State | Spec |
|-------|------|
| Default | 1px border `--color-antique-gold`, text `--text-body` (whitegold), transparent fill |
| Hover | fill `--color-antique-gold`, text → obsidian (`hover:bg-antique hover:text-obsidian`) |
| Focus-visible | ring `--focus-ring` + offset |
| Disabled | `opacity-60`, no hover fill |

### ghost
| State | Spec |
|-------|------|
| Default | text `--text-body`, `underline decoration-antique underline-offset-4` |
| Hover | underline persists; brightness via decoration only |
| Focus-visible | ring `--focus-ring` + offset |
| Disabled | `opacity-60` |

**Motion:** color/shadow transitions use `--duration-fast` + `--ease-standard`.
The magnetic CTA variant (`components/motion/MagneticCurlButton.tsx`) adds
pointer-follow transform gated by reduced-motion.

**Empty / loading:** buttons that trigger async work swap their label to a
present-progressive string ("Subscribing…", "Preparing…") and set `disabled`;
they never disappear.

---

## 3. Cards

Two families ship today.

### 3a. Glass card — `components/design/ExperienceCard.tsx`
Uses `.glass-panel` (`styles/flourish.css`): 1px `--line-subtle` border,
jade→mist gradient wash over `--surface-glass`, `--shadow-lg` (obsidian-tinted)
plus a gold hairline glint (`::before`). Radius `--radius-xl` (`rounded-[2rem]`).

| State | Spec |
|-------|------|
| Default | glass panel, title white, body `text-whitegold/78` (`--text-muted`), optional `CornerStrand` at 60% opacity |
| Hover | `hover:-translate-y-1.5` lift + border → `--line-strong` (`hover:border-antique/45`); corner strand → 100% opacity. `--duration-base` / `--ease-out` |
| Focus-visible | card itself is not focusable; interactive children carry the `--focus-ring` |
| Disabled | n/a (presentational). Reduced motion: `motion-reduce:transform-none` kills the lift |
| Outcome slot | `result` renders a hairline divider (`--line-subtle`) + `.editorial-kicker` label + `.result-line` gold italic serif (`--color-dawn-gold`) |

### 3b. Bordered card — `ProductCard.tsx` / `PricingCard.tsx` / `DownloadList.tsx`
`rounded-3xl` (`--radius-lg`/`xl`), 1px `--line-subtle` border
(`border-whitegold/15`), `bg-white/5` fill. Title `font-display` white, price
`--color-antique-gold`, copy `--text-muted`. `NewsletterForm` card tone uses a
gold border (`border-antique/30`) over solid obsidian.

**Empty state:** `DownloadList` maps over `deliverables`; when a row's fetch
returns no entitlement it surfaces a copy string (e.g. "We don't see a purchase
for this item…") rather than hiding the row.

**Error state:** inline `<p role="alert" class="text-mist">` below the card
body (`DownloadList`, `NewsletterForm`) — errors use **mist**, a locked color,
never red.

---

## 4. Navigation

Desktop: `components/SiteHeader.tsx`. Mobile: `components/MobileNav.tsx`. Both
read one list, `lib/navigation` (`primaryNav`, `isActiveRoute`).

### Header shell (`SiteHeader`)
- `sticky top-0`, height 72px (`--header-height`), `z-30` (`--z-header`).
- Over hero: transparent, transparent border. After 24px scroll: condenses to
  `bg-obsidian/85 backdrop-blur-xl` with `border-antique/25` hairline.
  Transition `--duration-slow`; transform/opacity only → zero CLS.
- Reduced motion: state still switches (visibility is meaning); transition drops.

### Desktop nav link
| State | Spec |
|-------|------|
| Default | `--text-muted` (`text-whitegold/80`), `py-2` |
| Hover | text → `--color-antique-gold` (`--transition-colors`) |
| Active | text `--color-antique-gold` + shared-layout gold underline (motion `layoutId="nav-underline"`), `aria-current="page"` |
| Focus-visible | ring `--focus-ring` (2px) |

### Mobile nav (`MobileNav`)
- Toggle: 44px circular button (`h-11 w-11`, `--radius-pill`), `--line-subtle`
  border, `aria-expanded` + `aria-controls="mobile-menu"`, animated hamburger↔X.
- Panel: full-screen portal below the 72px header, `z-40` (`--z-mobile-panel`),
  solid `bg-obsidian`, scroll-locked while open, closes on Escape / route change.
- Links: `font-display text-3xl`, hairline divider `--line-subtle`
  (`border-whitegold/10`); default white, active/hover `--color-antique-gold`,
  `aria-current` on the active route.
- Entrance: opacity fade + per-item staggered `y` (0.05·i delay, `--ease-out`);
  reduced motion renders instantly (`initial={false}`, no exit).

---

## 5. Forms & inputs

Source: `NewsletterForm.tsx`, `ContactForm.tsx`, `FreeChapterForm.tsx`.

- Text input: `rounded-full` (`--radius-pill`), `--line-subtle` border, **white
  fill with obsidian text** (`.light bg-white text-obsidian`) for contrast —
  the one deliberately light surface. Label is `text-sm font-semibold` white.
- Success state: form replaces itself with a display-serif "Thank you." panel +
  `role="status"` confirmation (`--text-muted`).
- Error state: `<p role="alert" class="text-mist">` with specific copy per API
  error code (`invalid_email`, `turnstile_failed`, network). Mist, not red.
- Submit disabled while `status === "submitting"` (`disabled:opacity-60`).

---

## 6. Mobile behavior (375 / 390 / 430px)

Design mobile-first; the layout is single-column below the `md` breakpoint
(768px) so 375–430 differ mainly in fluid scale, not structure.

| Width | Device class | Behavior |
|-------|--------------|----------|
| **375px** | iPhone SE / mini | Baseline. Page gutter `--gutter-inline` (20px, `px-5`). Section rhythm `py-14` (`--space-14`). Type at clamp() minimums. Mobile nav toggle + compact CTA in header. Buttons full-width-friendly (`NewsletterForm` stacks input above submit, `flex-col`). Tap targets ≥44px. |
| **390px** | iPhone 14 / 15 | Same layout; ~4% more inline space absorbed by fluid `clamp()` type and flex gaps. No breakpoint change. |
| **430px** | iPhone Pro Max | Still single-column and below `md`; `clamp()` type near its mobile ceiling. `NewsletterForm` input row may go side-by-side at `sm` (640px) — at 430 it remains stacked. Cards stay full-bleed within the 20px gutter. |

Cross-cutting mobile rules:
- Header stays 72px tall at every width (no reflow); desktop nav hidden below
  `md`, replaced by the toggle + a single condensed CTA (`Header.tsx`).
- Mobile panel is full-viewport and scroll-locked; body scroll is restored on
  close.
- All controls meet the 44px (`--tap-target-min`) minimum.
- Horizontal overflow is clipped globally (`body { overflow-x: hidden }`).
- Motion respects `prefers-reduced-motion` everywhere (staggers, lifts, header
  transition, portal breath all degrade to instant/none).
