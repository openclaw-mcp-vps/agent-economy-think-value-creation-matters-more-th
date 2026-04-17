import crypto from "crypto";

import type {
  AnalyzeRequest,
  EconomicImpact,
  OpportunityScore,
  ValueMetric,
  MarketSignal,
  MarketDataSnapshot
} from "@/types/analysis";

interface UseCaseTemplate {
  useCase: string;
  category: string;
  valueDensity: number;
  captureDifficulty: number;
  demandFit: number;
  moatPotential: number;
  executionComplexity: number;
  recommendedActions: string[];
}

const USE_CASE_TEMPLATES: UseCaseTemplate[] = [
  {
    useCase: "Revenue Leak Detection Agent",
    category: "Revenue Operations",
    valueDensity: 87,
    captureDifficulty: 44,
    demandFit: 81,
    moatPotential: 74,
    executionComplexity: 58,
    recommendedActions: [
      "Instrument customer funnel events and quantify lost revenue moments.",
      "Offer a two-week pilot tied to recovered revenue, not task automation metrics.",
      "Prioritize integration with CRM and billing tools to shorten activation time."
    ]
  },
  {
    useCase: "Customer Escalation Prevention Agent",
    category: "Support Economics",
    valueDensity: 79,
    captureDifficulty: 39,
    demandFit: 76,
    moatPotential: 68,
    executionComplexity: 52,
    recommendedActions: [
      "Map high-cost escalation scenarios and train agent interventions around those paths.",
      "Price on reduction in escalated tickets and SLA penalties.",
      "Deploy with human override to reduce adoption friction in regulated teams."
    ]
  },
  {
    useCase: "Compliance Workflow Copilot",
    category: "Risk & Compliance",
    valueDensity: 91,
    captureDifficulty: 61,
    demandFit: 69,
    moatPotential: 83,
    executionComplexity: 73,
    recommendedActions: [
      "Start with one high-frequency compliance workflow with measurable manual effort.",
      "Collect auditable action logs from day one to support enterprise procurement.",
      "Use a phased rollout with policy guardrails and explicit escalation paths."
    ]
  },
  {
    useCase: "Procurement Negotiation Intelligence Agent",
    category: "Cost Optimization",
    valueDensity: 85,
    captureDifficulty: 56,
    demandFit: 73,
    moatPotential: 79,
    executionComplexity: 66,
    recommendedActions: [
      "Ingest historical contract outcomes and model negotiation playbooks by vendor segment.",
      "Anchor pricing to realized savings above an agreed baseline.",
      "Integrate approvals and legal review loops to avoid shadow procurement risk."
    ]
  },
  {
    useCase: "Implementation Time Compression Agent",
    category: "Deployment Velocity",
    valueDensity: 74,
    captureDifficulty: 34,
    demandFit: 88,
    moatPotential: 57,
    executionComplexity: 46,
    recommendedActions: [
      "Target integration-heavy onboarding journeys that stall expansion revenue.",
      "Measure time-to-live and tie success metrics to activation milestones.",
      "Ship opinionated templates for the top three deployment patterns."
    ]
  }
];

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function deriveMarketDemand(signals: MarketSignal[]): number {
  const weighted = signals.map((signal) => signal.signalVolume * 0.4 + signal.momentum * 0.35 + signal.sentiment * 0.25);
  return clamp(average(weighted));
}

function deriveCompetitionIndex(snapshot: MarketDataSnapshot): number {
  const repoPressure = clamp(Math.log10(Math.max(snapshot.githubRepos, 1)) * 19);
  const founderNoise = clamp((snapshot.hnMentions / 50) * 100);
  return clamp(repoPressure * 0.65 + founderNoise * 0.35);
}

function deriveMonetizationModifier(request: AnalyzeRequest): number {
  const base = request.businessModel === "b2b" ? 1.12 : request.businessModel === "hybrid" ? 1.05 : 0.93;
  const contractStrength = clamp(request.averageContractValue / 4000, 0.4, 1.6);
  return base * contractStrength;
}

function deriveExecutionModifier(request: AnalyzeRequest): number {
  return request.timeHorizon === "6m" ? 1.12 : request.timeHorizon === "12m" ? 1 : 0.9;
}

function buildRationale(template: UseCaseTemplate, demand: number, competition: number): string[] {
  return [
    `${template.category} shows a modeled demand strength of ${Math.round(demand)} based on live market signals.`,
    `Competition pressure sits near ${Math.round(competition)}, so differentiation must come from measurable outcomes and domain depth.`,
    `Projected value density is ${template.valueDensity}/100, indicating strong economic upside if activation is fast.`
  ];
}

