import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });

  const body = await req.json();
  const {
    name, phone, email, gender, last_service, preferred_stylist,
    membership, membership_tier, membership_since, membership_expires,
    tags, whatsapp_opted_in,
  } = body;

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = name;
  if (phone !== undefined) updateData.phone = phone;
  if (email !== undefined) updateData.email = email || null;
  if (last_service !== undefined) updateData.last_service = last_service || null;
  if (preferred_stylist !== undefined) updateData.preferred_stylist = preferred_stylist || null;
  if (membership !== undefined) updateData.membership = membership;
  if (membership_tier !== undefined) updateData.membership_tier = membership_tier || null;
  if (membership_since !== undefined) updateData.membership_since = membership_since || null;
  if (membership_expires !== undefined) updateData.membership_expires = membership_expires || null;
  if (tags !== undefined) updateData.tags = tags;
  if (whatsapp_opted_in !== undefined) updateData.whatsapp_opted_in = whatsapp_opted_in;

  // Rebuild tags from gender if provided
  if (gender !== undefined) {
    const existingTags: string[] = body.tags ?? [];
    const genderTags = ["male","female","other"];
    const cleanTags = existingTags.filter(t => !genderTags.includes(t));
    if (gender) cleanTags.push(gender.toLowerCase());
    updateData.tags = cleanTags;
  }

  const { data, error } = await db
    .from("customers")
    .update(updateData)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ customer: data });
}
