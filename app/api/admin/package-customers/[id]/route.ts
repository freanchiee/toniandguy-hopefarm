import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = getServerSupabase();
  const [{ data: customer, error }, { data: txns, error: txErr }] = await Promise.all([
    sb.from("customer_packages")
      .select("*, salon_packages(name, price_inr, credit_inr)")
      .eq("id", params.id)
      .single(),
    sb.from("package_transactions")
      .select("*")
      .eq("customer_package_id", params.id)
      .order("created_at", { ascending: false }),
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ customer, transactions: txns ?? [] });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  // Deduct a service from this customer's balance
  const { service_name, amount, performed_by } = await req.json();
  if (!service_name || !amount)
    return NextResponse.json({ error: "service_name and amount required" }, { status: 400 });

  const sb = getServerSupabase();

  // Fetch current balance
  const { data: customer, error: fetchErr } = await sb
    .from("customer_packages")
    .select("credit_remaining")
    .eq("id", params.id)
    .single();
  if (fetchErr || !customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  if (customer.credit_remaining < amount)
    return NextResponse.json({ error: `Insufficient credits. Balance: ₹${customer.credit_remaining}` }, { status: 400 });

  // Log transaction first, then deduct
  const { error: logErr } = await sb.from("package_transactions").insert({
    customer_package_id: params.id,
    service_name,
    amount_deducted: amount,
    performed_by: performed_by ?? "staff",
  });
  if (logErr) return NextResponse.json({ error: logErr.message }, { status: 500 });

  const { data: updated, error: deductErr } = await sb
    .from("customer_packages")
    .update({ credit_remaining: customer.credit_remaining - amount })
    .eq("id", params.id)
    .select("credit_remaining")
    .single();
  if (deductErr) return NextResponse.json({ error: deductErr.message }, { status: 500 });

  return NextResponse.json({ credit_remaining: updated.credit_remaining });
}
