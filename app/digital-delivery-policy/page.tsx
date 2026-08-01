import { LegalPageShell } from "@/components/LegalPageShell";
import { legalOutlines } from "@/content/legal-outlines";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Digital Delivery Policy", "Digital Delivery Policy outline for Curls & Contemplation.", { path: "/digital-delivery-policy", noIndex: true });
export default function Page() { const items = legalOutlines.delivery; return <LegalPageShell title="Digital Delivery Policy">{items.map((item) => <p key={item}>{item}</p>)}</LegalPageShell>; }
