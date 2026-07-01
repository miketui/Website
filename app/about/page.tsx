import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";

export const metadata = pageMetadata("About", "Michael David writes Curls & Contemplation from lived hairstylist practice, not borrowed theory.", { path: "/about" });

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="About Michael"
        title="Brooklyn taught me the chair. The rest I learned the expensive way."
        description="Michael David is a working hairstylist and creative director, raised in Brooklyn and based in Los Angeles now. Curls & Contemplation is what he wishes someone had handed him before the bookings got real."
        primaryHref="/book"
        primaryLabel="Explore the Book"
        secondaryHref="/contact"
        secondaryLabel="Contact"
      />
      <Section eyebrow="The vantage point" title="Written from the chair, not the podium.">
        <p className="max-w-3xl">Every page of this book started as a note to himself — after a pricing conversation that went sideways, after a set day that ran too fast to think on, after a booking he almost turned down out of fear instead of judgment. He kept the notes. Eventually there were enough of them to become a map, so the next hairstylist wouldn&rsquo;t have to learn the same lessons alone, at full price.</p>
        <p className="mt-4 max-w-3xl text-sm text-whitegold/70">That&rsquo;s also why this site doesn&rsquo;t trade in borrowed authority — no client list as a substitute for the argument, no manufactured praise. If a claim can&rsquo;t survive Michael saying it to your face, it doesn&rsquo;t go on the page.</p>
      </Section>
      <Section eyebrow="Beyond the chair" title="The work that shapes the writing.">
        <p className="max-w-3xl">Outside the book, Michael leads Haus of Basquiat, a ballroom community built on the same principle the book runs on: standards and belonging aren&rsquo;t opposites. Chosen family, competitive craft, and real accountability can share a room. That&rsquo;s the same tension every freelancer navigates alone in their own business — how to hold a standard without losing the people it&rsquo;s for.</p>
      </Section>
    </main>
  );
}
