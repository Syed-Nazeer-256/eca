// All copy here comes from https://expertcontracts.ca/ (captured 2026-10-29).
// Anything not on the live site is intentionally absent, not invented.

export const SITE = {
  name: 'Expert Contracts',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://expertcontracts.ca',
  whatsapp: 'https://wa.me/966535946638?text=Request%20a%20Quote',
  email: 'info@expertcontracts.ca',
  quoteLabel: 'Request a quote',
};

export const OFFICES = [
  { country: 'Saudi Arabia', code: 'KSA', phone: '+966 535 946 638', href: 'https://wa.me/966535946638', lat: 23.89, lon: 45.08 },
  { country: 'Canada', code: 'CA', phone: '+1 647 767 8118', href: 'tel:+16477678118', lat: 56.13, lon: -106.35 },
  { country: 'India', code: 'IN', phone: '+91 789 324 7974', href: 'tel:+917893247974', lat: 20.59, lon: 78.96 },
];

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/expert-contracts' },
  { label: 'YouTube', href: 'https://www.youtube.com/@ExpertContracts' },
  { label: 'Instagram', href: 'https://www.instagram.com/expert_contracts/' },
  { label: 'Facebook', href: 'https://www.facebook.com/ExpertContracts' },
];

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'About us', href: '/about-us/' },
  { label: 'Services', href: '/#services' },
  { label: 'Contact us', href: '/contact-us/' },
];

export type Service = {
  n: string;
  slug: string;
  title: string;
  /** Shorter title for search results when the full title would be truncated. */
  short?: string;
  blurb?: string;
  points?: string[];
};

// Titles and slugs: the live site's "Our Services" menu, in its original order.
// Blurbs and points: only where the live site's service cards state them.
export const SERVICES: Service[] = [
  { n: '01', slug: 'engineering-design-services', title: 'Engineering Design & Consultancy Services' },
  {
    n: '02',
    slug: 'project-management-pmc-services',
    title: 'Project Management & PMC Services',
    blurb: 'Professional PMC services supporting successful project delivery across construction and infrastructure sectors.',
  },
  { n: '03', slug: 'project-planning-scheduling-controls', title: 'Project Planning, Scheduling & Controls' },
  {
    n: '04',
    slug: 'contracts-management-administration',
    title: 'Contracts Management & Administration',
    blurb:
      'We help organizations reduce project risks, strengthen contractual control, and improve project delivery through expert FIDIC administration, claims management, tendering support, and dispute resolution services.',
    points: [
      'FIDIC Contracts Administration',
      'Tendering & Procurement Support',
      'EOT & Construction Claims',
      'Contract Lifecycle Management',
      'Arbitration & ADR Support',
    ],
  },
  { n: '05', slug: 'trading-contracting-services', title: 'Trading & Contracting Services' },
  {
    n: '06',
    slug: 'procurement-supply-chain-management',
    title: 'Procurement & Supply Chain Management',
    blurb: 'Efficient procurement strategies and supply chain optimization for construction and industrial projects.',
  },
  {
    n: '07',
    slug: 'estimating-costing-cost-management',
    title: 'Estimating, Costing & Cost Management',
    blurb: 'Accurate cost estimation and financial forecasting services for improved project performance.',
  },
  { n: '08', slug: 'arbitration-alternative-dispute-resolution', title: 'Arbitration & Alternative Dispute Resolution (ADR)', short: 'Arbitration & ADR' },
  { n: '09', slug: 'construction-claims-management', title: 'Construction Claims Management, Analysis & Resolution', short: 'Construction Claims Management' },
  { n: '10', slug: 'risk-analysis-management', title: 'Risk Analysis & Management' },
  { n: '11', slug: 'bim-modeling-services', title: 'Building Information Modeling (BIM) Services' },
  { n: '12', slug: 'value-engineering-services', title: 'Value Engineering Services' },
];

