import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const sb = getServerSupabase();
  const { data, error } = await sb
    .from("salon_packages")
    .update(body)
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ package: data });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const sb = getServerSupabase();
  // soft-delete: deactivate instead of hard delete (customers may still hold this package)
  const { error } = await sb
    .from("salon_packages")
    .update({ is_active: false })
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
