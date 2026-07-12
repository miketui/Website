import { posts } from "@/content/blog";
import { BlogCard } from "@/components/BlogCard";
import { Section } from "@/components/design/Section";
import { PageHero } from "@/components/design/PageHero";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Blog", "Editorial posts for the Curls & Contemplation funnel.", { path: "/blog" });
export default function BlogPage() { return <main><PageHero eyebrow="Journal" title="Notes on craft, business, and a sustainable creative life." description="Short, practical essays for independent creatives building clearer standards, stronger systems, and work that can last." primaryHref="/pricing-kit" primaryLabel="Get the Free Pricing Kit" /><Section eyebrow="Latest" title="Read with room to think."><div className="grid gap-5 md:grid-cols-2">{posts.map((post) => <BlogCard key={post.slug} post={post} />)}</div></Section></main>; }
