"use client";

import { useState } from "react";
import { useDemo } from "@/lib/demo-context";
import { inr, inrFull } from "@/lib/format";
import { Card, Badge, Button } from "@/components/ui";
import { ShoppingBag, Check, Plus, TrendingUp, Building2, ShieldCheck, Landmark, Coins } from "lucide-react";
import type { CrossSellOffer } from "@/lib/types";

const PROVIDER_META: Record<string, { tone: "navy" | "gold" | "teal"; icon: typeof Building2 }> = {
  "IDBI Bank": { tone: "navy", icon: Building2 },
  LIC: { tone: "gold", icon: ShieldCheck },
  "IDBI Mutual Fund": { tone: "teal", icon: Coins },
  "NPS (IDBI POP)": { tone: "teal", icon: Landmark },
};

export default function CrossSellPage() {
  const { offers, persona } = useDemo();
  const [added, setAdded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">For you — next best steps</h1>
        <p className="text-sm text-ink-500">
          Goal-completion suggestions from IDBI &amp; LIC, derived from gaps in {persona.name.split(" ")[0]}'s portfolio.
          Each one explains <em>why</em>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {offers.map((o) => (
          <OfferCard key={o.id} o={o} added={!!added[o.id]} onAdd={() => setAdded((a) => ({ ...a, [o.id]: !a[o.id] }))} />
        ))}
        {offers.length === 0 && (
          <Card><p className="text-sm text-ink-500">This customer's portfolio is well-rounded — no pressing product gaps.</p></Card>
        )}
      </div>

      {/* ROI model */}
      <Card className="bg-brand-gradient text-white">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-teal-400" />
          <h2 className="text-base font-bold">What this means for IDBI Bank</h2>
        </div>
        <p className="mt-2 text-sm text-ink-300">
          Cross-sell framed as goal-completion (not push-selling) converts far better. Industry benchmarks:
          generic campaigns convert at <strong className="text-white">1–3%</strong>; AI next-best-offer
          personalization reaches <strong className="text-white">8–18%</strong> — a ~6× lift, with 25–40% revenue uplift.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Roi label="Targeted mass-affluent" value="1,00,000" sub="active customers (illustrative)" />
          <Roi label="AI conversion" value="12%" sub="vs 2% generic" />
          <Roi label="Avg. annual margin / product" value={inr(4000)} sub="FD/MF/NPS/LIC blend" />
          <Roi label="Incremental revenue" value="₹4.8 Cr/yr" sub="one campaign · payback < 18 mo" />
        </div>
        <p className="mt-3 text-[11px] text-ink-300">
          Illustrative industry-benchmark projection, not actual traction. Scales across IDBI's full active base.
        </p>
      </Card>
    </div>
  );
}

function OfferCard({ o, added, onAdd }: { o: CrossSellOffer; added: boolean; onAdd: () => void }) {
  const meta = PROVIDER_META[o.provider] ?? { tone: "neutral" as const, icon: ShoppingBag };
  const Icon = meta.icon;
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mist-100 text-navy-900">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-navy-900">{o.product}</div>
            <Badge tone={meta.tone as "navy" | "gold" | "teal"} className="mt-1">{o.provider}</Badge>
          </div>
        </div>
        <Badge tone="neutral">for {o.forGoal}</Badge>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">{o.reason}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm">
          <span className="text-ink-500">Suggested:</span>{" "}
          <span className="font-bold text-navy-900">{inrFull(o.ctaAmount)}{o.cadence === "monthly" ? "/mo" : " one-time"}</span>
        </div>
        <Button variant={added ? "ghost" : "gold"} onClick={onAdd}>
          {added ? <><Check className="h-4 w-4" /> Added to plan</> : <><Plus className="h-4 w-4" /> Add to plan</>}
        </Button>
      </div>
    </Card>
  );
}

function Roi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="text-[11px] uppercase tracking-wide text-ink-300">{label}</div>
      <div className="mt-0.5 text-xl font-bold text-gradient-teal">{value}</div>
      <div className="text-[11px] text-ink-300">{sub}</div>
    </div>
  );
}
