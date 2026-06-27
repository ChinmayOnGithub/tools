import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { CATEGORIES } from '@/config/categories';
import { SEO_CONTENT_MAP } from '@/config/seo-content';
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.chinmaypatil.com';

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
        <div className="text-center py-12 px-6 bg-muted/10 border border-dashed rounded-xl flex flex-col items-center gap-4">
          <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded font-semibold border border-amber-500/20 select-none">
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
              className="inline-flex h-9 items-center justify-center rounded bg-primary px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Explore Available Tools
            </Link>
          </div>
        </div>

        {/* Related Published Recommendations */}
        {relatedPublished.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              Working Alternatives Available Today:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <span className="inline-flex items-center rounded bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Local Processing
        </span>
        <span className="inline-flex items-center rounded bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
          Privacy Safe
        </span>
        <span className="inline-flex items-center rounded bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          No Uploads
        </span>
        <span className="inline-flex items-center rounded bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
          100% Free
        </span>
        <span className="inline-flex items-center rounded bg-pink-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-pink-600 dark:text-pink-400 border border-pink-500/20">
          Instant
        </span>
      </div>

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold leading-relaxed">
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
          <div className="bg-muted/30 border rounded-lg p-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Example Conversions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="space-y-1">
                <span className="text-muted-foreground">Sample Input:</span>
                <pre className="p-2.5 bg-background border rounded font-mono text-[11px] overflow-auto max-h-32 whitespace-pre-wrap">{seoContent.exampleInput}</pre>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground">Sample Output:</span>
                <pre className="p-2.5 bg-background border rounded font-mono text-[11px] overflow-auto max-h-32 whitespace-pre-wrap">{seoContent.exampleOutput}</pre>
              </div>
            </div>
          </div>

          {/* FAQs section */}
          {seoContent.faqs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-tight text-foreground">Frequently Asked Questions</h2>
              <div className="space-y-3 text-xs font-semibold">
                {seoContent.faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-3.5 bg-card">
                    <h3 className="font-bold text-foreground mb-1">{faq.q}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      )}

      {/* Related Utilities Showcase */}
      {relatedPublished.length > 0 && (
        <section className="border-t pt-6 mt-4">
          <h2 className="text-sm font-bold tracking-tight text-foreground mb-4">
            Related Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPublished.map((relTool) => (
              <div key={relTool.id}>
                <ToolCard tool={relTool} trackingLabel={`${tool.id} -> ${relTool.id}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ad Container strictly at the bottom */}
      <AdContainer />
    </div>
  );
}
