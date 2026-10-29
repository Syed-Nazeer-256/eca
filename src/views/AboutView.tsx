import type { Metadata } from 'next';
import Image from 'next/image';
import JsonLd from '@/components/JsonLd';
import { breadcrumb, webPage } from '@/lib/schema';
import { pageMeta } from '@/lib/seo';
import { lp, type Dict } from '@/i18n';

export const aboutMeta = (d: Dict): Metadata =>
  pageMeta(d, { path: '/about-us/', title: d.ui.aboutMetaTitle, ogTitle: d.ui.aboutTitle, description: d.ui.aboutDesc });

export default function AboutView({ d }: { d: Dict }) {
  const u = d.ui;
  return (
    <>
      <JsonLd
        graph={[
          webPage(d, 'AboutPage', lp(d, '/about-us/'), u.aboutTitle, u.aboutDesc),
          breadcrumb([
            { name: u.breadcrumbHome, path: lp(d, '/') },
            { name: u.aboutMetaTitle, path: lp(d, '/about-us/') },
          ]),
        ]}
      />
      <section className="page-head">
        <div className="wrap">
          <h1 className="display" data-split="load">
            {u.aboutTitle}
          </h1>
          <p data-intro>{d.about.committed}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap two">
          <div className="prose" data-reveal>
            <p>{d.about.firm}</p>
            <p>{d.founder.vision}</p>
            {u.translatedNote && <p className="translated">{u.translatedNote}</p>}
            <ul className="letters" aria-label={u.credsAria}>
              {d.founder.letters.map((l) => (
                <li key={l} className="ltr">
                  {l}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: 32 }}>
              <a className="btn" href={d.site.whatsapp} target="_blank" rel="noopener noreferrer" data-magnetic>
                <span className="btn__label">{d.site.quoteLabel}</span>
              </a>
            </p>
          </div>
          <div data-reveal>
            <Image
              src="/img/founder.png"
              alt={u.aboutFounderAlt}
              width={1787}
              height={2560}
              sizes="(max-width: 900px) 80vw, 40vw"
              style={{ width: '100%', height: 'auto', maxWidth: 520, marginInline: 'auto' }}
            />
            <ul className="pills" aria-label={u.backgroundAria} style={{ marginTop: 24 }}>
              {d.founder.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
