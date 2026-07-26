import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

type Row = { sale_date: string; revenue_kind: string; category: string | null; employee_id: string | null; revenue: number; service_count: number };

function periodKey(dateStr: string, gran: string): string {
  const d = new Date(dateStr);
  if (gran === "monthly") return dateStr.slice(0, 7); // YYYY-MM
  if (gran === "weekly") {
    const wk = new Date(d); wk.setDate(d.getDate() - d.getDay()); // Sunday start
    return wk.toISOString().slice(0, 10);
  }
  return dateStr.slice(0, 10);
}

async function sumRange(sb: ReturnType<typeof getServerSupabase>, from: string, to: string) {
  const { data } = await sb.from("v_sales_lines").select("revenue_kind, revenue, service_count").gte("sale_date", from).lte("sale_date", to);
  const t = { total: 0, service: 0, product: 0, package_redemption: 0, services: 0 };
  for (const r of (data ?? []) as any[]) {
    t.total += r.revenue;
    (t as any)[r.revenue_kind] += r.revenue;
    t.services += r.service_count;
  }
  return t;
}

// GET — dashboard aggregates (super_admin only). Filters: from, to, granularity, category, employee.
export async function GET(req: NextRequest) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const sp = req.nextUrl.searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const from = sp.get("from") || new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
  const to = sp.get("to") || today;
  const gran = sp.get("granularity") || "daily";
  const category = sp.get("category") || "";
  const employee = sp.get("employee") || "";

  const sb = getServerSupabase();
  let q = sb.from("v_sales_lines").select("sale_date, revenue_kind, category, employee_id, revenue, service_count").gte("sale_date", from).lte("sale_date", to);
  if (category) q = q.eq("category", category);
  if (employee) q = q.eq("employee_id", employee);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = (data ?? []) as Row[];

  // time series (stacked by kind)
  const seriesMap: Record<string, any> = {};
  const totals = { service: 0, product: 0, package_redemption: 0, total: 0, services: 0 };
  const board: Record<string, { revenue: number; services: number }> = {};
  for (const r of rows) {
    const k = periodKey(r.sale_date, gran);
    const b = (seriesMap[k] ??= { period: k, service: 0, product: 0, package_redemption: 0, total: 0 });
    b[r.revenue_kind] += r.revenue; b.total += r.revenue;
    (totals as any)[r.revenue_kind] += r.revenue; totals.total += r.revenue; totals.services += r.service_count;
    if (r.employee_id) { const e = (board[r.employee_id] ??= { revenue: 0, services: 0 }); e.revenue += r.revenue; e.services += r.service_count; }
  }
  const series = Object.values(seriesMap).sort((a: any, b: any) => (a.period < b.period ? -1 : 1));

  // leaderboard names
  const ids = Object.keys(board);
  let leaderboard: any[] = [];
  if (ids.length) {
    const { data: emps } = await sb.from("employees").select("id, name, active").in("id", ids);
    const nameOf = Object.fromEntries((emps ?? []).map((e) => [e.id, e]));
    leaderboard = ids.map((id) => ({ id, name: nameOf[id]?.name ?? "—", active: nameOf[id]?.active ?? true, ...board[id] }))
      .sort((a, b) => b.revenue - a.revenue);
  }

  // month-over-month (current MTD vs same span last month)
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth(), dnow = now.getDate();
  const curStart = new Date(y, m, 1).toISOString().slice(0, 10);
  const prevStart = new Date(y, m - 1, 1).toISOString().slice(0, 10);
  const prevSame = new Date(y, m - 1, dnow).toISOString().slice(0, 10);
  const [current, previous] = await Promise.all([sumRange(sb, curStart, today), sumRange(sb, prevStart, prevSame)]);
  const deltaPct = previous.total ? Math.round(((current.total - previous.total) / previous.total) * 100) : null;

  return NextResponse.json({ from, to, granularity: gran, series, totals, leaderboard, mom: { current, previous, deltaPct } });
}
