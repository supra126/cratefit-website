'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDemoStore } from '@/lib/stores/demo-store';
import { getConfigFromUrl } from '@/lib/url-state';
import { ConfigPanel } from './ConfigPanel';
import { ExampleSelector } from './ExampleSelector';
import { Viewer3D } from './Viewer3D';
import { ViewerControls } from './ViewerControls';
import { UtilityToolbar } from './UtilityToolbar';
import { WelcomeModal } from './WelcomeModal';
import { StatsPanel } from './StatsPanel';

export function DemoClient() {
  const t = useTranslations('demo');
  const { result, mode, onlinePlacedItems, runPack, autoPack, loadConfig, currentBinIndex, setCurrentBinIndex } = useDemoStore();
  // Use proper hook selector for reactivity instead of getState()
  const firstBin = useDemoStore((s) => s.bins[0]);
  const initialPackDone = useRef(false);
  const urlConfigLoaded = useRef(false);
  const hasUrlConfig = useRef(false);

  // Load config from URL on mount
  useEffect(() => {
    if (urlConfigLoaded.current) return;
    urlConfigLoaded.current = true;

    const urlConfig = getConfigFromUrl();
    if (urlConfig) {
      hasUrlConfig.current = true;
      loadConfig(urlConfig);
    }
  }, [loadConfig]);

  // Auto-pack on first load
  useEffect(() => {
    if (!initialPackDone.current && autoPack) {
      initialPackDone.current = true;
      runPack();
    }
  }, [runPack, autoPack]);

  const packedBins = result?.packed ?? [];
  const packedBin = packedBins[currentBinIndex] ?? packedBins[0];
  const stats = result?.stats;

  // For online mode, create a virtual packed bin from placed items
  const onlinePackedBin = (() => {
    if (mode !== 'online' || onlinePlacedItems.length === 0 || !firstBin) {
      return null;
    }

    // Calculate total weight
    const totalWeight = onlinePlacedItems.reduce(
      (sum, item) => sum + (item.item.weight || 0),
      0
    );

    // Calculate utilization (volume used / bin volume)
    const binVolume = firstBin.width * firstBin.height * firstBin.depth;
    const usedVolume = onlinePlacedItems.reduce((sum, item) => {
      const { width, height, depth } = item.item;
      return sum + width * height * depth;
    }, 0);
    const utilization = binVolume > 0 ? usedVolume / binVolume : 0;

    // Calculate center of gravity (weighted average of item positions)
    let cogX = 0, cogY = 0, cogZ = 0;
    let totalMass = 0;
    for (const placed of onlinePlacedItems) {
      const mass = placed.item.weight || 1;
      const { x, y, z } = placed.position;
      const { width, height, depth } = placed.item;
      // Use center of item
      cogX += (x + width / 2) * mass;
      cogY += (y + height / 2) * mass;
      cogZ += (z + depth / 2) * mass;
      totalMass += mass;
    }
    const centerOfGravity = totalMass > 0
      ? { x: cogX / totalMass, y: cogY / totalMass, z: cogZ / totalMass }
      : { x: 0, y: 0, z: 0 };

    return {
      bin: firstBin,
      items: onlinePlacedItems,
      utilization,
      weight: totalWeight,
      centerOfGravity,
    };
  })();

  const displayBin = mode === 'online' ? onlinePackedBin : packedBin;

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Header with Example Selector and Utility Toolbar (mobile) */}
      <div className="flex items-center justify-between border-b bg-card p-2 lg:hidden">
        <ExampleSelector />
        <UtilityToolbar />
      </div>

      {/* Config Panel */}
      <div className="flex-shrink-0 lg:h-full">
        {/* Example Selector + Utility Toolbar (desktop) */}
        <div className="hidden items-center justify-between border-b bg-card p-2 lg:flex lg:w-80">
          <ExampleSelector />
          <UtilityToolbar />
        </div>
        <div className="max-h-[40vh] overflow-y-auto lg:max-h-none lg:h-[calc(100%-52px)]">
          <ConfigPanel />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 3D Viewer */}
        <div className="relative min-h-0 flex-1 bg-muted/30">
          {displayBin ? (
            <>
              <Viewer3D packedBin={displayBin} />
              <ViewerControls packedBin={displayBin} />

              {/* Bin Selector (for multi-bin results) */}
              {packedBins.length > 1 && mode === 'offline' && (
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-lg border bg-background/90 px-2 py-1.5 shadow-sm backdrop-blur-sm">
                  <button
                    onClick={() => setCurrentBinIndex(Math.max(0, currentBinIndex - 1))}
                    disabled={currentBinIndex === 0}
                    className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="min-w-[80px] text-center text-sm">
                    {t('container')} {currentBinIndex + 1} / {packedBins.length}
                  </span>
                  <button
                    onClick={() => setCurrentBinIndex(Math.min(packedBins.length - 1, currentBinIndex + 1))}
                    disabled={currentBinIndex === packedBins.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center text-muted-foreground">
              {t('clickToPack')}
            </div>
          )}
        </div>

        {/* Stats Panel */}
        {result && mode === 'offline' && (
          <StatsPanel result={result} currentBin={packedBin} />
        )}
      </div>

      {/* Welcome Modal - only show if no URL config */}
      {!hasUrlConfig.current && <WelcomeModal />}
    </div>
  );
}
