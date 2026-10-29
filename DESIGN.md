# Expert Contracts redesign v1

Mode: redesign, overhaul. New visual language. Content, route slugs, contact details, social links and imagery preserved from https://expertcontracts.ca/.

Design read: B2B consultancy site for construction, EPC and infrastructure buyers in Saudi Arabia and the GCC, with a dark editorial-technical language, leaning toward Next.js + GSAP + Lenis + plain CSS tokens.

Dials: DESIGN_VARIANCE 7, MOTION_INTENSITY 7, VISUAL_DENSITY 3. Buyers are procurement and commercial directors, so spectacle is capped: no loader, no WebGL, one signature moment.

## Concept card

- Idea: the site reads like a contract. Services are numbered clauses and the firm "seals" the project.
- Metaphor: a signed, stamped contract document.
- Anchor: the 12 numbered service lines on the live site, FIDIC administration, claims and arbitration, and the ISO 9001:2015 stamp.
- Signature: the seal. A ring of service names turns slowly behind the founder at rest (idle), turns further as the hero scrolls away, and the clause ledger counter advances as the visitor reads services 01 to 12.
- Emotion: authority and calm. Nothing wobbles.
- Motion verb: "settle like paper". Things rise through a mask and stop. Eases are power3/expo out. No bounce.
- Screenshot frame: hero with the founder cutout inside the rotating seal, headline left.

## System

| Role | Value |
|---|---|
| ground | #0B1110 |
| surface | #111917 |
| surface-2 | #18221F |
| ink | #ECEFEA |
| muted | #93A099 |
| line | rgba(236,239,234,.14) |
| accent (only one) | #3DB75A, taken from the logo green |
| accent-ink | #06130A |

- Theme: dark, locked for the whole page.
- Shape: interactive elements are pills. Containers are 20px. No other radii.
- Type: Bricolage Grotesque (display, 600 to 800), Geist (body), Geist Mono (numbers and labels). Fluid scale, display tracking -0.035em.
- Grid: 12 columns, 1440 max, 24px gutter.
- Motion language: reveals 0.8 to 1.0s, hovers 0.35s, stagger 0.04s for words.

## Sections and layout families

1. Nav: one line, 68px.
2. Hero: asymmetric split, headline left, founder inside the seal right.
3. Proof: hairline stat row with counters (30+ years, 12 services, 3 offices, 9 volumes published). ISO 9001:2015 was left out: only seen in a small thumbnail on the live site, not verified.
4. Statement: full width scroll-scrubbed word reveal of the founder's vision text.
5. Clause ledger: sticky split. Left panel shows the active clause, right is the list of 12.
6. Why choose: bento with 5 cells for 5 differentiators, mixed fill, image, map.
7. Training: image-led band with two lists.
8. Credentials: the page's single marquee.
9. Contact CTA: oversized type, one intent ("Request a quote"), offices listed as links.
10. Footer.

## Decisions on assumptions

- No testimonials and no client logo wall. Review text and partner logos were not captured, and inventing them is not allowed.
- Portfolio and Blog routes not rebuilt in v1 (not captured). Links omitted from nav, flagged for the owner.
- Service pages use only copy that exists on the live site.

---

## v1.1 changes

Spacing: section padding cut about 50% (158px to 79px at 1440 wide), hero capped at 86dvh so the stats strip shows in the first screen, training image box matched to the collage proportions. Desktop page height 9,134px to about 8,200px.

Motion: nav hides on scroll down and returns on scroll up, reading-progress line, route-change settle, hero stage settles in, backgrounds drift slower than the page, nav backdrop blur removed, ring and marquee promoted to their own GPU layers. Measured 60 fps with no dropped frames before and after in headless Chromium; the dev server is slower than production, so judge smoothness on the built site.

Images: sources moved to assets-src/, responsive WebP variants built by scripts/optimize-images.mjs. Hero image 4.4 MB to 126 KB. LCP 2.6 s to 0.5 s.

