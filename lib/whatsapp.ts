/**
 * WhatsApp sender — tries Baileys gateway first, falls back to Twilio automatically.
 *
 * Priority:
 *   1. Baileys self-hosted gateway (OPENWA_URL) — free, unlimited
 *   2. Twilio WhatsApp (TWILIO_*) — paid fallback (~₹0.7/msg), kicks in if gateway is down
 *   3. Console log — dev fallback when neither is configured
 *
 * For promotional bulk sends: use Twilio directly or switch to Interakt/WATI later.
 */

export async function sendWhatsApp(to: string, body: string): Promise<boolean> {
  const gatewayUrl = process.env.OPENWA_URL;
  const twilioSid  = process.env.TWILIO_ACCOUNT_SID;

  // ── 1. Try Baileys gateway ────────────────────────────────────────────────
  if (gatewayUrl) {
    const sent = await sendViaGateway(to, body, gatewayUrl);
    if (sent) return true;
    console.warn("[WhatsApp] Gateway failed — trying Twilio fallback");
  }

  // ── 2. Twilio fallback ────────────────────────────────────────────────────
  if (twilioSid) {
    return sendViaTwilio(to, body);
  }

  // ── 3. Dev console log ────────────────────────────────────────────────────
  console.info(`[WhatsApp DEV → ${to}]\n${body}\n`);
  return true; // return true so dev flow isn't broken
}

// ── Baileys self-hosted gateway ───────────────────────────────────────────────
async function sendViaGateway(to: string, body: string, baseUrl: string): Promise<boolean> {
  const digits = to.replace(/\D/g, "");
  const number = digits.length === 10 ? `91${digits}` : digits;
  const chatId = `${number}@s.whatsapp.net`;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.OPENWA_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.OPENWA_API_KEY}`;
  }

  try {
    const res = await fetch(`${baseUrl}/sendText`, {
      method: "POST", headers,
      body: JSON.stringify({ chatId, text: body }),
      signal: AbortSignal.timeout(8000), // 8s timeout — don't hang the booking
    });
    if (!res.ok) {
      console.error("[Gateway] HTTP error:", res.status, await res.text());
      return false;
    }
    const data = await res.json();
    console.info("[Gateway] Sent:", data?.id ?? "ok");
    return true;
  } catch (e) {
    console.error("[Gateway] Unreachable:", (e as Error).message);
    return false;
  }
}

// ── Twilio WhatsApp fallback ──────────────────────────────────────────────────
// Env vars needed:
//   TWILIO_ACCOUNT_SID   — from console.twilio.com
//   TWILIO_AUTH_TOKEN    — from console.twilio.com
//   TWILIO_FROM          — whatsapp:+14155238886 (sandbox) or your approved number
async function sendViaTwilio(to: string, body: string): Promise<boolean> {
  const sid   = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const from  = process.env.TWILIO_FROM ?? "whatsapp:+14155238886";

  const digits = to.replace(/\D/g, "");
  const toNum  = digits.length === 10 ? `+91${digits}` : `+${digits}`;

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          From: from,
          To: `whatsapp:${toNum}`,
          Body: body,
        }).toString(),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      console.error("[Twilio] Error:", data.message);
      return false;
    }
    console.info("[Twilio] Sent:", data.sid);
    return true;
  } catch (e) {
    console.error("[Twilio] Failed:", (e as Error).message);
    return false;
  }
}
