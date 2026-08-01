import { LegalPageShell } from "@/components/LegalPageShell";
import { legalOutlines } from "@/content/legal-outlines";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Preorder Policy", "Preorder Policy outline for Curls & Contemplation.", { path: "/preorder-policy", noIndex: true });
export default function Page() { const items = legalOutlines.preorder; return <LegalPageShell title="Preorder Policy">{items.map((item) => <p key={item}>{item}</p>)}</LegalPageShell>; }
