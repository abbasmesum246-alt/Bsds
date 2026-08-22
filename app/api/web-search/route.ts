import { NextResponse } from "next/server";
import { secrets } from "@/lib/db-server";
import { requireUser } from "@/lib/api-helpers";
import { curatedSearch } from "@/lib/web/curated";

export const dynamic = "force-dynamic";

// Web search. Uses a live RapidAPI Google Search key if one is saved;
// otherwise falls back to a curated, always-available list of trusted links.
export async function GET(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "best dropshipping suppliers 2026";

  const key = secrets.get("RAPIDAPI_KEY");
  if (!key) {
    return NextResponse.json({
      enabled: true,
      curated: true,
      results: curatedSearch(q),
      message: "Showing trusted curated results. Add a free RapidAPI key in Integrations for live search.",
    });
  }

  try {
    const url = new URL("https://google-search1.p.rapidapi.com/google-search");
    url.searchParams.set("q", q);
    url.searchParams.set("hl", "en");
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": "google-search1.p.rapidapi.com",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`search ${res.status}`);
    const data = await res.json();
    const results = (data.results || data.organic_results || []).slice(0, 12).map((r: Record<string, unknown>) => ({
      title: r.title || r.name,
      url: r.url || r.link,
      snippet: r.snippet || r.description || "",
      source: r.source || new URL(String(r.url || r.link || "https://example.com")).hostname,
    }));
    return NextResponse.json({ enabled: true, results });
  } catch (e) {
    return NextResponse.json({ enabled: true, results: [], error: (e as Error).message });
  }
}
