import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";

// GET ?q= — fuzzy customer lookup by phone digits or name; includes each
// match's active packages (credit_remaining > 0) for the redemption toggle.
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ customers: [] });

  const sb = getServerSupabase();
  const digits = q.replace(/\D/g, "");

  let query = sb.from("customers").select("id, name, phone, gender").limit(8);
  query = digits.length >= 3
    ? query.ilike("phone_digits", `%${digits}%`)
    : query.ilike("name", `%${q}%`);

  const { data: customers, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const phones = (customers ?? []).map((c) => c.phone).filter(Boolean);
  const pkgByPhone: Record<string, { id: string; credit_remaining: number; name: string }[]> = {};
  if (phones.length) {
    const { data: pkgs } = await sb
      .from("customer_packages")
      .select("id, phone, credit_remaining, salon_packages(name)")
      .in("phone", phones)
      .gt("credit_remaining", 0);
    for (const p of pkgs ?? []) {
      (pkgByPhone[p.phone] ??= []).push({
        id: p.id,
        credit_remaining: p.credit_remaining,
        name: (p.salon_packages as any)?.name ?? "Package",
      });
    }
  }

  return NextResponse.json({
    customers: (customers ?? []).map((c) => ({ ...c, packages: pkgByPhone[c.phone] ?? [] })),
  });
}
