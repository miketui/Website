"use client";

import { useId, useState, type FormEvent } from "react";
import Script from "next/script";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type NewsletterFormProps = {
  /** Attribution passed to /api/subscribe (e.g. "footer", "blog"). */
  source: string;
  heading?: string;
  copy?: string;
  cta?: string;
  /** "footer" = compact dark band; "card" = bordered card (blog/section use). */
  tone?: "footer" | "card";
};

export function NewsletterForm({
  source,
  heading = "Letters worth reading.",
  copy = "One welcome note, then the occasional letter on pricing, craft, and the business nobody taught you. No spam.",
  cta = "Subscribe",
  tone = "card"
}: NewsletterFormProps) {
  const id = useId();
  const emailId = `${id}-email`;
  const msgId = `${id}-msg`;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const widgetToken = data.get("cf-turnstile-response");
    setStatus("submitting");
    setMessage(null);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, turnstileToken: widgetToken ? String(widgetToken) : undefined })
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.ok) {
        setStatus("success");
        setMessage("You're in. Check your inbox for the welcome note.");
        return;
      }
      setStatus("error");
      setMessage(
        json?.error?.code === "turnstile_failed"
          ? "We couldn't confirm you're human. Please complete the check and try again."
          : json?.error?.code === "invalid_email"
            ? "That email doesn't look right. Please check and try again."
            : "Something went wrong. Please try again."
      );
    } catch {
      setStatus("error");
      setMessage("Network hiccup. Please try again.");
    }
  }

  const wrapperClass =
    tone === "footer"
      ? "rounded-3xl border border-whitegold/15 bg-obsidian/40 p-6 md:p-8"
      : "rounded-3xl border border-antique/30 bg-obsidian p-6 md:p-8";

  if (status === "success") {
    return (
      <div className={wrapperClass}>
        <p className="font-display text-xl text-white">Thank you.</p>
        <p id={msgId} role="status" className="mt-2 text-sm leading-6 text-whitegold/80">
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={wrapperClass} aria-describedby={message ? msgId : undefined}>
      {heading ? <p className="font-display text-xl text-white">{heading}</p> : null}
      {copy ? <p className="mt-2 max-w-prose text-sm leading-6 text-whitegold/70">{copy}</p> : null}
      <label className="mt-4 block text-sm font-semibold text-white" htmlFor={emailId}>
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id={emailId}
          name="email"
          type="email"
          required
          autoComplete="email"
          className="light w-full rounded-full border border-whitegold/20 bg-white px-4 py-3 text-obsidian"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="shrink-0 rounded-full bg-antique px-5 py-3 font-semibold text-obsidian transition-opacity disabled:opacity-60"
        >
          {status === "submitting" ? "Subscribing…" : cta}
        </button>
      </div>
      {turnstileSiteKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile mt-4" data-sitekey={turnstileSiteKey} data-theme="dark" />
        </>
      ) : null}
      {message ? (
        <p id={msgId} role="alert" className="mt-3 text-sm text-mist">
          {message}
        </p>
      ) : null}
    </form>
  );
}
