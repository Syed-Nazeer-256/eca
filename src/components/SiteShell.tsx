import type { Metadata, Viewport } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Motion from '@/components/Motion';
import Spotlight from '@/components/Spotlight';
import JsonLd from '@/components/JsonLd';
import { founder, organization, website } from '@/lib/schema';
import { SITE } from '@/data/site';
import type { Dict } from '@/i18n';

export const baseMetadata = (d: Dict): Metadata => ({
  metadataBase: new URL(SITE.url),
  title: { default: d.ui.homeTitle, template: '%s | Expert Contracts' },
  description: d.ui.homeDesc,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  category: 'business',
  formatDetection: { telephone: false },
  openGraph: { type: 'website', siteName: SITE.name, locale: d.ogLocale, title: d.ui.homeTitle, description: d.ui.homeDesc },
  twitter: { card: 'summary_large_image', title: d.ui.homeTitle, description: d.ui.homeDesc },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
});

export const viewport: Viewport = { themeColor: '#0B1110', colorScheme: 'dark', width: 'device-width', initialScale: 1 };

// Adds the motion class before first paint, except for crawlers and speed-test bots, which get the
// final static page. If the engine never reports ready, a safety class makes everything visible.
const BOOT = `(function(){var d=document.documentElement;var bot=/bot|crawl|spider|lighthouse|pagespeed|gtmetrix|prerender/i.test(navigator.userAgent);if(!bot&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('has-motion');setTimeout(function(){if(!window.__motionReady)d.classList.add('motion-failed')},4000)}})()`;

/** The document for one language. Each language's root layout renders this. */
export default function SiteShell({ d, fontVars, children }: { d: Dict; fontVars: string; children: React.ReactNode }) {
  const u = d.ui;
  return (
    <html lang={d.lang} dir={d.dir} className={fontVars}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <JsonLd graph={[organization(d), founder(d), website()]} />
      </head>
      <body>
        <a className="skip" href="#main">
          {u.skip}
        </a>
        <div className="progress" data-progress aria-hidden="true" />
        <Nav
          lang={d.lang}
          prefix={d.prefix}
          nav={d.nav}
          quote={d.site.quoteLabel}
          whatsapp={d.site.whatsapp}
          ui={{
            homeAria: u.homeAria,
            openMenu: u.openMenu,
            closeMenu: u.closeMenu,
            primaryNav: u.primaryNav,
            mobileNav: u.mobileNav,
            langSwitch: u.langSwitch,
            langSwitchAria: u.langSwitchAria,
          }}
        />
        <main id="main">{children}</main>
        <Footer d={d} />
        <Motion />
        <Spotlight />
      </body>
    </html>
  );
}
