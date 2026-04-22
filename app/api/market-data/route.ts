import { NextResponse } from "next/server";

import { getMarketSignals } from "@/lib/market-analysis";

export async function GET() {
  return NextResponse.json(getMarketSignals());
}
