import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { breadcrumb, service, webPage } from '@/lib/schema';
import { pageMeta } from '@/lib/seo';
import { fmt, lp, type Dict } from '@/i18n';
import { SERVICES } from '@/data/site';

export const serviceParams = () => SERVICES.map((s) => ({ slug: s.slug }));

const describe = (d: Dict, title: string, blurb?: string) => blurb ?? fmt(d.ui.serviceDescFallback, { title });

export function serviceMeta(d: Dict, slug: string): Metadata {
  const s = d.services.find((x) => x.slug === slug);
  if (!s) return {};
  return pageMeta(d, { path: `/${s.slug}/`, title: s.short ?? s.title, ogTitle: s.title, description: describe(d, s.title, s.blurb) });
}

export default function ServiceView({ d, slug }: { d: Dict; slug: string }) {
  const i = d.services.findIndex((s) => s.slug === slug);
  if (i < 0) notFound();
  const u = d.ui;
  const s = d.services[i];
  const path = lp(d, `/${s.slug}/`);
  const prev = d.services[(i + d.services.length - 1) % d.services.length];
  const next = d.services[(i + 1) % d.services.length];
  const D = d.diff;

  return (
    <>
      <JsonLd
        graph={[
          webPage(d, 'WebPage', path, s.title, describe(d, s.title, s.blurb)),
          service(d, s),
          breadcrumb([
            { name: u.breadcrumbHome, path: lp(d, '/') },
            { name: u.breadcrumbServices, path: lp(d, '/#services') },
            { name: s.title, path },
          ]),
        ]}
      />
      <section className="page-head">
        <div className="wrap">
          <Link href={lp(d, '/#services')} className="crumb">
            {u.backArrow} {u.allServices}
          </Link>
          <p className="label" data-intro style={{ marginBottom: 20 }}>
            {fmt(u.serviceOf, { n: s.n })}
          </p>
          <h1 className="display" data-split="load">
            {s.title}
          </h1>
          {s.blurb && <p data-intro>{s.blurb}</p>}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {s.points && (
            <ul className="pills" aria-label={u.scopeAria} data-reveal style={{ marginTop: 0 }}>
              {s.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          <div className="cta__actions" data-reveal>
            <a className="btn" href={d.site.whatsapp} target="_blank" rel="noopener noreferrer" data-magnetic>
              <span className="btn__label">{d.site.quoteLabel}</span>
            </a>
          </div>

          <div className="related" data-reveal>
            <h2>{u.whyEC}</h2>
            <div className="facts">
              {[D.years, D.pmc, D.gcc].map((f) => (
                <article className="fact" key={f.title}>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </div>

          <nav className="pn" aria-label={u.otherServices}>
            <Link href={lp(d, `/${prev.slug}/`)}>
              <span className="label">{u.prev}</span>
              <span className="pn__t">{prev.title}</span>
            </Link>
            <Link href={lp(d, `/${next.slug}/`)}>
              <span className="label">{u.next}</span>
              <span className="pn__t">{next.title}</span>
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
