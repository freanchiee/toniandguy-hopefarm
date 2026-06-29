// ── Face-analysis shared data & helpers (client + server safe — no secrets) ───
// The AI only classifies the FACE SHAPE. Recommendations come from this
// stylist-curated matrix so they stay consistent, gender-aware, and bookable.
// This also means the "override your shape" re-roll is instant & free — it just
// re-reads the matrix client-side, no extra API call.

export const FACE_SHAPES = ["Oval", "Round", "Square", "Heart", "Oblong", "Diamond", "Triangle"] as const;
export type FaceShape = (typeof FACE_SHAPES)[number];
export type Gender = "Male" | "Female";

export type Recommendation = { cut: string; why: string };

export type AnalysisResult = {
  ok: boolean;            // a single clear face was found
  quality_ok: boolean;    // photo is usable (not tilted/dark/occluded)
  quality_note: string;   // shown to user when quality_ok is false
  face_shape: FaceShape;
  confidence: "high" | "medium" | "low";
  reasoning: string;      // one-line plain-English explanation
};

// The booking service every haircut recommendation maps to (must match lib/data.ts name)
export const BOOK_SERVICE = "Haircut & Styling";

// One-line description of each shape, shown in the result
export const SHAPE_BLURB: Record<FaceShape, string> = {
  Oval: "Balanced proportions with a gently rounded jaw — the most versatile shape.",
  Round: "Soft curves with similar width and length, and full cheeks.",
  Square: "A strong, angular jaw with a broad forehead of similar width.",
  Heart: "A wider forehead and cheekbones tapering to a narrow, pointed chin.",
  Oblong: "Longer than it is wide, with a straight cheek line.",
  Diamond: "A narrow forehead and jaw with wide, high cheekbones.",
  Triangle: "A wider jaw narrowing up toward the forehead.",
};

// gender → shape → exactly 3 flattering cuts
const CUTS: Record<Gender, Record<FaceShape, Array<{ cut: string; why: string }>>> = {
  Female: {
    Oval: [
      { cut: "Long Layers", why: "Shows off your balanced proportions with soft movement." },
      { cut: "Blunt Lob", why: "A clean, modern length that suits an oval face effortlessly." },
      { cut: "Curtain Bangs", why: "Frames the face without hiding your even features." },
    ],
    Round: [
      { cut: "Long Layers", why: "Adds vertical length to slim a rounder face." },
      { cut: "Lob Below the Chin", why: "Sits past the widest point to elongate, not widen." },
      { cut: "Side-Swept Bangs", why: "Creates angles that offset soft curves." },
    ],
    Square: [
      { cut: "Soft Layers", why: "Softens a strong jawline with gentle texture." },
      { cut: "Wavy Lob", why: "Curves around the jaw to balance the angles." },
      { cut: "Side-Swept Bangs", why: "Breaks up a broad forehead for a softer frame." },
    ],
    Heart: [
      { cut: "Chin-Length Bob", why: "Adds width at the jaw to balance a narrow chin." },
      { cut: "Side or Curtain Bangs", why: "Reduces the width of a broader forehead." },
      { cut: "Cheekbone Layers", why: "Draws volume lower to even out the proportions." },
    ],
    Oblong: [
      { cut: "Blunt Bob", why: "A shorter length stops the face looking longer." },
      { cut: "Soft Waves", why: "Adds width at the sides to balance the length." },
      { cut: "Full or Curtain Bangs", why: "Shortens the face visually for instant balance." },
    ],
    Diamond: [
      { cut: "Chin-Length Cut", why: "Adds fullness at the jaw to balance cheekbones." },
      { cut: "Side-Swept Bangs", why: "Widens a narrow forehead for harmony." },
      { cut: "Textured Layers", why: "Softens high cheekbones with movement." },
    ],
    Triangle: [
      { cut: "Crown Volume Layers", why: "Builds width up top to balance a wider jaw." },
      { cut: "Layered Shoulder Cut", why: "Keeps weight high and off the jawline." },
      { cut: "Side-Swept Bangs", why: "Adds fullness across the forehead." },
    ],
  },
  Male: {
    Oval: [
      { cut: "Pompadour", why: "A versatile classic that suits balanced features." },
      { cut: "Textured Crop", why: "Modern, low-maintenance, and flatters most angles." },
      { cut: "Classic Side Part", why: "Clean and timeless on an oval face." },
    ],
    Round: [
      { cut: "Pompadour", why: "Height on top elongates a rounder face." },
      { cut: "High Fade with Volume", why: "Tight sides plus top volume add definition." },
      { cut: "Faux Hawk", why: "Draws the eye upward to slim the face." },
    ],
    Square: [
      { cut: "Crew Cut", why: "Sharp and structured to match a strong jaw." },
      { cut: "Buzz Cut", why: "Showcases defined, angular features." },
      { cut: "Classic Side Part", why: "Clean lines that complement the jawline." },
    ],
    Heart: [
      { cut: "Textured Fringe", why: "A fuller fringe balances a wider forehead." },
      { cut: "Side-Swept Fringe", why: "Softens the forehead and frames the face." },
      { cut: "Medium Layered", why: "Adds weight lower to balance a narrow chin." },
    ],
    Oblong: [
      { cut: "Textured Crop with Fringe", why: "A fringe shortens a longer face." },
      { cut: "Short Side Part", why: "Keeps height low to avoid lengthening." },
      { cut: "Caesar Cut", why: "Forward fringe balances the proportions." },
    ],
    Diamond: [
      { cut: "Textured Fringe", why: "Adds width at the forehead to balance cheekbones." },
      { cut: "Fuller Sides Cut", why: "Softens prominent cheekbones." },
      { cut: "Medium Length", why: "Movement offsets sharp angles." },
    ],
    Triangle: [
      { cut: "Pompadour", why: "Volume up top balances a wider jaw." },
      { cut: "Quiff", why: "Adds height and width at the crown." },
      { cut: "Volume-on-Top Cut", why: "Keeps weight high to even out the face." },
    ],
  },
};

