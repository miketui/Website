"use client";

import { useId, useState, type FormEvent } from "react";
import Script from "next/script";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function FeedbackForm() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const token = data.get("cf-turnstile-response");
    setStatus("submitting");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          email: String(data.get("email") ?? ""),
          relationship: String(data.get("relationship") ?? "reader"),
          rating: data.get("rating") ? Number(data.get("rating")) : undefined,
          reflection: String(data.get("reflection") ?? ""),
          permissionToFeature: data.get("permissionToFeature") === "on",
          website: String(data.get("website") ?? ""),
          turnstileToken: token ? String(token) : undefined
        })
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") return <div className="editorial-panel rounded-[2rem] p-8"><p className="font-display text-2xl text-white">Thank you for the reflection.</p><p className="mt-3 text-whitegold/75">Nothing is published automatically. Michael reviews every submission and will request confirmation before any featured use.</p></div>;

  return (
    <form onSubmit={onSubmit} className="editorial-panel rounded-[2rem] p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-white" htmlFor={`${id}-name`}>Name<input id={`${id}-name`} name="name" required maxLength={120} className="light mt-2 w-full rounded-full bg-white px-4 py-3 text-obsidian" /></label>
        <label className="text-sm font-semibold text-white" htmlFor={`${id}-email`}>Email<input id={`${id}-email`} name="email" type="email" required className="light mt-2 w-full rounded-full bg-white px-4 py-3 text-obsidian" /></label>
        <label className="text-sm font-semibold text-white" htmlFor={`${id}-relationship`}>You are
          <select id={`${id}-relationship`} name="relationship" className="light mt-2 w-full rounded-full bg-white px-4 py-3 text-obsidian" defaultValue="reader">
            <option value="reader">A reader</option><option value="customer">A customer</option><option value="stylist">A stylist</option><option value="partner">A partner</option><option value="other">Other</option>
          </select>
        </label>
        <label className="text-sm font-semibold text-white" htmlFor={`${id}-rating`}>Rating (optional)
          <select id={`${id}-rating`} name="rating" className="light mt-2 w-full rounded-full bg-white px-4 py-3 text-obsidian" defaultValue=""><option value="">Choose</option>{[5,4,3,2,1].map((value) => <option key={value} value={value}>{value} / 5</option>)}</select>
        </label>
      </div>
      <label className="mt-5 block text-sm font-semibold text-white" htmlFor={`${id}-reflection`}>What is staying with you?<textarea id={`${id}-reflection`} name="reflection" required minLength={20} maxLength={3000} rows={7} className="light mt-2 w-full rounded-3xl bg-white px-4 py-3 text-obsidian" /></label>
      <label className="mt-4 flex items-start gap-3 text-sm text-whitegold/75"><input type="checkbox" name="permissionToFeature" className="mt-1" /> You may contact me about featuring this reflection. This does not authorize automatic publication.</label>
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden"><label htmlFor={`${id}-website`}>Website</label><input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" /></div>
      {turnstileSiteKey ? <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" /><div className="cf-turnstile mt-5" data-sitekey={turnstileSiteKey} data-theme="dark" /></> : null}
      <button type="submit" disabled={status === "submitting"} className="mt-6 rounded-full bg-antique px-6 py-3 font-semibold text-obsidian disabled:opacity-60">{status === "submitting" ? "Sending…" : "Share Your Reflection"}</button>
      {status === "error" ? <p role="alert" className="mt-3 text-sm text-mist">We could not save that reflection. Please try again.</p> : null}
    </form>
  );
}
