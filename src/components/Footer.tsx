import Image from 'next/image';
import Link from 'next/link';
import { lp, type Dict } from '@/i18n';
import { SOCIALS } from '@/data/site';

export default function Footer({ d }: { d: Dict }) {
  const u = d.ui;
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <span className="footer__chip">
            <Image src="/img/logo.png" alt="Expert Contracts" width={132} height={46} />
          </span>
          <p>{u.footerBlurb}</p>
          <ul className="footer__social" aria-label={u.socialAria}>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__col" aria-label={u.footerServices}>
          <h2>{u.footerServices}</h2>
          <ul>
            {d.services.map((s) => (
              <li key={s.slug}>
                <Link href={lp(d, `/${s.slug}/`)}>{s.title}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label={u.footerLinks}>
          <h2>{u.footerLinks}</h2>
          <ul>
            {d.nav.map((n) => (
              <li key={n.href}>
                <Link href={lp(d, n.href)}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2>{u.footerContact}</h2>
          <address>
            <ul>
              {d.offices.map((o) => (
                <li key={o.code}>
                  <a href={o.href}>
                    <span className="mono">{o.code}</span> <bdi className="ltr">{o.phone}</bdi>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${d.site.email}`} className="ltr">
                  {d.site.email}
                </a>
              </li>
            </ul>
          </address>
        </div>
      </div>
      <div className="wrap footer__legal">
        <small>
          &copy; {new Date().getFullYear()} Expert Contracts. {u.rights}
        </small>
      </div>
    </footer>
  );
}
