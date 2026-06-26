import Anthropic from "@anthropic-ai/sdk";

/**
 * Claude integration for DhanSakhi.
 *
 * Design goal: the deployed prototype must ALWAYS respond, even when no
 * ANTHROPIC_API_KEY is configured (e.g. a fresh Vercel deploy a judge clicks).
 * When a key is present we use real Claude; otherwise callers fall back to
 * curated deterministic responses so the demo never breaks.
 */

// Model IDs (authoritative, from the runtime environment):
// Opus 4.8: claude-opus-4-8 · Sonnet 4.6: claude-sonnet-4-6 · Haiku 4.5: claude-haiku-4-5-20251001
export const MODELS = {
  // Conversational advisor — fast, high quality.
  advisor: process.env.CLAUDE_ADVISOR_MODEL || "claude-sonnet-4-6",
  // Deeper reasoning for portfolio rationale / explainability.
  reasoning: process.env.CLAUDE_REASONING_MODEL || "claude-sonnet-4-6",
} as const;

export const aiEnabled = Boolean(process.env.ANTHROPIC_API_KEY);

let client: Anthropic | null = null;
export function getClient(): Anthropic | null {
  if (!aiEnabled) return null;
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

/**
 * Single-shot completion. Returns null if AI is unavailable so callers can
 * provide a deterministic fallback.
 */
export async function complete(opts: {
  system: string;
  messages: ChatMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const res = await c.messages.create({
      model: opts.model || MODELS.advisor,
      max_tokens: opts.maxTokens ?? 900,
      temperature: opts.temperature ?? 0.4,
      system: opts.system,
      messages: opts.messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const text = res.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();
    return text || null;
  } catch (err) {
    console.error("[DhanSakhi] Claude call failed, using fallback:", err);
    return null;
  }
}
