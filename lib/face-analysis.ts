// ── Face-analysis shared data & helpers (client + server safe — no secrets) ───
// The AI only classifies the FACE SHAPE. Recommendations come from this
// stylist-curated matrix so they stay consistent, gender-aware, and bookable.
// This also means the "override your shape" re-roll is instant & free — it just
// re-reads the matrix client-side, no extra API call.

export const FACE_SHAPES = ["Oval", "Round", "Square", "Heart", "Oblong", "Diamond", "Triangle"] as const;
export type FaceShape = (typeof FACE_SHAPES)[number];
export type Gender = "Male" | "Female";

export type Recommendation = { cut: string; why: string; image: string };

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

// Reliable, on-theme salon imagery (rotated by index). The salon can later
// swap these for photos of their own work — just replace the `image` field.
const REF_POOL = [
  "https://images.unsplash.com/photo-1595475884562-073c30d45670?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
];

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
  return CUTS[gender][shape].map((r, i) => ({ ...r, image: REF_POOL[i % REF_POOL.length] }));
}

export function getAvoid(gender: Gender, shape: FaceShape): string {
  return AVOID[gender][shape];
}

// Deep-link a recommended look into the existing booking flow
export function bookHref(gender: Gender, look: string): string {
  const qs = new URLSearchParams({ service: BOOK_SERVICE, look, gender });
  return `/book?${qs.toString()}`;
}
