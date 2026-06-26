import type { Persona } from "@/lib/types";

/**
 * Synthetic demo customers (NO real PII). Portfolios are deliberately scattered
 * across institutions to showcase Account-Aggregator 360° consolidation.
 */
export const PERSONAS: Persona[] = [
  {
    id: "meena",
    name: "Meena Iyer",
    age: 38,
    city: "Pune, Maharashtra",
    occupation: "Marketing Manager",
    language: "mr",
    monthlyIncome: 140000,
    monthlySurplus: 45000,
    tagline: "Mass-affluent, savings scattered across 5 institutions, no advice.",
    avatarColor: "#00936b",
    riskAnswers: [2, 1, 2, 2, 1, 2],
    holdings: [
      { id: "m1", institution: "IDBI Bank", type: "Savings", name: "Savings Account", assetClass: "Cash", value: 280000, source: "AA" },
      { id: "m2", institution: "HDFC Bank", type: "Savings", name: "Savings Account", assetClass: "Cash", value: 120000, source: "AA" },
      { id: "m3", institution: "IDBI Bank", type: "FD", name: "Fixed Deposit (6.9%)", assetClass: "Debt", value: 500000, source: "AA", returnPct: 6.9 },
      { id: "m4", institution: "Axis MF", type: "MutualFund", name: "Axis Bluechip Fund", assetClass: "Equity", value: 650000, source: "AA", returnPct: 14.2 },
      { id: "m5", institution: "PPFAS MF", type: "MutualFund", name: "Parag Parikh Flexi Cap", assetClass: "Equity", value: 420000, source: "AA", returnPct: 18.6 },
      { id: "m6", institution: "HDFC MF", type: "MutualFund", name: "HDFC Corporate Bond Fund", assetClass: "Debt", value: 300000, source: "AA", returnPct: 7.4 },
      { id: "m7", institution: "Zerodha (CDSL)", type: "Equity", name: "Direct Equity (Infosys, Reliance)", assetClass: "Equity", value: 350000, source: "AA", returnPct: 11.0 },
      { id: "m8", institution: "EPFO", type: "EPF", name: "Employees' Provident Fund", assetClass: "Debt", value: 900000, source: "AA", returnPct: 8.15 },
      { id: "m9", institution: "LIC", type: "LIC", name: "LIC New Jeevan Anand", assetClass: "Insurance", value: 400000, source: "AA" },
    ],
    goals: [
      { id: "mg1", name: "Retirement", icon: "palmtree", targetAmount: 35000000, targetYear: 2047, currentAmount: 1850000, monthlySIP: 12000, priority: "High" },
      { id: "mg2", name: "Child's Education", icon: "graduation", targetAmount: 6000000, targetYear: 2035, currentAmount: 700000, monthlySIP: 10000, priority: "High" },
      { id: "mg3", name: "Emergency Fund", icon: "shield", targetAmount: 840000, targetYear: 2027, currentAmount: 400000, monthlySIP: 5000, priority: "Medium" },
    ],
  },
  {
    id: "rajesh",
    name: "Rajesh Kumar",
    age: 29,
    city: "Lucknow, Uttar Pradesh",
    occupation: "Software Engineer",
    language: "hi",
    monthlyIncome: 95000,
    monthlySurplus: 35000,
    tagline: "Young earner, high surplus, no insurance, no NPS — big cross-sell gaps.",
    avatarColor: "#1b4d85",
    riskAnswers: [3, 3, 2, 3, 2, 3],
    holdings: [
      { id: "r1", institution: "IDBI Bank", type: "Savings", name: "Salary Account", assetClass: "Cash", value: 180000, source: "AA" },
      { id: "r2", institution: "SBI", type: "Savings", name: "Savings Account", assetClass: "Cash", value: 60000, source: "AA" },
      { id: "r3", institution: "Nippon MF", type: "MutualFund", name: "Nippon India Small Cap", assetClass: "Equity", value: 220000, source: "AA", returnPct: 22.4 },
      { id: "r4", institution: "Groww (CDSL)", type: "Equity", name: "Direct Equity (Tata Motors, HAL)", assetClass: "Equity", value: 150000, source: "AA", returnPct: 9.8 },
      { id: "r5", institution: "EPFO", type: "EPF", name: "Employees' Provident Fund", assetClass: "Debt", value: 350000, source: "AA", returnPct: 8.15 },
    ],
    goals: [
      { id: "rg1", name: "Home Down Payment", icon: "home", targetAmount: 2500000, targetYear: 2031, currentAmount: 240000, monthlySIP: 15000, priority: "High" },
      { id: "rg2", name: "Retirement", icon: "palmtree", targetAmount: 60000000, targetYear: 2056, currentAmount: 350000, monthlySIP: 8000, priority: "Medium" },
      { id: "rg3", name: "Emergency Fund", icon: "shield", targetAmount: 570000, targetYear: 2027, currentAmount: 240000, monthlySIP: 5000, priority: "High" },
    ],
  },
  {
    id: "lakshmi",
    name: "Lakshmi Narayanan",
    age: 52,
    city: "Chennai, Tamil Nadu",
    occupation: "School Principal",
    language: "ta",
    monthlyIncome: 110000,
    monthlySurplus: 30000,
    tagline: "Pre-retirement, over-weight on cash/FD, needs an income & annuity plan.",
    avatarColor: "#c8881a",
    riskAnswers: [1, 0, 1, 1, 0, 1],
    holdings: [
      { id: "l1", institution: "IDBI Bank", type: "Savings", name: "Savings Account", assetClass: "Cash", value: 450000, source: "AA" },
      { id: "l2", institution: "IDBI Bank", type: "FD", name: "Fixed Deposit (7.1%)", assetClass: "Debt", value: 1800000, source: "AA", returnPct: 7.1 },
      { id: "l3", institution: "SBI", type: "FD", name: "Fixed Deposit (6.8%)", assetClass: "Debt", value: 800000, source: "AA", returnPct: 6.8 },
      { id: "l4", institution: "SBI MF", type: "MutualFund", name: "SBI Bluechip Fund", assetClass: "Equity", value: 500000, source: "AA", returnPct: 12.9 },
      { id: "l5", institution: "RBI (SGB)", type: "Gold", name: "Sovereign Gold Bonds", assetClass: "Gold", value: 600000, source: "AA", returnPct: 10.5 },
      { id: "l6", institution: "EPFO/GPF", type: "EPF", name: "Provident Fund", assetClass: "Debt", value: 2200000, source: "AA", returnPct: 8.15 },
      { id: "l7", institution: "NPS (IDBI POP)", type: "NPS", name: "NPS Tier-I", assetClass: "Debt", value: 700000, source: "AA", returnPct: 9.6 },
      { id: "l8", institution: "LIC", type: "LIC", name: "LIC Jeevan Labh (endowment)", assetClass: "Insurance", value: 800000, source: "AA" },
    ],
    goals: [
      { id: "lg1", name: "Retirement Income", icon: "palmtree", targetAmount: 12000000, targetYear: 2034, currentAmount: 6200000, monthlySIP: 15000, priority: "High" },
      { id: "lg2", name: "Daughter's Wedding", icon: "gift", targetAmount: 2500000, targetYear: 2029, currentAmount: 900000, monthlySIP: 12000, priority: "High" },
      { id: "lg3", name: "Healthcare Buffer", icon: "shield", targetAmount: 1000000, targetYear: 2030, currentAmount: 450000, monthlySIP: 5000, priority: "Medium" },
    ],
  },
];

export const DEFAULT_PERSONA_ID = "meena";

export function getPersona(id: string): Persona {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}
