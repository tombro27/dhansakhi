import type { ReactNode } from "react";
import { clsx } from "clsx";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={clsx("card p-5", className)}>{children}</div>;
}

export function SectionTitle({
  eyebrow,
  title,
  sub,
  className,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={clsx("mb-4", className)}>
      {eyebrow && (
        <div className="text-xs font-semibold uppercase tracking-wider text-teal-600">{eyebrow}</div>
      )}
      <h2 className="text-xl font-bold text-navy-900">{title}</h2>
      {sub && <p className="mt-1 text-sm text-ink-500">{sub}</p>}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: "teal" | "gold" | "navy";
}) {
  const color =
    accent === "teal" ? "text-teal-600" : accent === "gold" ? "text-gold-600" : "text-navy-900";
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-ink-500">{label}</div>
      <div className={clsx("mt-1 text-2xl font-bold tabular-nums", color)}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-ink-500">{hint}</div>}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "teal" | "gold" | "positive" | "negative" | "navy";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-mist-100 text-ink-700",
    teal: "bg-teal-600/10 text-teal-700",
    gold: "bg-gold-500/15 text-gold-600",
    positive: "bg-positive/10 text-positive",
    negative: "bg-negative/10 text-negative",
    navy: "bg-navy-900/8 text-navy-900",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value, tone = "teal" }: { value: number; tone?: "teal" | "gold" | "navy" }) {
  const bar = tone === "gold" ? "bg-gold-500" : tone === "navy" ? "bg-navy-700" : "bg-teal-gradient";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-mist-100">
      <div
        className={clsx("h-full rounded-full transition-all", bar)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: "bg-teal-gradient text-white hover:opacity-90 shadow-sm",
    gold: "bg-gold-gradient text-navy-950 hover:opacity-90 shadow-sm",
    secondary: "bg-navy-900 text-white hover:bg-navy-800",
    ghost: "bg-transparent text-navy-900 hover:bg-mist-100 border border-mist-200",
  };
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export const ASSET_COLORS: Record<string, string> = {
  Equity: "#00936b",
  Debt: "#1b4d85",
  Gold: "#e6a817",
  Cash: "#78909c",
  Insurance: "#9b59b6",
};
