"use client";

import { useState, type FormEvent } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function PricingKitForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("submitting");
    setMessage(null);
    try {
      const response = await fetch("/api/pricing-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(data.get("email") ?? ""), turnstileToken: String(data.get("cf-turnstile-response") ?? "") || undefined })
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.ok) {
        // `delivered` = the email provider accepted it. `recorded_pending_delivery`
        // = the lead is stored but nothing has been sent yet, so the thank-you
        // page must say "pending" rather than "check your inbox". This branch
        // previously compared against a state name the API has never returned,
        // so every visitor got the pending page regardless of the outcome.
        router.push(json.delivery === "delivered" ? "/thank-you" : "/thank-you?delivery=pending");
        return;
      }
      setStatus("error");
      setMessage(
        json?.error?.code === "turnstile_failed"
          ? "We couldn't confirm you're human. Complete the check and try again."
          : json?.error?.code === "delivery_failed"
            ? "We couldn't save your request, so nothing was sent. Please try again in a moment."
            : "We couldn't send the guide. Please try again."
      );
    } catch {
      setStatus("error");
      setMessage("Network hiccup. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-antique/30 bg-obsidian p-6" aria-describedby={message ? "pricing-kit-error" : undefined}>
      <label className="block text-sm font-semibold text-white" htmlFor="pricing-kit-email">Email address</label>
      <input id="pricing-kit-email" name="email" type="email" required autoComplete="email" className="light mt-2 w-full rounded-full border border-whitegold/20 bg-white px-4 py-3 text-obsidian" placeholder="you@example.com" />
      {turnstileSiteKey ? <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" /><div className="cf-turnstile mt-4" data-sitekey={turnstileSiteKey} data-theme="dark" /></> : null}
      <button type="submit" disabled={status === "submitting"} className="mt-4 rounded-full bg-antique px-5 py-3 font-semibold text-obsidian transition-opacity disabled:opacity-60">
        {status === "submitting" ? "Sending your guide…" : "Send my free pricing guide"}
      </button>
      <p className="mt-3 text-sm text-whitegold/70">Instant seven-page PDF delivery. You can unsubscribe from future notes at any time.</p>
      {message ? <p id="pricing-kit-error" role="alert" className="mt-3 text-sm text-mist">{message}</p> : null}
    </form>
  );
}
