import { AdminSurface } from "@/components/AdminSurface";
import { UtilityShell } from "@/components/design/UtilityShell";
import { requireAdmin } from "@/lib/security";
import { pageMetadata } from "@/lib/seo";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata = pageMetadata("Orders", "Admin Orders surface.", { path: "/admin/orders", noIndex: true });

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
  let content = <AdminSurface title="Orders" description="Admin-ready surface backed by future service-role routes, admin_users authorization, and noindex headers." />;

  if (supabase) {
    const { data: purchases, error } = await supabase
      .from("purchases")
      .select("*, orders(amount_cents, created_at)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      content = <div className="text-red-400">Error loading orders: {error.message}</div>;
    } else if (!purchases || purchases.length === 0) {
      content = <div className="text-whitegold/70">No orders found.</div>;
    } else {
      content = (
        <div className="overflow-x-auto rounded-xl border border-whitegold/10 bg-black/40">
          <table className="w-full text-left text-sm text-whitegold/80">
            <thead className="bg-white/5 text-xs uppercase tracking-wider text-whitegold/60">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Item</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Downloads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-whitegold/10">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition">
                  <td className="p-4">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="p-4">{p.email || "Unknown"}</td>
                  <td className="p-4 font-medium text-antique">{p.book_slug}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-1 text-[10px] uppercase tracking-wider border ${p.status === 'active' ? 'border-jade/30 text-jade bg-jade/10' : 'border-whitegold/20 text-whitegold/70'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">{p.download_count || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  return (
    <UtilityShell eyebrow="Authorized admin" title="Orders" description="Operational view of all customer purchases and fulfillment status.">
      <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr]">
        <section className="editorial-panel rounded-[2rem] p-6">
          <h2 className="font-display text-3xl text-white">Orders</h2>
          <p className="mt-4 text-whitegold/75">Latest 50 purchases and entitlements.</p>
        </section>
        <div className="flex flex-col gap-4">
          {content}
        </div>
      </div>
    </UtilityShell>
  );
}
