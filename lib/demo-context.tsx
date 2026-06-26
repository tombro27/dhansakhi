"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PERSONAS, DEFAULT_PERSONA_ID, getPersona } from "@/data/personas";
import {
  computeRisk,
  currentAllocation,
  targetAllocation,
  investableTotal,
  totalValue,
  rebalanceActions,
  crossSellOffers,
  projectGoal,
  expectedReturn,
} from "@/lib/engine";
import type { Language, RiskResult } from "@/lib/types";

interface DemoState {
  personaId: string;
  aaConnected: boolean;
  customRiskAnswers: number[] | null;
  language: Language;
}

const STORAGE_KEY = "dhansakhi.demo.v1";

const defaultState: DemoState = {
  personaId: DEFAULT_PERSONA_ID,
  aaConnected: false,
  customRiskAnswers: null,
  language: "en",
};

interface DemoContextValue extends DemoState {
  personas: typeof PERSONAS;
  persona: ReturnType<typeof getPersona>;
  risk: RiskResult;
  netWorth: number;
  investable: number;
  insuranceCover: number;
  current: ReturnType<typeof currentAllocation>;
  target: ReturnType<typeof targetAllocation>;
  rebalance: ReturnType<typeof rebalanceActions>;
  offers: ReturnType<typeof crossSellOffers>;
  goalProjections: ReturnType<typeof projectGoal>[];
  setPersona: (id: string) => void;
  connectAA: () => void;
  setRiskAnswers: (answers: number[]) => void;
  setLanguage: (l: Language) => void;
  reset: () => void;
}

const Ctx = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state, hydrated]);

  const value = useMemo<DemoContextValue>(() => {
    const persona = getPersona(state.personaId);
    const answers = state.customRiskAnswers ?? persona.riskAnswers;
    const risk = computeRisk(answers, persona.age);
    const netWorth = totalValue(persona.holdings);
    const investable = investableTotal(persona.holdings);
    const insuranceCover = persona.holdings
      .filter((h) => h.assetClass === "Insurance")
      .reduce((a, h) => a + h.value, 0);
    const current = currentAllocation(persona.holdings);
    const target = targetAllocation(risk.profile, persona.age);
    const rebalance = rebalanceActions(current, target, investable);
    const offers = crossSellOffers(persona, risk);
    const r = expectedReturn(risk.profile);
    const goalProjections = persona.goals.map((g) => projectGoal(g, r));

    return {
      ...state,
      personas: PERSONAS,
      persona,
      risk,
      netWorth,
      investable,
      insuranceCover,
      current,
      target,
      rebalance,
      offers,
      goalProjections,
      setPersona: (id) =>
        setState((s) => ({ ...s, personaId: id, customRiskAnswers: null })),
      connectAA: () => setState((s) => ({ ...s, aaConnected: true })),
      setRiskAnswers: (a) => setState((s) => ({ ...s, customRiskAnswers: a })),
      setLanguage: (l) => setState((s) => ({ ...s, language: l })),
      reset: () => setState(defaultState),
    };
  }, [state]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo(): DemoContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used within DemoProvider");
  return v;
}
