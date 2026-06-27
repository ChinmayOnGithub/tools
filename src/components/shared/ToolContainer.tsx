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
};

interface ToolContainerProps {
  slug: string;
}

export function ToolContainer({ slug }: ToolContainerProps) {
  const ToolComponent = TOOLS_COMPONENTS[slug] || FallbackTool;
  return <ToolComponent />;
}

export default ToolContainer;
