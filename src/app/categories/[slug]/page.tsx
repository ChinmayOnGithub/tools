import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/config/site';
import { CATEGORIES } from '@/config/categories';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import ToolCard from '@/components/shared/ToolCard';
import AdContainer from '@/components/shared/AdContainer';

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
      <section className="relative bg-card border-2 border-border p-6 sm:p-8 card-depth-1 overflow-hidden">
        {/* Top accent bar matching category */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bar}`} />
        
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {category.title}
        </h1>
        <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          {category.description}
        </p>
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
              {availableTools.length} Live
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

        {/* Educational Guarantee Section */}
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-3">
          <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider">
            Why Use Client-Side {category.title}?
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All utilities in the <strong className="text-foreground">{category.title}</strong> category operate 100% locally inside your web browser. No document streams, binary files, API keys, or text inputs are transmitted to external servers, providing mathematical data privacy and zero cloud retention risk.
          </p>
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
