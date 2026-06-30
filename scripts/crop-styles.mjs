// Slice each 3-up style composite into 3 cells for the AI Style Match cards.
// Usage: npm i -D sharp && node scripts/crop-styles.mjs
// Input:  public/styles/_raw/{gender}-{shape}.{png,jpg,jpeg,webp}  (3 cuts side by side)
// Output: public/styles/{gender}/{shape}-{0,1,2}.jpg

import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = join(root, "public/styles/_raw");
const GENDERS = ["male", "female"];
const SHAPES = ["oval", "round", "square", "heart", "oblong", "diamond", "triangle"];

const files = existsSync(rawDir) ? readdirSync(rawDir) : [];
function findRaw(base) {
  return files.find((f) => f.toLowerCase().match(new RegExp(`^${base}\\.(png|jpe?g|webp)$`, "i")));
}

let done = 0, missing = [];
for (const g of GENDERS) {
  mkdirSync(join(root, "public/styles", g), { recursive: true });
  for (const s of SHAPES) {
    const raw = findRaw(`${g}-${s}`);
    if (!raw) { missing.push(`${g}-${s}`); continue; }
    const img = sharp(join(rawDir, raw));
    const { width, height } = await img.metadata();
    const cellW = Math.floor(width / 3);
    for (let i = 0; i < 3; i++) {
      // clamp last cell so rounding never runs past the edge
      const left = i * cellW;
      const w = i === 2 ? width - left : cellW;
      await sharp(join(rawDir, raw))
        .extract({ left, top: 0, width: w, height })
        .jpeg({ quality: 84 })
        .toFile(join(root, "public/styles", g, `${s}-${i}.jpg`));
      done++;
    }
  }
}

console.log(`✓ wrote ${done} cells`);
if (missing.length) console.log(`… still missing: ${missing.join(", ")}`);
