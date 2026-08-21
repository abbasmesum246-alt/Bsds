"use client";
import * as React from "react";
import { Bot, Send, Sparkles, X, User, Loader2, Zap } from "lucide-react";
import { api } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Give me a business summary",
  "What are my best products?",
  "Fulfill my pending orders",
  "Raise all prices by 10%",
  "Which products should I kill?",
];

export function AiChat() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([
    { role: "assistant", content: "Hi! I'm your BSDS AI assistant. I can analyze your numbers and take actions like repricing or fulfilling orders. What would you like to do?" },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Request failed (${res.status})`);
      }
      if (!res.body) throw new Error("No response stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `⚠️ ${(e as Error).message}\n\nTip: Add a free Groq API key in Settings → Integrations to enable real AI.`,
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        data-ai-launcher
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 left-1/2 -translate-x-1/2 z-40 h-14 w-14 rounded-full text-white flex items-center justify-center shadow-[0_12px_32px_-8px_rgba(37,71,247,0.7)] transition-all hover:scale-105",
          open ? "bg-ink-800 rotate-90" : "bg-[linear-gradient(135deg,#2547f7,#7c3aed)]"
        )}
        aria-label="AI assistant"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] sm:w-96 h-[32rem] max-h-[75vh] card flex flex-col overflow-hidden animate-in">
          {/* Header */}
          <div className="px-4 py-3 text-white flex items-center gap-3" style={{ background: "linear-gradient(135deg,#2547f7,#7c3aed)" }}>
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center"><Bot className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="font-bold text-sm leading-tight">BSDS AI Assistant</p>
              <p className="text-[11px] text-white/80 flex items-center gap-1">
                <Zap className="h-3 w-3" /> Can analyze &amp; take actions
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-ink-50/60">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
                {m.role === "assistant" && (
                  <div className="h-7 w-7 rounded-full bg-[linear-gradient(135deg,#2547f7,#7c3aed)] flex items-center justify-center text-white shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap",
                  m.role === "user" ? "bg-[linear-gradient(135deg,#2547f7,#7c3aed)] text-white rounded-br-sm" : "bg-white border border-ink-100 text-ink-800 rounded-bl-sm shadow-sm"
                )}>
                  {m.content || (loading && <Loader2 className="h-4 w-4 animate-spin text-brand-500" />)}
                </div>
                {m.role === "user" && (
                  <div className="h-7 w-7 rounded-full bg-ink-200 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-ink-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 bg-white border-t border-ink-100">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-xs px-2.5 py-1.5 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 font-medium">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-3 bg-white border-t border-ink-100 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or command… e.g. 'fulfill #BSDS-100002'"
              className="flex-1 rounded-xl border border-ink-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="h-10 w-10 rounded-xl bg-[linear-gradient(135deg,#2547f7,#7c3aed)] text-white flex items-center justify-center disabled:opacity-50 hover:opacity-90">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
