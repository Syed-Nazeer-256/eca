'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GlassIsland, glassPillClass } from '@/components/ui/glass-island';
import { counterpart, type Lang } from '@/i18n';

const slash = (p: string) => (p.endsWith('/') ? p : `${p}/`);

/**
 * EN | عربي segmented control in the same liquid-glass island as the navbar. The glass pill
 * rests on the current language and slides toward the other on hover. The other language is
 * a plain link: each language has its own root layout, so switching is a full page load,
 * landing on the same page in the other language.
 */
export default function LangToggle({ lang, ariaLabel }: { lang: Lang; ariaLabel: string }) {
  const pathname = slash(usePathname() || '/');
  const list = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<Lang | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const items: Array<{ code: Lang; label: string; name: string; href: string }> = [
    { code: 'en', label: 'EN', name: 'English', href: lang === 'en' ? pathname : counterpart(pathname, 'ar') },
    { code: 'ar', label: 'عربي', name: 'العربية', href: lang === 'ar' ? pathname : counterpart(pathname, 'en') },
  ];
  const highlighted = hovered ?? lang;

  const measure = useCallback(() => {
    const el = list.current?.querySelector<HTMLElement>(`[data-lang="${highlighted}"]`);
    setPill(el ? { x: el.offsetLeft, w: el.offsetWidth } : null);
  }, [highlighted]);

  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  return (
    <nav className="lang" aria-label={ariaLabel}>
      <GlassIsland>
        <ul ref={list} className="lang__list" onMouseLeave={() => setHovered(null)}>
          <span
            className={`${glassPillClass} lang__pill`}
            aria-hidden="true"
            style={pill ? { width: pill.w, transform: `translateX(${pill.x}px)`, opacity: 1 } : { opacity: 0 }}
          />
          {items.map((it) => (
            <li key={it.code}>
              {it.code === lang ? (
                <span data-lang={it.code} lang={it.code} className="lang__item is-on" aria-current="true" title={it.name}>
                  {it.label}
                </span>
              ) : (
                <a
                  href={it.href}
                  data-lang={it.code}
                  lang={it.code}
                  hrefLang={it.code}
                  className="lang__item"
                  title={it.name}
                  aria-label={it.name}
                  onMouseEnter={() => setHovered(it.code)}
                  onFocus={() => setHovered(it.code)}
                  onBlur={() => setHovered(null)}
                >
                  {it.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </GlassIsland>
    </nav>
  );
}
