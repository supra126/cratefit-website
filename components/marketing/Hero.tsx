'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight, Github } from 'lucide-react';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,hsl(var(--primary)/0.12),transparent)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <span className="mr-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              New
            </span>
            <span className="text-muted-foreground">
              {t('badge')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            {t('title')}
            <span className="block text-primary">{t('titleHighlight')}</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {t('description')}
          </p>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              {t('tryDemo')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-md border bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
            >
              {t('readDocs')}
            </Link>
            <a
              href="https://github.com/supra126/cratefit-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </a>
          </div>

          {/* Install command */}
          <div className="mt-10">
            <div className="inline-flex items-center rounded-lg border bg-muted/50 px-4 py-2 font-mono text-sm">
              <span className="text-muted-foreground">$</span>
              <span className="ml-2">{t('install')}</span>
              <button
                className="ml-4 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() =>
                  navigator.clipboard.writeText('npm install @cratefit/pack')
                }
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
