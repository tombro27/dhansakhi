"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { ASSET_COLORS } from "@/components/ui";
import { inr } from "@/lib/format";
import type { AllocationMap } from "@/lib/types";

export function AllocationDonut({
  data,
  size = 200,
}: {
  data: { name: string; value: number }[];
  size?: number;
}) {
  const total = data.reduce((a, d) => a + d.value, 0);
  return (
    <div style={{ width: "100%", height: size }} className="relative">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={ASSET_COLORS[d.name] ?? "#94a3b8"} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [inr(Number(v)), ""] as [string, string]}
            contentStyle={{ borderRadius: 12, border: "1px solid #dfe8f1", fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-ink-500">Total</span>
        <span className="text-lg font-bold text-navy-900">{inr(total)}</span>
      </div>
    </div>
  );
}

/** Current vs target allocation, as horizontal comparison bars. */
export function AllocationCompare({
  current,
  target,
}: {
  current: AllocationMap;
  target: AllocationMap;
}) {
  const classes: (keyof AllocationMap)[] = ["Equity", "Debt", "Gold", "Cash"];
  return (
    <div className="space-y-3">
      {classes.map((c) => (
        <div key={c}>
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-700">{c}</span>
            <span className="tabular-nums text-ink-500">
              now {current[c].toFixed(0)}% → target {target[c].toFixed(0)}%
            </span>
          </div>
          <div className="relative h-2.5 w-full rounded-full bg-mist-100">
            <div
              className="absolute top-0 left-0 h-full rounded-full opacity-40"
              style={{ width: `${current[c]}%`, background: ASSET_COLORS[c] }}
            />
            <div
              className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded bg-navy-900"
              style={{ left: `calc(${target[c]}% - 1px)` }}
              title={`Target ${target[c].toFixed(0)}%`}
            />
          </div>
        </div>
      ))}
      <div className="flex items-center gap-3 pt-1 text-[11px] text-ink-500">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-3 rounded bg-teal-600/40" /> current
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-0.5 bg-navy-900" /> target
        </span>
      </div>
    </div>
  );
}

/** Goal corpus projection over time (current vs needed). */
export function GoalGrowthChart({
  series,
  height = 180,
}: {
  series: { year: number; projected: number; target: number }[];
  height?: number;
}) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <AreaChart data={series} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="g-proj" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00b07f" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#00b07f" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#5b6b80" }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => inr(Number(v))} tick={{ fontSize: 11, fill: "#5b6b80" }} axisLine={false} tickLine={false} width={56} />
          <Tooltip
            formatter={(v, n) => [inr(Number(v)), n === "projected" ? "Projected" : "Target"] as [string, string]}
            contentStyle={{ borderRadius: 12, border: "1px solid #dfe8f1", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="projected" stroke="#00936b" strokeWidth={2.5} fill="url(#g-proj)" />
          <Area type="monotone" dataKey="target" stroke="#e6a817" strokeWidth={2} strokeDasharray="5 4" fill="none" />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
