import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '@/config/tools-registry';
import { CATEGORIES } from '@/config/categories';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tools.chinmaypatil.com';

  const routes = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
  ];

  const categoryRoutes = CATEGORIES.map((cat) => ({
    url: `${siteUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const toolRoutes = TOOLS_REGISTRY.filter((t) => t.status === 'published').map((tool) => ({
    url: `${siteUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...categoryRoutes, ...toolRoutes];
}
