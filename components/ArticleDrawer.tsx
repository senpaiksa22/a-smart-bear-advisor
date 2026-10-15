'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';
import {
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  BookOpen,
  Clock,
  Globe,
  Share2,
  Check,
  ExternalLink,
  Tag,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { AppTheme } from '@/lib/theme';
import ThemeSelector from '@/components/ThemeSelector';
import { Article } from '@/lib/types';

interface ArticleDrawerProps {
  article: Article | null;
  onClose: () => void;
  lang: 'ar' | 'en';
  onConsultJason: (article: Article) => void;
  theme?: AppTheme;
  onThemeChange?: (theme: AppTheme) => void;
}

export default function ArticleDrawer({
  article,
  onClose,
  lang,
  onConsultJason,
  theme = 'light',
  onThemeChange,
}: ArticleDrawerProps) {
  const [contentLang, setContentLang] = useState<'ar' | 'en'>(lang);
  const [fullContent, setFullContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const isAr = lang === 'ar';
  const isContentAr = contentLang === 'ar';

  // Prevent background scroll bleed when reader is open
  useEffect(() => {
    if (article) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [article]);

  // Synchronize content language when article changes
  useEffect(() => {
    if (article) {
      setContentLang(lang);
      loadContent(article.slug, lang);
    }
  }, [article, lang]);

  const loadContent = (slug: string, l: 'ar' | 'en') => {
    setLoadingContent(true);
    fetch(`/api/articles/${slug}?lang=${l}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.content) {
          setFullContent(data.content);
        } else {
          setFullContent('');
        }
      })
      .catch((err) => {
        console.error('Error loading article:', err);
        setFullContent('');
      })
      .finally(() => setLoadingContent(false));
  };

  const handleLangToggle = (targetLang: 'ar' | 'en') => {
    if (targetLang === contentLang || !article) return;
    setContentLang(targetLang);
    loadContent(article.slug, targetLang);
  };

  const handleCopyLink = () => {
    if (!article) return;
    navigator.clipboard.writeText(article.url || window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Parse markdown content clean of frontmatter & duplicated titles
  const cleanBody = useMemo(() => {
    if (!fullContent) return '';
    let body = fullContent.replace(/^---[\s\S]*?---\s*/, '');
    
    // Find the metadata divider (---) separating the top executive summary from article body
    const dividerIdx = body.indexOf('\n---');
    if (dividerIdx !== -1) {
      body = body.slice(dividerIdx + 4).replace(/^-+\r?\n+/, '');
    } else {
      // Fallback: strip H1 and H3 titles
      body = body.replace(/^#\s+[^\n]+\r?\n+/, '');
      body = body.replace(/^###\s+[^\n]+\r?\n+/, '');
      body = body.replace(/^>[\s\S]*?\r?\n\s*---\s*\r?\n*/, '');
    }
    return body.trim();
  }, [fullContent]);

  if (!article) return null;

  const title = isContentAr ? article.title_ar || article.title_en : article.title_en;
  const originalTitle = isContentAr ? article.title_en : article.title_ar;
  const category = isContentAr ? article.category_ar || article.category_en : article.category_en;
  const summary = isContentAr ? article.summary_ar || article.summary_en : article.summary_en;

  const subtopics = isContentAr
    ? article.subtopics_ar?.length
      ? article.subtopics_ar
      : article.subtopics_en || article.subtopics || []
    : article.subtopics_en?.length
    ? article.subtopics_en
    : article.subtopics_ar || article.subtopics || [];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-50/98 dark:bg-[#0c0d14]/98 backdrop-blur-xl animate-in fade-in duration-200"
      style={{ direction: isContentAr ? 'rtl' : 'ltr' }}
    >
      {/* ==================================================================== */}
      {/* TOP NAVIGATION & CONTROLS BAR */}
      {/* ==================================================================== */}
      <div className="sticky top-0 z-30 w-full bg-white/95 dark:bg-[#12141e]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-all shadow-xs"
          >
            {isContentAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isContentAr ? 'العودة إلى الخريطة والمحاور' : 'Back to Themes & Map'}</span>
          </button>

          {/* Action Center: Language Switcher & Consult Jason */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-bold">
              <button
                onClick={() => handleLangToggle('ar')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  isContentAr
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => handleLangToggle('en')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  !isContentAr
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-300'
                }`}
              >
                English
              </button>
            </div>

            {/* 6 Color Themes Selector */}
            {onThemeChange && (
              <ThemeSelector
                currentTheme={theme}
                onThemeChange={onThemeChange}
                lang={contentLang}
              />
            )}

            {/* Consult Jason Button */}
            <button
              onClick={() => onConsultJason(article)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-bear-600 to-amber-600 hover:from-bear-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-bear-600/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span className="hidden sm:inline">
                {isContentAr ? 'استشر جيسون حول هذا المبدأ' : 'Consult Jason'}
              </span>
              <span className="sm:hidden">{isContentAr ? 'استشر' : 'Ask'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* ARTICLE READING CANVAS (شاشة كاملة، عرض مريح، خطوط منسقة) */}
      {/* ==================================================================== */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-32 sm:pt-12 sm:pb-40 space-y-8">
        {/* Article Header Meta */}
        <div className="space-y-4 pb-6 border-b border-stone-200/80 dark:border-stone-800/80">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-bear-100 dark:bg-bear-950 text-bear-800 dark:text-bear-200 border border-bear-500/25">
              {category}
            </span>
            {article.published_date && (
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {(() => {
                  try {
                    const d = new Date(article.published_date);
                    if (isNaN(d.getTime())) return article.published_date;
                    if (isContentAr) {
                      const arMonths = [
                        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
                      ];
                      return `${d.getDate()} ${arMonths[d.getMonth()]} ${d.getFullYear()}`;
                    }
                    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                  } catch {
                    return article.published_date;
                  }
                })()}
              </span>
            )}
            <button
              onClick={handleCopyLink}
              className="text-xs font-medium text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? (isContentAr ? 'تم النسخ!' : 'Copied!') : (isContentAr ? 'مشاركة' : 'Share')}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
            {title}
          </h1>

          {originalTitle && originalTitle !== title && (
            <p className="text-sm sm:text-base text-stone-400 dark:text-stone-500 font-medium italic">
              {originalTitle}
            </p>
          )}

          {/* Executive Summary Callout Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/[0.07] to-bear-500/[0.05] dark:from-amber-500/[0.1] dark:to-bear-500/[0.05] border border-amber-500/30 text-stone-800 dark:text-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>{isContentAr ? 'الملخص التنفيذي للمقال' : 'Executive Summary'}</span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed font-medium">
              {summary}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <ExternalLink className="w-3.5 h-3.5" />
              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-bear-600 dark:hover:text-bear-400 underline underline-offset-2"
              >
                {isContentAr ? 'الرابط الأصلي على مدونة A Smart Bear' : 'Original article on A Smart Bear'}
              </a>
            </div>
          </div>
        </div>

        {/* Subtopics Pills / Key Ideas */}
        {subtopics.length > 0 && (
          <div className="space-y-3 p-5 rounded-2xl bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-bear-600" />
              <span>{isContentAr ? 'المحاور والدروس المستفادة:' : 'Key Subtopics & Lessons:'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {subtopics.map((st, idx) => {
                const stTitle = isContentAr ? st.title_ar || st.title_en || st.title : st.title_en || st.title_ar || st.title;
                const stTakeaway = isContentAr ? st.takeaway_ar || st.takeaway_en || st.takeaway : st.takeaway_en || st.takeaway_ar || st.takeaway;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60 text-xs space-y-1 shadow-2xs"
                  >
                    <span className="font-bold text-stone-900 dark:text-white block">
                      {st.num || idx + 1}. {stTitle}
                    </span>
                    {stTakeaway && (
                      <p className="text-stone-500 dark:text-stone-400 text-[11px] leading-relaxed">
                        {stTakeaway}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Article Full Body */}
        <article className="prose prose-stone dark:prose-invert max-w-none text-stone-800 dark:text-stone-200 text-sm sm:text-base leading-relaxed space-y-6">
          {loadingContent ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-bear-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-stone-500">
                {isContentAr ? 'جاري تحميل المقال المترجم وتنسيقه...' : 'Loading full essay...'}
              </p>
            </div>
          ) : cleanBody ? (
            <MarkdownRenderer content={cleanBody} isAr={isContentAr} />
          ) : (
            <div className="text-center py-12 text-stone-400">
              {isContentAr ? 'المحتوى قيد التحديث' : 'Content unavailable'}
            </div>
          )}
        </article>

        {/* Bottom Call to Action */}
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-bear-900 to-amber-900 text-white text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center mx-auto text-2xl">
            🐻
          </div>
          <div className="space-y-1.5 max-w-xl mx-auto">
            <h3 className="text-xl font-bold">
              {isContentAr
                ? 'هل تريد تطبيق هذا المبدأ على شركتك أو مشروعك؟'
                : 'Want to apply this framework to your startup?'}
            </h3>
            <p className="text-xs sm:text-sm text-bear-100 leading-relaxed">
              {isContentAr
                ? 'استشر جيسون كوهين الآن عبر الذكاء الاصطناعي لمناقشة تحدياتك والحصول على نصائح تكتيكية مباشرة.'
                : 'Consult Jason Cohen AI right now with the context of this essay to stress-test your strategy.'}
            </p>
          </div>
          <button
            onClick={() => onConsultJason(article)}
            className="px-6 py-3 rounded-2xl bg-white text-bear-950 font-black text-sm hover:bg-amber-100 transition-all shadow-lg active:scale-95"
          >
            {isContentAr ? 'افتح المحادثة الاستشارية مع جيسون' : 'Launch Advisory Consultation'}
          </button>
        </div>
      </main>
    </div>
  );
}

// ==============================================================================
// High-Fidelity Markdown Renderer via marked with Full Typography & Table Support
// ==============================================================================
function MarkdownRenderer({ content, isAr }: { content: string; isAr: boolean }) {
  const html = useMemo(() => {
    if (!content) return '';
    try {
      const renderer = new marked.Renderer();
      renderer.image = ({ href, text, title }: { href: string; text: string; title?: string | null }) => {
        return `<figure class="my-6 text-center">
          <img src="${href}" alt="${text || ''}" loading="lazy" class="rounded-xl border border-stone-200 dark:border-stone-800 shadow-md max-w-full h-auto mx-auto block" onerror="this.onerror=null; const p = this.closest('figure'); if(p) p.style.display='none'; else this.style.display='none';" />
          ${text ? `<figcaption class="text-xs text-stone-400 dark:text-stone-500 mt-2 text-center italic">${text}</figcaption>` : ''}
        </figure>`;
      };

      marked.setOptions({
        gfm: true,
        breaks: false,
        renderer,
      });
      return marked.parse(content) as string;
    } catch (err) {
      console.error('Markdown rendering error:', err);
      return `<p>${content}</p>`;
    }
  }, [content]);

  return (
    <div
      className="prose-bear"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
