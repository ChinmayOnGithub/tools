import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import AdContainer from '@/components/shared/AdContainer';
import ToolContainer from '@/components/shared/ToolContainer';
import ToolCard from '@/components/shared/ToolCard';

export async function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({
    slug: tool.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY.find((t) => t.id === slug);
  
  if (!tool) {
    return {};
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.chinmaypatil.com';

  return {
    title: tool.name,
    description: tool.description,
    alternates: {
      canonical: `${siteUrl}/tools/${slug}`,
    },
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ToolWrapperPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY.find((t) => t.id === slug);

  if (!tool) {
    notFound();
  }

  const isPublished = tool.status === 'published';

  if (!isPublished) {
    // Filter related tools that are published and active
    const relatedPublished = TOOLS_REGISTRY.filter(
      (t) => tool.relatedTools.includes(t.id) && t.status === 'published'
    );

    const getLifecycleLabel = (status: typeof tool.status) => {
      switch (status) {
        case 'planned': return 'Planned';
        case 'draft': return 'Draft Specification';
        case 'in-development': return 'In Active Development';
        case 'testing': return 'Testing Phase';
        default: return 'Planned';
      }
    };

    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground flex gap-2 items-center mb-2" aria-label="Breadcrumb">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/#categories" className="hover:underline capitalize">{tool.category}</Link>
          <span>/</span>
          <span className="font-semibold text-foreground">{tool.name}</span>
        </nav>

        {/* Coming Soon Hero */}
        <div className="text-center py-16 px-6 bg-muted/10 border border-dashed rounded-2xl flex flex-col items-center gap-4">
          <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-semibold border border-amber-500/20 select-none">
            {getLifecycleLabel(tool.status)}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {tool.name} is Coming Soon
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-md leading-relaxed">
            This utility is currently under active planning or development. Like all our tools, it will process data 100% locally in your browser.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Explore Available Tools
            </Link>
          </div>
        </div>

        {/* Related Published Recommendations */}
        {relatedPublished.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Working Alternatives Available Today:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPublished.map((relTool) => (
                <div key={relTool.id}>
                  <ToolCard tool={relTool} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <nav className="text-xs text-muted-foreground flex gap-2 items-center mb-2" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/#categories" className="hover:underline capitalize">{tool.category}</Link>
        <span>/</span>
        <span className="font-semibold text-foreground">{tool.name}</span>
      </nav>

      <section className="mb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {tool.name}
        </h1>
        <p className="mt-2 text-base text-muted-foreground leading-relaxed">
          {tool.description}
        </p>
      </section>

      {/* Top Tool Ad Placement */}
      <AdContainer />

      <main className="min-h-[300px]">
        <ErrorBoundary>
          <ToolContainer slug={slug} />
        </ErrorBoundary>
      </main>

      {/* Bottom Tool Ad Placement */}
      <AdContainer />
    </div>
  );
}
