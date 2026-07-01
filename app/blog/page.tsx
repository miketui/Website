import { posts } from "@/content/blog";
import { BlogCard } from "@/components/BlogCard";
import { Section } from "@/components/design/Section";
import { PageHero } from "@/components/design/PageHero";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Blog", "Editorial posts for the Curls & Contemplation funnel.", { path: "/blog" });
export default function BlogPage() { return <main><PageHero eyebrow="Journal" title="Notes from the chair, in progress." description="Short, claim-safe essays for freelancers building a calmer, better-paid version of this work." primaryHref="/free-chapter" primaryLabel="Read Chapter 1 Free" /><Section eyebrow="Latest" title="Read with room to think."><div className="grid gap-5 md:grid-cols-2">{posts.map((post) => <BlogCard key={post.slug} post={post} />)}</div></Section></main>; }
