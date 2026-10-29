import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Expert Contracts',
    short_name: 'Expert Contracts',
    description: 'Project management consultancy and contracts expertise in Riyadh, Saudi Arabia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1110',
    theme_color: '#0B1110',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
