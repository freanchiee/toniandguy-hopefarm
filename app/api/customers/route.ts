import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET /api/customers — list all customers (admin dashboard)
export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ customers: [], note: "Database not configured" });

  const { data, error } = await db
    .from("customers")
    .select("*")
    .order("last_visit_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customers: data });
}

// POST /api/customers — manually add a walk-in / call-based customer
export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const body = await req.json();
  const { name, phone, email, last_service, preferred_stylist, gender } = body;

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }

  // Build tags from gender + notes hint
  const tags: string[] = ["walk-in"];
  if (gender) tags.push(gender.toLowerCase());

  const { data, error } = await db
    .from("customers")
    .upsert(
      {
        phone,
        name,
        email: email || null,
        last_service: last_service || null,
        preferred_stylist: preferred_stylist || null,
        whatsapp_opted_in: true,
        tags,
      },
      { onConflict: "phone", ignoreDuplicates: false }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customer: data });
}
