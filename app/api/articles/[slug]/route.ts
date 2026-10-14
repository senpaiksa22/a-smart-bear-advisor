import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') === 'en' ? 'en' : 'ar';

    const dataDir = path.join(process.cwd(), 'data');
    const folder = lang === 'en' ? 'articles_en' : 'articles_ar';
    let filePath = path.join(dataDir, folder, `${slug}.md`);

    // Fallback if specific language file doesn't exist yet
    if (!fs.existsSync(filePath)) {
      const fallbackFolder = lang === 'en' ? 'articles_ar' : 'articles_en';
      filePath = path.join(dataDir, fallbackFolder, `${slug}.md`);
    }

    if (!fs.existsSync(filePath)) {
      // Legacy fallback
      filePath = path.join(dataDir, 'articles', `${slug}.md`);
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    return NextResponse.json({
      success: true,
      slug,
      lang,
      content,
    });
  } catch (error) {
    console.error('Error fetching article content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read article file' },
      { status: 500 }
    );
  }
}
