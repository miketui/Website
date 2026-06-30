import { LegalPageShell } from "@/components/LegalPageShell";
import { legalOutlines } from "@/content/legal-outlines";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Terms", "Terms outline for Curls & Contemplation.", { path: "/terms", noIndex: true });
export default function Page() { const items = legalOutlines.terms; return <LegalPageShell title="Terms">{items.map((item) => <p key={item}>{item}</p>)}</LegalPageShell>; }
