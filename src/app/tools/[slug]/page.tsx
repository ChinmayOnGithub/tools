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
import PrivacyCard from '@/components/shared/PrivacyCard';

export async function generateStaticParams() {
  return TOOLS_REGISTRY.map((tool) => ({
    slug: tool.id,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
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

export default async function ToolWrapperPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS_REGISTRY.find((t) => t.id === slug);

  if (!tool) {
    notFound();
  }

  const isPublished = tool.status === 'published';
  const category = CATEGORIES.find((c) => c.id === tool.category);
  const colors = CATEGORY_COLOR_MAP[category?.color || 'orange'] || CATEGORY_COLOR_MAP.orange;
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

  // 2. Software & Web Application Schema
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'WebApplication'],
    'name': tool.name,
    'url': `${siteUrl}/tools/${tool.id}`,
    'description': tool.description,
    'applicationCategory': category?.title || 'UtilityApplication',
    'operatingSystem': 'Any',
    'browserRequirements': 'Requires modern web browser with HTML5 and JavaScript enabled.',
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
          <Link href={`/categories/${tool.category}`} className={`hover:underline capitalize font-bold ${colors.text}`}>{category?.title || tool.category}</Link>
          <span>/</span>
          <span className="font-semibold text-foreground">{tool.name}</span>
        </nav>

        {/* Coming Soon Hero */}
        <div className="text-center py-12 px-6 bg-muted/10 border-2 border-dashed border-border flex flex-col items-center gap-4">
          <span className={`text-[10px] px-3 py-1 border font-bold uppercase tracking-wider select-none ${colors.badge}`}>
            {getLifecycleLabel(tool.status)}
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {tool.name} is Coming Soon
          </h1>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-sm leading-relaxed">
            This utility is currently under active planning or development. Like all our tools, it will process data 100% locally in your browser.
          </p>
          <div className="mt-2 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className={`inline-flex h-10 items-center justify-center border-2 border-primary bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
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
    <div className="max-w-7xl mx-auto w-full">
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

      {/* Main Grid: 2 Cols Left Workspace, 1 Col Right Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Left Workspace Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Breadcrumb Navigation */}
          <nav className="text-xs text-muted-foreground flex gap-2 items-center mb-1" aria-label="Breadcrumb">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href={`/categories/${tool.category}`} className={`hover:underline capitalize font-bold ${colors.text}`}>{category?.title || tool.category}</Link>
            <span>/</span>
            <span className="font-semibold text-foreground">{tool.name}</span>
          </nav>

          {/* Hero Title Header */}
          <section className="relative bg-card border-2 border-border p-6 card-depth-1 overflow-hidden">
            {/* Top accent bar matching category */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bar}`} />
            
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
                className={`inline-flex items-center px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest border ${colors.badge}`}
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

          {/* In-Result High Viewability Ad Container */}
          <AdContainer slot="middle" />

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

              {/* Technical Specifications & Standards */}
              {seoContent.technicalOverview && (
                <div className="bg-card border-2 border-border p-4 space-y-2 text-xs">
                  <h2 className="text-sm font-bold text-foreground">Technical Specifications & Standards</h2>
                  <p className="text-muted-foreground leading-relaxed">{seoContent.technicalOverview}</p>
                </div>
              )}

              {/* Step-by-Step Operating Guide & Common Professional Use Cases */}
              {((seoContent.stepByStepGuide && seoContent.stepByStepGuide.length > 0) || (seoContent.useCases && seoContent.useCases.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  {seoContent.stepByStepGuide && seoContent.stepByStepGuide.length > 0 && (
                    <div className="space-y-2 border-2 border-border p-4 bg-muted/20">
                      <h2 className="text-sm font-bold text-foreground">Step-by-Step Operating Guide</h2>
                      <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground font-medium">
                        {seoContent.stepByStepGuide.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {seoContent.useCases && seoContent.useCases.length > 0 && (
                    <div className="space-y-2 border-2 border-border p-4 bg-muted/20">
                      <h2 className="text-sm font-bold text-foreground">Common Professional Use Cases</h2>
                      <ul className="list-disc list-inside space-y-1.5 text-muted-foreground font-medium">
                        {seoContent.useCases.map((useCase, idx) => (
                          <li key={idx}>{useCase}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

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

              {/* Troubleshooting & Error Handling */}
              {seoContent.troubleshooting && seoContent.troubleshooting.length > 0 && (
                <div className="space-y-2 border-2 border-border p-4 bg-card">
                  <h2 className="text-sm font-bold text-foreground">Troubleshooting & Edge-Case Guidance</h2>
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {seoContent.troubleshooting.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

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

          <AdContainer slot="bottom" />
        </div>

        {/* Right Desktop Sticky Sidebar Column */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-24 space-y-6">
          {/* Sidebar Privacy Inspector Widget */}
          <PrivacyCard toolId={tool.id} />

          {/* Sidebar High eCPM Ad Container (300x600) */}
          <div className="bg-card border-2 border-border p-2 card-depth-1 overflow-hidden">
            <AdContainer slot="sidebar" />
          </div>

          {/* Security & Privacy Guarantee Widget */}
          <div className="bg-card border-2 border-border p-5 space-y-3 card-depth-1">
            <div className="flex items-center gap-2 font-extrabold text-xs text-foreground uppercase tracking-wider">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Zero Server Uploads</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All computations on CoolTools execute 100% inside your local browser memory tab. Your confidential files, tokens, and documents never touch remote servers.
            </p>
            <Link
              href="/docs/security-network-audit"
              className="text-xs font-bold text-primary hover:underline block pt-1"
            >
              Learn how to audit with DevTools →
            </Link>
          </div>
        </aside>

      </div>
    </div>
  );
}
