"use client";

import { useState, type FormEvent } from "react";

/**
 * Funnel 1 checkout entry: book at the launch price, with the optional $59
 * Daily Directives bundle. Posts to /api/checkout and follows the
 * Stripe-hosted session URL. Test mode until live keys are activated.
 */
export function PreorderCheckout({
  title = "Direct digital edition",
  price = "$17.99",
  ctaLabel = "Preorder — $17.99",
  note = "EPUB, delivered through your protected account. $19.99 fifteen days after release — that schedule is real and it is the only urgency on this page.",
  sourcePage = "/preorder"
}: {
  title?: string;
  price?: string;
  ctaLabel?: string;
  note?: string;
  sourcePage?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const addDailyDirectives = new FormData(event.currentTarget).get("daily-directives") === "on";
    setStatus("submitting");
    setMessage(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "direct_ebook", addDailyDirectives, sourcePage })
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.ok && json.url) {
        window.location.assign(json.url);
        return;
      }
      setStatus("error");
      setMessage(
        json?.error?.code === "daily_directives_unavailable"
          ? "The Daily Directives bundle isn't available right now. Uncheck it and your book order will continue — nothing extra was charged."
          : json?.error?.code === "config_missing" || json?.error?.code === "checkout_paused"
            ? "Checkout isn't switched on in this environment yet. Stripe activates with the owner's keys — nothing was charged."
            : "We couldn't start checkout. Please try again."
      );
    } catch {
      setStatus("error");
      setMessage("Network hiccup. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="editorial-panel rounded-[2rem] p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-display text-3xl text-white">{title}</h3>
        <p className="text-2xl text-antique">{price}</p>
      </div>
      <p className="mt-2 text-sm leading-6 text-whitegold/70">{note}</p>

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-antique/40 bg-white/5 p-4 transition hover:border-antique/70">
        <input type="checkbox" name="daily-directives" className="mt-1 h-5 w-5 accent-[#B08D57]" />
        <span>
          <span className="block font-semibold text-white">Add all 12 Daily Directives sets — $59</span>
          <span className="mt-1 block text-sm leading-6 text-whitegold/70">372 digital affirmation cards across twelve focused sets. Delivered to your protected account after checkout.</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full rounded-full bg-antique px-5 py-3 font-semibold text-obsidian transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:opacity-60"
      >
        {status === "submitting" ? "Opening secure checkout…" : ctaLabel}
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-whitegold/70">
        Secure checkout by Stripe. Not for you? Email support for a refund — plain and human. Refunds close download access (<a href="/refund-policy" className="underline underline-offset-2 hover:text-antique">refund policy</a>).
      </p>
      {message ? (
        <p role="alert" className="mt-3 text-sm text-mist">
          {message}
        </p>
      ) : null}
    </form>
  );
}
