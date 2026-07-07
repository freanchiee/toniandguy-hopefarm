import crypto from "node:crypto";

// Super Admin (owner) WhatsApp-OTP login helpers. Server-only.
// The issued session reuses the existing cookie tier "core" (= super_admin),
// so all existing core-only gating keeps working unchanged.

export type AuthCfg = { otp_ttl_minutes: number; session_hours: number; max_fails: number; lockout_minutes: number };
const DEFAULT_CFG: AuthCfg = { otp_ttl_minutes: 5, session_hours: 6, max_fails: 5, lockout_minutes: 15 };

type SB = ReturnType<typeof import("@/lib/supabase-server").getServerSupabase>;

export async function readAuthConfig(sb: SB): Promise<AuthCfg> {
  try {
    const { data } = await sb.from("salon_settings").select("value").eq("key", "super_admin_auth").single();
    return { ...DEFAULT_CFG, ...(data?.value ?? {}) };
  } catch {
    return DEFAULT_CFG;
  }
}

export function maskPhone(p: string): string {
  const d = (p ?? "").replace(/\D/g, "");
  if (d.length < 4) return "*****";
  return `+${d.slice(0, 2)}••••••${d.slice(-2)}`;
}

function pepper() {
  return process.env.OTP_PEPPER ?? "tg-otp-pepper-set-me";
}
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp + pepper()).digest("hex");
}
export function genOtp(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}
export function timingSafeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex"), bb = Buffer.from(b, "hex");
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export async function isLockedOut(sb: SB, cfg: AuthCfg): Promise<boolean> {
  const since = new Date(Date.now() - cfg.lockout_minutes * 60_000).toISOString();
  const { count } = await sb
    .from("super_admin_login_log")
    .select("id", { count: "exact", head: true })
    .eq("event", "verify_fail")
    .gte("created_at", since);
  return (count ?? 0) >= cfg.max_fails;
}

export async function logLogin(sb: SB, event: string, detail: string | undefined, req: Request) {
  try {
    await sb.from("super_admin_login_log").insert({
      event,
      detail,
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      user_agent: req.headers.get("user-agent") ?? null,
      phone: maskPhone(process.env.SUPER_ADMIN_PHONE ?? ""),
    });
  } catch {
    /* best-effort audit log */
  }
}
