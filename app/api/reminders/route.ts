import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildReminderMessage } from "@/lib/discount";
import { sendWhatsApp } from "@/lib/whatsapp";

// Call this daily via cron: GET /api/reminders?secret=YOUR_CRON_SECRET
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const db = createClient(url, key);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const { data: bookings } = await db
    .from("bookings")
    .select("*, stylists(name), services(name)")
    .eq("booking_date", tomorrowStr)
    .eq("status", "confirmed")
    .eq("reminder_sent", false);

  if (!bookings?.length) return NextResponse.json({ sent: 0 });

  let sent = 0;
  for (const b of bookings) {
    const msg = buildReminderMessage({
      name: b.client_name,
      service: b.services?.name ?? "Hair Service",
      stylist: b.stylists?.name ?? "Our stylist",
      date: b.booking_date,
      time: b.booking_time,
    });

    const ok = await sendWhatsApp(b.client_phone, msg);
    if (ok) {
      await db.from("bookings").update({ reminder_sent: true }).eq("id", b.id);
      sent++;
    }
  }

  return NextResponse.json({ sent, total: bookings.length });
}
