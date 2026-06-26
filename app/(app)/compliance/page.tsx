"use client";

import { Card, Badge } from "@/components/ui";
import { ShieldCheck, Lock, Scale, Eye, FileCheck, Languages, Database, UserCheck } from "lucide-react";

const PILLARS = [
  {
    icon: Lock,
    title: "RBI Account Aggregator — consent-first",
    points: [
      "Held-away data is pulled only with a digitally-signed, revocable consent artefact (purpose, data types, validity, fetch frequency).",
      "The AA is data-blind — payloads are end-to-end encrypted to DhanSakhi's public key; the AA never sees plaintext.",
      "No screen-scraping, no CAS/PDF uploads. Rides RBI rails already covering 2.61B accounts / 252.9M users.",
    ],
  },
  {
    icon: Scale,
    title: "SEBI Investment Adviser — designed-in guardrails",
    points: [
      "Positioned as explainable aggregation + decision-support + education that surfaces IDBI-RIA-reviewed recommendations — not unregistered autonomous advice.",
      "Advice and execution kept architecturally separate (SEBI EOP framework); execution routes through IDBI's licensed distribution.",
      "Documented risk-profiling & suitability, human-in-the-loop oversight, and a clear 'system-generated' disclosure.",
    ],
  },
  {
    icon: Database,
    title: "DPDP Act 2023 — privacy by design",
    points: [
      "Explicit, purpose-limited, data-minimized consent (AA consent doubles as DPDP-grade consent).",
      "Significant-Data-Fiduciary posture: DPO, DPIA and audit-ready trails for large-scale financial data.",
      "This prototype uses 100% synthetic data — no real PII is collected or stored.",
    ],
  },
  {
    icon: Eye,
    title: "Explainable & auditable AI",
    points: [
      "Every recommendation ships a plain-language, profile-linked 'why this, why now' rationale.",
      "Conflict-of-interest aware: cross-sell is framed as goal-completion with transparent reasoning.",
      "Satisfies SEBI's expectation of algorithm transparency, testing, and human review of AI output.",
    ],
  },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Trust, safety &amp; compliance</h1>
        <p className="text-sm text-ink-500">
          DhanSakhi is built to <em>de-risk adoption for IDBI</em> — regulation-aware by design, not as an afterthought.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge tone="teal"><ShieldCheck className="h-3.5 w-3.5" /> RBI AA consent</Badge>
        <Badge tone="navy"><Scale className="h-3.5 w-3.5" /> SEBI IA-aware</Badge>
        <Badge tone="gold"><FileCheck className="h-3.5 w-3.5" /> DPDP Act 2023</Badge>
        <Badge tone="positive"><Database className="h-3.5 w-3.5" /> Synthetic data · no PII</Badge>
        <Badge tone="neutral"><Languages className="h-3.5 w-3.5" /> Vernacular inclusion</Badge>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {PILLARS.map((p) => (
          <Card key={p.title}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-gradient text-white">
                <p.icon className="h-5 w-5" />
              </div>
              <h2 className="text-base font-bold text-navy-900">{p.title}</h2>
            </div>
            <ul className="mt-3 space-y-2">
              {p.points.map((pt, i) => (
                <li key={i} className="flex gap-2 text-sm leading-relaxed text-ink-700">
                  <UserCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <Card className="bg-mist-50">
        <p className="text-xs leading-relaxed text-ink-500">
          <strong className="text-ink-700">Disclaimer:</strong> DhanSakhi is a hackathon prototype built for IDBI
          Innovate 2026. All data is synthetic. Content is educational and illustrative, not investment advice.
          Figures citing the Account Aggregator ecosystem, SEBI regulations and DPDP Act reflect publicly reported
          information as of early 2026.
        </p>
      </Card>
    </div>
  );
}
