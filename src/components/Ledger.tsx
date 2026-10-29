'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Service } from '@/data/site';

/**
 * Clause ledger. The list is the content; the left panel mirrors whichever
 * clause is centred. IntersectionObserver only, no scroll listeners.
 */
export default function Ledger({ items, prefix, labels }: { items: Service[]; prefix: string; labels: { view: string; of: string } }) {
  const [active, setActive] = useState(0);
  const rows = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: '-42% 0px -48% 0px', threshold: 0 },
    );
    rows.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const cur = items[active];

  return (
    <div className="ledger">
      <aside className="ledger__panel" aria-live="polite">
        <div className="ledger__count" aria-hidden="true">
          <span key={cur.n} className="ledger__num">
            {cur.n}
          </span>
          <span className="ledger__of">{labels.of}</span>
        </div>
        <h3 key={`t-${cur.n}`} className="ledger__title">
          {cur.title}
        </h3>
        {cur.blurb && (
          <p key={`b-${cur.n}`} className="ledger__blurb">
            {cur.blurb}
          </p>
        )}
        {cur.points && (
          <ul key={`p-${cur.n}`} className="ledger__points">
            {cur.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
        <Link href={`${prefix}/${cur.slug}/`} className="btn btn--ghost" data-magnetic>
          <span className="btn__label">{labels.view}</span>
        </Link>
      </aside>

      <ol className="ledger__list">
        {items.map((s, i) => (
          <li
            key={s.slug}
            data-i={i}
            ref={(el) => {
              rows.current[i] = el;
            }}
            className={`clause${i === active ? ' is-active' : ''}`}
          >
            <Link href={`${prefix}/${s.slug}/`} className="clause__link">
              <span className="clause__n">{s.n}</span>
              <span className="clause__t">{s.title}</span>
              <span className="clause__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
            {s.blurb && <p className="clause__m">{s.blurb}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
