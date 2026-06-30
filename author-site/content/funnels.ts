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
