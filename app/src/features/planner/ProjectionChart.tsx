"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ProjectionPoint } from "./types";

type Props = {
  data: ProjectionPoint[];
};

const compactCurrency = (value: number) => {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
};

export function ProjectionChart({ data }: Props) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={compactCurrency} tick={{ fontSize: 12 }} width={70} />
          <Tooltip
            formatter={(value) => [compactCurrency(Number(value)), "Net worth"]}
            labelFormatter={(label, payload) => {
              const point = payload?.[0]?.payload as ProjectionPoint | undefined;
              return point ? `Year ${label} (age ${point.age})` : `Year ${label}`;
            }}
          />
          <Bar dataKey="netWorth" isAnimationActive={false}>
            {data.map((point) => (
              <Cell key={point.year} fill={point.netWorth >= 0 ? "#10b981" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