function buildValueMetrics(
  demand: number,
  competition: number,
  monetizationModifier: number,
  executionModifier: number,
  topScore: number,
  request: AnalyzeRequest
): ValueMetric[] {
  const paybackMonths = clamp(18 - topScore / 7 - request.averageContractValue / 2000, 2.5, 18);

  return [
    {
      key: "market-demand",
      label: "Market Demand Momentum",
      value: Number(demand.toFixed(1)),
      benchmark: 62,
      unit: "%",
      interpretation: demand >= 65 ? "Demand momentum is above baseline and worth immediate testing." : "Demand is moderate. Validate niche pain points before scaling GTM."
    },
    {
      key: "competition-density",
      label: "Competition Density",
      value: Number(competition.toFixed(1)),
      benchmark: 58,
      unit: "%",
      interpretation:
        competition >= 70
          ? "Competition is crowded. Lead with vertical workflows and proof of ROI."
          : "Competition is manageable, giving room for faster positioning experiments."
    },
    {
      key: "monetization-readiness",
      label: "Monetization Readiness",
      value: Number((monetizationModifier * 60).toFixed(1)),
      benchmark: 60,
      unit: "%",
      interpretation:
        monetizationModifier >= 1
          ? "Pricing power is healthy if tied to economic outcomes instead of usage volume."
          : "Monetization is fragile. Improve value packaging and ROI framing."
    },
    {
      key: "execution-risk",
      label: "Execution Compression",
      value: Number((100 - executionModifier * 35).toFixed(1)),
      benchmark: 64,
      unit: "%",
      interpretation:
        executionModifier > 1
          ? "Short horizon increases execution pressure. Scope aggressively."
          : "Longer horizon allows deeper integrations and stronger defensibility."
    },
    {
      key: "payback-window",
      label: "Estimated Customer Payback",
      value: Number(paybackMonths.toFixed(1)),
      benchmark: 9,
      unit: "months",
      interpretation:
        paybackMonths <= 8
          ? "Customers should see economic return quickly, improving conversion odds."
          : "Payback looks slow. Narrow scope to high-frequency workflows first."
    }
  ];
}

function estimateEconomicImpact(topOpportunity: OpportunityScore, request: AnalyzeRequest): EconomicImpact {
  const annualValueUnlocked = Math.round(
    request.monthlyActiveUsers * 12 * (request.averageContractValue * (topOpportunity.valueCreationScore / 140))
  );
  const implementationCost = Math.round(annualValueUnlocked * (topOpportunity.executionComplexity / 340));
  const paybackMonths = Number((implementationCost / Math.max(annualValueUnlocked / 12, 1)).toFixed(1));
  const confidence = clamp(90 - topOpportunity.captureDifficulty * 0.45);

  return {
    annualValueUnlocked,
    implementationCost,
    paybackMonths,
    confidence: Number(confidence.toFixed(1))
  };
}

function hashId(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex").slice(0, 16);
}

export interface ScoringInput {
  request: AnalyzeRequest;
  signals: MarketSignal[];
  snapshot: MarketDataSnapshot;
  tier: "preview" | "paid";
}

export function buildScoredAnalysis(input: ScoringInput): {
  id: string;
  executiveSummary: string;
  valueMetrics: ValueMetric[];
  opportunities: OpportunityScore[];
  economicImpact: EconomicImpact;
  recommendation: string;
} {
  const demand = deriveMarketDemand(input.signals);
  const competition = deriveCompetitionIndex(input.snapshot);
  const monetizationModifier = deriveMonetizationModifier(input.request);
  const executionModifier = deriveExecutionModifier(input.request);

  const opportunities = USE_CASE_TEMPLATES.map((template) => {
    const demandStrength = clamp(template.demandFit * 0.65 + demand * 0.35);
    const valueCreationScore = clamp(template.valueDensity * monetizationModifier + demandStrength * 0.22);
    const captureDifficulty = clamp(template.captureDifficulty + competition * 0.22);
    const moatPotential = clamp(template.moatPotential + (100 - competition) * 0.12);
    const executionComplexity = clamp(template.executionComplexity * executionModifier);

    const overallScore = clamp(
      valueCreationScore * 0.36 +
        demandStrength * 0.22 +
        moatPotential * 0.2 +
        (100 - captureDifficulty) * 0.14 +
        (100 - executionComplexity) * 0.08
    );

    return {
      useCase: template.useCase,
      category: template.category,
      valueCreationScore: Number(valueCreationScore.toFixed(1)),
      captureDifficulty: Number(captureDifficulty.toFixed(1)),
      demandStrength: Number(demandStrength.toFixed(1)),
      moatPotential: Number(moatPotential.toFixed(1)),
      executionComplexity: Number(executionComplexity.toFixed(1)),
      overallScore: Number(overallScore.toFixed(1)),
      rationale: buildRationale(template, demandStrength, competition),
      nextSteps: template.recommendedActions
    } satisfies OpportunityScore;
  })
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, input.tier === "paid" ? 5 : 2);

  const top = opportunities[0];
  const valueMetrics = buildValueMetrics(
    demand,
    competition,
    monetizationModifier,
    executionModifier,
    top?.overallScore ?? 0,
    input.request
  );

  const economicImpact = estimateEconomicImpact(top, input.request);
  const recommendation =
    top.overallScore >= 75
      ? `Prioritize ${top.useCase} first. Market demand and monetization readiness support immediate pilot execution.`
      : `Signals are mixed. Start with a narrow ${top.useCase} pilot and validate ROI before expanding scope.`;

  const executiveSummary =
    `Analysis indicates ${input.request.market} has ${Math.round(demand)} demand momentum with competition at ${Math.round(
      competition
    )}. ` +
    `The best near-term value creation path is ${top.useCase}, where projected annual customer value unlock is ` +
    `$${economicImpact.annualValueUnlocked.toLocaleString()} and expected payback is ${economicImpact.paybackMonths} months.`;

  const id = hashId(`${input.request.market}-${input.request.agentType}-${Date.now()}`);

  return {
    id,
    executiveSummary,
    valueMetrics,
    opportunities,
    economicImpact,
    recommendation
  };
}
