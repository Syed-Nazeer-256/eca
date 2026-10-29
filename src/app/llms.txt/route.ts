import { ABOUT, FAQ, FOUNDER, OFFICES, SERVICES, SITE } from '@/data/site';

export const dynamic = 'force-static';

// Plain-text summary for AI answer engines (llms.txt convention). Facts only, all from the site.
export function GET() {
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${ABOUT.firm}`,
    '',
    '## Key facts',
    '',
    '- Based in Riyadh, Saudi Arabia. Contact numbers listed for Saudi Arabia, Canada and India.',
    `- Founder: ${FOUNDER.name}, 30+ years of international industry experience. Credentials: ${FOUNDER.letters.join(', ')}.`,
    '- Sectors: construction, infrastructure, EPC, oil & gas, and engineering.',
    '- Focus: Project Management Consultancy (PMC), FIDIC contracts administration, claims and dispute resolution, procurement, cost management, corporate training and manpower solutions.',
    `- Request a quote: ${SITE.whatsapp}`,
    `- Email: ${SITE.email}`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE.url}/): Overview of Expert Contracts and its services.`,
    `- [About us](${SITE.url}/about-us/): The firm, its founder and credentials.`,
    `- [Contact us](${SITE.url}/contact-us/): Phone numbers for Saudi Arabia, Canada and India, and email.`,
    '',
    '## Arabic version (النسخة العربية)',
    '',
    `- [الصفحة الرئيسية](${SITE.url}/ar/)`,
    `- [من نحن](${SITE.url}/ar/about-us/)`,
    `- [تواصل معنا](${SITE.url}/ar/contact-us/)`,
    '- Every service page also exists in Arabic under /ar/<service>/.',
    '',
    '## Services',
    '',
    ...SERVICES.map((s) => `- [${s.title}](${SITE.url}/${s.slug}/)${s.blurb ? `: ${s.blurb}` : ''}`),
    '',
    '## Contact',
    '',
    ...OFFICES.map((o) => `- ${o.country}: ${o.phone}`),
    `- Email: ${SITE.email}`,
    '',
    '## Frequently asked questions',
    '',
    ...FAQ.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
  ];
  return new Response(lines.join('\n'), { headers: { 'content-type': 'text/plain; charset=utf-8' } });
}
