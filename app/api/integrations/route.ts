import { NextResponse } from "next/server";
import { getSecret, setSecret, getIntegrationStatus } from "@/lib/secrets";
import { requireUser } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  return NextResponse.json({
    status: getIntegrationStatus(),
    // Masked values so the UI can show what's saved without revealing keys
    has: {
      GROQ_API_KEY: Boolean(getSecret("GROQ_API_KEY")),
      OPENAI_API_KEY: Boolean(getSecret("OPENAI_API_KEY")),
      SHOPIFY_STORE: Boolean(getSecret("SHOPIFY_STORE")),
      SHOPIFY_ACCESS_TOKEN: Boolean(getSecret("SHOPIFY_ACCESS_TOKEN")),
      CJ_API_KEY: Boolean(getSecret("CJ_API_KEY")),
      CJ_EMAIL: Boolean(getSecret("CJ_EMAIL")),
      CJ_PASSWORD: Boolean(getSecret("CJ_PASSWORD")),
      RAPIDAPI_KEY: Boolean(getSecret("RAPIDAPI_KEY")),
    },
  });
}

export async function POST(req: Request) {
  const auth = requireUser();
  if ("response" in auth) return auth.response;
  const body = await req.json().catch(() => ({}));

  const allowed = [
    "GROQ_API_KEY", "OPENAI_API_KEY",
    "SHOPIFY_STORE", "SHOPIFY_ACCESS_TOKEN",
    "CJ_API_KEY", "CJ_EMAIL", "CJ_PASSWORD",
    "RAPIDAPI_KEY",
  ];
  for (const key of allowed) {
    if (body[key] !== undefined) {
      const val = String(body[key]).trim();
      if (val) setSecret(key, val);
      // empty string clears the key
      else setSecret(key, "");
    }
  }
  return NextResponse.json({ ok: true, status: getIntegrationStatus() });
}
