import { LegalPageShell } from "@/components/LegalPageShell";
import { legalOutlines } from "@/content/legal-outlines";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Refund Policy", "Refund Policy outline for Curls & Contemplation.", { path: "/refund-policy", noIndex: true });
export default function Page() { const items = legalOutlines.refund; return <LegalPageShell title="Refund Policy">{items.map((item) => <p key={item}>{item}</p>)}</LegalPageShell>; }
