import { z } from "zod";

export const marketSignalSchema = z.object({
  id: z.string(),
  segment: z.string(),
  demandGrowth: z.number(),
  activationRate: z.number(),
  retentionStrength: z.number(),
  willingnessToPay: z.number(),
  outcomeDepth: z.number(),
  hypeExposure: z.number()
});

export type MarketSignal = z.infer<typeof marketSignalSchema>;

const marketSignals: MarketSignal[] = [
  {
    id: "revops-automation",
    segment: "Revenue Ops Agents",
    demandGrowth: 82,
    activationRate: 74,
    retentionStrength: 79,
    willingnessToPay: 86,
    outcomeDepth: 88,
    hypeExposure: 41
  },
  {
    id: "support-resolution",
    segment: "Support Resolution Agents",
    demandGrowth: 77,
    activationRate: 81,
    retentionStrength: 72,
    willingnessToPay: 69,
    outcomeDepth: 84,
    hypeExposure: 53
  },
  {
    id: "compliance-monitoring",
    segment: "Compliance Monitoring Agents",
    demandGrowth: 68,
    activationRate: 63,
    retentionStrength: 83,
    willingnessToPay: 91,
    outcomeDepth: 90,
    hypeExposure: 26
  },
  {
    id: "dev-workflow",
    segment: "Developer Workflow Agents",
    demandGrowth: 89,
    activationRate: 77,
    retentionStrength: 66,
    willingnessToPay: 58,
    outcomeDepth: 73,
    hypeExposure: 67
  },
  {
    id: "finance-operations",
    segment: "Finance Operations Agents",
    demandGrowth: 64,
    activationRate: 58,
    retentionStrength: 87,
    willingnessToPay: 84,
    outcomeDepth: 85,
    hypeExposure: 29
  },
  {
    id: "sales-prospecting",
    segment: "Sales Prospecting Agents",
    demandGrowth: 85,
    activationRate: 69,
    retentionStrength: 54,
    willingnessToPay: 52,
    outcomeDepth: 61,
    hypeExposure: 78
  }
];

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export function calculateValueCreationIndex(signal: MarketSignal) {
  const outcomeComponent = signal.outcomeDepth * 0.26;
  const retentionComponent = signal.retentionStrength * 0.2;
  const demandComponent = signal.demandGrowth * 0.18;
  const activationComponent = signal.activationRate * 0.16;
  const pricingComponent = signal.willingnessToPay * 0.2;
  const hypePenalty = signal.hypeExposure * 0.22;

  return round(outcomeComponent + retentionComponent + demandComponent + activationComponent + pricingComponent - hypePenalty);
}

export function getMarketSignals() {
  const enriched = marketSignals
    .map((signal) => ({
      ...signal,
      valueCreationIndex: calculateValueCreationIndex(signal)
    }))
    .sort((a, b) => b.valueCreationIndex - a.valueCreationIndex);

  const averageHype = round(enriched.reduce((sum, signal) => sum + signal.hypeExposure, 0) / enriched.length);
  const averageCreation = round(enriched.reduce((sum, signal) => sum + signal.valueCreationIndex, 0) / enriched.length);

  return {
    generatedAt: new Date().toISOString(),
    averages: {
      valueCreationIndex: averageCreation,
      hypeExposure: averageHype
    },
    signals: enriched
  };
}

export const analysisInputSchema = z.object({
  useCaseName: z.string().min(3),
  targetBuyer: z.string().min(2),
  usersImpacted: z.number().min(1).max(100000),
  hoursSavedPerUserMonthly: z.number().min(0.25).max(200),
  errorReductionPercent: z.number().min(0).max(100),
  expectedPricePerOrgMonthly: z.number().min(5).max(100000),
  implementationCostMonthly: z.number().min(0).max(100000),
  category: z.string().min(2)
});

export type AnalysisInput = z.infer<typeof analysisInputSchema>;

export function analyzeValueCreation(input: AnalysisInput) {
  const estimatedHourlyCost = 62;
  const monthlyLaborValue = input.usersImpacted * input.hoursSavedPerUserMonthly * estimatedHourlyCost;
  const qualityMultiplier = 1 + input.errorReductionPercent / 100;
  const adjustedMonthlyValue = monthlyLaborValue * qualityMultiplier;
  const annualValueCreated = adjustedMonthlyValue * 12;

  const annualCapture = input.expectedPricePerOrgMonthly * 12;
  const annualCost = input.implementationCostMonthly * 12;
  const netAnnualValue = annualValueCreated - annualCost;

  const valueCaptureRatio = annualCapture / Math.max(annualValueCreated, 1);
  const executionMargin = netAnnualValue / Math.max(annualValueCreated, 1);

  const opportunityScore = round(
    Math.min(
      100,
      Math.max(
        0,
        35 * Math.log10(annualValueCreated / 1000 + 1) +
          30 * (input.errorReductionPercent / 100) +
          20 * Math.min(1, input.usersImpacted / 500) +
          15 * Math.max(0, 1 - valueCaptureRatio)
      )
    )
  );

  const riskScore = round(
    Math.min(
      100,
      Math.max(
        0,
        100 * (Math.max(0, valueCaptureRatio - 0.25) * 0.9 + Math.max(0, 0.35 - executionMargin) * 0.7)
      )
    )
  );

  const recommendations: string[] = [];

  if (valueCaptureRatio > 0.3) {
    recommendations.push("Your pricing captures too much of delivered value. Shift to usage tiers and land with a lower base plan.");
  } else {
    recommendations.push("Your price-to-value ratio is defensible. Prioritize shortening time-to-first-outcome in onboarding.");
  }

  if (input.errorReductionPercent < 20) {
    recommendations.push("Error reduction is weak. Add human approval loops in high-risk decisions to improve trust and measurable outcomes.");
  } else {
    recommendations.push("Quality impact looks strong. Instrument baseline-vs-agent comparisons in production to prove compounding gains.");
  }

  if (executionMargin < 0.45) {
    recommendations.push("Delivery costs may compress margin. Narrow scope to one workflow with high recurrence before expanding features.");
  } else {
    recommendations.push("Unit economics are healthy. Invest in distribution and integrations instead of adding low-demand capabilities.");
  }

  return {
    useCaseName: input.useCaseName,
    targetBuyer: input.targetBuyer,
    category: input.category,
    opportunityScore,
    riskScore,
    annualValueCreated: round(annualValueCreated),
    annualValueCaptured: round(annualCapture),
    annualNetValue: round(netAnnualValue),
    valueCaptureRatio: round(valueCaptureRatio * 100),
    executionMargin: round(executionMargin * 100),
    recommendations
  };
}
