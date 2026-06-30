import { createHash } from "node:crypto";
import { analyticsEvents, isAnalyticsEventName, sanitizeAnalyticsMetadata, type AnalyticsEventName } from "@/lib/analytics";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ServerEventInput = {
  eventName: AnalyticsEventName;
  route?: string;
  source?: string;
  userId?: string;
  anonymousId?: string;
  metadata?: Record<string, unknown>;
  operational?: boolean;
};

export function hashSensitiveValue(value: string) {
  return createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

export async function recordServerEvent(input: ServerEventInput) {
  if (!isAnalyticsEventName(input.eventName)) return { ok: false, reason: "unknown_event" } as const;
  const metadata = sanitizeAnalyticsMetadata(input.metadata);
  const supabase = createServerSupabaseClient(true);
  if (!supabase) return { ok: false, skipped: true, reason: "config_missing", eventName: input.eventName, metadata } as const;
  const { error } = await supabase.from("analytics_events").insert({
    event_name: input.eventName,
    route: input.route,
    source: input.source,
    user_id: input.userId,
    anonymous_id: input.anonymousId,
    metadata: { ...metadata, operational: input.operational ?? false }
  });
  return error ? ({ ok: false, reason: "storage_error" } as const) : ({ ok: true } as const);
}

export { analyticsEvents };
