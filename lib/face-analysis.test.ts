// Quick self-check for the face-shape classifier. Run: npx tsx lib/face-analysis.test.ts
import { classifyShape } from "./face-analysis";
import assert from "node:assert";

// Build a 478-point landmark array, then set only the indices the classifier reads.
function face(over: Record<number, { x: number; y: number }>) {
  const pts = Array.from({ length: 478 }, () => ({ x: 0, y: 0 }));
  for (const k in over) pts[+k] = over[+k];
  return pts;
}

// Symmetric nose so quality passes in every case
const nose = { 1: { x: 50, y: 50 } };

// Oblong — clearly longer than wide (L/Wc = 1.65)
assert.equal(classifyShape(face({
  ...nose, 10: { x: 50, y: 0 }, 152: { x: 50, y: 165 },
  234: { x: 0, y: 80 }, 454: { x: 100, y: 80 },
  54: { x: 5, y: 20 }, 284: { x: 95, y: 20 }, 172: { x: 5, y: 120 }, 397: { x: 95, y: 120 },
  149: { x: 35, y: 158 }, 378: { x: 65, y: 158 },
}))?.shape, "Oblong");

// Round — as wide as long, narrow tapered chin
assert.equal(classifyShape(face({
  ...nose, 10: { x: 50, y: 0 }, 152: { x: 50, y: 100 },
  234: { x: 0, y: 50 }, 454: { x: 100, y: 50 },
  54: { x: 0, y: 20 }, 284: { x: 100, y: 20 }, 172: { x: 0, y: 80 }, 397: { x: 100, y: 80 },
  149: { x: 30, y: 95 }, 378: { x: 70, y: 95 },
}))?.shape, "Round");

// Square — as wide as long, broad chin
assert.equal(classifyShape(face({
  ...nose, 10: { x: 50, y: 0 }, 152: { x: 50, y: 100 },
  234: { x: 0, y: 50 }, 454: { x: 100, y: 50 },
  54: { x: 0, y: 20 }, 284: { x: 100, y: 20 }, 172: { x: 0, y: 80 }, 397: { x: 100, y: 80 },
  149: { x: 10, y: 95 }, 378: { x: 90, y: 95 },
}))?.shape, "Square");

// Heart — forehead wider than jaw
assert.equal(classifyShape(face({
  ...nose, 10: { x: 50, y: 0 }, 152: { x: 50, y: 120 },
  234: { x: 0, y: 50 }, 454: { x: 100, y: 50 },
  54: { x: 0, y: 20 }, 284: { x: 100, y: 20 }, 172: { x: 10, y: 85 }, 397: { x: 90, y: 85 },
  149: { x: 35, y: 113 }, 378: { x: 65, y: 113 },
}))?.shape, "Heart");

// Triangle — jaw wider than forehead
assert.equal(classifyShape(face({
  ...nose, 10: { x: 50, y: 0 }, 152: { x: 50, y: 120 },
  234: { x: 0, y: 50 }, 454: { x: 100, y: 50 },
  54: { x: 10, y: 20 }, 284: { x: 90, y: 20 }, 172: { x: 0, y: 85 }, 397: { x: 100, y: 85 },
  149: { x: 30, y: 113 }, 378: { x: 70, y: 113 },
}))?.shape, "Triangle");

// Tilted face (asymmetric nose) → quality flagged
assert.equal(classifyShape(face({
  10: { x: 50, y: 0 }, 152: { x: 50, y: 120 }, 1: { x: 20, y: 50 },
  234: { x: 0, y: 50 }, 454: { x: 100, y: 50 },
  54: { x: 0, y: 20 }, 284: { x: 100, y: 20 }, 172: { x: 0, y: 85 }, 397: { x: 100, y: 85 },
  149: { x: 30, y: 113 }, 378: { x: 70, y: 113 },
}))?.quality_ok, false);

// Too few points → null
assert.equal(classifyShape([{ x: 0, y: 0 }]), null);

console.log("✓ all face-shape classifier checks passed");
