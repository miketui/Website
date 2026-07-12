import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendTransactionalEmail } from "@/lib/email/resend";
import { requestIp, verifyTurnstileToken } from "@/lib/turnstile";
import { siteConfig } from "@/content/site";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().email(),
  relationship: z.enum(["reader", "customer", "stylist", "partner", "other"]),
  rating: z.number().int().min(1).max(5).optional(),
  reflection: z.string().trim().min(20).max(3000),
  permissionToFeature: z.boolean().default(false),
  website: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().optional()
});

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function POST(request: Request) {
  const raw = await request.json().catch(() => ({}));
  if (typeof raw === "object" && raw !== null && String((raw as Record<string, unknown>).website ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_feedback" } }, { status: 400 });

  const turnstile = await verifyTurnstileToken(parsed.data.turnstileToken, requestIp(request));
  if (!turnstile.ok) return NextResponse.json({ ok: false, error: { code: "turnstile_failed" } }, { status: 403 });

  const supabase = createServerSupabaseClient(true);
  if (!supabase) return NextResponse.json({ ok: false, error: { code: "database_unavailable" } }, { status: 503 });
  const { error } = await supabase.from("feedback_submissions").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    relationship: parsed.data.relationship,
    rating: parsed.data.rating ?? null,
    reflection: parsed.data.reflection,
    permission_to_feature: parsed.data.permissionToFeature,
    status: "new"
  });
  if (error) return NextResponse.json({ ok: false, error: { code: "database_write_failed" } }, { status: 502 });

  await sendTransactionalEmail({
    to: siteConfig.supportEmail,
    subject: `[Reader feedback] ${parsed.data.name}`,
    html: `<p><strong>From:</strong> ${escapeHtml(parsed.data.name)} &lt;${escapeHtml(parsed.data.email)}&gt;</p><p><strong>Relationship:</strong> ${escapeHtml(parsed.data.relationship)}</p><p><strong>Rating:</strong> ${parsed.data.rating ?? "Not provided"}</p><p><strong>Permission to feature:</strong> ${parsed.data.permissionToFeature ? "Yes—after approval" : "No"}</p><p>${escapeHtml(parsed.data.reflection)}</p>`,
    text: `From: ${parsed.data.name} <${parsed.data.email}>\nRelationship: ${parsed.data.relationship}\nRating: ${parsed.data.rating ?? "Not provided"}\nPermission to feature: ${parsed.data.permissionToFeature ? "Yes—after approval" : "No"}\n\n${parsed.data.reflection}`
  }).catch(() => null);

  return NextResponse.json({ ok: true });
}
