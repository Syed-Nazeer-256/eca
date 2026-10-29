import AboutView, { aboutMeta } from '@/views/AboutView';
import { en } from '@/i18n/en';

export const metadata = aboutMeta(en);

export default function Page() {
  return <AboutView d={en} />;
}
