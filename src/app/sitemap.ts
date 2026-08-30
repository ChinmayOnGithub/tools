import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { CATEGORIES } from '@/config/categories';
import { DOCS_ARTICLES } from '@/config/docs-data';
import { SITE_URL } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = SITE_URL;

  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/docs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/cookies`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  const categoryRoutes = CATEGORIES.map((cat) => ({
    url: `${siteUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const docRoutes = DOCS_ARTICLES.map((article) => ({
    url: `${siteUrl}/docs/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Only index published tools that are not marked noindex
  const toolRoutes = TOOLS_REGISTRY
    .filter((t) => t.status === 'published' && !t.noindex)
    .map((tool) => ({
      url: `${siteUrl}/tools/${tool.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: tool.qualityTier === 'flagship' ? 0.9 : 0.7,
    }));

  return [...routes, ...categoryRoutes, ...docRoutes, ...toolRoutes];
}