export const DIFFERENTIATORS = {
  years: {
    title: '30+ Years of International Industry Experience',
    body: 'Extensive expertise across EPC, infrastructure, industrial, commercial, and mega-project environments.',
  },
  pmc: {
    title: 'PMC & Contracts Specialists',
    body: 'Comprehensive project and commercial consultancy solutions from project initiation to closeout.',
  },
  manpower: {
    title: 'Manpower Solution',
    body: 'We bridge the talent gap by sourcing highly qualified professionals from our extensive global database, ensuring your project has the right expertise at the right time.',
  },
  training: {
    title: 'Corporate Training Solutions',
    body: 'Industry-focused training programs designed for engineering, construction, and commercial professionals.',
  },
  gcc: {
    title: 'Saudi Arabia & GCC Market Expertise',
    body: 'Strong understanding of regional regulations, project environments, procurement strategies, and contract frameworks.',
  },
};

export const TRAINING = {
  headline: 'Empowering Engineering & Construction Professionals',
  body: 'Expert Contract Training Consultancy delivers internationally aligned corporate training programs in project management, contracts management, procurement, claims, leadership, and commercial management.',
  formats: ['Corporate Workshops', 'Executive Seminars', 'Online Training', 'Classroom Program', 'Customized In-House Training'],
  benefits: ['Practical Industry Knowledge', 'Real-World Case Studies', 'International Best Practices', 'Professional Career Development'],
  tracks: ['Leadership & Management', 'Business & Professional Development', 'Commercial & Contracts', 'Project & Construction'],
};

export const FOUNDER = {
  name: 'Shaik Faiazuddin',
  vision:
    'After serving prestigious organizations including Aramco, SABIC, and Qatar Petroleum, and earning professional credentials such as MRICS, MICCP, MCIArb, LL.M, and PMP, I am proud to launch Expert Contracts Training & Consultancy Services.',
  credentials: [
    'Multiple International Affiliations',
    'Published Author (9-Volume Books)',
    'Executive Education Specialist',
    'Training & Curriculum Expert',
    'Globally Certified Lead Arbitrator',
  ],
  letters: ['MRICS', 'MICCP', 'MCIArb', 'LL.M', 'PMP'],
};

export const ABOUT = {
  committed:
    'We are committed to delivering practical, results-driven solutions aligned with international best practices and the growing demands of Saudi Arabia’s Vision 2030 infrastructure and development initiatives.',
  firm:
    'Expert Contract is a leading Project Management Consultancy (PMC) and Training Consultancy based in Riyadh, Saudi Arabia, providing integrated project, contracts, commercial, procurement, and professional development solutions across the construction, infrastructure, EPC, oil & gas, and engineering sectors.',
  trusted: 'We are a trusted partner delivering end-to-end project and contracts solutions across construction, infrastructure, and EPC sectors.',
};

