import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

// PATCH — edit / toggle active (super_admin only). No hard delete (keeps history).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = {};
  for (const k of ["name", "designation", "phone", "joined_at", "incentive_pct", "default_incentive_pct", "is_stylist", "active"]) {
    if (b[k] !== undefined) patch[k] = b[k];
  }
  if (b.base_salary !== undefined) patch.base_salary = Math.max(0, Math.round(b.base_salary));
  const sb = getServerSupabase();
  const { data, error } = await sb.from("employees").update(patch).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ employee: data });
}
