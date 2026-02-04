'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  const t = useTranslations('cta');

  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center shadow-2xl sm:px-12">
          {/* Background pattern */}
          <div className="absolute inset-0 -z-10 opacity-30">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80">
            {t('description')}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-md bg-background px-6 py-3 text-sm font-medium text-primary shadow-sm transition-colors hover:bg-background/90"
            >
              {t('getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-md border border-primary-foreground/20 bg-transparent px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              {t('tryDemo')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
