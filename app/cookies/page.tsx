import { LegalPageShell } from "@/components/LegalPageShell";
import { legalOutlines } from "@/content/legal-outlines";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Cookies", "Cookies outline for Curls & Contemplation.", { path: "/cookies", noIndex: true });
export default function Page() { const items = legalOutlines.cookies; return <LegalPageShell title="Cookies">{items.map((item) => <p key={item}>{item}</p>)}</LegalPageShell>; }
