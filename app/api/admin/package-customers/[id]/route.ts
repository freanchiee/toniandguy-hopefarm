import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { sendWhatsApp } from "@/lib/whatsapp";

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

  // Fetch current balance + contact details for WA message
  const { data: customer, error: fetchErr } = await sb
    .from("customer_packages")
    .select("name, phone, credit_remaining")
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

  // Fire WA notification — non-blocking, don't fail the request if this fails
  const remaining = updated.credit_remaining;
  sendWhatsApp(
    customer.phone,
    `Hi ${customer.name}! 👋\n\n` +
    `✅ *${service_name}* has been completed at Toni & Guy Hopefarm.\n\n` +
    `💳 *Package Balance Update*\n` +
    `Deducted: ₹${Number(amount).toLocaleString("en-IN")}\n` +
    `Remaining credit: *₹${remaining.toLocaleString("en-IN")}*\n\n` +
    `Thank you for choosing us! 🙏\n` +
    `_Toni & Guy Hopefarm, Whitefield · +91 91872 00430_`
  ).catch(() => {}); // ponytail: swallow — WA failure should never block the deduction

  return NextResponse.json({ credit_remaining: remaining });
}
