import Link from 'next/link';
import AdContainer from '@/components/shared/AdContainer';
import ToolCard from '@/components/shared/ToolCard';
import HomeSearchTrigger from '@/components/shared/HomeSearchTrigger';
import Icon from '@/components/shared/Icon';
import StatsCard from '@/components/shared/StatsCard';
import ScrollControls from '@/components/shared/ScrollControls';
import { CATEGORIES } from '@/config/categories';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { 
  ShieldCheck, 
  Cpu, 
  Code2, 
  HelpCircle,
  Flame,
  Calendar,
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
  const comingSoonTools = TOOLS_REGISTRY.filter((t) => t.status !== 'published');

  const popularTools = publishedTools.filter((t) => t.popular).slice(0, 3);
  const recentlyAddedTools = [...publishedTools]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 3);

  return (
    <>
      <ScrollControls />
      
      <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="relative bg-card border-2 border-border p-8 sm:p-12 card-depth-2">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 border border-primary/20 mb-4">
                <div className="h-1.5 w-1.5 bg-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-wider">100% Client-Side Processing</span>
              </div>
              
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
            
            {/* Available Tools */}
            <section>
              <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Available Tools</h2>
                  <p className="text-sm text-muted-foreground mt-1">Production-ready utilities. Click any tool to start.</p>
                </div>
                <span className="inline-flex items-center bg-green-500/10 text-green-700 dark:text-green-400 px-3 py-1 border border-green-500/20 text-xs font-bold uppercase tracking-wider">
                  {publishedTools.length} Live
                </span>
              </div>
              
              {publishedTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {publishedTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-border bg-muted/20">
                  <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-bold text-foreground">No Tools Available</p>
                  <p className="text-xs text-muted-foreground mt-1">Check back soon for new utilities.</p>
                </div>
              )}
            </section>

            {/* Middle Ad - Medium Rectangle */}
            <AdContainer slot="middle" />

            {/* Highlighted Sections */}
            {publishedTools.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Popular Tools */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-foreground">Most Popular</h3>
                  </div>
                  {popularTools.length > 0 ? (
                    <div className="space-y-4">
                      {popularTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic border border-border p-4 bg-muted/10">
                      No popular tools yet.
                    </p>
                  )}
                </div>

                {/* Recently Added */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-bold text-foreground">Recently Added</h3>
                  </div>
                  {recentlyAddedTools.length > 0 ? (
                    <div className="space-y-4">
                      {recentlyAddedTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic border border-border p-4 bg-muted/10">
                      No recent additions.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Coming Soon Tools */}
            {comingSoonTools.length > 0 && (
              <section className="border-t-2 border-border pt-10">
                <div className="flex items-center justify-between border-b-2 border-border pb-4 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground tracking-tight">Development Roadmap</h2>
                    <p className="text-sm text-muted-foreground mt-1">Upcoming tools in various stages of development.</p>
                  </div>
                  <span className="inline-flex items-center bg-blue-500/10 text-blue-700 dark:text-blue-400 px-3 py-1 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                    {comingSoonTools.length} Pipeline
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {comingSoonTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* FAQ Section */}
            <section className="border-t-2 border-border pt-10">
              <div className="flex items-center gap-2 mb-6">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">Frequently Asked Questions</h3>
              </div>
              
              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <div key={index} className="bg-card border-2 border-border p-5 card-depth-1 hover:card-depth-2 transition-all">
                    <h4 className="text-sm font-bold text-foreground mb-2 flex items-start gap-2">
                      <span className="text-primary shrink-0">Q:</span> 
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar Column - 1/4 width */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Categories Navigation */}
            <div className="bg-card border-2 border-border card-depth-1 sticky top-20">
              <div className="p-4 border-b-2 border-border bg-muted/20">
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Browse Categories
                </h3>
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Why Use Our Tools?
                </h3>
              </div>
              
              <div className="bg-card border-2 border-border p-4 card-depth-1">
                <div className="h-10 w-10 bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-2">100% Privacy</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Zero data transmission. All processing in your browser. Files never touch servers.
                </p>
              </div>
              
              <div className="bg-card border-2 border-border p-4 card-depth-1">
                <div className="h-10 w-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                  <Cpu className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-2">Lightning Fast</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No upload delays. No server queues. Instant results with modern browser APIs.
                </p>
              </div>

              <div className="bg-card border-2 border-border p-4 card-depth-1">
                <div className="h-10 w-10 bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                  <Code2 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground mb-2">Open Standards</h4>
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
