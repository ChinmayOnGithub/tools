import { fetchLiveApi } from '@/lib/api/client';

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  license?: { name: string };
  default_branch: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  company?: string;
  blog?: string;
  location?: string;
  bio?: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export const GITHUB_PROVIDER = {
  name: 'GitHub REST API',
  url: 'https://docs.github.com/en/rest',
  privacyNote: 'Queries are sent directly to api.github.com. Public read-only endpoints are rate-limited to 60 requests/hr per IP.',
};

export async function fetchGitHubData(query: string) {
  const clean = query.trim().replace(/^https:\/\/github\.com\//, '');
  if (!clean) return { data: null, error: 'Please enter a GitHub repository (owner/repo) or username.', lastUpdated: new Date().toLocaleTimeString() };

  const isRepo = clean.includes('/');
  const endpoint = isRepo 
    ? `https://api.github.com/repos/${clean}`
    : `https://api.github.com/users/${clean}`;

  return fetchLiveApi<{ type: 'repo' | 'user'; result: GitHubRepo | GitHubUser }>(
    endpoint,
    GITHUB_PROVIDER,
    {
      transform: (raw: unknown) => ({
        type: isRepo ? 'repo' : 'user',
        result: raw as GitHubRepo | GitHubUser,
      }),
      cacheTtlMs: 2 * 60 * 1000, // 2 minutes
    }
  );
}
