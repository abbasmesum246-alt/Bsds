import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSessionToken, toSafeUser, COOKIE_NAME, COOKIE_OPTS, pickAvatarColor } from "@/lib/auth";
import { readDB, writeDB } from "@/lib/db";
import { makeId } from "@/lib/utils";

// GET /api/auth/oauth/github  → starts GitHub OAuth
// GET /api/auth/oauth/google  → starts Google OAuth
export async function GET(req: Request, { params }: { params: { provider: string } }) {
  const provider = params.provider.toLowerCase();
  const url = new URL(req.url);
  const isCallback = url.searchParams.has("code");

  if (!isCallback) {
    // Step 1: redirect to the provider
    const redirectUri = `${url.origin}/api/auth/oauth/${provider}`;
    let authUrl = "";
    if (provider === "github") {
      const id = process.env.GITHUB_ID;
      if (!id) return NextResponse.redirect(new URL("/login?error=oauth-not-configured", url.origin));
      authUrl = `https://github.com/login/oauth/authorize?client_id=${id}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user user:email`;
    } else if (provider === "google") {
      const id = process.env.GOOGLE_ID;
      if (!id) return NextResponse.redirect(new URL("/login?error=oauth-not-configured", url.origin));
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${id}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid email profile&prompt=select_account`;
    } else {
      return NextResponse.redirect(new URL("/login?error=unknown-provider", url.origin));
    }
    return NextResponse.redirect(authUrl);
  }

  // Step 2: handle callback with ?code=
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.redirect(new URL("/login?error=no-code", url.origin));

  try {
    let email = "";
    let name = "";

    if (provider === "github") {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: process.env.GITHUB_ID,
          client_secret: process.env.GITHUB_SECRET,
          code,
          redirect_uri: `${url.origin}/api/auth/oauth/github`,
        }),
      });
      const token = await tokenRes.json();
      if (token.error) throw new Error(token.error_description || token.error);

      const [userRes, emailRes] = await Promise.all([
        fetch("https://api.github.com/user", { headers: { Authorization: `Bearer ${token.access_token}` } }),
        fetch("https://api.github.com/user/emails", { headers: { Authorization: `Bearer ${token.access_token}` } }),
      ]);
      const gh = await userRes.json();
      name = gh.name || gh.login || "GitHub User";
      const emails = await emailRes.json();
      const primary = Array.isArray(emails) && emails.find((e: { primary: boolean; email: string }) => e.primary);
      email = (primary?.email || emails?.[0]?.email || gh.email || "").toLowerCase();
    } else if (provider === "google") {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_ID || "",
          client_secret: process.env.GOOGLE_SECRET || "",
          code,
          grant_type: "authorization_code",
          redirect_uri: `${url.origin}/api/auth/oauth/google`,
        }),
      });
      const token = await tokenRes.json();
      if (token.error) throw new Error(token.error_description || token.error);
      const info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      }).then((r) => r.json());
      email = (info.email || "").toLowerCase();
      name = info.name || "Google User";
    }

    if (!email) return NextResponse.redirect(new URL("/login?error=no-email", url.origin));

    // Find or create the user
    const db = readDB();
    let user = db.users.find((u) => u.email === email);
    const now = new Date().toISOString();
    if (!user) {
      user = {
        id: makeId("usr"),
        name,
        email,
        passwordHash: "", // OAuth-only account
        avatarColor: pickAvatarColor(),
        plan: "Starter",
        createdAt: now,
        oauthProvider: provider as "github" | "google",
      };
      db.users.push(user);
      // Starter content for new sign-ups
      db.stores.push({
        id: makeId("sto"), userId: user.id, name: "My First Store", platform: "Shopify",
        url: "mystore.myshopify.com", status: "connected",
        productsCount: 0, ordersCount: 0, revenue: 0, currency: "USD", connectedAt: now,
      });
      writeDB(db);
    }

    const token = createSessionToken(user.id, user.email);
    cookies().set(COOKIE_NAME, token, COOKIE_OPTS);
    return NextResponse.redirect(new URL("/dashboard", url.origin));
  } catch (e) {
    return NextResponse.redirect(new URL(`/login?error=oauth-failed&msg=${encodeURIComponent((e as Error).message)}`, url.origin));
  }
}
