import { Hero, Features, UseCases, CodeExample, CTA } from '@/components/marketing';
import { WebsiteJsonLd, SoftwareJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cratefit.vercel.app';

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd
        url={BASE_URL}
        name="CrateFit"
        description="Open-source 3D bin packing library for container loading, pallet packing, and logistics optimization."
      />
      <SoftwareJsonLd
        name="CrateFit"
        description="Open-source 3D bin packing library for TypeScript/JavaScript. Solve container loading, pallet packing, and logistics optimization problems."
        url={BASE_URL}
        applicationCategory="DeveloperApplication"
        operatingSystem="Any"
        offers={{ price: '0', priceCurrency: 'USD' }}
      />
      <Hero />
      <Features />
      <UseCases />
      <CodeExample />
      <CTA />
    </>
  );
}
