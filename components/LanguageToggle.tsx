"use client";

import { useDemo } from "@/lib/demo-context";
import type { Language } from "@/lib/types";
import { Languages } from "lucide-react";

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

export function languageLabel(code: Language): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? "English";
}

export function LanguageToggle() {
  const { language, setLanguage } = useDemo();
  return (
    <label className="flex items-center gap-1.5 rounded-xl border border-mist-200 bg-white px-2.5 py-1.5 text-sm">
      <Languages className="h-4 w-4 text-teal-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="cursor-pointer bg-transparent text-sm font-medium text-navy-900 outline-none"
        aria-label="Advisor language"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
