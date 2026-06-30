"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Script from "next/script";
import { MagneticCurlButton } from "@/components/motion/MagneticCurlButton";
import { quizItems, scoreQuiz, type QuizArchetype } from "@/content/funnels";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Phase = { kind: "intro" } | { kind: "question"; index: number } | { kind: "result"; archetype: QuizArchetype };

export function QuizFlow() {
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [answers, setAnswers] = useState<string[]>([]);
  const [captureStatus, setCaptureStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [captureMessage, setCaptureMessage] = useState<string | null>(null);

  function choose(archetypeSlug: string, index: number) {
    const next = [...answers.slice(0, index), archetypeSlug];
    setAnswers(next);
    if (index + 1 < quizItems.length) {
      setPhase({ kind: "question", index: index + 1 });
    } else {
      setPhase({ kind: "result", archetype: scoreQuiz(next) });
    }
  }

  function restart() {
    setAnswers([]);
    setCaptureStatus("idle");
    setCaptureMessage(null);
    setPhase({ kind: "intro" });
  }

  async function onCapture(event: FormEvent<HTMLFormElement>, archetype: QuizArchetype) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const widgetToken = data.get("cf-turnstile-response");
    setCaptureStatus("submitting");
    setCaptureMessage(null);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, archetype: archetype.slug, turnstileToken: widgetToken ? String(widgetToken) : undefined })
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.ok) {
        setCaptureStatus("done");
        return;
      }
      setCaptureStatus("error");
      setCaptureMessage(
        json?.error?.code === "turnstile_failed"
          ? "We couldn't confirm you're human. Complete the check and try again."
          : "Something went wrong saving your result. Please try again."
      );
    } catch {
      setCaptureStatus("error");
      setCaptureMessage("Network hiccup. Please try again.");
    }
  }

  if (phase.kind === "intro") {
    return (
      <div className="editorial-panel rounded-[2rem] p-6 md:p-10">
        <p className="editorial-kicker">90 seconds · six questions</p>
        <h2 className="mt-3 font-display text-3xl text-white md:text-4xl">Find the blind spot that&rsquo;s costing you.</h2>
        <p className="mt-4 max-w-2xl leading-8 text-whitegold/80">
          Answer honestly — there are no right answers, only the one that sounds most like you right now. At the end
          you&rsquo;ll get your blind spot, the part of the book that addresses it, and a free worksheet to start on tonight.
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setPhase({ kind: "question", index: 0 })}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-antique px-6 py-3 text-sm font-semibold text-obsidian shadow-gold transition hover:bg-mist"
          >
            Start the quiz
          </button>
        </div>
      </div>
    );
  }

  if (phase.kind === "question") {
    const item = quizItems[phase.index];
    const progress = `${phase.index + 1} of ${quizItems.length}`;
    return (
      <div className="editorial-panel rounded-[2rem] p-6 md:p-10">
        <div className="flex items-center justify-between">
          <p className="editorial-kicker">Question {progress}</p>
          <span aria-hidden="true" className="h-px w-24 bg-jade/60" />
        </div>
        <h2 className="mt-4 max-w-3xl font-display text-2xl leading-snug text-white md:text-3xl">{item.question}</h2>
        <ul className="mt-8 grid gap-3">
          {item.options.map((option) => (
            <li key={option.label}>
              <button
                type="button"
                onClick={() => choose(option.archetype, phase.index)}
                className="w-full rounded-2xl border border-whitegold/20 bg-obsidian/40 px-5 py-4 text-left text-base leading-7 text-whitegold/90 transition hover:border-antique/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const { archetype } = phase;
  return (
    <div className="editorial-panel rounded-[2rem] p-6 md:p-10">
      <p className="editorial-kicker">Your blind spot · {archetype.bookPart}</p>
      <h2 className="mt-3 font-display text-4xl text-white md:text-5xl">{archetype.name}</h2>
      <p className="mt-4 max-w-2xl leading-8 text-whitegold/85">{archetype.diagnosis}</p>

      {captureStatus === "done" ? (
        <div role="status" className="mt-8 rounded-2xl border border-antique/40 bg-jade/15 p-6">
          <h3 className="font-display text-2xl text-white">Check your inbox.</h3>
          <p className="mt-2 text-whitegold/80">Your worksheet is on its way. While you wait, the chapter that addresses this is already public.</p>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row">
            <MagneticCurlButton href={`/chapter/${archetype.chapterSlug}`} variant="secondary">Preview the chapter</MagneticCurlButton>
            <MagneticCurlButton href="/preorder">Preorder — $17.99</MagneticCurlButton>
          </div>
        </div>
      ) : (
        <form onSubmit={(event) => onCapture(event, archetype)} className="mt-8 rounded-2xl border border-antique/30 bg-obsidian p-6" aria-describedby={captureMessage ? "quiz-capture-error" : undefined}>
          <h3 className="font-display text-2xl text-white">Send my worksheet + the matching chapter</h3>
          <label className="mt-4 block text-sm font-semibold text-white" htmlFor="quiz-email">Email address</label>
          <input
            id="quiz-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="light mt-2 w-full rounded-full border border-whitegold/20 bg-white px-4 py-3 text-obsidian"
            placeholder="you@example.com"
          />
          {turnstileSiteKey ? (
            <>
              <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
              <div className="cf-turnstile mt-4" data-sitekey={turnstileSiteKey} data-theme="dark" />
            </>
          ) : null}
          <button
            type="submit"
            disabled={captureStatus === "submitting"}
            className="mt-4 rounded-full bg-antique px-5 py-3 font-semibold text-obsidian transition-opacity disabled:opacity-60"
          >
            {captureStatus === "submitting" ? "Sending…" : "Send my worksheet"}
          </button>
          <p className="mt-3 text-sm text-whitegold/70">One worksheet, one welcome note, then the occasional letter worth reading. Your full diagnosis is right here either way.</p>
          {captureMessage ? (
            <p id="quiz-capture-error" role="alert" className="mt-3 text-sm text-mist">{captureMessage}</p>
          ) : null}
        </form>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-whitegold/65">
        <Link href={`/quiz/results/${archetype.slug}`} className="underline decoration-antique underline-offset-4">See the full result page</Link>
        <button type="button" onClick={restart} className="underline decoration-antique underline-offset-4">Retake the quiz</button>
      </div>
    </div>
  );
}
