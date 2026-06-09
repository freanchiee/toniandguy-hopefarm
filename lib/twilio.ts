export async function sendWhatsApp(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM ?? "whatsapp:+14155238886";

  if (!sid || !token) {
    console.warn("[Twilio] Missing credentials — skipping WhatsApp send");
    return false;
  }

  const phone = to.startsWith("whatsapp:") ? to : `whatsapp:+91${to.replace(/\D/g, "").slice(-10)}`;

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ From: from, To: phone, Body: body }).toString(),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[Twilio] Error:", err);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[Twilio] Fetch failed:", e);
    return false;
  }
}
