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
  return { subject: "Your protected download access", html: "<p>Your digital downloads are available from your secure dashboard after sign-in.</p>" };
}

/**
 * Launch-day delivery: the signed Supabase Storage link goes directly in the
 * email (30-day expiry) with the dashboard as the durable fallback once the
 * link ages out. Plain-text version included for deliverability.
 */
export function launchDeliveryTemplate(links: { epubUrl: string; expiresDays: number }) {
  const dashboardUrl = `${getSiteUrl().replace(/\/$/, "")}/dashboard`;
  return {
    subject: "It's here — your copy of Curls & Contemplation",
    html: `<p>Launch day. Thank you for preordering — your book is ready right now:</p><p><a href="${links.epubUrl}">Download the EPUB edition</a></p><p>This link works for ${links.expiresDays} days. After that, your copy stays available any time from <a href="${dashboardUrl}">your dashboard</a> after sign-in.</p><p>Read Chapter 1 tonight. Then send me the sentence that stuck — I read every reply.<br/>— Michael David</p>`,
    text: `Launch day. Thank you for preordering — your book is ready now.\n\nEPUB: ${links.epubUrl}\n\nThe link works for ${links.expiresDays} days; after that your copy stays available from your dashboard: ${dashboardUrl}\n\n— Michael David`
  };
}

export async function sendLaunchDelivery(to: string, links: { epubUrl: string; expiresDays: number }) {
  return sendTransactionalEmail({ to, ...launchDeliveryTemplate(links) });
}

export function pricingKitTemplate(checklistUrl?: string) {
  if (!checklistUrl) {
    return { subject: "Your Pricing Confidence Checklist", html: "<p>Your request is received. Your checklist will be delivered as soon as file delivery is available.</p>" };
  }
  return {
    subject: "Your Pricing Confidence Checklist is ready",
    html: `<p>Here is your <a href="${checklistUrl}">Pricing Confidence Checklist (PDF)</a>.</p><p>Use it to calculate your rate floor, say the number clearly, and hold the boundary that protects the work.</p><p>If you want the full system for pricing, networking, visibility, leadership, and a sustainable creative practice, <em>Curls &amp; Contemplation</em> is available to preorder for $17.99.</p>`
  };
}

export function welcomeSubscriberTemplate() {
  const pricingKitUrl = `${getSiteUrl().replace(/\/$/, "")}/pricing-kit`;
  return {
    subject: "You're in — one honest welcome",
    html: `<p>Thank you for subscribing to Curls &amp; Contemplation.</p><p>Here's the deal: one welcome note (this one), then the occasional letter on pricing, craft, and the business nobody taught you. No spam, no daily blasts, and you can leave any time.</p><p>Start with the free <a href="${pricingKitUrl}">Pricing Confidence Checklist</a>. The direct book edition is $17.99 through the first fifteen days after release, then $19.99 permanently.</p><p>Talk soon,<br/>Michael David</p>`,
    text: `Thank you for subscribing to Curls & Contemplation. Start with the Pricing Confidence Checklist: ${pricingKitUrl} — Michael David`
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

export async function sendPricingKit(to: string, checklistUrl?: string) {
  return sendTransactionalEmail({ to, ...pricingKitTemplate(checklistUrl) });
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
