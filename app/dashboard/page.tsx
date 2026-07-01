import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { pageMetadata } from "@/lib/seo";
import { getSessionUser, createServerSupabaseClient } from "@/lib/supabase/server";
import { orEquals } from "@/lib/supabase/filters";

export const metadata = pageMetadata("Dashboard", "Customer dashboard.", { path: "/dashboard", noIndex: true });

type PurchaseRow = {
  id: string;
  book_slug: string;
  status: string;
  entitlement_status: string;
  created_at: string;
  download_count: number | null;
};

async function loadPurchases(userId: string, email: string): Promise<PurchaseRow[]> {
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return [];
  const { data } = await supabase
    .from("purchases")
    .select("id, book_slug, status, entitlement_status, created_at, download_count")
    .or(orEquals([["user_id", userId], ["email", email]]))
    .order("created_at", { ascending: false });
  return (data as PurchaseRow[] | null) ?? [];
}

const bookLabels: Record<string, string> = {
  "curls-and-contemplation": "Curls & Contemplation — Direct Digital Edition",
  "affirmation-deck": "Affirmation Card Deck"
};

export default async function Page({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { checkout } = await searchParams;
  const user = await getSessionUser();
  const purchases = user ? await loadPurchases(user.id, user.email) : [];

  return (
    <DashboardShell title="Your account">
      {checkout === "success" ? (
        <div role="status" className="mb-6 rounded-3xl border border-antique/50 bg-jade/20 p-6">
          <h2 className="font-display text-3xl text-white">Payment received — thank you.</h2>
          <p className="mt-3 text-whitegold/80">
            Your receipt is on its way to your email. Your purchase should appear below within a moment — if it doesn&rsquo;t,{" "}
            <Link href="/contact" className="text-antique underline underline-offset-4">contact support</Link> with your order email.
          </p>
        </div>
      ) : null}

      {!user ? (
        <div className="editorial-panel mb-6 rounded-3xl p-6">
          <h2 className="font-display text-2xl text-white">Sign in to load your orders</h2>
          <p className="mt-2 text-whitegold/75">
            Your purchases and downloads appear here once you&rsquo;re signed in with your checkout email.{" "}
            <Link href="/login" className="text-antique underline underline-offset-4">Sign in</Link> or{" "}
            <Link href="/signup" className="text-antique underline underline-offset-4">create your account</Link>.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="editorial-panel rounded-3xl p-6">
            <h2 className="font-display text-3xl text-white">Purchases</h2>
            {purchases.length === 0 ? (
              <p className="mt-3 text-whitegold/75">No purchases on this account yet. Everything you buy with this email will appear here.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {purchases.map((purchase) => (
                  <li key={purchase.id} className="rounded-2xl border border-whitegold/15 bg-white/5 p-4">
                    <p className="font-semibold text-white">{bookLabels[purchase.book_slug] ?? purchase.book_slug}</p>
                    <p className="mt-1 text-sm text-whitegold/70">
                      Status: {purchase.entitlement_status === "active" ? "Active" : purchase.entitlement_status} · Purchased {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="editorial-panel rounded-3xl p-6">
            <h2 className="font-display text-2xl text-white">Downloads</h2>
            <p className="mt-3 text-whitegold/75">
              Request fresh signed links any time from <Link href="/downloads" className="text-antique underline underline-offset-4">the downloads page</Link>.
            </p>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
