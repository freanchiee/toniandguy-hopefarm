import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { sendWhatsApp } from "@/lib/whatsapp";
import { readAuthConfig, isLockedOut, genOtp, hashOtp, maskPhone, logLogin } from "@/lib/super-admin-auth";

// POST — send a 6-digit OTP over WhatsApp to the FIXED owner number (env).
export async function POST(req: NextRequest) {
  const phone = process.env.SUPER_ADMIN_PHONE;
  if (!phone) {
    console.error("[super-login] SUPER_ADMIN_PHONE not set");
    return NextResponse.json({ error: "Owner login isn't configured yet." }, { status: 503 });
  }

  const sb = getServerSupabase();
  const cfg = await readAuthConfig(sb);

  if (await isLockedOut(sb, cfg)) {
    await logLogin(sb, "locked_out", "request", req);
    return NextResponse.json({ error: `Too many attempts. Try again in ${cfg.lockout_minutes} minutes.` }, { status: 429 });
  }

  const otp = genOtp();
  // Invalidate any prior live challenge so only the newest code works.
  await sb.from("super_admin_otp").update({ consumed_at: new Date().toISOString() }).is("consumed_at", null);
  await sb.from("super_admin_otp").insert({
    phone: maskPhone(phone),
    code_hash: hashOtp(otp),
    expires_at: new Date(Date.now() + cfg.otp_ttl_minutes * 60_000).toISOString(),
    created_ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
  });

  await sendWhatsApp(
    phone,
    `Your Toni & Guy owner login code is ${otp}. Valid ${cfg.otp_ttl_minutes} minutes. Do not share this code.`
  ).catch(() => {});
  await logLogin(sb, "otp_requested", undefined, req);

  return NextResponse.json({ ok: true, sent_to: maskPhone(phone), ttl: cfg.otp_ttl_minutes });
}
