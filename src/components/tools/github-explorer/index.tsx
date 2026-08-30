'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Star, GitFork, AlertCircle, ExternalLink, Code2, FolderGit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LiveStatusHeader, LiveErrorBanner } from '@/components/shared/LiveToolComponents';
import { fetchGitHubData, GITHUB_PROVIDER, GitHubRepo, GitHubUser } from './utils';
import { trackToolLaunch, trackToolCompletion } from '@/lib/analytics';
import t from './locales/en.json';

const POPULAR_PRESETS = [
  { label: 'vercel/next.js', q: 'vercel/next.js' },
  { label: 'facebook/react', q: 'facebook/react' },
  { label: 'tailwindlabs/tailwindcss', q: 'tailwindlabs/tailwindcss' },
  { label: 'torvalds', q: 'torvalds' },
];

export default function GitHubExplorer() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('vercel/next.js');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ type: 'repo' | 'user'; result: GitHubRepo | GitHubUser } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const executeSearch = useCallback(async (targetQuery: string) => {
    if (!targetQuery.trim()) return;
    setLoading(true);
    setError(null);
    const res = await fetchGitHubData(targetQuery);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      setData(null);
    } else {
      setData(res.data);
      if (res.lastUpdated) setLastUpdated(res.lastUpdated);
      trackToolCompletion('github-explorer');
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      trackToolLaunch('github-explorer');
      executeSearch('vercel/next.js');
    }, 0);
    return () => clearTimeout(timer);
  }, [executeSearch]);

  if (!mounted) return <div className="animate-pulse bg-muted h-64 border border-border" />;

  return (
    <div className="space-y-6 w-full">
      {/* Live Status & Provider Bar */}
      <LiveStatusHeader
        provider={GITHUB_PROVIDER}
        lastUpdated={lastUpdated}
        loading={loading}
        onRefresh={() => executeSearch(query)}
      />

      {/* Search Bar Input */}
      <div className="bg-card border-2 border-border p-4 card-depth-1 space-y-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(query);
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              aria-label="GitHub query input"
              className="pl-10 h-10 text-xs font-mono"
            />
          </div>
          <Button type="submit" disabled={loading} className="h-10 px-6 font-bold text-xs shrink-0">
            {loading ? 'Querying...' : t.searchButton}
          </Button>
        </form>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
          <span className="font-bold text-muted-foreground uppercase">{t.recentSearches}:</span>
          {POPULAR_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                setQuery(p.q);
                executeSearch(p.q);
              }}
              className="border border-border bg-muted/40 px-2 py-0.5 font-mono hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && <LiveErrorBanner error={error} onRetry={() => executeSearch(query)} />}

      {/* Results View */}
      {data && (
        <div className="bg-card border-2 border-border p-6 card-depth-1 space-y-6">
          {data.type === 'repo' ? (
            (() => {
              const repo = data.result as GitHubRepo;
              return (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-border/60">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="h-5 w-5 text-primary shrink-0" />
                        <h2 className="text-lg font-black text-foreground">{repo.full_name}</h2>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                        {repo.description || 'No repository description provided.'}
                      </p>
                    </div>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-border bg-muted/30 text-xs font-bold hover:border-primary hover:text-primary transition-colors self-start shrink-0"
                    >
                      <span>Open on GitHub</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-muted/20 border border-border space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                        <Star className="h-3.5 w-3.5 text-amber-500" />
                        <span>Stars</span>
                      </div>
                      <p className="text-lg font-black text-foreground">{repo.stargazers_count.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                        <GitFork className="h-3.5 w-3.5 text-blue-500" />
                        <span>Forks</span>
                      </div>
                      <p className="text-lg font-black text-foreground">{repo.forks_count.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                        <span>Open Issues</span>
                      </div>
                      <p className="text-lg font-black text-foreground">{repo.open_issues_count.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border space-y-1">
                      <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                        <Code2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Primary Language</span>
                      </div>
                      <p className="text-lg font-black text-foreground">{repo.language || 'Unknown'}</p>
                    </div>
                  </div>

                  {/* Details Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="p-3 bg-muted/10 border border-border flex items-center justify-between">
                      <span>Default Branch:</span>
                      <span className="font-mono font-bold text-foreground">{repo.default_branch}</span>
                    </div>
                    <div className="p-3 bg-muted/10 border border-border flex items-center justify-between">
                      <span>License:</span>
                      <span className="font-bold text-foreground">{repo.license?.name || 'None detected'}</span>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            (() => {
              const user = data.result as GitHubUser;
              return (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-4 border-b border-border/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatar_url}
                      alt={user.login}
                      className="h-16 w-16 rounded-full border-2 border-border"
                    />
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-foreground">{user.name || user.login}</h2>
                        <span className="text-xs font-mono text-muted-foreground">(@{user.login})</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{user.bio || 'No bio provided.'}</p>
                      {user.location && <p className="text-[11px] text-muted-foreground font-semibold">📍 {user.location}</p>}
                    </div>
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-border bg-muted/30 text-xs font-bold hover:border-primary hover:text-primary transition-colors shrink-0"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-muted/20 border border-border space-y-1">
                      <span className="text-muted-foreground font-bold block">Public Repos</span>
                      <p className="text-lg font-black text-foreground">{user.public_repos.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border space-y-1">
                      <span className="text-muted-foreground font-bold block">Followers</span>
                      <p className="text-lg font-black text-foreground">{user.followers.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border space-y-1">
                      <span className="text-muted-foreground font-bold block">Following</span>
                      <p className="text-lg font-black text-foreground">{user.following.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-muted/20 border border-border space-y-1">
                      <span className="text-muted-foreground font-bold block">Member Since</span>
                      <p className="text-sm font-bold text-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
}
