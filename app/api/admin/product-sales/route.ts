import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

function whoami(req: NextRequest): string {
  return (req.cookies.get("admin_session")?.value ?? "").split(":")[0] || "admin";
}

// GET — recent product sales.
export async function GET() {
  const sb = getServerSupabase();
  const { data, error } = await sb.from("product_sales").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sales: data ?? [] });
}

// POST — log a product sale (one row per product line). Admin+ (front desk allowed).
export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b?.product_name || !b?.employee_id) {
    return NextResponse.json({ error: "Product and employee are required" }, { status: 400 });
  }

  const sb = getServerSupabase();
  const { data: settings } = await sb.from("salon_settings").select("value").eq("key", "gst").single();
  const gstCfg = (settings?.value ?? {}) as any;

  const quantity = Math.max(1, Math.round(b.quantity ?? 1));
  const unit_price = Math.max(0, Math.round(b.unit_price ?? 0));
  const menu_price = Math.max(0, Math.round(b.menu_price ?? unit_price));
  const gross_amount = quantity * unit_price;

  let discount_amount = 0, discount_percent = 0;
  if (b.discount_type === "percent") { discount_percent = Math.round(b.discount_value ?? 0); discount_amount = Math.round((gross_amount * discount_percent) / 100); }
  else if (b.discount_type === "amount") { discount_amount = Math.round(b.discount_value ?? 0); discount_percent = gross_amount > 0 ? Math.round((discount_amount / gross_amount) * 100) : 0; }
  discount_amount = Math.max(0, Math.min(discount_amount, gross_amount));
  const taxable_amount = gross_amount - discount_amount;

  const is_gst = !!b.is_gst;
  const gst_rate = is_gst ? (b.gst_rate ?? gstCfg.rate ?? 18) : 0;
  let tax_amount = 0, cgst_amount = 0, sgst_amount = 0;
  if (is_gst && gst_rate > 0) {
    tax_amount = Math.round((taxable_amount * gst_rate) / 100);
    cgst_amount = Math.floor(tax_amount / 2);
    sgst_amount = tax_amount - cgst_amount;
  }
  const total_amount = taxable_amount + tax_amount;

  // resolve/upsert customer if a phone is supplied
  let customer_id = b.customer_id ?? null;
  if (!customer_id && b.customer_phone) {
    const { data: up } = await sb.from("customers").upsert({ name: b.customer_name ?? "Walk-in", phone: b.customer_phone }, { onConflict: "phone" }).select("id").single();
    customer_id = up?.id ?? null;
  }

  const { data, error } = await sb.from("product_sales").insert({
    product_id: b.product_id ?? null, product_name: b.product_name,
    quantity, unit_price, menu_price,
    customer_id, customer_name: b.customer_name ?? null, customer_phone: b.customer_phone ?? null,
    employee_id: b.employee_id, employee_name: b.employee_name ?? null,
    payment_mode: b.payment_mode ?? "cash",
    discount_percent, discount_amount, gross_amount, taxable_amount,
    is_gst, gst_rate, cgst_amount, sgst_amount, tax_amount, total_amount,
    sold_by: whoami(req), sale_date: b.sale_date ?? undefined, notes: b.notes ?? null,
  }).select("id, total_amount").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, sale_id: data.id, total_amount: data.total_amount });
}
