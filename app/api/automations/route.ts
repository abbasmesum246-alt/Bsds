import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db-server";
import { requireUser, badRequest } from "@/lib/api-helpers";
import { makeId } from "@/lib/utils";
import type { AutomationRule } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const db = readDB();
  return NextResponse.json({ items: db.rules.filter((r) => r.userId === auth.user.id) });
}

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));
  if (!body.name || !body.trigger || !body.action) return badRequest("name, trigger, action required");
  const db = readDB();
  const now = new Date().toISOString();
  const rule: AutomationRule = {
    id: makeId("rul"), userId: auth.user.id, name: body.name.trim(), description: body.description || "",
    trigger: body.trigger, action: body.action, condition: body.condition || "always",
    active: body.active ?? true, applied: 0, createdAt: now,
  };
  db.rules.push(rule);
  db.activities.unshift({ id: makeId("act"), userId: auth.user.id, type: "automation", message: `Created automation "${rule.name}"`, createdAt: now });
  writeDB(db);
  return NextResponse.json(rule, { status: 201 });
}
