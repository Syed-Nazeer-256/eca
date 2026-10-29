import ServiceView, { serviceMeta, serviceParams } from '@/views/ServiceView';
import { ar } from '@/i18n/ar';

export const generateStaticParams = serviceParams;
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  return serviceMeta(ar, (await params).slug);
}

export default async function Page({ params }: Params) {
  return <ServiceView d={ar} slug={(await params).slug} />;
}
