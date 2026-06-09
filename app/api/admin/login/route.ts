import { NextRequest, NextResponse } from "next/server";

// ── Admin accounts (max 3) ─────────────────────────────────────────────────
// To add more admins: add entries here (up to 3 total)
const ADMIN_ACCOUNTS: Record<string, string> = {
  Rishav: "admin123",
  // Slot2: "password2",
  // Slot3: "password3",
};

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const valid = ADMIN_ACCOUNTS[username] === password;
  if (!valid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, username });
  res.cookies.set("admin_session", `${username}:authenticated`, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
