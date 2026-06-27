"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, Camera, ChevronLeft, Sparkles, ShieldCheck, RefreshCw, Scissors } from "lucide-react";
import {
  FACE_SHAPES, SHAPE_BLURB, getRecommendations, getAvoid, bookHref,
  type FaceShape, type Gender, type Recommendation,
} from "@/lib/face-analysis";

type Analysis = {
  face_shape: FaceShape;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  quality_ok: boolean;
  quality_note: string;
  recommendations: Recommendation[];
};

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

// Downscale a selfie to ~560px on the longest side and return base64 JPEG.
// Runs on-device — keeps the upload tiny and the cost low.
function downscale(file: File, max = 560): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unavailable"));
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read that image")); };
    img.src = url;
  });
}

export function FaceAnalysisWidget() {
  const [step, setStep] = useState(0); // 0 gender, 1 consent+upload, 2 loading, 3 result
  const [gender, setGender] = useState<Gender | "">("");
  const [consent, setConsent] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Revoke any previous blob URL whenever we drop the preview, so failed
  // uploads don't leak object URLs in memory.
  function clearPreview() {
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const url = URL.createObjectURL(file);
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
    setStep(2);
    try {
      const { base64, mediaType } = await downscale(file);
      const res = await fetch("/api/face-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_base64: base64, media_type: mediaType, gender }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error ?? "Analysis failed"); setStep(1); URL.revokeObjectURL(url); clearPreview(); return; }
      setAnalysis(d);
      setStep(3);
      URL.revokeObjectURL(url); clearPreview(); // result view doesn't show the preview
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep(1);
      URL.revokeObjectURL(url); clearPreview();
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // Manual override — instant, no API call, re-reads the curated matrix
  function overrideShape(shape: FaceShape) {
    if (!analysis || gender === "") return;
    setAnalysis({
      ...analysis,
      face_shape: shape,
      reasoning: SHAPE_BLURB[shape],
      confidence: "medium",
      recommendations: getRecommendations(gender, shape),
    });
  }

  function reset() {
    clearPreview();
    setStep(0); setGender(""); setConsent(false); setAnalysis(null); setError("");
  }

  const confidenceColor =
    analysis?.confidence === "high" ? "text-green-400" : analysis?.confidence === "low" ? "text-amber-400" : "text-salon-gold";

  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-salon-gold">
        <Sparkles className="h-3.5 w-3.5" /> AI Style Match
      </p>
      <h1 className="mt-3 font-display text-5xl leading-none md:text-6xl">Find your haircut.</h1>
      <p className="mt-3 text-sm text-white/50">
        Upload a selfie and our AI suggests the three cuts that best suit your face shape.
        Your photo is analysed instantly and <span className="text-white/70">never stored</span>.
      </p>

      <div className="mt-10">
        <AnimatePresence mode="wait">

          {/* Step 0 — gender */}
          {step === 0 && (
            <motion.div key="g" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <p className="mb-4 text-sm text-white/60">Recommendations are tailored — who are we styling?</p>
              <div className="flex gap-3">
                {(["Male", "Female"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => { setGender(g); setStep(1); }}
                    className={`flex-1 rounded-xl border py-5 text-base font-semibold transition ${
                      gender === g ? "border-salon-gold bg-salon-gold/10 text-salon-gold" : "border-white/15 text-white/70 hover:border-white/40"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1 — consent + upload */}
          {step === 1 && (
            <motion.div key="u" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-white">
                  <ShieldCheck className="h-4 w-4 text-salon-gold" /> Before you upload
                </p>
                <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-white/50">
                  <li>• Your photo is sent once for instant AI analysis and then discarded.</li>
                  <li>• It is never saved to our servers and never shared.</li>
                  <li>• Use a clear, front-facing selfie with your hair off your face for the best result.</li>
                </ul>
                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    aria-required="true"
                    className="mt-0.5 h-4 w-4 accent-salon-gold"
                  />
                  <span>I agree to have my photo analysed for a one-time haircut suggestion.</span>
                </label>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={onPick}
                className="hidden"
              />
              <button
                disabled={!consent}
                onClick={() => fileRef.current?.click()}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-salon-gold py-4 text-sm font-bold uppercase tracking-wider text-salon-black transition hover:brightness-110 disabled:opacity-40"
              >
                <Camera className="h-4 w-4" /> Take or upload a selfie
              </button>

              {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

              <button onClick={() => setStep(0)} className="mt-5 flex items-center gap-1 text-xs text-white/40 hover:text-white">
                <ChevronLeft className="h-3 w-3" /> Back
              </button>
            </motion.div>
          )}

          {/* Step 2 — loading */}
          {step === 2 && (
            <motion.div key="l" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}
              className="flex flex-col items-center py-12 text-center">
              {preview && (
                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-salon-gold/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Your selfie" className="h-full w-full object-cover" />
                </div>
              )}
              <Loader2 className="mt-6 h-6 w-6 animate-spin text-salon-gold" />
              <p className="mt-3 text-sm text-white/60">Analysing your face shape…</p>
              <p className="mt-1 text-xs text-white/30">This usually takes 5–30 seconds depending on your connection.</p>
            </motion.div>
          )}

          {/* Step 3 — result */}
          {step === 3 && analysis && gender !== "" && (
            <motion.div key="r" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              {!analysis.quality_ok && analysis.quality_note && (
                <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 text-xs text-amber-300">
                  {analysis.quality_note} You can still see suggestions below, or retake for a sharper read — that photo has already been discarded.
                </div>
              )}

              {/* Detected shape */}
              <div className="rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-salon-gold">Your face shape</p>
                <div className="mt-1 flex items-baseline gap-3">
                  <h2 className="font-display text-5xl uppercase text-white">{analysis.face_shape}</h2>
                  <span className={`text-xs font-semibold ${confidenceColor}`}>{analysis.confidence} confidence</span>
                </div>
                <p className="mt-2 text-sm text-white/60">{analysis.reasoning || SHAPE_BLURB[analysis.face_shape]}</p>
              </div>

              {/* Recommendations */}
              <p className="mt-8 mb-3 flex items-center gap-2 text-sm font-medium text-white">
                <Scissors className="h-4 w-4 text-salon-gold" /> Your top 3 cuts
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {analysis.recommendations.map((r, i) => (
                  <div key={r.cut} className="flex flex-col overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
                    <div className="relative h-32 w-full bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={r.image}
                        alt={r.cut}
                        className="h-full w-full object-cover opacity-80"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-salon-black/70 px-2 py-0.5 text-[10px] font-bold text-salon-gold">
                        #{i + 1}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="font-semibold text-white">{r.cut}</p>
                      <p className="mt-1 flex-1 text-xs leading-relaxed text-white/50">{r.why}</p>
                      <Link
                        href={bookHref(gender, r.cut)}
                        className="mt-3 rounded-full bg-salon-gold py-2 text-center text-xs font-bold uppercase tracking-wider text-salon-black transition hover:brightness-110"
                      >
                        Book this look
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* What to avoid */}
              <div className="mt-5 rounded-lg border border-white/8 bg-white/[0.02] p-4">
                <p className="text-xs uppercase tracking-wider text-white/40">Best to avoid</p>
                <p className="mt-1 text-sm text-white/60">{getAvoid(gender, analysis.face_shape)}</p>
              </div>

              {/* Override */}
              <div className="mt-6">
                <p className="mb-2 text-xs text-white/40">Not quite right? Pick your face shape to update the suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {FACE_SHAPES.map((s) => (
                    <button
                      key={s}
                      onClick={() => overrideShape(s)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition ${
                        analysis.face_shape === s ? "border-salon-gold text-salon-gold" : "border-white/15 text-white/50 hover:border-white/40"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-6 text-xs text-white/30">
                These are AI-assisted suggestions to guide your consultation — your stylist will confirm the perfect cut in person.
              </p>

              <button onClick={reset} className="mt-5 flex items-center gap-2 text-sm text-white/40 underline hover:text-white">
                <RefreshCw className="h-3.5 w-3.5" /> Try another photo
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
