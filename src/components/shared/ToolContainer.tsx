'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

const FallbackTool: ComponentType = () => (
  <div className="p-6 text-center border border-dashed rounded-lg">
    <p className="text-sm text-muted-foreground">Tool module configuration is under construction.</p>
  </div>
);
FallbackTool.displayName = 'FallbackTool';

// Client-side dynamic loader registry.
// Register all newly developed tools here to compile them in the client bundle.
const TOOLS_COMPONENTS: Record<string, ComponentType> = {
  'uuid-generator': dynamic(() => import('@/components/tools/uuid-generator'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'word-counter': dynamic(() => import('@/components/tools/word-counter'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'json-formatter': dynamic(() => import('@/components/tools/json-formatter'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'url-encoder': dynamic(() => import('@/components/tools/url-encoder'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'base64-converter': dynamic(() => import('@/components/tools/base64-converter'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'password-generator': dynamic(() => import('@/components/tools/password-generator'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'jwt-decoder': dynamic(() => import('@/components/tools/jwt-decoder'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'hash-generator': dynamic(() => import('@/components/tools/hash-generator'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'case-converter': dynamic(() => import('@/components/tools/case-converter'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'remove-duplicate-lines': dynamic(() => import('@/components/tools/remove-duplicate-lines'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'lorem-ipsum-generator': dynamic(() => import('@/components/tools/lorem-ipsum-generator'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'pomodoro-timer': dynamic(() => import('@/components/tools/pomodoro-timer'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'pdf-merge': dynamic(() => import('@/components/tools/pdf-merge'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'pdf-split': dynamic(() => import('@/components/tools/pdf-split'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'pdf-compress': dynamic(() => import('@/components/tools/pdf-compress'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'images-to-pdf': dynamic(() => import('@/components/tools/images-to-pdf'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'image-compressor': dynamic(() => import('@/components/tools/image-compressor'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'image-resizer': dynamic(() => import('@/components/tools/image-resizer'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'image-format-converter': dynamic(() => import('@/components/tools/image-format-converter'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'image-cropper': dynamic(() => import('@/components/tools/image-cropper'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'fullscreen-clock': dynamic(() => import('@/components/tools/fullscreen-clock'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'stopwatch': dynamic(() => import('@/components/tools/stopwatch'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'countdown-timer': dynamic(() => import('@/components/tools/countdown-timer'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'qr-generator': dynamic(() => import('@/components/tools/qr-generator'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'barcode-generator': dynamic(() => import('@/components/tools/barcode-generator'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'color-picker': dynamic(() => import('@/components/tools/color-picker'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
  'unit-converter': dynamic(() => import('@/components/tools/unit-converter'), {
    loading: () => <div className="animate-pulse bg-muted h-64 rounded-lg w-full" />,
    ssr: false,
  }),
};

interface ToolContainerProps {
  slug: string;
}

export function ToolContainer({ slug }: ToolContainerProps) {
  const ToolComponent = TOOLS_COMPONENTS[slug] || FallbackTool;
  return <ToolComponent />;
}

export default ToolContainer;
