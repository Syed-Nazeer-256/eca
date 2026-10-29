import type { Metadata } from 'next';
import type { Dict } from '@/i18n';

// Shared page metadata. Page-level openGraph replaces the root one, so the image must be set here.
const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'Expert Contracts: project management and contracts consultancy in Riyadh, Saudi Arabia' };

/** Trim to a word boundary so a meta description never ends mid-sentence. */
export function clip(text: string, max = 158): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:،؛]$/, '')}…`;
}

/**
 * Metadata for one page in one language. `path` is the language-neutral path ('/', '/about-us/');
 * the Arabic URL is the same path under /ar. Both versions point at each other with hreflang.
 */
export function pageMeta(d: Dict, opts: { path: string; title: string; ogTitle?: string; description: string; absoluteTitle?: boolean }): Metadata {
  const description = clip(opts.description);
  const en = opts.path;
  const ar = opts.path === '/' ? '/ar/' : `/ar${opts.path}`;
  const self = d.lang === 'ar' ? ar : en;
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description,
    alternates: { canonical: self, languages: { en, ar, 'x-default': en } },
    openGraph: {
      type: 'website',
      url: self,
      title: opts.ogTitle ?? opts.title,
      description,
      locale: d.ogLocale,
      alternateLocale: d.lang === 'ar' ? 'en_US' : 'ar_SA',
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: opts.ogTitle ?? opts.title, description, images: [OG_IMAGE.url] },
  };
}
