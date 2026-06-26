import { NextRequest, NextResponse } from "next/server";
import { complete, MODELS, type ChatMessage } from "@/lib/ai";
import { buildSystemPrompt, type AdvisorContext } from "@/lib/advisor-context";
import { fallbackExplain } from "@/lib/fallback";
import type { Language } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { context?: AdvisorContext; language?: Language };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const ctx = body.context;
  const language = body.language ?? "en";
  if (!ctx) return NextResponse.json({ error: "Missing context" }, { status: 400 });

  const system = buildSystemPrompt(ctx, language);
  const messages: ChatMessage[] = [
    {
      role: "user",
      content:
        "In 90 words or less, explain WHY this recommended portfolio allocation and any rebalancing suits me. " +
        "Tie it to my risk profile, my aggregated holdings, and my top goal. Plain language. This is the 'explainable AI' rationale.",
    },
  ];

  const reply = await complete({ system, messages, model: MODELS.reasoning, maxTokens: 400, temperature: 0.4 });
  if (reply) return NextResponse.json({ reply, source: "claude" });
  return NextResponse.json({ reply: fallbackExplain(ctx, language), source: "fallback" });
}
