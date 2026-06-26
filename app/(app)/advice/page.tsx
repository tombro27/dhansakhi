"use client";

import { useEffect, useState, useCallback } from "react";
import { useDemo } from "@/lib/demo-context";
import { useAdvisorContext } from "@/lib/use-advisor-context";
import { inr, signedPct } from "@/lib/format";
import { Card, Badge, Button, ASSET_COLORS } from "@/components/ui";
import { AllocationCompare } from "@/components/charts";
import { languageLabel } from "@/components/LanguageToggle";
import { Sparkles, RefreshCw, ArrowUpRight, ArrowDownRight, Minus, Bot, Info } from "lucide-react";
import type { RebalanceAction } from "@/lib/types";

function whyFor(a: RebalanceAction, profile: string): string {
  if (a.assetClass === "Equity" && a.action === "Increase")
    return `Under target for a ${profile.toLowerCase()} investor — more equity raises expected long-term growth over your horizon.`;
  if (a.assetClass === "Equity" && a.action === "Reduce")
    return `Trimming equity locks in gains and lowers volatility as you approach your goals.`;
  if (a.assetClass === "Cash" && a.action === "Reduce")
    return `Idle cash earns little — redeploying part of it lifts returns without breaching your risk comfort.`;
  if (a.assetClass === "Debt" && a.action === "Increase")
    return `Adding debt stabilises the portfolio and funds near-term goals safely.`;
  if (a.assetClass === "Gold" && a.action === "Increase")
    return `A small gold sleeve hedges inflation and diversifies away from equity/debt.`;
  return `Within tolerance — no change needed right now.`;
}

export default function AdvicePage() {
  const { risk, current, target, rebalance, investable, language } = useDemo();
  const ctx = useAdvisorContext();
  const [narrative, setNarrative] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchNarrative = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: ctx, language }),
      });
      const data = await res.json();
      setNarrative(data.reply ?? "");
      setSource(data.source ?? "");
    } catch {
      setNarrative("Could not generate the rationale right now.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(ctx), language]);

  useEffect(() => {
    fetchNarrative();
  }, [fetchNarrative]);

  const moves = rebalance.filter((m) => m.action !== "Hold");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Explainable AI advice</h1>
        <p className="text-sm text-ink-500">Every recommendation comes with a plain-language “why”. No black boxes.</p>
      </div>

      {/* Gemini narrative */}
      <Card className="border-teal-500/30 bg-gradient-to-br from-white to-teal-600/5">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-gradient text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-navy-900">Why this plan suits you</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={source === "gemini" ? "teal" : "neutral"}>
              <Bot className="h-3.5 w-3.5" /> {source === "gemini" ? "Gemini" : "Demo response"}
            </Badge>
            <Button variant="ghost" onClick={fetchNarrative} className="px-2.5 py-1.5">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="space-y-2 py-2">
            <div className="h-3 w-5/6 animate-pulse rounded bg-mist-100" />
            <div className="h-3 w-full animate-pulse rounded bg-mist-100" />
            <div className="h-3 w-4/6 animate-pulse rounded bg-mist-100" />
          </div>
        ) : (
          <p className="whitespace-pre-line text-sm leading-relaxed text-ink-700">{stripMd(narrative)}</p>
        )}
        <div className="mt-2 text-[11px] text-ink-500">
          Generated in <strong>{languageLabel(language)}</strong> · profile-linked · suitability-aware (SEBI IA principles).
        </div>
      </Card>

      {/* Rebalancing */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 text-base font-bold text-navy-900">Target vs current</h2>
          <AllocationCompare current={current} target={target} />
          <div className="mt-4 rounded-xl bg-mist-50 p-3 text-xs leading-relaxed text-ink-700">
            <Info className="mr-1 inline h-3.5 w-3.5 text-teal-600" />{risk.rationale}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="mb-3 text-base font-bold text-navy-900">Recommended rebalancing</h2>
          {moves.length === 0 ? (
            <p className="text-sm text-ink-500">Your allocation already matches your target — no rebalancing needed.</p>
          ) : (
            <div className="space-y-3">
              {moves.map((m) => (
                <div key={m.assetClass} className="rounded-xl border border-mist-200 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: ASSET_COLORS[m.assetClass] }} />
                      <span className="text-sm font-semibold text-navy-900">{m.assetClass}</span>
                      <ActionBadge action={m.action} />
                    </div>
                    <div className="text-right text-xs tabular-nums text-ink-500">
                      {m.currentPct.toFixed(0)}% → {m.targetPct.toFixed(0)}% · {m.deltaAmount >= 0 ? "+" : ""}{inr(m.deltaAmount)}
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-700">{whyFor(m, risk.profile)}</p>
                </div>
              ))}
              <div className="text-[11px] text-ink-500">Rebalancing applied to your {inr(investable)} investable corpus.</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  if (action === "Increase") return <Badge tone="positive"><ArrowUpRight className="h-3 w-3" /> Increase</Badge>;
  if (action === "Reduce") return <Badge tone="negative"><ArrowDownRight className="h-3 w-3" /> Reduce</Badge>;
  return <Badge tone="neutral"><Minus className="h-3 w-3" /> Hold</Badge>;
}

/** light markdown strip for the narrative (we render plain text). */
function stripMd(s: string): string {
  return s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/_(.*?)_/g, "$1");
}
