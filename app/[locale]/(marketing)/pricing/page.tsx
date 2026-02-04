'use client';

import { useTranslations } from 'next-intl';
import { Check, Info } from 'lucide-react';

const tierKeys = ['sdk', 'api', 'selfHosted'] as const;

const tierConfig = {
  sdk: {
    href: '/docs',
    highlighted: false,
    external: false,
    featureKeys: ['fullFunctionality', 'visualization', 'allAlgorithms', 'typescript', 'commercialUse', 'communitySupport'],
  },
  api: {
    href: '/docs/api-reference',
    highlighted: true,
    external: false,
    featureKeys: ['restApi', 'noSetup', 'rateLimit', 'allAlgorithms', 'jsonResponse', 'noRegistration'],
  },
  selfHosted: {
    href: 'https://github.com/supra126/cratefit-starter',
    highlighted: false,
    external: true,
    featureKeys: ['noRateLimits', 'fullControl', 'privateNetwork', 'customConfig', 'dockerSupport', 'sameLicense'],
  },
};

const faqKeys = ['whyFree', 'rateLimits', 'selfHost', 'commercial', 'support'] as const;

export default function PricingPage() {
  const t = useTranslations('pricing');

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {tierKeys.map((tierKey) => {
            const config = tierConfig[tierKey];
            const isApi = tierKey === 'api';

            return (
              <div
                key={tierKey}
                className={`relative flex flex-col rounded-2xl border p-8 shadow-sm ${
                  config.highlighted
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'bg-card'
                }`}
              >
                {config.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    {t('quickStart')}
                  </div>
                )}
                <div className="text-center">
                  <h2 className="text-lg font-semibold">{t(`${tierKey}.name`)}</h2>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t(`${tierKey}.price`)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`${tierKey}.description`)}
                  </p>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {config.featureKeys.map((featureKey) => (
                    <li key={featureKey} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm">{t(`${tierKey}.features.${featureKey}`)}</span>
                    </li>
                  ))}
                </ul>

                {isApi && (
                  <div className="mt-6 flex items-start gap-2 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{t(`${tierKey}.notice`)}</span>
                  </div>
                )}

                <a
                  href={config.href}
                  {...(config.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className={`mt-6 block w-full rounded-md py-3 text-center text-sm font-medium transition-colors ${
                    config.highlighted
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border bg-background hover:bg-accent'
                  }`}
                >
                  {t(`${tierKey}.cta`)}
                </a>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <h2 className="text-2xl font-bold">{t('faq.title')}</h2>
          <dl className="mt-8 space-y-6 text-left">
            {faqKeys.map((faqKey) => (
              <div key={faqKey}>
                <dt className="font-semibold">{t(`faq.${faqKey}.q`)}</dt>
                <dd className="mt-2 text-muted-foreground">
                  {t(`faq.${faqKey}.a`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
