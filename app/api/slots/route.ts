import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SLOT_TIMES = [
  "10:00", "10:45", "11:30", "12:15",
  "13:00", "13:45", "14:30", "15:15",
  "16:00", "16:45", "17:30", "18:15",
  "19:00", "19:45", "20:30",
];

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const stylist_id = searchParams.get("stylist_id");

  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  // ── filter past times when date is today (IST) ───────────────────────────
  const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const todayIST = nowIST.toISOString().split("T")[0]; // YYYY-MM-DD in IST
  const isToday = date === todayIST;

  // Add a 30-min buffer so they can't book a slot that starts very soon
  const cutoffMinutes = nowIST.getHours() * 60 + nowIST.getMinutes() + 30;

  function isPast(slotTime: string): boolean {
    if (!isToday) return false;
    const [h, m] = slotTime.split(":").map(Number);
    return h * 60 + m <= cutoffMinutes;
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({
      slots: SLOT_TIMES.map((t) => ({ time: t, available: !isPast(t) })),
    });
  }

  const query = db
    .from("bookings")
    .select("booking_time")
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"]);

  if (stylist_id) query.eq("stylist_id", stylist_id);

  const { data: booked } = await query;
  const bookedTimes = new Set((booked ?? []).map((b: { booking_time: string }) => b.booking_time.slice(0, 5)));

  const slots = SLOT_TIMES.map((t) => ({
    time: t,
    available: !bookedTimes.has(t) && !isPast(t),
  }));

  return NextResponse.json({ slots });
}