const AVOID: Record<Gender, Record<FaceShape, string>> = {
  Female: {
    Oval: "Very heavy, face-covering styles that hide your balanced features.",
    Round: "Blunt chin-length bobs and blunt fringes that add width.",
    Square: "One-length, jaw-grazing bobs that echo the jawline.",
    Heart: "Blunt bangs paired with heavy crown volume.",
    Oblong: "Long, sleek, centre-parted hair that lengthens the face further.",
    Diamond: "Slicked-back styles that expose and widen the cheekbones.",
    Triangle: "Bottom-heavy long styles that add width at the jaw.",
  },
  Male: {
    Oval: "Heavy fringes that cover the forehead and hide your proportions.",
    Round: "Even all-over lengths and bowl shapes that add roundness.",
    Square: "Long, unstructured styles that hide a strong jaw.",
    Heart: "Slicked-back high-volume tops that widen the forehead.",
    Oblong: "Tall pompadours and quiffs that lengthen the face.",
    Diamond: "Very short sides with a high top that sharpen the cheekbones.",
    Triangle: "Tightly faded sides with a flat top.",
  },
};

export function getRecommendations(gender: Gender, shape: FaceShape): Recommendation[] {
  return CUTS[gender][shape];
}

export function getAvoid(gender: Gender, shape: FaceShape): string {
  return AVOID[gender][shape];
}

// Deep-link a recommended look into the existing booking flow
export function bookHref(gender: Gender, look: string): string {
  const qs = new URLSearchParams({ service: BOOK_SERVICE, look, gender });
  return `/book?${qs.toString()}`;
}

// ── In-browser face-shape classifier ──────────────────────────────────────────
// Takes MediaPipe FaceLandmarker points in PIXEL coordinates and classifies the
// shape from geometric ratios. Pure & dependency-free — no API, no cost.
// ponytail: heuristic thresholds, tune on real photos if accuracy needs lifting.

export type ShapeReading = {
  shape: FaceShape;
  confidence: "high" | "medium" | "low";
  quality_ok: boolean;
  quality_note: string;
  reasoning: string;
};

type Pt = { x: number; y: number };

// MediaPipe Face Mesh canonical landmark indices
const IDX = {
  foreheadTop: 10, chin: 152,
  cheekL: 234, cheekR: 454,   // widest face points
  jawL: 172, jawR: 397,       // gonion (jaw corners)
  templeL: 54, templeR: 284,  // upper forehead sides
  chinSideL: 149, chinSideR: 378,
  nose: 1,
};

const REASONING: Record<FaceShape, string> = {
  Oblong: "Your face is longer than it is wide.",
  Diamond: "Your cheekbones are the widest part of your face.",
  Heart: "Your forehead is wider than your jawline.",
  Triangle: "Your jawline is the widest part of your face.",
  Round: "Your face is about as wide as it is long, with soft edges.",
  Square: "Your face is about as wide as it is long, with a strong jaw.",
  Oval: "Balanced proportions with a gently rounded jawline.",
};

function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function classifyShape(pts: Pt[]): ShapeReading | null {
  if (!pts || pts.length < 468) return null;
  const p = (i: number) => pts[i];

  const L = dist(p(IDX.foreheadTop), p(IDX.chin)); // face length
  const Wc = dist(p(IDX.cheekL), p(IDX.cheekR));    // cheekbone (face) width
  const Wf = dist(p(IDX.templeL), p(IDX.templeR));  // forehead width
  const Wj = dist(p(IDX.jawL), p(IDX.jawR));        // jaw width
  const chinW = dist(p(IDX.chinSideL), p(IDX.chinSideR));
  if (Wc === 0 || Wj === 0) return null;

  // Quality: is the face roughly straight-on? Compare nose→cheek symmetry.
  const nose = p(IDX.nose);
  const dl = dist(nose, p(IDX.cheekL));
  const dr = dist(nose, p(IDX.cheekR));
  const symmetry = Math.min(dl, dr) / Math.max(dl, dr); // 1 = perfectly frontal
  const quality_ok = symmetry > 0.74;
  const quality_note = quality_ok ? "" : "For a sharper read, face the camera straight on with your whole face visible.";

  const lw = L / Wc;            // length-to-width ratio
  const fjRatio = Wf / Wj;      // forehead vs jaw
  const chinTaper = chinW / Wj; // 1 = wide square chin, low = pointed chin

  let shape: FaceShape;
  if (lw >= 1.5) {
    shape = "Oblong";
  } else {
    const cheekDominant = Wc > Wf * 1.05 && Wc > Wj * 1.05;
    if (cheekDominant && chinTaper < 0.62) shape = "Diamond";
    else if (fjRatio > 1.08) shape = "Heart";
    else if (fjRatio < 0.92) shape = "Triangle";
    else if (lw <= 1.15) shape = chinTaper > 0.6 ? "Square" : "Round";
    else shape = "Oval";
  }

  // Confidence: strong when the deciding signal is clearly past its boundary.
  const margins = [
    Math.abs(lw - 1.5), Math.abs(lw - 1.15),
    Math.abs(fjRatio - 1.0), Math.abs(Wc - Math.max(Wf, Wj)) / Wc,
  ];
  const clear = Math.max(...margins);
  let confidence: ShapeReading["confidence"] = clear > 0.18 ? "high" : clear > 0.08 ? "medium" : "low";
  if (!quality_ok && confidence === "high") confidence = "medium";

  return { shape, confidence, quality_ok, quality_note, reasoning: REASONING[shape] };
}
