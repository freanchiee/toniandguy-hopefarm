import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { getAdminRole } from "@/middleware";

function whoami(req: NextRequest): string {
  return (req.cookies.get("admin_session")?.value ?? "").split(":")[0] || "owner";
}

// PATCH — lock/unlock or edit a payslip (super_admin). To edit a locked slip,
// send { locked: false } first (unlock), then edit. Editing a still-locked slip
// is blocked by the DB lock guard.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (getAdminRole(req) !== "core") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const sb = getServerSupabase();

  const patch: Record<string, unknown> = {};
  if (b.locked === true) { patch.locked = true; patch.locked_at = new Date().toISOString(); patch.locked_by = whoami(req); }
  if (b.locked === false) { patch.locked = false; patch.locked_at = null; patch.locked_by = null; }
  for (const k of ["bonus", "overtime", "advance_deduction", "other_deduction", "paid_days", "notes"]) {
    if (b[k] !== undefined) patch[k] = typeof b[k] === "number" ? Math.round(b[k]) : b[k];
  }

  const { data, error } = await sb.from("payslips").update(patch).eq("id", params.id).select("*, employees(name, designation)").single();
  if (error) {
    const msg = error.message.includes("is locked") ? "Payslip is locked — unlock it first." : error.message;
    return NextResponse.json({ error: msg }, { status: 409 });
  }
  return NextResponse.json({ payslip: data });
}
