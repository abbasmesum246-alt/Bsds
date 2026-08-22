import { NextResponse } from "next/server";
import { secrets } from "@/lib/db-server";
import { requireUser } from "@/lib/auth-helpers";
import { curatedSearch } from "@/lib/web/curated";

export const dynamic = "force-dynamic";

// Real-time web search for affiliate opportunities. Uses RapidAPI if a key
// is saved; otherwise returns a curated set of trusted programs/networks.
export async function GET(req: Request) {
  const auth = requireUser(req);
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "best affiliate programs 2026";

  const key = secrets.get("RAPIDAPI_KEY");
  if (!key) {
    return NextResponse.json({
      enabled: true,
      curated: true,
      results: curatedSearch(q),
      message: "Showing curated programs. Add a free RapidAPI key in Integrations for live search.",
    });
  }

  try {
    const url = new URL("https://google-search1.p.rapidapi.com/google-search");
    url.searchParams.set("q", q);
    url.searchParams.set("hl", "en");
    url.searchParams.set("num", "15");
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": "google-search1.p.rapidapi.com",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`search ${res.status}`);
    const data = await res.json();
    const raw = data.results || data.organic_results || [];
    const results = raw.slice(0, 15).map((r: Record<string, unknown>) => ({
      title: String(r.title || r.name || ""),
      url: String(r.url || r.link || ""),
      snippet: String(r.snippet || r.description || ""),
      source: (() => { try { return new URL(String(r.url || r.link)).hostname; } catch { return "web"; } })(),
    }));
    return NextResponse.json({ enabled: true, results });
  } catch (e) {
    return NextResponse.json({ enabled: true, results: [], error: (e as Error).message });
  }
}
