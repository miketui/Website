import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { siteConfig } from "@/content/site";

export const metadata = pageMetadata("Contact", "Contact path for Curls & Contemplation support and media requests.", { path: "/contact" });

export default function Page() {
  return <main><PageHero eyebrow="Contact" title="Send the right note to the right place." description="Support, media, and rights requests should use the configured support inbox until the production domain is finalized." primaryHref={`mailto:${siteConfig.supportEmail}`} primaryLabel="Email Support" /><Section eyebrow="Support" title="What to include."><ul className="space-y-3"><li>Order email if you are asking about a purchase.</li><li>Media deadline and publication if you are requesting materials.</li><li>No secrets or payment details in the message body.</li></ul></Section></main>;
}
