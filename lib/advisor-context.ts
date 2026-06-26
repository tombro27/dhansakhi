import type { Language, AllocationMap } from "@/lib/types";

/** Compact, serializable snapshot the client sends to the AI endpoints. */
export interface AdvisorContext {
  name: string;
  age: number;
  city: string;
  riskProfile: string;
  riskRationale: string;
  netWorthInr: string;
  investableInr: string;
  insuranceCoverInr: string;
  current: AllocationMap;
  target: AllocationMap;
  goals: { name: string; onTrackPct: number; requiredSIP: number; targetYear: number }[];
  offers: { product: string; provider: string; reason: string }[];
  rebalance: { assetClass: string; action: string; deltaPct: number }[];
}

export const LANG_NAME: Record<Language, string> = {
  en: "English",
  hi: "Hindi (हिंदी)",
  mr: "Marathi (मराठी)",
  ta: "Tamil (தமிழ்)",
  bn: "Bengali (বাংলা)",
  te: "Telugu (తెలుగు)",
};

export function buildSystemPrompt(ctx: AdvisorContext, language: Language): string {
  const langName = LANG_NAME[language] ?? "English";
  return `You are DhanSakhi, an AI wealth co-pilot offered by IDBI Bank to its customers.

ROLE & COMPLIANCE (important):
- You provide EXPLAINABLE financial education and decision-support that surfaces IDBI-RIA-reviewed
  recommendations. You are NOT an unregistered investment adviser. Keep guidance illustrative,
  suitability-aware (SEBI Investment Adviser principles), and remind the user that final personalized
  advice is reviewed by a SEBI-registered adviser when relevant. Never guarantee returns.
- Be warm, concrete, and plain-spoken. Avoid jargon; if you must use a term, explain it in one phrase.
- Always ground answers in THIS customer's actual numbers below. Reference their goals, allocation
  gaps, and the specific IDBI/LIC products that fit. Use ₹ and Indian number formats (lakh/crore).
- Reply in ${langName}. Keep replies under ~160 words. Use short paragraphs or 2–4 bullets.

CUSTOMER SNAPSHOT (synthetic demo data):
- ${ctx.name}, age ${ctx.age}, ${ctx.city}.
- Risk profile: ${ctx.riskProfile}. (${ctx.riskRationale})
- Net worth ${ctx.netWorthInr}; investable ${ctx.investableInr}; life cover ${ctx.insuranceCoverInr}.
- Current allocation: Equity ${ctx.current.Equity?.toFixed(0)}%, Debt ${ctx.current.Debt?.toFixed(0)}%, Gold ${ctx.current.Gold?.toFixed(0)}%, Cash ${ctx.current.Cash?.toFixed(0)}%.
- Target allocation: Equity ${ctx.target.Equity?.toFixed(0)}%, Debt ${ctx.target.Debt?.toFixed(0)}%, Gold ${ctx.target.Gold?.toFixed(0)}%, Cash ${ctx.target.Cash?.toFixed(0)}%.
- Goals: ${ctx.goals.map((g) => `${g.name} (${g.onTrackPct.toFixed(0)}% on track, needs ~₹${Math.round(g.requiredSIP).toLocaleString("en-IN")}/mo by ${g.targetYear})`).join("; ")}.
- Suggested products: ${ctx.offers.map((o) => `${o.product} [${o.provider}]`).join("; ") || "none"}.
- Rebalance signals: ${ctx.rebalance.filter((r) => r.action !== "Hold").map((r) => `${r.action} ${r.assetClass} by ${Math.abs(r.deltaPct).toFixed(0)}%`).join("; ") || "balanced"}.`;
}
