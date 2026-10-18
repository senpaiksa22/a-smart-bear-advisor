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
    <HomeClient
      initialArticles={initialArticles}
      initialClusters={initialClusters}
    />
  );
}
