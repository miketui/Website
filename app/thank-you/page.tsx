import Link from "next/link";
import { UtilityShell } from "@/components/design/UtilityShell";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { pageMetadata } from "@/lib/seo";
import { freeChapterLinks } from "@/lib/free-assets";
import { publicEnv } from "@/lib/env";

export const metadata = pageMetadata("Thank You", "Chapter 1 is on its way — and here's what comes next.", { path: "/thank-you", noIndex: true });

export default async function Page({ searchParams }: { searchParams: Promise<{ delivery?: string }> }) {
  const { delivery } = await searchParams;
  const links = freeChapterLinks();
  const videoId = publicEnv.NEXT_PUBLIC_THANKYOU_VIDEO_ID;
  const emailSent = delivery !== "pending";

  return (
    <UtilityShell
      eyebrow={emailSent ? "Chapter 1 is on its way" : "Your chapter is reserved"}
      title={emailSent ? "Check your inbox. Then meet me here." : "You're on the list. Here's what happens next."}
      description={
        emailSent
          ? "Your chapter and the Pricing Confidence Checklist are headed to your email right now. While they land, sixty seconds on what this book is actually for."
          : "Your address is saved and Chapter 1 will reach you the moment delivery goes live — no need to sign up twice. Meanwhile, sixty seconds on what this book is actually for."
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="editorial-panel overflow-hidden rounded-[2rem]">
          {videoId ? (
            <div className="relative aspect-video">
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title="A sixty-second welcome from Michael David"
                loading="lazy"
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <figure className="flex aspect-video flex-col items-center justify-center p-8 text-center md:p-12">
              <blockquote className="max-w-md font-display text-3xl leading-tight text-white md:text-4xl">
                &ldquo;Your craft is not the problem. The missing map is.&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm uppercase tracking-[0.18em] text-antique">— the idea Chapter 1 opens</figcaption>
            </figure>
          )}
        </div>
        <div>
          <h2 className="font-display text-3xl leading-tight text-white md:text-4xl">If Chapter 1 reads like your week, the rest is the map.</h2>
          <p className="mt-4 leading-8 text-whitegold/80">
            The direct edition is <strong className="text-white">$17.99</strong>{" "}right now. Fifteen days after release it becomes $19.99 — permanently. That schedule is real — it&rsquo;s in the preorder policy — and it is the only urgency you&rsquo;ll ever get from me. No timers. No &ldquo;only 3 left&rdquo; of a digital file.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <MagneticCurlButton href="/preorder">Preorder — $17.99</MagneticCurlButton>
            <MagneticCurlButton href="/chapters" variant="secondary">Preview the Chapters</MagneticCurlButton>
          </div>
          {links.configured ? (
            <div className="mt-8 rounded-2xl border border-whitegold/15 bg-white/5 p-5 text-sm leading-6 text-whitegold/75">
              <p className="font-semibold text-white">{emailSent ? "Email playing hard to get?" : "No need to wait on the email:"}</p>
              <p className="mt-2">
                Direct links, same files: <a className="text-antique underline underline-offset-4" href={links.chapter}>Chapter 1 (PDF)</a> ·{" "}
                <a className="text-antique underline underline-offset-4" href={links.checklist}>Pricing Confidence Checklist (PDF)</a>
              </p>
            </div>
          ) : null}
          <div className="mt-6 rounded-2xl border border-jade/40 bg-jade/10 p-5 text-sm leading-6 text-whitegold/80">
            <p className="font-semibold text-white">While Chapter 1 lands: find your blind spot.</p>
            <p className="mt-2">
              Two minutes, six questions — the quiz names which of the four business blind spots is quietly costing you the most, and hands you the matching worksheet.{" "}
              <Link className="text-antique underline underline-offset-4" href="/quiz">Take the Blind-Spot Quiz</Link>
            </p>
          </div>
        </div>
      </div>
    </UtilityShell>
  );
}
