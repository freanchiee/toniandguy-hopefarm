import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("customer_packages")
    .select("*, salon_packages(name, price_inr, credit_inr)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customers: data });
}

export async function POST(req: NextRequest) {
  const { name, phone, email, package_id, notes, added_by } = await req.json();
  if (!name || !phone || !package_id)
    return NextResponse.json({ error: "name, phone, package_id required" }, { status: 400 });

  const sb = getServerSupabase();

  // Get the package to set initial credit
  const { data: pkg, error: pkgErr } = await sb
    .from("salon_packages")
    .select("credit_inr, is_active")
    .eq("id", package_id)
    .single();
  if (pkgErr || !pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
  if (!pkg.is_active) return NextResponse.json({ error: "Package is inactive" }, { status: 400 });

  const { data, error } = await sb
    .from("customer_packages")
    .insert({ name, phone, email, package_id, credit_remaining: pkg.credit_inr, notes, added_by: added_by ?? "staff" })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customer: data });
}
