'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { pack, type BinSpec, type ItemSpec, type PackResult } from '@cratefit/pack';
import { Play, RotateCcw, Plus, Trash2, Settings } from 'lucide-react';
import { Viewer3D } from './Viewer3D';

interface DemoItem {
  id: string;
  width: number;
  height: number;
  depth: number;
  quantity: number;
  color?: string;
}

const defaultBin: BinSpec = {
  id: 'bin-1',
  type: 'box',
  width: 100,
  height: 100,
  depth: 100,
};

const defaultItems: DemoItem[] = [
  { id: 'item-1', width: 40, height: 30, depth: 50, quantity: 2, color: '#3b82f6' },
  { id: 'item-2', width: 30, height: 40, depth: 30, quantity: 3, color: '#10b981' },
  { id: 'item-3', width: 20, height: 20, depth: 20, quantity: 5, color: '#f59e0b' },
];

const algorithms = [
  { value: 'extreme-point', label: 'Extreme Point' },
  { value: 'layer-building', label: 'Layer Building' },
  { value: 'eb-afit', label: 'EB-AFIT' },
] as const;

export function DemoClient() {
  const t = useTranslations('demo');
  const [bin, setBin] = useState<BinSpec>(defaultBin);
  const [items, setItems] = useState<DemoItem[]>(defaultItems);
  const [algorithm, setAlgorithm] = useState<'extreme-point' | 'layer-building' | 'eb-afit'>('extreme-point');
  const [result, setResult] = useState<PackResult | null>(null);
  const [isPacking, setIsPacking] = useState(false);
  const nextItemId = useRef(4);

  const handlePack = useCallback(() => {
    setIsPacking(true);

    // Convert demo items to ItemSpec array
    const itemSpecs: ItemSpec[] = items.flatMap((item) =>
      Array.from({ length: item.quantity }, (_, i) => ({
        id: `${item.id}-${i}`,
        width: item.width,
        height: item.height,
        depth: item.depth,
        metadata: { color: item.color },
      }))
    );

    try {
      const packResult = pack({
        bins: [bin],
        items: itemSpecs,
        options: { algorithm },
      });
      setResult(packResult);
    } catch (error) {
      console.error('Packing error:', error);
    } finally {
      setIsPacking(false);
    }
  }, [bin, items, algorithm]);

  const handleReset = useCallback(() => {
    setBin(defaultBin);
    setItems(defaultItems);
    setResult(null);
    nextItemId.current = 4;
  }, []);

  const handleAddItem = useCallback(() => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const newItem: DemoItem = {
      id: `item-${nextItemId.current++}`,
      width: 20,
      height: 20,
      depth: 20,
      quantity: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleUpdateItem = useCallback((id: string, updates: Partial<DemoItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  // Auto-pack on first load
  const initialPackDone = useRef(false);
  useEffect(() => {
    if (!initialPackDone.current) {
      initialPackDone.current = true;
      handlePack();
    }
  }, [handlePack]);

  const packedBin = result?.packed[0];
  const stats = result?.stats;

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Config Panel */}
      <div className="w-full border-b bg-card p-4 lg:w-80 lg:border-b-0 lg:border-r lg:overflow-y-auto">
        <div className="space-y-6">
          {/* Bin Config */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold">
              <Settings className="h-4 w-4" />
              {t('container')}
            </h3>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(['width', 'height', 'depth'] as const).map((dim) => (
                <div key={dim}>
                  <label className="text-xs text-muted-foreground capitalize">
                    {dim}
                  </label>
                  <input
                    type="number"
                    value={bin[dim]}
                    onChange={(e) =>
                      setBin((prev) => ({ ...prev, [dim]: Number(e.target.value) }))
                    }
                    className="mt-1 w-full rounded-md border bg-background px-2 py-1 text-sm"
                    min={1}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Algorithm */}
          <div>
            <label className="text-sm font-medium">{t('algorithm')}</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as typeof algorithm)}
              className="mt-1 w-full rounded-md border bg-background px-2 py-2 text-sm"
            >
              {algorithms.map((alg) => (
                <option key={alg.value} value={alg.value}>
                  {alg.label}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{t('items')}</h3>
              <button
                onClick={handleAddItem}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary hover:bg-accent"
              >
                <Plus className="h-3 w-3" />
                {t('add')}
              </button>
            </div>
            <div className="mt-3 space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md border bg-background p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.id}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(['width', 'height', 'depth'] as const).map((dim) => (
                      <div key={dim}>
                        <label className="text-xs text-muted-foreground capitalize">
                          {dim.charAt(0)}
                        </label>
                        <input
                          type="number"
                          value={item[dim]}
                          onChange={(e) =>
                            handleUpdateItem(item.id, { [dim]: Number(e.target.value) })
                          }
                          className="mt-1 w-full rounded border bg-card px-1 py-0.5 text-xs"
                          min={1}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs text-muted-foreground">{t('qty')}</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.id, { quantity: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded border bg-card px-1 py-0.5 text-xs"
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handlePack}
              disabled={isPacking}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              {isPacking ? t('packing') : t('pack')}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="rounded-md border bg-muted/50 p-3">
              <h3 className="font-semibold text-sm mb-2">{t('results')}</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">{t('packed')}</dt>
                  <dd className="font-medium">{stats.packedItems} items</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('unpacked')}</dt>
                  <dd className="font-medium">{stats.unpackedItems} items</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('utilization')}</dt>
                  <dd className="font-medium">
                    {(stats.avgUtilization * 100).toFixed(1)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{t('binsUsed')}</dt>
                  <dd className="font-medium">{stats.totalBins}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 bg-muted/30">
        {packedBin ? (
          <Viewer3D packedBin={packedBin} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {t('clickToPack')}
          </div>
        )}
      </div>
    </div>
  );
}
