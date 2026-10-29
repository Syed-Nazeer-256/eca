import ServiceView, { serviceMeta, serviceParams } from '@/views/ServiceView';
import { en } from '@/i18n/en';

export const generateStaticParams = serviceParams;
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params) {
  return serviceMeta(en, (await params).slug);
}

export default async function Page({ params }: Params) {
  return <ServiceView d={en} slug={(await params).slug} />;
}
