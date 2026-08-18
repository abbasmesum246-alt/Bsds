import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const limit = Number(new URL(req.url).searchParams.get("limit") || 20);
  const db = readDB();
  return NextResponse.json({ items: db.activities.filter((a) => a.userId === auth.user.id).slice(0, limit) });
}
