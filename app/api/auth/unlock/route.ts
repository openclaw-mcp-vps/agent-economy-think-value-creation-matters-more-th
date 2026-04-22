import { NextResponse } from "next/server";
import { z } from "zod";

import { ACCESS_COOKIE_NAME, createAccessToken } from "@/lib/auth";
import { getPurchaseByEmail } from "@/lib/database";

const unlockSchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = unlockSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ message: "Enter a valid purchase email." }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const purchase = await getPurchaseByEmail(email);

    if (!purchase) {
      return NextResponse.json(
        {
          message:
            "No Stripe purchase found for that email yet. Complete checkout first, then retry within a minute while webhook processing finishes."
        },
        { status: 403 }
      );
    }

    const token = createAccessToken(email);
    const response = NextResponse.json({ message: "Dashboard unlocked." });

    response.cookies.set({
      name: ACCESS_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Unable to unlock dashboard." }, { status: 500 });
  }
}
