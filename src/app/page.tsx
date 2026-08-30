'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AdContainer from '@/components/shared/AdContainer';
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
  Search,
  X,
  FileCheck2,
  Terminal,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How does browser-side processing work?',
    a: 'All calculations and file manipulations run directly inside your browser tab using Web APIs (such as Web Crypto, Canvas, FileReader) and WebAssembly. Your text inputs, code snippets, tokens, and files are not uploaded to any remote tool processing API.',
  },
  {
    q: 'How can I verify that my data is not being uploaded?',
    a: 'You can open your browser Developer Tools (F12 or Ctrl+Shift+I), switch to the Network tab, and perform any operation. You will see that no POST/PUT requests carrying your file data or tokens are sent to any server.',
  },
  {
    q: 'Can I use these tools offline?',
    a: 'Yes. Once the web application assets are loaded in your browser cache, the client-side tool calculations execute locally without needing constant internet connectivity.',
  },
  {
    q: 'Does this site require an account or subscription?',
    a: 'No. All utilities are accessible immediately without registration, logins, or paywalls.',
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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const publishedTools = TOOLS_REGISTRY.filter((t) => t.status === 'published');

  // Focus search input when user presses '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
          return;
        }
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter tools based on query
  const cleanQuery = searchQuery.toLowerCase().trim();
  const filteredTools = cleanQuery === '' 
    ? publishedTools 
    : publishedTools.filter((tool) => {
        return (
          tool.name.toLowerCase().includes(cleanQuery) ||
          tool.description.toLowerCase().includes(cleanQuery) ||
          tool.tags.some((tag) => tag.toLowerCase().includes(cleanQuery)) ||
          tool.keywords.some((keyword) => keyword.toLowerCase().includes(cleanQuery)) ||
          tool.category.toLowerCase().includes(cleanQuery)
        );
      });

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

      <div className="flex flex-col gap-10 w-full">

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
                  Privacy-First · Local Browser Processing
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                Privacy-First Developer &amp; Browser Tools
              </h1>

              <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                Process code, tokens, files, images, and developer data directly inside your browser memory whenever possible. No account required. Zero server uploads for tool calculations.
              </p>

              {/* Direct interactive search bar input */}
              <div className="w-full max-w-xl space-y-3">
                <div className="relative w-full max-w-lg">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search developer and browser utilities..."
                    className="w-full h-14 border-2 border-border bg-card pl-12 pr-12 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-none transition-all duration-200"
                    aria-label="Search inputs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-6 select-none items-center justify-center gap-0.5 border-2 border-border bg-muted px-2 font-mono text-[11px] font-bold text-muted-foreground">
                    /
                  </kbd>
                </div>

                {/* Quick filter tag chips */}
                <div className="flex flex-wrap gap-2 pt-1 items-center">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
                    Quick filters:
                  </span>
                  {['All', 'JSON', 'JWT', 'Unicode', 'Timestamp', 'PDF', 'Image', 'Base64', 'Hash', 'UUID', 'Text'].map((tag) => {
                    const isActive = (tag === 'All' && !searchQuery) || searchQuery.toLowerCase() === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag === 'All' ? '' : tag.toLowerCase())}
                        className={`border px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer rounded-none ${
                          isActive
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border bg-muted/40 text-muted-foreground hover:border-primary/50 hover:text-foreground'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── TOOL SUITE SHOWCASES (DEVELOPER, FILE, LIVE DATA) ────── */}
        {!searchQuery && (
          <div className="space-y-8">
            {/* 1. Developer Tools */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-border">
                <div className="flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-xl font-black text-foreground tracking-tight">Developer Tools</h2>
                </div>
                <Link href="/categories/developer" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                  View all developer tools <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {publishedTools
                  .filter((t) => ['json-formatter', 'jwt-decoder', 'unicode-inspector', 'http-status-explorer'].includes(t.id))
                  .map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="bg-card border-2 border-border p-5 hover:border-emerald-500 transition-all duration-150 card-depth-1 group relative flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-9 w-9 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                            <Icon name={tool.icon} className="h-5 w-5" />
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h3 className="text-sm font-black text-foreground group-hover:text-emerald-500 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-border/40 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Launch tool →
                      </div>
                    </Link>
                  ))}
              </div>
            </section>

            {/* 2. Private File Tools */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-border">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-red-500" />
                  <h2 className="text-xl font-black text-foreground tracking-tight">Private File &amp; PDF Tools</h2>
                </div>
                <Link href="/categories/pdf" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                  View all PDF tools <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {publishedTools
                  .filter((t) => ['pdf-merge', 'pdf-compress', 'pdf-split', 'image-compressor'].includes(t.id))
                  .map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="bg-card border-2 border-border p-5 hover:border-red-500 transition-all duration-150 card-depth-1 group relative flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-9 w-9 bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                            <Icon name={tool.icon} className="h-5 w-5" />
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-red-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                        <h3 className="text-sm font-black text-foreground group-hover:text-red-500 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-border/40 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                        Launch tool →
                      </div>
                    </Link>
                  ))}
              </div>
            </section>

            {/* 3. Live Data Tools */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-border">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
                  <h2 className="text-xl font-black text-foreground tracking-tight">Live Public Data Tools</h2>
                </div>
                <Link href="/categories/live-data" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1">
                  View all live data tools <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {publishedTools
                  .filter((t) => ['github-explorer', 'weather-forecast', 'currency-converter', 'astronomy-picture'].includes(t.id))
                  .map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="bg-card border-2 border-border p-5 hover:border-blue-500 transition-all duration-150 card-depth-1 group relative flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-9 w-9 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                            <Icon name={tool.icon} className="h-5 w-5" />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-blue-500/10 text-blue-600 border border-blue-500/20">
                            LIVE
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-foreground group-hover:text-blue-500 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-border/40 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Launch tool →
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          </div>
        )}

        {/* ── STATS & ARCHITECTURE HIGHLIGHT ───────────────────────── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Available Tools', value: publishedTools.length, icon: Wrench },
            { label: 'Categories',      value: CATEGORIES.length,     icon: TrendingUp },
            { label: 'Local Compute',   value: 'In-Browser RAM',      icon: ShieldCheck },
            { label: 'Server File Logs',value: '0 Bytes Stored',      icon: Clock },
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
              <p className="text-xl font-black text-foreground tracking-tight">{value}</p>
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
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Full Tool Portfolio</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery ? 'Showing matching tools.' : 'Client-side utilities organized by domain category.'}
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center border border-border bg-muted/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'}
                </span>
              </div>

              {/* Category groups */}
              {filteredTools.length > 0 ? (
                <div className="space-y-6">
                  {CATEGORIES.map((category) => {
                    const catTools = filteredTools.filter((t) => t.category === category.id);
                    if (catTools.length === 0) return null;
                    const colors = CATEGORY_COLOR_MAP[category.color] ?? CATEGORY_COLOR_MAP.orange;

                    return (
                      <div key={category.id} className="bg-card border-2 border-border card-depth-1 transition-all duration-200">

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
              ) : (
                <div className="bg-card border-2 border-border p-12 text-center card-depth-1">
                  <Wrench className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <h3 className="text-sm font-black text-foreground">No matching tools found</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try searching for another keyword or browse our categories.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 border-2 border-border text-xs font-bold hover:border-primary hover:text-primary transition-all cursor-pointer rounded-none"
                  >
                    Reset Search
                  </button>
                </div>
              )}
            </section>

            {/* Transparent Technical Architecture Section */}
            <section className="bg-card border-2 border-border p-6 card-depth-1 space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-black text-foreground">How Local Browser Processing Works</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground leading-relaxed">
                <div className="p-3 bg-muted/20 border border-border space-y-1.5">
                  <span className="font-bold text-foreground block">1. Input in Sandbox</span>
                  <p>Your text, tokens, or files are read into local browser RAM via FileReader and Canvas APIs.</p>
                </div>
                <div className="p-3 bg-muted/20 border border-border space-y-1.5">
                  <span className="font-bold text-foreground block">2. In-Memory Execution</span>
                  <p>JavaScript Web APIs, Web Crypto, and WebAssembly perform formatting and conversion algorithms locally.</p>
                </div>
                <div className="p-3 bg-muted/20 border border-border space-y-1.5">
                  <span className="font-bold text-foreground block">3. Direct Output Export</span>
                  <p>Results and compiled files are saved directly to your device storage with zero server-side retention.</p>
                </div>
              </div>
              <div className="pt-1 text-xs">
                <Link
                  href="/docs/security-network-audit"
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Step-by-step guide to auditing network traffic in browser DevTools →
                </Link>
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

            {/* Technical Trust Highlights */}
            <div className="space-y-3">
              <div className="pb-2 border-b-2 border-border">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  Security &amp; Architecture
                </h2>
              </div>
              {[
                {
                  icon: ShieldCheck,
                  iconClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                  title: 'Local Browser Processing',
                  desc: 'All file parsing, token inspection, and text analysis execute inside your local browser memory sandbox.',
                },
                {
                  icon: Cpu,
                  iconClass: 'bg-primary/10 text-primary',
                  title: 'Zero Tool Server Uploads',
                  desc: 'No tool processing API endpoints are called. Documents and keys never touch remote database servers.',
                },
                {
                  icon: Code2,
                  iconClass: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
                  title: 'Auditable Web Standards',
                  desc: 'Built using open Web Standards (Web Crypto, HTML5 Canvas, WebAssembly) verifiable via browser DevTools.',
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
