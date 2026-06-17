import { NextRequest, NextResponse } from "next/server";

// Credentials live in Vercel env vars — never hardcoded
// ADMIN_PASSWORD → Rishav (core admin)
// STAFF_PASSWORD  → staff  (lower role: add customers + deduct)
export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  let role: "core" | "staff" | null = null;

  if (username === "Rishav" && password === process.env.ADMIN_PASSWORD) {
    role = "core";
  } else if (username === "staff" && password === process.env.STAFF_PASSWORD) {
    role = "staff";
  }

  if (!role) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, username, role });
  res.cookies.set("admin_session", `${username}:${role}:authenticated`, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
