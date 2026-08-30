import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { 
  getGuideBySlug, 
  getPublishedGuideSlugs, 
  getRelatedPublishedGuides,
  getPreviousPublishedGuide,
  getNextPublishedGuide 
} from '@/config/docs-registry';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { SITE_URL } from '@/config/site';

import DocsLayout from '@/components/docs/DocsLayout';
import DocsTableOfContents, { TocItem } from '@/components/docs/DocsTableOfContents';
import DocsCallout from '@/components/docs/DocsCallout';
import DocsCodeBlock from '@/components/docs/DocsCodeBlock';
import DocsComparison from '@/components/docs/DocsComparison';
import ReferenceTable from '@/components/docs/ReferenceTable';
import WorkflowSteps from '@/components/docs/WorkflowSteps';
import DocsPagination from '@/components/docs/DocsPagination';
import TryTool from '@/components/shared/TryTool';
import ToolCard from '@/components/shared/ToolCard';
import AdContainer from '@/components/shared/AdContainer';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const publishedSlugs = getPublishedGuideSlugs();
  return publishedSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found - CoolTools',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = SITE_URL;

  return {
    title: `${guide.title} - CoolTools Documentation`,
    description: guide.shortDescription,
    alternates: {
      canonical: `${siteUrl}/guides/${slug}`,
    },
    openGraph: {
      title: `${guide.title} - Developer Guide`,
      description: guide.shortDescription,
      url: `${siteUrl}/guides/${slug}`,
      type: 'article',
    },
  };
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const siteUrl = SITE_URL;

  // Derive TOC automatically from headings
  const tocItems: TocItem[] = [];
  guide.sections.forEach((sec) => {
    if (sec.type === 'heading') {
      tocItems.push({
        id: sec.id,
        text: sec.text,
        level: sec.level,
      });
    }
  });

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
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}/guides` },
      { '@type': 'ListItem', position: 3, name: guide.categoryTitle, item: `${siteUrl}/guides` },
      { '@type': 'ListItem', position: 4, name: guide.title, item: `${siteUrl}/guides/${guide.slug}` },
    ],
  };

  // Resolve dynamic relationships strictly for published guides
  const relatedPublishedGuides = getRelatedPublishedGuides(guide);
  const prevGuide = getPreviousPublishedGuide(guide);
  const nextGuide = getNextPublishedGuide(guide);

  return (
    <DocsLayout toc={<DocsTableOfContents items={tocItems} />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Clean Breadcrumb */}
      <nav className="text-xs text-muted-foreground flex gap-2 items-center mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:underline">Guides</Link>
        <span>/</span>
        <span className="text-primary font-bold">{guide.categoryTitle}</span>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{guide.title}</span>
      </nav>

      {/* Dense Technical Header */}
      <header className="space-y-3 pb-6 border-b border-border">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-primary">
          <span className="bg-primary/10 px-2 py-0.5">{guide.categoryTitle}</span>
          <span className="text-muted-foreground font-medium">· Updated {guide.updatedAt}</span>
          <span className="text-muted-foreground font-medium">· {guide.readTime}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          {guide.title}
        </h1>

        {guide.introduction && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {guide.introduction}
          </p>
        )}
      </header>

      {/* Mobile Inline TOC */}
      <DocsTableOfContents items={tocItems} />

      {/* Documentation Content Stream */}
      <div className="py-6 space-y-6">
        {guide.sections.map((section, idx) => {
          switch (section.type) {
            case 'heading': {
              const Tag = section.level === 2 ? 'h2' : 'h3';
              const headingClass =
                section.level === 2
                  ? 'text-lg sm:text-xl font-bold tracking-tight text-foreground pt-6 border-t border-border first:border-0 first:pt-0'
                  : 'text-sm sm:text-base font-bold text-foreground pt-3';

              return (
                <Tag key={idx} id={section.id} className={headingClass}>
                  {section.text}
                </Tag>
              );
            }

            case 'paragraph': {
              return (
                <p key={idx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              );
            }

            case 'callout': {
              return (
                <DocsCallout key={idx} variant={section.variant} title={section.title}>
                  {section.content}
                </DocsCallout>
              );
            }

            case 'code': {
              return (
                <DocsCodeBlock
                  key={idx}
                  code={section.code}
                  language={section.language}
                  title={section.title}
                />
              );
            }

            case 'comparison': {
              return (
                <DocsComparison
                  key={idx}
                  invalidTitle={section.invalidTitle}
                  invalidCode={section.invalidCode}
                  validTitle={section.validTitle}
                  validCode={section.validCode}
                  explanation={section.explanation}
                  language={section.language}
                />
              );
            }

            case 'table': {
              return (
                <ReferenceTable
                  key={idx}
                  headers={section.headers}
                  rows={section.rows}
                  caption={section.caption}
                />
              );
            }

            case 'steps': {
              return (
                <WorkflowSteps
                  key={idx}
                  title={section.title}
                  steps={section.steps}
                />
              );
            }

            case 'tryTool': {
              return (
                <TryTool
                  key={idx}
                  toolId={section.toolId}
                  actionText={section.actionText}
                  explanation={section.explanation}
                  sampleInput={section.sampleInput}
                />
              );
            }

            case 'relatedTools': {
              const tools = TOOLS_REGISTRY.filter((t) => section.toolIds.includes(t.id) && t.status === 'published');
              if (tools.length === 0) return null;
              return (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                  {tools.map((t) => (
                    <ToolCard key={t.id} tool={t} />
                  ))}
                </div>
              );
            }

            case 'relatedGuides': {
              if (relatedPublishedGuides.length === 0) return null;
              return (
                <div key={idx} className="space-y-2 my-4">
                  {relatedPublishedGuides.map((g) => (
                    <Link
                      key={g.id}
                      href={`/guides/${g.slug}`}
                      className="block p-3 border border-border bg-card hover:border-primary transition-all text-xs"
                    >
                      <strong className="text-foreground block font-bold mb-0.5">{g.title}</strong>
                      <span className="text-muted-foreground text-[11px] line-clamp-1">{g.shortDescription}</span>
                    </Link>
                  ))}
                </div>
              );
            }

            case 'references': {
              return (
                <ul key={idx} className="space-y-1 text-xs text-muted-foreground pt-2">
                  {section.items.map((ref, rIdx) => (
                    <li key={rIdx}>
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
              );
            }

            default:
              return null;
          }
        })}
      </div>

      {/* Documentation Pagination (Previous / Next) */}
      <DocsPagination prev={prevGuide} next={nextGuide} />

      <AdContainer slot="bottom" />
    </DocsLayout>
  );
}
