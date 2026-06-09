import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsApp } from "@/lib/whatsapp";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const { booking_id, reason } = await req.json();
  if (!booking_id) return NextResponse.json({ error: "booking_id required" }, { status: 400 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Not configured" }, { status: 503 });

  const { data: booking, error: fetchError } = await db
    .from("bookings")
    .select("*, stylists(name), services(name)")
    .eq("id", booking_id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const { error } = await db
    .from("bookings")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString(), cancellation_reason: reason ?? null })
    .eq("id", booking_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Free up the slot
  await db
    .from("availability_slots")
    .update({ is_booked: false, booking_id: null })
    .eq("booking_id", booking_id);

  // Notify client
  const msg = `❌ *Booking Cancelled — Toni & Guy Hopefarm*\n\nHi ${booking.client_name}, your appointment on ${booking.booking_date} at ${booking.booking_time} has been cancelled.\n\nTo rebook: wa.me/919187200430\n\n_Toni & Guy Hopefarm, Whitefield_`;
  await sendWhatsApp(booking.client_phone, msg);

  return NextResponse.json({ ok: true });
}
