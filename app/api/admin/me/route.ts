import { NextRequest, NextResponse } from "next/server";
import { getAdminRole } from "@/middleware";

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value ?? "";
  const username = session.split(":")[0] || "";
  const role = getAdminRole(req);
  if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ username, role });
}
