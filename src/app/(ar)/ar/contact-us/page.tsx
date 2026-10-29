import ContactView, { contactMeta } from '@/views/ContactView';
import { ar } from '@/i18n/ar';

export const metadata = contactMeta(ar);

export default function Page() {
  return <ContactView d={ar} />;
}
