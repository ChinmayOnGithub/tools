import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { DOCS_ARTICLES } from '@/config/docs-data';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { SITE_URL } from '@/config/site';
import ToolCard from '@/components/shared/ToolCard';
import FaqSection from '@/components/shared/FaqSection';
import AdContainer from '@/components/shared/AdContainer';

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DOCS_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = DOCS_ARTICLES.find((a) => a.slug === slug);

  if (!article) return {};

  const siteUrl = SITE_URL;

  return {
    title: `${article.title} - CoolTools Guide`,
    description: article.description,
    alternates: {
      canonical: `${siteUrl}/docs/${slug}`,
    },
    openGraph: {
      title: `${article.title} - CoolTools Documentation`,
      description: article.description,
      url: `${siteUrl}/docs/${slug}`,
      type: 'article',
    },
  };
}

export default async function DocArticlePage({ params }: DocPageProps) {
  const { slug } = await params;
  const article = DOCS_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const siteUrl = SITE_URL;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    url: `${siteUrl}/docs/${article.slug}`,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: 'Chinmay Patil',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Documentation', item: `${siteUrl}/docs` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${siteUrl}/docs/${article.slug}` },
    ],
  };

  // Find related tool objects
  const relatedToolObjects = TOOLS_REGISTRY.filter(
    (t) => article.relatedTools.includes(t.id) && t.status === 'published'
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-muted-foreground flex gap-2 items-center" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/docs" className="hover:underline">Documentation</Link>
        <span>/</span>
        <span className="font-semibold text-foreground truncate">{article.title}</span>
      </nav>

      {/* Hero Title Panel */}
      <section className="relative bg-card border-2 border-border p-6 sm:p-8 card-depth-1 space-y-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
            <BookOpen className="h-3 w-3" />
            <span>Guide</span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{article.readTime}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated {article.updatedAt}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          {article.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {article.description}
        </p>
      </section>

      {/* Article Body Content */}
      <article className="bg-card border-2 border-border p-6 sm:p-8 card-depth-1 space-y-8">
        {/* Overview Box */}
        <div className="bg-muted/20 border-2 border-border p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Executive Overview</span>
          </h2>
          <p>{article.overview}</p>
        </div>

        {/* Sections */}
        {article.sections.map((sec, idx) => (
          <div key={idx} className="space-y-3 pt-4 border-t border-border/50 first:border-0 first:pt-0">
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              {sec.heading}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {sec.content}
            </p>
            {sec.codeSnippet && (
              <pre className="p-3 bg-background border-2 border-border font-mono text-[11px] overflow-auto whitespace-pre-wrap text-foreground">
                {sec.codeSnippet}
              </pre>
            )}
          </div>
        ))}

        {/* FAQs */}
        {article.faqs.length > 0 && (
          <div className="pt-6 border-t-2 border-border">
            <FaqSection faqs={article.faqs} />
          </div>
        )}
      </article>

      {/* Related Tools Section */}
      {relatedToolObjects.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">
            Try Related Tools Client-Side
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedToolObjects.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* Back to Docs Index */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Documentation Index</span>
        </Link>
      </div>

      <AdContainer slot="bottom" />
    </div>
  );
}
