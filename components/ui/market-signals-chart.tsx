"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type MarketSignalChartPoint = {
  segment: string;
  valueCreationIndex: number;
  hypeExposure: number;
  retentionStrength: number;
};

type MarketSignalsChartProps = {
  data: MarketSignalChartPoint[];
};

export function MarketSignalsChart({ data }: MarketSignalsChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
          <XAxis
            dataKey="segment"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            angle={-25}
            height={70}
            interval={0}
            textAnchor="end"
          />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "#0f1520",
              color: "#e2e8f0"
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="valueCreationIndex" stroke="#34d399" strokeWidth={3} dot={false} name="Value Creation" />
          <Line type="monotone" dataKey="retentionStrength" stroke="#93c5fd" strokeWidth={2} dot={false} name="Retention Signal" />
          <Line type="monotone" dataKey="hypeExposure" stroke="#fda4af" strokeWidth={2} dot={false} name="Hype Exposure" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
