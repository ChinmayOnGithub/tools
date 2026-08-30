'use client';

import dynamic from 'next/dynamic';
import { ComponentType, useEffect } from 'react';
import { ToolSkeleton } from '@/components/shared/ToolSkeleton';

const FallbackTool: ComponentType = () => (
  <div className="p-6 text-center border-2 border-dashed border-border">
    <p className="text-sm text-muted-foreground">Tool module configuration is under construction.</p>
  </div>
);
FallbackTool.displayName = 'FallbackTool';

// Shared loading element — used by every dynamic import
const toolLoader = () => <ToolSkeleton />;

// Client-side dynamic loader registry.
// Register all newly developed tools here to compile them in the client bundle.
const TOOLS_COMPONENTS: Record<string, ComponentType<{ slug?: string }>> = {
  'uuid-generator': dynamic(() => import('@/components/tools/uuid-generator'), {
    loading: toolLoader,
    ssr: false,
  }),
  'word-counter': dynamic(() => import('@/components/tools/word-counter'), {
    loading: toolLoader,
    ssr: false,
  }),
  'json-formatter': dynamic(() => import('@/components/tools/json-formatter'), {
    loading: toolLoader,
    ssr: false,
  }),
  'json-validator': dynamic(() => import('@/components/tools/json-validator'), {
    loading: toolLoader,
    ssr: false,
  }),
  'url-encoder': dynamic(() => import('@/components/tools/url-encoder'), {
    loading: toolLoader,
    ssr: false,
  }),
  'base64-converter': dynamic(() => import('@/components/tools/base64-converter'), {
    loading: toolLoader,
    ssr: false,
  }),
  'password-generator': dynamic(() => import('@/components/tools/password-generator'), {
    loading: toolLoader,
    ssr: false,
  }),
  'jwt-decoder': dynamic(() => import('@/components/tools/jwt-decoder'), {
    loading: toolLoader,
    ssr: false,
  }),
  'hash-generator': dynamic(() => import('@/components/tools/hash-generator'), {
    loading: toolLoader,
    ssr: false,
  }),
  'case-converter': dynamic(() => import('@/components/tools/case-converter'), {
    loading: toolLoader,
    ssr: false,
  }),
  'remove-duplicate-lines': dynamic(() => import('@/components/tools/remove-duplicate-lines'), {
    loading: toolLoader,
    ssr: false,
  }),
  'lorem-ipsum-generator': dynamic(() => import('@/components/tools/lorem-ipsum-generator'), {
    loading: toolLoader,
    ssr: false,
  }),
  'pomodoro-timer': dynamic(() => import('@/components/tools/pomodoro-timer'), {
    loading: toolLoader,
    ssr: false,
  }),
  'pdf-merge': dynamic(() => import('@/components/tools/pdf-merge'), {
    loading: toolLoader,
    ssr: false,
  }),
  'pdf-split': dynamic(() => import('@/components/tools/pdf-split'), {
    loading: toolLoader,
    ssr: false,
  }),
  'images-to-pdf': dynamic(() => import('@/components/tools/images-to-pdf'), {
    loading: toolLoader,
    ssr: false,
  }),
  'pdf-compress': dynamic(() => import('@/components/tools/pdf-compress'), {
    loading: toolLoader,
    ssr: false,
  }),
  'image-compressor': dynamic(() => import('@/components/tools/image-compressor'), {
    loading: toolLoader,
    ssr: false,
  }),
  'image-resizer': dynamic(() => import('@/components/tools/image-resizer'), {
    loading: toolLoader,
    ssr: false,
  }),
  'image-format-converter': dynamic(() => import('@/components/tools/image-format-converter'), {
    loading: toolLoader,
    ssr: false,
  }),
  'image-cropper': dynamic(() => import('@/components/tools/image-cropper'), {
    loading: toolLoader,
    ssr: false,
  }),
  'fullscreen-clock': dynamic(() => import('@/components/tools/fullscreen-clock'), {
    loading: toolLoader,
    ssr: false,
  }),
  'stopwatch': dynamic(() => import('@/components/tools/stopwatch'), {
    loading: toolLoader,
    ssr: false,
  }),
  'countdown-timer': dynamic(() => import('@/components/tools/countdown-timer'), {
    loading: toolLoader,
    ssr: false,
  }),
  'qr-generator': dynamic(() => import('@/components/tools/qr-generator'), {
    loading: toolLoader,
    ssr: false,
  }),
  'barcode-generator': dynamic(() => import('@/components/tools/barcode-generator'), {
    loading: toolLoader,
    ssr: false,
  }),
  'color-picker': dynamic(() => import('@/components/tools/color-picker'), {
    loading: toolLoader,
    ssr: false,
  }),
  'unit-converter': dynamic(() => import('@/components/tools/unit-converter'), {
    loading: toolLoader,
    ssr: false,
  }),
  'timestamp-explorer': dynamic(() => import('@/components/tools/timestamp-explorer'), {
    loading: toolLoader,
    ssr: false,
  }),
  'unicode-inspector': dynamic(() => import('@/components/tools/unicode-inspector'), {
    loading: toolLoader,
    ssr: false,
  }),
  'github-explorer': dynamic(() => import('@/components/tools/github-explorer'), {
    loading: toolLoader,
    ssr: false,
  }),
  'weather-forecast': dynamic(() => import('@/components/tools/weather-forecast'), {
    loading: toolLoader,
    ssr: false,
  }),
  'currency-converter': dynamic(() => import('@/components/tools/currency-converter'), {
    loading: toolLoader,
    ssr: false,
  }),
  'country-info': dynamic(() => import('@/components/tools/country-info'), {
    loading: toolLoader,
    ssr: false,
  }),
  'public-holidays': dynamic(() => import('@/components/tools/public-holidays'), {
    loading: toolLoader,
    ssr: false,
  }),
  'astronomy-picture': dynamic(() => import('@/components/tools/astronomy-picture'), {
    loading: toolLoader,
    ssr: false,
  }),
  'http-status-explorer': dynamic(() => import('@/components/tools/http-status-explorer'), {
    loading: toolLoader,
    ssr: false,
  }),
};

interface ToolContainerProps {
  slug: string;
}

interface CustomWindow extends Window {
  __isInitializing?: boolean;
}

export function ToolContainer({ slug }: ToolContainerProps) {
  const ToolComponent = TOOLS_COMPONENTS[slug] || FallbackTool;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const customWindow = window as unknown as CustomWindow;
      customWindow.__isInitializing = true;
      const timer = setTimeout(() => {
        customWindow.__isInitializing = false;
      }, 1000); // Guard window for 1 second of initial mount auto-runs
      return () => clearTimeout(timer);
    }
  }, [slug]);

  return <ToolComponent key={slug} slug={slug} />;
}

export default ToolContainer;
