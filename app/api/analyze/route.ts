import { NextResponse } from "next/server";
import { z } from "zod";

import { gatherMarketData } from "@/lib/market-data";
import { buildScoredAnalysis } from "@/lib/scoring-algorithm";
import { persistAnalysis } from "@/lib/supabase";
import type { AnalysisResult, AnalyzeRequest } from "@/types/analysis";

const analyzeSchema = z.object({
  market: z.string().min(2).max(120),
  agentType: z.string().min(2).max(120),
  businessModel: z.enum(["b2b", "b2c", "hybrid"]),
  timeHorizon: z.enum(["6m", "12m", "24m"]),
  monthlyActiveUsers: z.number().int().min(1).max(500000),
  averageContractValue: z.number().min(50).max(500000)
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const rawPayload = (await request.json()) as AnalyzeRequest;
    const parsed = analyzeSchema.safeParse(rawPayload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid analysis request. Check market, agent type, and numeric inputs."
        },
        { status: 400 }
      );
    }

    const hasAccess = request.headers.get("cookie")?.includes("ae_access=granted") ?? false;
    const tier = hasAccess ? "paid" : "preview";

    const marketData = await gatherMarketData(parsed.data.market, parsed.data.agentType);

    const scoring = buildScoredAnalysis({
      request: parsed.data,
      signals: marketData.marketSignals,
      snapshot: marketData.snapshot,
      tier
    });

    const result: AnalysisResult = {
      id: scoring.id,
      createdAt: new Date().toISOString(),
      market: parsed.data.market,
      agentType: parsed.data.agentType,
      businessModel: parsed.data.businessModel,
      timeHorizon: parsed.data.timeHorizon,
      executiveSummary: scoring.executiveSummary,
      marketSignals: marketData.marketSignals,
      valueMetrics: scoring.valueMetrics,
      opportunities: scoring.opportunities,
      economicImpact: scoring.economicImpact,
      recommendation: scoring.recommendation,
      tier
    };

    void persistAnalysis(result);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to analyze market data";
    return NextResponse.json({ message }, { status: 500 });
  }
}
