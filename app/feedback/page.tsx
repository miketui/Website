import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/design/PageHero";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata = pageMetadata("Reader Feedback", "Share a private reflection about Curls & Contemplation or the Daily Directives collection.", { path: "/feedback", noIndex: true });

export default function Page() {
  return <main><PageHero eyebrow="Reader reflection" title="What is staying with you?" description="Share what resonated, what shifted, or what you would like Michael to understand. Nothing is published automatically." /><section className="mx-auto w-full max-w-3xl px-5 pb-24 md:px-6"><FeedbackForm /></section></main>;
}
