import { AdminSurface } from "@/components/AdminSurface";
import { UtilityShell } from "@/components/design/UtilityShell";
import { requireAdmin } from "@/lib/security";
import { pageMetadata } from "@/lib/seo";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = pageMetadata("Subscribers", "Admin Subscribers surface.", { path: "/admin/subscribers", noIndex: true });

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
  let content = <AdminSurface title="Subscribers" description="Admin-ready surface backed by future service-role routes, admin_users authorization, and noindex headers." />;

  if (supabase) {
    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      content = <div className="text-red-400">Error loading subscribers: {error.message}</div>;
    } else if (!subscribers || subscribers.length === 0) {
      content = <div className="text-whitegold/70">No subscribers found.</div>;
    } else {
      content = (
        <div className="overflow-x-auto rounded-xl border border-whitegold/10 bg-black/40">
          <table className="w-full text-left text-sm text-whitegold/80">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-whitegold/60">
              <tr>
                <th className="p-4 font-medium">Date Joined</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Source</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-whitegold/10">
              {subscribers.map((s) => (
                <tr key={s.id} className="hover:bg-white/5 transition">
                  <td className="p-4">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{s.email}</td>
                  <td className="p-4 text-antique">{s.source || "site"}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wider border ${s.status === 'active' ? 'border-jade/30 text-jade bg-jade/10' : 'border-whitegold/20 text-whitegold/70'}`}>
                      {s.status}
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
    <UtilityShell eyebrow="Authorized admin" title="Subscribers" description="Operational view of all mailing list subscribers and lead magnet entries.">
      <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
        <section className="editorial-panel rounded-[2rem] p-6">
          <h2 className="font-display text-3xl text-white">Subscribers</h2>
          <p className="mt-4 text-whitegold/75">Latest 50 subscribers across all funnels.</p>
        </section>
        <div className="flex flex-col gap-4">
          {content}
        </div>
      </div>
    </UtilityShell>
  );
}
