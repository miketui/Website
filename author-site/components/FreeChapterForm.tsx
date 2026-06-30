"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function FreeChapterForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const widgetToken = data.get("cf-turnstile-response");
    setStatus("submitting");
    setMessage(null);
    try {
      const response = await fetch("/api/free-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken: widgetToken ? String(widgetToken) : undefined })
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.ok) {
        router.push(json.delivery === "email_sent" ? "/thank-you" : "/thank-you?delivery=pending");
        return;
      }
      setStatus("error");
      setMessage(
        json?.error?.code === "turnstile_failed"
          ? "We couldn't confirm you're human. Please complete the check and try again."
          : "Something went wrong sending your chapter. Please try again."
      );
    } catch {
      setStatus("error");
      setMessage("Network hiccup. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-antique/30 bg-obsidian p-6" aria-describedby={message ? "free-chapter-error" : undefined}>
      <label className="block text-sm font-semibold text-white" htmlFor="free-chapter-email">
        Email address
      </label>
      <input
        id="free-chapter-email"
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
        disabled={status === "submitting"}
        className="mt-4 rounded-full bg-antique px-5 py-3 font-semibold text-obsidian transition-opacity disabled:opacity-60"
      >
        {status === "submitting" ? "Sending Chapter 1…" : "Send me Chapter 1"}
      </button>
      <p className="mt-3 text-sm text-whitegold/70">Instant delivery to your inbox. No spam — one welcome note, then the occasional letter worth reading.</p>
      {message ? (
        <p id="free-chapter-error" role="alert" className="mt-3 text-sm text-mist">
          {message}
        </p>
      ) : null}
    </form>
  );
}
