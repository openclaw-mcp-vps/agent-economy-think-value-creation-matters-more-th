"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { OpportunityScore } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OpportunityScorerProps {
  opportunities: OpportunityScore[];
}

export function OpportunityScorer({ opportunities }: OpportunityScorerProps): React.JSX.Element {
  const [selected, setSelected] = useState<OpportunityScore>(opportunities[0]);

  const data = useMemo(
    () =>
      opportunities.map((opportunity) => ({
        useCase: opportunity.useCase,
        score: opportunity.overallScore
      })),
    [opportunities]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opportunity Ranking</CardTitle>
        <CardDescription>Weighted scoring based on market demand, value density, competition pressure, and execution complexity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-72 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis dataKey="useCase" type="category" width={220} tick={{ fill: "#d1d5db", fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "#1f2937" }}
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                  color: "#f3f4f6"
                }}
              />
              <Bar dataKey="score" fill="#22c55e" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {opportunities.map((opportunity) => (
            <Button
              key={opportunity.useCase}
              variant={selected.useCase === opportunity.useCase ? "default" : "outline"}
              className="justify-start text-left"
              onClick={() => setSelected(opportunity)}
            >
              {opportunity.useCase}
            </Button>
          ))}
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-lg font-semibold text-zinc-100">{selected.useCase}</h4>
              <p className="text-sm text-zinc-400">{selected.category}</p>
            </div>
            <Badge variant="default">Overall {selected.overallScore}</Badge>
          </div>

          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            <MetricRow label="Value Creation" value={selected.valueCreationScore} positive />
            <MetricRow label="Demand Strength" value={selected.demandStrength} positive />
            <MetricRow label="Moat Potential" value={selected.moatPotential} positive />
            <MetricRow label="Capture Difficulty" value={selected.captureDifficulty} positive={false} />
            <MetricRow label="Execution Complexity" value={selected.executionComplexity} positive={false} />
          </div>

          <div className="mt-5 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-zinc-200">Why this scores here</p>
              <ul className="space-y-2 text-sm text-zinc-300">
                {selected.rationale.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-zinc-200">Execution sequence</p>
              <ol className="space-y-2 text-sm text-zinc-300">
                {selected.nextSteps.map((step, index) => (
                  <li key={step}>
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricRow({ label, value, positive }: { label: string; value: number; positive: boolean }): React.JSX.Element {
  const normalizedWidth = `${Math.min(100, Math.max(0, value))}%`;

  return (
    <div className="rounded-md border border-zinc-800 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span className="text-zinc-200">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full ${positive ? "bg-emerald-500" : "bg-amber-500"}`}
          style={{ width: normalizedWidth }}
        />
      </div>
    </div>
  );
}
