import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.chinmaypatil.com';

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
      <section className="border-b pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {category.title}
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-2xl leading-relaxed">
          {category.description}
        </p>
      </section>

      {/* Ad slot */}
      <AdContainer />

      {/* Tools Loop Grid */}
      <main id="content" className="min-h-[40vh] space-y-12">
        {/* Available Tools */}
        <div>
          <h2 className="text-base font-bold tracking-tight text-foreground mb-4">
            Available Tools ({availableTools.length})
          </h2>
          {availableTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTools.map((tool) => (
                <div key={tool.id}>
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed rounded-xl max-w-md mx-auto">
              <p className="text-sm font-semibold text-foreground">No active utilities ready yet</p>
              <p className="text-xs text-muted-foreground mt-1">We are actively compiling tools for this section. Check out upcoming plans below.</p>
            </div>
          )}
        </div>

        {/* Upcoming Tools */}
        {upcomingTools.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-base font-bold tracking-tight text-foreground mb-4">
              Coming Soon ({upcomingTools.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTools.map((tool) => (
                <div key={tool.id} className="opacity-75 hover:opacity-100 transition-opacity">
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Ad slot */}
      <AdContainer />
    </div>
  );
}
