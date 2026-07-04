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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const matchingTools = TOOLS_REGISTRY.filter((tool) => tool.category === category.id);
  const availableTools = matchingTools.filter((t) => t.status === 'published');
  const upcomingTools = matchingTools.filter((t) => t.status !== 'published');

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground flex gap-2 items-center" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <span className="font-semibold text-foreground">{category.title}</span>
      </nav>

      {/* Header Panel */}
      <section className="border-b-2 border-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {category.title}
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-2xl leading-relaxed">
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
            <span className="inline-flex items-center bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 border border-green-500/20 text-xs font-bold uppercase tracking-wider">
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

        {/* Upcoming Tools */}
        {upcomingTools.length > 0 && (
          <div className="border-t-2 border-border pt-10">
            <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Coming Soon
              </h2>
              <span className="inline-flex items-center bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-1 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
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
