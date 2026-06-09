import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function genInvoiceNumber() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `TG-${yy}${mm}-${rand}`;
}

export async function GET(req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ invoices: [] });

  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "100");
  const status = req.nextUrl.searchParams.get("status");

  let query = db
    .from("invoices")
    .select("*")
    .order("invoice_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ invoices: data ?? [] });
}

export async function POST(req: NextRequest) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });

  const body = await req.json();
  const {
    customer_id, customer_name, customer_phone,
    items, discount_percent, payment_method, status, notes, invoice_date,
  } = body;

  if (!customer_name || !items?.length) {
    return NextResponse.json({ error: "customer_name and items are required" }, { status: 400 });
  }

  // Calculate totals
  const subtotal = (items as { name: string; qty: number; unit_price: number }[])
    .reduce((sum, i) => sum + i.qty * i.unit_price, 0);
  const discPct = Number(discount_percent ?? 0);
  const discount_amount = Math.round(subtotal * discPct / 100);
  const total = subtotal - discount_amount;

  const { data, error } = await db.from("invoices").insert({
    invoice_number: genInvoiceNumber(),
    customer_id: customer_id || null,
    customer_name,
    customer_phone: customer_phone || null,
    items,
    subtotal,
    discount_percent: discPct,
    discount_amount,
    total,
    payment_method: payment_method ?? "cash",
    status: status ?? "paid",
    notes: notes || null,
    invoice_date: invoice_date ?? new Date().toISOString().split("T")[0],
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update customer last_service and last_visit_date if linked
  if (customer_id && data) {
    const firstService = (items as { name: string }[])[0]?.name;
    try {
      await db.from("customers").update({
        last_service: firstService,
        last_visit_date: data.invoice_date,
      }).eq("id", customer_id);
    } catch {}
  }

  return NextResponse.json({ invoice: data });
}
