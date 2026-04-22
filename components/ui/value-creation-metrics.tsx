import { AlertTriangle, BarChart3, CircleDollarSign, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ValueCreationMetricsProps = {
  averageValueCreation: number;
  averageHypeExposure: number;
  topSegment: string;
  topSegmentScore: number;
};

export function ValueCreationMetrics({
  averageValueCreation,
  averageHypeExposure,
  topSegment,
  topSegmentScore
}: ValueCreationMetricsProps) {
  const cards = [
    {
      label: "Average Value Creation",
      value: `${averageValueCreation.toFixed(1)} / 100`,
      helper: "Cross-market benchmark from current dataset",
      icon: BarChart3
    },
    {
      label: "Average Hype Exposure",
      value: `${averageHypeExposure.toFixed(1)} / 100`,
      helper: "Lower is better for resilient demand",
      icon: AlertTriangle
    },
    {
      label: "Top Segment",
      value: topSegment,
      helper: `Score ${topSegmentScore.toFixed(1)} driven by measurable business outcomes`,
      icon: TrendingUp
    },
    {
      label: "Pricing Insight",
      value: "Capture under 25%",
      helper: "Best conversions happen when buyers keep most upside",
      icon: CircleDollarSign
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-slate-300">
              {card.label}
              <card.icon className="size-4 text-emerald-300" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-xl font-semibold text-slate-100">{card.value}</p>
            <p className="text-xs text-slate-400">{card.helper}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
