import HomeView, { homeMeta } from '@/views/HomeView';
import { en } from '@/i18n/en';

export const metadata = homeMeta(en);

export default function Page() {
  return <HomeView d={en} />;
}
