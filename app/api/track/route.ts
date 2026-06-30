import { NextResponse } from "next/server";
import { z } from "zod";
import { isAnalyticsEventName, sanitizeAnalyticsMetadata } from "@/lib/analytics";
import { recordServerEvent } from "@/lib/events/server-analytics";

const schema = z.object({
  eventName: z.string(),
  route: z.string().max(200).optional(),
  source: z.string().max(120).optional(),
  anonymousId: z.string().max(120).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  consent: z.enum(["granted", "denied", "unknown"]).default("unknown"),
  operational: z.boolean().optional()
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success || !isAnalyticsEventName(parsed.data.eventName)) return NextResponse.json({ ok: false, error: { code: "unknown_event" } }, { status: 400 });
  if (parsed.data.consent !== "granted" && !parsed.data.operational) return NextResponse.json({ ok: true, skipped: true, reason: "consent_not_granted" });
  const result = await recordServerEvent({
    eventName: parsed.data.eventName,
    route: parsed.data.route,
    source: parsed.data.source,
    anonymousId: parsed.data.anonymousId,
    metadata: sanitizeAnalyticsMetadata(parsed.data.metadata),
    operational: parsed.data.operational
  });
  return NextResponse.json({ ok: true, result });
}
