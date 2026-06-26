import { GoogleGenAI } from "@google/genai";

/**
 * Gemini integration for DhanSakhi.
 *
 * Design goal: the deployed prototype must ALWAYS respond, even when no
 * GEMINI_API_KEY is configured (e.g. a fresh Vercel deploy a judge clicks).
 * When a key is present we use Google Gemini; otherwise callers fall back to
 * curated deterministic responses so the demo never breaks.
 *
 * Get a free key from Google AI Studio: https://aistudio.google.com/apikey
 */

// Gemini model IDs (configurable via env). gemini-2.5-flash is fast + low-cost,
// ideal for a conversational advisor; bump to gemini-2.5-pro for deeper reasoning.
export const MODELS = {
  advisor: process.env.GEMINI_ADVISOR_MODEL || "gemini-2.5-flash",
  reasoning: process.env.GEMINI_REASONING_MODEL || "gemini-2.5-flash",
} as const;

export const aiEnabled = Boolean(process.env.GEMINI_API_KEY);

let client: GoogleGenAI | null = null;
export function getClient(): GoogleGenAI | null {
  if (!aiEnabled) return null;
  if (!client) client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
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
    const res = await c.models.generateContent({
      model: opts.model || MODELS.advisor,
      // Gemini represents the assistant turn with the "model" role.
      contents: opts.messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: opts.system,
        temperature: opts.temperature ?? 0.4,
        maxOutputTokens: opts.maxTokens ?? 900,
        // Disable "thinking" so the token budget goes to the actual reply
        // (keeps the advisor fast and avoids empty responses).
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    const text = (res.text ?? "").trim();
    return text || null;
  } catch (err) {
    console.error("[DhanSakhi] Gemini call failed, using fallback:", err);
    return null;
  }
}
