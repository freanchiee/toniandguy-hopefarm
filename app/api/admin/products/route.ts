import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

// GET — list products (any admin; drives the sale dropdown). ?active=1 for active.
export async function GET(req: NextRequest) {
  const sb = getServerSupabase();
  let q = sb.from("products").select("*").order("name");
  if (req.nextUrl.searchParams.get("active") === "1") q = q.eq("is_active", true);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [] });
}

// POST — create product (super_admin only).
export async function POST(req: NextRequest) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b?.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const sb = getServerSupabase();
  const { data, error } = await sb.from("products").insert({
    name: b.name, category: b.category ?? null, price: Math.max(0, Math.round(b.price ?? 0)), is_active: b.is_active ?? true,
  }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}
