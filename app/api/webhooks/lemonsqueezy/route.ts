import { NextResponse } from "next/server";

import { getLemonSqueezyDeprecationNotice } from "@/lib/lemonsqueezy";

export async function POST() {
  return NextResponse.json(getLemonSqueezyDeprecationNotice(), { status: 410 });
}
