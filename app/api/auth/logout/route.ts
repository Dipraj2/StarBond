import { NextResponse } from "next/server";
import { clearSession, clearSessionCookieHeader } from "@/lib/auth";

export async function POST() {
  await clearSession();
  const response = NextResponse.json({ ok: true });
  response.headers.append("Set-Cookie", clearSessionCookieHeader());
  return response;
}
