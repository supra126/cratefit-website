'use client';

import { useTranslations } from 'next-intl';
import {
  Box,
  Boxes,
  Code2,
  Gauge,
  Layers,
  RotateCcw,
  Scale,
  Zap,
} from 'lucide-react';

const featureKeys = [
  { key: 'multipleAlgorithms', icon: Boxes },
  { key: 'visualization', icon: Box },
  { key: 'typescript', icon: Code2 },
  { key: 'weight', icon: Scale },
  { key: 'rotation', icon: RotateCcw },
  { key: 'stacking', icon: Layers },
  { key: 'online', icon: Zap },
  { key: 'performance', icon: Gauge },
] as const;

export function Features() {
  const t = useTranslations('features');

  return (
    <section className="py-20 sm:py-32">
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featureKeys.map((feature) => (
              <div
                key={feature.key}
                className="relative rounded-lg border bg-card p-6 transition-colors hover:bg-accent/50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{t(`${feature.key}.title`)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t(`${feature.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
