import { NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

// Aggregate the anonymous AI Style Match usage for the admin dashboard.
export async function GET() {
  try {
    const sb = getServerSupabase();
    const { data, error } = await sb
      .from("face_analyses")
      .select("gender, face_shape, created_at")
      .order("created_at", { ascending: false })
      .limit(2000);

    if (error) return NextResponse.json({ total: 0, byShape: {}, byGender: {}, last7: 0 });

    const rows = data ?? [];
    const byShape: Record<string, number> = {};
    const byGender: Record<string, number> = {};
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let last7 = 0;

    for (const r of rows) {
      byShape[r.face_shape] = (byShape[r.face_shape] ?? 0) + 1;
      byGender[r.gender] = (byGender[r.gender] ?? 0) + 1;
      if (new Date(r.created_at).getTime() > weekAgo) last7++;
    }

    return NextResponse.json({ total: rows.length, byShape, byGender, last7 });
  } catch {
    return NextResponse.json({ total: 0, byShape: {}, byGender: {}, last7: 0 });
  }
}
