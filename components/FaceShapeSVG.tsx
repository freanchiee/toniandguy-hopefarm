import type { FaceShape, Gender } from "@/lib/face-analysis";

// Parametric vector portrait: a face silhouette for the detected shape with a
// hairstyle overlay representing a recommended cut. Gold line-art on dark — the
// hair sits BEHIND the face (filled with the bg colour) so it reads as a frame.

const GOLD = "#c9a84c";
const BG = "#0a0a0a";
const cx = 60;

type Geo = { fore: number; cheek: number; jaw: number; chin: number; topY: number; foreheadY: number; cheekY: number; jawY: number; chinTipY: number };

const BASE = { topY: 22, foreheadY: 46, cheekY: 84, jawY: 118, chinTipY: 150 };

const SHAPES: Record<FaceShape, Partial<Geo>> = {
  Oval:     { fore: 30, cheek: 35, jaw: 29, chin: 15 },
  Round:    { fore: 33, cheek: 40, jaw: 36, chin: 24, cheekY: 80, jawY: 112, chinTipY: 142 },
  Square:   { fore: 37, cheek: 39, jaw: 39, chin: 32 },
  Heart:    { fore: 39, cheek: 36, jaw: 25, chin: 11 },
  Oblong:   { fore: 28, cheek: 30, jaw: 28, chin: 17, foreheadY: 48, cheekY: 88, jawY: 126, chinTipY: 160 },
  Diamond:  { fore: 23, cheek: 40, jaw: 25, chin: 12 },
  Triangle: { fore: 25, cheek: 31, jaw: 40, chin: 31 },
};

type HairFamily = "crop" | "pompadour" | "fringe" | "bob" | "long";

export function hairFamily(cut: string, gender: Gender): HairFamily {
  const c = cut.toLowerCase();
  if (/pompadour|quiff|faux hawk/.test(c)) return "pompadour";
  if (gender === "Male" && /volume|fade/.test(c)) return "pompadour";
  if (/fringe|bangs|caesar/.test(c)) return "fringe";
  if (/bob|lob|chin-length/.test(c)) return "bob";
  if (/crew|buzz|crop|side part/.test(c)) return "crop";
  if (gender === "Male" && /medium|short/.test(c)) return "crop";
  if (/long|wav|layer|shoulder|cheekbone|crown/.test(c)) return "long";
  return gender === "Female" ? "long" : "crop";
}

function geo(shape: FaceShape): Geo {
  return { ...BASE, ...SHAPES[shape] } as Geo;
}

type Pt = { x: number; y: number };

// Closed Catmull-Rom spline → smooth SVG path
function smooth(pts: Pt[]): string {
  const n = pts.length;
  const r = (v: number) => Math.round(v * 10) / 10;
  let d = `M ${r(pts[0].x)} ${r(pts[0].y)} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${r(c1x)} ${r(c1y)} ${r(c2x)} ${r(c2y)} ${r(p2.x)} ${r(p2.y)} `;
  }
  return d + "Z";
}

function facePath(g: Geo): string {
  return smooth([
    { x: cx, y: g.topY },
    { x: cx + g.fore, y: g.foreheadY },
    { x: cx + g.cheek, y: g.cheekY },
    { x: cx + g.jaw, y: g.jawY },
    { x: cx + g.chin, y: g.chinTipY - 9 },
    { x: cx, y: g.chinTipY },
    { x: cx - g.chin, y: g.chinTipY - 9 },
    { x: cx - g.jaw, y: g.jawY },
    { x: cx - g.cheek, y: g.cheekY },
    { x: cx - g.fore, y: g.foreheadY },
  ]);
}

const HAIR: Record<HairFamily, { down: (g: Geo) => number; outX: number; lift: number; peak: number; front: boolean }> = {
  crop:      { down: (g) => g.cheekY - 4, outX: 3, lift: 7, peak: 0,  front: false },
  pompadour: { down: (g) => g.cheekY - 6, outX: 3, lift: 7, peak: 20, front: false },
  fringe:    { down: (g) => g.cheekY - 2, outX: 4, lift: 7, peak: 4,  front: true },
  bob:       { down: (g) => g.jawY + 6,   outX: 8, lift: 9, peak: 2,  front: false },
  long:      { down: (g) => g.chinTipY + 8, outX: 9, lift: 9, peak: 2, front: false },
};

function hairPath(g: Geo, fam: HairFamily): string {
  const h = HAIR[fam];
  const downY = h.down(g);
  const tuck = Math.min(g.cheek, g.jaw) + 1;
  return smooth([
    { x: cx, y: g.topY - h.lift - h.peak },
    { x: cx + g.fore + h.outX, y: g.foreheadY - 2 },
    { x: cx + g.cheek + h.outX, y: g.cheekY },
    { x: cx + g.cheek + h.outX - 1, y: downY },
    { x: cx + tuck, y: downY + 3 },
    { x: cx, y: downY + (downY > g.jawY ? -4 : 8) },
    { x: cx - tuck, y: downY + 3 },
    { x: cx - g.cheek - h.outX + 1, y: downY },
    { x: cx - g.cheek - h.outX, y: g.cheekY },
    { x: cx - g.fore - h.outX, y: g.foreheadY - 2 },
  ]);
}

function fringePath(g: Geo): string {
  const span = g.cheekY - g.foreheadY;
  return smooth([
    { x: cx - g.fore + 3, y: g.foreheadY - 2 },
    { x: cx + g.fore - 3, y: g.foreheadY - 2 },
    { x: cx + g.fore - 9, y: g.foreheadY + span * 0.5 },
    { x: cx - 2, y: g.foreheadY + span * 0.42 },
    { x: cx - g.fore + 9, y: g.foreheadY + span * 0.5 },
  ]);
}

export function FaceShapeSVG({ shape, hair, className }: { shape: FaceShape; hair: HairFamily; className?: string }) {
  const g = geo(shape);
  const h = HAIR[hair];
  const eyeY = g.cheekY - 4;
  const midY = (g.cheekY + g.jawY) / 2;

  return (
    <svg viewBox="0 0 120 175" className={className} role="img" aria-label={`${shape} face shape with ${hair} style`}>
      {/* hair behind */}
      <path d={hairPath(g, hair)} fill={GOLD} fillOpacity="0.82" />
      {/* face occludes the hair centre → hair reads as a frame */}
      <path d={facePath(g)} fill={BG} stroke={GOLD} strokeWidth="1.6" />
      {/* fringe in front of the forehead */}
      {h.front && <path d={fringePath(g)} fill={GOLD} fillOpacity="0.9" />}
      {/* minimal features */}
      <g stroke={GOLD} strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round">
        <line x1={cx - 14} y1={eyeY} x2={cx - 7} y2={eyeY} />
        <line x1={cx + 7} y1={eyeY} x2={cx + 14} y2={eyeY} />
        <line x1={cx} y1={eyeY + 8} x2={cx} y2={midY - 4} />
        <line x1={cx - 6} y1={midY + 6} x2={cx + 6} y2={midY + 6} />
      </g>
    </svg>
  );
}
