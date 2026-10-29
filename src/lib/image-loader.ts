// Custom next/image loader so the site can be statically exported and hosted anywhere.
// Variants are produced by scripts/optimize-images.mjs. Keep the widths in sync.
const SIZES: Record<string, number[]> = {
  logo: [160, 320, 480],
  founder: [480, 800, 1200],
  team: [640, 1000],
  training: [640, 1000, 1600],
  reach: [800, 1400, 2000],
  'hero-poster': [960, 1600],
};

export default function imageLoader({ src, width }: { src: string; width: number }) {
  const name = src.replace(/^\/img\//, '').replace(/\.\w+$/, '');
  const sizes = SIZES[name];
  if (!sizes) return src;
  const w = sizes.find((s) => s >= width) ?? sizes[sizes.length - 1];
  return `/img/${name}-${w}.webp`;
}
