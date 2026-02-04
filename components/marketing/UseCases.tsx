'use client';

import { useTranslations } from 'next-intl';
import { Package, Ship, Truck, Warehouse } from 'lucide-react';

const useCaseKeys = [
  { key: 'ecommerce', icon: Package },
  { key: 'container', icon: Ship },
  { key: 'pallet', icon: Warehouse },
  { key: 'truck', icon: Truck },
] as const;

export function UseCases() {
  const t = useTranslations('useCases');

  return (
    <section className="bg-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            {useCaseKeys.map((useCase) => (
              <div
                key={useCase.key}
                className="rounded-xl border bg-card p-8 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <useCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{t(`${useCase.key}.title`)}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {t(`${useCase.key}.description`)}
                    </p>
                    <p className="mt-4 rounded-md bg-muted px-3 py-2 font-mono text-sm text-muted-foreground">
                      {t(`${useCase.key}.example`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
