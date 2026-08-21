import { NextResponse } from "next/server";
import { secrets } from "@/lib/db";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

// Optional live web search for real-time supplier news/reviews.
// Add a free RAPIDAPI_KEY from https://rapidapi.com (search "google-search1")
// in Settings → Integrations to enable. If no key, returns a friendly empty state.
export async function GET(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "best dropshipping suppliers 2026";

  const key = secrets.get("RAPIDAPI_KEY");
  if (!key) {
    return NextResponse.json({
      enabled: false,
      results: [],
      message: "Add a free RapidAPI key in Settings → Integrations for live web results.",
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
