import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Dashboard", "Customer dashboard.", { path: "/dashboard", noIndex: true });

export default async function Page({ searchParams }: { searchParams: Promise<{ checkout?: string }> }) {
  const { checkout } = await searchParams;
  return (
    <DashboardShell title="Your account">
      {checkout === "success" ? (
        <div role="status" className="mb-6 rounded-3xl border border-antique/50 bg-jade/20 p-6">
          <h2 className="font-display text-3xl text-white">Payment received — thank you.</h2>
          <p className="mt-3 text-whitegold/80">
            Your receipt is on its way to your email. To unlock your downloads, <Link href="/login" className="text-antique underline underline-offset-4">sign in</Link> — or{" "}
            <Link href="/signup" className="text-antique underline underline-offset-4">create your account</Link> — with the same email you used at checkout, then head to{" "}
            <Link href="/downloads" className="text-antique underline underline-offset-4">your downloads</Link>.
          </p>
        </div>
      ) : null}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="editorial-panel rounded-3xl p-6">
          <h2 className="font-display text-3xl text-white">Purchases</h2>
          <p className="mt-3 text-whitegold/75">Your order history lives here once you&rsquo;re signed in with your checkout email.</p>
        </div>
        <div className="editorial-panel rounded-3xl p-6">
          <h2 className="font-display text-3xl text-white">Downloads</h2>
          <p className="mt-3 text-whitegold/75">
            Request fresh signed links any time from <Link href="/downloads" className="text-antique underline underline-offset-4">the downloads page</Link>.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
