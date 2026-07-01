"use client";

import { useState } from "react";
import { deliverables, type DeliverableSlug } from "@/lib/deliverables";

const itemNotes: Record<string, string> = {
  epub: "Private signed URL after entitlement check. 3 downloads / 7 days.",
  pdf: "Private signed URL after entitlement check. 3 downloads / 7 days.",
  card_deck: "Included with the Affirmation Card Deck order bump. 3 downloads / 7 days."
};

const errorMessages: Record<string, string> = {
  unauthenticated: "Please sign in to request this download.",
  no_purchase: "We don't see a purchase for this item on your account. If you just bought it, try again in a moment.",
  refunded: "This item's access was removed after a refund.",
  revoked: "Access to this item has been revoked. Contact support if this seems wrong.",
  download_limit_reached: "You've used all 3 downloads for this item in the last 7 days. Try again after the window resets.",
  config_missing: "Downloads aren't available right now. Please try again shortly.",
  storage_error: "We hit a snag preparing your file. Please try again, or contact support."
};

type RowState = "idle" | "loading" | "error";

function DownloadRow({ slug, label, note }: { slug: DeliverableSlug; label: string; note: string }) {
  const [state, setState] = useState<RowState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function requestDownload() {
    setState("loading");
    setMessage(null);
    try {
      const response = await fetch("/api/downloads/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliverable: slug })
      });
      const json = await response.json().catch(() => null);
      if (response.ok && json?.ok && json.url) {
        window.location.href = json.url;
        setState("idle");
        return;
      }
      setState("error");
      setMessage(errorMessages[json?.error?.code] ?? "Something went wrong requesting this download. Please try again.");
    } catch {
      setState("error");
      setMessage("Network hiccup. Please try again.");
    }
  }

  return (
    <div className="rounded-[1.5rem] border border-whitegold/15 bg-white/5 p-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <h2 className="font-display text-2xl text-white">{label}</h2>
          <p className="text-sm leading-6 text-whitegold/70">{note}</p>
        </div>
        <button
          type="button"
          onClick={requestDownload}
          disabled={state === "loading"}
          className="min-h-11 rounded-full bg-antique px-4 py-2 text-sm font-semibold text-obsidian transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:opacity-60"
        >
          {state === "loading" ? "Preparing…" : "Download"}
        </button>
      </div>
      {message ? (
        <p role="alert" className="mt-3 text-sm text-mist">{message}</p>
      ) : null}
    </div>
  );
}

export function DownloadList() {
  return (
    <div className="space-y-4">
      {Object.values(deliverables).map((item) => (
        <DownloadRow key={item.slug} slug={item.slug} label={item.label} note={itemNotes[item.slug]} />
      ))}
    </div>
  );
}
