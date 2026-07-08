import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

const ALLOWED = ["pending", "confirmed", "completed", "no_show", "cancelled"];

// PATCH { status } — update a booking's status. When set to "completed",
// returns prefill data so the UI can auto-open the service-logging form.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  if (!ALLOWED.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const sb = getServerSupabase();
  const { data: booking, error } = await sb
    .from("bookings")
    .update({ status })
    .eq("id", params.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const prefill = status === "completed"
    ? {
        booking_id: booking.id,
        customer_name: booking.client_name,
        customer_phone: booking.client_phone,
        service_name: booking.service_name,
        stylist_name: booking.stylist_name,
      }
    : null;

  return NextResponse.json({ ok: true, booking, prefill });
}
