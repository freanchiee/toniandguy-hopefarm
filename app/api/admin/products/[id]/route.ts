import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

// PATCH — edit / toggle active (super_admin only). No hard delete (keeps history).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const patch: Record<string, unknown> = {};
  for (const k of ["name", "category", "is_active"]) if (b[k] !== undefined) patch[k] = b[k];
  if (b.price !== undefined) patch.price = Math.max(0, Math.round(b.price));
  const sb = getServerSupabase();
  const { data, error } = await sb.from("products").update(patch).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
