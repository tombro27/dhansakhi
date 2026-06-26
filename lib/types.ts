// Core domain types for DhanSakhi (synthetic data — no real PII).

export type RiskProfile = "Conservative" | "Moderate" | "Aggressive";

export type Language = "en" | "hi" | "ta" | "mr" | "bn" | "te";

export type AssetClass = "Equity" | "Debt" | "Gold" | "Cash" | "Insurance";

export type HoldingType =
  | "Savings"
  | "FD"
  | "MutualFund"
  | "Equity"
  | "EPF"
  | "NPS"
  | "LIC"
  | "Gold";

export interface Holding {
  id: string;
  institution: string; // "IDBI Bank", "HDFC Bank", "Zerodha (CDSL)", "EPFO"...
  type: HoldingType;
  name: string;
  assetClass: AssetClass;
  value: number; // current ₹ value
  source: "AA" | "Manual"; // pulled via Account Aggregator vs manually added
  returnPct?: number; // trailing return, for color
}

export interface Goal {
  id: string;
  name: string;
  icon: string; // lucide icon key (see components/icon map)
  targetAmount: number;
  targetYear: number;
  currentAmount: number; // earmarked corpus today
  monthlySIP: number; // current monthly contribution
  priority: "High" | "Medium" | "Low";
}

export interface Persona {
  id: string;
  name: string;
  age: number;
  city: string;
  occupation: string;
  language: Language;
  monthlyIncome: number;
  monthlySurplus: number;
  riskAnswers: number[]; // pre-seeded answers to the 6-question quiz (0..3)
  holdings: Holding[];
  goals: Goal[];
  tagline: string;
  avatarColor: string; // tailwind-ish hex for avatar
}

export interface AllocationMap {
  Equity: number;
  Debt: number;
  Gold: number;
  Cash: number;
}

export interface RebalanceAction {
  assetClass: keyof AllocationMap;
  currentPct: number;
  targetPct: number;
  deltaPct: number; // target - current
  deltaAmount: number; // ₹ to move (signed)
  action: "Increase" | "Reduce" | "Hold";
}

export interface CrossSellOffer {
  id: string;
  product: string; // "IDBI Tax-Saver FD", "LIC New Jeevan Anand", "NPS Tier-I"...
  provider: "IDBI Bank" | "LIC" | "IDBI Mutual Fund" | "NPS (IDBI POP)";
  assetClass: AssetClass;
  forGoal: string;
  reason: string;
  ctaAmount: number; // suggested monthly/lumpsum ₹
  cadence: "monthly" | "one-time";
}

export interface RiskResult {
  score: number;
  profile: RiskProfile;
  rationale: string;
}
