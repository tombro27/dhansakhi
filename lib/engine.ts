import type {
  Persona,
  Holding,
  Goal,
  RiskProfile,
  RiskResult,
  AllocationMap,
  RebalanceAction,
  CrossSellOffer,
} from "@/lib/types";

export const CURRENT_YEAR = 2026;

// ----------------------------- Risk profiling -----------------------------

export interface RiskQuestion {
  id: string;
  question: string;
  options: string[]; // index = score 0..3
}

export const RISK_QUESTIONS: RiskQuestion[] = [
  {
    id: "q1",
    question: "If your ₹1,00,000 investment dropped to ₹80,000 in a month, you would…",
    options: ["Sell everything immediately", "Sell a part to limit losses", "Hold and wait it out", "Invest more at lower prices"],
  },
  {
    id: "q2",
    question: "What is your primary investment objective?",
    options: ["Protect my capital", "Steady, predictable income", "Balanced growth", "Maximise long-term growth"],
  },
  {
    id: "q3",
    question: "How many years before you need this money?",
    options: ["Under 3 years", "3–5 years", "5–10 years", "More than 10 years"],
  },
  {
    id: "q4",
    question: "Your experience with market-linked investments is…",
    options: ["None — only FDs/savings", "A little — some mutual funds", "Comfortable — SIPs & stocks", "Very experienced"],
  },
  {
    id: "q5",
    question: "A stable job and emergency fund mean my income is…",
    options: ["Uncertain", "Somewhat stable", "Stable", "Very secure with surplus"],
  },
  {
    id: "q6",
    question: "Which portfolio would you pick?",
    options: ["100% FD/Debt", "Mostly debt, some equity", "Balanced equity & debt", "Mostly equity"],
  },
];

export function computeRisk(answers: number[], age: number): RiskResult {
  const raw = answers.reduce((a, b) => a + (b ?? 0), 0); // 0..18
  let profile: RiskProfile;
  if (raw <= 6) profile = "Conservative";
  else if (raw <= 12) profile = "Moderate";
  else profile = "Aggressive";

  // Age glide-down: capital preservation matters more near retirement.
  if (age >= 55 && profile === "Aggressive") profile = "Moderate";
  if (age >= 62 && profile === "Moderate") profile = "Conservative";

  const horizon = answers[2] ?? 2;
  const rationale =
    `Your answers score ${raw}/18 on risk capacity & tolerance. ` +
    `At age ${age} with a ${["short", "short", "medium", "long"][horizon] ?? "medium"}-term horizon, ` +
    `a ${profile.toLowerCase()} strategy balances growth against the drawdowns you said you can handle.`;

  return { score: raw, profile, rationale };
}

// ----------------------------- Allocation -----------------------------

