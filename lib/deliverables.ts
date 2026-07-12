/** Pure, client-safe deliverable metadata. No server-only imports here — this
 * file is used by both client components (DownloadList) and server code
 * (lib/downloads.ts). Never add a server-only import to this file. */
export const deliverables = {
  epub: { slug: "epub", label: "EPUB", path: "books/curls-and-contemplation/epub/Curls-and-Contemplation-v13-KDP-EPUB-FINAL.epub" },
  daily_directives_bundle: { slug: "daily_directives_bundle", label: "Daily Directives — Complete 12-Set Bundle", path: "daily-directives/Daily-Directives-Complete-12-Set-Bundle.zip" },
  daily_directives_set_01: { slug: "daily_directives_set_01", label: "Daily Directives — Permission to Begin", path: "daily-directives/sets/Daily-Directives-Set-01-Permission-to-Begin.zip" },
  daily_directives_set_02: { slug: "daily_directives_set_02", label: "Daily Directives — The Discipline of Showing Up", path: "daily-directives/sets/Daily-Directives-Set-02-The-Discipline-of-Showing-Up.zip" },
  daily_directives_set_03: { slug: "daily_directives_set_03", label: "Daily Directives — Visible on Purpose", path: "daily-directives/sets/Daily-Directives-Set-03-Visible-on-Purpose.zip" },
  daily_directives_set_04: { slug: "daily_directives_set_04", label: "Daily Directives — The Price of Your Gifts", path: "daily-directives/sets/Daily-Directives-Set-04-The-Price-of-Your-Gifts.zip" },
  daily_directives_set_05: { slug: "daily_directives_set_05", label: "Daily Directives — Boundaries Build the Brand", path: "daily-directives/sets/Daily-Directives-Set-05-Boundaries-Build-the-Brand.zip" },
  daily_directives_set_06: { slug: "daily_directives_set_06", label: "Daily Directives — Creative Recovery", path: "daily-directives/sets/Daily-Directives-Set-06-Creative-Recovery.zip" },
  daily_directives_set_07: { slug: "daily_directives_set_07", label: "Daily Directives — Trust Your Taste", path: "daily-directives/sets/Daily-Directives-Set-07-Trust-Your-Taste.zip" },
  daily_directives_set_08: { slug: "daily_directives_set_08", label: "Daily Directives — Rooms I Belong In", path: "daily-directives/sets/Daily-Directives-Set-08-Rooms-I-Belong-In.zip" },
  daily_directives_set_09: { slug: "daily_directives_set_09", label: "Daily Directives — The Courage to Pivot", path: "daily-directives/sets/Daily-Directives-Set-09-The-Courage-to-Pivot.zip" },
  daily_directives_set_10: { slug: "daily_directives_set_10", label: "Daily Directives — Built from Evidence", path: "daily-directives/sets/Daily-Directives-Set-10-Built-from-Evidence.zip" },
  daily_directives_set_11: { slug: "daily_directives_set_11", label: "Daily Directives — Legacy in Motion", path: "daily-directives/sets/Daily-Directives-Set-11-Legacy-in-Motion.zip" },
  daily_directives_set_12: { slug: "daily_directives_set_12", label: "Daily Directives — The Version I’m Becoming", path: "daily-directives/sets/Daily-Directives-Set-12-The-Version-Im-Becoming.zip" },
  workbook: { slug: "workbook", label: "Idea-to-Action Workbook (PDF)", path: "workbook/Idea-to-Action-Workbook.pdf" }
} as const;

export type DeliverableSlug = keyof typeof deliverables;
