import Link from 'next/link';
import AdContainer from '@/components/shared/AdContainer';
import ToolCard from '@/components/shared/ToolCard';
import HomeSearchTrigger from '@/components/shared/HomeSearchTrigger';
import Icon from '@/components/shared/Icon';
import { CATEGORIES } from '@/config/categories';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { 
  ShieldCheck, 
  Cpu, 
  Code2, 
  HelpCircle,
  Star,
  Flame,
  Calendar,
  AlertCircle
} from 'lucide-react';

const FAQS = [
  {
    q: 'How do browser-side tools work?',
    a: 'All computations (such as text counting, image adjustments, or code formatting) run directly inside your browser tab. We use WebAssembly and browser APIs so no files are uploaded to remote servers.'
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. Because your files and text inputs are processed locally in your browser memory and never leave your machine, there is zero risk of data leakages or storage logs.'
  },
  {
    q: 'Can I use these tools offline?',
    a: 'Yes! Because the platform is built for client-side execution, once the page loads, most utilities will operate perfectly without active network connectivity.'
  }
];

export default function Home() {
  const publishedTools = TOOLS_REGISTRY.filter((t) => t.status === 'published');
  const comingSoonTools = TOOLS_REGISTRY.filter((t) => t.status !== 'published');

  const featuredTools = publishedTools.filter((t) => t.featured).slice(0, 3);
  const popularTools = publishedTools.filter((t) => t.popular).slice(0, 3);
  const recentlyAddedTools = [...publishedTools]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 3);

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section - Reduced height for quick access */}
      <section className="text-center py-10 px-4 bg-muted/20 rounded-2xl border flex flex-col items-center max-w-4xl mx-auto w-full gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-foreground">
          Free Browser-Based Utilities. <br />
          <span className="text-primary bg-primary/10 px-3 py-0.5 rounded-lg mt-2 inline-block">
            No Uploads.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
          Quick, private tools processed 100% locally in browser memory. Secure and instant.
        </p>
        <div className="w-full flex justify-center mt-2">
          <HomeSearchTrigger />
        </div>
      </section>

      {/* Top Banner Ad Placeholders */}
      <AdContainer />

      {/* Available Tools Grid Section - Highest Priority */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>✅</span> Available Tools ({publishedTools.length})
          </h2>
          <span className="text-xs text-muted-foreground">Ready to use immediately</span>
        </div>
        {publishedTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedTools.map((tool) => (
              <div key={tool.id}>
                <ToolCard tool={tool} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-xl max-w-md mx-auto">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No active utilities loaded</p>
            <p className="text-xs text-muted-foreground mt-1">We are compiling standard browser utilities. Explore our coming soon roadmap below.</p>
          </div>
        )}
      </section>

      {/* Categories Grid Section */}
      <section id="categories" className="scroll-mt-20">
        <div className="mb-6 border-b pb-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>📁</span> Browse Categories
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => {
            const count = TOOLS_REGISTRY.filter((t) => t.category === category.id && t.status === 'published').length;
            return (
              <Link 
                key={category.id} 
                href={`/categories/${category.slug}`}
                className="group p-5 bg-card text-card-foreground border rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:border-primary/40"
              >
                <div>
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                    <Icon name={category.icon} className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-bold mb-1.5 group-hover:text-primary transition-colors duration-200">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                </div>
                <div className="border-t pt-3 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {count} {count === 1 ? 'utility' : 'utilities'} available
                  </span>
                  <span className="text-xs text-primary font-medium group-hover:translate-x-1 transition-transform duration-200">
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Middle Banner Ad Placeholders */}
      <AdContainer />

      {/* Tools Showcase grids (Featured / Popular / Recent) - Limited strictly to Published */}
      {publishedTools.length > 0 && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b pb-2">
              <Star className="h-5 w-5 text-amber-500 shrink-0" /> Featured Utilities
            </h3>
            {featuredTools.length > 0 ? (
              <div className="flex flex-col gap-4">
                {featuredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No featured tools registered.</p>
            )}
          </div>

          {/* Popular Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b pb-2">
              <Flame className="h-5 w-5 text-orange-500 shrink-0" /> Popular Utilities
            </h3>
            {popularTools.length > 0 ? (
              <div className="flex flex-col gap-4">
                {popularTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No popular tools registered.</p>
            )}
          </div>

          {/* Recently Added Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2 border-b pb-2">
              <Calendar className="h-5 w-5 text-blue-500 shrink-0" /> Recently Added
            </h3>
            {recentlyAddedTools.length > 0 ? (
              <div className="flex flex-col gap-4">
                {recentlyAddedTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No tools added recently.</p>
            )}
          </div>
        </section>
      )}

      {/* Coming Soon Section - Visually separated at bottom */}
      <section className="border-t pt-8">
        <div className="mb-6 pb-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>⏳</span> Coming Soon ({comingSoonTools.length})
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upcoming browser-side utilities currently in draft or active planning.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comingSoonTools.map((tool) => (
            <div key={tool.id} className="opacity-75 hover:opacity-100 transition-opacity">
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </section>

      {/* Core Philosophy Credentials Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t">
        <div className="p-6 bg-card border rounded-xl flex flex-col gap-3">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-foreground">100% Privacy Pledge</h4>
          <p className="text-xs text-muted-foreground leading-normal">
            No files leave your computer. All processing runs in browser memory, shielding data from server logs.
          </p>
        </div>
        
        <div className="p-6 bg-card border rounded-xl flex flex-col gap-3">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-foreground">Instant Local Compute</h4>
          <p className="text-xs text-muted-foreground leading-normal">
            We compile resource-heavy tasks inside Web Workers to ensure instant processing without server delay.
          </p>
        </div>

        <div className="p-6 bg-card border rounded-xl flex flex-col gap-3">
          <div className="h-10 w-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
            <Code2 className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold text-foreground">Open-Source Core</h4>
          <p className="text-xs text-muted-foreground leading-normal">
            We follow standard open web specifications. Inspect code variables directly inside your browser devtools.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto w-full pt-8 border-t">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
          </h3>
        </div>
        <div className="space-y-6">
          {FAQS.map((faq, index) => (
            <div key={index} className="p-5 bg-card border rounded-xl">
              <h4 className="text-sm font-bold text-foreground mb-2 flex items-start gap-2">
                <span>Q:</span> {faq.q}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
