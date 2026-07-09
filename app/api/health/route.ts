import { NextResponse } from "next/server";
import { getMailerLiteConfig, getStripeConfig } from "@/lib/env";

// Readiness probe. Values are derived from config presence only — a boolean
// "is this integration wired?" signal. No secrets or key material are exposed:
// getStripeConfig()/getMailerLiteConfig() return { ok } without echoing values.
export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "author-site",
    paymentsLive: getStripeConfig().ok,
    subscriptionsLive: getMailerLiteConfig().ok
  });
}
