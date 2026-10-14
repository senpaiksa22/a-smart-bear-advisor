import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const indexFile = path.join(dataDir, 'knowledge_index.json');
    const clustersFile = path.join(dataDir, 'clusters.json');

    let articles = [];
    let clusters = [];

    if (fs.existsSync(indexFile)) {
      const indexContent = fs.readFileSync(indexFile, 'utf-8');
      articles = JSON.parse(indexContent);
    }

    if (fs.existsSync(clustersFile)) {
      const clustersContent = fs.readFileSync(clustersFile, 'utf-8');
      clusters = JSON.parse(clustersContent);
    }

    return NextResponse.json({
      success: true,
      articles,
      clusters,
      total: articles.length,
    });
  } catch (error) {
    console.error('Failed to load articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load knowledge base' },
      { status: 500 }
    );
  }
}
