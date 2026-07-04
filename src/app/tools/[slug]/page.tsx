import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_URL } from '@/config/site';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { CATEGORIES } from '@/config/categories';
import { SEO_CONTENT_MAP } from '@/config/seo-content';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import AdContainer from '@/components/shared/AdContainer';
import ToolContainer from '@/components/shared/ToolContainer';
import ToolCard from '@/components/shared/ToolCard';
import FaqSection from '@/components/shared/FaqSection';

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

  const siteUrl = SITE_URL;

  return {
    title: tool.seoTitle || tool.name,
    description: tool.seoDescription || tool.description,
    alternates: {
      canonical: `${siteUrl}/tools/${slug}`,
    },
    openGraph: {
      title: tool.seoTitle || tool.name,
      description: tool.seoDescription || tool.description,
      url: `${siteUrl}/tools/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.seoTitle || tool.name,
      description: tool.seoDescription || tool.description,
    }
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
  const category = CATEGORIES.find((c) => c.id === tool.category);
  const seoContent = SEO_CONTENT_MAP[slug];

  // Filter related tools that are published and active
  const relatedPublished = TOOLS_REGISTRY.filter(
    (t) => tool.relatedTools.includes(t.id) && t.status === 'published'
  );

  const siteUrl = SITE_URL;

  // 1. Breadcrumb Schema List
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': category?.title || tool.category,
        'item': `${siteUrl}/categories/${tool.category}`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': tool.name,
        'item': `${siteUrl}/tools/${tool.id}`,
      },
    ],
  };

  // 2. Software Application Schema
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': tool.name,
    'description': tool.description,
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'Requires an HTML5-capable web browser.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  };

  // 3. FAQ Schema Page
  const faqSchema = seoContent && seoContent.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': seoContent.faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a,
      },
    })),
  } : null;

  if (!isPublished) {
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
          <Link href={`/categories/${tool.category}`} className="hover:underline capitalize">{category?.title || tool.category}</Link>
          <span>/</span>
          <span className="font-semibold text-foreground">{tool.name}</span>
        </nav>

        {/* Coming Soon Hero */}
        <div className="text-center py-12 px-6 bg-muted/10 border-2 border-dashed border-border flex flex-col items-center gap-4">
          <span className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1 border border-amber-500/20 font-bold uppercase tracking-wider select-none">
            {getLifecycleLabel(tool.status)}
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {tool.name} is Coming Soon
          </h1>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed">
            This utility is currently under active planning or development. Like all our tools, it will process data 100% locally in your browser.
          </p>
          <div className="mt-2 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center border-2 border-primary bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Explore Available Tools
            </Link>
          </div>
        </div>

        {/* Related Published Recommendations */}
        {relatedPublished.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Working Alternatives Available Today:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPublished.map((relTool) => (
                <ToolCard key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-muted-foreground flex gap-2 items-center mb-1" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href={`/categories/${tool.category}`} className="hover:underline capitalize">{category?.title || tool.category}</Link>
        <span>/</span>
        <span className="font-semibold text-foreground">{tool.name}</span>
      </nav>

      {/* Hero Title Header */}
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {tool.name}
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed max-w-2xl">
          {tool.description}
        </p>
      </section>

      {/* Local trust indicators */}
      <div className="flex flex-wrap gap-2 select-none">
        {['Local Processing', 'Privacy Safe', 'No Uploads', '100% Free', 'Instant'].map((text) => (
          <span 
            key={text} 
            className="inline-flex items-center bg-muted/30 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground border border-border"
          >
            {text}
          </span>
        ))}
      </div>

      <AdContainer slot="top" />

      {/* Dynamic Client Tool component */}
      <main className="min-h-[300px]">
        <ErrorBoundary>
          <ToolContainer slug={slug} />
        </ErrorBoundary>
      </main>

      {/* Dynamic SEO Resource Content Block */}
      {seoContent && (
        <article className="border-t pt-8 mt-6 space-y-8">
          
          {/* Explanation, How it Works, Privacy Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-foreground">What is this tool?</h2>
              <p className="text-muted-foreground">{seoContent.explanation}</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-foreground">When to use it?</h2>
              <p className="text-muted-foreground">{seoContent.whenToUse}</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-foreground">How does it work?</h2>
              <p className="text-muted-foreground">{seoContent.howItWorks}</p>
            </div>
          </div>

          {/* Example Input / Output mockup */}
          <div className="bg-muted/30 border-2 border-border p-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Example Conversions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted-foreground">Sample Input:</span>
                <pre className="p-2.5 bg-background border-2 border-border font-mono text-[11px] overflow-auto max-h-32 whitespace-pre-wrap">{seoContent.exampleInput}</pre>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Sample Output:</span>
                <pre className="p-2.5 bg-background border-2 border-border font-mono text-[11px] overflow-auto max-h-32 whitespace-pre-wrap">{seoContent.exampleOutput}</pre>
              </div>
            </div>
          </div>

          {/* FAQs section */}
          {seoContent.faqs.length > 0 && (
            <FaqSection faqs={seoContent.faqs} />
          )}
        </article>
      )}

      {/* Related Utilities Showcase */}
      {relatedPublished.length > 0 && (
        <section className="border-t-2 border-border pt-6 mt-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPublished.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} trackingLabel={`${tool.id} -> ${relTool.id}`} />
            ))}
          </div>
        </section>
      )}

      {/* Ad Container strictly at the bottom */}
      <AdContainer slot="bottom" />
    </div>
  );
}
