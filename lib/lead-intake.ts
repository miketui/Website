/**
 * Lead-capture truthfulness (2026-07-31 audit, P0.8).
 *
 * The newsletter, pricing-kit, quiz, and contact endpoints all returned
 * `{ ok: true }` unconditionally. When MailerLite was misconfigured and
 * Supabase was unreachable — the exact state of a half-provisioned
 * environment — the visitor saw "check your inbox", the lead existed nowhere,
 * and nothing alerted. Silent lead loss looks identical to success in every
 * dashboard, which is why it survives.
 *
 * The rule these helpers enforce: **a form may report success only after at
 * least one durable, queryable system of record has accepted the lead.** A
 * provider that was skipped because it is not configured has not accepted
 * anything, and must not count.
 */

/** One attempted write to a system that outlives the request. */
export type DurableWrite = {
  /** Stable identifier, e.g. "mailerlite:pricing_kit" or "supabase:magnet_leads". */
  system: string;
  accepted: boolean;
  /** Short machine-readable reason when `accepted` is false. */
  detail?: string;
};

export type LeadIntakeResult = {
  /** True when at least one system of record holds the lead. */
  accepted: boolean;
  /** Systems that accepted — the audit trail for "where did this lead go?". */
  systemsOfRecord: string[];
  failures: { system: string; detail?: string }[];
  /**
   * Front-end contract. `delivery_failed` is the state the UI must surface as
   * an error rather than a confirmation.
   */
  delivery: "delivered" | "recorded_pending_delivery" | "delivery_failed";
};

/**
 * @param writes       every durable write attempted, in any order
 * @param deliverySystem the system that actually delivers to the visitor (the
 *   email provider). When it accepted, the promise "it's on its way" is true.
 *   When only storage accepted, the lead is safe but undelivered — a
 *   retryable state, reported honestly rather than as a send.
 */
export function summarizeLeadIntake(writes: DurableWrite[], deliverySystem?: string): LeadIntakeResult {
  const systemsOfRecord = writes.filter((w) => w.accepted).map((w) => w.system);
  const failures = writes.filter((w) => !w.accepted).map(({ system, detail }) => ({ system, detail }));
  const accepted = systemsOfRecord.length > 0;
  const delivered = Boolean(deliverySystem) && systemsOfRecord.includes(deliverySystem!);
  return {
    accepted,
    systemsOfRecord,
    failures,
    delivery: !accepted ? "delivery_failed" : delivered ? "delivered" : "recorded_pending_delivery"
  };
}

/**
 * The response every lead endpoint returns when nothing durable accepted the
 * lead. 502, not 200: the visitor's client must be able to tell the difference,
 * and a failure that returns 200 cannot be alerted on.
 */
export const LEAD_INTAKE_FAILED_STATUS = 502;

export function leadIntakeFailure(result: LeadIntakeResult) {
  return {
    ok: false as const,
    error: {
      code: "delivery_failed" as const,
      message: "We could not save your request. Please try again in a moment.",
      failures: result.failures
    }
  };
}
