import { NextResponse } from "next/server";
import { secrets } from "@/lib/db-server";
import { requireUser } from "@/lib/auth-helpers";
import { TOOLS, callTool } from "@/lib/ai/tools";
import { localAI } from "@/lib/ai/local-engine";
import type { SafeUser } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Msg { role: "user" | "assistant" | "system" | "tool"; content: string; tool_call_id?: string; name?: string; tool_calls?: unknown; }

const SYSTEM_PROMPT = `You are BSDS AI, a sharp dropshipping business assistant. You help the user run their store: analyze numbers, answer questions, and TAKE ACTIONS when asked.

You can call tools to read live data and make changes (update prices, fulfill orders, create products, bulk reprice, list orders/products). When a user asks you to do something that changes data, call the appropriate tool — do not just explain.

Be concise, direct, and numbers-focused. Give honest advice. If the user is losing money on a product, say so. When you take an action, confirm what you did and the result.

Always respond in the user's language. Keep answers short and actionable. Use bullet points for lists.`;

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const user = auth.user;
  const body = await req.json().catch(() => ({}));
  const messages: Msg[] = Array.isArray(body.messages) ? body.messages : [];

  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const apiKey = secrets.get("GROQ_API_KEY") || secrets.get("OPENAI_API_KEY");

  // Built-in AI engine — works with ZERO keys. Streams a plain-text answer.
  if (!apiKey) {
    const answer = localAI(typeof lastUser === "string" ? lastUser : "", user);
    const stream = new ReadableStream({
      start(controller) {
        const enc = new TextEncoder();
        // chunk by sentence so the typing effect feels natural
        const chunks = answer.match(/[^.!?\n]+[.!?\n]*|\n/g) || [answer];
        let i = 0;
        const tick = () => {
          if (i >= chunks.length) { controller.close(); return; }
          controller.enqueue(enc.encode(chunks[i++]));
          setTimeout(tick, 28);
        };
        tick();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const useGroq = Boolean(secrets.get("GROQ_API_KEY"));
  const endpoint = useGroq
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const model = useGroq ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

  // Up to 2 rounds of tool calling
  let currentMessages: Msg[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.slice(-12),
  ];

  for (let round = 0; round < 3; round++) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: currentMessages,
        tools: TOOLS.map((t) => ({
          type: "function",
          function: {
            name: t.name,
            description: t.description,
            parameters: { type: "object", properties: t.parameters as Record<string, unknown>, required: Object.entries(t.parameters as { properties?: Record<string, unknown> }).filter(([k]) => k === "required").flatMap(([, v]) => Array.isArray(v) ? v : []) },
          },
        })),
        tool_choice: "auto",
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: "AI_ERROR", message: err.slice(0, 300) }, { status: 502 });
    }

    const data = await res.json();
    const choice = data.choices?.[0];
    const msg = choice?.message;
    if (!msg) break;

    currentMessages.push(msg);

    // If the model wants to call tools
    if (msg.tool_calls?.length) {
      for (const call of msg.tool_calls) {
        const args = safeParse(call.function.arguments);
        const result = callTool(call.function.name, args, user);
        currentMessages.push({
          role: "tool",
          tool_call_id: call.id,
          name: call.function.name,
          content: JSON.stringify(result),
        });
      }
      continue; // loop so the model can answer with the tool results
    }

    // No tool calls — return the final answer (streamed as plain text)
    return new Response(msg.content || "Done.", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response("I couldn't complete that request. Please try rephrasing.", {
    headers: { "Content-Type": "text/plain" },
  });
}

function safeParse(s: string): Record<string, unknown> {
  try { return JSON.parse(s); } catch { return {}; }
}
