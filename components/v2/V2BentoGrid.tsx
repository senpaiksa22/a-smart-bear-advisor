'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Search,
  LayoutGrid,
  Rows,
  Quote,
  Shield,
  Zap,
  Target,
  DollarSign,
  Compass,
  Filter,
} from 'lucide-react';
import { Article } from '@/lib/types';
import { BENTO_ITEMS, BentoItem } from './bentoData';

interface V2BentoGridProps {
  lang: 'ar' | 'en';
  allArticles: Article[];
  onOpenArticle: (article: Article) => void;
  onConsultItem: (item: BentoItem) => void;
  onConsultArticle: (article: Article) => void;
}

export default function V2BentoGrid({
  lang,
  allArticles,
  onOpenArticle,
  onConsultItem,
  onConsultArticle,
}: V2BentoGridProps) {
  const isAr = lang === 'ar';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'bento' | 'compact'>('bento');

  // Filter categories
  const categories = useMemo(() => [
    { id: 'all', label_ar: 'كافة المحاور والمفاهيم', label_en: 'All Frameworks', icon: '✨' },
    { id: 'pmf', label_ar: 'التحقق وPMF', label_en: 'PMF & Validation', icon: '🎯' },
    { id: 'pricing', label_ar: 'هندسة التسعير', label_en: 'Pricing Strategy', icon: '💰' },
    { id: 'growth', label_ar: 'التوزيع العضوي', label_en: 'Organic Growth', icon: '🚀' },
    { id: 'moats', label_ar: 'الخنادق التنافسية', label_en: 'Enduring Moats', icon: '🛡️' },
    { id: 'mental_models', label_ar: 'النماذج الفكرية', label_en: 'Mental Models', icon: '🧠' },
    { id: 'funding', label_ar: 'التمويل والمؤسس', label_en: 'Funding & Founder', icon: '⚖️' },
  ], []);

  // Filter bento items
  const filteredBento = useMemo(() => {
    let list = BENTO_ITEMS;
    if (selectedCategory !== 'all') {
      list = list.filter((item) => item.category_id === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (item) =>
          item.title_ar.toLowerCase().includes(q) ||
          item.title_en.toLowerCase().includes(q) ||
          item.highlight_ar.toLowerCase().includes(q) ||
          item.highlight_en.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategory, searchQuery]);

  // Matching full articles for search or category
  const matchingArticles = useMemo(() => {
    if (!searchQuery.trim() && selectedCategory === 'all') return [];
    const q = searchQuery.toLowerCase().trim();
    return allArticles.filter((art) => {
      const title = (isAr ? art.title_ar || art.title_en : art.title_en).toLowerCase();
      const sum = (isAr ? art.summary_ar || art.summary_en : art.summary_en).toLowerCase();
      const matchesSearch = !q || title.includes(q) || sum.includes(q);
      const matchesCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'pmf' && (art.slug.includes('pmf') || art.slug.includes('product') || art.slug.includes('market'))) ||
        (selectedCategory === 'pricing' && art.slug.includes('price')) ||
        (selectedCategory === 'growth' && (art.slug.includes('market') || art.slug.includes('channel') || art.slug.includes('scale'))) ||
        (selectedCategory === 'moats' && (art.slug.includes('moat') || art.slug.includes('advantage') || art.slug.includes('unique'))) ||
        (selectedCategory === 'mental_models' && (art.slug.includes('decision') || art.slug.includes('model') || art.slug.includes('priorit')));

      // Exclude articles already showcased in the filtered bento
      const inBento = filteredBento.some((b) => b.slug === art.slug);
      return matchesSearch && matchesCat && !inBento;
    }).slice(0, 16);
  }, [allArticles, searchQuery, selectedCategory, isAr, filteredBento]);

  const handleBentoRead = (item: BentoItem) => {
    const art = allArticles.find((a) => a.slug === item.slug);
    if (art) onOpenArticle(art);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* ==================================================================== */}
      {/* CONTROLS BAR: CATEGORIES, SEARCH, AND VIEW MODE */}
      {/* ==================================================================== */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-3 sm:p-4 rounded-3xl bg-white/80 dark:bg-[#0f1118]/80 border border-stone-200/90 dark:border-stone-800/90 backdrop-blur-xl shadow-xs">
        {/* Horizontal Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {categories.map((cat) => {
            const isActive = cat.id === selectedCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all shadow-xs ${
                  isActive
                    ? 'bg-bear-600 text-white shadow-bear-600/25 scale-[1.02]'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isAr ? cat.label_ar : cat.label_en}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Layout Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute top-2.5 start-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'بحث في مفاهيم بينتو...' : 'Search bento ideas...'}
              className="w-full ps-9 pe-3 py-1.5 rounded-xl text-xs bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 outline-none focus:border-bear-500 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80">
            <button
              onClick={() => setViewMode('bento')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'bento'
                  ? 'bg-white dark:bg-stone-900 text-bear-600 dark:text-bear-400 shadow-xs'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
              title={isAr ? 'عرض Bento الشبكي' : 'Bento Grid View'}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-stone-900 text-bear-600 dark:text-bear-400 shadow-xs'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
              }`}
              title={isAr ? 'عرض الكروت المتساوية' : 'Compact Cards View'}
            >
              <Rows className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BENTO SHOWCASE GRID (APPLE / LINEAR ASYMMETRICAL AESTHETIC) */}
      {/* ==================================================================== */}
      <div
        className={
          viewMode === 'bento'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-[240px]'
            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
        }
      >
        {filteredBento.map((item) => (
          <BentoCard
            key={item.id}
            item={item}
            lang={lang}
            viewMode={viewMode}
            onRead={() => handleBentoRead(item)}
            onConsult={() => onConsultItem(item)}
          />
        ))}
      </div>

      {/* ==================================================================== */}
      {/* COMPLEMENTARY DEEP ESSAYS (EXPANDED ARTICLES POOL) */}
      {/* ==================================================================== */}
      {matchingArticles.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-stone-200/80 dark:border-stone-800/80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-stone-900 dark:text-white">
                {isAr ? 'مقالات معمقة ذات صلة من الأرشيف' : 'Related Deep Dive Essays'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isAr
                  ? `عثرنا على ${matchingArticles.length} مقالاً إضافياً يدعم هذه الرؤية`
                  : `Found ${matchingArticles.length} complementary essays`}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {matchingArticles.map((art) => (
              <div
                key={art.slug}
                className="p-4 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 hover:border-bear-500/50 hover:shadow-lg transition-all flex flex-col justify-between gap-3 group"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {isAr ? art.category_ar : art.category_en}
                  </span>
                  <h4
                    onClick={() => onOpenArticle(art)}
                    className="text-xs sm:text-sm font-black text-stone-900 dark:text-stone-100 group-hover:text-bear-600 dark:group-hover:text-bear-400 cursor-pointer transition-colors mt-2 line-clamp-2"
                  >
                    {isAr ? art.title_ar : art.title_en}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
                    {isAr ? art.summary_ar : art.summary_en}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800/80 text-xs">
                  <button
                    onClick={() => onOpenArticle(art)}
                    className="flex items-center gap-1 text-[11px] font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
                  >
                    <BookOpen className="w-3 h-3 text-bear-500" />
                    <span>{isAr ? 'اقرأ المقال' : 'Read'}</span>
                  </button>
                  <button
                    onClick={() => onConsultArticle(art)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-bear-50 dark:bg-bear-950/60 text-bear-700 dark:text-bear-300 hover:bg-bear-100 text-[11px] font-black transition-all shadow-xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{isAr ? 'استشر' : 'Consult'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// INDIVIDUAL BENTO CARD COMPONENT WITH SPAN & VISUAL LOGIC
// ==============================================================================
function BentoCard({
  item,
  lang,
  viewMode,
  onRead,
  onConsult,
}: {
  item: BentoItem;
  lang: 'ar' | 'en';
  viewMode: 'bento' | 'compact';
  onRead: () => void;
  onConsult: () => void;
}) {
  const isAr = lang === 'ar';

  // Determine span classes
  let spanClass = 'col-span-1 row-span-1 min-h-[240px]';
  if (viewMode === 'bento') {
    if (item.type === 'hero') {
      spanClass = 'col-span-1 md:col-span-2 row-span-2 min-h-[496px]';
    } else if (item.type === 'wide') {
      spanClass = 'col-span-1 md:col-span-2 row-span-1 min-h-[240px]';
    } else if (item.type === 'tall') {
      spanClass = 'col-span-1 row-span-2 min-h-[496px]';
    }
  }

  return (
    <div
      className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-200 border border-stone-200/90 dark:border-stone-800/90 bg-white/95 dark:bg-[#11131c]/95 shadow-sm hover:shadow-xl hover:border-bear-500/50 flex flex-col justify-between overflow-hidden group ${spanClass}`}
    >
      {/* Ambient Radial Gradient Glow */}
      <div
        className={`absolute -right-12 -top-12 w-48 h-48 rounded-full bg-gradient-to-br ${item.gradient} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`}
      />

      {/* Top Header Badge & Actions */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/70">
            {isAr ? item.category_ar : item.category_en}
          </span>
          {item.badge_ar && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
              {isAr ? item.badge_ar : item.badge_en}
            </span>
          )}
        </div>

        <button
          onClick={onRead}
          className="p-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          title={isAr ? 'فتح المقال الكامل' : 'Open Full Essay'}
        >
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Core Center Content */}
      <div className="relative z-10 my-auto py-3 space-y-2.5">
        {/* Stat Number (if present) */}
        {item.statNumber && (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-bear-600 dark:text-bear-400 font-mono">
              {item.statNumber}
            </span>
            {item.statLabel_ar && (
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400">
                {isAr ? item.statLabel_ar : item.statLabel_en}
              </span>
            )}
          </div>
        )}

        {/* Quote formatting (if present) */}
        {item.quote_ar && (
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-900/70 border border-stone-200/60 dark:border-stone-800/60 text-xs italic text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
            {isAr ? item.quote_ar : item.quote_en}
          </div>
        )}

        {/* Title */}
        <h3
          onClick={onRead}
          className={`font-black text-stone-900 dark:text-white cursor-pointer group-hover:text-bear-600 dark:group-hover:text-bear-400 transition-colors leading-snug ${
            item.type === 'hero' ? 'text-lg sm:text-2xl' : 'text-sm sm:text-base'
          }`}
        >
          {isAr ? item.title_ar : item.title_en}
        </h3>

        {/* Subtitle / Question */}
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-2">
          {isAr ? item.subtitle_ar : item.subtitle_en}
        </p>

        {/* Highlight Principle */}
        <p
          className={`text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-medium ${
            item.type === 'hero' || item.type === 'tall' ? 'line-clamp-4' : 'line-clamp-2'
          }`}
        >
          {isAr ? item.highlight_ar : item.highlight_en}
        </p>
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
        <button
          onClick={onRead}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-bear-500" />
          <span>{isAr ? 'قراءة التحليل' : 'Read Analysis'}</span>
        </button>

        <button
          onClick={onConsult}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bear-50 dark:bg-bear-950/60 hover:bg-bear-100 dark:hover:bg-bear-900/60 text-bear-800 dark:text-bear-200 border border-bear-500/25 text-xs font-black shadow-xs active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{isAr ? 'استشر جيسون' : 'Consult Jason'}</span>
        </button>
      </div>
    </div>
  );
}
