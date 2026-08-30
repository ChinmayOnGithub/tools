import { Metadata } from 'next';
import Link from 'next/link';
import { 
  FileCode2, 
  KeyRound, 
  EyeOff, 
  Clock, 
  FileStack, 
  ArrowRight, 
  Sparkles,
  Layers
} from 'lucide-react';
import { GUIDES_ARTICLES, WORKFLOWS_DATA } from '@/config/guides-data';
import { SITE_URL } from '@/config/site';
import AdContainer from '@/components/shared/AdContainer';

export const metadata: Metadata = {
  title: 'Developer Problem Guides & Technical Standards - CoolTools',
  description: 'Practical, problem-focused guides solving JSON parsing errors, JWT expiry inspection, invisible Unicode characters, Unix timestamps, and PDF processing.',
  alternates: {
    canonical: `${SITE_URL}/guides`,
  },
};

const CLUSTERS = [
  {
    id: 'json',
    name: 'JSON & Data Serialization',
    icon: FileCode2,
    desc: 'Solve JSON.parse() syntax crashes, unquoted keys, trailing commas, and string escaping bugs.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    id: 'jwt',
    name: 'JWT & Authentication',
    icon: KeyRound,
    desc: 'Understand decode vs verify, decode exp/iat claims, debug token expiration, and inspect Base64URL encodings.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    id: 'unicode',
    name: 'Unicode & Text Analysis',
    icon: EyeOff,
    desc: 'Detect hidden zero-width spaces, inspect code points, debug homoglyphs, and solve NFC/NFD normalization failures.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    id: 'timestamp',
    name: 'Timestamps & Dates',
    icon: Clock,
    desc: 'Fix 10-digit seconds vs 13-digit milliseconds bugs, parse ISO 8601 vs RFC 3339, and troubleshoot clock skew.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    id: 'pdf',
    name: 'PDF & Document Workflows',
    icon: FileStack,
    desc: 'Downsample raster images to reduce file size, merge multi-page documents, and extract page ranges locally.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
];

export default function GuidesIndexPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'CoolTools Problem-Solving Guides & Technical Standards',
    url: `${SITE_URL}/guides`,
    description: 'Practical developer guides addressing specific technical bugs, RFC specifications, and interactive tool workflows.',
  };

  return (
    <div className="w-full space-y-12 py-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Header section */}
      <section className="relative bg-card border-2 border-border p-8 sm:p-12 card-depth-2 overflow-hidden space-y-4">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
        <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Actionable Problem Solving · Connected to Tools</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Developer Problem Guides
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl font-medium">
          Authoritative, concise technical explanations for real developer problems—connected directly to in-browser interactive utilities.
        </p>
      </section>

      {/* Featured Multi-Tool Workflows */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b-2 border-border">
          <Layers className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-black uppercase tracking-wider text-foreground">
            Featured End-to-End Workflows
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKFLOWS_DATA.map((wf) => (
            <Link
              key={wf.id}
              href={`/workflows/${wf.slug}`}
              className="bg-card border-2 border-border p-5 card-depth-1 space-y-3 hover:border-primary/50 group transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5">
                  {wf.steps.length}-Step Pipeline
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </div>
              <h3 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                {wf.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {wf.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Guides Organized by Problem Cluster */}
      <section className="space-y-12">
        {CLUSTERS.map((cluster) => {
          const IconComp = cluster.icon;
          const clusterGuides = GUIDES_ARTICLES.filter((g) => g.cluster === cluster.id);

          return (
            <div key={cluster.id} className="space-y-4">
              <div className="flex items-start sm:items-center justify-between gap-4 pb-3 border-b-2 border-border">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 ${cluster.bg} ${cluster.color} flex items-center justify-center shrink-0`}>
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-foreground">{cluster.name}</h2>
                    <p className="text-[11px] text-muted-foreground">{cluster.desc}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-muted px-2 py-0.5 border border-border text-muted-foreground shrink-0">
                  {clusterGuides.length} Guides
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusterGuides.map((guide) => (
                  <Link
                    key={guide.id}
                    href={`/guides/${guide.slug}`}
                    className="bg-card border-2 border-border p-5 card-depth-1 flex flex-col justify-between space-y-4 hover:border-primary/50 group transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-bold text-primary">{guide.readTime}</span>
                        <span>Updated {guide.updatedAt}</span>
                      </div>
                      <h3 className="text-xs font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                        {guide.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                        {guide.shortDescription}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-primary font-bold">
                      <span>Read Guide</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom Ad Container */}
      <AdContainer slot="bottom" />
    </div>
  );
}
