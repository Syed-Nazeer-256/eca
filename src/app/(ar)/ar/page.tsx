import HomeView, { homeMeta } from '@/views/HomeView';
import { ar } from '@/i18n/ar';

export const metadata = homeMeta(ar);

export default function Page() {
  return <HomeView d={ar} />;
}
