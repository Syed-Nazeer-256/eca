import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: `npm run build` writes ./out, which any static host can serve.
  output: 'export',
  trailingSlash: true,
  poweredByHeader: false,
  // This folder is the project root (a parent folder also has a lockfile).
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
  // One root layout per language, so unmatched URLs need a self-contained 404 document.
  experimental: { globalNotFound: true },
  // Responsive WebP variants are pre-built by scripts/optimize-images.mjs.
  images: { loader: 'custom', loaderFile: './src/lib/image-loader.ts' },
};

export default nextConfig;
