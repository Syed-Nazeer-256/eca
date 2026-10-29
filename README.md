# Expert Contracts website, v2.0

Static site (Next.js export). No server needed. Build once, upload the `out/` folder to any host.

## Run and build

```bash
npm install
npm run dev        # http://localhost:4400 (dev mode is slower than production)
npm run build      # writes the finished site to ./out
npm run serve      # preview ./out at http://localhost:4400
```

Fonts are downloaded at build time, so the machine that builds needs internet access.

## Publish

Set the final domain first (no trailing slash). It feeds canonical tags, the sitemap, Open Graph and structured data:

```bash
NEXT_PUBLIC_SITE_URL=https://expertcontracts.ca npm run build
```

Then upload the **contents of `out/`**, including the hidden `.htaccess` and `_headers` files:

| Host | How |
|---|---|
| Netlify | Drag `out/` into the Netlify dashboard, or connect the repo with build command `npm run build` and publish directory `out`. `_headers` is applied automatically. |
| Cloudflare Pages | Same settings as Netlify. `_headers` is applied automatically. |
| Vercel | Import the repo. Framework Next.js detects the export. |
| cPanel or Apache | Upload `out/` contents to `public_html`. `.htaccess` forces HTTPS, trailing slashes and caching. |

## Before you go live

1. **Old URLs.** The live site is currently WordPress. These old paths do not exist here and will return 404: `/portfolio/`, `/blog/`, `/shop/`, `/cart/`, `/checkout/`, `/compare/`, and any blog posts. Check the old site's sitemap, then decide per URL whether to rebuild the page or 301 redirect it. Do this before switching DNS, or indexed pages lose their rankings.
2. **Testimonials and logos** are taken from the live site. Confirm with the owner that the three reviewer names (Davis Jordan, Cleveland Des, Delphia Jocelin) are real people, as they read like template names, and whether Aramco, SABIC and Qatar Petroleum are firm clients (the live site lists them under "Clients & Partnerships") or the founder's past employers (the founder's own statement). Adjust the "Clients & partnerships" label if needed.
3. **Service pages.** Only 4 of the 12 have descriptions, because that is all the old site stated. Add real copy for the other 8 in `src/data/site.ts` (`blurb` and `points`). Thin pages rank poorly.
4. **Facts to confirm** with the owner: ISO 9001:2015 (seen on the old site, not verified, so left out), the street address (none published, so none in structured data), and the "3 locations" wording.
5. **Images** are mostly stock or AI-generated. Real project photography will lift the site more than any code change.

## After going live

1. Add the site in Google Search Console and Bing Webmaster Tools, then submit `https://expertcontracts.ca/sitemap.xml`.
2. Run the live home page through the Google Rich Results Test (FAQ and organization data) and fix anything it flags.
3. Share a link in LinkedIn or WhatsApp to confirm the preview card shows.
4. Confirm `https://expertcontracts.ca/llms.txt` loads.
5. Add analytics if wanted. None is installed.

## What is built in for search, AI answers and local relevance

| Layer | What |
|---|---|
| SEO | Unique title and description per page, canonical URLs, sitemap, robots, one H1 per page, alt text, Open Graph and Twitter cards on every page, fast LCP, mobile layout |
| Structured data | Organization/ProfessionalService, founder Person, WebSite, FAQPage, AboutPage, ContactPage, Service per service, BreadcrumbList. All values come from the old site's content. |
| AEO (answer engines) | Visible FAQ with direct, factual answers, mirrored in FAQPage markup |
| GEO (generative engines) | `llms.txt` summary, consistent business facts (name, city, phones, email, founder) across every page and the markup, open crawler access in `robots.txt` |

## Project map

| Path | Purpose |
|---|---|
| `src/data/site.ts` | All copy, services, FAQ, contact details. Edit here first. |
| `src/lib/schema.ts` | JSON-LD builders |
| `src/lib/seo.ts` | Per-page metadata helper |
| `src/components/Motion.tsx` | The single animation engine (GSAP + Lenis) |
| `scripts/optimize-images.mjs` | Rebuilds `public/img/*.webp` from `assets-src/*.png` (`npm run images`) |
| `src/lib/image-loader.ts` | Must list the same widths as the script |
| `DESIGN.md` | Concept, system and change log |
