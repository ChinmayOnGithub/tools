import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/config/site';
import { CATEGORIES } from '@/config/categories';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import ToolCard from '@/components/shared/ToolCard';
import AdContainer from '@/components/shared/AdContainer';
import { ShieldCheck, CheckCircle2, Terminal } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) return {};

  const siteUrl = SITE_URL;

  return {
    title: category.seoTitle,
    description: category.seoDescription,
    alternates: {
      canonical: `${siteUrl}/categories/${slug}`,
    },
  };
}

const CATEGORY_COLOR_MAP: Record<string, {
  bar: string;
  text: string;
  badge: string;
}> = {
  red: {
    bar: 'bg-red-500',
    text: 'text-red-600 dark:text-red-400',
    badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20',
  },
  blue: {
    bar: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  },
  emerald: {
    bar: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  },
  orange: {
    bar: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
    badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20',
  },
  violet: {
    bar: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20',
  },
  amber: {
    bar: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  },
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const colors = CATEGORY_COLOR_MAP[category.color] || CATEGORY_COLOR_MAP.orange;

  const matchingTools = TOOLS_REGISTRY.filter((tool) => tool.category === category.id);
  const availableTools = matchingTools.filter((t) => t.status === 'published');
  const upcomingTools = matchingTools.filter((t) => t.status !== 'published');

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.title,
    description: category.seoDescription,
    url: `${SITE_URL}/categories/${category.slug}`,
  };

  return (
    <div className="flex flex-col gap-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground flex gap-2 items-center" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className={`font-bold ${colors.text}`}>{category.title}</span>
      </nav>

      {/* Header Panel */}
      <section className="relative bg-card border-2 border-border p-6 sm:p-8 card-depth-1 overflow-hidden space-y-4">
        <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bar}`} />
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {category.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* Domain Overview Context */}
        {category.overview && (
          <div className="pt-2 text-xs text-muted-foreground/90 leading-relaxed border-t border-border/40">
            {category.overview}
          </div>
        )}
      </section>

      {/* Ad slot */}
      <AdContainer slot="top" />

      {/* Tools Loop Grid */}
      <main id="content" className="min-h-[40vh] space-y-12">
        {/* Available Tools */}
        <div>
          <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Available Tools
            </h2>
            <span className={`inline-flex items-center px-3 py-1 border text-xs font-bold uppercase tracking-wider ${colors.badge}`}>
              {availableTools.length} Available
            </span>
          </div>
          {availableTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border bg-muted/20 max-w-lg mx-auto">
              <p className="text-sm font-bold text-foreground">No Tools Available</p>
              <p className="text-xs text-muted-foreground mt-1">Check upcoming tools below or explore other categories.</p>
            </div>
          )}
        </div>

        {/* Core Domain Workflows */}
        {category.coreUseCases && category.coreUseCases.length > 0 && (
          <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-4">
            <div className="flex items-center gap-2 text-foreground font-bold text-sm">
              <Terminal className="h-5 w-5 text-primary" />
              <h2>Common Workflows &amp; Tasks in {category.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
              {category.coreUseCases.map((useCase, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2.5 bg-muted/20 border border-border">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educational Architecture Section */}
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2>{category.slug === 'live-data' ? 'Public API Data Flow & Architecture' : `How Local Browser Processing Works in ${category.title}`}</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {category.slug === 'live-data'
              ? 'Utilities in this category retrieve current public data directly from official third-party open web APIs (such as GitHub, Open-Meteo, European Central Bank, REST Countries, Nager.Date, and NASA). No account registration or private API keys are required, and queries are not stored on our servers.'
              : `All utilities in the ${category.title} category operate locally inside your web browser using modern Web APIs (such as Web Crypto, HTML5 Canvas, FileReader, and WebAssembly). Your document streams, binary files, tokens, and text inputs remain inside your local browser memory and are not sent to any backend tool-processing servers.`}
          </p>
          <div className="pt-2">
            <Link
              href="/docs/security-network-audit"
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn how to inspect network requests with browser DevTools →
            </Link>
          </div>
        </div>

        {/* Upcoming Tools */}
        {upcomingTools.length > 0 && (
          <div className="border-t-2 border-border pt-10">
            <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Coming Soon
              </h2>
              <span className="inline-flex items-center bg-muted text-muted-foreground px-3 py-1 border border-border text-xs font-bold uppercase tracking-wider">
                {upcomingTools.length} Pipeline
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Ad slot */}
      <AdContainer slot="bottom" />
    </div>
  );
}
