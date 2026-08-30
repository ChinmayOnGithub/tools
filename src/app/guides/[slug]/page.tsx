import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  ArrowLeft, 
  AlertTriangle, 
  ShieldCheck, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { GUIDES_ARTICLES, WORKFLOWS_DATA } from '@/config/guides-data';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { SITE_URL } from '@/config/site';
import ToolCard from '@/components/shared/ToolCard';
import TryTool from '@/components/shared/TryTool';
import InteractiveExampleRunner from '@/components/shared/InteractiveExampleRunner';
import AdContainer from '@/components/shared/AdContainer';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDES_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES_ARTICLES.find((g) => g.slug === slug);

  if (!guide) return {};

  const siteUrl = SITE_URL;

  return {
    title: `${guide.title} - CoolTools Guide`,
    description: guide.shortDescription,
    alternates: {
      canonical: `${siteUrl}/guides/${slug}`,
    },
    openGraph: {
      title: `${guide.title} - CoolTools Developer Guide`,
      description: guide.shortDescription,
      url: `${siteUrl}/guides/${slug}`,
      type: 'article',
    },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = GUIDES_ARTICLES.find((g) => g.slug === slug);

  if (!guide) {
    notFound();
  }

  const siteUrl = SITE_URL;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: guide.title,
    description: guide.shortDescription,
    url: `${siteUrl}/guides/${guide.slug}`,
    dateModified: guide.updatedAt,
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
      { '@type': 'ListItem', position: 2, name: 'Problem Guides', item: `${siteUrl}/guides` },
      { '@type': 'ListItem', position: 3, name: guide.title, item: `${siteUrl}/guides/${guide.slug}` },
    ],
  };

  const primaryTool = TOOLS_REGISTRY.find((t) => t.id === guide.primaryToolId);
  const relatedTools = TOOLS_REGISTRY.filter(
    (t) => guide.relatedToolIds.includes(t.id) && t.status === 'published'
  );

  const workflow = guide.workflowSlug
    ? WORKFLOWS_DATA.find((w) => w.slug === guide.workflowSlug)
    : null;

  return (
    <div className="w-full space-y-8 py-4">
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
        <Link href="/guides" className="hover:underline">Guides</Link>
        <span>/</span>
        <span className="font-semibold text-foreground truncate">{guide.title}</span>
      </nav>

      {/* Hero Header */}
      <section className="relative bg-card border-2 border-border p-6 sm:p-8 card-depth-2 space-y-4 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 font-black uppercase tracking-wider text-[10px]">
            <BookOpen className="h-3 w-3" />
            <span>{guide.clusterName}</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Clock className="h-3.5 w-3.5" />
            <span>{guide.readTime}</span>
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated {guide.updatedAt}</span>
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
          {guide.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {guide.shortDescription}
        </p>
      </section>

      {/* Article Body */}
      <article className="space-y-8">
        {/* Problem Statement Box */}
        <section className="bg-card border-2 border-border p-6 card-depth-1 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>What Problem Does This Solve?</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">
            {guide.problemStatement}
          </p>
        </section>

        {/* The Short Answer (Executive Summary) */}
        <section className="bg-primary/5 border-2 border-primary/30 p-6 card-depth-1 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>The Short Answer</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed font-semibold">
            {guide.shortAnswer}
          </p>
        </section>

        {/* In-Depth Technical Explanation */}
        <section className="bg-card border-2 border-border p-6 sm:p-8 card-depth-1 space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-foreground">
            Why This Happens (Technical Deep Dive)
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {guide.technicalReason}
          </p>
        </section>

        {/* Interactive Comparison & Runnable Examples */}
        {guide.examples.length > 0 && primaryTool && (
          <section className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                Side-by-Side Analysis
              </span>
              <h2 className="text-lg font-black text-foreground">
                Practical Code Examples &amp; Verified Fixes
              </h2>
            </div>
            <InteractiveExampleRunner
              examples={guide.examples}
              toolId={primaryTool.id}
              toolName={primaryTool.name}
            />
          </section>
        )}

        {/* Direct Interactive Tool CTA */}
        {primaryTool && (
          <section className="space-y-3">
            <TryTool
              toolId={primaryTool.id}
              actionText={`Open in ${primaryTool.name}`}
              sampleInput={guide.samplePayload}
            />
          </section>
        )}

        {/* Common Mistakes */}
        {guide.commonMistakes.length > 0 && (
          <section className="bg-card border-2 border-border p-6 card-depth-1 space-y-3">
            <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
              Common Mistakes Developers Make
            </h2>
            <ul className="list-disc list-inside space-y-2 text-xs text-muted-foreground leading-relaxed">
              {guide.commonMistakes.map((mistake, idx) => (
                <li key={idx}>
                  <strong className="text-foreground">{mistake.split('(')[0]}</strong>
                  {mistake.includes('(') ? ` (${mistake.split('(').slice(1).join('(')}` : ''}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Limitations & Edge Cases */}
        {guide.limitations.length > 0 && (
          <section className="bg-muted/20 border-2 border-border p-6 space-y-3 text-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              Technical Limitations &amp; Boundary Conditions
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
              {guide.limitations.map((limit, idx) => (
                <li key={idx}>{limit}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Associated Workflow Link */}
        {workflow && (
          <section className="bg-card border-2 border-border p-5 card-depth-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary">
                <Layers className="h-3.5 w-3.5" />
                <span>Recommended Multi-Tool Workflow</span>
              </div>
              <h3 className="text-sm font-black text-foreground">{workflow.title}</h3>
              <p className="text-xs text-muted-foreground">{workflow.description}</p>
            </div>
            <Link
              href={`/workflows/${workflow.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-border bg-muted/40 text-xs font-bold hover:border-primary hover:text-primary transition-colors shrink-0"
            >
              <span>View Full Workflow</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </section>
        )}

        {/* Standards & Technical References */}
        {guide.references.length > 0 && (
          <section className="bg-card border-2 border-border p-5 card-depth-1 space-y-3 text-xs">
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span>Standards &amp; Authoritative References</span>
            </h2>
            <ul className="space-y-1.5 pt-1">
              {guide.references.map((ref, idx) => (
                <li key={idx}>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
                  >
                    <span>{ref.title}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <section className="space-y-4 pt-4 border-t-2 border-border">
          <h2 className="text-lg font-bold text-foreground">
            Continue Workflow in Related Client-Side Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </section>
      )}

      {/* Back to Guides Index */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Problem Guides Index</span>
        </Link>
      </div>

      <AdContainer slot="bottom" />
    </div>
  );
}
