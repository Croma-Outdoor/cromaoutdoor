import { NextResponse } from "next/server";

export async function GET() {
  const serverTime = new Date().toISOString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return NextResponse.json({ serverTime, timeZone });
}
