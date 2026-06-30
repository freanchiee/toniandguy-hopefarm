"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Loader2, Camera, ChevronLeft, Sparkles, ShieldCheck, RefreshCw, Scissors } from "lucide-react";
import {
  FACE_SHAPES, SHAPE_BLURB, classifyShape, getRecommendations, getAvoid, bookHref,
  type FaceShape, type Gender, type Recommendation, type ShapeReading,
} from "@/lib/face-analysis";
import { FaceShapeSVG, hairFamily } from "@/components/FaceShapeSVG";

type Analysis = ShapeReading & { recommendations: Recommendation[] };

const stepVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

// Self-hosted from /public so there's no third-party CDN/DNS dependency
// (Google's CDNs can fail to resolve on some networks → ERR_NAME_NOT_RESOLVED).
const WASM_URL = "/mediapipe/wasm";
const MODEL_URL = "/mediapipe/face_landmarker.task";

function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = url;
  return img.decode().then(() => img);
}

// Per-shape style illustrations live at /public/styles/{gender}/{shape}-{0..2}.jpg.
// The card overlays this on the vector portrait — if the file is missing, the
// <img> errors out and the vector shows through. So it's safe before images exist.
const styleImg = (g: Gender, shape: FaceShape, i: number) =>
  `/styles/${g.toLowerCase()}/${shape.toLowerCase()}-${i}.jpg`;

// Reject if a promise doesn't settle in time, so a flaky network can't hang the UI.
function withTimeout<T>(p: Promise<T>, ms: number, msg: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(msg)), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}

