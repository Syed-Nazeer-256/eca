import { SITE, SOCIALS, type Service } from '@/data/site';
import { fmt, lp, type Dict } from '@/i18n';

// schema.org JSON-LD builders. Every value comes from content on the live site (or its translation).
// A street address is not published on the live site, so none is included.

const ORG_ID = `${SITE.url}/#organization`;
const FOUNDER_ID = `${SITE.url}/#founder`;
const abs = (path: string) => `${SITE.url}${path}`;

export function organization(d: Dict) {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    description: d.about.firm,
    logo: { '@type': 'ImageObject', url: abs('/img/logo-480.webp'), width: 480, height: 172 },
    image: abs('/opengraph-image'),
    email: SITE.email,
    telephone: '+966535946638',
    address: { '@type': 'PostalAddress', addressLocality: 'Riyadh', addressCountry: 'SA' },
    areaServed: [{ '@type': 'Country', name: 'Saudi Arabia' }, 'Gulf Cooperation Council (GCC)'],
    knowsLanguage: ['en', 'ar'],
    founder: { '@id': FOUNDER_ID },
    sameAs: SOCIALS.map((s) => s.href),
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'sales', telephone: '+966535946638', areaServed: 'SA', availableLanguage: ['English', 'Arabic'] },
      { '@type': 'ContactPoint', contactType: 'sales', telephone: '+16477678118', areaServed: 'CA', availableLanguage: 'English' },
      { '@type': 'ContactPoint', contactType: 'sales', telephone: '+917893247974', areaServed: 'IN', availableLanguage: 'English' },
      { '@type': 'ContactPoint', contactType: 'customer support', email: SITE.email, availableLanguage: ['English', 'Arabic'] },
    ],
    knowsAbout: d.services.map((s) => s.title),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Expert Contracts services',
      itemListElement: d.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, url: abs(lp(d, `/${s.slug}/`)) },
      })),
    },
  };
}

export function founder(d: Dict) {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: 'Shaik Faiazuddin',
    alternateName: d.lang === 'ar' ? d.founder.name : undefined,
    jobTitle: 'Founder',
    honorificSuffix: d.founder.letters.join(', '),
    image: abs('/img/founder-800.webp'),
    worksFor: { '@id': ORG_ID },
    description: d.founder.vision,
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: ['en', 'ar'],
    publisher: { '@id': ORG_ID },
  };
}

export function faqPage(d: Dict) {
  return {
    '@type': 'FAQPage',
    inLanguage: d.lang,
    mainEntity: d.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumb(items: Array<{ name: string; path: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function service(d: Dict, s: Service) {
  return {
    '@type': 'Service',
    name: s.title,
    url: abs(lp(d, `/${s.slug}/`)),
    serviceType: s.title,
    inLanguage: d.lang,
    description: s.blurb ?? fmt(d.ui.serviceDescFallback, { title: s.title }),
    provider: { '@id': ORG_ID },
    areaServed: [{ '@type': 'Country', name: 'Saudi Arabia' }, 'Gulf Cooperation Council (GCC)'],
  };
}

export function webPage(d: Dict, type: 'WebPage' | 'AboutPage' | 'ContactPage', path: string, name: string, description: string) {
  return {
    '@type': type,
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description,
    inLanguage: d.lang,
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': ORG_ID },
  };
}
