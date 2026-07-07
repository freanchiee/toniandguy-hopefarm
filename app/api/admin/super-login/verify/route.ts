import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { readAuthConfig, isLockedOut, hashOtp, timingSafeEqualHex, logLogin } from "@/lib/super-admin-auth";

// POST { code } — verify the OTP, issue a super-admin ("core") session cookie.
export async function POST(req: NextRequest) {
  const { code } = await req.json().catch(() => ({}));
  if (!code || !/^\d{6}$/.test(String(code))) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const sb = getServerSupabase();
  const cfg = await readAuthConfig(sb);

  if (await isLockedOut(sb, cfg)) {
    await logLogin(sb, "locked_out", "verify", req);
    return NextResponse.json({ error: `Too many attempts. Try again in ${cfg.lockout_minutes} minutes.` }, { status: 429 });
  }

  const { data: otp } = await sb
    .from("super_admin_otp")
    .select("*")
    .is("consumed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otp) {
    await logLogin(sb, "verify_fail", "no_active_otp", req);
    return NextResponse.json({ error: "No active code — request a new one." }, { status: 401 });
  }
  if (new Date(otp.expires_at) < new Date()) {
    await logLogin(sb, "verify_fail", "expired", req);
    return NextResponse.json({ error: "Code expired — request a new one." }, { status: 401 });
  }
  if (!timingSafeEqualHex(hashOtp(String(code)), otp.code_hash)) {
    await sb.from("super_admin_otp").update({ attempts: (otp.attempts ?? 0) + 1 }).eq("id", otp.id);
    await logLogin(sb, "verify_fail", "bad_code", req);
    return NextResponse.json({ error: "Incorrect code." }, { status: 401 });
  }

  await sb.from("super_admin_otp").update({ consumed_at: new Date().toISOString() }).eq("id", otp.id);
  await logLogin(sb, "verify_success", undefined, req);

  const res = NextResponse.json({ ok: true, role: "super_admin" });
  res.cookies.set("admin_session", "owner:core:authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: cfg.session_hours * 3600,
  });
  return res;
}
