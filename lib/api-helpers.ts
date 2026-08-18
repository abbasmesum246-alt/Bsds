import { NextResponse } from "next/server";
import { getCurrentUser } from "./auth";
import type { SafeUser } from "./types";

export function requireUser(): { user: SafeUser } | { response: NextResponse } {
  const user = getCurrentUser();
  if (!user) {
    return { response: NextResponse.json({ error: "You must be signed in" }, { status: 401 }) };
  }
  return { user };
}
export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}
