import Link from "next/link";
import { IdeaToActionWorkbook } from "@/components/workbook/IdeaToActionWorkbook";
import { checkDownloadEntitlement } from "@/lib/entitlements";
import { getSessionUser } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "The Idea-to-Action Workbook",
  "The interactive buyer companion to Curls & Contemplation — 21 guided pages for choosing your strongest idea, working through fear, and building your next move.",
  { path: "/workbook" }
);

export const dynamic = "force-dynamic";

/**
 * /workbook — the interactive on-site edition of the Idea-to-Action Workbook.
 * Buyer-only: the entitlement check runs server-side against purchases
 * (book_slug "companion-workbook"), so the interactive experience never ships
 * HTML to someone who hasn't bought it. Buyers also get the printable PDF from
 * /downloads (same entitlement, storage path workbook/Idea-to-Action-Workbook.pdf).
 *
 * NOTE: page-view entitlement intentionally does NOT consume a download-cap
 * slot — the cap guards file downloads, not on-site use.
 */
export default async function WorkbookPage() {
  const user = await getSessionUser();
  const entitlement = await checkDownloadEntitlement(user, "workbook");

  // Working the pages on-site shouldn't be blocked by the file-download cap.
  const allowed = entitlement.allowed || entitlement.reason === "download_limit_reached";

  if (!allowed) {
    const needsLogin = !entitlement.allowed && entitlement.reason === "unauthenticated";
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="editorial-kicker">Exclusive buyer companion</p>
        <h1 className="mt-3 font-display text-4xl text-white md:text-5xl">The Idea-to-Action Workbook</h1>
        <p className="mt-5 leading-8 text-whitegold/80">
          Twenty-one guided pages for choosing your strongest idea, working through fear, and building your next move —
          interactive here on the site, plus a printable PDF for handwritten reflection.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          {needsLogin ? (
            <>
              <Link href="/login?next=/workbook" className="inline-flex items-center rounded-sm bg-antique px-7 py-3.5 text-sm font-semibold text-obsidian transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique">
                Log in to open your workbook
              </Link>
              <Link href="/order" className="inline-flex items-center rounded-sm border border-whitegold/35 px-7 py-3.5 text-sm text-whitegold transition-colors hover:border-antique hover:text-antique focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique">
                Get the workbook — $19.99
              </Link>
            </>
          ) : (
            <Link href="/order" className="inline-flex items-center rounded-sm bg-antique px-7 py-3.5 text-sm font-semibold text-obsidian transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique">
              Add the workbook to your order — $19.99
            </Link>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#fdfbf6" }}>
      <IdeaToActionWorkbook />
    </main>
  );
}
