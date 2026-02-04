'use client';

import { useEffect, useRef, useState, Component, type ReactNode } from 'react';
import { useTheme } from 'next-themes';
import type { PackedBin } from '@cratefit/pack';
import {
  create3DScene,
  renderPackedBin3D,
  animate,
  type SceneComponents,
} from '@cratefit/viz';

// Error Boundary for WebGL errors
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class Viewer3DErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Check WebGL support
function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

interface Viewer3DProps {
  packedBin: PackedBin;
}

function Viewer3DImpl({ packedBin }: Viewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneComponents | null>(null);
  const { resolvedTheme } = useTheme();
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support on mount
    if (!isWebGLSupported()) {
      setWebGLSupported(false);
      return undefined;
    }

    if (!containerRef.current) return undefined;

    // Clean up previous scene
    if (sceneRef.current) {
      sceneRef.current.dispose();
    }

    // Theme-aware background color
    const backgroundColor = resolvedTheme === 'dark' ? '#0f172a' : '#f8fafc';

    try {
      // Create new scene
      const components = create3DScene(containerRef.current, {
        backgroundColor,
        showGrid: true,
        enableShadows: true,
      });
      sceneRef.current = components;

      // Render packed bin
      renderPackedBin3D(components.scene, packedBin, {
        showEdges: true,
        itemOpacity: 0.9,
        showBinWireframe: true,
        colorScheme: 'auto',
      });

      // Start animation loop
      animate(
        components.renderer,
        components.scene,
        components.camera,
        components.controls
      );

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        components.handleResize();
      });
      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
        if (sceneRef.current) {
          sceneRef.current.dispose();
          sceneRef.current = null;
        }
      };
    } catch (error) {
      console.error('3D Viewer error:', error);
      setWebGLSupported(false);
      return undefined;
    }
  }, [packedBin, resolvedTheme]);

  if (!webGLSupported) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="font-semibold">WebGL not supported</p>
          <p className="text-sm">Your browser or device does not support 3D rendering</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full"
      style={{ minHeight: '400px' }}
    />
  );
}

export function Viewer3D({ packedBin }: Viewer3DProps) {
  return (
    <Viewer3DErrorBoundary
      fallback={
        <div className="flex h-full items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="font-semibold">3D Viewer Error</p>
            <p className="text-sm">Failed to initialize 3D rendering</p>
          </div>
        </div>
      }
    >
      <Viewer3DImpl packedBin={packedBin} />
    </Viewer3DErrorBoundary>
  );
}
