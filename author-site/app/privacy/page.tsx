import { LegalPageShell } from "@/components/LegalPageShell";
import { legalOutlines } from "@/content/legal-outlines";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Privacy", "Privacy outline for Curls & Contemplation.", { path: "/privacy", noIndex: true });
export default function Page() { const items = legalOutlines.privacy; return <LegalPageShell title="Privacy">{items.map((item) => <p key={item}>{item}</p>)}</LegalPageShell>; }
