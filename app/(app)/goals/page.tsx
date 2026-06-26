"use client";

import { useDemo } from "@/lib/demo-context";
import { inr, inrFull } from "@/lib/format";
import { CURRENT_YEAR, expectedReturn } from "@/lib/engine";
import { Card, Badge, ProgressBar, Button } from "@/components/ui";
import { GoalGrowthChart } from "@/components/charts";
import { goalIcon } from "@/components/icons";
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GoalsPage() {
  const { persona, risk, goalProjections } = useDemo();
  const r = expectedReturn(risk.profile);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Goal-based planning</h1>
        <p className="text-sm text-ink-500">
          Each goal is funded from your aggregated corpus + SIPs, projected at a {(r * 100).toFixed(1)}% expected
          return for your {risk.profile.toLowerCase()} profile.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {persona.goals.map((g, i) => {
          const proj = goalProjections[i];
          const Icon = goalIcon(g.icon);
          const onTrack = proj.gap <= g.targetAmount * 0.05;
          const extraSIP = Math.max(0, proj.requiredSIP - g.monthlySIP);

          const series: { year: number; projected: number; target: number }[] = [];
          for (let y = CURRENT_YEAR; y <= g.targetYear; y += Math.max(1, Math.round((g.targetYear - CURRENT_YEAR) / 6))) {
            const n = y - CURRENT_YEAR;
            const months = n * 12;
            const iRate = r / 12;
            const fvCurrent = g.currentAmount * Math.pow(1 + r, n);
            const fvSip = months > 0 ? g.monthlySIP * ((Math.pow(1 + iRate, months) - 1) / iRate) : 0;
            series.push({ year: y, projected: Math.round(fvCurrent + fvSip), target: g.targetAmount });
          }
          if (series[series.length - 1]?.year !== g.targetYear) {
            series.push({ year: g.targetYear, projected: Math.round(proj.projected), target: g.targetAmount });
          }

          return (
            <Card key={g.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-navy-900">{g.name}</div>
                    <div className="text-xs text-ink-500">{inr(g.targetAmount)} by {g.targetYear} · {g.priority} priority</div>
                  </div>
                </div>
                {onTrack ? (
                  <Badge tone="positive"><CheckCircle2 className="h-3.5 w-3.5" /> On track</Badge>
                ) : (
                  <Badge tone="gold"><AlertTriangle className="h-3.5 w-3.5" /> Needs top-up</Badge>
                )}
              </div>

              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-ink-500">
                  <span>{proj.onTrackPct.toFixed(0)}% funded at maturity</span>
                  <span>{inr(proj.projected)} / {inr(g.targetAmount)}</span>
                </div>
                <ProgressBar value={proj.onTrackPct} tone={onTrack ? "teal" : "gold"} />
              </div>

              <div className="mt-4"><GoalGrowthChart series={series} /></div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Mini label="Current SIP" value={inr(g.monthlySIP) + "/mo"} />
                <Mini label="Recommended SIP" value={inr(proj.requiredSIP) + "/mo"} accent />
                <Mini label="Earmarked now" value={inr(g.currentAmount)} />
              </div>

              {extraSIP > 500 && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-mist-50 p-3 text-xs text-ink-700">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                  Increase this goal's SIP by <strong className="text-navy-900">{inrFull(extraSIP)}/month</strong> to fully fund it on time.
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="bg-mist-50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="font-bold text-navy-900">Want the “why” behind these numbers?</div>
            <div className="text-sm text-ink-500">See the explainable AI rationale for your allocation & rebalancing.</div>
          </div>
          <Link href="/advice"><Button>Explainable AI advice <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </Card>
    </div>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-mist-200 bg-white px-2 py-2">
      <div className="text-[10px] uppercase tracking-wide text-ink-500">{label}</div>
      <div className={`text-sm font-bold tabular-nums ${accent ? "text-teal-700" : "text-navy-900"}`}>{value}</div>
    </div>
  );
}
