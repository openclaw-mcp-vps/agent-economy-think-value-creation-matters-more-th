import { NextResponse } from "next/server";
import { z } from "zod";

import { hasActiveAccess } from "@/lib/supabase";

const claimSchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request): Promise<NextResponse> {
  const payload = claimSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ ok: false, message: "Please enter a valid checkout email." }, { status: 400 });
  }

  const email = payload.data.email.toLowerCase();
  let activeAccess = await hasActiveAccess(email);

  if (!activeAccess && !process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NODE_ENV !== "production") {
    activeAccess = true;
  }

  if (!activeAccess) {
    return NextResponse.json(
      {
        ok: false,
        message: "No completed payment found for that email yet. If you just paid, wait a minute and try again."
      },
      { status: 404 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: "ae_access",
    value: "granted",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
