"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import {
  LayoutDashboard,
  Target,
  Sparkles,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  ShieldCheck as ShieldIcon,
  Link2,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { useDemo } from "@/lib/demo-context";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Badge } from "@/components/ui";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/advice", label: "AI Advice", icon: Sparkles },
  { href: "/advisor", label: "Advisor", icon: MessageCircle },
  { href: "/cross-sell", label: "For You", icon: ShoppingBag },
  { href: "/compliance", label: "Trust & Safety", icon: ShieldCheck },
];

function NavLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: LucideIcon; active: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        active ? "bg-teal-600/10 text-teal-700" : "text-ink-300 hover:bg-white/5 hover:text-white"
      )}
    >
      <Icon className="h-[18px] w-[18px]" />
      <span>{label}</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { aaConnected, persona } = useDemo();
  const accounts = persona.holdings.filter((h) => h.source === "AA").length;

  return (
    <div className="flex min-h-screen bg-mist-50">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col bg-brand-gradient px-4 py-5 md:flex">
        <Link href="/" className="mb-6 flex items-center gap-2.5 px-1">
          <Image src="/logo.svg" alt="DhanSakhi" width={36} height={36} />
          <div>
            <div className="text-base font-bold text-white">DhanSakhi</div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-teal-400">for IDBI Bank</div>
          </div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((n) => (
            <NavLink key={n.href} {...n} active={pathname === n.href} />
          ))}
        </nav>
        <div className="mt-4 rounded-xl bg-white/5 p-3 text-[11px] leading-snug text-ink-300">
          <ShieldIcon className="mb-1 h-4 w-4 text-teal-400" />
          Synthetic demo data. No real PII. SEBI/DPDP-aware prototype.
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-mist-200 bg-white/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Image src="/logo.svg" alt="DhanSakhi" width={28} height={28} />
            <span className="font-bold text-navy-900">DhanSakhi</span>
          </div>
          <div className="hidden md:block">
            {aaConnected ? (
              <Badge tone="positive">
                <CheckCircle2 className="h-3.5 w-3.5" /> Account Aggregator linked · {accounts} accounts
              </Badge>
            ) : (
              <Link href="/onboarding">
                <Badge tone="gold">
                  <Link2 className="h-3.5 w-3.5" /> Link accounts via Account Aggregator
                </Badge>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <PersonaSwitcher />
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-mist-200 bg-white px-3 py-2 md:hidden scroll-thin">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={clsx(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                  active ? "bg-teal-600/10 text-teal-700" : "text-ink-500"
                )}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
