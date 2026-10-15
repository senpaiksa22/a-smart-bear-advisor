'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Share2,
  Check,
} from 'lucide-react';
import { marked } from 'marked';
import { Article } from '@/lib/types';

interface V2ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  lang: 'ar' | 'en';
  onConsult: (article: Article) => void;
}

export default function V2ArticleModal({
  isOpen,
  onClose,
  article,
  lang,
  onConsult,
}: V2ArticleModalProps) {
  const isAr = lang === 'ar';
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [contentLang, setContentLang] = useState<'ar' | 'en'>(lang);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setContentLang(lang);
  }, [lang]);

  useEffect(() => {
    if (isOpen && article) {
      setLoading(true);
      fetch(`/api/articles/${article.slug}?lang=${contentLang}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setContent(data.content);
          } else {
            setContent(null);
          }
        })
        .catch(() => setContent(null))
        .finally(() => setLoading(false));
    }
  }, [isOpen, article, contentLang]);

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  if (!isOpen || !article) return null;

  const isContentAr = contentLang === 'ar';
  const subtopics = isContentAr
    ? article.subtopics_ar || article.subtopics || []
    : article.subtopics_en || article.subtopics || [];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      style={{ direction: isContentAr ? 'rtl' : 'ltr' }}
    >
      <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-6 flex justify-center">
        <div className="relative w-full max-w-4xl bg-white dark:bg-[#0f1118] rounded-3xl border border-stone-200/90 dark:border-stone-800/90 shadow-2xl overflow-hidden flex flex-col my-auto">
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-20 w-full bg-white/95 dark:bg-[#0f1118]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
            >
              {isContentAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isContentAr ? 'العودة لـ Bento Showcase' : 'Back to Bento'}</span>
            </button>

            <div className="flex items-center gap-2">
              {/* Language Switch */}
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-bold">
                <button
                  onClick={() => setContentLang('ar')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    isContentAr
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500'
                  }`}
                >
                  عربي
                </button>
                <button
                  onClick={() => setContentLang('en')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    !isContentAr
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Share */}
              <button
                onClick={handleShare}
                className="p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 transition-colors"
                title={isContentAr ? 'نسخ الرابط' : 'Share'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              {/* Consult */}
              <button
                onClick={() => {
                  onClose();
                  onConsult(article);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-bear-600 to-amber-600 hover:from-bear-700 hover:to-amber-700 text-white font-black text-xs shadow-sm shadow-bear-600/20 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span className="hidden sm:inline">
                  {isContentAr ? 'استشر جيسون حول المقال' : 'Consult Jason'}
                </span>
                <span className="sm:hidden">{isContentAr ? 'استشر' : 'Ask'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Canvas Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Meta */}
            <div className="space-y-3 pb-6 border-b border-stone-200/80 dark:border-stone-800/80">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-bear-500/10 text-bear-700 dark:text-bear-300 border border-bear-500/20 inline-block">
                {isContentAr ? article.category_ar : article.category_en}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-white leading-tight">
                {isContentAr ? article.title_ar : article.title_en}
              </h1>
              <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
                {isContentAr ? article.summary_ar : article.summary_en}
              </p>
            </div>

            {/* Subtopics Cards */}
            {subtopics.length > 0 && (
              <div className="space-y-3 p-4 sm:p-5 rounded-3xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800/80">
                <div className="text-xs font-black uppercase text-stone-500 tracking-wider">
                  {isContentAr ? 'الأفكار والمحاور المستخلصة:' : 'Key Principles & Frameworks:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subtopics.map((sub, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60 shadow-xs space-y-1"
                    >
                      <h4 className="font-black text-xs text-stone-900 dark:text-stone-100">
                        {sub.title}
                      </h4>
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                        {sub.takeaway}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Markdown Body */}
            {loading ? (
              <div className="py-16 text-center text-sm font-bold text-stone-400">
                {isContentAr ? 'جاري تحميل نص المقال الكامل...' : 'Loading full article...'}
              </div>
            ) : content ? (
              <ArticleMarkdownRenderer content={content} />
            ) : (
              <p className="text-sm text-stone-500">
                {isContentAr ? article.summary_ar : article.summary_en}
              </p>
            )}

            {/* Bottom Floating Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-bear-900 to-amber-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h4 className="text-base font-black">
                  {isContentAr ? 'هل تواجه هذا التحدي في شركتك؟' : 'Facing this in your business?'}
                </h4>
                <p className="text-xs text-amber-200/80 mt-1">
                  {isContentAr
                    ? 'استشر جيسون كوهين لتحصل على نصيحة حادة ومخصصة لحالتك.'
                    : 'Get candid, personalized strategic advice from Jason Cohen.'}
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onConsult(article);
                }}
                className="px-5 py-2.5 rounded-2xl bg-white text-bear-950 font-black text-xs hover:bg-amber-100 transition-all shadow-md active:scale-95 shrink-0"
              >
                {isContentAr ? 'افتح الاستشارة الآن' : 'Start Consultation'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      className="prose-bear text-sm sm:text-base leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
