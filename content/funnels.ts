/**
 * Funnels 2–4 data (per CURLS_FOUR_FUNNELS v2 / PRD v2 §4.7–4.8).
 * Funnels 2 (/quiz) and 3 (/challenge) are LIVE and wired: quiz capture posts
 * to /api/quiz (MailerLite group MAILERLITE_GROUP_QUIZ), challenge signups
 * post to /api/subscribe with source="challenge". Funnel 4 (ascension ladder)
 * remains proposal-only until the owner's activation gate.
 */

export const FUNNELS_STAGED = false as const;

export type QuizArchetype = {
  slug: string;
  name: string;
  focus: string;
  diagnosis: string;
  strength: string;
  risk: string;
  nextStep: string;
  worksheetPath: string; // curls-free public bucket, uploaded by owner
};

export const quizArchetypes: QuizArchetype[] = [
  {
    slug: "underpriced-artist",
    name: "The Underpriced Artist",
    focus: "Pricing clarity",
    diagnosis: "Your hands are senior. Your prices are junior. The gap between the two is paid for out of your own energy, every single week — and closing it starts with a rate floor, not a pep talk.",
    strength: "the care and generosity you bring to the work",
    risk: "letting fear or old expectations set the price before your evidence does",
    nextStep: "calculate your rate floor and write one clean quote sentence",
    worksheetPath: "quiz/worksheet-underpriced-artist.pdf",
  },
  {
    slug: "invisible-talent",
    name: "The Invisible Talent",
    focus: "Intentional visibility",
    diagnosis: "The work is excellent and the room doesn't know it. Visibility is not vanity — it is the client experience starting before the chair, and it can be built deliberately.",
    strength: "the depth of your craft and your instinct to let the work speak",
    risk: "assuming excellent work will be discovered without a visibility system",
    nextStep: "choose one proof of work and share it with the room you want to enter",
    worksheetPath: "quiz/worksheet-invisible-talent.pdf",
  },
  {
    slug: "burned-out-booked",
    name: "The Burned-Out Booked",
    focus: "Sustainable rhythm",
    diagnosis: "A full calendar that quietly empties you is not success — it is a business rhythm problem wearing a busy costume. The ledger of energy in versus income out tells the truth.",
    strength: "your reliability and capacity to carry a full book",
    risk: "using availability as the only measure of a successful practice",
    nextStep: "track energy in and income out for one working week",
    worksheetPath: "quiz/worksheet-burned-out-booked.pdf",
  },
  {
    slug: "almost-ceo",
    name: "The Almost-CEO",
    focus: "Leadership systems",
    diagnosis: "You already lead — your standards, your set, your clients. What's missing is the reflective structure that turns instinct into a repeatable map you can scale without losing the craft.",
    strength: "the standards and leadership you already practice",
    risk: "keeping those standards in your head instead of turning them into systems",
    nextStep: "document one repeatable decision or process before the end of this week",
    worksheetPath: "quiz/worksheet-almost-ceo.pdf",
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
