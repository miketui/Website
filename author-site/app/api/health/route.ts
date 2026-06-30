import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ ok: true, app: "author-site", paymentsLive: false, subscriptionsLive: false }); }
