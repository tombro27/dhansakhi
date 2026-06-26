import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Languages,
  Layers,
  Wallet,
  LineChart,
  MessageCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const USPS = [
  {
    icon: Layers,
    title: "AA-native 360° aggregation",
    body: "One-tap RBI Account Aggregator consent pulls bank balances, MF folios, demat, EPF & NPS — no CAS/PDF uploads. The friction INDmoney and HDFC SmartWealth still carry.",
  },
  {
    icon: Sparkles,
    title: "Explainable AI advice",
    body: "Every recommendation ships a Gemini-generated, profile-linked “why this, why now” rationale — in plain language. Beats black-box curation and satisfies SEBI's transparency direction.",
  },
  {
    icon: Wallet,
    title: "IDBI + LIC goal-completion",
    body: "Goals map to real products: Retirement → NPS (IDBI POP) + LIC annuity; Protection → LIC term; Debt → IDBI FD; Growth → IDBI-distributed MF. A moat no standalone app can copy.",
  },
];

const STEPS = [
  { icon: ShieldCheck, label: "KYC-lite + AA consent" },
  { icon: Layers, label: "360° aggregation" },
  { icon: LineChart, label: "AI risk + goals" },
  { icon: Sparkles, label: "Explainable advice" },
  { icon: MessageCircle, label: "Vernacular advisor" },
  { icon: Wallet, label: "IDBI/LIC cross-sell" },
];

const STATS = [
  { value: "2.61B", label: "AA-enabled accounts (Dec 2025)" },
  { value: "252.9M", label: "AA-linked users" },
  { value: "6×", label: "AI cross-sell conversion lift" },
  { value: "₹15L", label: "IDBI Innovate prize pool" },
];

const MATRIX = [
  { f: "AA-native aggregation (no PDF)", dhan: true, apps: false, banks: false },
  { f: "Explainable AI rationale", dhan: true, apps: false, banks: false },
  { f: "Vernacular conversational advisor", dhan: true, apps: false, banks: false },
  { f: "Bank + LIC product cross-sell", dhan: true, apps: false, banks: true },
  { f: "Advice for mass-affluent (not just HNI)", dhan: true, apps: true, banks: false },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-mist-50 text-navy-900">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-mist-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="DhanSakhi" width={34} height={34} />
            <span className="text-lg font-bold">DhanSakhi</span>
            <span className="ml-2 hidden rounded-full bg-mist-100 px-2.5 py-1 text-[11px] font-semibold text-ink-700 sm:inline">
              IDBI Innovate 2026 · Digital Wealth Management
            </span>
          </div>
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
          >
            Launch live demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-brand-gradient text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="animate-fadeup">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-400">
              <Sparkles className="h-3.5 w-3.5" /> AI Robo-Advisor · Powered by Gemini
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
              The <span className="text-gradient-teal">wealth friend</span> every IDBI customer deserves.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-ink-300">
              DhanSakhi aggregates a customer's <strong className="text-white">entire</strong> financial life via
              the RBI Account Aggregator, builds goal-based plans, and gives <strong className="text-white">explainable</strong>,
              <strong className="text-white"> vernacular</strong> advice — inside the trust of a bank.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-gradient px-5 py-3 text-sm font-bold text-white shadow-sm hover:opacity-90"
              >
                Try the golden-path demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white hover:bg-white/10"
              >
                Skip to dashboard
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-300">
              <ShieldCheck className="h-4 w-4 text-teal-400" /> Synthetic data · No real PII · SEBI &amp; DPDP-aware prototype
            </p>
          </div>

          {/* Problem card */}
          <div className="animate-fadeup self-center rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="text-xs font-semibold uppercase tracking-wider text-gold-400">The problem</div>
            <p className="mt-3 text-lg leading-relaxed text-white">
              “Meena, 38, a Pune-based IDBI customer, has savings scattered across <strong>5 institutions</strong> —
              FDs, MF folios, demat, EPF, an old LIC policy — <strong>no single view, and no affordable advice.</strong>”
            </p>
            <p className="mt-4 text-sm text-ink-300">
              Quality advisory is reserved for HNIs. Everyone else gets DIY apps or commission-driven mis-selling.
              India's fast-growing mass-affluent is structurally under-served.
            </p>
            <div className="mt-5 flex items-center gap-2 text-teal-400">
              <Languages className="h-5 w-5" />
              <span className="text-sm font-medium text-white">…and almost none of it speaks her language.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Golden path */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-600">The golden path</div>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">One seamless flow, end to end</h2>
        </div>
        <div className="mt-8 flex flex-wrap items-stretch justify-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="flex w-32 flex-col items-center gap-2 rounded-2xl border border-mist-200 bg-white p-4 text-center">
                <s.icon className="h-6 w-6 text-teal-600" />
                <span className="text-xs font-semibold leading-tight text-navy-900">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <ArrowRight className="hidden h-5 w-5 shrink-0 text-ink-300 md:block" />}
            </div>
          ))}
        </div>
      </section>

      {/* USPs */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-teal-600">Why DhanSakhi wins</div>
            <h2 className="mt-1 text-2xl font-bold md:text-3xl">The intersection no competitor owns</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {USPS.map((u) => (
              <div key={u.title} className="rounded-2xl border border-mist-200 bg-mist-50 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-gradient text-white">
                  <u.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy-900">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-gradient py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-gradient-teal md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs text-ink-300">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Competitor matrix */}
      <section className="mx-auto max-w-5xl px-5 py-14">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-teal-600">Honest positioning</div>
          <h2 className="mt-1 text-2xl font-bold md:text-3xl">DhanSakhi vs the field</h2>
          <p className="mt-2 text-sm text-ink-500">
            Standalone apps are smart-but-not-trusted. Bank apps are trusted-but-shallow. DhanSakhi is both.
          </p>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-mist-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-mist-200 bg-mist-50 text-left">
                <th className="px-4 py-3 font-semibold text-navy-900">Capability</th>
                <th className="px-4 py-3 text-center font-semibold text-teal-700">DhanSakhi</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-500">Standalone apps</th>
                <th className="px-4 py-3 text-center font-semibold text-ink-500">Bank robo tools</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row) => (
                <tr key={row.f} className="border-b border-mist-100 last:border-0">
                  <td className="px-4 py-3 text-ink-700">{row.f}</td>
                  <td className="px-4 py-3 text-center"><Mark on={row.dhan} /></td>
                  <td className="px-4 py-3 text-center"><Mark on={row.apps} /></td>
                  <td className="px-4 py-3 text-center"><Mark on={row.banks} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-center text-xs text-ink-500">
          We're deliberately <em>not</em> a discount broker or a full RIA — DhanSakhi is explainable
          decision-support that surfaces IDBI-RIA-reviewed recommendations.
        </p>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-3xl font-extrabold text-navy-900">See the whole journey in 2 minutes.</h2>
          <p className="mt-3 text-ink-500">
            Link accounts via Account Aggregator, get an explainable plan, and chat with the advisor in your language.
          </p>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-gradient px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
          >
            Launch the live demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-mist-200 bg-mist-50 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-ink-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="DhanSakhi" width={22} height={22} />
            <span>DhanSakhi · Built for IDBI Innovate 2026</span>
          </div>
          <div>Next.js · Gemini · RBI Account Aggregator (simulated) · Synthetic data, no real PII</div>
        </div>
      </footer>
    </div>
  );
}

function Mark({ on }: { on: boolean }) {
  return on ? (
    <CheckCircle2 className="mx-auto h-5 w-5 text-teal-600" />
  ) : (
    <XCircle className="mx-auto h-5 w-5 text-ink-300" />
  );
}
