"use client";

import { useDemo } from "@/lib/demo-context";
import { inr } from "@/lib/format";
import type { AdvisorContext } from "@/lib/advisor-context";

/** Builds the compact AdvisorContext that the AI endpoints expect. */
export function useAdvisorContext(): AdvisorContext {
  const d = useDemo();
  return {
    name: d.persona.name,
    age: d.persona.age,
    city: d.persona.city,
    riskProfile: d.risk.profile,
    riskRationale: d.risk.rationale,
    netWorthInr: inr(d.netWorth),
    investableInr: inr(d.investable),
    insuranceCoverInr: inr(d.insuranceCover),
    current: d.current,
    target: d.target,
    goals: d.persona.goals.map((g, i) => ({
      name: g.name,
      onTrackPct: d.goalProjections[i]?.onTrackPct ?? 0,
      requiredSIP: d.goalProjections[i]?.requiredSIP ?? 0,
      targetYear: g.targetYear,
    })),
    offers: d.offers.map((o) => ({ product: o.product, provider: o.provider, reason: o.reason })),
    rebalance: d.rebalance.map((r) => ({ assetClass: r.assetClass, action: r.action, deltaPct: r.deltaPct })),
  };
}
