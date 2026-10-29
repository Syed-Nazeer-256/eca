import type { MetadataRoute } from 'next';
import { SITE } from '@/data/site';

export const dynamic = 'force-static';

// Open to all crawlers, search and AI answer engines alike. To opt out of a specific AI crawler,
// add a rule for its user agent here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
