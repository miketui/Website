import { NextResponse } from "next/server";
import { z } from "zod";
import { createSignedDownloadUrl, deliverables } from "@/lib/downloads";
import { getSessionUser } from "@/lib/supabase/server";
import { analyticsEvents } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";

const schema = z.object({ deliverable: z.enum(["epub", "card_deck"]) });

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await request.json().catch(() => ({})) : Object.fromEntries((await request.formData()).entries());
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: { code: "invalid_deliverable" } }, { status: 400 });
  const user = await getSessionUser();
  const result = await createSignedDownloadUrl(user, parsed.data.deliverable);
  const eventName = result.allowed ? analyticsEvents.downloadSignedUrlCreated : result.reason === "download_limit_reached" ? analyticsEvents.downloadLimitReached : analyticsEvents.downloadDenied;
  await recordServerEvent({ eventName, route: "/api/downloads/sign", userId: user?.id, metadata: { deliverable: parsed.data.deliverable, reason: result.allowed ? undefined : result.reason }, operational: true });
  if (!result.allowed) return NextResponse.json({ ok: false, error: { code: result.reason }, limit: "3 downloads / 7 days" }, { status: result.reason === "unauthenticated" ? 401 : 403 });
  return NextResponse.json({ ok: true, url: result.url, expiresInSeconds: result.expiresInSeconds, label: deliverables[parsed.data.deliverable].label });
}
