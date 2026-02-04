import type { Metadata } from 'next';
import { DemoClient } from '@/components/demo/DemoClient';

export const metadata: Metadata = {
  title: 'Demo',
  description: 'Interactive 3D bin packing demo - try CrateFit in your browser.',
};

export default function DemoPage() {
  return <DemoClient />;
}
