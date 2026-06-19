import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

function coreOnly(req: NextRequest) {
  const role = getAdminRole(req);
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (role !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

export async function GET(req: NextRequest) {
  const deny = coreOnly(req);
  if (deny) return deny;

  const sb = getServerSupabase();
  const { data } = await sb.from("salon_settings").select("value").eq("key", "discounts").single();
  return NextResponse.json({
    discounts: data?.value ?? { weekday_min: 25, weekday_max: 35, weekend_min: 10, weekend_max: 15 },
  });
}

export async function PATCH(req: NextRequest) {
  const deny = coreOnly(req);
  if (deny) return deny;

  const { weekday_min, weekday_max, weekend_min, weekend_max } = await req.json();
  const vals = [weekday_min, weekday_max, weekend_min, weekend_max];
  if (vals.some(v => typeof v !== "number" || v < 0 || v > 100)) {
    return NextResponse.json({ error: "All values must be numbers between 0 and 100" }, { status: 400 });
  }
  if (weekday_min > weekday_max || weekend_min > weekend_max) {
    return NextResponse.json({ error: "Min cannot be greater than max" }, { status: 400 });
  }

  const sb = getServerSupabase();
  const { error } = await sb.from("salon_settings").upsert(
    { key: "discounts", value: { weekday_min, weekday_max, weekend_min, weekend_max }, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
