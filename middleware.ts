import { NextRequest, NextResponse } from "next/server";

export function getAdminRole(req: NextRequest): "core" | "staff" | null {
  const session = req.cookies.get("admin_session")?.value ?? "";
  const parts = session.split(":");
  if (parts.length < 2) return null;
  const last = parts[parts.length - 1];
  if (last !== "authenticated") return null;
  // new format: username:role:authenticated
  if (parts.length >= 3) {
    const role = parts[parts.length - 2];
    if (role === "core" || role === "staff") return role;
  }
  // legacy format: username:authenticated — treat as core
  return "core";
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminApi   = pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/login");

  if (!isAdminRoute && !isAdminApi) return NextResponse.next();

  const role = getAdminRole(req);

  if (!role) {
    if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Package definitions (create/edit) are core-only
  const isCoreOnly =
    pathname.startsWith("/admin/packages") ||
    pathname.startsWith("/api/admin/packages");

  if (isCoreOnly && role !== "core") {
    if (isAdminApi) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
