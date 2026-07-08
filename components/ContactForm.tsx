"use client";

import { useId, useState, type FormEvent } from "react";
import Script from "next/script";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const intents = [
  { value: "support", label: "Support" },
  { value: "press", label: "Press" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" }
] as const;

/**
 * Contact form (PRD v2 §4.5): segmented intent control prefixes the subject
 * line via /api/contact → Resend. Turnstile + hidden honeypot guard the POST.
 * The quietest page on the site — no motion budget spent here.
 */
export function ContactForm() {
  const id = useId();
  const [intent, setIntent] = useState<(typeof intents)[number]["value"]>("support");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const widgetToken = data.get("cf-turnstile-response");
    setStatus("submitting");
    setMessage(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          intent,
          message: String(data.get("message") ?? ""),
          website: String(data.get("website") ?? ""),
          turnstileToken: widgetToken ? String(widgetToken) : undefined
        })
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.ok) {
        setStatus("success");
        return;
      }
      setStatus("error");
      setMessage(
        json?.error?.code === "turnstile_failed"
          ? "We couldn't confirm you're human. Complete the check and try again."
          : "Something went wrong sending your message. Please try again, or email us directly."
      );
    } catch {
      setStatus("error");
      setMessage("Network hiccup. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="editorial-panel rounded-[2rem] p-6 md:p-8">
        <p className="font-display text-2xl text-white">Received.</p>
        <p role="status" className="mt-2 leading-7 text-whitegold/80">A real person reads this inbox — expect a reply within two business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="editorial-panel rounded-[2rem] p-6 md:p-8">
      <fieldset>
        <legend className="text-sm font-semibold text-white">What is this about?</legend>
        <div className="mt-3 flex flex-wrap gap-2" role="group">
          {intents.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setIntent(option.value)}
              aria-pressed={intent === option.value}
              className={[
                "rounded-full border px-4 py-2 text-sm transition",
                intent === option.value
                  ? "border-antique bg-antique text-obsidian"
                  : "border-whitegold/25 text-whitegold/80 hover:border-antique/60 hover:text-white"
              ].join(" ")}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="mt-6 block text-sm font-semibold text-white" htmlFor={`${id}-name`}>Name</label>
      <input id={`${id}-name`} name="name" type="text" required autoComplete="name" maxLength={120} className="light mt-2 w-full rounded-full border border-whitegold/20 bg-white px-4 py-3 text-obsidian" />

      <label className="mt-4 block text-sm font-semibold text-white" htmlFor={`${id}-email`}>Email address</label>
      <input id={`${id}-email`} name="email" type="email" required autoComplete="email" className="light mt-2 w-full rounded-full border border-whitegold/20 bg-white px-4 py-3 text-obsidian" placeholder="you@example.com" />

      <label className="mt-4 block text-sm font-semibold text-white" htmlFor={`${id}-message`}>Message</label>
      <textarea id={`${id}-message`} name="message" required rows={6} maxLength={4000} className="light mt-2 w-full rounded-3xl border border-whitegold/20 bg-white px-4 py-3 text-obsidian" />

      {/* Honeypot: visually hidden, tab-skipped; bots that fill it get a quiet 200. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile mt-5" data-sitekey={turnstileSiteKey} data-theme="dark" />
        </>
      ) : null}

      <button type="submit" disabled={status === "submitting"} className="mt-6 rounded-full bg-antique px-6 py-3 font-semibold text-obsidian shadow-gold transition-opacity disabled:opacity-60">
        {status === "submitting" ? "Sending…" : "Send"}
      </button>
      {message ? (
        <p role="alert" className="mt-3 text-sm text-mist">{message}</p>
      ) : null}
    </form>
  );
}
