/**
 * Public chapter-preview content. Each entry carries UNIQUE body copy
 * (takeaways + focus) so the four /chapter/[slug] pages are genuinely
 * distinct documents — the near-duplicate template (one H1 swapped) was a
 * flagged SEO defect across every 2026-07 audit. Titles here are the public
 * part-level themes only; interior chapter titles and worksheet names never
 * appear on public pages (no-spoiler doctrine, PRD v2 §11).
 */
export const chapters = [
  {
    slug: "creative-excellence",
    title: "Creative Excellence",
    excerpt: "A steadier way to define the standard you are building toward.",
    focus: "Name what your work is actually worth — before anyone else prices it for you.",
    takeaways: [
      "Why 'good enough to stay booked' quietly caps what you charge, and the standard that replaces it.",
      "The difference between a portfolio that impresses stylists and one that moves clients.",
      "How to audit your own work the way an art director would — without the spiral."
    ]
  },
  {
    slug: "client-experience",
    title: "Client Experience",
    excerpt: "Premium service starts before the appointment and continues after the chair turns.",
    focus: "Shape the whole experience around your standard — so the price stops needing a defense.",
    takeaways: [
      "The touchpoints before and after the chair that decide whether a client rebooks — most stylists only manage the middle one.",
      "Boundary scripts that hold under pressure without burning the relationship.",
      "What premium actually signals at each price tier, and where yours leaks."
    ]
  },
  {
    slug: "business-rhythm",
    title: "Business Rhythm",
    excerpt: "Make the work easier to repeat without making it feel mechanical.",
    focus: "Build a working rhythm that refills what the calendar drains.",
    takeaways: [
      "Reading your own numbers so a slow week is information, not fear.",
      "The calendar architecture that keeps a full book from emptying you.",
      "Systems that repeat without turning the craft mechanical."
    ]
  },
  {
    slug: "contemplation",
    title: "Contemplation",
    excerpt: "Space to think, reset, and choose your next move with intention.",
    focus: "Protect the quiet space that keeps your judgment sharp when the calendar won't.",
    takeaways: [
      "Why burnout in this industry hides behind a full book and steady hands.",
      "The reset practices that fit between clients — not on a retreat you'll never take.",
      "Choosing the next career move from intention instead of momentum."
    ]
  }
] as const;