SEO, AEO, GEO: per-page canonical, Open Graph and Twitter cards with an image on every page; JSON-LD (Organization/ProfessionalService, Person, WebSite, FAQPage, AboutPage, ContactPage, Service, BreadcrumbList); visible FAQ section mirrored in FAQPage JSON-LD; llms.txt; sitemap.xml; robots.txt; manifest and icons; crawlers get the static page without motion states.

Publish: static export in ./out, _headers (Netlify/Cloudflare) and .htaccess (Apache/cPanel) included, Next.js upgraded to a patched version.

---

## v2.0: "Blueprint to built"

Hero rebuilt as a live Three.js scene (Mengto `threejs-towers` clipping-plane build, `build-threejs-scroll-worlds` single persistent world with scroll as conductor). A procedural tower is drawn as a green blueprint; scrolling through the pinned hero builds it floor by floor at a glowing working level, with the core poured ahead, scaffolding one step ahead and a climbing tower crane that slews at rest. The HUD names the lifecycle stage (real service lines) and the build percentage; the headline rule fills with the same value. At 100% the crane leaves and the windows light: "Delivered on contract". Riyadh coordinates anchor the place.

Also new: founder chapter (seal, portrait, scrubbed vision quote, credentials), Clients & partnerships logo marquee (logos from the live site), draggable globe of the three listed locations (cobe), three client statements from the live site, a working enquiry form that opens WhatsApp or email pre-filled (static-host friendly, nothing stored), odometer stat counters, cursor spotlight on cards.

Rules kept: one GSAP clock (cobe's own loop is the one exception, paused off screen), reduced motion gets a finished-tower poster and a static page, crawlers get the static page, three.js and cobe load lazily.

Measured (production build, Intel UHD iGPU, Chromium): hero scroll 60 fps desktop and mobile (p95 16.8 ms), no horizontal overflow at 390 px, SEO audit clean on all 15 pages.

### v2.0 revisions (owner feedback)

- Crane removed from the hero scene. Scaffolding still marks the working level.
- Hero copy advances with the build in four states, adapted from the live site's own hero slider lines: "Projects that stay on contract." / "Protecting projects through governance." / "Delivering excellence across Saudi Arabia." / "Delivered on contract." The h1 stays the first state; later states are announced only while showing; reduced motion and crawlers see the first state only.
- Navbar rebuilt as the space-portfolio glass island (S:/PortFolio/syedshahidnazeer): floating logo, island with a sliding glass pill, CTA. The pill is a measured CSS transform and the active section an IntersectionObserver, instead of the portfolio's framer-motion and scroll listener, so the site keeps one animation engine.
- Contact form rebuilt as the space-portfolio card form, recoloured: a live "engagement brief" card with an EC seal, per-character entry, a focus frame that follows the field, a flip to the project scope, and a fold-and-seal into an envelope on send, inside React Bits BorderGlow. Sends via WhatsApp or email, nothing stored.
- Measured: frame pacing on this laptop varies run to run (p95 16.7 to 33 ms) with or without the island's blur, so the island was kept as designed. Needs a real-device check.

## v2.1: Arabic

Full Arabic version under /ar/ (home, about, contact, all 12 services), each a real lang="ar" dir="rtl" document via its own root layout; English URLs unchanged. hreflang pairs (en, ar, x-default) on every page and in the sitemap; Arabic FAQ, service and breadcrumb JSON-LD. Noto Kufi Arabic (display) and IBM Plex Sans Arabic (body), loaded on Arabic pages only. Mirrored layout (tower on the left, flipped scrims, arrows and progress), zero letter-spacing and taller line height for Arabic, phones and emails isolated left to right. EN | عربي glass toggle in the navbar, beside the island, on every screen size. Translations are marked where they render someone else's words (testimonials, founder quote). Arabic copy needs native review before launch.
