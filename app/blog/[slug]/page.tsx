import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/content/blog";
import { PageHero } from "@/components/design/PageHero";
import { Section } from "@/components/design/Section";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { NewsletterForm } from "@/components/NewsletterForm";

export function generateStaticParams() { return posts.map((post) => ({ slug: post.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) return pageMetadata("Journal", "Curls & Contemplation editorial note.", { path: "/blog", type: "article" });
  return pageMetadata(post.title, post.excerpt, { path: `/blog/${post.slug}`, type: "article" });
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const jsonLd = blogPostingJsonLd(post.slug);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Journal", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` }
  ]);
  return (
    <main>
      {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <PageHero eyebrow={post.date} title={post.title} description={post.excerpt} primaryHref="/free-chapter" primaryLabel="Read Chapter 1 Free" secondaryHref="/blog" secondaryLabel="Back to Journal" />
      <Section eyebrow="Essay scaffold" title="A short note for the working creative.">
        <p>This editorial route is ready for Michael-approved copy. Placeholder language stays claim-safe and avoids testimonials, awards, or celebrity references.</p>
      </Section>
      <Section eyebrow="Keep reading" title="Letters worth reading.">
        <div className="max-w-2xl">
          <NewsletterForm source="blog" tone="card" cta="Send me the letters" />
        </div>
      </Section>
    </main>
  );
}
