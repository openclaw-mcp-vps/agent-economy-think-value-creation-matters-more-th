"use client";

import axios from "axios";
import { Loader2, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MarketSignalsChart } from "@/components/ui/market-signals-chart";
import { ValueCreationMetrics } from "@/components/ui/value-creation-metrics";

type MarketSignal = {
  id: string;
  segment: string;
  demandGrowth: number;
  activationRate: number;
  retentionStrength: number;
  willingnessToPay: number;
  outcomeDepth: number;
  hypeExposure: number;
  valueCreationIndex: number;
};

type MarketDataResponse = {
  generatedAt: string;
  averages: {
    valueCreationIndex: number;
    hypeExposure: number;
  };
  signals: MarketSignal[];
};

type AnalysisResponse = {
  useCaseName: string;
  targetBuyer: string;
  category: string;
  opportunityScore: number;
  riskScore: number;
  annualValueCreated: number;
  annualValueCaptured: number;
  annualNetValue: number;
  valueCaptureRatio: number;
  executionMargin: number;
  recommendations: string[];
};

export function Dashboard() {
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [formState, setFormState] = useState({
    useCaseName: "Customer onboarding QA agent",
    targetBuyer: "B2B SaaS product teams",
    usersImpacted: "120",
    hoursSavedPerUserMonthly: "3.5",
    errorReductionPercent: "28",
    expectedPricePerOrgMonthly: "1500",
    implementationCostMonthly: "4200",
    category: "Support Resolution Agents"
  });

  useEffect(() => {
    let mounted = true;

    async function fetchMarketData() {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get<MarketDataResponse>("/api/market-data");
        if (mounted) {
          setMarketData(response.data);
        }
      } catch {
        if (mounted) {
          setError("Unable to load market signals. Please refresh.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchMarketData();

    return () => {
      mounted = false;
    };
  }, []);

  const topSignal = useMemo(() => {
    if (!marketData?.signals.length) {
      return null;
    }
    return marketData.signals[0];
  }, [marketData]);

  async function runAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAnalysisError("");
    setIsAnalyzing(true);

    try {
      const payload = {
        useCaseName: formState.useCaseName,
        targetBuyer: formState.targetBuyer,
        usersImpacted: Number(formState.usersImpacted),
        hoursSavedPerUserMonthly: Number(formState.hoursSavedPerUserMonthly),
        errorReductionPercent: Number(formState.errorReductionPercent),
        expectedPricePerOrgMonthly: Number(formState.expectedPricePerOrgMonthly),
        implementationCostMonthly: Number(formState.implementationCostMonthly),
        category: formState.category
      };

      const response = await axios.post<AnalysisResponse>("/api/analysis", payload);
      setAnalysisResult(response.data);
    } catch (analysisRequestError) {
      if (axios.isAxiosError(analysisRequestError)) {
        setAnalysisError(analysisRequestError.response?.data?.message ?? "Analysis failed. Validate your assumptions and try again.");
      } else {
        setAnalysisError("Analysis failed. Validate your assumptions and try again.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Updated from live model assumptions</p>
          <h1 className="text-3xl font-bold text-slate-100">Value Creation Dashboard</h1>
        </div>
        <Badge variant="secondary" className="w-fit text-xs">
          Focus: durable value over hype-driven growth
        </Badge>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex h-40 items-center justify-center text-slate-400">
            <Loader2 className="mr-2 size-5 animate-spin" /> Loading market signals...
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <CardContent className="py-8 text-sm text-rose-300">{error}</CardContent>
        </Card>
      ) : null}

      {marketData ? (
        <>
          <ValueCreationMetrics
            averageValueCreation={marketData.averages.valueCreationIndex}
            averageHypeExposure={marketData.averages.hypeExposure}
            topSegment={topSignal?.segment ?? "N/A"}
            topSegmentScore={topSignal?.valueCreationIndex ?? 0}
          />

          <Card>
            <CardHeader>
              <CardTitle>Market Segment Signal Comparison</CardTitle>
              <CardDescription>
                Compare value-creation potential, retention strength, and hype exposure before choosing which workflow to automate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MarketSignalsChart data={marketData.signals} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyze Your Agent Concept</CardTitle>
              <CardDescription>
                Model expected value creation and capture risk using your own assumptions. This helps prevent building a demo that cannot sustain real buyer budgets.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={runAnalysis}>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-slate-300" htmlFor="useCaseName">
                    Use Case Name
                  </label>
                  <Input
                    id="useCaseName"
                    value={formState.useCaseName}
                    onChange={(event) => setFormState((prev) => ({ ...prev, useCaseName: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-slate-300" htmlFor="targetBuyer">
                    Target Buyer
                  </label>
                  <Input
                    id="targetBuyer"
                    value={formState.targetBuyer}
                    onChange={(event) => setFormState((prev) => ({ ...prev, targetBuyer: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300" htmlFor="usersImpacted">
                    Users Impacted
                  </label>
                  <Input
                    id="usersImpacted"
                    type="number"
                    min={1}
                    value={formState.usersImpacted}
                    onChange={(event) => setFormState((prev) => ({ ...prev, usersImpacted: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300" htmlFor="hoursSavedPerUserMonthly">
                    Hours Saved / User / Month
                  </label>
                  <Input
                    id="hoursSavedPerUserMonthly"
                    type="number"
                    min={0.25}
                    step={0.25}
                    value={formState.hoursSavedPerUserMonthly}
                    onChange={(event) => setFormState((prev) => ({ ...prev, hoursSavedPerUserMonthly: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300" htmlFor="errorReductionPercent">
                    Error Reduction (%)
                  </label>
                  <Input
                    id="errorReductionPercent"
                    type="number"
                    min={0}
                    max={100}
                    value={formState.errorReductionPercent}
                    onChange={(event) => setFormState((prev) => ({ ...prev, errorReductionPercent: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300" htmlFor="expectedPricePerOrgMonthly">
                    Price / Org / Month ($)
                  </label>
                  <Input
                    id="expectedPricePerOrgMonthly"
                    type="number"
                    min={5}
                    value={formState.expectedPricePerOrgMonthly}
                    onChange={(event) => setFormState((prev) => ({ ...prev, expectedPricePerOrgMonthly: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300" htmlFor="implementationCostMonthly">
                    Implementation Cost / Month ($)
                  </label>
                  <Input
                    id="implementationCostMonthly"
                    type="number"
                    min={0}
                    value={formState.implementationCostMonthly}
                    onChange={(event) => setFormState((prev) => ({ ...prev, implementationCostMonthly: event.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-300" htmlFor="category">
                    Segment Category
                  </label>
                  <Input
                    id="category"
                    value={formState.category}
                    onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" className="w-full" disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />} Run Value Analysis
                  </Button>
                </div>

                {analysisError ? <p className="md:col-span-2 text-sm text-rose-300">{analysisError}</p> : null}
              </form>
            </CardContent>
          </Card>

          {analysisResult ? (
            <Card>
              <CardHeader>
                <CardTitle>{analysisResult.useCaseName}: Analysis Result</CardTitle>
                <CardDescription>
                  Opportunity score is high when created value is large, repeatable, and priced so buyers keep most of the upside.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <div className="rounded-lg border border-slate-700 p-3">
                    <p className="text-xs text-slate-400">Opportunity Score</p>
                    <p className="text-xl font-semibold text-emerald-300">{analysisResult.opportunityScore}</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 p-3">
                    <p className="text-xs text-slate-400">Risk Score</p>
                    <p className="text-xl font-semibold text-rose-300">{analysisResult.riskScore}</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 p-3">
                    <p className="text-xs text-slate-400">Annual Value Created</p>
                    <p className="text-xl font-semibold text-slate-100">${analysisResult.annualValueCreated.toLocaleString()}</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 p-3">
                    <p className="text-xs text-slate-400">Value Capture Ratio</p>
                    <p className="text-xl font-semibold text-slate-100">{analysisResult.valueCaptureRatio}%</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 p-3">
                    <p className="text-xs text-slate-400">Execution Margin</p>
                    <p className="text-xl font-semibold text-slate-100">{analysisResult.executionMargin}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-200">Recommended Next Moves</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {analysisResult.recommendations.map((recommendation) => (
                      <li key={recommendation} className="rounded-md border border-slate-700 bg-[#0f1520] p-3">
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
