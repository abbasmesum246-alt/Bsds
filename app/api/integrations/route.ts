import { NextResponse } from "next/server";
import { secrets, db } from "@/lib/db";
import { TESTERS } from "@/lib/integrations/testers";
import { requireUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

const FIELD_MAP: Record<string, string> = {
  GROQ_API_KEY: "groq", OPENAI_API_KEY: "openai",
  SHOPIFY_STORE: "shopify", SHOPIFY_ACCESS_TOKEN: "shopify",
  CJ_API_KEY: "cj", CJ_EMAIL: "cj", CJ_PASSWORD: "cj",
  RAPIDAPI_KEY: "rapidapi",
};

export async function GET() {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  return NextResponse.json({
    has: {
      GROQ_API_KEY: secrets.has("GROQ_API_KEY"),
      OPENAI_API_KEY: secrets.has("OPENAI_API_KEY"),
      SHOPIFY_STORE: secrets.has("SHOPIFY_STORE"),
      SHOPIFY_ACCESS_TOKEN: secrets.has("SHOPIFY_ACCESS_TOKEN"),
      CJ_API_KEY: secrets.has("CJ_API_KEY"),
      CJ_EMAIL: secrets.has("CJ_EMAIL"),
      CJ_PASSWORD: secrets.has("CJ_PASSWORD"),
      RAPIDAPI_KEY: secrets.has("RAPIDAPI_KEY"),
    },
    status: loadStatus(),
  });
}

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));

  const allowed = Object.keys(FIELD_MAP);
  const affected = new Set<string>();
  for (const key of allowed) {
    if (body[key] !== undefined) {
      const val = String(body[key]).trim();
      // Only overwrite if a non-empty value was sent (empty = keep existing)
      if (val) { secrets.set(key, val); affected.add(FIELD_MAP[key]); }
    }
  }

  // Auto-test every affected service and persist the result
  const results: Record<string, { ok: boolean; message: string }> = {};
  for (const svc of affected) {
    const tester = TESTERS[svc];
    if (tester) {
      const r = await tester();
      results[svc] = { ok: r.ok, message: r.message };
      upsertConnection(auth.user.id, svc, r);
    }
  }

  return NextResponse.json({ ok: true, results, status: loadStatus() });
}

// Endpoint to re-test an already-saved connection
export async function PATCH(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const { service } = await req.json().catch(() => ({}));
  const tester = TESTERS[service];
  if (!tester) return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  const r = await tester();
  upsertConnection(auth.user.id, service, r);
  return NextResponse.json({ result: r, status: loadStatus() });
}

function upsertConnection(userId: string, service: string, r: { ok: boolean; message: string }) {
  const id = `${userId}:${service}`;
  db.prepare(
    `INSERT INTO connections (id, user_id, service, status, verified, meta, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(id) DO UPDATE SET status=excluded.status, verified=excluded.verified, meta=excluded.meta, updated_at=datetime('now')`
  ).run(id, userId, service, r.ok ? "connected" : "error", r.ok ? 1 : 0, JSON.stringify({ message: r.message }));
}

function loadStatus() {
  const rows = db.prepare("SELECT service, status, verified, meta, updated_at FROM connections").all() as
    { service: string; status: string; verified: number; meta: string; updated_at: string }[];
  const out: Record<string, { ok: boolean; message: string; updatedAt: string }> = {};
  for (const r of rows) {
    try {
      const meta = JSON.parse(r.meta || "{}");
      out[r.service] = { ok: r.verified === 1, message: meta.message || "", updatedAt: r.updated_at };
    } catch { /* ignore */ }
  }
  return out;
}
