import { NextRequest, NextResponse } from "next/server";
import { complete, MODELS, aiEnabled, type ChatMessage } from "@/lib/ai";
import { buildSystemPrompt, type AdvisorContext } from "@/lib/advisor-context";
import { fallbackAdvisorReply } from "@/lib/fallback";
import type { Language } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { messages?: ChatMessage[]; language?: Language; context?: AdvisorContext };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter((m) => m && m.content);
  const language = body.language ?? "en";
  const ctx = body.context;
  if (!ctx || messages.length === 0) {
    return NextResponse.json({ error: "Missing context or messages" }, { status: 400 });
  }

  const system = buildSystemPrompt(ctx, language);
  const reply = await complete({
    system,
    messages,
    model: MODELS.advisor,
    maxTokens: 600,
    temperature: 0.5,
  });

  if (reply) {
    return NextResponse.json({ reply, source: "claude" });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  return NextResponse.json({
    reply: fallbackAdvisorReply(lastUser?.content ?? "", ctx, language),
    source: aiEnabled ? "fallback-error" : "fallback",
  });
}
