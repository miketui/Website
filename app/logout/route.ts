import { NextResponse } from "next/server";
export async function GET() { const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")); response.cookies.delete("cc_demo_email"); response.cookies.delete("cc_demo_user"); return response; }
