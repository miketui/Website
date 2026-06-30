import { UtilityShell } from "@/components/design/UtilityShell";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Bonus Claim", "Customer bonus claim scaffold.", { path: "/bonus-claim", noIndex: true });
export default function Page() { return <UtilityShell eyebrow="Customer area" title="Claim your preorder bonus." description="The claim flow is scaffolded only; final bonus assets and rules require Michael's approval before launch."><div className="editorial-panel rounded-3xl p-6"><p className="text-whitegold/75">Submit your order email after launch to verify eligibility. No subscription offer is active.</p></div></UtilityShell>; }
