import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { GUIDES_REGISTRY } from '@/config/docs-registry';
import { GUIDES_ARTICLES } from '@/config/guides-data';
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
  const allSlugs = new Set([
    ...GUIDES_REGISTRY.map((g) => g.slug),
    ...GUIDES_ARTICLES.map((g) => g.slug),
  ]);
  return Array.from(allSlugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const modernGuide = GUIDES_REGISTRY.find((g) => g.slug === slug);
  const legacyGuide = GUIDES_ARTICLES.find((g) => g.slug === slug);
  const guide = modernGuide || legacyGuide;

  if (!guide) return {};

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
  const modernGuide = GUIDES_REGISTRY.find((g) => g.slug === slug);
  const legacyGuide = GUIDES_ARTICLES.find((g) => g.slug === slug);

  if (!modernGuide && !legacyGuide) {
    notFound();
  }

  const siteUrl = SITE_URL;

  // ──────────────────────────────────────────────────────────────────────────
  // PATH A: FULLY MIGRATED MODERN DEVELOPER DOCUMENTATION RENDERER
  // ──────────────────────────────────────────────────────────────────────────
  if (modernGuide) {
    const guide = modernGuide;

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
                const tools = TOOLS_REGISTRY.filter((t) => section.toolIds.includes(t.id));
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
                    {tools.map((t) => (
                      <ToolCard key={t.id} tool={t} />
                    ))}
                  </div>
                );
              }

              case 'relatedGuides': {
                const related = GUIDES_REGISTRY.filter((g) => section.guideSlugs.includes(g.slug));
                return (
                  <div key={idx} className="space-y-2 my-4">
                    {related.map((g) => (
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
        <DocsPagination prev={guide.prevGuide} next={guide.nextGuide} />

        <AdContainer slot="bottom" />
      </DocsLayout>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PATH B: FALLBACK COMPATIBILITY RENDERER FOR OTHER CLUSTER GUIDES
  // (Rendered cleanly within DocsLayout typography)
  // ──────────────────────────────────────────────────────────────────────────
  const guide = legacyGuide!;
  const primaryTool = TOOLS_REGISTRY.find((t) => t.id === guide.primaryToolId);
  const relatedTools = TOOLS_REGISTRY.filter(
    (t) => guide.relatedToolIds.includes(t.id) && t.status === 'published'
  );

  const tocItems: TocItem[] = [
    { id: 'problem', text: 'Problem Statement', level: 2 },
    { id: 'short-answer', text: 'Short Answer', level: 2 },
    { id: 'technical-explanation', text: 'Why This Happens', level: 2 },
    { id: 'examples', text: 'Examples & Solutions', level: 2 },
    { id: 'common-mistakes', text: 'Common Mistakes', level: 2 },
    { id: 'references', text: 'Standards & References', level: 2 },
  ];

  return (
    <DocsLayout toc={<DocsTableOfContents items={tocItems} />}>
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground flex gap-2 items-center mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:underline">Guides</Link>
        <span>/</span>
        <span className="text-primary font-bold">{guide.clusterName}</span>
        <span>/</span>
        <span className="text-foreground font-medium truncate">{guide.title}</span>
      </nav>

      {/* Header */}
      <header className="space-y-3 pb-6 border-b border-border">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-primary">
          <span className="bg-primary/10 px-2 py-0.5">{guide.clusterName}</span>
          <span className="text-muted-foreground font-medium">· Updated {guide.updatedAt}</span>
          <span className="text-muted-foreground font-medium">· {guide.readTime}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
          {guide.title}
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {guide.shortDescription}
        </p>
      </header>

      <DocsTableOfContents items={tocItems} />

      <div className="py-6 space-y-6">
        <DocsCallout variant="important" title="Short Answer">
          {guide.shortAnswer}
        </DocsCallout>

        <h2 id="problem" className="text-lg font-bold text-foreground pt-4 border-t border-border">
          What Problem Does This Solve?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {guide.problemStatement}
        </p>

        <h2 id="technical-explanation" className="text-lg font-bold text-foreground pt-4 border-t border-border">
          Why This Happens (Technical Details)
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {guide.technicalReason}
        </p>

        {guide.examples.length > 0 && (
          <>
            <h2 id="examples" className="text-lg font-bold text-foreground pt-4 border-t border-border">
              Examples &amp; Verified Fixes
            </h2>
            <div className="space-y-4">
              {guide.examples.map((ex, idx) => (
                <DocsComparison
                  key={idx}
                  invalidTitle="Invalid Example"
                  invalidCode={ex.invalid}
                  validTitle={ex.title}
                  validCode={ex.validFix}
                  explanation={ex.reason}
                  language={ex.language}
                />
              ))}
            </div>
          </>
        )}

        {primaryTool && (
          <TryTool
            toolId={primaryTool.id}
            actionText={`Open in ${primaryTool.name}`}
            sampleInput={guide.samplePayload}
          />
        )}

        {guide.commonMistakes.length > 0 && (
          <>
            <h2 id="common-mistakes" className="text-lg font-bold text-foreground pt-4 border-t border-border">
              Common Mistakes Developers Make
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground">
              {guide.commonMistakes.map((m, idx) => (
                <li key={idx}>{m}</li>
              ))}
            </ul>
          </>
        )}

        {relatedTools.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
            {relatedTools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        )}

        {guide.references.length > 0 && (
          <>
            <h2 id="references" className="text-lg font-bold text-foreground pt-4 border-t border-border">
              Standards &amp; References
            </h2>
            <ul className="space-y-1 text-xs text-muted-foreground">
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
          </>
        )}
      </div>

      <AdContainer slot="bottom" />
    </DocsLayout>
  );
}
