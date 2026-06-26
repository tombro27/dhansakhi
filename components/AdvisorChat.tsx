"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useDemo } from "@/lib/demo-context";
import { useAdvisorContext } from "@/lib/use-advisor-context";
import { languageLabel } from "@/components/LanguageToggle";
import { Badge } from "@/components/ui";
import { Send, Bot } from "lucide-react";
import type { ChatMessage } from "@/lib/ai";

const SUGGESTIONS = [
  "How do I reach my retirement goal?",
  "Why is my allocation set this way?",
  "Am I under-insured?",
  "How can I save tax this year?",
  "Where should I invest my monthly surplus?",
];

interface UIMessage extends ChatMessage {
  source?: string;
}

export function AdvisorChat() {
  const { persona, language } = useDemo();
  const ctx = useAdvisorContext();
  const firstName = persona.name.split(" ")[0];

  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset greeting when persona changes.
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Namaste ${firstName}! I'm DhanSakhi, your wealth co-pilot. Ask me anything about your portfolio, goals, taxes, or what to invest in next — in your language.`,
        source: "intro",
      },
    ]);
  }, [persona.id, firstName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: UIMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m.source !== "intro").map((m) => ({ role: m.role, content: m.content })),
          language,
          context: ctx,
        }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "…", source: data.source }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, I couldn't respond just now.", source: "error" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[480px] flex-col overflow-hidden rounded-2xl border border-mist-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-mist-200 bg-brand-gradient px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="DhanSakhi" width={32} height={32} />
          <div>
            <div className="text-sm font-bold text-white">DhanSakhi Advisor</div>
            <div className="text-[11px] text-ink-300">Speaking in {languageLabel(language)}</div>
          </div>
        </div>
        <Badge tone="teal"><Bot className="h-3.5 w-3.5" /> Gemini-powered</Badge>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 scroll-thin">
        {messages.map((m, i) => (
          <Bubble key={i} m={m} persona={persona} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-ink-500">
            <Image src="/logo.svg" alt="" width={26} height={26} />
            <div className="flex gap-1 rounded-2xl bg-mist-100 px-3 py-2.5">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-300" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-300" style={{ animationDelay: "0.2s" }} />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-300" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 border-t border-mist-100 px-4 py-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-mist-200 bg-mist-50 px-3 py-1.5 text-xs text-ink-700 hover:bg-mist-100"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-mist-200 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your money…"
          className="flex-1 rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-gradient text-white disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function Bubble({ m, persona }: { m: UIMessage; persona: { name: string; avatarColor: string } }) {
  const isUser = m.role === "user";
  return (
    <div className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      {isUser ? (
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: persona.avatarColor }}>
          {persona.name[0]}
        </span>
      ) : (
        <Image src="/logo.svg" alt="DhanSakhi" width={28} height={28} className="shrink-0" />
      )}
      <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${isUser ? "bg-navy-900 text-white" : "bg-mist-100 text-ink-900"}`}>
        <span className="whitespace-pre-line">{renderText(m.content)}</span>
        {!isUser && m.source && m.source !== "intro" && (
          <div className="mt-1 text-[10px] text-ink-500">{m.source === "gemini" ? "Gemini" : "Demo response"}</div>
        )}
      </div>
    </div>
  );
}

function renderText(s: string): string {
  return s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/_(.*?)_/g, "$1");
}
