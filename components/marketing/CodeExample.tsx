'use client';

import { useTranslations } from 'next-intl';

const codeExample = `import { pack } from '@cratefit/pack';

// Define your bins (containers)
const bins = [
  { id: 'box-1', width: 100, height: 100, depth: 100 }
];

// Define items to pack
const items = [
  { id: 'item-1', width: 50, height: 30, depth: 40, quantity: 3 },
  { id: 'item-2', width: 60, height: 40, depth: 30, quantity: 2 },
  { id: 'item-3', width: 20, height: 20, depth: 20, quantity: 5 }
];

// Pack items into bins
const result = pack({ bins, items });

console.log(\`Packed \${result.packedItems} items\`);
console.log(\`Utilization: \${(result.utilization * 100).toFixed(1)}%\`);`;

export function CodeExample() {
  const t = useTranslations('codeExample');

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

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="overflow-hidden rounded-xl border bg-code shadow-2xl">
            <div className="flex items-center gap-2 border-b border-code-foreground/10 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-sm text-code-foreground/50">example.ts</span>
            </div>
            <div className="overflow-x-auto p-4">
              <pre className="text-sm leading-relaxed">
                <code className="text-code-foreground">{codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
