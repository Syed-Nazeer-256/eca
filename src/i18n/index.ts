import { en, type Dict, type Lang } from './en';
import { ar } from './ar';

export type { Dict, Lang };
export const dicts: Record<Lang, Dict> = { en, ar };
export const getDict = (lang: Lang) => dicts[lang];

/** Fill {key} placeholders. */
export const fmt = (s: string, vars: Record<string, string>) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

/** Language-prefixed path. '/' -> '/ar/', '/about-us/' -> '/ar/about-us/', '/#services' -> '/ar/#services'. */
export const lp = (d: Pick<Dict, 'prefix'>, path: string) => (d.prefix ? `${d.prefix}${path}` : path);

/** The same page in the other language. */
export const counterpart = (pathname: string, lang: Lang) => {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (lang === 'ar') return p.replace(/^\/ar(\/|$)/, '/') || '/';
  return p === '/' ? '/ar/' : `/ar${p}`;
};
