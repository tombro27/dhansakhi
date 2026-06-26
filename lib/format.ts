// Indian-numbering currency + number helpers.

/** Compact INR: ₹12.5L, ₹1.24Cr, ₹45,000. */
export function inr(value: number): string {
  const v = Math.round(value);
  const abs = Math.abs(v);
  if (abs >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `₹${(v / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `₹${(v / 1_000).toFixed(0)}K`;
  return `₹${v}`;
}

/** Full Indian grouping: ₹12,50,000. */
export function inrFull(value: number): string {
  const v = Math.round(value);
  const sign = v < 0 ? "-" : "";
  const s = Math.abs(v).toString();
  if (s.length <= 3) return `${sign}₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}₹${grouped},${last3}`;
}

export function pct(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function signedPct(value: number, digits = 1): string {
  const s = value >= 0 ? "+" : "";
  return `${s}${value.toFixed(digits)}%`;
}
