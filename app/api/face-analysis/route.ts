import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase-server";
import { FACE_SHAPES, getRecommendations, type FaceShape, type Gender } from "@/lib/face-analysis";

// Claude does ONE thing here: classify the face shape from the selfie.
// Recommendations are generated server-side from the curated matrix.
// The image is never stored — it lives only in this request and is discarded.

const MODEL = process.env.FACE_ANALYSIS_MODEL ?? "claude-sonnet-4-6";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB cap on the base64 payload

// ponytail: best-effort in-memory rate limit (per serverless instance, resets on
// cold start). Enough to stop casual scripted abuse; swap to Upstash if it matters.
const hits = new Map<string, number[]>();
const RATE_LIMIT = 6;          // requests
const RATE_WINDOW_MS = 60_000; // per minute

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

const SYSTEM_PROMPT =
  "You are a professional hairstylist's face-shape classifier. Look at the single human face in the image and classify its shape as EXACTLY one of: " +
  "Oval, Round, Square, Heart, Oblong, Diamond, Triangle. " +
  "Judge by the ratio of face length to width, the relative widths of forehead, cheekbones and jaw, and the angle of the jaw and chin. " +
  "Also judge photo quality: a usable photo is front-facing, well-lit, with the whole face visible and hair not covering the forehead or jaw. " +
  "Respond with MINIFIED JSON ONLY, no markdown, no prose. Schema: " +
  '{"ok":boolean,"quality_ok":boolean,"quality_note":string,"face_shape":string,"confidence":"high"|"medium"|"low","reasoning":string}. ' +
  'Set ok=false if there is no clear single face. Set quality_ok=false (with a short, kind quality_note telling them how to retake) if the photo is tilted, dark, blurry, or the face is partly hidden. ' +
  "reasoning must be ONE short sentence a client would understand.";

function parseJson(text: string): any {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in model output");
  return JSON.parse(text.slice(start, end + 1));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[face-analysis] ANTHROPIC_API_KEY is not set");
    return NextResponse.json({ error: "This feature is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many tries — please wait a minute and retry." }, { status: 429 });
  }

  let body: { image_base64?: string; media_type?: string; gender?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { image_base64, media_type, gender } = body;
  if (!image_base64 || !media_type) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }
  if (gender !== "Male" && gender !== "Female") {
    return NextResponse.json({ error: "Select Male or Female first" }, { status: 400 });
  }
  if (image_base64.length > MAX_IMAGE_BYTES * 1.37) {
    return NextResponse.json({ error: "Image is too large — please use a smaller photo." }, { status: 413 });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(media_type)) {
    return NextResponse.json({ error: "Unsupported image format" }, { status: 415 });
  }

  // ── Call Claude Vision ──────────────────────────────────────────────────────
  let analysis: any;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        temperature: 0.2,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type, data: image_base64 } },
              { type: "text", text: `The client identifies as ${gender}. Classify the face shape and assess photo quality. Return JSON only.` },
            ],
          },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok) {
      // Log status only — don't dump the upstream body into logs.
      console.error("[face-analysis] Anthropic error", res.status);
      return NextResponse.json({ error: "Analysis failed — please try again." }, { status: 502 });
    }

    const data = await res.json();
    const text = (data?.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
    analysis = parseJson(text);
  } catch (e) {
    console.error("[face-analysis] failure", (e as Error).message);
    return NextResponse.json({ error: "Analysis failed — please try again." }, { status: 502 });
  }
  // image_base64 is now out of scope and never persisted — discarded.

  if (!analysis?.ok) {
    return NextResponse.json({ error: analysis?.quality_note || "Couldn't find a clear face. Please upload a front-facing selfie." }, { status: 422 });
  }

  // Validate the shape against our known set; default to Oval if the model drifts.
  const shape: FaceShape = FACE_SHAPES.includes(analysis.face_shape) ? analysis.face_shape : "Oval";
  const recommendations = getRecommendations(gender as Gender, shape);

  // ── Optional anonymous analytics (no image, no PII) — never blocks the result ──
  try {
    const sb = getServerSupabase();
    await sb.from("face_analyses").insert({
      gender,
      face_shape: shape,
      confidence: analysis.confidence ?? "medium",
    });
  } catch {
    /* ponytail: analytics is best-effort; table may not exist yet */
  }

  return NextResponse.json({
    ok: true,
    quality_ok: analysis.quality_ok !== false,
    quality_note: analysis.quality_note ?? "",
    face_shape: shape,
    confidence: analysis.confidence ?? "medium",
    reasoning: analysis.reasoning ?? "",
    recommendations,
  });
}
