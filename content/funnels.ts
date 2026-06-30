/**
 * Funnels 2–4 scaffold data (per CURLS_FOUR_FUNNELS v2).
 * STAGED — NOT LIVE: no email capture, no checkout, no automation runs from
 * these structures until the owner's activation gates. Funnel 1 is the live spine.
 */

export const FUNNELS_STAGED = true as const;

export type QuizArchetype = {
  slug: string;
  name: string;
  bookPart: string;
  diagnosis: string;
  worksheetPath: string; // curls-free public bucket, uploaded by owner
  chapterSlug: string;
};

export const quizArchetypes: QuizArchetype[] = [
  {
    slug: "underpriced-artist",
    name: "The Underpriced Artist",
    bookPart: "Part I",
    diagnosis: "Your hands are senior. Your prices are junior. The gap between the two is paid for out of your own energy, every single week — and closing it starts with a rate floor, not a pep talk.",
    worksheetPath: "quiz/worksheet-underpriced-artist.pdf",
    chapterSlug: "creative-excellence"
  },
  {
    slug: "invisible-talent",
    name: "The Invisible Talent",
    bookPart: "Part II",
    diagnosis: "The work is excellent and the room doesn't know it. Visibility is not vanity — it is the client experience starting before the chair, and it can be built deliberately.",
    worksheetPath: "quiz/worksheet-invisible-talent.pdf",
    chapterSlug: "client-experience"
  },
  {
    slug: "burned-out-booked",
    name: "The Burned-Out Booked",
    bookPart: "Part III",
    diagnosis: "A full calendar that quietly empties you is not success — it is a business rhythm problem wearing a busy costume. The ledger of energy in versus income out tells the truth.",
    worksheetPath: "quiz/worksheet-burned-out-booked.pdf",
    chapterSlug: "business-rhythm"
  },
  {
    slug: "almost-ceo",
    name: "The Almost-CEO",
    bookPart: "Part IV",
    diagnosis: "You already lead — your standards, your set, your clients. What's missing is the reflective structure that turns instinct into a repeatable map you can scale without losing the craft.",
    worksheetPath: "quiz/worksheet-almost-ceo.pdf",
    chapterSlug: "contemplation"
  }
];

export const quizQuestions = [
  "When a client asks your rate, what happens in the second before you answer?",
  "Where does your next booking usually come from?",
  "What does the night before a fully booked day feel like?",
  "When did you last raise your prices — and what made you do it?",
  "Which rooms are you in that move your career? Which ones aren't you in?",
  "If your business kept its current rhythm for five more years, what would be left of your creativity?"
] as const;

/**
 * Interactive quiz model. Each question offers one option per archetype; the
 * archetype with the most selected options wins (ties resolve to the earliest
 * archetype in `quizArchetypes`, keeping scoring deterministic and testable).
 */
export type QuizOption = { label: string; archetype: QuizArchetype["slug"] };
export type QuizItem = { question: string; options: QuizOption[] };

export const quizItems: QuizItem[] = [
  {
    question: "When a client asks your rate, what happens in the second before you answer?",
    options: [
      { label: "I brace, then quote a little lower than I meant to.", archetype: "underpriced-artist" },
      { label: "I wonder if they even know what I'm capable of.", archetype: "invisible-talent" },
      { label: "I calculate whether I have the energy to take it on.", archetype: "burned-out-booked" },
      { label: "I quote it cleanly — the number isn't the hard part anymore.", archetype: "almost-ceo" }
    ]
  },
  {
    question: "Where does your next booking usually come from?",
    options: [
      { label: "Honestly, I'm not sure — it's unpredictable.", archetype: "invisible-talent" },
      { label: "Referrals who expect my old, lower price.", archetype: "underpriced-artist" },
      { label: "Existing clients, back-to-back, with no room to breathe.", archetype: "burned-out-booked" },
      { label: "A pipeline I built on purpose.", archetype: "almost-ceo" }
    ]
  },
  {
    question: "What does the night before a fully booked day feel like?",
    options: [
      { label: "Dread — even though it's good news.", archetype: "burned-out-booked" },
      { label: "I'm calculating whether the day is even worth what I'll net.", archetype: "underpriced-artist" },
      { label: "Quiet. I wish more of the right people knew to book me.", archetype: "invisible-talent" },
      { label: "Calm. The day is designed, not survived.", archetype: "almost-ceo" }
    ]
  },
  {
    question: "When did you last raise your prices — and what made you do it?",
    options: [
      { label: "I genuinely can't remember the last time.", archetype: "underpriced-artist" },
      { label: "When I hit a wall — not on a plan.", archetype: "burned-out-booked" },
      { label: "I would, but I'm not sure I can justify it to them.", archetype: "invisible-talent" },
      { label: "On a schedule I set, tied to my standards.", archetype: "almost-ceo" }
    ]
  },
  {
    question: "Which rooms move your career — and which ones aren't you in?",
    options: [
      { label: "There are rooms I should be in that don't know my name.", archetype: "invisible-talent" },
      { label: "I'm in rooms that quietly undervalue what I charge.", archetype: "underpriced-artist" },
      { label: "I'm too booked to get into any new rooms.", archetype: "burned-out-booked" },
      { label: "I choose my rooms deliberately.", archetype: "almost-ceo" }
    ]
  },
  {
    question: "If your business kept its current rhythm for five more years, what would be left of your creativity?",
    options: [
      { label: "Honestly? Not much — I'd be running on fumes.", archetype: "burned-out-booked" },
      { label: "I'd be just as skilled and still underpaid.", archetype: "underpriced-artist" },
      { label: "Great work that nobody discovered.", archetype: "invisible-talent" },
      { label: "A real practice — I just want the map to scale it.", archetype: "almost-ceo" }
    ]
  }
];

export function scoreQuiz(answers: string[]): QuizArchetype {
  const tally: Record<string, number> = {};
  for (const slug of answers) tally[slug] = (tally[slug] ?? 0) + 1;
  let best = quizArchetypes[0];
  let bestCount = -1;
  for (const archetype of quizArchetypes) {
    const count = tally[archetype.slug] ?? 0;
    if (count > bestCount) {
      best = archetype;
      bestCount = count;
    }
  }
  return best;
}

export type ChallengeDay = {
  day: number;
  title: string;
  worksheetPath: string;
};

export const challengeDays: ChallengeDay[] = [
  { day: 1, title: "Price like a professional", worksheetPath: "challenge/day-1-rate-floor.pdf" },
  { day: 2, title: "The room you're not in", worksheetPath: "challenge/day-2-networking-script.pdf" },
  { day: 3, title: "Etiquette that books repeat work", worksheetPath: "challenge/day-3-set-day-checklist.pdf" },
  { day: 4, title: "The burnout ledger", worksheetPath: "challenge/day-4-energy-income-audit.pdf" },
  { day: 5, title: "Put it together + the pitch", worksheetPath: "challenge/day-5-career-map.pdf" }
];

/** Funnel 4 back-end ladder — prices PROPOSED, not locked. Activation is the owner's gate. */
export const ascensionProducts = [
  { slug: "companion-workbook", name: "Companion Workbook", proposedPrice: "$19.99", bucketPath: "workbook/Companion-Workbook-v1.pdf" },
  { slug: "audio-companion", name: "Audio Companion", proposedPrice: "$12.99", bucketPath: "audio/Audio-Companion-v1.zip" },
  { slug: "stylist-toolkit", name: "Stylist Business Toolkit", proposedPrice: "$47", bucketPath: "toolkit/" }
] as const;
