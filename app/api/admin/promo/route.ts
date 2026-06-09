/**
 * POST /api/admin/promo/send — send ONE promotional message to ONE customer.
 * The admin UI calls this per-customer with a delay between calls.
 *
 * POST /api/admin/promo/list — get eligible customers filtered by last_visit_weeks
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWhatsApp } from "@/lib/whatsapp";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET: fetch customers eligible for a promo (last visited >= N weeks ago)
export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });

  const weeks = Number(req.nextUrl.searchParams.get("weeks") ?? "2");
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - weeks * 7);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  const { data, error } = await db
    .from("customers")
    .select("id, name, phone, last_service, last_visit_date, preferred_stylist, tags")
    .eq("whatsapp_opted_in", true)
    .or(`last_visit_date.lte.${cutoffStr},last_visit_date.is.null`)
    .order("last_visit_date", { ascending: true, nullsFirst: true })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customers: data ?? [], cutoff: cutoffStr });
}

// POST: send one message to one customer (called per-customer by the browser, staggered)
export async function POST(req: NextRequest) {
  const { customer_id, phone, name, message } = await req.json();

  if (!phone || !message) {
    return NextResponse.json({ error: "phone and message required" }, { status: 400 });
  }

  const personalised = message
    .replace(/\{name\}/gi, name ?? "there")
    .replace(/\{first_name\}/gi, (name ?? "there").split(" ")[0]);

  const sent = await sendWhatsApp(phone, personalised);

  // Log the send in DB so we don't double-send
  const db = getDb();
  if (db && customer_id) {
    try {
      await db.from("promo_log").insert({ customer_id, phone, message: personalised, sent });
    } catch {} // non-fatal
  }

  return NextResponse.json({ sent, phone });
}
