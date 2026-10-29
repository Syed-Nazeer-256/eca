import '../globals.css';
import SiteShell, { baseMetadata } from '@/components/SiteShell';
import { latinFontVars } from '@/lib/fonts-en';
import { en } from '@/i18n/en';

export const metadata = baseMetadata(en);
export { viewport } from '@/components/SiteShell';

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell d={en} fontVars={latinFontVars}>
      {children}
    </SiteShell>
  );
}
