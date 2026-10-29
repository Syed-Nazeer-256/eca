// Builds responsive WebP variants from assets-src/*.png into public/img/<name>-<width>.webp.
// Keep the widths here in sync with src/lib/image-loader.ts.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'assets-src';
const OUT = 'public/img';
const WIDTHS = {
  logo: [160, 320, 480],
  founder: [480, 800, 1200],
  team: [640, 1000],
  training: [640, 1000, 1600],
  reach: [800, 1400, 2000],
  'hero-poster': [960, 1600],
};

await mkdir(OUT, { recursive: true });
for (const file of await readdir(SRC)) {
  if (!file.endsWith('.png')) continue;
  const name = path.basename(file, '.png');
  const widths = WIDTHS[name];
  if (!widths) {
    console.warn(`skip ${file}: no widths configured`);
    continue;
  }
  const meta = await sharp(path.join(SRC, file)).metadata();
  for (const w of widths) {
    const width = Math.min(w, meta.width);
    const dest = path.join(OUT, `${name}-${w}.webp`);
    const info = await sharp(path.join(SRC, file))
      .resize({ width })
      .webp({ quality: 80, alphaQuality: 92, effort: 5 })
      .toFile(dest);
    console.log(`${dest}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}

// App icons: crop the EC mark from the logo, centre it on the light chip colour, export PNGs.
const mark = await sharp(path.join(SRC, 'logo.png'))
  .extract({ left: 0, top: 0, width: 415, height: 428 })
  .toBuffer();
for (const [file, px] of [['icon-192.png', 192], ['icon-512.png', 512], ['apple-icon.png', 180]]) {
  const inner = Math.round(px * 0.78);
  const pad = Math.round((px - inner) / 2);
  await sharp(mark)
    .resize({ width: inner, height: inner, fit: 'contain', background: '#ECEFEA' })
    .flatten({ background: '#ECEFEA' })
    .extend({ top: pad, bottom: px - inner - pad, left: pad, right: px - inner - pad, background: '#ECEFEA' })
    .png()
    .toFile(path.join('public', file));
  console.log(`public/${file}`);
}
