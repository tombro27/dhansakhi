"use client";

import { AdvisorChat } from "@/components/AdvisorChat";
import { Badge } from "@/components/ui";
import { Languages, ShieldCheck } from "lucide-react";

export default function AdvisorPage() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Conversational advisor</h1>
          <p className="text-sm text-ink-500">
            Ask anything about your money — in English, Hindi, Marathi, Tamil, Bengali or Telugu.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge tone="teal"><Languages className="h-3.5 w-3.5" /> 6 languages</Badge>
          <Badge tone="neutral"><ShieldCheck className="h-3.5 w-3.5" /> Suitability-aware</Badge>
        </div>
      </div>
      <AdvisorChat />
      <p className="text-center text-[11px] text-ink-500">
        Switch language from the top bar. Educational guidance only — final personalized advice is
        reviewed by a SEBI-registered adviser in production.
      </p>
    </div>
  );
}
