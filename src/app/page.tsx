import Link from 'next/link';
import AdContainer from '@/components/shared/AdContainer';
import HomeSearchTrigger from '@/components/shared/HomeSearchTrigger';
import { SITE_URL } from '@/config/site';
import Icon from '@/components/shared/Icon';
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
  ArrowRight,
  ArrowUpRight,
  Zap,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How do browser-side tools work?',
    a: 'All computations run directly inside your browser using modern Web APIs and WebAssembly. Your files never touch our servers.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. Since processing happens locally in your browser memory, there is zero risk of data leaks or server-side storage.',
  },
  {
    q: 'Can I use these tools offline?',
    a: 'Yes! Once the page loads, most tools work perfectly without an internet connection since they run client-side.',
  },
];

// Map category color strings to stable Tailwind classes (avoids dynamic class purging)
const CATEGORY_COLOR_MAP: Record<string, { icon: string; badge: string }> = {
  red:     { icon: 'bg-red-500/15 text-red-600 dark:text-red-400',     badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20' },
  blue:    { icon: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',  badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20' },
  emerald: { icon: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' },
  orange:  { icon: 'bg-orange-500/15 text-orange-600 dark:text-orange-400', badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20' },
  violet:  { icon: 'bg-violet-500/15 text-violet-600 dark:text-violet-400', badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20' },
  amber:   { icon: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',  badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20' },
};

const plannedTools = [
  {
    name: 'OCR PDF / Scan to Text',
    description: 'Convert scanned PDF documents or image-only PDFs into selectable, editable text locally using WebAssembly.',
    category: 'pdf',
    badge: 'Coming Soon',
  },
];

export default function Home() {
  const publishedTools = TOOLS_REGISTRY.filter((t) => t.status === 'published');

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CoolTools',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <ScrollControls />

      <div className="flex flex-col gap-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-background opacity-20" />
          <div className="relative bg-card border-2 border-border p-8 sm:p-12 card-depth-2">

            {/* Top primary stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

            <div className="max-w-3xl space-y-5">
              {/* Label */}
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 px-3 py-1">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                  100% Browser-Side · Zero Uploads
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                Professional Browser Tools.
                <br />
                <span className="text-primary">Zero Server Uploads.</span>
              </h1>

              <p className="text-sm text-muted-foreground max-w-lg leading-relaxed">
                Instant, secure utilities that process everything locally. No data leaves your browser.
                No accounts. No tracking.
              </p>

              <div className="w-full max-w-xl">
                <HomeSearchTrigger />
              </div>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['No Server Uploads', 'No Account Needed', 'Works Offline', 'Open Standards'].map((chip) => (
                  <span
                    key={chip}
                    className="border border-border bg-muted/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Available Tools', value: publishedTools.length, icon: Wrench },
            { label: 'Categories',      value: CATEGORIES.length,     icon: TrendingUp },
            { label: 'Privacy Score',   value: '100%',                icon: ShieldCheck },
            { label: 'Avg Speed',       value: '<50ms',               icon: Clock },
          ].map(({ label, value, icon: IconComp }) => (
            <div
              key={label}
              className="bg-card border-2 border-border p-4 card-depth-1 hover:card-depth-2 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                  <IconComp className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </section>

        {/* Top Ad */}
        <AdContainer slot="top" />

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Main Column */}
          <div className="lg:col-span-3 space-y-10">

            {/* ── TOOLS DIRECTORY ───────────────────────────────────── */}
            <section className="space-y-6">

              {/* Section heading */}
              <div className="flex items-end justify-between pb-4 border-b-2 border-border">
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Tools Directory</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Offline-first browser tools grouped by category. Click any tool to launch.
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center border border-border bg-muted/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {publishedTools.length} Tools
                </span>
              </div>

              {/* Category groups */}
              <div className="space-y-6">
                {CATEGORIES.map((category) => {
                  const catTools = publishedTools.filter((t) => t.category === category.id);
                  if (catTools.length === 0) return null;
                  const colors = CATEGORY_COLOR_MAP[category.color] ?? CATEGORY_COLOR_MAP.orange;

                  return (
                    <div key={category.id} className="bg-card border-2 border-border card-depth-1">

                      {/* Category header */}
                      <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60 bg-muted/20">
                        <div className={`h-9 w-9 flex items-center justify-center shrink-0 ${colors.icon}`}>
                          <Icon name={category.icon} className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/categories/${category.slug}`}
                              className="text-sm font-black text-foreground hover:text-primary transition-colors"
                            >
                              {category.title}
                            </Link>
                            <span className={`inline-flex items-center px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest ${colors.badge}`}>
                              {catTools.length} tools
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {category.description}
                          </p>
                        </div>
                        <Link
                          href={`/categories/${category.slug}`}
                          className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors shrink-0"
                        >
                          View all <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>

                      {/* Tool cards grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
                        {catTools.map((tool) => (
                          <Link
                            key={tool.id}
                            href={`/tools/${tool.id}`}
                            className="group relative flex flex-col gap-2.5 p-4 bg-card hover:bg-primary/5 transition-all duration-150 border-r border-b border-border/30 overflow-hidden"
                          >
                            {/* Left hover indicator bar */}
                            <div className="absolute left-0 top-0 bottom-0 w-0 bg-primary transition-all duration-150 group-hover:w-1" />

                            {/* Icon + arrow row */}
                            <div className="flex items-start justify-between">
                              <div className={`h-8 w-8 flex items-center justify-center shrink-0 transition-all duration-200 ${colors.icon} group-hover:bg-primary group-hover:text-primary-foreground`}>
                                <Icon name={tool.icon} className="h-4 w-4" />
                              </div>
                              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                            </div>

                            {/* Name */}
                            <div className="pl-1">
                              <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors block leading-tight">
                                {tool.name}
                              </span>
                              {/* Description — 2-line clamp */}
                              <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                                {tool.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            </section>

            {/* Development Roadmap */}
            <section className="border-t-2 border-border pt-10">
              <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-border">
                <div>
                  <h2 className="text-xl font-black text-foreground tracking-tight">Development Roadmap</h2>
                  <p className="text-sm text-muted-foreground mt-1">Upcoming tools in active architectural planning.</p>
                </div>
                <span className="inline-flex items-center bg-amber-500/10 text-amber-800 dark:text-amber-300 px-3 py-1 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest">
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
                        <div className="h-7 w-7 bg-muted text-foreground/80 flex items-center justify-center">
                          <Icon name="FileText" className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[9px] font-extrabold uppercase tracking-widest bg-muted text-foreground/90 px-2 py-0.5 border border-border">
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

            {/* FAQ */}
            <section className="border-t-2 border-border pt-10">
              <FaqSection faqs={FAQS} titleClassName="text-lg font-bold text-foreground" />
            </section>
          </div>

          {/* ── SIDEBAR ────────────────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20 self-start">

            {/* Browse Categories */}
            <div className="bg-card border-2 border-border card-depth-1">
              <div className="px-4 py-3 border-b-2 border-border bg-muted/20">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  Browse Categories
                </h2>
              </div>
              <div className="p-2 space-y-0.5">
                {CATEGORIES.map((category) => {
                  const count = TOOLS_REGISTRY.filter(
                    (t) => t.category === category.id && t.status === 'published'
                  ).length;
                  const colors = CATEGORY_COLOR_MAP[category.color] ?? CATEGORY_COLOR_MAP.orange;
                  return (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      className="flex items-center justify-between p-2.5 border border-transparent hover:border-primary/30 hover:bg-primary/5 group transition-all duration-150"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className={`h-7 w-7 flex items-center justify-center shrink-0 transition-all duration-200 ${colors.icon} group-hover:bg-primary group-hover:text-primary-foreground`}>
                          <Icon name={category.icon} className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {category.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{count} tools</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Ad */}
            <AdContainer slot="sidebar" />

            {/* Why Our Tools */}
            <div className="space-y-3">
              <div className="pb-2 border-b-2 border-border">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  Why Use Our Tools?
                </h2>
              </div>
              {[
                {
                  icon: ShieldCheck,
                  iconClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                  title: '100% Privacy',
                  desc: 'Zero data transmission. All processing in your browser. Files never touch servers.',
                },
                {
                  icon: Cpu,
                  iconClass: 'bg-primary/10 text-primary',
                  title: 'Lightning Fast',
                  desc: 'No upload delays. No server queues. Instant results with modern browser APIs.',
                },
                {
                  icon: Code2,
                  iconClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
                  title: 'Open Standards',
                  desc: 'Built on web standards. Inspect code in browser console. Full transparency.',
                },
              ].map(({ icon: IconComp, iconClass, title, desc }) => (
                <div key={title} className="bg-card border-2 border-border p-4 card-depth-1 flex gap-3 items-start">
                  <div className={`h-9 w-9 flex items-center justify-center shrink-0 ${iconClass}`}>
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-foreground mb-1">{title}</h3>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bottom Ad */}
        <AdContainer slot="bottom" />
      </div>
    </>
  );
}