const BASE_ALLOCATION: Record<RiskProfile, AllocationMap> = {
  Conservative: { Equity: 30, Debt: 55, Gold: 10, Cash: 5 },
  Moderate: { Equity: 55, Debt: 30, Gold: 10, Cash: 5 },
  Aggressive: { Equity: 75, Debt: 17, Gold: 5, Cash: 3 },
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Target allocation with a mild age glide-path on equity. */
export function targetAllocation(profile: RiskProfile, age: number): AllocationMap {
  const base = { ...BASE_ALLOCATION[profile] };
  const equityCap = clamp(110 - age, 25, 80);
  if (base.Equity > equityCap) {
    const excess = base.Equity - equityCap;
    base.Equity = equityCap;
    base.Debt += excess; // shift de-risked equity into debt
  }
  return base;
}

/** Investable assets only (LIC/insurance is protection, shown separately). */
export function investableHoldings(holdings: Holding[]): Holding[] {
  return holdings.filter((h) => h.assetClass !== "Insurance");
}

export function totalValue(holdings: Holding[]): number {
  return holdings.reduce((a, h) => a + h.value, 0);
}

export function investableTotal(holdings: Holding[]): number {
  return totalValue(investableHoldings(holdings));
}

export function currentAllocation(holdings: Holding[]): AllocationMap {
  const inv = investableHoldings(holdings);
  const total = totalValue(inv) || 1;
  const map: AllocationMap = { Equity: 0, Debt: 0, Gold: 0, Cash: 0 };
  for (const h of inv) {
    const k = h.assetClass as keyof AllocationMap;
    if (k in map) map[k] += h.value;
  }
  return {
    Equity: (map.Equity / total) * 100,
    Debt: (map.Debt / total) * 100,
    Gold: (map.Gold / total) * 100,
    Cash: (map.Cash / total) * 100,
  };
}

export function rebalanceActions(
  current: AllocationMap,
  target: AllocationMap,
  investable: number
): RebalanceAction[] {
  const classes: (keyof AllocationMap)[] = ["Equity", "Debt", "Gold", "Cash"];
  return classes.map((c) => {
    const deltaPct = target[c] - current[c];
    const deltaAmount = (deltaPct / 100) * investable;
    let action: RebalanceAction["action"] = "Hold";
    if (deltaPct > 2) action = "Increase";
    else if (deltaPct < -2) action = "Reduce";
    return {
      assetClass: c,
      currentPct: current[c],
      targetPct: target[c],
      deltaPct,
      deltaAmount,
      action,
    };
  });
}

// ----------------------------- Goal planning -----------------------------

export function expectedReturn(profile: RiskProfile): number {
  return { Conservative: 0.085, Moderate: 0.105, Aggressive: 0.125 }[profile];
}

export interface GoalProjection {
  goal: Goal;
  years: number;
  projected: number; // FV of current corpus + current SIP
  gap: number; // target - projected (positive = shortfall)
  requiredSIP: number; // monthly SIP needed to fully fund the goal
  onTrackPct: number; // projected / target
}

export function projectGoal(goal: Goal, annualReturn: number): GoalProjection {
  const years = Math.max(0.5, goal.targetYear - CURRENT_YEAR);
  const months = Math.round(years * 12);
  const i = annualReturn / 12;

  const fvCurrent = goal.currentAmount * Math.pow(1 + annualReturn, years);
  const sipFactor = (Math.pow(1 + i, months) - 1) / i;
  const fvSip = goal.monthlySIP * sipFactor;
  const projected = fvCurrent + fvSip;

  const gap = Math.max(0, goal.targetAmount - projected);
  const requiredSIP = gap > 0 ? gap / sipFactor + goal.monthlySIP : goal.monthlySIP;

  return {
    goal,
    years,
    projected,
    gap,
    requiredSIP,
    onTrackPct: clamp((projected / goal.targetAmount) * 100, 0, 100),
  };
}

// ----------------------------- Cross-sell engine -----------------------------

/** Next-best IDBI/LIC products, derived from gaps in the persona's portfolio. */
export function crossSellOffers(persona: Persona, risk: RiskResult): CrossSellOffer[] {
  const offers: CrossSellOffer[] = [];
  const { holdings, goals, age, monthlyIncome } = persona;
  const alloc = currentAllocation(holdings);
  const target = targetAllocation(risk.profile, age);
  const hasLIC = holdings.some((h) => h.assetClass === "Insurance");
  const hasNPS = holdings.some((h) => h.type === "NPS");
  const totalInsurance = holdings.filter((h) => h.assetClass === "Insurance").reduce((a, h) => a + h.value, 0);
  const retirementGoal = goals.find((g) => /retire/i.test(g.name));

  // 1) Protection gap → LIC term cover (cheap, high-leverage).
  const recommendedCover = monthlyIncome * 12 * 10; // ~10x annual income
  if (totalInsurance < recommendedCover * 0.4) {
    offers.push({
      id: "lic-term",
      product: "LIC Digi Term (term insurance)",
      provider: "LIC",
      assetClass: "Insurance",
      forGoal: "Family Protection",
      reason: `Your life cover is well below the ~${Math.round(recommendedCover / 100000)}L (10× income) protection a family your size needs. A LIC term plan closes this gap for a small premium before any investing.`,
      ctaAmount: Math.round((monthlyIncome * 0.03) / 50) * 50,
      cadence: "monthly",
    });
  }

  // 2) Retirement → NPS Tier-I via IDBI POP (extra 80CCD(1B) ₹50k tax break).
  if (!hasNPS && age < 60) {
    offers.push({
      id: "nps",
      product: "NPS Tier-I (via IDBI POP)",
      provider: "NPS (IDBI POP)",
      assetClass: "Debt",
      forGoal: retirementGoal?.name ?? "Retirement",
      reason: `You have no NPS. Opening NPS Tier-I through IDBI's POP licence adds a low-cost retirement sleeve and an extra ₹50,000 tax deduction under 80CCD(1B) on top of 80C.`,
      ctaAmount: 5000,
      cadence: "monthly",
    });
  }

  // 3) Idle cash → IDBI growth SIP or FD, depending on equity gap.
  if (alloc.Cash > target.Cash + 8) {
    const equityShort = target.Equity - alloc.Equity > 5;
    offers.push(
      equityShort
        ? {
            id: "idbi-mf",
            product: "IDBI-distributed Equity SIP",
            provider: "IDBI Mutual Fund",
            assetClass: "Equity",
            forGoal: "Long-term Growth",
            reason: `You're holding ${alloc.Cash.toFixed(0)}% in idle cash while under-allocated to equity for a ${risk.profile.toLowerCase()} profile. Redirecting some into a monthly equity SIP improves expected long-term returns.`,
            ctaAmount: Math.round((persona.monthlySurplus * 0.4) / 500) * 500,
            cadence: "monthly",
          }
        : {
            id: "idbi-fd",
            product: "IDBI Tax-Saver / Flexi FD",
            provider: "IDBI Bank",
            assetClass: "Debt",
            forGoal: "Capital Safety",
            reason: `${alloc.Cash.toFixed(0)}% sits in low-yield savings. Sweeping part into an IDBI FD lifts your safe-money yield without adding risk.`,
            ctaAmount: 200000,
            cadence: "one-time",
          }
    );
  }

  // 4) Near-retirement income → LIC annuity to convert corpus to pension.
  if (age >= 50 && retirementGoal) {
    offers.push({
      id: "lic-annuity",
      product: "LIC Jeevan Akshay (immediate annuity)",
      provider: "LIC",
      assetClass: "Debt",
      forGoal: "Retirement Income",
      reason: `As you approach retirement, converting part of your corpus into a LIC annuity creates a guaranteed lifelong monthly pension — de-risking longevity for your income goal.`,
      ctaAmount: 1500000,
      cadence: "one-time",
    });
  }

  return offers.slice(0, 4);
}

// ----------------------------- Allocation for charts -----------------------------

export function allocationForChart(holdings: Holding[]) {
  const map: Record<string, number> = {};
  for (const h of holdings) map[h.assetClass] = (map[h.assetClass] ?? 0) + h.value;
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}
