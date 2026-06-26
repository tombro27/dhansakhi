import type { AdvisorContext } from "@/lib/advisor-context";
import type { Language } from "@/lib/types";

const LOCALIZED_GREETING: Record<Language, string> = {
  en: "",
  hi: "नमस्ते! ",
  mr: "नमस्कार! ",
  ta: "வணக்கம்! ",
  bn: "নমস্কার! ",
  te: "నమస్తే! ",
};

function note(language: Language): string {
  return language === "en"
    ? ""
    : `\n\n_(Demo response in English — connect the Claude API for full ${language.toUpperCase()} replies.)_`;
}

/** Intent-aware, numbers-grounded fallback used when Claude is unavailable. */
export function fallbackAdvisorReply(userText: string, ctx: AdvisorContext, language: Language): string {
  const t = userText.toLowerCase();
  const g = LOCALIZED_GREETING[language] ?? "";
  const firstName = ctx.name.split(" ")[0];
  const topGoal = ctx.goals[0];
  const offer = ctx.offers[0];

  let body: string;

  if (/retire|pension|annuit/.test(t)) {
    const rg = ctx.goals.find((x) => /retire/i.test(x.name)) ?? topGoal;
    body =
      `For your **${rg?.name ?? "retirement"}** goal you're about **${rg?.onTrackPct.toFixed(0)}% on track**. ` +
      `To fully fund it you'd want roughly **₹${Math.round(rg?.requiredSIP ?? 0).toLocaleString("en-IN")}/month** going in by ${rg?.targetYear}. ` +
      `Given your **${ctx.riskProfile}** profile, a mix of IDBI-distributed equity SIPs for growth plus NPS (Tier-I via IDBI's POP) for a tax-efficient retirement sleeve fits well` +
      (offer ? `, and **${offer.product}** is a good next step.` : ".");
  } else if (/risk|profile/.test(t)) {
    body = `You're a **${ctx.riskProfile}** investor. ${ctx.riskRationale} That's why your target mix is Equity ${ctx.target.Equity?.toFixed(0)}% / Debt ${ctx.target.Debt?.toFixed(0)}% / Gold ${ctx.target.Gold?.toFixed(0)}% / Cash ${ctx.target.Cash?.toFixed(0)}%.`;
  } else if (/rebalanc|alloc|equity|debt|too much cash|idle/.test(t)) {
    const moves = ctx.rebalance.filter((r) => r.action !== "Hold");
    body =
      moves.length > 0
        ? `Your current mix drifts from target. Suggested rebalancing: ` +
          moves.map((m) => `**${m.action} ${m.assetClass}** by ~${Math.abs(m.deltaPct).toFixed(0)}%`).join(", ") +
          `. This nudges you toward the ${ctx.riskProfile.toLowerCase()} target without disturbing your goals.`
        : `Good news — your allocation is already close to your ${ctx.riskProfile.toLowerCase()} target, so no major rebalancing is needed right now.`;
  } else if (/insur|cover|protect|term|life/.test(t)) {
    body = `Your current life cover is **${ctx.insuranceCoverInr}**. A useful rule of thumb is ~10× annual income. A **LIC term plan** (low premium, high cover) is the most cost-effective way to close any protection gap before adding more investments.`;
  } else if (/tax|80c|80ccd|save/.test(t)) {
    body = `Three tax-efficient moves for you: **ELSS** equity funds (80C), **NPS Tier-I** for an extra ₹50,000 deduction under 80CCD(1B), and **IDBI Tax-Saver FD**. NPS via IDBI's POP is especially handy for your retirement goal.`;
  } else if (/product|recommend|invest|buy|where|what should/.test(t)) {
    body = offer
      ? `Based on your gaps, my top suggestion is **${offer.product}** (${offer.provider}). Why: ${offer.reason}`
      : `Your portfolio looks well-rounded. Keep your SIPs running and review allocation quarterly.`;
  } else if (topGoal) {
    body = `Across your goals, **${topGoal.name}** is ${topGoal.onTrackPct.toFixed(0)}% on track (target ${topGoal.targetYear}). I can break down the exact monthly contribution, explain your portfolio's "why", or suggest the next best IDBI/LIC product — just ask.`;
  } else {
    body = `I can help you understand your net worth (${ctx.netWorthInr}), your ${ctx.riskProfile} risk profile, your goals, or what to invest in next.`;
  }

  return `${g}${body}${note(language)}`;
}

/** Templated explainability narrative (always available, even without Claude). */
export function fallbackExplain(ctx: AdvisorContext, language: Language): string {
  const moves = ctx.rebalance.filter((r) => r.action !== "Hold");
  const lines = [
    `Because you're a **${ctx.riskProfile}** investor (${ctx.riskRationale.replace(/\.$/, "")}), DhanSakhi targets Equity ${ctx.target.Equity?.toFixed(0)}% / Debt ${ctx.target.Debt?.toFixed(0)}% / Gold ${ctx.target.Gold?.toFixed(0)}% / Cash ${ctx.target.Cash?.toFixed(0)}%.`,
    moves.length
      ? `Your held-away holdings (aggregated via Account Aggregator) currently sit at Equity ${ctx.current.Equity?.toFixed(0)}% / Debt ${ctx.current.Debt?.toFixed(0)}% / Cash ${ctx.current.Cash?.toFixed(0)}%, so we suggest: ${moves.map((m) => `${m.action.toLowerCase()} ${m.assetClass}`).join(", ")}.`
      : `Your aggregated holdings already match this target closely, so we're not recommending changes today.`,
    ctx.goals[0]
      ? `This keeps your top goal — ${ctx.goals[0].name} (${ctx.goals[0].onTrackPct.toFixed(0)}% on track) — funded on time.`
      : "",
  ].filter(Boolean);
  return lines.join(" ") + note(language);
}
