import { LegalPageShell } from "@/components/LegalPageShell";
import { legalOutlines } from "@/content/legal-outlines";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Accessibility", "Accessibility outline for Curls & Contemplation.", { path: "/accessibility", noIndex: true });
export default function Page() { const items = legalOutlines.accessibility; return <LegalPageShell title="Accessibility">{items.map((item) => <p key={item}>{item}</p>)}</LegalPageShell>; }
