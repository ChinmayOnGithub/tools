import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Layers, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Terminal } from 'lucide-react';
import { WORKFLOWS_DATA, GUIDES_ARTICLES } from '@/config/guides-data';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { SITE_URL } from '@/config/site';
import ToolCard from '@/components/shared/ToolCard';
import AdContainer from '@/components/shared/AdContainer';

interface WorkflowPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return WORKFLOWS_DATA.map((wf) => ({
    slug: wf.slug,
  }));
}

export async function generateMetadata({ params }: WorkflowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const workflow = WORKFLOWS_DATA.find((w) => w.slug === slug);

  if (!workflow) return {};

  const siteUrl = SITE_URL;

  return {
    title: `${workflow.title} - CoolTools Workflow`,
    description: workflow.description,
    alternates: {
      canonical: `${siteUrl}/workflows/${slug}`,
    },
    openGraph: {
      title: `${workflow.title} - CoolTools Multi-Tool Workflow`,
      description: workflow.description,
      url: `${siteUrl}/workflows/${slug}`,
      type: 'article',
    },
  };
}

export default async function WorkflowPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const workflow = WORKFLOWS_DATA.find((w) => w.slug === slug);

  if (!workflow) {
    notFound();
  }

  const siteUrl = SITE_URL;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}/guides` },
      { '@type': 'ListItem', position: 3, name: workflow.title, item: `${siteUrl}/workflows/${workflow.slug}` },
    ],
  };

  const relatedGuides = GUIDES_ARTICLES.filter((g) =>
    workflow.relatedGuides.includes(g.id)
  );

  return (
    <div className="w-full space-y-10 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className="text-xs text-muted-foreground flex gap-2 items-center" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:underline">Guides</Link>
        <span>/</span>
        <span className="font-semibold text-foreground truncate">{workflow.title}</span>
      </nav>

      {/* Hero Header */}
      <section className="relative bg-card border-2 border-border p-8 sm:p-12 card-depth-2 overflow-hidden space-y-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          <Layers className="h-3.5 w-3.5" />
          <span>Multi-Tool Developer Workflow</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          {workflow.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {workflow.description}
        </p>
      </section>

      {/* Step-by-Step Flow Pipeline */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-border">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
            Pipeline Execution Steps
          </h2>
        </div>

        <div className="space-y-6">
          {workflow.steps.map((step) => {
            const tool = TOOLS_REGISTRY.find((t) => t.id === step.toolId);
            return (
              <div
                key={step.stepNumber}
                className="bg-card border-2 border-border p-6 card-depth-1 space-y-4 relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <h3 className="text-base font-black text-foreground">
                      {step.title}
                    </h3>
                  </div>

                  {tool && (
                    <Link
                      href={`/tools/${tool.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors shadow-sm shrink-0"
                    >
                      <span>Launch {tool.name}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                <div className="p-3 bg-muted/20 border border-border flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-foreground block text-[11px] uppercase tracking-wider">
                      Pro Workflow Tip:
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{step.tips}</p>
                  </div>
                </div>

                {tool && (
                  <div className="pt-2">
                    <ToolCard tool={tool} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Relevant Deep Dive Guides */}
      {relatedGuides.length > 0 && (
        <section className="space-y-4 pt-6 border-t-2 border-border">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
              Deep Dive Problem Guides Related to This Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="bg-card border-2 border-border p-4 card-depth-1 space-y-2 hover:border-primary/50 group transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="font-bold text-primary uppercase">{guide.clusterName}</span>
                  <span>{guide.readTime}</span>
                </div>
                <h3 className="text-xs font-black text-foreground group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {guide.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back to Guides */}
      <div className="flex justify-between items-center pt-4">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Guides Index</span>
        </Link>
      </div>

      <AdContainer slot="bottom" />
    </div>
  );
}
