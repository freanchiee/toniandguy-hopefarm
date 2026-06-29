import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { FACE_SHAPES } from "@/lib/face-analysis";

// Analytics-only. The actual face-shape detection runs in the browser
// (MediaPipe) — no image is ever sent here, just the resulting shape + gender.

export async function POST(req: NextRequest) {
  let body: { gender?: string; face_shape?: string; confidence?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { gender, face_shape, confidence } = body;
  if ((gender !== "Male" && gender !== "Female") || !FACE_SHAPES.includes(face_shape as any)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const sb = getServerSupabase();
    await sb.from("face_analyses").insert({ gender, face_shape, confidence: confidence ?? "medium" });
  } catch {
    /* ponytail: analytics is best-effort; table may not exist yet */
  }

  return NextResponse.json({ ok: true });
}
