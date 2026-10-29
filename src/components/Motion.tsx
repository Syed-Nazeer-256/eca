'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const EASE = 'power3.out';

/** Split an element's text into masked words. A visually hidden copy keeps the accessible text,
 *  which also works when the split element is a span inside a heading. */
function splitWords(el: HTMLElement): () => void {
  const original = el.innerHTML;
  const text = (el.textContent ?? '').trim();
  const safe = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  el.innerHTML = `<span class="sr-only">${safe(text)}</span>` + text
    .split(/(\s+)/)
    .map((part) =>
      part.trim()
        ? `<span class="w-mask" aria-hidden="true"><span class="w">${safe(part)}</span></span>`
        : ' ',
    )
    .join('');
  el.classList.add('is-split');
  return () => {
    el.innerHTML = original;
    el.classList.remove('is-split');
  };
}

/** The one motion clock: Lenis and every tween run off the GSAP ticker. */
export default function Motion() {
  const pathname = usePathname();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Crawlers and speed-test bots get the static page: real numbers in the text, nothing hidden.
    const bot = /bot|crawl|spider|lighthouse|pagespeed|gtmetrix|prerender/i.test(navigator.userAgent);
    (window as unknown as { __motionReady?: boolean }).__motionReady = true;

    if (reduce || bot) {
      root.classList.remove('has-motion');
      return;
    }
    root.classList.add('has-motion');

    const lenis = new Lenis({ lerp: 0.09, anchors: true });

    // The bar tucks away on the way down and returns on the way up, giving content the full screen.
    let hidden = false;
    const onScroll = (l: Lenis) => {
      ScrollTrigger.update();
      const hide = l.scroll > 140 && l.direction === 1;
      const show = l.scroll <= 140 || l.direction === -1;
      if (hide && !hidden) {
        hidden = true;
        root.dataset.nav = 'hidden';
      } else if (show && hidden) {
        hidden = false;
        delete root.dataset.nav;
      }
    };
    lenis.on('scroll', onScroll);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const undo: Array<() => void> = [];
    const ctx = gsap.context(() => {
      // Route change: settle the new page in, from the top.
      if (prevPath.current !== null && prevPath.current !== pathname) {
        lenis.scrollTo(0, { immediate: true });
        gsap.fromTo('#main', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75, ease: EASE, clearProps: 'transform,opacity' });
      }
      prevPath.current = pathname;

      // Hero intro: headline rises through masks, supporting items follow, the stage settles in.
      document.querySelectorAll<HTMLElement>('[data-split="load"]').forEach((el, i) => {
        undo.push(splitWords(el));
        gsap.fromTo(el.querySelectorAll('.w'), { yPercent: 115 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06, delay: 0.15 + i * 0.12 });
      });
      gsap.fromTo(
        '[data-intro]:not([data-intro="stage"])',
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: EASE, stagger: 0.1, delay: 0.55 },
      );

      // Section headings: masked word reveal on scroll.
      document.querySelectorAll<HTMLElement>('[data-split="scroll"]').forEach((el) => {
        undo.push(splitWords(el));
        gsap.fromTo(
          el.querySelectorAll('.w'),
          { yPercent: 115 },
          { yPercent: 0, duration: 0.85, ease: EASE, stagger: 0.035, scrollTrigger: { trigger: el, start: 'top 88%', once: true } },
        );
      });

      // Statement: words light up as the visitor reads.
      document.querySelectorAll<HTMLElement>('[data-scrub]').forEach((el) => {
        undo.push(splitWords(el));
        const words = el.querySelectorAll('.w');
        el.querySelectorAll<HTMLElement>('.w-mask').forEach((m) => (m.style.overflow = 'visible'));
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          { opacity: 1, ease: 'none', stagger: 0.5, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 52%', scrub: 0.8 } },
        );
      });

      // Generic reveals, batched so a row enters together.
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: EASE, stagger: 0.08, overwrite: true }),
      });

      // Odometer counters: each digit is a 0-9 strip that rolls to its value.
      document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
        const original = el.innerHTML;
        const value = el.dataset.count ?? el.textContent ?? '';
        const strip = Array.from({ length: 20 }, (_, d) => `<span>${d % 10}</span>`).join('');
        el.innerHTML =
          `<span class="sr-only">${value}</span>` +
          value
            .split('')
            .map((ch) => (/\d/.test(ch) ? `<span class="odo" aria-hidden="true"><span class="odo__col">${strip}</span></span>` : `<span aria-hidden="true">${ch}</span>`))
            .join('');
        undo.push(() => (el.innerHTML = original));
        const cols = el.querySelectorAll<HTMLElement>('.odo__col');
        const digits = value.replace(/\D/g, '').split('').map(Number);
        cols.forEach((c, i) => {
          gsap.fromTo(
            c,
            { yPercent: 0 },
            { yPercent: -5 * (10 + digits[i]), duration: 1.8 + i * 0.25, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 94%', once: true } },
          );
        });
      });

      // Depth: backgrounds drift slower than the page. Scaled up so edges never show.
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6, scale: 1.12 },
          { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
      document.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -3 },
          { yPercent: 3, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });

      // Reading progress.
      gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

      // Signature: the seal. Idle turn on the clock plus extra turn driven by scroll.
      gsap.to('[data-seal-idle]', { rotation: 360, duration: 70, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });
      if (document.querySelector('[data-founder]')) {
        gsap.fromTo(
          '[data-seal-scroll]',
          { rotation: -40, scale: 0.92 },
          { rotation: 100, scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-founder]', start: 'top bottom', end: 'bottom top', scrub: 0.8 } },
        );
      }

      // Magnetic primary targets, fine pointers only.
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
          const move = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener('pointermove', move);
          el.addEventListener('pointerleave', leave);
          undo.push(() => {
            el.removeEventListener('pointermove', move);
            el.removeEventListener('pointerleave', leave);
          });
        });
      }
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);

    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
      undo.forEach((fn) => fn());
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete root.dataset.nav;
    };
  }, [pathname]);

  return null;
}
