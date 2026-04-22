import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message:
        "Session authentication is handled via Stripe purchase unlock at /api/auth/unlock. NextAuth is intentionally not configured in this build."
    },
    { status: 501 }
  );
}

export async function POST() {
  return GET();
}
