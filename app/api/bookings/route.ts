import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { calcDiscount, buildWhatsAppMessage, buildSalonAlertMessage } from "@/lib/discount";
import { sendWhatsApp } from "@/lib/whatsapp";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    client_name, client_phone, client_email,
    stylist_id, stylist_name, service_id, service_name,
    booking_date, booking_time, notes, gender,
  } = body;

  if (!client_name || !client_phone || !booking_date || !booking_time || !service_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const discount = calcDiscount(new Date(booking_date));
  const bookingRef = `TG${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // ── Try to save to DB (optional — works without Supabase too) ──────────────
  const db = getDb();
  let bookingId = bookingRef;

  if (db) {
    try {
      // Resolve UUID FKs by name (form sends names, not UUIDs)
      let resolvedStylistId: string | null = null;
      let resolvedServiceId: string | null = null;
      if (stylist_name && stylist_name !== "No preference") {
        const { data: stylistRow } = await db.from("stylists").select("id").eq("name", stylist_name).single();
        resolvedStylistId = stylistRow?.id ?? null;
      }
      if (service_name) {
        const { data: serviceRow } = await db.from("services").select("id").eq("name", service_name).single();
        resolvedServiceId = serviceRow?.id ?? null;
      }

      const { data: booking, error } = await db
        .from("bookings")
        .insert({
          client_name, client_phone, client_email: client_email || null,
          stylist_id: resolvedStylistId,
          service_id: resolvedServiceId,
          stylist_name: stylist_name || null,
          service_name: service_name || null,
          booking_date, booking_time,
          notes: notes || null,
          status: "confirmed",
          discount_percent: discount,
          discount_code: bookingRef,
        })
        .select()
        .single();

      if (!error && booking) {
        bookingId = booking.id;

        // Mark slot booked
        if (stylist_id) {
          await db.from("availability_slots")
            .update({ is_booked: true, booking_id: booking.id })
            .eq("stylist_id", stylist_id)
            .eq("slot_date", booking_date)
            .eq("slot_time", booking_time);
        }

        // Upsert customer CRM
        await db.from("customers").upsert(
          {
            phone: client_phone,
            name: client_name,
            email: client_email || null,
            last_service: service_name,
            last_visit_date: booking_date,
            preferred_stylist: stylist_name && stylist_name !== "No preference" ? stylist_name : null,
            whatsapp_opted_in: true,
            ...(gender ? { tags: [gender.toLowerCase()] } : {}),
          },
          { onConflict: "phone", ignoreDuplicates: false }
        );
      }
    } catch (e) {
      console.warn("[Booking] DB write failed (non-fatal):", e);
    }
  }

  // ── Send WhatsApp confirmation + discount ─────────────────────────────────
  const msg = buildWhatsAppMessage({
    name: client_name,
    service: service_name,
    stylist: stylist_name ?? "Our stylist",
    date: booking_date,
    time: booking_time,
    discount,
    bookingId,
  });

  const whatsapp_sent = await sendWhatsApp(client_phone, msg);

  // ── Notify the salon too ──────────────────────────────────────────────────
  const salonPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; // 919187200430
  if (salonPhone) {
    const salonMsg = buildSalonAlertMessage({
      name: client_name,
      phone: client_phone,
      service: service_name,
      stylist: stylist_name ?? "Any",
      date: booking_date,
      time: booking_time,
      discount,
      bookingId,
    });
    // fire-and-forget — don't block the response if salon ping fails
    sendWhatsApp(salonPhone, salonMsg).catch(() => {});
  }

  if (db) {
    try {
      await db.from("bookings").update({ whatsapp_notified: whatsapp_sent }).eq("discount_code", bookingRef);
    } catch {}
  }

  return NextResponse.json({
    booking: { id: bookingId, discount_code: bookingRef },
    discount,
    whatsapp_sent,
  });
}

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ bookings: [], note: "Database not configured" });

  const { data, error } = await db
    .from("bookings")
    .select("*")
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings: data });
}
