import AboutView, { aboutMeta } from '@/views/AboutView';
import { ar } from '@/i18n/ar';

export const metadata = aboutMeta(ar);

export default function Page() {
  return <AboutView d={ar} />;
}
