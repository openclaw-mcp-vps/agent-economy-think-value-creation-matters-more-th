"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Radar } from "lucide-react";

import type { AnalysisResult, AnalyzeRequest, BusinessModel, TimeHorizon } from "@/types/analysis";
import { OpportunityScorer } from "@/components/OpportunityScorer";
import { ValueMetrics } from "@/components/ValueMetrics";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INITIAL_STATE: AnalyzeRequest = {
  market: "B2B SaaS",
  agentType: "Workflow automation",
  businessModel: "b2b",
  timeHorizon: "12m",
  monthlyActiveUsers: 250,
  averageContractValue: 2400
};

export function MarketAnalyzer(): React.JSX.Element {
  const [form, setForm] = useState<AnalyzeRequest>(INITIAL_STATE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof AnalyzeRequest>(key: K, value: AnalyzeRequest[K]): void => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleAnalyze = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as AnalysisResult & { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to complete analysis");
      }

      setResult(payload);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unexpected error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-2xl">Market Opportunity Analyzer</CardTitle>
              <CardDescription>
                Score where your AI agent can create measurable economic value before the hype cycle turns.
              </CardDescription>
            </div>
            <Badge variant="secondary">Pro Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Market Segment" htmlFor="market">
              <Input id="market" value={form.market} onChange={(event) => updateField("market", event.target.value)} />
            </Field>

            <Field label="Agent Type" htmlFor="agentType">
              <Input id="agentType" value={form.agentType} onChange={(event) => updateField("agentType", event.target.value)} />
            </Field>

            <Field label="Business Model" htmlFor="businessModel">
              <select
                id="businessModel"
                value={form.businessModel}
                onChange={(event) => updateField("businessModel", event.target.value as BusinessModel)}
                className="h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="b2b">B2B</option>
                <option value="hybrid">Hybrid</option>
                <option value="b2c">B2C</option>
              </select>
            </Field>

            <Field label="Planning Horizon" htmlFor="timeHorizon">
              <select
                id="timeHorizon"
                value={form.timeHorizon}
                onChange={(event) => updateField("timeHorizon", event.target.value as TimeHorizon)}
                className="h-10 rounded-md border border-zinc-700 bg-zinc-950 px-3 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="6m">6 Months</option>
                <option value="12m">12 Months</option>
                <option value="24m">24 Months</option>
              </select>
            </Field>

            <Field label="Monthly Active Users" htmlFor="mau">
              <Input
                id="mau"
                type="number"
                min={1}
                value={form.monthlyActiveUsers}
                onChange={(event) => updateField("monthlyActiveUsers", Number(event.target.value))}
              />
            </Field>

            <Field label="Average Contract Value (USD)" htmlFor="acv">
              <Input
                id="acv"
                type="number"
                min={100}
                value={form.averageContractValue}
                onChange={(event) => updateField("averageContractValue", Number(event.target.value))}
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radar className="h-4 w-4" />}
              {loading ? "Analyzing Market Signals..." : "Run Full Analysis"}
            </Button>
            <p className="text-sm text-zinc-400">Live inputs: GitHub repos, Hacker News discussions, Reddit market conversations.</p>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Executive Signal Brief</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-300">
              <p>{result.executiveSummary}</p>
              <div className="grid gap-3 md:grid-cols-3">
                {result.marketSignals.map((signal) => (
                  <div key={signal.source} className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">{signal.source}</p>
                    <p className="mt-2 text-sm text-zinc-200">{signal.summary}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <span className="text-zinc-400">Volume: {signal.signalVolume.toFixed(0)}</span>
                      <span className="text-zinc-400">Momentum: {signal.momentum.toFixed(0)}</span>
                      <span className="text-zinc-400">Sentiment: {signal.sentiment.toFixed(0)}</span>
                      <span className="text-zinc-400">Confidence: {signal.confidence.toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <ValueMetrics metrics={result.valueMetrics} />

          <Card>
            <CardHeader>
              <CardTitle>Economic Impact Forecast</CardTitle>
              <CardDescription>Modeled from your inputs and top-ranked opportunity.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm md:grid-cols-4">
              <ImpactMetric label="Annual Value Unlocked" value={`$${result.economicImpact.annualValueUnlocked.toLocaleString()}`} />
              <ImpactMetric label="Implementation Cost" value={`$${result.economicImpact.implementationCost.toLocaleString()}`} />
              <ImpactMetric label="Payback Window" value={`${result.economicImpact.paybackMonths} months`} />
              <ImpactMetric label="Model Confidence" value={`${result.economicImpact.confidence}%`} />
            </CardContent>
          </Card>

          <OpportunityScorer opportunities={result.opportunities} />

          <Card>
            <CardContent className="flex flex-col gap-3 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Recommended next move</p>
                <p className="mt-1 text-zinc-200">{result.recommendation}</p>
              </div>
              <Button variant="outline">
                Export Execution Plan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function ImpactMetric({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-zinc-100">{value}</p>
    </div>
  );
}
