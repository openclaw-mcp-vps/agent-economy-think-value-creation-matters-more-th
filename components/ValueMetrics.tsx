"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import type { ValueMetric } from "@/types/analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ValueMetricsProps {
  metrics: ValueMetric[];
}

export function ValueMetrics({ metrics }: ValueMetricsProps): React.JSX.Element {
  const chartData = metrics
    .filter((metric) => metric.unit !== "months")
    .map((metric) => ({
      label: metric.label.replace(" ", "\n"),
      score: metric.value,
      benchmark: metric.benchmark
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Value Creation Metrics</CardTitle>
        <CardDescription>Quantified signals that separate durable value creation from hype-driven demand.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {metrics.map((metric) => (
            <div key={metric.key} className="rounded-lg border border-zinc-800 bg-zinc-950/80 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold text-zinc-100">
                {metric.unit === "USD" ? `$${metric.value.toLocaleString()}` : metric.value}
                {metric.unit === "%" ? "%" : metric.unit === "months" ? " mo" : ""}
              </p>
              <p className="mt-1 text-xs text-zinc-400">Benchmark: {metric.benchmark}{metric.unit === "%" ? "%" : ""}</p>
              <p className="mt-3 text-xs text-zinc-300">{metric.interpretation}</p>
            </div>
          ))}
        </div>

        <div className="h-72 w-full rounded-lg border border-zinc-800 bg-zinc-950/70 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 8 }}>
              <XAxis dataKey="label" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: "#1f2937" }}
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                  color: "#f3f4f6"
                }}
              />
              <Bar dataKey="benchmark" fill="#374151" radius={[4, 4, 0, 0]} />
              <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
