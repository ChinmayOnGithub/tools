import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ShieldCheck, FileText, Image as ImageIcon, Terminal, Clock, ArrowRight } from 'lucide-react';
import { DOCS_ARTICLES } from '@/config/docs-data';
import { SITE_URL } from '@/config/site';
import AdContainer from '@/components/shared/AdContainer';

export const metadata: Metadata = {
  title: 'Documentation & Knowledge Base - CoolTools',
  description: 'Explore technical documentation, developer RFC standards, privacy auditing tutorials, PDF workflows, and image optimization guides for CoolTools.',
  alternates: {
    canonical: `${SITE_URL}/docs`,
  },
};

const CATEGORY_ICON_MAP = {
  architecture: ShieldCheck,
  pdf: FileText,
  image: ImageIcon,
  developer: Terminal,
  productivity: Clock,
  security: ShieldCheck,
};

export default function DocsIndexPage() {
  const docsSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CoolTools Documentation & Developer Knowledge Base',
    url: `${SITE_URL}/docs`,
    description: 'Technical documentation, developer RFC standards, and privacy auditing guides for CoolTools browser utilities.',
  };

  return (
    <div className="w-full space-y-10 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docsSchema) }}
      />

      {/* Header section */}
      <section className="relative bg-card border-2 border-border p-8 sm:p-12 card-depth-2 overflow-hidden space-y-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Knowledge Base & Technical Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Documentation & Developer Guides
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Comprehensive guides covering client-side security sandboxing, IETF RFC standards, PDF manipulation streams, image optimization benchmarks, and Chrome DevTools privacy auditing.
        </p>
      </section>

      {/* Grid of Documentation Guides */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOCS_ARTICLES.map((article) => {
          const IconComp = CATEGORY_ICON_MAP[article.category] || BookOpen;

          return (
            <div
              key={article.id}
              className="bg-card border-2 border-border p-6 card-depth-1 flex flex-col justify-between space-y-4 hover:border-primary/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-muted px-2 py-0.5 border border-border text-muted-foreground">
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-foreground leading-snug">
                  <Link href={`/docs/${article.slug}`} className="hover:text-primary transition-colors">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Updated: {article.updatedAt}
                </span>
                <Link
                  href={`/docs/${article.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </section>

      {/* Ad slot */}
      <AdContainer slot="bottom" />
    </div>
  );
}
