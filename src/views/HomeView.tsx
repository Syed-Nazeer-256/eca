import type { Metadata } from 'next';
import Image from 'next/image';
import Seal from '@/components/Seal';
import Ledger from '@/components/Ledger';
import HeroScene from '@/components/HeroScene';
import Reach from '@/components/Reach';
import BriefForm from '@/components/BriefForm';
import JsonLd from '@/components/JsonLd';
import { faqPage, webPage } from '@/lib/schema';
import { pageMeta } from '@/lib/seo';
import { lp, type Dict } from '@/i18n';

export const homeMeta = (d: Dict): Metadata => pageMeta(d, { path: '/', title: d.ui.homeTitle, description: d.ui.homeDesc, absoluteTitle: true });

/** Pre-split words for the later hero states, so the swap can rise word by word. */
const words = (text: string) =>
  text.split(' ').map((w, i, all) => (
    <span key={i}>
      <span className="w-mask">
        <span className="w">{w}</span>
      </span>
      {i < all.length - 1 ? ' ' : ''}
    </span>
  ));

export default function HomeView({ d }: { d: Dict }) {
  const u = d.ui;
  const D = d.diff;
  const first = d.stages[0];
  const rtl = d.dir === 'rtl';

  return (
    <>
      <JsonLd graph={[webPage(d, 'WebPage', lp(d, '/'), u.homeTitle, d.about.firm), faqPage(d)]} />

      {/* 1. Hero: the tower builds as you scroll. Pinned for the length of the build. */}
      <section className="hero" data-hero aria-labelledby="hero-h">
        <div className="hero__sticky">
          <HeroScene stages={d.stages} slideAt={d.slides.map((s) => s.at)} mirror={rtl} />
          <Image className="hero__poster" src="/img/hero-poster.png" alt="" aria-hidden="true" width={1600} height={1000} sizes="100vw" />
          <div className="hero__scrim" aria-hidden="true" />

          <div className="wrap hero__content">
            <div className="hero__copy">
              <div className="hero__slides">
                <div className="hero__slide is-active" data-slide="0">
                  <h1 id="hero-h" className="display hero__title">
                    <span className="hero__line" data-split="load">
                      {d.slides[0].a}
                    </span>
                    <span className="hero__line accent" data-split="load">
                      {d.slides[0].b}
                    </span>
                  </h1>
                  <p className="hero__sub" data-intro>
                    {d.slides[0].sub}
                  </p>
                </div>
                {d.slides.slice(1).map((s, i) => (
                  <div className="hero__slide" data-slide={i + 1} key={s.a} aria-hidden="true">
                    <p className="display hero__title">
                      <span className="hero__line">{words(s.a)}</span>
                      <span className="hero__line accent">{words(s.b)}</span>
                    </p>
                    <p className="hero__sub">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="hero__rule" aria-hidden="true" data-intro />
              <div className="hero__cta" data-intro>
                <a className="btn" href={d.site.whatsapp} target="_blank" rel="noopener noreferrer" data-magnetic>
                  <span className="btn__label">{d.site.quoteLabel}</span>
                </a>
                <a className="btn btn--ghost" href="#services" data-magnetic>
                  <span className="btn__label">{u.explore}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="wrap hero__hud" aria-hidden="true" data-intro>
            <div className="hud__stage">
              <span className="hud__n" data-stage-n>
                {first.n}
              </span>
              <span className="hud__t" data-stage-t>
                {first.t}
              </span>
            </div>
            <div className="hud__pct">
              <span className="hud__geo">
                {d.hq.city} <bdi className="ltr">{d.hq.coords}</bdi>
              </span>
              <span className="ltr" data-build-pct>
                14
              </span>
              <small>{u.built}</small>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Proof: hairline stat row */}
      <section className="proof" aria-label={u.numbersAria}>
        <div className="wrap proof__row">
          {[
            { v: '30', plus: true },
            { v: '12' },
            { v: '3' },
            { v: '9' },
          ].map((s, i) => (
            <div className="stat" data-reveal key={s.v}>
              <div className="stat__v ltr">
                <span data-count={s.v}>{s.v}</span>
                {s.plus && <sup>+</sup>}
              </div>
              <p className="stat__l">{u.stats[i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Clients & partnerships: the page's single marquee */}
      <section className="logos" aria-labelledby="logos-h">
        <div className="wrap logos__head">
          <h2 id="logos-h" className="label">
            {u.logosH}
          </h2>
        </div>
        <div className="logos__track">
          <div className="marquee marquee--logos">
            {[0, 1].map((k) => (
              <ul className="marquee__set" key={k} aria-hidden={k === 1 ? 'true' : undefined}>
                {d.logos.map((l) => (
                  <li className="logo" key={`${k}-${l.file}`}>
                    <img src={`/img/logos/${l.file}.webp`} alt={k === 0 ? l.name : ''} width={l.w} height={l.h} loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Founder chapter: the seal, the person, his words */}
      <section className="section founder" data-founder aria-labelledby="vision">
        <div className="wrap founder__grid">
          <div className="founder__stage" data-reveal>
            <Seal text={u.sealRing} arabic={rtl} />
            <div className="founder__figure">
              <Image src="/img/founder.png" alt={u.founderAlt} width={1787} height={2560} sizes="(max-width: 900px) 70vw, 34vw" data-drift />
            </div>
          </div>
          <div className="statement__wide">
            <h2 id="vision" className="sr-only">
              {u.visionH}
            </h2>
            <p data-scrub>{d.founder.vision}</p>
            <p className="statement__by" data-reveal>
              <strong>{d.founder.name}</strong> {u.founderRole}
              {u.translatedNote && <span className="translated">{u.translatedNote}</span>}
            </p>
            <ul className="letters" aria-label={u.credsAria} data-reveal>
              {d.founder.letters.map((l) => (
                <li key={l} className="ltr">
                  {l}
                </li>
              ))}
            </ul>
            <ul className="founder__creds" aria-label={u.backgroundAria} data-reveal>
              {d.founder.credentials.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Clause ledger */}
      <section id="services" className="section services" aria-labelledby="services-h">
        <div className="wrap">
          <div className="services__head">
            <h2 id="services-h" className="display" data-split="scroll">
              {u.servicesH}
            </h2>
          </div>
          <Ledger items={d.services} prefix={d.prefix} labels={{ view: u.viewService, of: u.ofTwelve }} />
        </div>
      </section>

      {/* 5. Bento: five differentiators, five cells */}
      <section className="section why" aria-labelledby="why-h">
        <div className="wrap">
          <div className="why__head">
            <h2 id="why-h" className="display" data-split="scroll">
              {u.whyH}
            </h2>
            <p className="why__sub" data-reveal>
              {d.about.committed}
            </p>
          </div>
          <div className="bento">
            <article className="cell cell--years" data-reveal data-spotlight>
              <span className="big ltr" aria-hidden="true">
                30+
              </span>
              <div>
                <h3>{D.years.title}</h3>
                <p>{D.years.body}</p>
              </div>
            </article>
            <article className="cell cell--pmc" data-reveal data-spotlight>
              <h3>{D.pmc.title}</h3>
              <p>{D.pmc.body}</p>
            </article>
            <article className="cell cell--manpower" data-reveal data-spotlight>
              <h3>{D.manpower.title}</h3>
              <p>{D.manpower.body}</p>
            </article>
            <article className="cell cell--train" data-reveal data-spotlight>
              <div className="cell__bg" aria-hidden="true">
                <Image src="/img/training.png" alt="" fill sizes="(max-width: 900px) 100vw, 40vw" data-parallax />
              </div>
              <h3>{D.training.title}</h3>
              <p>{D.training.body}</p>
            </article>
            <article className="cell cell--gcc" data-reveal data-spotlight>
              <div className="cell__bg" aria-hidden="true">
                <Image src="/img/reach.png" alt="" width={2560} height={1429} sizes="(max-width: 900px) 200vw, 120vw" />
              </div>
              <h3>{D.gcc.title}</h3>
              <p>{D.gcc.body}</p>
            </article>
          </div>
        </div>
      </section>

      {/* 6. Global reach: interactive globe */}
      <Reach offices={d.offices} ui={{ reachH: u.reachH, reachBody: u.reachBody, globeAria: u.globeAria }} />

      {/* 7. Training */}
      <section className="section training" aria-labelledby="training-h">
        <div className="wrap training__grid">
          <div className="training__media" data-reveal>
            <Image src="/img/team.png" alt={u.trainingImgAlt} fill sizes="(max-width: 900px) 90vw, 44vw" data-drift />
          </div>
          <div>
            <h2 id="training-h" className="display" data-split="scroll">
              {d.training.headline}
            </h2>
            <p className="training__body" data-reveal>
              {d.training.body}
            </p>
            <ul className="pills" aria-label={u.trainingFormatsAria} data-reveal>
              {d.training.formats.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <ul className="training__benefits" data-reveal>
              {d.training.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <a className="btn btn--ink" href={d.site.whatsapp} target="_blank" rel="noopener noreferrer" data-magnetic>
              <span className="btn__label">{d.site.quoteLabel}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. Client statements, as published on the live site */}
      <section className="section voices" aria-labelledby="voices-h">
        <div className="wrap">
          <h2 id="voices-h" className="display voices__h" data-split="scroll">
            {u.voicesH}
          </h2>
          {u.translatedNote && <p className="translated translated--block">{u.translatedNote}</p>}
          <div className="voices__grid">
            {d.testimonials.map((t, i) => (
              <figure key={t.name} className={`voice${i === 0 ? ' voice--lead' : ''}`} data-reveal data-spotlight>
                <blockquote>
                  <p>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption>
                  <strong className="ltr">{t.name}</strong>
                  <span>{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ: visible answers, mirrored in FAQPage JSON-LD */}
      <section className="section faq" aria-labelledby="faq-h">
        <div className="wrap faq__grid">
          <h2 id="faq-h" className="display" data-split="scroll">
            {u.faqH}
          </h2>
          <div className="faq__list" data-reveal>
            {d.faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>{f.q}</summary>
                <p className="faq__a">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Contact: the finished tower behind, the engagement-brief form in front */}
      <section className="section cta" id="contact" aria-labelledby="cta-h">
        <div className="cta__backdrop" aria-hidden="true">
          <Image src="/img/hero-poster.png" alt="" width={1600} height={1000} sizes="100vw" data-drift />
        </div>
        <div className="wrap cta__grid">
          <div>
            <h2 id="cta-h" className="display" data-split="scroll">
              {u.ctaH}
            </h2>
            <p className="cta__sub" data-reveal>
              {u.ctaLead} {d.about.trusted}
            </p>
            <ul className="cta__lines" data-reveal>
              {d.offices.map((o) => (
                <li key={o.code}>
                  <span>{o.country}</span>
                  <a href={o.href} className="mono ltr">
                    {o.phone}
                  </a>
                </li>
              ))}
              <li>
                <span>{u.email}</span>
                <a href={`mailto:${d.site.email}`} className="ltr">
                  {d.site.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="cta__form" data-reveal>
            <BriefForm services={d.services} site={{ whatsapp: d.site.whatsapp, email: d.site.email }} f={u.form} />
          </div>
        </div>
      </section>
    </>
  );
}
