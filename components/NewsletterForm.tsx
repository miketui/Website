"use client";

import { useId, useState, useSyncExternalStore, type FormEvent } from "react";
import Script from "next/script";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SUBSCRIBED_KEY = "curls-subscribed";

/* Module-scope so useSyncExternalStore never re-subscribes across renders.
   localStorage has no change events we care about here — the value is read
   once per render via the snapshot. */
const noopSubscribe = () => () => {};
const serverSnapshot = () => false;

/** utm_* params from the current URL, captured at submit time for attribution. */
function currentUtmParams(): Record<string, string> {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 120);
    }
    return utm;
  } catch {
    return {};
  }
}

type NewsletterFormProps = {
  /** Attribution passed to /api/subscribe (e.g. "footer", "blog"). */
  source: string;
  heading?: string;
  copy?: string;
  cta?: string;
  /** "footer" = compact dark band; "card" = bordered card (blog/section use). */
  tone?: "footer" | "card";
  /** Mid-scroll surfaces set this so known subscribers aren't re-asked. The footer stays visible for everyone. */
  hideWhenSubscribed?: boolean;
  /** Full intake adds optional profile fields while compact placements stay low-friction. */
  collectProfile?: boolean;
};

export function NewsletterForm({
  source,
  heading = "Letters worth reading.",
  copy = "One welcome note, then the occasional letter on pricing, craft, and the business nobody taught you. No spam.",
  cta = "Subscribe",
  tone = "card",
  hideWhenSubscribed = false,
  collectProfile = false
}: NewsletterFormProps) {
  const id = useId();
  const emailId = `${id}-email`;
  const msgId = `${id}-msg`;
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  /* Hydration-safe localStorage read: server snapshot is always false, the
     client snapshot flips post-hydration without a mismatch warning. */
  const alreadySubscribed = useSyncExternalStore(
    noopSubscribe,
    () => {
      if (!hideWhenSubscribed) return false;
      try {
        return window.localStorage.getItem(SUBSCRIBED_KEY) === "1";
      } catch {
        return false;
      }
    },
    serverSnapshot
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    const interests = data.getAll("interests").map(String);
    const widgetToken = data.get("cf-turnstile-response");
    setStatus("submitting");
    setMessage(null);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName: String(data.get("firstName") ?? "") || undefined,
          professionalRole: String(data.get("professionalRole") ?? "") || undefined,
          careerStage: String(data.get("careerStage") ?? "") || undefined,
          interests,
          marketingConsent: true,
          source,
          utm: currentUtmParams(),
          turnstileToken: widgetToken ? String(widgetToken) : undefined
        })
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.ok) {
        setStatus("success");
        setMessage("You're in. Check your inbox for the welcome note.");
        try {
          window.localStorage.setItem(SUBSCRIBED_KEY, "1");
        } catch {
          /* non-fatal */
        }
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

  if (alreadySubscribed && status !== "success") return null;

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
      {collectProfile ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-white">First name
            <input name="firstName" type="text" autoComplete="given-name" maxLength={80} className="light mt-2 w-full rounded-full border border-whitegold/20 bg-white px-4 py-3 text-obsidian" />
          </label>
          <label className="text-sm font-semibold text-white">Professional role
            <input name="professionalRole" type="text" maxLength={120} placeholder="Stylist, educator, creative…" className="light mt-2 w-full rounded-full border border-whitegold/20 bg-white px-4 py-3 text-obsidian" />
          </label>
          <label className="text-sm font-semibold text-white sm:col-span-2">Career stage
            <select name="careerStage" className="light mt-2 w-full rounded-full border border-whitegold/20 bg-white px-4 py-3 text-obsidian" defaultValue="">
              <option value="">Choose one (optional)</option>
              <option value="building-foundation">Building my foundation</option>
              <option value="growing-business">Growing my creative business</option>
              <option value="established-evolving">Established and evolving</option>
              <option value="educator-leader">Educator or leader</option>
            </select>
          </label>
          <fieldset className="sm:col-span-2">
            <legend className="text-sm font-semibold text-white">What would help most?</legend>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-whitegold/80">
              {["Pricing", "Creative identity", "Business systems", "Leadership", "Well-being"].map((interest) => (
                <label key={interest} className="flex items-center gap-2"><input type="checkbox" name="interests" value={interest} /> {interest}</label>
              ))}
            </div>
          </fieldset>
        </div>
      ) : null}
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
      <p className="mt-3 text-xs leading-5 text-whitegold/60">By subscribing, you agree to receive Curls &amp; Contemplation emails. Unsubscribe anytime.</p>
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
