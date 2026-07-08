import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { ContactForm } from "@/components/ContactForm";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { siteConfig } from "@/content/site";

export const metadata = pageMetadata("Contact", "Reach the studio — media, partnerships, and reader support for Curls & Contemplation by Michael David.", { path: "/contact" });

/** PRD v2 §4.5 — the quietest page on the site. Form first, mailto fallback,
 *  and a redirect strip that recaptures misrouted buyers. */
export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="Contact"
        title="Reach the studio."
        description="Media, partnerships, and reader support all land in one inbox — that's intentional. Michael reads these himself."
      />
      <section className="mx-auto w-full max-w-3xl px-5 pb-8 md:px-6">
        <ContactForm />
        <p className="mt-6 text-sm text-whitegold/70">
          Prefer email? Write to <a href={`mailto:${siteConfig.supportEmail}`} className="underline decoration-antique underline-offset-4">{siteConfig.supportEmail}</a>. One firm rule either way: never put payment details, passwords, or account secrets in the message body.
        </p>
      </section>
      <Section eyebrow="What to include" title="Help the reply land faster.">
        <ul className="space-y-3">
          <li><strong className="text-white">Order or download issue &mdash;</strong> the email address you used at checkout, and what you were trying to do when it broke.</li>
          <li><strong className="text-white">Media or press &mdash;</strong> your publication, the deadline, and what you need (excerpt, interview, cover image, quote).</li>
          <li><strong className="text-white">Rights or licensing &mdash;</strong> what you&rsquo;re proposing and the intended use.</li>
        </ul>
        <div className="mt-10 rounded-[1.5rem] border border-whitegold/10 p-6">
          <p className="text-whitegold/80">Looking for the book?</p>
          <div className="mt-4">
            <MagneticCurlButton href="/order">Go to the Order Page</MagneticCurlButton>
          </div>
        </div>
      </Section>
    </main>
  );
}
