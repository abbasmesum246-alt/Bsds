import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readDB, writeDB } from "@/lib/db";
import { hashPassword, createSessionToken, toSafeUser, pickAvatarColor, COOKIE_OPTS, COOKIE_NAME } from "@/lib/auth";
import { makeId } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, email, password, company } = body as { name?: string; email?: string; password?: string; company?: string };
  if (!name || !email || !password) return NextResponse.json({ error: "Name, email and password required" }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  const db = readDB();
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase()))
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const now = new Date().toISOString();
  const user = {
    id: makeId("usr"), name: name.trim(), email: email.trim().toLowerCase(),
    passwordHash: await hashPassword(password), company: company?.trim() || undefined,
    avatarColor: pickAvatarColor(), plan: "Starter" as const, createdAt: now,
  };
  db.users.push(user);
  db.stores.push({ id: makeId("sto"), userId: user.id, name: "My First Store", platform: "Shopify", url: "mystore.myshopify.com", status: "connected", productsCount: 0, ordersCount: 0, revenue: 0, currency: "USD", connectedAt: now });
  db.suppliers.push({ id: makeId("sup"), userId: user.id, name: "AliExpress Premium", url: "aliexpress.com", category: "General", rating: 4.5, shippingDays: [7, 14], productsCount: 0, autoOrdering: true, connectedAt: now });
  writeDB(db);
  const token = createSessionToken(user.id, user.email);
  cookies().set(COOKIE_NAME, token, COOKIE_OPTS);
  return NextResponse.json({ user: toSafeUser(user) });
}
