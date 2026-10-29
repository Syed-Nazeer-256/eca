'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dict } from '@/i18n';

// cobe convention for turning a lat/lon to face the viewer.
const anglesFor = (lat: number, lon: number): [number, number] => [Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];

type Props = { offices: Dict['offices']; ui: Pick<Dict['ui'], 'reachH' | 'reachBody' | 'globeAria'> };

/**
 * Global reach: the three locations the site lists, on a draggable globe.
 * Picking a country turns the globe to it. The globe library loads only when
 * the section nears the viewport. Under reduced motion it is not drawn.
 */
export default function Reach({ offices, ui }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  activeRef.current = active;
  const picked = useRef(false);

  useEffect(() => {
    const c = canvas.current;
    if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    let teardown = () => {};

    const start = async () => {
      const { default: createGlobe } = await import('cobe');
      if (cancelled) return;

      let phi = anglesFor(offices[0].lat, offices[0].lon)[0];
      let theta = 0.3;
      let drag: number | null = null;
      let dragOffset = 0;
      let width = c.offsetWidth;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const markers = () =>
        offices.map((o, i) => ({ location: [o.lat, o.lon] as [number, number], size: i === activeRef.current ? 0.13 : 0.08 }));

      const globe = createGlobe(c, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi,
        theta,
        dark: 1,
        diffuse: 1.3,
        mapSamples: 18000,
        mapBrightness: 4.2,
        baseColor: [0.12, 0.17, 0.15],
        markerColor: [0.24, 0.72, 0.35],
        glowColor: [0.09, 0.16, 0.12],
        markers: markers(),
        onRender: (state) => {
          const o = offices[activeRef.current];
          const [tp, tt] = anglesFor(o.lat, o.lon);
          if (drag === null) {
            if (picked.current) {
              // Ease toward the picked country along the shortest way round.
              let d = (tp - phi) % (Math.PI * 2);
              if (d > Math.PI) d -= Math.PI * 2;
              if (d < -Math.PI) d += Math.PI * 2;
              phi += d * 0.07;
              theta += (tt * 0.6 - theta) * 0.07;
            } else {
              phi += 0.0026; // slow idle turn until someone picks a country
            }
          }
          state.phi = phi + dragOffset;
          state.theta = theta;
          state.width = width * dpr;
          state.height = width * dpr;
          state.markers = markers();
        },
      });
      requestAnimationFrame(() => c.classList.add('is-ready'));

      const onDown = (e: PointerEvent) => {
        drag = e.clientX - dragOffset * 200;
        c.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (drag !== null) dragOffset = (e.clientX - drag) / 200;
      };
      const onUp = () => {
        if (drag === null) return;
        phi += dragOffset;
        dragOffset = 0;
        drag = null;
      };
      c.addEventListener('pointerdown', onDown);
      c.addEventListener('pointermove', onMove);
      c.addEventListener('pointerup', onUp);
      c.addEventListener('pointercancel', onUp);

      const ro = new ResizeObserver(() => (width = c.offsetWidth));
      ro.observe(c);
      // cobe runs its own frame loop; pause it while the globe is off screen.
      const io = new IntersectionObserver(([e]) => globe.toggle(e.isIntersecting));
      io.observe(c);

      teardown = () => {
        io.disconnect();
        ro.disconnect();
        c.removeEventListener('pointerdown', onDown);
        c.removeEventListener('pointermove', onMove);
        c.removeEventListener('pointerup', onUp);
        c.removeEventListener('pointercancel', onUp);
        globe.destroy();
      };
    };

    // Load the globe only when the section is close to the viewport.
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        start();
      },
      { rootMargin: '600px 0px' },
    );
    near.observe(c);

    return () => {
      cancelled = true;
      near.disconnect();
      teardown();
    };
  }, [offices]);

  return (
    <section className="section reach" aria-labelledby="reach-h">
      <div className="wrap reach__grid">
        <div>
          <h2 id="reach-h" className="display" data-split="scroll">
            {ui.reachH}
          </h2>
          <p className="reach__body" data-reveal>
            {ui.reachBody}
          </p>
          <ul className="reach__list" data-reveal>
            {offices.map((o, i) => (
              <li key={o.code} className="reach__item">
                <button
                  type="button"
                  className="reach__btn"
                  aria-pressed={i === active}
                  onClick={() => {
                    picked.current = true;
                    setActive(i);
                  }}
                >
                  {o.country}
                </button>
                <a className="reach__phone ltr" href={o.href}>
                  {o.phone}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="globe" data-reveal>
          <canvas ref={canvas} aria-label={ui.globeAria} role="img" />
        </div>
      </div>
    </section>
  );
}
