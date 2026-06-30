import { DashboardShell } from "@/components/DashboardShell";
import { DownloadList } from "@/components/DownloadList";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Downloads", "Protected customer downloads.", { path: "/downloads", noIndex: true });
export default function Page() { return <DashboardShell title="Protected downloads"><DownloadList /><p className="mt-6 text-sm text-whitegold/70">Your files arrive as private signed links — up to 3 downloads per file over 7 days. If a link expires, sign back in and request a fresh one. Trouble? The contact page reaches a human.</p></DashboardShell>; }
