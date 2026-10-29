import type { MetadataRoute } from 'next';
import { SERVICES, SITE } from '@/data/site';

export const dynamic = 'force-static';

// Every page in both languages, each entry naming its counterpart (hreflang in the sitemap).
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: Array<{ path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }> = [
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/about-us/', priority: 0.7, changeFrequency: 'yearly' },
    { path: '/contact-us/', priority: 0.7, changeFrequency: 'yearly' },
    ...SERVICES.map((s) => ({ path: `/${s.slug}/`, priority: 0.8, changeFrequency: 'monthly' as const })),
  ];
  return pages.flatMap(({ path, priority, changeFrequency }) => {
    const en = `${SITE.url}${path}`;
    const ar = `${SITE.url}${path === '/' ? '/ar/' : `/ar${path}`}`;
    const alternates = { languages: { en, ar } };
    return [
      { url: en, lastModified, changeFrequency, priority, alternates },
      { url: ar, lastModified, changeFrequency, priority, alternates },
    ];
  });
}