export function FaceAnalysisWidget() {
  const [step, setStep] = useState(0); // 0 gender, 1 upload, 2 loading, 3 result
  const [gender, setGender] = useState<Gender | "">("");
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState("");
  const [modelReady, setModelReady] = useState(false);
  const landmarkerPromiseRef = useRef<Promise<any> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load the MediaPipe model once (deduped across the preload + the actual pick,
  // with a timeout, and reset-on-failure so a retry can re-initialise).
  function ensureLandmarker(): Promise<any> {
    if (!landmarkerPromiseRef.current) {
      landmarkerPromiseRef.current = withTimeout((async () => {
        const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const fileset = await FilesetResolver.forVisionTasks(WASM_URL);
        const common = { numFaces: 1, runningMode: "IMAGE" as const };
        try {
          return await FaceLandmarker.createFromOptions(fileset, { baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" }, ...common });
        } catch {
          // ponytail: some devices have no WebGL — fall back to CPU
          return await FaceLandmarker.createFromOptions(fileset, { baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" }, ...common });
        }
      })(), 30000, "Couldn't load the analyser — check your connection and try again.")
        .catch((e) => { landmarkerPromiseRef.current = null; throw e; });
    }
    return landmarkerPromiseRef.current;
  }

  useEffect(() => {
    if (step !== 1 || modelReady) return;
    let cancelled = false;
    ensureLandmarker().then(() => { if (!cancelled) setModelReady(true); }).catch(() => {});
    return () => { cancelled = true; };
  }, [step, modelReady]);

  function clearPreview() {
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    setError("");
    const url = URL.createObjectURL(file);
    setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return url; });
    setStep(2);

    try {
      const lm = await ensureLandmarker();
      const img = await loadImage(url);
      const result = lm.detect(img);
      const faces = result?.faceLandmarks;
      if (!faces || faces.length === 0) {
        setError("Couldn't find a clear face. Use a front-facing selfie in good light with your hair off your face.");
        setStep(1); URL.revokeObjectURL(url); clearPreview();
        return;
      }
      // normalized → pixel coordinates (so x/y share the same scale)
      const pts = faces[0].map((p: { x: number; y: number }) => ({ x: p.x * img.naturalWidth, y: p.y * img.naturalHeight }));
      const reading = classifyShape(pts);
      if (!reading || gender === "") {
        setError("Analysis failed — please try another photo.");
        setStep(1); URL.revokeObjectURL(url); clearPreview();
        return;
      }
      setAnalysis({ ...reading, recommendations: getRecommendations(gender, reading.shape) });
      setStep(3);
      URL.revokeObjectURL(url); clearPreview();

      // Anonymous analytics — fire-and-forget, no image, never blocks the result
      fetch("/api/face-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, face_shape: reading.shape, confidence: reading.confidence }),
      }).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
      setStep(1); URL.revokeObjectURL(url); clearPreview();
    }
  }

  // Manual override — instant, re-reads the curated matrix, no detection needed
  function overrideShape(shape: FaceShape) {
    if (!analysis || gender === "") return;
    setAnalysis({
      ...analysis,
      shape,
      reasoning: SHAPE_BLURB[shape],
      confidence: "medium",
      recommendations: getRecommendations(gender, shape),
    });
  }

  function reset() {
    clearPreview();
    setStep(0); setGender(""); setAnalysis(null); setError("");
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
        Upload a selfie and we suggest the three cuts that best suit your face shape.
        The analysis runs <span className="text-white/70">entirely on your device</span> — your photo never leaves your phone.
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

          {/* Step 1 — upload */}
          {step === 1 && (
            <motion.div key="u" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-white">
                  <ShieldCheck className="h-4 w-4 text-salon-gold" /> 100% private
                </p>
                <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-white/50">
                  <li>• Your selfie is analysed right here on your device — it is never uploaded or stored.</li>
                  <li>• Use a clear, front-facing photo with your hair off your face for the best result.</li>
                </ul>
              </div>

              <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={onPick} className="hidden" />
              <button
                onClick={() => fileRef.current?.click()}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-salon-gold py-4 text-sm font-bold uppercase tracking-wider text-salon-black transition hover:brightness-110"
              >
                <Camera className="h-4 w-4" /> Take or upload a selfie
              </button>
              <p className="mt-2 text-center text-xs text-white/30">
                {modelReady ? "Ready" : "Preparing on-device analysis…"}
              </p>

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
              <p className="mt-1 text-xs text-white/30">Running on your device — no upload.</p>
            </motion.div>
          )}

          {/* Step 3 — result */}
          {step === 3 && analysis && gender !== "" && (
            <motion.div key="r" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              {!analysis.quality_ok && analysis.quality_note && (
                <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 text-xs text-amber-300">
                  {analysis.quality_note} You can still see suggestions below, or retake for a sharper read.
                </div>
              )}

              {/* Detected shape */}
              <div className="flex items-center gap-4 rounded-2xl border border-salon-gold/30 bg-salon-gold/5 p-6">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-salon-gold">Your face shape</p>
                  <div className="mt-1 flex items-baseline gap-3">
                    <h2 className="font-display text-5xl uppercase text-white">{analysis.shape}</h2>
                    <span className={`text-xs font-semibold ${confidenceColor}`}>{analysis.confidence} confidence</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">{analysis.reasoning || SHAPE_BLURB[analysis.shape]}</p>
                </div>
                <FaceShapeSVG shape={analysis.shape} hair={gender === "Female" ? "long" : "crop"} className="h-28 w-auto shrink-0" />
              </div>

              {/* Recommendations */}
              <p className="mt-8 mb-3 flex items-center gap-2 text-sm font-medium text-white">
                <Scissors className="h-4 w-4 text-salon-gold" /> Your top 3 cuts
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {analysis.recommendations.map((r, i) => (
                  <div key={r.cut} className="flex flex-col overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
                    <div className="relative flex h-36 w-full items-center justify-center bg-salon-black">
                      <FaceShapeSVG shape={analysis.shape} hair={hairFamily(r.cut, gender)} className="h-full w-auto py-2" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={styleImg(gender, analysis.shape, i)}
                        alt={r.cut}
                        className="absolute inset-0 h-full w-full object-cover object-top"
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
                <p className="mt-1 text-sm text-white/60">{getAvoid(gender, analysis.shape)}</p>
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
                        analysis.shape === s ? "border-salon-gold text-salon-gold" : "border-white/15 text-white/50 hover:border-white/40"
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
