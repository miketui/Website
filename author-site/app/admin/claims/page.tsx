import { AdminSurface } from "@/components/AdminSurface";
import { UtilityShell } from "@/components/design/UtilityShell";
import { requireAdmin } from "@/lib/security";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Claims", "Admin Claims surface.", { path: "/admin/claims", noIndex: true });
export default async function Page() { const admin = await requireAdmin(); if (!admin.ok) return <UtilityShell eyebrow="Admin" title="Admin gated" description={admin.reason}><div className="editorial-panel rounded-3xl p-6 text-whitegold/75">Authentication and authorization are required before this surface shows operational data.</div></UtilityShell>; return <UtilityShell eyebrow="Authorized admin" title="Claims" description="Operational scaffold for protected commerce and content review."><AdminSurface title="Claims" description="Admin-ready surface backed by future service-role routes, admin_users authorization, and noindex headers." /></UtilityShell>; }
