<!--
Curls & Contemplation Website v4 planning package.
Controlled by author-site/docs/website-v4/00_REPO_AUDIT.md and root AGENTS.md.
No app scaffold, credentials, live payment activation, or release/book/build/archive edits are included in Prompt 2.
-->
# 03_ACISS_TOKENS_SPEC_v2 — Premium Token System

## 1. Design law
**Black leads. Gold elevates. Jade distinguishes.**

ACISS should feel editorial, premium, calm, and precise. Obsidian creates authority, Antique Gold adds ceremony, White Gold carries readable warmth, Deep Jade signals the book's distinct creative/business path, and Soft Jade Mist provides soft relief moments.

## 2. Locked color tokens
| Token | Hex | Use |
|---|---:|---|
| Obsidian Black | `#111111` | Primary background, ink, authority sections. |
| Antique Gold | `#B08D57` | Premium accents, rules, CTA highlights, small icons. |
| White Gold | `#D8D1C5` | Warm text on dark, backgrounds, borders. |
| Deep Jade | `#145B4B` | Distinctive CTAs, pathways, form focus, chapter markers. |
| Soft Jade Mist | `#C7D9D2` | Gentle panels, relief sections, hover/focus wash. |

## 3. Deprecated colors
Remove or document as deprecated. Do not introduce in Prompt 3:
- `#0E0D0B`
- `#B89968`
- `#1F6F6B`
- `#2B9999`
- `#C9A961`

## 4. CSS variables
```css
:root {
  --aciss-obsidian: #111111;
  --aciss-antique-gold: #B08D57;
  --aciss-white-gold: #D8D1C5;
  --aciss-deep-jade: #145B4B;
  --aciss-soft-jade-mist: #C7D9D2;

  --color-bg: var(--aciss-obsidian);
  --color-bg-soft: #171717;
  --color-surface: #1D1A16;
  --color-text: var(--aciss-white-gold);
  --color-text-strong: #FFFFFF;
  --color-muted: color-mix(in srgb, var(--aciss-white-gold) 72%, var(--aciss-obsidian));
  --color-accent: var(--aciss-antique-gold);
  --color-distinct: var(--aciss-deep-jade);
  --color-relief: var(--aciss-soft-jade-mist);

  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-sans: "Inter", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, monospace;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;

  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  --radius-xl: 2rem;
  --radius-pill: 999px;

  --shadow-gold-soft: 0 24px 80px rgba(176, 141, 87, 0.18);
  --shadow-jade-soft: 0 24px 80px rgba(20, 91, 75, 0.22);
  --shadow-obsidian: 0 30px 120px rgba(0, 0, 0, 0.45);

  --motion-fast: 150ms;
  --motion-base: 260ms;
  --motion-slow: 700ms;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

## 5. Tailwind mapping
```ts
// tailwind.config.ts excerpt for Prompt 3
export default {
  theme: {
    extend: {
      colors: {
        aciss: {
          obsidian: '#111111',
          gold: '#B08D57',
          whiteGold: '#D8D1C5',
          jade: '#145B4B',
          mist: '#C7D9D2',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        'gold-soft': 'var(--shadow-gold-soft)',
        'jade-soft': 'var(--shadow-jade-soft)',
        obsidian: 'var(--shadow-obsidian)',
      },
      transitionTimingFunction: {
        aciss: 'var(--ease-out)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
        slow: 'var(--motion-slow)',
      },
    },
  },
}
```

## 6. Typography tokens
| Token | Value | Use |
|---|---|---|
| Display family | Cormorant Garamond / Georgia fallback | Hero, page titles, chapter numbers. |
| Sans family | Inter / Helvetica Neue fallback | Body, nav, UI labels, forms. |
| H1 | clamp(3rem, 8vw, 7.5rem), line-height .88 | Editorial first impression. |
| H2 | clamp(2.25rem, 5vw, 5rem), line-height .95 | Major section shifts. |
| H3 | clamp(1.5rem, 3vw, 2.5rem), line-height 1.05 | Cards and page subsections. |
| Body | 1rem–1.125rem, line-height 1.75 | Reading comfort. |
| Small | .875rem, letter spacing .02em | Metadata and trust notes. |
| Label | .75rem uppercase, letter spacing .16em | Premium navigation/eyebrows. |

Rules:
- Spaced editorial typography, not cramped SaaS UI.
- Body copy must remain readable and cannot be hidden behind motion.
- Avoid all-caps long paragraphs.

## 7. Spacing, radius, and shadow tokens
Spacing:
- Mobile section padding: `4rem 1.25rem`.
- Desktop section padding: `7rem clamp(2rem, 6vw, 6rem)`.
- Container max width: `72rem`; editorial narrow width: `44rem`; wide hero width: `90rem`.

Radii:
- Buttons: pill.
- Cards: `1.5rem` or `2rem`.
- Form fields: `1rem`.

Shadows:
- Use soft gold/jade glows only as accents.
- Avoid generic gray shadows on black.

## 8. Motion tokens
| Token | Value | Use |
|---|---|---|
| Fast | 150ms | Hover/focus state. |
| Base | 260ms | CTA, cards, nav. |
| Slow | 700ms | Page and hero reveals. |
| Ease | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary ease-out. |
| Max parallax | 24px | Avoid nausea. |
| Max pointer tilt | 8deg | Book tilt only. |

Reduced motion:
- Respect `prefers-reduced-motion: reduce`.
- Disable cursor trail, parallax, page transition slide, and pointer tilt.
- Keep opacity-only or no animation.

## 9. WCAG AA contrast notes
Approximate contrast guidance:
- White Gold `#D8D1C5` on Obsidian `#111111`: acceptable for body text.
- Antique Gold `#B08D57` on Obsidian: acceptable for large text/accent; do not use as tiny body-only text without testing.
- Deep Jade `#145B4B` on White Gold: acceptable for large elements; body copy needs contrast testing.
- Soft Jade Mist `#C7D9D2` on Obsidian: high contrast and good for relief text.

Prompt 3 must include a token contrast test and manual design QA.

## 10. Deprecated hex cleanup plan
Before Prompt 3 completion:
1. Use tokenized classes and CSS variables only.
2. Search for deprecated hex values in `author-site/`.
3. If a deprecated hex appears in old copied content, replace with ACISS tokens or document why it is a historical reference.
4. Add a test that fails on the deprecated palette in app code.

## 11. Codemod/grep verification plan
Commands for Prompt 3:
```bash
rg -n "#0E0D0B|#B89968|#1F6F6B|#2B9999|#C9A961" author-site
rg -n "#111111|#B08D57|#D8D1C5|#145B4B|#C7D9D2" author-site/app author-site/components author-site/content author-site/lib
```
Expected:
- Deprecated search returns no app-code matches.
- Locked token search appears in token/config files and generated CSS only, not scattered as one-off values.
