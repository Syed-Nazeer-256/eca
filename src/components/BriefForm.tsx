'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type FocusEvent, type FormEvent } from 'react';
import BorderGlow from '@/components/ui/border-glow';
import { fmt, type Dict } from '@/i18n';
import styles from './brief-form.module.css';

/*
 * Enquiry form styled after the space portfolio's contact card (S:/PortFolio/syedshahidnazeer),
 * itself adapted from muhammederdem/credit-card-form. Here the card is an engagement brief:
 * it previews the enquiry live as the visitor types, flips to the scope when they write it,
 * and seals itself into an envelope on send. Nothing is posted: the brief opens in WhatsApp
 * or the mail app, already written, in the page's language.
 */

type Props = {
  services: Dict['services'];
  site: Pick<Dict['site'], 'whatsapp' | 'email'>;
  f: Dict['ui']['form'];
};

type FieldRef = 'email' | 'name' | 'service';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BriefForm({ services, site, f }: Props) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [message, setMessage] = useState('');

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [via, setVia] = useState<'whatsapp' | 'email'>('whatsapp');
  const [flipped, setFlipped] = useState(false);
  const [focusStyle, setFocusStyle] = useState<CSSProperties | null>(null);
  const [touched, setTouched] = useState(false);

  const emailRef = useRef<HTMLLabelElement | null>(null);
  const nameRef = useRef<HTMLLabelElement | null>(null);
  const serviceRef = useRef<HTMLLabelElement | null>(null);
  const inputFocused = useRef(false);
  const sealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (sealTimer.current) clearTimeout(sealTimer.current);
    },
    [],
  );

  // The highlight frame measures the card element that mirrors the focused field.
  const focusInput = useCallback((e: FocusEvent<HTMLElement>) => {
    const key = e.currentTarget.dataset.ref as FieldRef | undefined;
    const target = key === 'email' ? emailRef.current : key === 'name' ? nameRef.current : key === 'service' ? serviceRef.current : null;
    if (!target) return;
    inputFocused.current = true;
    setFocusStyle({
      width: `${target.offsetWidth}px`,
      height: `${target.offsetHeight}px`,
      transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`,
    });
  }, []);

  const blurInput = useCallback(() => {
    inputFocused.current = false;
    setTimeout(() => {
      if (!inputFocused.current) setFocusStyle(null);
    }, 300);
  }, []);

  const emailInvalid = touched && email.length > 0 && !EMAIL.test(email);
  const needContact = touched && !email.trim() && !phone.trim();
  const nameMissing = touched && !name.trim();
  const messageMissing = touched && !message.trim();
  const valid = name.trim().length > 0 && (EMAIL.test(email) || (!email && phone.trim().length > 0)) && message.trim().length > 0;

  const body = () => {
    const lines = [f.msgHeader, `${f.msgName}: ${name.trim()}`];
    if (company.trim()) lines.push(`${f.msgCompany}: ${company.trim()}`);
    if (email.trim()) lines.push(`${f.msgEmail}: ${email.trim()}`);
    if (phone.trim()) lines.push(`${f.msgPhone}: ${phone.trim()}`);
    if (service) lines.push(`${f.msgService}: ${service}`);
    lines.push('', message.trim());
    return lines.join('\n');
  };

  const send = (channel: 'whatsapp' | 'email') => {
    setTouched(true);
    if (!valid || status !== 'idle') return;
    setVia(channel);
    const text = encodeURIComponent(body());
    const url =
      channel === 'whatsapp'
        ? `${site.whatsapp.split('?')[0]}?text=${text}`
        : `mailto:${site.email}?subject=${encodeURIComponent(`${f.subject}${company ? `${f.subjectFrom}${company.trim()}` : ''}`)}&body=${text}`;
    window.open(url, channel === 'whatsapp' ? '_blank' : '_self', 'noopener');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatus('sent');
      return;
    }
    // Flip to the scope side, then the CSS seals the brief into its envelope.
    setStatus('sending');
    setFocusStyle(null);
    setFlipped(true);
    sealTimer.current = setTimeout(() => setStatus('sent'), 1700);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send('whatsapp');
  };

  const reset = () => {
    if (sealTimer.current) clearTimeout(sealTimer.current);
    setStatus('idle');
    setFlipped(false);
    setTouched(false);
    // Same person writing again: keep who they are, clear what they asked.
    setMessage('');
    setService('');
  };

  /** One span per character so each animates in as it is typed. Arabic letters join, so
   *  splitting them into boxes would break the word: Arabic animates per word instead. */
  const chars = (value: string) => {
    if (/[\u0600-\u06FF]/.test(value)) {
      return value.split(/(\s+)/).map((w, i) =>
        w.trim() ? (
          <span key={`${i}-${w}`} className={styles.charItem}>
            {w}
          </span>
        ) : (
          ' '
        ),
      );
    }
    return Array.from(value).map((c, i) => (
      <span key={`${i}-${c}`} className={styles.charItem}>
        {c === ' ' ? '\u00a0' : c}
      </span>
    ));
  };

  const shortService = service ? (services.find((s) => s.title === service)?.short ?? service) : '';

  return (
    <div className={`${styles.cardForm} ${status === 'idle' ? '' : styles.sending}`}>
      {/* ---------- live preview: the engagement brief ---------- */}
      <div className={styles.cardList} aria-hidden="true">
        <div className={`${styles.cardItem} ${flipped ? styles.flipped : ''}`}>
          <div className={`${styles.cardItemSide} ${styles.front}`}>
            <div className={`${styles.cardItemFocus} ${focusStyle ? styles.focusActive : ''}`} style={focusStyle ?? undefined} />
            <div className={styles.cardItemCover} />
            <div className={styles.cardItemWrapper}>
              <div className={styles.cardItemTop}>
                <div className={styles.seal}>EC</div>
                <div className={styles.brand}>{f.brief}</div>
              </div>

              <label htmlFor="brief-email" className={`${styles.cardItemValue} ${email ? '' : styles.placeholder}`} ref={emailRef} dir="ltr">
                {email ? chars(email) : 'you@company.com'}
              </label>

              <div className={styles.cardItemContent}>
                <label htmlFor="brief-name" className={styles.cardItemInfo} ref={nameRef}>
                  <div className={styles.cardItemLabel}>{f.from}</div>
                  <div className={`${styles.cardItemName} ${name ? '' : styles.placeholder}`}>{name ? chars(name) : f.yourName}</div>
                  <div className={`${styles.cardItemCompany} ${company ? '' : styles.placeholder}`}>{company || f.company}</div>
                </label>
                <label htmlFor="brief-service" className={styles.cardItemTopic} ref={serviceRef}>
                  <div className={styles.cardItemLabel}>{f.service}</div>
                  <div className={`${styles.cardItemTopicValue} ${service ? '' : styles.placeholder}`}>{shortService || f.toDiscuss}</div>
                </label>
              </div>
            </div>
          </div>

          <div className={`${styles.cardItemSide} ${styles.back}`}>
            <div className={styles.cardItemCover} />
            <div className={styles.cardItemBand} />
            <div className={styles.cardItemMessage}>
              <div className={styles.cardItemMessageTitle}>{f.scope}</div>
              <div className={`${styles.cardItemMessageBand} ${message ? '' : styles.placeholder}`}>{message || f.scopePlaceholder}</div>
            </div>
          </div>
        </div>

        <div className={`${styles.envelope} ${styles.envelopeBack}`} />
        <div className={`${styles.envelope} ${styles.envelopeFront}`} />
      </div>

      {/* ---------- the form ---------- */}
      <BorderGlow
        className={styles.glowWrap}
        backgroundColor="#0e1513"
        glowColor="135 50 55"
        colors={['#3db75a', '#8fd9a6', '#1f6b3a']}
        borderRadius={20}
        glowRadius={40}
        edgeSensitivity={26}
        coneSpread={25}
      >
        {status === 'sent' ? (
          <div className={styles.confirmation} role="status" aria-live="polite">
            <h3 className={styles.confirmationTitle}>{f.sentTitle}</h3>
            <p className={styles.confirmationBody}>
              {fmt(f.sentBody, { via: via === 'whatsapp' ? f.viaWa : f.viaEmail })}{' '}
              <a href={`mailto:${site.email}`} dir="ltr">
                {site.email}
              </a>
              .
            </p>
            <button type="button" className={styles.resetButton} onClick={reset}>
              {f.again}
            </button>
          </div>
        ) : (
          <form className={styles.cardFormInner} onSubmit={onSubmit} noValidate>
            <div className={styles.formBody}>
              <div className={styles.row}>
                <div className={styles.cardInput}>
                  <label htmlFor="brief-name" className={styles.cardInputLabel}>
                    {f.fullName}
                  </label>
                  <input
                    id="brief-name"
                    className={`${styles.cardInputField} ${nameMissing ? styles.invalid : ''}`}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    data-ref="name"
                    autoComplete="name"
                    aria-invalid={nameMissing || undefined}
                    aria-describedby={nameMissing ? 'brief-name-err' : undefined}
                  />
                  {nameMissing && (
                    <p id="brief-name-err" className={styles.error}>
                      {f.errName}
                    </p>
                  )}
                </div>
                <div className={styles.cardInput}>
                  <label htmlFor="brief-company" className={styles.cardInputLabel}>
                    {f.company}
                  </label>
                  <input
                    id="brief-company"
                    className={styles.cardInputField}
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    data-ref="name"
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.cardInput}>
                  <label htmlFor="brief-email" className={styles.cardInputLabel}>
                    {f.email}
                  </label>
                  <input
                    id="brief-email"
                    type="email"
                    dir="ltr"
                    className={`${styles.cardInputField} ${emailInvalid || needContact ? styles.invalid : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    data-ref="email"
                    autoComplete="email"
                    aria-invalid={emailInvalid || needContact || undefined}
                    aria-describedby={emailInvalid || needContact ? 'brief-email-err' : undefined}
                  />
                  {(emailInvalid || needContact) && (
                    <p id="brief-email-err" className={styles.error}>
                      {emailInvalid ? f.errEmailBad : f.errContact}
                    </p>
                  )}
                </div>
                <div className={styles.cardInput}>
                  <label htmlFor="brief-phone" className={styles.cardInputLabel}>
                    {f.phone}
                  </label>
                  <input
                    id="brief-phone"
                    type="tel"
                    dir="ltr"
                    className={styles.cardInputField}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={focusInput}
                    onBlur={blurInput}
                    data-ref="email"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className={styles.cardInput}>
                <label htmlFor="brief-service" className={styles.cardInputLabel}>
                  {f.service}
                </label>
                <select
                  id="brief-service"
                  className={`${styles.cardInputField} ${styles.select}`}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  onFocus={focusInput}
                  onBlur={blurInput}
                  data-ref="service"
                >
                  <option value="">{f.notSure}</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.cardInput}>
                <label htmlFor="brief-message" className={styles.cardInputLabel}>
                  {f.scope}
                </label>
                <textarea
                  id="brief-message"
                  className={`${styles.cardInputField} ${messageMissing ? styles.invalid : ''}`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  // Writing the scope turns the brief over, like reaching the back of a card.
                  onFocus={() => {
                    setFocusStyle(null);
                    setFlipped(true);
                  }}
                  onBlur={() => setFlipped(false)}
                  rows={4}
                  aria-invalid={messageMissing || undefined}
                  aria-describedby={messageMissing ? 'brief-message-err' : 'brief-message-hint'}
                />
                {messageMissing ? (
                  <p id="brief-message-err" className={styles.error}>
                    {f.errMessage}
                  </p>
                ) : (
                  <p id="brief-message-hint" className={styles.fieldHint}>
                    {f.scopeHint}
                  </p>
                )}
              </div>

              <button type="submit" className={styles.button}>
                {f.sendWa}
              </button>
              <button type="button" className={styles.secondary} onClick={() => send('email')}>
                {f.sendEmail}
              </button>

              <p className={styles.hint}>{f.hint}</p>
            </div>
          </form>
        )}
      </BorderGlow>
    </div>
  );
}
