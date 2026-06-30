import { z } from "zod";
import { getMailerLiteConfig } from "@/lib/env";

export type MailerLiteGroup =
  | "subscribers"
  | "free_chapter"
  | "preorders"
  | "customers"
  | "abandoned_checkout"
  | "bonus_claim_started"
  | "bonus_claim_completed"
  | "refunded"
  | "blog_readers"
  | "vip_early_readers"
  | "quiz";

export const mailerLiteGroups: Record<MailerLiteGroup, string> = {
  subscribers: "Subscribers",
  free_chapter: "Free Chapter",
  preorders: "Preorders",
  customers: "Customers",
  abandoned_checkout: "Abandoned Checkout",
  bonus_claim_started: "Bonus Claim Started",
  bonus_claim_completed: "Bonus Claim Completed",
  refunded: "Refunded",
  blog_readers: "Blog Readers",
  vip_early_readers: "VIP / Early Readers",
  quiz: "Quiz / Blind-Spot"
};

const emailSchema = z.string().email();
export type EmailProviderResult = { ok: true; skipped: false } | { ok: false; skipped: true; reason: "config_missing" | "group_missing" } | { ok: false; skipped: false; reason: "invalid_email" | "provider_error" };

export async function upsertSubscriber(email: string, group: MailerLiteGroup = "subscribers", fields: Record<string, string> = {}): Promise<EmailProviderResult> {
  if (!emailSchema.safeParse(email).success) return { ok: false, skipped: false, reason: "invalid_email" };
  const config = getMailerLiteConfig();
  if (!config.ok) return { ok: false, skipped: true, reason: "config_missing" };
  const groupId = config.value.groups[group];
  if (!groupId) return { ok: false, skipped: true, reason: "group_missing" };

  const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: { Authorization: `Bearer ${config.value.apiKey}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, fields, groups: [groupId] })
  });

  if (!response.ok) return { ok: false, skipped: false, reason: "provider_error" };
  return { ok: true, skipped: false };
}

export async function tagSubscriber(email: string, group: MailerLiteGroup, fields: Record<string, string> = {}) {
  return upsertSubscriber(email, group, fields);
}

export async function handleMailerLiteUnsubscribeWebhook() {
  return { ok: true, scaffold: true, note: "MailerLite unsubscribe webhook verification to be enabled after sandbox credentials are configured." } as const;
}
