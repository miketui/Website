export const dailyDirectiveSets = [
  { number: 1, slug: "permission-to-begin", title: "Permission to Begin", focus: "Begin before certainty arrives." },
  { number: 2, slug: "discipline-of-showing-up", title: "The Discipline of Showing Up", focus: "Build trust through consistent action." },
  { number: 3, slug: "visible-on-purpose", title: "Visible on Purpose", focus: "Let the right people see your work." },
  { number: 4, slug: "price-of-your-gifts", title: "The Price of Your Gifts", focus: "Name the value of your expertise." },
  { number: 5, slug: "boundaries-build-the-brand", title: "Boundaries Build the Brand", focus: "Protect the standards behind the work." },
  { number: 6, slug: "creative-recovery", title: "Creative Recovery", focus: "Restore the energy your craft requires." },
  { number: 7, slug: "trust-your-taste", title: "Trust Your Taste", focus: "Strengthen your creative point of view." },
  { number: 8, slug: "rooms-i-belong-in", title: "Rooms I Belong In", focus: "Practice belonging before permission." },
  { number: 9, slug: "courage-to-pivot", title: "The Courage to Pivot", focus: "Choose alignment over attachment." },
  { number: 10, slug: "built-from-evidence", title: "Built from Evidence", focus: "Let proof answer self-doubt." },
  { number: 11, slug: "legacy-in-motion", title: "Legacy in Motion", focus: "Make daily choices that outlive the moment." },
  { number: 12, slug: "version-im-becoming", title: "The Version I\u2019m Becoming", focus: "Act in partnership with your future self." }
] as const;

export const dailyDirectives = {
  name: "Daily Directives",
  bundleName: "Daily Directives — Complete 12-Set Digital Bundle",
  cardsPerSet: 31,
  totalCards: 372,
  individualPrice: 7.99,
  bundlePrice: 59
} as const;

export type DailyDirectiveSet = (typeof dailyDirectiveSets)[number];
export type DailyDirectiveSku = `daily_directives_set_${
  | "01" | "02" | "03" | "04" | "05" | "06"
  | "07" | "08" | "09" | "10" | "11" | "12"}`;

export function dailyDirectiveSku(number: number): DailyDirectiveSku {
  return `daily_directives_set_${String(number).padStart(2, "0")}` as DailyDirectiveSku;
}
