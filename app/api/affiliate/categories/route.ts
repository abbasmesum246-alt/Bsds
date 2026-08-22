import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth-helpers";
import { AFFILIATE_CATEGORIES } from "@/lib/affiliate/categories";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (id) {
    const cat = AFFILIATE_CATEGORIES.find((c) => c.id === id);
    return cat ? NextResponse.json(cat) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    categories: AFFILIATE_CATEGORIES,
  });
}
