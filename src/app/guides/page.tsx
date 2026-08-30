import { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileCode2, 
  KeyRound, 
  EyeOff, 
  Clock, 
  FileStack, 
  ArrowRight, 
  Layers
} from 'lucide-react';
import { 
  getPublishedNavigation, 
  getPublishedGuides 
} from '@/config/docs-registry';
import { SITE_URL } from '@/config/site';
import DocsLayout from '@/components/docs/DocsLayout';
import AdContainer from '@/components/shared/AdContainer';

export const metadata: Metadata = {
  title: 'Guides & Solutions - CoolTools Documentation',
  description: 'Practical explanations for common developer, data, and file-processing problems connected directly to client-side browser utilities.',
  alternates: {
    canonical: `${SITE_URL}/guides`,
  },
};

const DOMAIN_ICONS: Record<string, typeof FileCode2> = {
  json: FileCode2,
  jwt: KeyRound,
  unicode: EyeOff,
  timestamp: Clock,
  pdf: FileStack,
};

export default function GuidesIndexPage() {
  const publishedNav = getPublishedNavigation();
  const publishedGuides = getPublishedGuides();

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CoolTools Developer Documentation & Problem Guides',
    url: `${SITE_URL}/guides`,
    description: 'Technical problem guides and RFC references for JSON, JWT, Unicode, Timestamps, and PDF processing.',
  };

  return (
    <DocsLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="space-y-10 py-2">
        {/* Header section */}
        <header className="space-y-3 pb-6 border-b border-border">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5">
            <span>Developer Knowledge Base ({publishedGuides.length} published)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Guides &amp; Solutions
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl font-medium">
            Technical explanations for common developer, data, and file-processing problems—connected directly to local browser utilities.
          </p>
        </header>

        {/* Featured Documentation Categories (Only domains with published guides) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {publishedNav.map((domain) => {
            const IconComp = DOMAIN_ICONS[domain.id] || FileCode2;

            return (
              <div
                key={domain.id}
                className="bg-card border-2 border-border p-5 card-depth-1 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <IconComp className="h-4 w-4" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                        {domain.title}
                      </h2>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        ({domain.items.length})
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-border/50 text-xs">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                    Published in this domain:
                  </span>
                  {domain.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/guides/${item.slug}`}
                      className="flex items-center justify-between py-1 text-muted-foreground hover:text-primary font-medium transition-colors"
                    >
                      <span className="truncate pr-2 text-[11px]">{item.title}</span>
                      <ArrowRight className="h-2.5 w-2.5 shrink-0 opacity-50 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Multi-Tool Workflow Cards */}
        <section className="p-6 bg-card border-2 border-border card-depth-1 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
              Multi-Tool Developer Workflows
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              href="/workflows/developer-data-debugging"
              className="p-3 border border-border bg-muted/20 hover:border-primary transition-all group"
            >
              <strong className="text-foreground block font-bold group-hover:text-primary transition-colors">
                Developer Data Debugging Pipeline →
              </strong>
              <span className="text-[11px] text-muted-foreground leading-relaxed">
                Step-by-step resolution across JSON, JWTs, timestamps, and invisible characters.
              </span>
            </Link>
            <Link
              href="/workflows/jwt-debugging-workflow"
              className="p-3 border border-border bg-muted/20 hover:border-primary transition-all group"
            >
              <strong className="text-foreground block font-bold group-hover:text-primary transition-colors">
                JWT Token Lifecycle Verification →
              </strong>
              <span className="text-[11px] text-muted-foreground leading-relaxed">
                Decode payloads, inspect exp/iat dates, and analyze Base64URL encoding.
              </span>
            </Link>
          </div>
        </section>

        <AdContainer slot="bottom" />
      </div>
    </DocsLayout>
  );
}
