import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { marked } from 'marked';

interface ArticleMeta {
  id: number | string;
  slug: string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  category_ar: string;
  category_en: string;
  published_date: string;
  url: string;
  read_time?: string;
  reading_time_minutes?: number;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://a-smart-bear-advisor.vercel.app';

function getAllArticles(): ArticleMeta[] {
  try {
    const indexPath = path.join(process.cwd(), 'data', 'knowledge_index.json');
    if (fs.existsSync(indexPath)) {
      return JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading articles index:', err);
  }
  return [];
}

function getArticleData(slug: string): { meta: ArticleMeta; content: string } | null {
  const articles = getAllArticles();
  const meta = articles.find((a) => a.slug.toLowerCase() === slug.toLowerCase());
  if (!meta) return null;

  let content = '';
  const arPath = path.join(process.cwd(), 'data', 'articles_ar', `${slug}.md`);
  const enPath = path.join(process.cwd(), 'data', 'articles', `${slug}.md`);

  if (fs.existsSync(arPath)) {
    content = fs.readFileSync(arPath, 'utf-8');
  } else if (fs.existsSync(enPath)) {
    content = fs.readFileSync(enPath, 'utf-8');
  }

  // Strip YAML frontmatter if present
  if (content.startsWith('---')) {
    const secondDelim = content.indexOf('---', 3);
    if (secondDelim !== -1) {
      content = content.slice(secondDelim + 3).trim();
    }
  }

  // Remove redundant top headings if they mirror the title to preserve a single semantic H1
  content = content.replace(/^#\s+[^\n]+\n*/, '');
  content = content.replace(/^###\s+[^\n]+\n*/, '');

  return { meta, content };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getArticleData(slug);
  if (!data) {
    return {
      title: 'المقال غير موجود | مستشار الدب الذكي',
    };
  }

  const { meta } = data;
  const title = meta.title_ar || meta.title_en;
  const description = meta.summary_ar || meta.summary_en;
  const canonicalUrl = `${siteUrl}/articles/${meta.slug}`;

  return {
    title: `${title} | جيسون كوهين`,
    description,
    authors: [{ name: 'Jason Cohen' }, { name: 'A Smart Bear Advisor' }],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'ar-SA': canonicalUrl,
        'en-US': `${canonicalUrl}?lang=en`,
        'x-default': canonicalUrl,
      },
    },
    openGraph: {
      title: `${title} | مستشار الدب الذكي`,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: meta.published_date,
      authors: ['Jason Cohen'],
      siteName: 'A Smart Bear Advisor',
      images: [
        {
          url: `${siteUrl}/og-image.png?v=3`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | جيسون كوهين`,
      description,
      creator: '@asmartbear',
      images: [`${siteUrl}/og-image.png?v=3`],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getArticleData(slug);
  if (!data) notFound();

  const { meta, content } = data;
  const allArticles = getAllArticles();

  // Find index for prev/next
  const currentIndex = allArticles.findIndex((a) => a.slug === meta.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Custom marked renderer for rich SEO links and responsive images
  const renderer = new marked.Renderer();

  renderer.image = ({ href, text }: { href: string; text: string; title?: string | null }) => {
    return `<figure class="my-8 text-center">
      <img src="${href}" alt="${text || meta.title_ar}" loading="lazy" decoding="async" class="rounded-xl border border-stone-200 dark:border-stone-800 shadow-md max-w-full h-auto mx-auto block" onerror="this.style.display='none'" />
      ${text ? `<figcaption class="text-xs text-stone-500 dark:text-stone-400 mt-2 text-center italic">${text}</figcaption>` : ''}
    </figure>`;
  };

  renderer.link = ({ href, text }: { href: string; text: string; title?: string | null }) => {
    if (!href) return text;

    // Check if it's an internal essay link
    let matchedSlug = '';
    try {
      if (href.includes('asmartbear.com')) {
        const urlObj = new URL(href, 'https://asmartbear.com');
        const parts = urlObj.pathname.split('/').filter(Boolean);
        if (parts.length > 0) matchedSlug = parts[parts.length - 1];
      } else if (href.startsWith('/articles/')) {
        matchedSlug = href.replace('/articles/', '').replace('/', '');
      } else if (href.includes('article=')) {
        const urlObj = new URL(href, siteUrl);
        matchedSlug = urlObj.searchParams.get('article') || '';
      }
    } catch {}

    if (matchedSlug) {
      const target = allArticles.find((a) => a.slug.toLowerCase() === matchedSlug.toLowerCase());
      if (target) {
        return `<a href="/articles/${target.slug}" class="font-bold text-amber-700 dark:text-amber-400 underline underline-offset-4 decoration-amber-500/40 hover:text-amber-800 dark:hover:text-amber-300 transition-colors" title="${target.title_ar}">${text}</a>`;
      }
    }

    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-stone-700 dark:text-stone-300 underline underline-offset-2 hover:text-amber-600 transition-colors">${text}</a>`;
  };

  marked.setOptions({
    gfm: true,
    breaks: false,
    renderer,
  });

  const parsedHtml = marked.parse(content) as string;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${siteUrl}/articles/${meta.slug}#article`,
    headline: meta.title_ar,
    alternativeHeadline: meta.title_en,
    description: meta.summary_ar,
    inLanguage: 'ar-SA',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${meta.slug}`,
    },
    datePublished: meta.published_date,
    dateModified: meta.published_date,
    author: {
      '@type': 'Person',
      name: 'Jason Cohen',
      url: 'https://longform.asmartbear.com',
      sameAs: [
        'https://twitter.com/asmartbear',
        'https://www.linkedin.com/in/jasonmcohen',
        'https://en.wikipedia.org/wiki/WP_Engine',
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: 'مستشار الدب الذكي | A Smart Bear Advisor',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.png`,
      },
    },
    articleSection: meta.category_ar,
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-900 dark:selection:text-amber-200">
      {/* Article Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform hover:scale-[1.01]"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-600/10 dark:bg-amber-500/20 flex items-center justify-center text-xl shadow-inner border border-amber-600/20">
            🐻
          </div>
          <div>
            <h2 className="font-bold text-base leading-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
              مستشار الدب الذكي
            </h2>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-none">
              A Smart Bear Advisor • جيسون كوهين
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/?article=${encodeURIComponent(meta.slug)}&chat=true`}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
          >
            <span>💬</span>
            <span className="hidden sm:inline">ناقش المقال مع المستشار</span>
            <span className="sm:hidden">استشر</span>
          </Link>
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-stone-200/60 dark:bg-stone-800/60 hover:bg-stone-200 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 transition-colors"
          >
            الرئيسية
          </Link>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto w-full px-4 pt-6 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <Link href="/" className="hover:text-amber-600 transition-colors">
            الرئيسية
          </Link>
          <span>/</span>
          <span className="text-stone-600 dark:text-stone-300">المقالات</span>
          <span>/</span>
          <span className="text-amber-700 dark:text-amber-400 truncate max-w-xs">{meta.category_ar}</span>
        </nav>
      </div>

      {/* Main Article Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <article className="bg-white dark:bg-stone-900/60 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 md:p-10 shadow-sm">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium border border-amber-500/20">
              {meta.category_ar}
            </span>
            {meta.published_date && (
              <time
                itemProp="datePublished"
                dateTime={meta.published_date}
                className="published post-date text-stone-500 dark:text-stone-400 flex items-center gap-1"
              >
                <span>📅</span> {new Date(meta.published_date).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            )}
            <span className="author byline text-stone-500 dark:text-stone-400 flex items-center gap-1" itemProp="author">
              <span>✍️</span> تأليف: <span className="font-semibold text-stone-700 dark:text-stone-300">جيسون كوهين (Jason Cohen)</span>
            </span>
          </div>

          {/* Titles */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight mb-3">
            {meta.title_ar}
          </h1>
          {meta.title_en && (
            <p className="text-sm md:text-base text-stone-500 dark:text-stone-400 font-mono mb-6">
              {meta.title_en}
            </p>
          )}

          {/* Executive Summary Callout Box (Answer Engine Optimization) */}
          {meta.summary_ar && (
            <div className="my-6 p-5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border-r-4 border-amber-600 text-stone-800 dark:text-stone-200 text-sm leading-relaxed shadow-xs">
              <div className="font-bold text-amber-900 dark:text-amber-400 mb-1 flex items-center gap-1.5 text-xs">
                <span>⚡</span> الملخص التنفيذي والاستراتيجي:
              </div>
              <p>{meta.summary_ar}</p>
            </div>
          )}

          {/* Full Article Content */}
          <div
            className="entry-content article-content prose prose-stone dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 leading-relaxed text-base md:text-lg mt-8"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
          />

          {/* Original Article Reference */}
          {meta.url && (
            <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span>المقال الأصلي باللغة الإنجليزية: </span>
                <a
                  href={meta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline"
                >
                  {meta.url}
                </a>
              </div>
              <span className="text-stone-400">© Jason Cohen • A Smart Bear</span>
            </div>
          )}
        </article>

        {/* Prev / Next Navigation for Internal Link Graph */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          {prevArticle ? (
            <Link
              href={`/articles/${prevArticle.slug}`}
              className="p-4 rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/50 transition-all group flex flex-col justify-between"
            >
              <span className="text-[11px] text-stone-500 font-medium">← المقال السابق</span>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200 group-hover:text-amber-600 transition-colors mt-1 line-clamp-2">
                {prevArticle.title_ar}
              </span>
            </Link>
          ) : <div />}
          {nextArticle && (
            <Link
              href={`/articles/${nextArticle.slug}`}
              className="p-4 rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-500/50 transition-all group flex flex-col justify-between text-left sm:text-right"
            >
              <span className="text-[11px] text-stone-500 font-medium">المقال التالي →</span>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200 group-hover:text-amber-600 transition-colors mt-1 line-clamp-2">
                {nextArticle.title_ar}
              </span>
            </Link>
          )}
        </div>

        {/* Interactive Sticky Action Banner */}
        <div className="sticky bottom-6 z-20 mt-8 p-4 rounded-2xl bg-amber-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-md">
          <div className="text-center sm:text-right">
            <h3 className="font-bold text-sm sm:text-base leading-tight">
              هل تواجه تحدياً مشابهاً في شركتك أو مشروعك؟
            </h3>
            <p className="text-xs text-amber-100 mt-0.5">
              ناقش تفاصيل هذا المقال وكيفية تطبيقه على فكرتك مع المستشار الذكي جيسون كوهين
            </p>
          </div>
          <Link
            href={`/?article=${encodeURIComponent(meta.slug)}&chat=true`}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white text-amber-900 font-bold text-xs sm:text-sm text-center shadow-sm hover:bg-amber-50 transition-all shrink-0 hover:scale-[1.02]"
          >
            بدء الاستشارة حول المقال 💬
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 px-4 text-center text-xs text-stone-500 dark:text-stone-400">
        <p>مستشار الدب الذكي | A Smart Bear Advisor — خلاصة 213 مقالاً استراتيجياً من جيسون كوهين</p>
      </footer>
    </div>
  );
}
