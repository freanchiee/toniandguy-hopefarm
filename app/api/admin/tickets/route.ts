import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getServerSupabase } from "@/lib/supabase-server";
import { computeTicketMoney, incentiveAmount, splitPackage, paymentsCover, primaryPaymentMode } from "@/lib/sales";

function whoami(req: NextRequest): string {
  const parts = (req.cookies.get("admin_session")?.value ?? "").split(":");
  return parts[0] || "admin";
}

// GET — recent tickets for the sales log.
export async function GET() {
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("service_sale_tickets")
    .select("*, service_sale_items(count)")
    .order("sale_at", { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tickets: data ?? [] });
}

// POST — create a service sale ticket (multi line-item, GST toggle, package split).
export async function POST(req: NextRequest) {
  const b = await req.json();
  const items: any[] = Array.isArray(b?.items) ? b.items : [];
  if (!b?.customer?.name || items.length === 0) {
    return NextResponse.json({ error: "Customer name and at least one service are required" }, { status: 400 });
  }

  const sb = getServerSupabase();
  const logged_by = whoami(req);

  // ── settings: incentive default + GST config ──
  const { data: settings } = await sb.from("salon_settings").select("key, value").in("key", ["incentive", "gst"]);
  const cfg = Object.fromEntries((settings ?? []).map((s) => [s.key, s.value])) as any;
  const defaultPct = cfg.incentive?.default_pct ?? 5;
  const gstRate = b.is_gst ? (b.gst_rate ?? cfg.gst?.rate ?? 18) : 0;
  const gstin = b.is_gst ? (cfg.gst?.gstin ?? null) : null;

  // ── resolve customer (upsert by phone) ──
  let customerId = b.customer.id ?? null;
  if (!customerId && b.customer.phone) {
    const { data: up } = await sb.from("customers")
      .upsert({ name: b.customer.name, phone: b.customer.phone, gender: b.customer.gender ?? null }, { onConflict: "phone" })
      .select("id").single();
    customerId = up?.id ?? null;
  }

  // ── pass 1: resolve package redemption amounts (balance-aware split) ──
  const balCache: Record<string, number> = {};
  const prepared = [];
  for (const it of items) {
    const charged = Math.max(0, Math.round(it.charged_price ?? it.menu_price ?? 0));
    let package_amount = 0;
    if (it.package?.customer_package_id) {
      const cpid = it.package.customer_package_id;
      if (balCache[cpid] === undefined) {
        const { data: cp } = await sb.from("customer_packages").select("credit_remaining").eq("id", cpid).single();
        balCache[cpid] = cp?.credit_remaining ?? 0;
      }
      const { redeemed } = splitPackage(charged, balCache[cpid]);
      package_amount = redeemed;
      balCache[cpid] -= redeemed;
    }
    const pct = it.incentive_pct ?? defaultPct;
    prepared.push({
      ...it,
      charged,
      package_amount,
      pct,
      menu_price: Math.max(0, Math.round(it.menu_price ?? charged)),
    });
  }

  // ── money ──
  const money = computeTicketMoney({
    chargedPrices: prepared.map((p) => p.charged),
    discount_type: b.discount?.type ?? "none",
    discount_value: b.discount?.value ?? 0,
    is_gst: !!b.is_gst,
    gst_rate: gstRate,
  });
  const package_paid = prepared.reduce((s, p) => s + p.package_amount, 0);

  // payments: auto-fill cash with the balance owed if none entered
  let pay = { cash: 0, card: 0, upi: 0, wallet: 0, ...(b.payments ?? {}) };
  pay = { cash: Math.round(pay.cash), card: Math.round(pay.card), upi: Math.round(pay.upi), wallet: Math.round(pay.wallet) };
  if (pay.cash + pay.card + pay.upi + pay.wallet === 0) pay.cash = Math.max(0, money.grand_total - package_paid);
  if (!paymentsCover(money.grand_total, package_paid, pay)) {
    return NextResponse.json({ error: `Payments (₹${package_paid + pay.cash + pay.card + pay.upi + pay.wallet}) must equal the total ₹${money.grand_total}` }, { status: 400 });
  }

  // ── insert ticket ──
  const year = new Date(b.sale_at ?? Date.now()).getFullYear();
  const invoice_number = `TG${year}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  const { data: ticket, error: tErr } = await sb.from("service_sale_tickets").insert({
    booking_id: b.booking_id ?? null,
    customer_id: customerId,
    customer_name: b.customer.name,
    customer_phone: b.customer.phone ?? null,
    sale_at: b.sale_at ?? new Date().toISOString(),
    subtotal: money.subtotal,
    discount_type: b.discount?.type ?? "none",
    discount_value: b.discount?.value ?? 0,
    discount_amount: money.discount_amount,
    taxable_amount: money.taxable_amount,
    is_gst: !!b.is_gst,
    gst_rate: gstRate,
    cgst_amount: money.cgst_amount,
    sgst_amount: money.sgst_amount,
    tax_amount: money.tax_amount,
    gstin,
    grand_total: money.grand_total,
    package_paid,
    cash_paid: pay.cash, card_paid: pay.card, upi_paid: pay.upi, wallet_paid: pay.wallet,
    payment_mode: primaryPaymentMode(package_paid, pay),
    invoice_number,
    notes: b.notes ?? null,
    logged_by,
  }).select("id, invoice_number, grand_total").single();
  if (tErr) return NextResponse.json({ error: tErr.message }, { status: 500 });

  // ── insert items + execute package deductions ──
  for (const p of prepared) {
    const { data: item } = await sb.from("service_sale_items").insert({
      ticket_id: ticket.id,
      service_id: p.service_id ?? null,
      service_name: p.service_name,
      category: p.category ?? null,
      employee_id: p.employee_id ?? null,
      employee_name: p.employee_name ?? null,
      menu_price: p.menu_price,
      charged_price: p.charged,
      package_amount: p.package_amount,
      is_package_redeemed: p.package_amount > 0,
      incentive_pct: p.pct,
      incentive_amount: incentiveAmount(p.menu_price, p.pct),
    }).select("id").single();

    if (p.package_amount > 0 && p.package?.customer_package_id) {
      const cpid = p.package.customer_package_id;
      // re-check balance for concurrency safety, then deduct
      const { data: cp } = await sb.from("customer_packages").select("credit_remaining").eq("id", cpid).single();
      const redeem = Math.min(p.package_amount, cp?.credit_remaining ?? 0);
      if (redeem > 0) {
        const { data: txn } = await sb.from("package_transactions").insert({
          customer_package_id: cpid, service_name: p.service_name, amount_deducted: redeem, performed_by: logged_by,
        }).select("id").single();
        await sb.from("customer_packages").update({ credit_remaining: (cp!.credit_remaining - redeem) }).eq("id", cpid);
        await sb.from("package_redemptions").insert({
          ticket_id: ticket.id, item_id: item?.id ?? null, customer_package_id: cpid,
          package_transaction_id: txn?.id ?? null, service_name: p.service_name,
          amount_redeemed: redeem, split_cash_card: p.charged - redeem,
        });
      }
    }
  }

  if (customerId) await sb.from("customers").update({ last_ticket_at: new Date().toISOString() }).eq("id", customerId);

  return NextResponse.json({ ok: true, ticket_id: ticket.id, invoice_number: ticket.invoice_number, grand_total: ticket.grand_total });
}
