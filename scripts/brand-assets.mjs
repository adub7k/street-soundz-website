/**
 * Brand asset generator — run once whenever the logo changes.
 *
 *   node scripts/brand-assets.mjs <logo-transparent.png> <logo-on-black.jpg>
 *
 * Needs `sharp` and `opentype.js` resolvable (they're deliberately NOT project
 * deps — native sharp would slow every Railway build for a one-off task):
 *   cd into any folder that has them installed and run it with OUT_DIR=/path/to/repo/public
 *
 * Produces, in /public:
 *   img/street-soundz-logo-{1400,700}.webp        trimmed transparent wordmark (PNG is 1.1MB — delete it)
 *   img/street-soundz-share.jpg                   1200×630 share card (logo on black)
 *   img/street-soundz-mark-{512,256}.png          square "SS" mark (typographic —
 *                                                 the wordmark is unreadable at 32px)
 *   favicon-{32,48,96,192}.png, apple-touch-icon.png, favicon.ico
 */
import sharp from "sharp";
import opentype from "opentype.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const [, , LOGO_PNG, LOGO_JPG, FONT = "Unbounded-700.ttf"] = process.argv;
if (!LOGO_PNG || !LOGO_JPG) throw new Error("usage: brand-assets.mjs <logo.png> <logo-black.jpg>");
const PUB = resolve(process.env.OUT_DIR ?? "public");
const IMG = resolve(PUB, "img");
mkdirSync(IMG, { recursive: true });

const GOLD = "#E3B24E";
const GOLD_DEEP = "#B98A2E";
const BLACK = "#0f1013";

/* ---- wordmark --------------------------------------------------------- */
const trimmed = await sharp(LOGO_PNG).trim({ threshold: 10 }).png().toBuffer();
for (const w of [1400, 700]) {
  await sharp(trimmed).resize({ width: w }).png({ compressionLevel: 9 }).toFile(`${IMG}/street-soundz-logo-${w}.png`);
  await sharp(trimmed).resize({ width: w }).webp({ quality: 88, alphaQuality: 90 }).toFile(`${IMG}/street-soundz-logo-${w}.webp`);
}

/* ---- share card ------------------------------------------------------- */
const logoForShare = await sharp(LOGO_JPG).trim({ threshold: 18 }).resize({ width: 980, height: 500, fit: "inside" }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#000000" } })
  .composite([{ input: logoForShare, gravity: "centre" }])
  .jpeg({ quality: 88 })
  .toFile(`${IMG}/street-soundz-share.jpg`);

/* ---- square mark ------------------------------------------------------ */
const font = opentype.loadSync(FONT);
const text = "SS";
const size = 300;
const path = font.getPath(text, 0, 0, size, { kerning: true });
const bb = path.getBoundingBox();
const tw = bb.x2 - bb.x1, th = bb.y2 - bb.y1;
const tx = (512 - tw) / 2 - bb.x1, ty = (512 - th) / 2 - bb.y1;
const d = font.getPath(text, tx, ty, size, { kerning: true }).toPathData(2);
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F3CC6E"/><stop offset="0.55" stop-color="${GOLD}"/><stop offset="1" stop-color="${GOLD_DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="104" fill="${BLACK}"/>
  <rect x="14" y="14" width="484" height="484" rx="92" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="4"/>
  <path d="${d}" fill="url(#g)"/>
</svg>`;
const mark = Buffer.from(markSvg);
await sharp(mark).png().toFile(`${IMG}/street-soundz-mark-512.png`);
await sharp(mark).resize(256).png().toFile(`${IMG}/street-soundz-mark-256.png`);
for (const s of [32, 48, 96, 192]) await sharp(mark).resize(s).png().toFile(`${PUB}/favicon-${s}.png`);
await sharp(mark).resize(180).png().toFile(`${PUB}/apple-touch-icon.png`);

/* ---- favicon.ico (PNG entries, Vista+) -------------------------------- */
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => sharp(mark).resize(s).png().toBuffer()));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const dir = [];
for (let i = 0; i < sizes.length; i++) {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 0); e.writeUInt8(sizes[i] === 256 ? 0 : sizes[i], 1);
  e.writeUInt8(0, 2); e.writeUInt8(0, 3); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(pngs[i].length, 8); e.writeUInt32LE(offset, 12);
  offset += pngs[i].length; dir.push(e);
}
writeFileSync(`${PUB}/favicon.ico`, Buffer.concat([header, ...dir, ...pngs]));
console.log("brand assets written to", PUB);
