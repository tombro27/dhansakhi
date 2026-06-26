"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDemo } from "@/lib/demo-context";
import { RISK_QUESTIONS, computeRisk } from "@/lib/engine";
import { Button, Badge, ProgressBar } from "@/components/ui";
import {
  ShieldCheck,
  Fingerprint,
  Link2,
  CheckCircle2,
  Clock,
  RefreshCw,
  Lock,
  ArrowRight,
  ArrowLeft,
  Building2,
  Sparkles,
} from "lucide-react";

const STEPS = ["Identity", "Account Aggregator", "Risk profile", "Done"];

const AA_DATA_TYPES = ["Bank deposits", "Mutual fund folios", "Demat (equity/ETF)", "EPF balance", "NPS holdings", "Insurance policies"];

export default function Onboarding() {
  const router = useRouter();
  const { persona, connectAA, aaConnected, setRiskAnswers } = useDemo();
  const [step, setStep] = useState(0);

  // AA aggregation animation
  const [aggregating, setAggregating] = useState(false);
  const [linked, setLinked] = useState(0);
  const institutions = useMemo(
    () => Array.from(new Set(persona.holdings.map((h) => h.institution))),
    [persona]
  );

  // Risk quiz
  const [answers, setAnswers] = useState<number[]>(persona.riskAnswers);
  const previewRisk = computeRisk(answers, persona.age);

  function approveConsent() {
    setAggregating(true);
    setLinked(0);
    institutions.forEach((_, i) => {
      setTimeout(() => setLinked(i + 1), 350 * (i + 1));
    });
    setTimeout(() => {
      connectAA();
      setAggregating(false);
      setStep(2);
    }, 350 * institutions.length + 700);
  }

  function finishQuiz() {
    setRiskAnswers(answers);
    setStep(3);
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <div className="mb-6 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i <= step ? "bg-teal-gradient text-white" : "bg-mist-100 text-ink-500"}`}>
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-xs font-medium sm:block ${i <= step ? "text-navy-900" : "text-ink-300"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? "bg-teal-500" : "bg-mist-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Identity / KYC-lite */}
      {step === 0 && (
        <div className="card p-6 animate-fadeup">
          <Badge tone="teal"><Fingerprint className="h-3.5 w-3.5" /> KYC-lite</Badge>
          <h1 className="mt-3 text-2xl font-bold text-navy-900">Welcome to DhanSakhi</h1>
          <p className="mt-1 text-sm text-ink-500">Your AI wealth co-pilot from IDBI Bank. Let's set up {persona.name.split(" ")[0]}'s profile.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="Full name" value={persona.name} />
            <Field label="Mobile" value="+91 ••••• ••210" />
            <Field label="PAN" value="••••• 7F" />
            <Field label="City" value={persona.city} />
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-mist-50 p-3 text-xs text-ink-700">
            <Lock className="h-4 w-4 text-teal-600" /> Verified via DigiLocker/Aadhaar (simulated). Synthetic data — no real PII is used.
          </div>
          <div className="mt-5 flex justify-end">
            <Button onClick={() => setStep(1)}>Continue <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {/* Step 1: AA consent artefact */}
      {step === 1 && (
        <div className="card overflow-hidden animate-fadeup">
          <div className="bg-brand-gradient p-5 text-white">
            <div className="flex items-center justify-between">
              <Badge tone="teal"><Link2 className="h-3.5 w-3.5" /> RBI Account Aggregator</Badge>
              <span className="text-[11px] text-ink-300">Consent ID: DS-AA-{persona.id.toUpperCase()}-2026</span>
            </div>
            <h1 className="mt-3 text-xl font-bold">Consent to share your financial information</h1>
            <p className="mt-1 text-sm text-ink-300">
              A data-blind, RBI-regulated, revocable consent. The Account Aggregator never sees your data in plain text.
            </p>
          </div>

          <div className="p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <ConsentRow label="Requested by (FIU)" value="DhanSakhi · IDBI Bank" />
              <ConsentRow label="Purpose" value="Wealth aggregation & advisory" />
              <ConsentRow label="Consent Manager (AA)" value="OneMoney / Finvu (NBFC-AA)" />
              <ConsentRow label="Fetch frequency" value="Periodic · auto-refresh" icon={<RefreshCw className="h-3.5 w-3.5" />} />
              <ConsentRow label="Consent validity" value="12 months · revocable anytime" icon={<Clock className="h-3.5 w-3.5" />} />
              <ConsentRow label="Data life after fetch" value="Encrypted · purpose-limited" icon={<Lock className="h-3.5 w-3.5" />} />
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Data you're sharing</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {AA_DATA_TYPES.map((d) => (
                  <span key={d} className="rounded-lg bg-mist-100 px-2.5 py-1 text-xs font-medium text-ink-700">{d}</span>
                ))}
              </div>
            </div>

            {/* Aggregation progress */}
            {(aggregating || aaConnected) && (
              <div className="mt-4 rounded-xl border border-mist-200 bg-mist-50 p-3">
                <div className="text-xs font-semibold text-navy-900">Fetching held-away accounts…</div>
                <div className="mt-2 space-y-1.5">
                  {institutions.map((inst, i) => (
                    <div key={inst} className="flex items-center gap-2 text-xs">
                      {i < linked ? <CheckCircle2 className="h-4 w-4 text-positive" /> : <Building2 className="h-4 w-4 text-ink-300" />}
                      <span className={i < linked ? "text-navy-900" : "text-ink-300"}>{inst}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button onClick={approveConsent} disabled={aggregating}>
                {aggregating ? "Aggregating…" : <>Approve consent <ShieldCheck className="h-4 w-4" /></>}
              </Button>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-500">
              <Lock className="h-3.5 w-3.5" /> End-to-end encrypted to DhanSakhi's public key. Aligns with DPDP Act 2023 consent.
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Risk quiz */}
      {step === 2 && (
        <div className="card p-6 animate-fadeup">
          <Badge tone="teal"><Sparkles className="h-3.5 w-3.5" /> AI risk profiling</Badge>
          <h1 className="mt-3 text-2xl font-bold text-navy-900">A few questions to understand you</h1>
          <p className="mt-1 text-sm text-ink-500">Your answers set a suitable, SEBI-aligned target allocation.</p>

          <div className="mt-5 space-y-5">
            {RISK_QUESTIONS.map((q, qi) => (
              <div key={q.id}>
                <div className="text-sm font-semibold text-navy-900">{qi + 1}. {q.question}</div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => setAnswers((a) => a.map((v, idx) => (idx === qi ? oi : v)))}
                      className={`rounded-xl border px-3 py-2 text-left text-xs transition ${answers[qi] === oi ? "border-teal-500 bg-teal-600/10 text-teal-700" : "border-mist-200 bg-white text-ink-700 hover:bg-mist-50"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-mist-50 p-3">
            <div className="text-sm">
              <span className="text-ink-500">Live profile:</span>{" "}
              <span className="font-bold text-navy-900">{previewRisk.profile}</span>{" "}
              <span className="text-ink-500">({previewRisk.score}/18)</span>
            </div>
            <Button onClick={finishQuiz}>See my plan <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {/* Step 3: Done */}
      {step === 3 && (
        <div className="card p-8 text-center animate-fadeup">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-gradient text-white">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy-900">You're all set, {persona.name.split(" ")[0]}!</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
            We aggregated {institutions.length} institutions, profiled you as a{" "}
            <strong className="text-navy-900">{previewRisk.profile}</strong> investor, and prepared an explainable plan.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={() => router.push("/dashboard")}>Go to dashboard <ArrowRight className="h-4 w-4" /></Button>
            <Button variant="ghost" onClick={() => router.push("/advice")}>See AI advice</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-mist-200 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-ink-500">{label}</div>
      <div className="text-sm font-semibold text-navy-900">{value}</div>
    </div>
  );
}

function ConsentRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-mist-200 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-ink-500">{label}</div>
      <div className="flex items-center gap-1.5 text-sm font-semibold text-navy-900">{icon}{value}</div>
    </div>
  );
}
