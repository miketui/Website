import { z } from "zod";
import { getResendConfig, getSiteUrl } from "@/lib/env";

type EmailPayload = { to: string; subject: string; html: string; text?: string };
export type TransactionalEmailResult = { ok: true; skipped: false } | { ok: false; skipped: true; reason: "config_missing" } | { ok: false; skipped: false; reason: "invalid_recipient" | "provider_error" };
const emailSchema = z.string().email();

export async function sendTransactionalEmail(payload: EmailPayload): Promise<TransactionalEmailResult> {
  if (!emailSchema.safeParse(payload.to).success) return { ok: false, skipped: false, reason: "invalid_recipient" };
  const config = getResendConfig();
  if (!config.ok) return { ok: false, skipped: true, reason: "config_missing" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.value.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: config.value.fromEmail, reply_to: config.value.supportEmail, ...payload })
  });

  if (!response.ok) return { ok: false, skipped: false, reason: "provider_error" };
  return { ok: true, skipped: false };
}

export function orderConfirmationTemplate(orderId: string) {
  return { subject: "Your Curls & Contemplation order", html: `<p>Thank you. Your order ${orderId} is recorded, and download access is protected in your dashboard.</p>` };
}

export function downloadAccessTemplate() {
  return { subject: "Your protected download access", html: "<p>Your EPUB/PDF access is available from your secure dashboard after sign-in.</p>" };
}

export function freeChapterTemplate(links?: { chapter: string; checklist: string }) {
  if (!links) {
    return { subject: "Your Curls & Contemplation chapter", html: "<p>Your free chapter request is received. The production asset will be attached or linked after email delivery is configured.</p>" };
  }
  return {
    subject: "Chapter 1 is yours — read it tonight",
    html: `<p>Thank you for reading with me. Here is everything, instantly:</p><p><a href="${links.chapter}">Chapter 1 — free excerpt (PDF)</a><br/><a href="${links.checklist}">Pricing Confidence Checklist (PDF)</a></p><p>One honest note on price: the direct edition is $17.99 through the first fifteen days after release, then $19.99 permanently. No countdown games — just the real schedule.</p>`
  };
}

export function welcomeSubscriberTemplate() {
  const freeChapterUrl = `${getSiteUrl().replace(/\/$/, "")}/free-chapter`;
  return {
    subject: "You're in — one honest welcome",
    html: `<p>Thank you for subscribing to Curls &amp; Contemplation.</p><p>Here's the deal: one welcome note (this one), then the occasional letter on pricing, craft, and the business nobody taught you. No spam, no daily blasts, and you can leave any time from the link at the bottom of every email.</p><p>If you haven't read it yet, Chapter 1 is free — <a href="${freeChapterUrl}">read it tonight</a>. And when the book launches, the direct edition is $17.99 through the first fifteen days after release, then $19.99 permanently. No countdown games — just the real schedule.</p><p>Talk soon,<br/>Michael David</p>`,
    text: `Thank you for subscribing to Curls & Contemplation. One welcome note (this one), then the occasional letter on pricing, craft, and the business nobody taught you. No spam. Chapter 1 is free: ${freeChapterUrl} — Michael David`
  };
}

export async function sendWelcomeEmail(to: string) {
  return sendTransactionalEmail({ to, ...welcomeSubscriberTemplate() });
}

export const bonusClaimReceivedTemplate = { subject: "Bonus claim received", html: "<p>Your bonus claim was received and is queued for review.</p>" };
export const refundAccessRevokedTemplate = { subject: "Refund processed", html: "<p>Your refund was recorded and digital access has been revoked.</p>" };
export const supportReceiptTemplate = { subject: "We received your message", html: "<p>Thank you for reaching out. Support will reply from the configured support inbox.</p>" };

export async function sendOrderConfirmation(to: string, orderId: string) {
  return sendTransactionalEmail({ to, ...orderConfirmationTemplate(orderId) });
}

export async function sendDownloadAccess(to: string) {
  return sendTransactionalEmail({ to, ...downloadAccessTemplate() });
}

export async function sendFreeChapter(to: string, links?: { chapter: string; checklist: string }) {
  return sendTransactionalEmail({ to, ...freeChapterTemplate(links) });
}

export async function sendBonusClaimReceived(to: string) {
  return sendTransactionalEmail({ to, ...bonusClaimReceivedTemplate });
}

export async function sendRefundAccessRevoked(to: string) {
  return sendTransactionalEmail({ to, ...refundAccessRevokedTemplate });
}

export async function sendSupportReceipt(to: string) {
  return sendTransactionalEmail({ to, ...supportReceiptTemplate });
}
