import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDocBySlug, getAllDocsAllLocales } from "@/lib/docs";
import { MDXContent } from "@/components/docs/MDXContent";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cratefit.vercel.app";

interface PageProps {
  params: Promise<{ locale: string; slug?: string[] }>;
}

// ISR: Revalidate docs every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const allDocs = getAllDocsAllLocales();
  return allDocs.map((doc) => ({
    locale: doc.locale,
    slug: doc.slug.length > 0 ? doc.slug : undefined,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = getDocBySlug(slug || [], locale);

  if (!doc) {
    return { title: "Documentation" };
  }

  const path = slug ? `/docs/${slug.join("/")}` : "/docs";
  const url = `${BASE_URL}/${locale}${path}`;

  return {
    title: doc.title,
    description: doc.description,
    alternates: {
      canonical: url,
      languages: {
        'en': `${BASE_URL}/en${path}`,
        'zh-TW': `${BASE_URL}/zh-TW${path}`,
      },
    },
    openGraph: {
      title: `${doc.title} | CrateFit Docs`,
      description: doc.description,
      url,
      type: "article",
      images: [
        {
          url: `/og-image.png?title=${encodeURIComponent(doc.title)}&description=${encodeURIComponent(doc.description || '')}`,
          width: 1200,
          height: 630,
          alt: doc.title,
        },
      ],
    },
  };
}

export default async function DocPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const doc = getDocBySlug(slug || [], locale);

  if (!doc) {
    notFound();
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: `${BASE_URL}/${locale}` },
    { name: "Documentation", url: `${BASE_URL}/${locale}/docs` },
  ];

  if (slug && slug.length > 0) {
    let currentPath = `${BASE_URL}/${locale}/docs`;
    slug.forEach((segment, index) => {
      currentPath += `/${segment}`;
      if (index === slug.length - 1) {
        breadcrumbItems.push({ name: doc.title, url: currentPath });
      } else {
        breadcrumbItems.push({
          name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
          url: currentPath,
        });
      }
    });
  }

  return (
    <article>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{doc.title}</h1>
        {doc.description && (
          <p className="mt-4 text-lg text-muted-foreground">
            {doc.description}
          </p>
        )}
      </header>
      <MDXContent content={doc.content} />
    </article>
  );
}
