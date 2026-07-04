import Link from 'next/link';
import AdContainer from '@/components/shared/AdContainer';
import HomeSearchTrigger from '@/components/shared/HomeSearchTrigger';
import { SITE_URL } from '@/config/site';
import Icon from '@/components/shared/Icon';
import StatsCard from '@/components/shared/StatsCard';
import ScrollControls from '@/components/shared/ScrollControls';
import { CATEGORIES } from '@/config/categories';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import FaqSection from '@/components/shared/FaqSection';
import { 
  ShieldCheck, 
  Cpu, 
  Code2, 
  Wrench,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';

const FAQS = [
  {
    q: 'How do browser-side tools work?',
    a: 'All computations run directly inside your browser using modern Web APIs and WebAssembly. Your files never touch our servers.'
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. Since processing happens locally in your browser memory, there is zero risk of data leaks or server-side storage.'
  },
  {
    q: 'Can I use these tools offline?',
    a: 'Yes! Once the page loads, most tools work perfectly without an internet connection since they run client-side.'
  }
];

export default function Home() {
  const publishedTools = TOOLS_REGISTRY.filter((t) => t.status === 'published');
  


  const plannedTools = [
    {
      name: 'OCR PDF / Scan to Text',
      description: 'Convert scanned PDF documents or image-only PDFs into selectable, editable text locally using WebAssembly.',
      category: 'pdf',
      badge: 'Coming Soon',
    }
  ];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'CoolTools',
    'url': SITE_URL,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${SITE_URL}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <ScrollControls />
      
      <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="relative bg-card border-2 border-border p-8 sm:p-12 card-depth-2">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
                Professional Browser Tools.
                <br />
                <span className="text-primary">Zero Server Uploads.</span>
              </h1>
              
              <p className="text-sm text-muted-foreground max-w-xl mb-6 leading-relaxed">
                Instant, secure utilities that process everything locally. No data leaves your browser. 
                No accounts. No tracking.
              </p>
              
              <div className="w-full max-w-xl">
                <HomeSearchTrigger />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            label="Available Tools" 
            value={publishedTools.length}
            icon={<Wrench className="h-5 w-5" />}
          />
          <StatsCard 
            label="Categories" 
            value={CATEGORIES.length}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <StatsCard 
            label="Privacy Score" 
            value="100%"
            icon={<ShieldCheck className="h-5 w-5" />}
          />
          <StatsCard 
            label="Avg Speed" 
            value="<50ms"
            icon={<Clock className="h-5 w-5" />}
          />
        </section>

        {/* Top Ad - Leaderboard */}
        <AdContainer slot="top" />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Column - 3/4 width */}
          <div className="lg:col-span-3 space-y-10">
            
            {/* Tools Directory grouped by Category */}
            <section className="space-y-8">
              <div className="border-b-2 border-border pb-4">
                <h2 className="text-xl font-bold text-foreground tracking-tight">Tools Directory</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Offline-first browser tools grouped by category. Click any tool to launch.
                </p>
              </div>

              <div className="space-y-6">
                {CATEGORIES.map((category) => {
                  const catTools = publishedTools.filter((t) => t.category === category.id);
                  if (catTools.length === 0) return null;

                  return (
                    <div 
                      key={category.id}
                      className="bg-card border-2 border-border p-5 card-depth-1 space-y-4"
                    >
                      <div className="flex items-center gap-3 pb-3 border-b border-border/60">
                        <div className="h-9 w-9 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Icon name={category.icon} className="h-5 w-5" />
                        </div>
                        <div>
                          <Link 
                            href={`/categories/${category.slug}`}
                            className="text-sm font-extrabold text-foreground hover:text-primary transition-colors hover:underline"
                          >
                            {category.title}
                          </Link>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {catTools.map((tool) => (
                          <Link 
                            key={tool.id} 
                            href={`/tools/${tool.id}`}
                            className="flex items-center gap-2.5 p-2.5 border border-border bg-muted/10 hover:border-primary hover:bg-primary/5 transition-all group"
                          >
                            <div className="h-7 w-7 bg-muted text-muted-foreground flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              <Icon name={tool.icon} className="h-4 w-4" />
                            </div>
                            <span className="text-[11px] font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {tool.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Development Roadmap (Planned Tools) */}
            <section className="border-t-2 border-border pt-10">
              <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Development Roadmap</h2>
                  <p className="text-sm text-muted-foreground mt-1">Upcoming tools in active architectural planning.</p>
                </div>
                <span className="inline-flex items-center bg-amber-500/10 text-amber-800 dark:text-amber-300 px-3 py-1 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                  Planned
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {plannedTools.map((tool, idx) => (
                  <div 
                    key={idx}
                    className="bg-card/40 border-2 border-border/50 p-5 opacity-70 flex flex-col justify-between h-36 cursor-not-allowed select-none"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-7 w-7 bg-muted text-foreground/80 flex items-center justify-center rounded">
                          <Icon name="FileText" className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest bg-muted text-foreground/90 px-2 py-0.5 rounded border border-border">
                          {tool.badge}
                        </span>
                      </div>
                      <h3 className="text-xs font-extrabold text-foreground mb-1">{tool.name}</h3>
                      <p className="text-[10px] text-foreground/75 leading-relaxed line-clamp-2">{tool.description}</p>
                    </div>
                    <div className="text-[9px] text-foreground/80 pt-1.5 border-t border-border/20">
                      Status: Local feasibility testing
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="border-t-2 border-border pt-10">
              <FaqSection faqs={FAQS} titleClassName="text-lg font-bold text-foreground" />
            </section>

          </div>

          {/* Sidebar Column - 1/4 width */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 self-start">
            
            {/* Categories Navigation */}
            <div className="bg-card border-2 border-border card-depth-1">
              <div className="p-4 border-b-2 border-border bg-muted/20">
                <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Browse Categories
                </h2>
              </div>
              
              <div className="p-3 space-y-1">
                {CATEGORIES.map((category) => {
                  const count = TOOLS_REGISTRY.filter((t) => t.category === category.id && t.status === 'published').length;
                  return (
                    <Link 
                      key={category.id} 
                      href={`/categories/${category.slug}`}
                      className="flex items-center justify-between p-3 border border-transparent hover:border-primary hover:bg-primary/5 group transition-all duration-200"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-8 w-8 bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Icon name={category.icon} className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {category.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {count} tools
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Ad - Half Page */}
            <AdContainer slot="sidebar" />

            {/* Security Features */}
            <div className="space-y-4">
              <div className="border-b-2 border-border pb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Why Use Our Tools?
                </h2>
              </div>
              
              <div className="bg-card border-2 border-border p-4 card-depth-1">
                <div className="h-10 w-10 bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">100% Privacy</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Zero data transmission. All processing in your browser. Files never touch servers.
                </p>
              </div>
              
              <div className="bg-card border-2 border-border p-4 card-depth-1">
                <div className="h-10 w-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">Lightning Fast</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No upload delays. No server queues. Instant results with modern browser APIs.
                </p>
              </div>

              <div className="bg-card border-2 border-border p-4 card-depth-1">
                <div className="h-10 w-10 bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">Open Standards</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Built on web standards. Inspect code in browser console. Full transparency.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Ad - Leaderboard */}
        <AdContainer slot="bottom" />
      </div>
    </>
  );
}
