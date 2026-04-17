export type BusinessModel = "b2b" | "b2c" | "hybrid";
export type TimeHorizon = "6m" | "12m" | "24m";

export interface AnalyzeRequest {
  market: string;
  agentType: string;
  businessModel: BusinessModel;
  timeHorizon: TimeHorizon;
  monthlyActiveUsers: number;
  averageContractValue: number;
}

export interface MarketSignal {
  source: "github" | "hackernews" | "reddit";
  signalVolume: number;
  momentum: number;
  sentiment: number;
  confidence: number;
  summary: string;
}

export interface ValueMetric {
  key: string;
  label: string;
  value: number;
  benchmark: number;
  unit: "%" | "USD" | "months";
  interpretation: string;
}

export interface EconomicImpact {
  annualValueUnlocked: number;
  implementationCost: number;
  paybackMonths: number;
  confidence: number;
}

export interface OpportunityScore {
  useCase: string;
  category: string;
  valueCreationScore: number;
  captureDifficulty: number;
  demandStrength: number;
  moatPotential: number;
  executionComplexity: number;
  overallScore: number;
  rationale: string[];
  nextSteps: string[];
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  market: string;
  agentType: string;
  businessModel: BusinessModel;
  timeHorizon: TimeHorizon;
  executiveSummary: string;
  marketSignals: MarketSignal[];
  valueMetrics: ValueMetric[];
  opportunities: OpportunityScore[];
  economicImpact: EconomicImpact;
  recommendation: string;
  tier: "preview" | "paid";
}

export interface MarketDataSnapshot {
  githubRepos: number;
  githubRecentPushRatio: number;
  hnMentions: number;
  hnAvgPoints: number;
  redditMentions: number;
  redditAvgComments: number;
}
