import { NextResponse } from "next/server";

import { analysisInputSchema, analyzeValueCreation } from "@/lib/market-analysis";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = analysisInputSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid analysis payload.",
          issues: parsed.error.flatten()
        },
        { status: 400 }
      );
    }

    const result = analyzeValueCreation(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Unable to process analysis request." }, { status: 500 });
  }
}
