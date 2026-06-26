"use client";

import Link from "next/link";
import { useDemo } from "@/lib/demo-context";
import { inr, inrFull, signedPct } from "@/lib/format";
import { allocationForChart, totalValue } from "@/lib/engine";
import { Card, Stat, Badge, ProgressBar, Button, ASSET_COLORS } from "@/components/ui";
import { AllocationDonut, AllocationCompare } from "@/components/charts";
import { goalIcon } from "@/components/icons";
import {
  Link2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Wallet,
  HeartPulse,
  PiggyBank,
  Building2,
} from "lucide-react";

export default function Dashboard() {
  const d = useDemo();
  const { persona, risk, netWorth, investable, insuranceCover, current, target, rebalance, offers, goalProjections } = d;
  const firstName = persona.name.split(" ")[0];
  const chartData = allocationForChart(persona.holdings);
  const moves = rebalance.filter((r) => r.action !== "Hold");
  const sortedHoldings = [...persona.holdings].sort((a, b) => b.value - a.value);
  const surplus = persona.monthlySurplus;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Namaste, {firstName} 👋</h1>
          <p className="text-sm text-ink-500">{persona.occupation} · {persona.city}</p>
        </div>
        {d.aaConnected ? (
          <Badge tone="positive"><ShieldCheck className="h-3.5 w-3.5" /> 360° view via Account Aggregator</Badge>
        ) : (
          <Link href="/onboarding">
            <Button variant="gold"><Link2 className="h-4 w-4" /> Link accounts via AA</Button>
          </Link>
        )}
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card><Stat label="Net worth" value={inr(netWorth)} hint={`${persona.holdings.length} accounts, ${new Set(persona.holdings.map(h=>h.institution)).size} institutions`} accent="navy" /></Card>
        <Card><Stat label="Investable" value={inr(investable)} hint="excl. insurance" accent="teal" /></Card>
        <Card><Stat label="Life cover" value={inr(insuranceCover)} hint={insuranceCover < persona.monthlyIncome*12*4 ? "below 10× income" : "adequate"} accent="gold" /></Card>
        <Card><Stat label="Monthly surplus" value={inr(surplus)} hint={signedPct((surplus/persona.monthlyIncome)*100,0)+" of income"} accent="navy" /></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Allocation */}
        <Card className="lg:col-span-1">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">Asset allocation</h2>
            <Badge tone="teal">Aggregated</Badge>
          </div>
          <AllocationDonut data={chartData} size={190} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {chartData.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: ASSET_COLORS[c.name] }} />
                <span className="text-ink-700">{c.name}</span>
                <span className="ml-auto font-semibold tabular-nums text-navy-900">{inr(c.value)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Current vs target + risk */}
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">Current vs target mix</h2>
            <Badge tone="navy">{risk.profile} profile</Badge>
          </div>
          <AllocationCompare current={current} target={target} />
          <div className="mt-4 rounded-xl bg-mist-50 p-3 text-xs leading-relaxed text-ink-700">
            <Sparkles className="mr-1 inline h-3.5 w-3.5 text-teal-600" />
            {risk.rationale}
          </div>
          {moves.length > 0 && (
            <Link href="/advice" className="mt-3 flex items-center justify-between rounded-xl border border-mist-200 bg-white p-3 hover:bg-mist-50">
              <span className="text-sm text-ink-700">
                <TrendingUp className="mr-1 inline h-4 w-4 text-teal-600" />
                {moves.length} AI rebalancing signal{moves.length > 1 ? "s" : ""}: {moves.slice(0,2).map((m) => `${m.action} ${m.assetClass}`).join(", ")}
              </span>
              <ArrowRight className="h-4 w-4 text-ink-500" />
            </Link>
          )}
        </Card>
      </div>

      {/* Holdings table */}
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-900">Your 360° portfolio</h2>
          <Badge tone="teal"><Link2 className="h-3.5 w-3.5" /> Pulled via Account Aggregator</Badge>
        </div>
        <div className="overflow-x-auto scroll-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist-200 text-left text-xs uppercase tracking-wide text-ink-500">
                <th className="px-2 py-2 font-medium">Institution</th>
                <th className="px-2 py-2 font-medium">Holding</th>
                <th className="px-2 py-2 font-medium">Class</th>
                <th className="px-2 py-2 text-right font-medium">Value</th>
                <th className="px-2 py-2 text-right font-medium">Return</th>
              </tr>
            </thead>
            <tbody>
              {sortedHoldings.map((h) => (
                <tr key={h.id} className="border-b border-mist-100 last:border-0">
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-ink-300" />
                      <span className="font-medium text-navy-900">{h.institution}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-ink-700">{h.name}</td>
                  <td className="px-2 py-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: ASSET_COLORS[h.assetClass] }} />
                      <span className="text-xs text-ink-700">{h.assetClass}</span>
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-right font-semibold tabular-nums text-navy-900">{inrFull(h.value)}</td>
                  <td className="px-2 py-2.5 text-right tabular-nums">
                    {h.returnPct != null ? (
                      <span className={h.returnPct >= 8 ? "text-positive" : "text-ink-500"}>{signedPct(h.returnPct)}</span>
                    ) : (
                      <span className="text-ink-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Goals + cross-sell */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900">Goals</h2>
            <Link href="/goals" className="text-xs font-semibold text-teal-600 hover:underline">View all →</Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {persona.goals.map((g, i) => {
              const Icon = goalIcon(g.icon);
              const proj = goalProjections[i];
              return (
                <div key={g.id} className="rounded-xl border border-mist-200 p-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-teal-600" />
                    <span className="text-sm font-semibold text-navy-900">{g.name}</span>
                  </div>
                  <div className="mt-2 text-xs text-ink-500">{inr(g.targetAmount)} by {g.targetYear}</div>
                  <div className="mt-2"><ProgressBar value={proj.onTrackPct} /></div>
                  <div className="mt-1 text-[11px] text-ink-500">{proj.onTrackPct.toFixed(0)}% on track</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="bg-mist-50">
          <div className="mb-2 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-gold-600" />
            <h2 className="text-base font-bold text-navy-900">Best next step</h2>
          </div>
          {offers[0] ? (
            <>
              <div className="text-sm font-semibold text-navy-900">{offers[0].product}</div>
              <Badge tone="gold" className="mt-1">{offers[0].provider}</Badge>
              <p className="mt-2 text-xs leading-relaxed text-ink-700 line-clamp-4">{offers[0].reason}</p>
              <Link href="/cross-sell"><Button variant="gold" className="mt-3 w-full">See all suggestions <ArrowRight className="h-4 w-4" /></Button></Link>
            </>
          ) : (
            <p className="text-sm text-ink-500"><HeartPulse className="mr-1 inline h-4 w-4" />Your portfolio looks well-balanced.</p>
          )}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-500">
            <PiggyBank className="h-3.5 w-3.5" /> Suggestions are explainable & suitability-aware.
          </div>
        </Card>
      </div>
    </div>
  );
}
