'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Sparkles, BookOpen, Clock, Tag, ChevronRight, FileText, CheckCircle2 } from 'lucide-react';
import { Article } from '@/lib/types';

interface ArticleDrawerProps {
  article: Article | null;
  onClose: () => void;
  lang: 'ar' | 'en';
  onConsultJason: (article: Article) => void;
}

export default function ArticleDrawer({
  article,
  onClose,
  lang,
  onConsultJason,
}: ArticleDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'full'>('overview');
  const [fullContent, setFullContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [contentLang, setContentLang] = useState<'ar' | 'en'>(lang);

  const isAr = lang === 'ar';

  // Synchronize contentLang with active lang when article changes
  useEffect(() => {
    if (article) {
      setContentLang(lang);
      setActiveTab('overview');
      setFullContent('');
    }
  }, [article, lang]);

  // Load full article content when full tab is selected or contentLang changes
  useEffect(() => {
    if (article && activeTab === 'full') {
      setLoadingContent(true);
      fetch(`/api/articles/${article.slug}?lang=${contentLang}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.content) {
            setFullContent(data.content);
          } else {
            setFullContent('Failed to load article content.');
          }
        })
        .catch(() => setFullContent('Error loading article.'))
        .finally(() => setLoadingContent(false));
    }
  }, [article, activeTab, contentLang]);

  if (!article) return null;

  const title = isAr ? article.title_ar || article.title_en : article.title_en;
  const originalTitle = isAr ? article.title_en : article.title_ar;
  const category = isAr ? article.category_ar || article.category_en : article.category_en;
  const summary = isAr ? article.summary_ar || article.summary_en : article.summary_en;
  const subtopics = isAr
    ? article.subtopics_ar?.length
      ? article.subtopics_ar
      : article.subtopics_en || article.subtopics || []
    : article.subtopics_en?.length
    ? article.subtopics_en
    : article.subtopics_ar || article.subtopics || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10"
        style={{ direction: isAr ? 'rtl' : 'ltr' }}
      >
        <div
          className="w-screen max-w-2xl bg-white dark:bg-stone-950 shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col h-full animate-in slide-in-from-right duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-4 bg-stone-50/50 dark:bg-stone-900/50">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-bear-500/10 text-bear-700 dark:text-bear-300 border border-bear-500/20">
                  {category}
                </span>
                {article.published_date && (
                  <span className="text-xs text-stone-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {article.published_date.split(' ').slice(1, 4).join(' ')}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
                {title}
              </h2>
              {originalTitle && (
                <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500 mt-1">
                  {originalTitle}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between px-6 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 text-sm font-bold border-b-2 transition-all ${
                  activeTab === 'overview'
                    ? 'border-bear-600 text-bear-700 dark:text-bear-400'
                    : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
              >
                {isAr ? 'الملخص والمحاور' : 'Summary & Key Points'}
              </button>
              <button
                onClick={() => setActiveTab('full')}
                className={`py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'full'
                    ? 'border-bear-600 text-bear-700 dark:text-bear-400'
                    : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                {isAr ? 'قراءة المقال كاملاً' : 'Read Full Article'}
              </button>
            </div>

            {/* Language switch when reading full article */}
            {activeTab === 'full' && (
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setContentLang('ar')}
                  className={`px-2 py-0.5 rounded ${
                    contentLang === 'ar'
                      ? 'bg-white dark:bg-stone-800 text-bear-600 dark:text-bear-400 shadow-sm'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  عربي
                </button>
                <button
                  onClick={() => setContentLang('en')}
                  className={`px-2 py-0.5 rounded ${
                    contentLang === 'en'
                      ? 'bg-white dark:bg-stone-800 text-bear-600 dark:text-bear-400 shadow-sm'
                      : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  English
                </button>
              </div>
            )}
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {activeTab === 'overview' ? (
              <>
                {/* Executive Summary */}
                <div className="p-4 rounded-2xl bg-bear-50 dark:bg-bear-950/30 border border-bear-200 dark:border-bear-900/50">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-bear-800 dark:text-bear-300 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {isAr ? 'الملخص التنفيذي' : 'Executive Summary'}
                  </h3>
                  <p className="text-sm sm:text-base text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
                    {summary}
                  </p>
                </div>

                {/* Subtopics Breakdown */}
                {subtopics && subtopics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-bear-600" />
                      {isAr ? 'تفكيك المحاور والأفكار المستفادة' : 'Subtopics & Key Takeaways'}
                    </h3>
                    <div className="space-y-3">
                      {subtopics.map((st, i) => {
                        const stTitle = isAr ? st.title_ar || st.title_en || st.title : st.title_en || st.title_ar || st.title;
                        const stTakeaway = isAr ? st.takeaway_ar || st.takeaway_en || st.takeaway : st.takeaway_en || st.takeaway_ar || st.takeaway;
                        const stKeywords = isAr ? st.keywords_ar || st.keywords_en || st.keywords : st.keywords_en || st.keywords_ar || st.keywords;

                        return (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800/80 transition-all hover:border-bear-500/30"
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-bear-500/10 text-bear-700 dark:text-bear-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                {st.num || i + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-1">
                                  {stTitle}
                                </h4>
                                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-2">
                                  {stTakeaway}
                                </p>
                                {stKeywords && stKeywords.length > 0 && (
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {stKeywords.map((kw, kIdx) => (
                                      <span
                                        key={kIdx}
                                        className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-stone-800 text-stone-500 border border-stone-200 dark:border-stone-700 font-mono"
                                      >
                                        #{kw}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Original Article External Link */}
                <div className="pt-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-bear-600 dark:text-bear-400 hover:underline font-semibold"
                  >
                    <span>{isAr ? 'قراءة المقال في موقعه الأصلي' : 'View on original website'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </>
            ) : (
              /* Full Article Reader */
              <div>
                {loadingContent ? (
                  <div className="py-20 text-center text-stone-400 text-sm">
                    {isAr ? 'جاري تحميل نص المقال كاملاً...' : 'Loading full article content...'}
                  </div>
                ) : (
                  <article className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-stone-800 dark:text-stone-200 whitespace-pre-line font-serif">
                    {fullContent}
                  </article>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 sm:p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-between gap-3">
            <button
              onClick={() => onConsultJason(article)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-bear-600 hover:bg-bear-700 text-white font-bold text-sm shadow-lg shadow-bear-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'استشر جيسون حول هذا المبدأ' : 'Consult Jason About This Principle'}</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-semibold transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
