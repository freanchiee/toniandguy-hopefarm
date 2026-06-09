import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function GET() {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });

  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const todayStr = now.toISOString().split("T")[0];

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Sunday
  const weekStartStr = weekStart.toISOString().split("T")[0];

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  // Last 30 days for daily chart
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 29);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

  const { data: invoices, error } = await db
    .from("invoices")
    .select("invoice_date, total, status, payment_method")
    .eq("status", "paid")
    .gte("invoice_date", thirtyDaysAgoStr)
    .order("invoice_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const all = invoices ?? [];

  // Aggregate
  const todayRev   = all.filter(i => i.invoice_date === todayStr).reduce((s, i) => s + i.total, 0);
  const weekRev    = all.filter(i => i.invoice_date >= weekStartStr).reduce((s, i) => s + i.total, 0);
  const monthRev   = all.filter(i => i.invoice_date >= monthStart).reduce((s, i) => s + i.total, 0);
  const totalRev   = all.reduce((s, i) => s + i.total, 0);

  // Daily chart data (last 30 days)
  const dailyMap: Record<string, number> = {};
  for (let d = 0; d < 30; d++) {
    const dt = new Date(thirtyDaysAgo);
    dt.setDate(thirtyDaysAgo.getDate() + d);
    dailyMap[dt.toISOString().split("T")[0]] = 0;
  }
  all.forEach(i => { if (dailyMap[i.invoice_date] !== undefined) dailyMap[i.invoice_date] += i.total; });

  const daily = Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue }));

  // Payment method breakdown
  const byMethod: Record<string, number> = { cash: 0, card: 0, upi: 0, other: 0 };
  all.forEach(i => { byMethod[i.payment_method] = (byMethod[i.payment_method] ?? 0) + i.total; });

  // Invoice count
  const { count: invoiceCount } = await db.from("invoices").select("*", { count: "exact", head: true }).eq("status", "paid");

  return NextResponse.json({
    today: todayRev, week: weekRev, month: monthRev, total30: totalRev,
    invoiceCount: invoiceCount ?? 0,
    daily,
    byMethod,
  });
}
