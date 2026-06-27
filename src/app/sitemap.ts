import { MetadataRoute } from 'next';
import { TOOLS_REGISTRY } from '@/config/tools-registry';

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

  const toolRoutes = TOOLS_REGISTRY.map((tool) => ({
    url: `${siteUrl}/tools/${tool.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...toolRoutes];
}
