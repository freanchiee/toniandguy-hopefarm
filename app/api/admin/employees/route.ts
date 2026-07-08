import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

// GET — list employees (any admin; drives dropdowns). ?active=1 for active only.
export async function GET(req: NextRequest) {
  const sb = getServerSupabase();
  let q = sb.from("employees").select("*").order("name");
  if (req.nextUrl.searchParams.get("active") === "1") q = q.eq("active", true);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ employees: data ?? [] });
}

// POST — create employee (super_admin only).
export async function POST(req: NextRequest) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b?.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const sb = getServerSupabase();
  const { data, error } = await sb.from("employees").insert({
    name: b.name,
    designation: b.designation ?? null,
    phone: b.phone ?? null,
    joined_at: b.joined_at ?? undefined,
    base_salary: Math.max(0, Math.round(b.base_salary ?? 0)),
    incentive_pct: b.incentive_pct ?? {},
    default_incentive_pct: b.default_incentive_pct ?? 5,
    is_stylist: b.is_stylist ?? true,
    active: b.active ?? true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ employee: data });
}
