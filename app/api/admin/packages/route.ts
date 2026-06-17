import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function GET() {
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("salon_packages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ packages: data });
}

export async function POST(req: NextRequest) {
  const { name, price_inr, credit_inr } = await req.json();
  if (!name || !price_inr || !credit_inr)
    return NextResponse.json({ error: "name, price_inr, credit_inr required" }, { status: 400 });
  if (credit_inr < price_inr)
    return NextResponse.json({ error: "credit_inr must be >= price_inr" }, { status: 400 });

  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("salon_packages")
    .insert({ name, price_inr, credit_inr })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ package: data });
}
