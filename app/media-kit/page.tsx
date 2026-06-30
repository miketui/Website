import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";

export const metadata = pageMetadata("Media Kit", "Claim-safe media kit scaffold for Curls & Contemplation.", { path: "/media-kit" });

export default function Page() {
  return <main><PageHero eyebrow="Media kit" title="Press materials without inflated claims." description="This surface is prepared for approved bios, cover art, and release notes after human review." primaryHref="/contact" primaryLabel="Request Materials" /><Section eyebrow="Approved-use placeholders" title="What is ready and what still needs approval."><div className="grid gap-5 md:grid-cols-3"><div className="editorial-panel rounded-3xl p-5">Book summary scaffold</div><div className="editorial-panel rounded-3xl p-5">Author bio pending claim review</div><div className="editorial-panel rounded-3xl p-5">Cover assets pending final approval</div></div></Section></main>;
}
