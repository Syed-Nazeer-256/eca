import '../globals.css';
import SiteShell, { baseMetadata } from '@/components/SiteShell';
import { latinFontVars } from '@/lib/fonts-en';
import { arabicFontVars } from '@/lib/fonts-ar';
import { ar } from '@/i18n/ar';

export const metadata = baseMetadata(ar);
export { viewport } from '@/components/SiteShell';

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell d={ar} fontVars={`${latinFontVars} ${arabicFontVars}`}>
      {children}
    </SiteShell>
  );
}
