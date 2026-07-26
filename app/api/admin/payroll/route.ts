import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

function whoami(req: NextRequest): string {
  return (req.cookies.get("admin_session")?.value ?? "").split(":")[0] || "owner";
}

// GET — list payslips (super_admin). ?period=YYYY-MM-01 or ?employee=id
export async function GET(req: NextRequest) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const sb = getServerSupabase();
  let q = sb.from("payslips").select("*, employees(name, designation)").order("period", { ascending: false });
  const period = req.nextUrl.searchParams.get("period");
  const employee = req.nextUrl.searchParams.get("employee");
  if (period) q = q.eq("period", period);
  if (employee) q = q.eq("employee_id", employee);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payslips: data ?? [] });
}

// POST — generate/regenerate a payslip. Incentive base = MENU PRICE (locked rule).
export async function POST(req: NextRequest) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b?.employee_id || !b?.period) return NextResponse.json({ error: "employee_id and period required" }, { status: 400 });
  const period: string = b.period; // YYYY-MM-01

  const sb = getServerSupabase();

  // reject if the target month is already locked
  const { data: existing } = await sb.from("payslips").select("id, locked").eq("employee_id", b.employee_id).eq("period", period).maybeSingle();
  if (existing?.locked) return NextResponse.json({ error: "This month is locked. Unlock it to regenerate." }, { status: 409 });

  const { data: emp } = await sb.from("employees").select("*").eq("id", b.employee_id).single();
  if (!emp) return NextResponse.json({ error: "Employee not found" }, { status: 404 });

  // period window
  const [y, mo] = period.split("-").map(Number);
  const start = `${period}`;
  const end = new Date(y, mo, 1).toISOString().slice(0, 10); // first of next month
  const month_days = new Date(y, mo, 0).getDate();

  // incentive attribution: sum menu_price per category, excluding the duplicate
  // package_redemption rows (the 'service' row already carries that line's menu_price).
  const { data: lines } = await sb.from("v_sales_lines")
    .select("revenue_kind, category, menu_price")
    .eq("employee_id", b.employee_id).gte("sale_date", start).lt("sale_date", end)
    .neq("revenue_kind", "package_redemption");

  const byCat: Record<string, number> = {};
  for (const l of (lines ?? []) as any[]) {
    const cat = l.revenue_kind === "product" ? "product" : (l.category ?? "other");
    byCat[cat] = (byCat[cat] ?? 0) + (l.menu_price ?? 0);
  }
  const pctMap = (emp.incentive_pct ?? {}) as Record<string, number>;
  const breakdown = Object.entries(byCat).map(([category, menu_revenue]) => {
    const pct = pctMap[category] ?? emp.default_incentive_pct ?? 5;
    return { category, menu_revenue, pct, incentive: Math.round((menu_revenue * pct) / 100) };
  });
  const incentive_total = breakdown.reduce((s, r) => s + r.incentive, 0);

  const paid_days = Math.max(0, Math.round(b.paid_days ?? 0));
  const base_salary = emp.base_salary ?? 0;
  const base_earned = Math.round((base_salary * paid_days) / month_days);
  const bonus = Math.round(b.bonus ?? 0);
  const overtime = Math.round(b.overtime ?? 0);
  const advance_deduction = Math.round(b.advance_deduction ?? 0);
  const other_deduction = Math.round(b.other_deduction ?? 0);
  const net_pay = base_earned + incentive_total + bonus + overtime - advance_deduction - other_deduction;

  const row = {
    employee_id: b.employee_id, period,
    base_salary, paid_days, month_days, base_earned,
    incentive_total, incentive_breakdown: breakdown,
    bonus, overtime, advance_deduction, other_deduction, net_pay,
    notes: b.notes ?? null, generated_at: new Date().toISOString(),
  };
  const { data, error } = await sb.from("payslips").upsert(row, { onConflict: "employee_id,period" }).select("*, employees(name, designation)").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ payslip: data });
}
