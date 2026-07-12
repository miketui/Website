import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata = pageMetadata(
  "Subscribe",
  "Join Curls & Contemplation for practical tools and thoughtful guidance for a more sustainable creative career.",
  { path: "/subscribe" }
);

export default function Page() {
  return (
    <main>
      <PageHero
        eyebrow="The letter"
        title="Stay close to the journey."
        description="Choose what would serve you most. Your answers shape the notes and tools you receive; they are never sold."
      />
      <section className="mx-auto w-full max-w-3xl px-5 pb-24 md:px-6">
        <NewsletterForm
          source="subscription-intake"
          heading="Your Curls & Contemplation subscription"
          copy="Practical guidance on pricing, creative identity, sustainable systems, leadership, and well-being—plus book and product updates."
          cta="Join the Letter"
          collectProfile
        />
      </section>
    </main>
  );
}
