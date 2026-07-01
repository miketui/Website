import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { siteConfig } from "@/content/site";

export const metadata = pageMetadata("Contact", "Reach Michael David directly for support, media, and rights requests about Curls & Contemplation.", { path: "/contact" });

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="One inbox. A real person reads it."
        description="Support, media, and rights requests all route to the same place for now — that's intentional. Michael reads these himself."
        primaryHref={`mailto:${siteConfig.supportEmail}`}
        primaryLabel="Email Support"
      />
      <Section eyebrow="What to include" title="Help the reply land faster.">
        <ul className="space-y-3">
          <li><strong className="text-white">Order or download issue —</strong> the email address you used at checkout, and what you were trying to do when it broke.</li>
          <li><strong className="text-white">Media or press —</strong> your publication, the deadline, and what you need (excerpt, interview, cover image, quote).</li>
          <li><strong className="text-white">Rights or licensing —</strong> what you&rsquo;re proposing and the intended use.</li>
          <li><strong className="text-white">Everything else —</strong> just say what&rsquo;s going on. No wrong way to start this.</li>
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-whitegold/70">One firm rule either way: never put payment details, passwords, or account secrets in the message body. If something needs to be verified securely, we&rsquo;ll ask for it the right way.</p>
      </Section>
    </main>
  );
}
