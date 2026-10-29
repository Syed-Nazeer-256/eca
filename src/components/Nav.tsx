'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GlassIsland, glassPillClass } from '@/components/ui/glass-island';
import LangToggle from '@/components/LangToggle';
import type { Dict, Lang } from '@/i18n';

type Props = {
  lang: Lang;
  prefix: string;
  nav: Dict['nav'];
  quote: string;
  whatsapp: string;
  ui: Pick<Dict['ui'], 'homeAria' | 'openMenu' | 'closeMenu' | 'primaryNav' | 'mobileNav' | 'langSwitch' | 'langSwitchAria'>;
};

const slash = (p: string) => (p.endsWith('/') ? p : `${p}/`);

/**
 * Floating glass-island navbar, after the space portfolio's island. A glass pill slides
 * under the hovered link and rests on the current one. The portfolio animates the pill
 * with framer-motion and tracks sections with a scroll listener; here it is a measured
 * CSS transform and an IntersectionObserver, so the site keeps one animation engine.
 */
export default function Nav({ lang, prefix, nav, quote, whatsapp, ui }: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [inServices, setInServices] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const pathname = slash(usePathname() || '/');
  const list = useRef<HTMLUListElement>(null);
  const home = slash(prefix || '/');
  const items = nav.map((n) => ({ ...n, href: `${prefix}${n.href}` }));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // On the home page, "Services" is current while the services section holds the middle of the screen.
  useEffect(() => {
    setInServices(false);
    const el = document.getElementById('services');
    if (!el || pathname !== home) return;
    const io = new IntersectionObserver(([e]) => setInServices(e.isIntersecting), { rootMargin: '-45% 0px -50% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname, home]);

  const active = pathname === home ? (inServices ? `${prefix}/#services` : `${prefix}/`) : (items.find((n) => n.href === pathname)?.href ?? null);
  const highlighted = hovered ?? active;

  const measure = useCallback(() => {
    const ul = list.current;
    if (!ul || !highlighted) return setPill(null);
    const a = ul.querySelector<HTMLElement>(`a[data-href="${highlighted}"]`);
    if (!a) return setPill(null);
    setPill({ x: a.offsetLeft, w: a.offsetWidth });
  }, [highlighted]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <header className="nav">
      <div className="nav__bar wrap">
        <Link href={home} className="nav__logo" aria-label={ui.homeAria}>
          <Image src="/img/logo.png" alt="" width={148} height={52} priority />
        </Link>

        <nav className="nav__island" aria-label={ui.primaryNav}>
          <GlassIsland>
            <ul ref={list} className="island__list" onMouseLeave={() => setHovered(null)}>
              <span
                className={`${glassPillClass} island__pill`}
                aria-hidden="true"
                style={pill ? { width: pill.w, transform: `translateX(${pill.x}px)`, opacity: 1 } : { opacity: 0 }}
              />
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-href={item.href}
                    className={`island__link${highlighted === item.href ? ' is-on' : ''}`}
                    aria-current={active === item.href ? (item.href.includes('#') ? 'location' : 'page') : undefined}
                    onMouseEnter={() => setHovered(item.href)}
                    onFocus={() => setHovered(item.href)}
                    onBlur={() => setHovered(null)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </GlassIsland>
        </nav>

        <div className="nav__end">
          <LangToggle lang={lang} ariaLabel={ui.langSwitchAria} />
          <a className="btn btn--sm nav__cta" href={whatsapp} target="_blank" rel="noopener noreferrer" data-magnetic>
            <span className="btn__label">{quote}</span>
          </a>
          <button type="button" className="nav__toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
            <span className="sr-only">{open ? ui.closeMenu : ui.openMenu}</span>
            <span className="nav__bars" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="menu" hidden={!open}>
        <nav aria-label={ui.mobileNav}>
          {items.map((item, i) => (
            <Link key={item.href} href={item.href} className="menu__link" style={{ ['--i' as string]: i }} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <a className="btn" href={whatsapp} target="_blank" rel="noopener noreferrer">
            <span className="btn__label">{quote}</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
