import ContactView, { contactMeta } from '@/views/ContactView';
import { en } from '@/i18n/en';

export const metadata = contactMeta(en);

export default function Page() {
  return <ContactView d={en} />;
}
