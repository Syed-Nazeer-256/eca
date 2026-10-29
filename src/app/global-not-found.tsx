import './globals.css';
import type { Metadata } from 'next';
import { latinFontVars } from '@/lib/fonts-en';

// With one root layout per language there is no shared layout for unmatched URLs,
// so the 404 renders its own document, in both languages.
export const metadata: Metadata = { title: 'Page not found | Expert Contracts', robots: { index: false, follow: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en" className={latinFontVars}>
      <body>
        <main className="nf wrap">
          <h1 className="display">404</h1>
          <p style={{ color: 'var(--muted)', maxWidth: '40ch' }}>This clause is not in the contract. The page you wanted may have moved.</p>
          <p lang="ar" dir="rtl" style={{ color: 'var(--muted)', maxWidth: '40ch' }}>
            هذا البند غير موجود في العقد. ربما نُقلت الصفحة التي تبحث عنها.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="/" className="btn">
              <span className="btn__label">Back to home</span>
            </a>
            <a href="/ar/" className="btn btn--ghost" lang="ar">
              <span className="btn__label">العودة إلى الرئيسية</span>
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
