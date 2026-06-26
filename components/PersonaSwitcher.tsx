"use client";

import { useState, useRef, useEffect } from "react";
import { useDemo } from "@/lib/demo-context";
import { ChevronDown, Check, Users } from "lucide-react";
import { inr } from "@/lib/format";
import { totalValue } from "@/lib/engine";

export function PersonaSwitcher() {
  const { persona, personas, setPersona } = useDemo();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-mist-200 bg-white px-2.5 py-1.5 text-left hover:bg-mist-50"
      >
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ background: persona.avatarColor }}
        >
          {persona.name[0]}
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-semibold leading-tight text-navy-900">{persona.name}</span>
          <span className="block text-[11px] leading-tight text-ink-500">{persona.occupation}, {persona.age}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-ink-500" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-mist-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-mist-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
            <Users className="h-3.5 w-3.5" /> Demo customers (synthetic)
          </div>
          {personas.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPersona(p.id);
                setOpen(false);
              }}
              className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-mist-50"
            >
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: p.avatarColor }}
              >
                {p.name[0]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-navy-900">{p.name}</span>
                  {p.id === persona.id && <Check className="h-4 w-4 text-teal-600" />}
                </span>
                <span className="block text-[11px] text-ink-500">
                  {p.age} · {p.city} · {inr(totalValue(p.holdings))} net worth
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-ink-500">{p.tagline}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
