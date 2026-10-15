'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  ExternalLink,
  X,
  ChevronRight,
  Clock,
  Pin,
  ArrowRight,
  ArrowLeft,
  FileText,
  Filter,
} from 'lucide-react';
import { marked } from 'marked';
import { Article } from '@/lib/types';
import { FounderChallenge } from './types';
import { FOUNDER_CHALLENGES } from './playbooksData';

interface V2PlaybookDrawerProps {
  lang: 'ar' | 'en';
  isOpen: boolean;
  onClose: () => void;
  activeChallenge: FounderChallenge;
  allArticles: Article[];
  onPinArticleContext: (article: Article) => void;
  selectedArticleSlug: string | null;
  onSelectArticleSlug: (slug: string | null) => void;
}

export default function V2PlaybookDrawer({
  lang,
  isOpen,
  onClose,
  activeChallenge,
  allArticles,
  onPinArticleContext,
  selectedArticleSlug,
  onSelectArticleSlug,
}: V2PlaybookDrawerProps) {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'playbook' | 'all' | 'reading'>('playbook');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingContent, setReadingContent] = useState<string | null>(null);
  const [readingLoading, setReadingLoading] = useState(false);

  // Selected article object
  const currentReadingArticle = useMemo(() => {
    if (!selectedArticleSlug) return null;
    return allArticles.find((a) => a.slug === selectedArticleSlug) || null;
  }, [selectedArticleSlug, allArticles]);

  // Curated articles for the current active challenge
  const challengeArticles = useMemo(() => {
    const slugs = activeChallenge.curatedSlugs;
    return allArticles.filter((art) => slugs.includes(art.slug));
  }, [activeChallenge, allArticles]);

  // Filtered list of all articles for search tab
  const filteredAllArticles = useMemo(() => {
    if (!searchQuery.trim()) return allArticles;
    const q = searchQuery.toLowerCase();
    return allArticles.filter((art) => {
      const title = (isAr ? art.title_ar || art.title_en : art.title_en).toLowerCase();
      const summary = (isAr ? art.summary_ar || art.summary_en : art.summary_en).toLowerCase();
      return title.includes(q) || summary.includes(q);
    });
  }, [allArticles, searchQuery, isAr]);

  // Load article body when slug is selected
  useEffect(() => {
    if (selectedArticleSlug) {
      setActiveTab('reading');
      setReadingLoading(true);
      fetch(`/api/articles/${selectedArticleSlug}?lang=${lang}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setReadingContent(data.content);
          } else {
            setReadingContent(null);
          }
        })
        .catch(() => setReadingContent(null))
        .finally(() => setReadingLoading(false));
    }
  }, [selectedArticleSlug, lang]);

  if (!isOpen) return null;

  return (
    <div
      className="w-full lg:w-[480px] xl:w-[540px] h-full flex flex-col bg-white dark:bg-[#10121a] border-s border-stone-200/90 dark:border-stone-800/90 shadow-2xl z-30 transition-all shrink-0 animate-in slide-in-from-end duration-200"
    >
      {/* Header Tabs */}
      <div className="p-3 border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800/60 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('playbook');
              onSelectArticleSlug(null);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
              activeTab === 'playbook'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {isAr ? 'الدليل المركز' : 'Curated Playbook'}
          </button>
          <button
            onClick={() => {
              setActiveTab('all');
              onSelectArticleSlug(null);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
            }`}
          >
            {isAr ? 'كل المقالات (213)' : 'All 213 Essays'}
          </button>
          {currentReadingArticle && (
            <button
              onClick={() => setActiveTab('reading')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                activeTab === 'reading'
                  ? 'bg-white dark:bg-stone-900 text-bear-600 dark:text-bear-400 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {isAr ? 'القراءة' : 'Reading'}
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          title={isAr ? 'إغلاق اللوحة' : 'Close panel'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================================================================== */}
        {/* TAB 1: CURATED PLAYBOOK */}
        {/* ================================================================== */}
        {activeTab === 'playbook' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-200 mb-1">
                <span>{activeChallenge.icon}</span>
                <span>{isAr ? activeChallenge.title_ar : activeChallenge.title_en}</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300/90 leading-relaxed">
                {isAr
                  ? 'مقالات مختارة بعناية من تجارب جيسون كوهين لمعالجة هذا التحدي بالذات:'
                  : 'Handpicked foundational essays by Jason Cohen tackling this exact challenge:'}
              </p>
            </div>

            <div className="space-y-3">
              {challengeArticles.map((art) => (
                <ArticleCard
                  key={art.slug}
                  article={art}
                  lang={lang}
                  onRead={() => onSelectArticleSlug(art.slug)}
                  onPin={() => onPinArticleContext(art)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: ALL 213 ESSAYS EXPLORER */}
        {/* ================================================================== */}
        {activeTab === 'all' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute top-3 start-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث في الـ 213 مقالاً بالكلمة المفتاحية...' : 'Search all 213 essays by keyword...'}
                className="w-full ps-9 pe-4 py-2 rounded-xl text-xs bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 outline-none focus:border-bear-500"
              />
            </div>

            <div className="text-[11px] text-stone-400 px-1 font-bold">
              {filteredAllArticles.length} {isAr ? 'مقال متاح' : 'essays found'}
            </div>

            <div className="space-y-2.5">
              {filteredAllArticles.slice(0, 30).map((art) => (
                <ArticleCard
                  key={art.slug}
                  article={art}
                  lang={lang}
                  onRead={() => onSelectArticleSlug(art.slug)}
                  onPin={() => onPinArticleContext(art)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: IN-STUDIO READING CANVAS */}
        {/* ================================================================== */}
        {activeTab === 'reading' && currentReadingArticle && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Top Reading Navigation */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setActiveTab('playbook')}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
              >
                {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{isAr ? 'العودة للدليل' : 'Back to Playbook'}</span>
              </button>

              <button
                onClick={() => onPinArticleContext(currentReadingArticle)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bear-50 dark:bg-bear-950/50 border border-bear-500/30 text-bear-700 dark:text-bear-300 text-xs font-bold hover:bg-bear-100 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'استشر جيسون حول هذا المقال' : 'Consult Jason with this'}</span>
              </button>
            </div>

            {/* Article Title & Metadata */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-bear-500/10 text-bear-700 dark:text-bear-300 border border-bear-500/20">
                {isAr ? currentReadingArticle.category_ar : currentReadingArticle.category_en}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 dark:text-white leading-snug">
                {isAr ? currentReadingArticle.title_ar : currentReadingArticle.title_en}
              </h2>
            </div>

            {/* Subtopics Quick Summary Cards */}
            {((isAr ? currentReadingArticle.subtopics_ar : currentReadingArticle.subtopics_en) || []).length > 0 && (
              <div className="space-y-2 p-3 rounded-2xl bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-stone-800/80">
                <div className="text-[11px] font-black text-stone-500 uppercase tracking-wider">
                  {isAr ? 'أهم المحاور والأفكار المستخلصة:' : 'Key Principles & Frameworks:'}
                </div>
                <div className="space-y-2">
                  {((isAr ? currentReadingArticle.subtopics_ar : currentReadingArticle.subtopics_en) || []).map((sub, i) => (
                    <div key={i} className="text-xs p-2 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60">
                      <span className="font-black text-stone-900 dark:text-white block mb-0.5">
                        {sub.title}
                      </span>
                      <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                        {sub.takeaway}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Markdown Body */}
            {readingLoading ? (
              <div className="py-12 text-center text-xs text-stone-400">
                {isAr ? 'جاري تحميل نص المقال الكامل...' : 'Loading full article text...'}
              </div>
            ) : readingContent ? (
              <ArticleMarkdownRenderer content={readingContent} />
            ) : (
              <p className="text-xs text-stone-500">
                {isAr ? currentReadingArticle.summary_ar : currentReadingArticle.summary_en}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Single Article Card Component
function ArticleCard({
  article,
  lang,
  onRead,
  onPin,
}: {
  article: Article;
  lang: 'ar' | 'en';
  onRead: () => void;
  onPin: () => void;
}) {
  const isAr = lang === 'ar';
  return (
    <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 hover:border-bear-500/40 transition-all shadow-xs flex flex-col justify-between gap-3 group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            {isAr ? article.category_ar : article.category_en}
          </span>
          {article.word_count && (
            <span className="text-[10px] text-stone-400 font-mono">
              {Math.round(article.word_count / 200)} {isAr ? 'دقائق قراءة' : 'min read'}
            </span>
          )}
        </div>
        <h4
          onClick={onRead}
          className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 group-hover:text-bear-600 dark:group-hover:text-bear-400 cursor-pointer transition-colors line-clamp-2"
        >
          {isAr ? article.title_ar : article.title_en}
        </h4>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
          {isAr ? article.summary_ar : article.summary_en}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
        <button
          onClick={onRead}
          className="flex items-center gap-1 text-[11px] font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
        >
          <BookOpen className="w-3 h-3 text-bear-500" />
          <span>{isAr ? 'قراءة المقال' : 'Read Essay'}</span>
        </button>

        <button
          onClick={onPin}
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-bear-50 dark:bg-bear-950/60 text-bear-700 dark:text-bear-300 hover:bg-bear-100 text-[11px] font-black transition-all shadow-xs"
          title={isAr ? 'تقييد هذا المقال كسياق للاستشارة' : 'Pin to consultation'}
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{isAr ? 'استشر جيسون' : 'Consult Jason'}</span>
        </button>
      </div>
    </div>
  );
}

// Markdown renderer for in-studio article reading
function ArticleMarkdownRenderer({ content }: { content: string }) {
  const html = useMemo(() => {
    try {
      return marked.parse(content, { gfm: true }) as string;
    } catch {
      return `<p>${content}</p>`;
    }
  }, [content]);

  return (
    <div
      className="prose-bear text-xs sm:text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
