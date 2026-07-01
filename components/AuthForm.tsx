"use client";

import { useId, useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const id = useId();
  const emailId = `${id}-email`;
  const msgId = `${id}-msg`;
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "");
    setStatus("submitting");
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setStatus("error");
      setMessage("Sign-in isn't configured yet. Please try again shortly or contact support.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`
      }
    });

    if (error) {
      setStatus("error");
      setMessage("We couldn't send your sign-in link. Please check the email address and try again.");
      return;
    }
    setStatus("sent");
    setMessage(`Check ${email} for a one-click sign-in link. It expires shortly, so use it soon.`);
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-md rounded-[2rem] border border-whitegold/15 bg-white/5 p-6" role="status">
        <p className="font-display text-xl text-white">Link sent.</p>
        <p id={msgId} className="mt-2 text-sm leading-6 text-whitegold/80">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md rounded-[2rem] border border-whitegold/15 bg-white/5 p-6" aria-describedby={message ? msgId : undefined}>
      <label className="block text-sm font-semibold text-white" htmlFor={emailId}>Email</label>
      <input
        id={emailId}
        name="email"
        type="email"
        required
        autoComplete="email"
        className="mt-2 min-h-12 w-full rounded-full border border-whitegold/20 bg-whitegold px-4 py-3 text-obsidian outline-none focus:ring-2 focus:ring-antique"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 min-h-12 rounded-full bg-antique px-5 py-3 font-semibold text-obsidian transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-antique focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:opacity-60"
      >
        {status === "submitting" ? "Sending link…" : mode === "login" ? "Send my sign-in link" : "Create my account"}
      </button>
      <p className="mt-4 text-sm leading-6 text-whitegold/70">
        No password to remember. We&rsquo;ll email you a one-click link — it works whether this is your first visit or your fiftieth.
      </p>
      {message ? (
        <p id={msgId} role="alert" className="mt-3 text-sm text-mist">{message}</p>
      ) : null}
    </form>
  );
}