export function serviceBySlug(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

// Answer-first Q&A for the visible FAQ section and FAQPage JSON-LD. Every answer restates site copy.
export const FAQ: Array<{ q: string; a: string }> = [
  { q: 'What is Expert Contracts?', a: ABOUT.firm },
  {
    q: 'Which services does Expert Contracts provide?',
    a: `Expert Contracts provides twelve service lines: ${SERVICES.map((s) => s.title).join('; ')}.`,
  },
  {
    q: 'Does Expert Contracts handle FIDIC contracts and construction claims?',
    a: 'Yes. Expert Contracts helps organizations reduce project risks, strengthen contractual control, and improve project delivery through expert FIDIC administration, claims management, tendering support, and dispute resolution services.',
  },
  {
    q: 'Where is Expert Contracts based?',
    a: 'Expert Contracts is based in Riyadh, Saudi Arabia. It lists Saudi Arabia, Canada and India as locations, and states strong expertise in the Saudi Arabia and GCC market, including regional regulations, project environments, procurement strategies, and contract frameworks.',
  },
  {
    q: 'Who founded Expert Contracts?',
    a: 'Expert Contracts was founded by Shaik Faiazuddin, who has more than 30 years of international industry experience. He previously served organizations including Aramco, SABIC, and Qatar Petroleum, and has earned professional credentials such as MRICS, MICCP, MCIArb, LL.M, and PMP.',
  },
  {
    q: 'Does Expert Contracts offer corporate training?',
    a: `Yes. ${TRAINING.body} Formats include ${TRAINING.formats.join(', ')}.`,
  },
  {
    q: 'How do I request a quote?',
    a: 'Message Expert Contracts on WhatsApp at +966 535 946 638 or email info@expertcontracts.ca to request a bespoke consultancy proposal.',
  },
];

// Hero build stages: real service lines in project-lifecycle order, keyed to build progress (0..1).
// Globe markers sit on country centroids because the site lists countries, not street addresses.
export const STAGES: Array<{ at: number; n: string; t: string }> = [
  { at: 0, n: '01', t: 'Engineering design' },
  { at: 0.17, n: '02', t: 'Project management (PMC)' },
  { at: 0.34, n: '03', t: 'Planning & controls' },
  { at: 0.51, n: '06', t: 'Procurement' },
  { at: 0.68, n: '04', t: 'FIDIC contracts' },
  { at: 0.85, n: '07', t: 'Cost management' },
  { at: 0.985, n: '12', t: 'Delivered on contract' },
];

// "Clients & Partnerships" logos as published on the live site. Names read from the logo artwork.
export const LOGOS: Array<{ file: string; name: string; w: number; h: number }> = [
  { file: 'aramco', name: 'Saudi Aramco', w: 428, h: 118 },
  { file: 'sabic', name: 'SABIC', w: 160, h: 120 },
  { file: 'qatar-petroleum', name: 'Qatar Petroleum', w: 336, h: 120 },
  { file: 'bechtel', name: 'Bechtel', w: 56, h: 48 },
  { file: 'mcdermott', name: 'McDermott', w: 216, h: 120 },
  { file: 'orx', name: 'ORYX GTL', w: 240, h: 120 },
  { file: 'sasref', name: 'SASREF', w: 88, h: 29 },
  { file: 'picture1', name: 'J&P', w: 75, h: 38 },
  { file: 'image3', name: 'Skystar Contracting', w: 99, h: 36 },
  { file: 'image24', name: 'Kingdom Sons', w: 138, h: 52 },
  { file: 'wa0010', name: 'Prestige Solutions', w: 103, h: 46 },
  { file: 'rdsa', name: 'Parlee & Company', w: 57, h: 45 },
  { file: 'gm', name: 'GM', w: 63, h: 65 },
];

// Client statements as published on the live site. Roles are not given there; all three describe courses.
export const TESTIMONIALS: Array<{ quote: string; name: string; role: string }> = [
  {
    quote:
      'The Contract Management course from Expert Contracts was a turning point for our procurement team. It gave us the tools to minimize risk, strengthen supplier relationships, and negotiate more confidently. The real-world case studies and practical tools were exactly what we needed.',
    name: 'Davis Jordan',
    role: 'Course participant',
  },
  {
    quote:
      'Expert Contracts delivered an exceptional training program that was both informative and engaging. The instructors clearly understood the legal landscape and made complex concepts easy to grasp. Our contract oversight process has improved dramatically since attending.',
    name: 'Cleveland Des',
    role: 'Course participant',
  },
  {
    quote:
      'As a student, I used to find contracts intimidating. Expert Contracts made everything accessible and practical. Now I feel confident reviewing terms, managing obligations, and protecting my business interests. This course is a must for any entrepreneur.',
    name: 'Delphia Jocelin',
    role: 'Course participant',
  },
];

export const HQ = { city: 'Riyadh', coords: '24.71° N, 46.68° E' };

// Hero copy that advances with the build. Headlines adapt the live site's own hero slider lines;
// sub-lines restate live-site copy. 'at' is the build value (0..1) where each state takes over.
export const HERO_SLIDES: Array<{ at: number; a: string; b: string; sub: string }> = [
  {
    at: 0,
    a: 'Projects that',
    b: 'stay on contract.',
    sub: 'Project management consultancy, FIDIC contracts and claims expertise for construction and infrastructure across Saudi Arabia and the GCC.',
  },
  {
    at: 0.24,
    a: 'Protecting projects',
    b: 'through governance.',
    sub: 'FIDIC administration, claims management, tendering support and dispute resolution that strengthen contractual control.',
  },
  {
    at: 0.52,
    a: 'Delivering excellence',
    b: 'across Saudi Arabia.',
    sub: 'Practical, results-driven solutions aligned with Saudi Arabia\u2019s Vision 2030 infrastructure and development initiatives.',
  },
  {
    at: 0.93,
    a: 'Delivered',
    b: 'on contract.',
    sub: '30+ years of international experience across EPC, infrastructure, industrial and mega-project environments.',
  },
];
