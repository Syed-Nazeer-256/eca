import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import BriefForm from '@/components/BriefForm';
import { breadcrumb, webPage } from '@/lib/schema';
import { pageMeta } from '@/lib/seo';
import { lp, type Dict } from '@/i18n';

export const contactMeta = (d: Dict): Metadata =>
  pageMeta(d, { path: '/contact-us/', title: d.ui.contactMetaTitle, ogTitle: d.ui.contactTitle, description: d.ui.contactDesc });

export default function ContactView({ d }: { d: Dict }) {
  const u = d.ui;
  return (
    <>
      <JsonLd
        graph={[
          webPage(d, 'ContactPage', lp(d, '/contact-us/'), u.contactTitle, u.contactDesc),
          breadcrumb([
            { name: u.breadcrumbHome, path: lp(d, '/') },
            { name: u.contactMetaTitle, path: lp(d, '/contact-us/') },
          ]),
        ]}
      />
      <section className="page-head">
        <div className="wrap">
          <h1 className="display" data-split="load">
            {u.ctaH}
          </h1>
          <p data-intro>{u.ctaLead}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap two">
          <address className="contact-list" data-reveal style={{ fontStyle: 'normal' }}>
            {d.offices.map((o) => (
              <a key={o.code} href={o.href}>
                <span>{o.country}</span>
                <span className="v mono ltr">{o.phone}</span>
              </a>
            ))}
            <a href={`mailto:${d.site.email}`}>
              <span>{u.email}</span>
              <span className="v ltr">{d.site.email}</span>
            </a>
          </address>
          <div data-reveal>
            <BriefForm services={d.services} site={{ whatsapp: d.site.whatsapp, email: d.site.email }} f={u.form} />
          </div>
        </div>
      </section>
    </>
  );
}
