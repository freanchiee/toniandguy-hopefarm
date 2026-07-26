import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// GET — export the filtered sales lines as CSV (opens in Excel). Super_admin only.
export async function GET(req: NextRequest) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const sp = req.nextUrl.searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const from = sp.get("from") || new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10);
  const to = sp.get("to") || today;

  const sb = getServerSupabase();
  let q = sb.from("v_sales_lines").select("sale_date, revenue_kind, category, employee_id, payment_method, is_gst, revenue, menu_price").gte("sale_date", from).lte("sale_date", to);
  if (sp.get("category")) q = q.eq("category", sp.get("category"));
  if (sp.get("employee")) q = q.eq("employee_id", sp.get("employee"));
  const { data, error } = await q.order("sale_date");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // map employee names
  const ids = Array.from(new Set((data ?? []).map((r: any) => r.employee_id).filter(Boolean)));
  const { data: emps } = ids.length ? await sb.from("employees").select("id, name").in("id", ids) : { data: [] };
  const nameOf = Object.fromEntries((emps ?? []).map((e: any) => [e.id, e.name]));

  const header = ["Date", "Kind", "Category", "Staff", "Payment", "GST", "Revenue", "MenuPrice"];
  const lines = [header.join(",")];
  for (const r of (data ?? []) as any[]) {
    lines.push([r.sale_date, r.revenue_kind, r.category, nameOf[r.employee_id] ?? "", r.payment_method, r.is_gst ? "GST" : "", r.revenue, r.menu_price].map(csvCell).join(","));
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="sales_${from}_${to}.xls"`,
    },
  });
}
