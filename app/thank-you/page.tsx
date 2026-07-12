import Link from "next/link";
import { UtilityShell } from "@/components/design/UtilityShell";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { PurchaseBurst } from "@/components/motion/PurchaseBurst";
import { pageMetadata } from "@/lib/seo";
import { pricingKitLink } from "@/lib/free-assets";
import { publicEnv } from "@/lib/env";
import { getLaunchStateCopy } from "@/config/launchState";

export const metadata = pageMetadata("Thank You", "Your Pricing Confidence Checklist is on its way.", { path: "/thank-you", noIndex: true });

export default async function Page({ searchParams }: { searchParams: Promise<{ delivery?: string }> }) {
  const { delivery } = await searchParams;
  const checklist = pricingKitLink();
  const videoId = publicEnv.NEXT_PUBLIC_THANKYOU_VIDEO_ID;
  const emailSent = delivery !== "pending";
  const launch = getLaunchStateCopy();

  return (
    <UtilityShell
      eyebrow={emailSent ? "Your checklist is on its way" : "Your checklist is reserved"}
      title={emailSent ? "Check your inbox. Then meet me here." : "You're on the list. Here's what happens next."}
      description={
        emailSent
          ? "The Pricing Confidence Checklist is headed to your email right now. While it lands, here is what the complete book is actually for."
          : "Your address is saved and the checklist will reach you when delivery is available — no need to sign up twice."
      }
    >
      <PurchaseBurst className="mb-8" />
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
                &ldquo;Your prices can reflect your expertise without costing you your peace.&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm uppercase tracking-[0.18em] text-antique">— the work begins here</figcaption>
            </figure>
          )}
        </div>
        <div>
          <h2 className="font-display text-3xl leading-tight text-white md:text-4xl">If the checklist names the gap, the book helps you build the system.</h2>
          <p className="mt-4 leading-8 text-whitegold/80">
            The direct edition is <strong className="text-white">$17.99</strong>{" "}right now. Fifteen days after release it becomes $19.99 — permanently. That schedule is real — it&rsquo;s in the preorder policy — and it is the only urgency you&rsquo;ll ever get from me. No timers. No &ldquo;only 3 left&rdquo; of a digital file.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <MagneticCurlButton href={launch.heroCta.href}>{launch.heroCta.label}</MagneticCurlButton>
            <MagneticCurlButton href="/book" variant="secondary">Explore the Book</MagneticCurlButton>
          </div>
          {checklist ? (
            <div className="mt-8 rounded-2xl border border-whitegold/15 bg-white/5 p-5 text-sm leading-6 text-whitegold/75">
              <p className="font-semibold text-white">{emailSent ? "Email playing hard to get?" : "No need to wait on the email:"}</p>
              <p className="mt-2">
                <a className="text-antique underline underline-offset-4" href={checklist}>Open the Pricing Confidence Checklist (PDF)</a>
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
