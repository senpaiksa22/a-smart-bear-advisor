import fs from 'fs';
import path from 'path';
import HomeClient from '@/components/HomeClient';
import { Article, Cluster } from '@/lib/types';

export default function HomePage() {
  let initialArticles: Article[] = [];
  let initialClusters: Cluster[] = [];

  try {
    const dataDir = path.join(process.cwd(), 'data');
    const indexFile = path.join(dataDir, 'knowledge_index.json');
    const clustersFile = path.join(dataDir, 'clusters.json');

    if (fs.existsSync(indexFile)) {
      initialArticles = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));
    }
    if (fs.existsSync(clustersFile)) {
      initialClusters = JSON.parse(fs.readFileSync(clustersFile, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading initial data for HomePage SSR:', err);
  }

  return (
    <>
      <HomeClient
        initialArticles={initialArticles}
        initialClusters={initialClusters}
      />
      {/* Semantic Noscript Fallback for Search Bots & Text-Only AI Analyzers */}
      <noscript>
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
          <h1>مستشار الدب الذكي | A Smart Bear Advisor</h1>
          <p>
            المنصة الاستراتيجية والمعرفية المستندة إلى فكر وتجارب جيسون كوهين (مؤسس WP Engine و Smart Bear) — أكثر من 213 مقالاً استراتيجياً ونموذجاً فكرياً ومستشار ذكاء اصطناعي تفاعلي لرواد الأعمال والشركات الناشئة.
          </p>
          <h2>المحاور الاستراتيجية الـ 8:</h2>
          <ul>
            {initialClusters.map((c) => (
              <li key={c.id}>
                <strong>{c.name_ar}</strong>: {c.description_ar} ({c.article_count} مقالاً)
              </li>
            ))}
          </ul>
          <h2>تصفح المقالات:</h2>
          <ul>
            {initialArticles.slice(0, 50).map((a) => (
              <li key={a.slug}>
                <a href={`/articles/${a.slug}`}>{a.title_ar || a.title_en}</a>: {a.summary_ar}
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </>
  );
}
