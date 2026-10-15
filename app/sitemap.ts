import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://a-smart-bear-advisor.vercel.app';

  // Base home page
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];

  // Load all 213 articles from knowledge_index.json
  try {
    const indexPath = path.join(process.cwd(), 'data', 'knowledge_index.json');
    if (fs.existsSync(indexPath)) {
      const articles = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

      for (const article of articles) {
        let lastMod = new Date();
        if (article.published_date) {
          const d = new Date(article.published_date);
          if (!isNaN(d.getTime())) lastMod = d;
        }

        routes.push({
          url: `${baseUrl}/?article=${encodeURIComponent(article.slug)}`,
          lastModified: lastMod,
          changeFrequency: 'monthly',
          priority: 0.8,
        });
      }
    }
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }

  return routes;
}
