'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Dict } from '@/i18n';

gsap.registerPlugin(ScrollTrigger);

const INTRO = 0.14; // the tower is already a few storeys in when the page opens

type Props = {
  stages: Dict['stages'];
  /** Build values at which each hero copy state takes over. */
  slideAt: number[];
  /** Right-to-left pages frame the tower on the left. */
  mirror?: boolean;
};

/**
 * Mounts the tower scene and wires it to the page: scroll through the pinned hero
 * drives the build, the pointer tilts the camera, the HUD, the headline rule and the
 * hero copy all read the same single value. Three.js loads only here, after first paint.
 */
export default function HeroScene({ stages, slideAt, mirror = false }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    const hero = el?.closest<HTMLElement>('[data-hero]');
    if (!el || !hero) return;
    const pct = hero.querySelector<HTMLElement>('[data-build-pct]');
    const stageN = hero.querySelector<HTMLElement>('[data-stage-n]');
    const stageT = hero.querySelector<HTMLElement>('[data-stage-t]');

    // Reduced motion shows the finished-tower poster, so the HUD reads the finished state too.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const end = stages[stages.length - 1];
      if (pct) pct.textContent = '100';
      if (stageN) stageN.textContent = end.n;
      if (stageT) stageT.textContent = end.t;
      hero.style.setProperty('--build', '1');
      return;
    }
    const complete = new URLSearchParams(window.location.search).has('poster');

    let cancelled = false;
    let teardown = () => {};
    let lastPct = -1;
    let lastStage = -1;
    let lastSlide = 0;
    const slides = Array.from(hero.querySelectorAll<HTMLElement>('[data-slide]'));

    // Masked swap: outgoing words rise out, incoming words rise in (reversed when scrolling back up).
    const showSlide = (next: number) => {
      const prev = lastSlide;
      if (next === prev || !slides[next] || !slides[prev]) return;
      lastSlide = next;
      const dir = next > prev ? 1 : -1;
      const out = slides[prev];
      const inn = slides[next];
      out.classList.remove('is-active');
      inn.classList.add('is-active');
      out.setAttribute('aria-hidden', 'true');
      inn.removeAttribute('aria-hidden');
      gsap.to(out.querySelectorAll('.w'), { y: 0, yPercent: -115 * dir, duration: 0.5, ease: 'power3.in', stagger: 0.02, overwrite: true });
      gsap.to(out.querySelector('.hero__sub'), { opacity: 0, y: -12 * dir, duration: 0.4, ease: 'power2.in', overwrite: true });
      gsap.fromTo(
        inn.querySelectorAll('.w'),
        // y: 0 matters: GSAP reads the CSS start offset as pixels, which would otherwise stay applied.
        { y: 0, yPercent: 115 * dir },
        { y: 0, yPercent: 0, duration: 0.95, ease: 'expo.out', stagger: 0.035, delay: 0.22, overwrite: true },
      );
      gsap.fromTo(
        inn.querySelector('.hero__sub'),
        { opacity: 0, y: 14 * dir },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.42, overwrite: true },
      );
    };

    const onUpdate = (b: number) => {
      const p = Math.round(b * 100);
      if (p !== lastPct) {
        lastPct = p;
        if (pct) pct.textContent = String(p);
        hero.style.setProperty('--build', b.toFixed(3));
      }
      let s = 0;
      for (let i = 0; i < stages.length; i++) if (b >= stages[i].at) s = i;
      let sl = 0;
      for (let i = 0; i < slideAt.length; i++) if (b >= slideAt[i]) sl = i;
      showSlide(sl);
      if (s !== lastStage) {
        lastStage = s;
        if (stageN) stageN.textContent = stages[s].n;
        if (stageT) stageT.textContent = stages[s].t;
        hero.dataset.stage = String(s);
      }
    };

    import('@/lib/tower-scene').then(({ createTowerScene }) => {
      if (cancelled) return;
      const scene = createTowerScene(el, { onUpdate, complete, mirror });
      if (!scene) {
        el.dataset.gl = 'failed';
        return;
      }
      el.dataset.gl = 'on';

      const tick = (time: number, deltaMs: number) => scene.tick(time, deltaMs);
      gsap.ticker.add(tick);

      let st: ScrollTrigger | null = null;
      if (!complete) {
        scene.setTarget(INTRO);
        st = ScrollTrigger.create({
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => scene.setTarget(INTRO + (1 - INTRO) * self.progress),
        });
      }

      const fine = window.matchMedia('(pointer: fine)').matches;
      const onMove = (e: PointerEvent) => scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      if (fine) window.addEventListener('pointermove', onMove, { passive: true });

      // Stop drawing when the hero is off screen.
      const io = new IntersectionObserver(([entry]) => scene.setVisible(entry.isIntersecting), { rootMargin: '100px' });
      io.observe(el);

      teardown = () => {
        io.disconnect();
        if (fine) window.removeEventListener('pointermove', onMove);
        st?.kill();
        gsap.ticker.remove(tick);
        scene.destroy();
        delete el.dataset.gl;
      };
    });

    return () => {
      cancelled = true;
      teardown();
    };
  }, [stages, slideAt, mirror]);

  return <div ref={host} className="hero__gl" aria-hidden="true" />;
}
