import { AdminSurface } from "@/components/AdminSurface";
import { UtilityShell } from "@/components/design/UtilityShell";
import { requireAdmin } from "@/lib/security";
import { pageMetadata } from "@/lib/seo";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = pageMetadata("Claims", "Admin Claims surface.", { path: "/admin/claims", noIndex: true });

export default async function Page() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return (
      <UtilityShell eyebrow="Admin" title="Admin gated" description={admin.reason}>
        <div className="editorial-panel rounded-3xl p-6 text-whitegold/75">
          Authentication and authorization are required before this surface shows operational data.
        </div>
      </UtilityShell>
    );
  }

  const supabase = createServerSupabaseClient(true);
  let content = <AdminSurface title="Claims" description="Admin-ready surface backed by future service-role routes, admin_users authorization, and noindex headers." />;

  if (supabase) {
    const { data: claims, error } = await supabase
      .from("bonus_claims")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      content = <div className="text-red-400">Error loading claims: {error.message}</div>;
    } else if (!claims || claims.length === 0) {
      content = <div className="text-whitegold/70">No bonus claims found.</div>;
    } else {
      content = (
        <div className="overflow-x-auto rounded-xl border border-whitegold/10 bg-black/40">
          <table className="w-full text-left text-sm text-whitegold/80">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-whitegold/60">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Note</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-whitegold/10">
              {claims.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition">
                  <td className="p-4">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{c.email}</td>
                  <td className="p-4 truncate max-w-[200px]" title={c.note || ""}>{c.note || "—"}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wider border ${
                      c.status === 'fulfilled' || c.status === 'approved' ? 'border-jade/30 text-jade bg-jade/10' :
                      c.status === 'rejected' ? 'border-red-400/30 text-red-400 bg-red-400/10' :
                      'border-antique/30 text-antique bg-antique/10'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  return (
    <UtilityShell eyebrow="Authorized admin" title="Bonus Claims" description="Operational view of manual Kindle receipt bonus claims.">
      <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
        <section className="editorial-panel rounded-[2rem] p-6">
          <h2 className="font-display text-3xl text-white">Bonus Claims</h2>
          <p className="mt-4 text-whitegold/75">Latest 50 submitted third-party receipts.</p>
        </section>
        <div className="flex flex-col gap-4">
          {content}
        </div>
      </div>
    </UtilityShell>
  );
}
