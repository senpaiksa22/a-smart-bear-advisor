'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Article, Cluster } from '@/lib/types';
import {
  Sparkles,
  Layers,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  LayoutGrid,
  List,
  Compass,
  Star,
} from 'lucide-react';

interface MindMapProps {
  articles: Article[];
  clusters: Cluster[];
  lang: 'ar' | 'en';
  onSelectArticle: (article: Article) => void;
  selectedArticleSlug?: string;
  favorites?: string[];
  onToggleFavorite?: (slug: string) => void;
}

// Sophisticated, eye-friendly color palette with soft contrast
const CLUSTER_THEMES = [
  {
    border: 'border-emerald-500/30 dark:border-emerald-500/20',
    bg: 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]',
    text: 'text-emerald-800 dark:text-emerald-300',
    badge: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300/40',
    dot: 'bg-emerald-500',
  },
  {
    border: 'border-amber-500/30 dark:border-amber-500/20',
    bg: 'bg-amber-500/[0.04] dark:bg-amber-500/[0.06]',
    text: 'text-amber-800 dark:text-amber-300',
    badge: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300/40',
    dot: 'bg-amber-500',
  },
  {
    border: 'border-blue-500/30 dark:border-blue-500/20',
    bg: 'bg-blue-500/[0.04] dark:bg-blue-500/[0.06]',
    text: 'text-blue-800 dark:text-blue-300',
    badge: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border-blue-300/40',
    dot: 'bg-blue-500',
  },
  {
    border: 'border-purple-500/30 dark:border-purple-500/20',
    bg: 'bg-purple-500/[0.04] dark:bg-purple-500/[0.06]',
    text: 'text-purple-800 dark:text-purple-300',
    badge: 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-200 border-purple-300/40',
    dot: 'bg-purple-500',
  },
  {
    border: 'border-rose-500/30 dark:border-rose-500/20',
    bg: 'bg-rose-500/[0.04] dark:bg-rose-500/[0.06]',
    text: 'text-rose-800 dark:text-rose-300',
    badge: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300/40',
    dot: 'bg-rose-500',
  },
  {
    border: 'border-cyan-500/30 dark:border-cyan-500/20',
    bg: 'bg-cyan-500/[0.04] dark:bg-cyan-500/[0.06]',
    text: 'text-cyan-800 dark:text-cyan-300',
    badge: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-200 border-cyan-300/40',
    dot: 'bg-cyan-500',
  },
  {
    border: 'border-orange-500/30 dark:border-orange-500/20',
    bg: 'bg-orange-500/[0.04] dark:bg-orange-500/[0.06]',
    text: 'text-orange-800 dark:text-orange-300',
    badge: 'bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-200 border-orange-300/40',
    dot: 'bg-orange-500',
  },
  {
    border: 'border-indigo-500/30 dark:border-indigo-500/20',
    bg: 'bg-indigo-500/[0.04] dark:bg-indigo-500/[0.06]',
    text: 'text-indigo-800 dark:text-indigo-300',
    badge: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 border-indigo-300/40',
    dot: 'bg-indigo-500',
  },
  {
    border: 'border-teal-500/30 dark:border-teal-500/20',
    bg: 'bg-teal-500/[0.04] dark:bg-teal-500/[0.06]',
    text: 'text-teal-800 dark:text-teal-300',
    badge: 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-200 border-teal-300/40',
    dot: 'bg-teal-500',
  },
  {
    border: 'border-pink-500/30 dark:border-pink-500/20',
    bg: 'bg-pink-500/[0.04] dark:bg-pink-500/[0.06]',
    text: 'text-pink-800 dark:text-pink-300',
    badge: 'bg-pink-100 dark:bg-pink-950/80 text-pink-800 dark:text-pink-200 border-pink-300/40',
    dot: 'bg-pink-500',
  },
  {
    border: 'border-violet-500/30 dark:border-violet-500/20',
    bg: 'bg-violet-500/[0.04] dark:bg-violet-500/[0.06]',
    text: 'text-violet-800 dark:text-violet-300',
    badge: 'bg-violet-100 dark:bg-violet-950/80 text-violet-800 dark:text-violet-200 border-violet-300/40',
    dot: 'bg-violet-500',
  },
  {
    border: 'border-sky-500/30 dark:border-sky-500/20',
    bg: 'bg-sky-500/[0.04] dark:bg-sky-500/[0.06]',
    text: 'text-sky-800 dark:text-sky-300',
    badge: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 border-sky-300/40',
    dot: 'bg-sky-500',
  },
  {
    border: 'border-lime-500/30 dark:border-lime-500/20',
    bg: 'bg-lime-500/[0.04] dark:bg-lime-500/[0.06]',
    text: 'text-lime-800 dark:text-lime-300',
    badge: 'bg-lime-100 dark:bg-lime-950/80 text-lime-800 dark:text-lime-200 border-lime-300/40',
    dot: 'bg-lime-500',
  },
  {
    border: 'border-red-500/30 dark:border-red-500/20',
    bg: 'bg-red-500/[0.04] dark:bg-red-500/[0.06]',
    text: 'text-red-800 dark:text-red-300',
    badge: 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-200 border-red-300/40',
    dot: 'bg-red-500',
  },
];

export default function MindMap({
  articles,
  clusters,
  lang,
  onSelectArticle,
  selectedArticleSlug,
  favorites = [],
  onToggleFavorite,
}: MindMapProps) {
  const isAr = lang === 'ar';
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<'cards' | 'compact'>('cards');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filtered source articles based on favorites toggle
  const visibleArticles = useMemo(() => {
    if (!showOnlyFavorites) return articles;
    return articles.filter((art) => favorites.includes(art.slug));
  }, [articles, showOnlyFavorites, favorites]);

  // Group articles by cluster
  const articlesByCluster = useMemo(() => {
    const map: Record<string, Article[]> = {};
    for (const art of visibleArticles) {
      const cId = art.cluster_id || 'cluster_1';
      if (!map[cId]) map[cId] = [];
      map[cId].push(art);
    }
    return map;
  }, [visibleArticles]);

  const activeCluster = useMemo(() => {
    return clusters.find((c) => c.id === activeClusterId) || null;
  }, [clusters, activeClusterId]);

  const activeClusterIdx = useMemo(() => {
    if (!activeClusterId) return 0;
    return clusters.findIndex((c) => c.id === activeClusterId);
  }, [clusters, activeClusterId]);

  const scrollThemes = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const delta = direction === 'left' ? -350 : 350;
    scrollContainerRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full flex flex-col flex-1 min-h-[calc(100vh-4.5rem)] bg-[#fbfbfb] dark:bg-[#0c0d14] text-stone-900 dark:text-stone-100 transition-colors">
      {/* ==================================================================== */}
      {/* TOP THEMES NAVIGATION BAR (المحاور في بار كامل ممتد بدون انقطاع) */}
      {/* ==================================================================== */}
      <div className="sticky top-16 z-30 w-full bg-white/95 dark:bg-[#12141e]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-sm">
        <div className="w-full px-2 sm:px-4 py-2 flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Scroll Right Button (Right side in RTL) */}
          <button
            onClick={() => scrollThemes('right')}
            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white shrink-0 hidden sm:flex items-center justify-center transition-colors"
            title={isAr ? 'المحاور السابقة (لليمين)' : 'Previous Themes'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Full-Width Scrollable Clusters Bar - Expanded to fit maximum themes */}
          <div
            ref={scrollContainerRef}
            className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* "All Themes" Tab */}
            <button
              onClick={() => {
                setShowOnlyFavorites(false);
                setActiveClusterId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeClusterId === null && !showOnlyFavorites
                  ? 'bg-bear-600 text-white shadow-md shadow-bear-600/25 ring-2 ring-bear-600/30'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isAr ? 'جميع المحاور' : 'All Themes'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeClusterId === null && !showOnlyFavorites
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {articles.length}
              </span>
            </button>

            {/* "Favorites" Filter Tab */}
            <button
              onClick={() => {
                setShowOnlyFavorites((prev) => !prev);
                setActiveClusterId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                showOnlyFavorites
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/25 ring-2 ring-amber-500/30'
                  : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-500/50'
              }`}
              title={isAr ? 'عرض المقالات المحفوظة في المفضلة' : 'Show Bookmarked Essays'}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white text-white' : 'text-amber-500'}`} />
              <span>{isAr ? 'المفضلة' : 'Favorites'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  showOnlyFavorites
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                }`}
              >
                {favorites.length}
              </span>
            </button>

            {/* Each of the 14 Clusters - Compact & Elegant */}
            {clusters.map((c, idx) => {
              const count = articlesByCluster[c.id]?.length || c.article_count || 0;
              const isCurrent = activeClusterId === c.id;
              const cName = isAr ? c.name_ar : c.name_en;
              const theme = CLUSTER_THEMES[idx % CLUSTER_THEMES.length];

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveClusterId(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 border ${
                    isCurrent
                      ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-transparent shadow-md font-bold ring-2 ring-stone-900/20 dark:ring-white/20'
                      : 'bg-white dark:bg-stone-800/50 border-stone-200 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${theme.dot}`} />
                  <span className="truncate">{cName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isCurrent
                        ? 'bg-white/20 dark:bg-stone-900/20'
                        : 'bg-stone-100 dark:bg-stone-700/60 text-stone-500 dark:text-stone-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scroll Left Button (Left side of themes) */}
          <button
            onClick={() => scrollThemes('left')}
            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-white shrink-0 hidden sm:flex items-center justify-center transition-colors"
            title={isAr ? 'المحاور التالية (لليسار)' : 'Next Themes'}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Controls Aligned to the Absolute Far Left */}
          <div className="flex items-center gap-1 shrink-0 border-s border-stone-200 dark:border-stone-800 ps-2 ms-1">
            {/* Real Compact vs Cards View Toggle */}
            <button
              onClick={() => setDisplayMode(displayMode === 'cards' ? 'compact' : 'cards')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                displayMode === 'compact'
                  ? 'bg-bear-50 dark:bg-bear-950 text-bear-700 dark:text-bear-300 border-bear-500/40 shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-transparent hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
              title={
                displayMode === 'cards'
                  ? isAr
                    ? 'التحويل إلى العرض المدمج السريع'
                    : 'Switch to Compact List'
                  : isAr
                  ? 'التحويل إلى عرض الكروت التفصيلي'
                  : 'Switch to Rich Cards'
              }
            >
              {displayMode === 'cards' ? (
                <>
                  <List className="w-3.5 h-3.5 text-bear-600" />
                  <span className="hidden sm:inline">{isAr ? 'عرض مدمج' : 'Compact'}</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5 text-bear-600" />
                  <span className="hidden sm:inline">{isAr ? 'عرض كروت' : 'Cards'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.2))}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title={isAr ? 'تكبير (+)' : 'Zoom In (+)'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.8))}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title={isAr ? 'تصغير (-)' : 'Zoom Out (-)'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
              title={isAr ? 'إعادة ضبط الحجم' : 'Reset Zoom'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN WORKSPACE (عرض مريح، خطوط واضحة، مطابق تماماً للرسمة الهندسية) */}
      {/* ==================================================================== */}
      <div
        className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto transition-transform"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
      >
        {activeCluster ? (
          /* ==================================================================== */
          /* SINGLE CLUSTER FOCUSED VIEW (عند النقر على محور معين) */
          /* ==================================================================== */
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Cluster Hero Banner */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
                CLUSTER_THEMES[activeClusterIdx % CLUSTER_THEMES.length].bg
              } ${CLUSTER_THEMES[activeClusterIdx % CLUSTER_THEMES.length].border}`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-full ${
                        CLUSTER_THEMES[activeClusterIdx % CLUSTER_THEMES.length].dot
                      }`}
                    />
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        CLUSTER_THEMES[activeClusterIdx % CLUSTER_THEMES.length].badge
                      }`}
                    >
                      {isAr ? 'المحور الرئيسي' : 'Main Strategic Theme'}
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-white">
                    {isAr ? activeCluster.name_ar : activeCluster.name_en}
                  </h1>
                  <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed">
                    {isAr ? activeCluster.description_ar : activeCluster.description_en}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm text-center">
                    <span className="text-2xl font-black text-bear-600 block leading-none">
                      {articlesByCluster[activeCluster.id]?.length || 0}
                    </span>
                    <span className="text-[11px] font-bold text-stone-500 mt-1 block">
                      {isAr ? 'مقالات المحور' : 'Articles'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveClusterId(null)}
                    className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 shadow-sm transition-all flex items-center gap-1.5"
                  >
                    {isAr ? (
                      <>
                        <ChevronRight className="w-4 h-4 text-stone-500" />
                        <span>العودة لجميع المحاور</span>
                      </>
                    ) : (
                      <>
                        <ChevronLeft className="w-4 h-4 text-stone-500" />
                        <span>All Themes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Articles Display: Compact (Thin Strips) vs Cards (Square Grid) */}
            {displayMode === 'compact' ? (
              /* COMPACT VIEW: الشرائح النحيفة المستطيلة الممتدة بالعرض */
              <div className="space-y-2">
                {(articlesByCluster[activeCluster.id] || []).map((art) => {
                  const title = isAr ? art.title_ar || art.title_en : art.title_en;
                  const isSelected = selectedArticleSlug === art.slug;

                  return (
                    <div
                      key={art.slug}
                      onClick={() => onSelectArticle(art)}
                      className={`group px-4 py-2.5 rounded-xl cursor-pointer transition-all border flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-bear-50 dark:bg-bear-950/60 border-bear-500 shadow-sm ring-2 ring-bear-500/20'
                          : 'bg-white dark:bg-[#151722] hover:bg-stone-50 dark:hover:bg-[#1a1d2c] border-stone-200/90 dark:border-stone-800 shadow-2xs hover:border-bear-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500 w-9 shrink-0">
                          #{art.id}
                        </span>
                        <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate group-hover:text-bear-600 dark:group-hover:text-bear-400 transition-colors">
                          {title}
                        </h3>
                        {isAr && art.title_en !== title && (
                          <span className="hidden lg:inline text-xs text-stone-400 dark:text-stone-500 italic truncate max-w-sm shrink-0">
                            ({art.title_en})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {onToggleFavorite && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(art.slug);
                            }}
                            className="p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
                            title={favorites.includes(art.slug) ? (isAr ? 'إزالة من المفضلة' : 'Remove') : (isAr ? 'حفظ في المفضلة' : 'Bookmark')}
                          >
                            <Star className={`w-3.5 h-3.5 ${favorites.includes(art.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                          </button>
                        )}
                        <span className="text-xs font-bold text-bear-700 dark:text-bear-400 bg-bear-50 dark:bg-bear-950/80 px-2.5 py-1 rounded-lg border border-bear-500/20 flex items-center gap-1.5 group-hover:bg-bear-600 group-hover:text-white transition-all">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isAr ? 'قراءة واستشارة' : 'Read'}</span>
                          {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* CARDS VIEW: شبكة كروت مربعة لكل محور فرعي */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(articlesByCluster[activeCluster.id] || []).map((art) => {
                  const title = isAr ? art.title_ar || art.title_en : art.title_en;
                  const summary = isAr ? art.summary_ar || art.summary_en : art.summary_en;
                  const isSelected = selectedArticleSlug === art.slug;

                  return (
                    <div
                      key={art.slug}
                      onClick={() => onSelectArticle(art)}
                      className={`group p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-bear-50 dark:bg-bear-950/60 border-bear-500 shadow-md ring-2 ring-bear-500/20'
                          : 'bg-white dark:bg-[#151722] hover:bg-stone-50 dark:hover:bg-[#1a1d2c] border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-bear-500/40'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold text-stone-400 dark:text-stone-500">
                            #{art.id}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {onToggleFavorite && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFavorite(art.slug);
                                }}
                                className="p-0.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
                                title={favorites.includes(art.slug) ? (isAr ? 'إزالة من المفضلة' : 'Remove') : (isAr ? 'حفظ في المفضلة' : 'Bookmark')}
                              >
                                <Star className={`w-3.5 h-3.5 ${favorites.includes(art.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                              </button>
                            )}
                            <span className="text-[10px] font-semibold text-bear-700 dark:text-bear-400 bg-bear-50 dark:bg-bear-950/80 px-2 py-0.5 rounded-md border border-bear-500/20">
                              {isAr ? 'محور فرعي' : 'Topic'}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-bold text-sm text-stone-900 dark:text-white leading-snug line-clamp-2 group-hover:text-bear-600 dark:group-hover:text-bear-400 transition-colors">
                          {title}
                        </h3>

                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                          {summary}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-bear-600 dark:text-bear-400">
                        <span className="flex items-center gap-1.5 group-hover:underline">
                          <BookOpen className="w-3.5 h-3.5" />
                          {isAr ? 'قراءة واستشارة' : 'Read Article'}
                        </span>
                        <span>
                          {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ==================================================================== */
          /* ALL THEMES OVERVIEW (عرض جميع المحاور حسب رسمة المستخدم بالضبط) */
          /* ==================================================================== */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header Hero */}
            <div className="text-center max-w-2xl mx-auto space-y-2 py-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bear-100 dark:bg-bear-950 text-bear-800 dark:text-bear-300 text-xs font-bold border border-bear-500/20 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAr ? 'خريطة فكر ريادة الأعمال المستدامة' : 'Foundational Startup Knowledge Tree'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white tracking-tight">
                {isAr ? 'فلسفة وخريطة مقالات جيسون كوهين' : 'Jason Cohen Advisory Mind Map'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                {isAr
                  ? '213 مقالاً استراتيجياً موزعاً على 14 محوراً عضوياً حراً مستخلصاً بالذكاء الاصطناعي من خبرة تأسيس 4 شركات وبناء شركة يونيكورن (WP Engine).'
                  : '213 essays dynamically clustered into 14 organic tactical themes, distilled from 4 founded startups and a unicorn exit.'}
              </p>
            </div>

            {/* Switch between: "الكروت" (Grid of Squares) and "المدمج" (Stacked Horizontal Strips) */}
            {displayMode === 'cards' ? (
              /* ==================================================================== */
              /* 1. عرض الكروت (الجانب الأيسر في الرسمة): مربع للمحور الرئيسي وبداخله شبكة مربعات للمحاور الفرعية */
              /* ==================================================================== */
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
                {clusters.map((cluster, cIdx) => {
                  const clusterArticles = articlesByCluster[cluster.id] || [];
                  const theme = CLUSTER_THEMES[cIdx % CLUSTER_THEMES.length];
                  const cName = isAr ? cluster.name_ar : cluster.name_en;
                  const cDesc = isAr ? cluster.description_ar : cluster.description_en;
                  // Show 4 or 6 square sub-boxes per theme as in the sketch
                  const squareSubArticles = clusterArticles.slice(0, 4);

                  return (
                    <div
                      key={cluster.id}
                      className={`rounded-3xl border-2 ${theme.border} ${theme.bg} p-5 sm:p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between`}
                    >
                      <div>
                        {/* المحور الرئيسي: شريط علوي مستطيل مميز بالاسم والعدد */}
                        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800 shadow-2xs flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${theme.dot}`} />
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 block leading-tight">
                                {isAr ? 'المحور الرئيسي' : 'Main Theme'}
                              </span>
                              <h2 className={`font-black text-base sm:text-lg leading-snug truncate ${theme.text}`}>
                                {cName}
                              </h2>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border shrink-0 ${theme.badge}`}>
                            {clusterArticles.length} {isAr ? 'مقالاً' : 'essays'}
                          </span>
                        </div>

                        {cDesc && (
                          <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed px-1 my-3">
                            {cDesc}
                          </p>
                        )}

                        {/* شبكة المربعات (المحاور الفرعية المربعة كما في رسمة المستخدم) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                          {squareSubArticles.map((art) => {
                            const title = isAr ? art.title_ar || art.title_en : art.title_en;
                            const summary = isAr ? art.summary_ar || art.summary_en : art.summary_en;
                            const isSelected = selectedArticleSlug === art.slug;

                            return (
                              <div
                                key={art.slug}
                                onClick={() => onSelectArticle(art)}
                                className={`group p-3.5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between gap-2.5 ${
                                  isSelected
                                    ? 'bg-bear-50 dark:bg-bear-950/80 border-bear-500 shadow-sm ring-2 ring-bear-500/20'
                                    : 'bg-white dark:bg-[#151722] hover:bg-stone-50 dark:hover:bg-[#1c1f30] border-stone-200/90 dark:border-stone-800 shadow-2xs hover:border-bear-500/50 hover:shadow-sm'
                                }`}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between gap-1.5">
                                    <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-500">
                                      #{art.id}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {onToggleFavorite && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleFavorite(art.slug);
                                          }}
                                          className="p-0.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
                                          title={favorites.includes(art.slug) ? (isAr ? 'إزالة من المفضلة' : 'Remove') : (isAr ? 'حفظ في المفضلة' : 'Bookmark')}
                                        >
                                          <Star className={`w-3 h-3 ${favorites.includes(art.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                                        </button>
                                      )}
                                      <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                                        {isAr ? 'محور فرعي' : 'Subtopic'}
                                      </span>
                                    </div>
                                  </div>

                                  <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white leading-snug line-clamp-2 group-hover:text-bear-600 dark:group-hover:text-bear-400 transition-colors">
                                    {title}
                                  </h3>

                                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                                    {summary}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-[11px] font-semibold text-bear-600 dark:text-bear-400">
                                  <span className="flex items-center gap-1 group-hover:underline">
                                    <BookOpen className="w-3 h-3" />
                                    <span>{isAr ? 'قراءة' : 'Read'}</span>
                                  </span>
                                  <span>
                                    {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* زر استعراض كل مقالات هذا المحور */}
                      <button
                        onClick={() => setActiveClusterId(cluster.id)}
                        className="mt-4 w-full py-2.5 rounded-xl bg-white/90 dark:bg-stone-900/90 hover:bg-stone-50 dark:hover:bg-stone-800 text-xs font-bold text-bear-700 dark:text-bear-300 border border-stone-200 dark:border-stone-700/60 shadow-2xs transition-all flex items-center justify-center gap-2 group"
                      >
                        <span>
                          {isAr
                            ? `استعراض جميع مقالات هذا المحور (${clusterArticles.length})`
                            : `Browse all ${clusterArticles.length} articles`}
                        </span>
                        <span className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                          {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ==================================================================== */
              /* 2. العرض المدمج (الجانب الأيمن في الرسمة): المحور الرئيسي وتحته شرائح نحيفة مستطيلة ممتدة */
              /* ==================================================================== */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {clusters.map((cluster, cIdx) => {
                  const clusterArticles = articlesByCluster[cluster.id] || [];
                  const theme = CLUSTER_THEMES[cIdx % CLUSTER_THEMES.length];
                  const cName = isAr ? cluster.name_ar : cluster.name_en;
                  // Show 6 sleek horizontal strips per theme in compact view
                  const compactStrips = clusterArticles.slice(0, 6);

                  return (
                    <div
                      key={cluster.id}
                      className={`rounded-2xl border ${theme.border} ${theme.bg} p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm flex flex-col justify-between`}
                    >
                      <div>
                        {/* المحور الرئيسي: شريط علوي مستطيل نحيف وطويل كما في رسمة "المدمج" */}
                        <div className="p-3 rounded-xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/90 dark:border-stone-800 shadow-2xs flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-3 h-3 rounded-full shrink-0 ${theme.dot}`} />
                            <span className="text-xs font-black text-stone-900 dark:text-white truncate">
                              {isAr ? `المحور الرئيسي: ${cName}` : `Theme: ${cName}`}
                            </span>
                          </div>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${theme.badge}`}>
                            {clusterArticles.length} {isAr ? 'مقالاً' : 'essays'}
                          </span>
                        </div>

                        {/* المحاور الفرعية: شرائح نحيفة مستطيلة مصفوفة أفقياً تحت بعضها */}
                        <div className="space-y-1.5">
                          {compactStrips.map((art) => {
                            const title = isAr ? art.title_ar || art.title_en : art.title_en;
                            const isSelected = selectedArticleSlug === art.slug;

                            return (
                              <div
                                key={art.slug}
                                onClick={() => onSelectArticle(art)}
                                className={`group px-3 py-2 rounded-lg cursor-pointer transition-all border flex items-center justify-between gap-3 text-xs ${
                                  isSelected
                                    ? 'bg-bear-600 text-white border-bear-600 shadow-2xs'
                                    : 'bg-white/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-900 border-stone-200/80 dark:border-stone-800/80 text-stone-800 dark:text-stone-200 hover:border-bear-500/50 hover:shadow-2xs'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span
                                    className={`text-[10px] font-mono font-bold w-7 shrink-0 ${
                                      isSelected ? 'text-white/80' : 'text-stone-400 dark:text-stone-500'
                                    }`}
                                  >
                                    #{art.id}
                                  </span>
                                  <span className="font-semibold truncate leading-tight">
                                    {title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  {onToggleFavorite && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(art.slug);
                                      }}
                                      className="p-0.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-amber-500 transition-colors"
                                      title={favorites.includes(art.slug) ? (isAr ? 'إزالة من المفضلة' : 'Remove') : (isAr ? 'حفظ في المفضلة' : 'Bookmark')}
                                    >
                                      <Star className={`w-3 h-3 ${favorites.includes(art.slug) ? 'fill-amber-500 text-amber-500' : ''}`} />
                                    </button>
                                  )}
                                  <span
                                    className={`text-[11px] opacity-0 group-hover:opacity-100 transition-opacity ${
                                      isSelected ? 'text-white' : 'text-bear-600 dark:text-bear-400'
                                    }`}
                                  >
                                    {isAr ? 'قراءة' : 'Read'}
                                  </span>
                                  <span
                                    className={`opacity-50 group-hover:opacity-100 transition-opacity ${
                                      isSelected ? 'text-white' : 'text-stone-400 dark:text-stone-500'
                                    }`}
                                  >
                                    {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* شريط الانتقال للمحور بالكامل */}
                      <button
                        onClick={() => setActiveClusterId(cluster.id)}
                        className="mt-3 w-full py-2 rounded-lg bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-800 text-[11px] font-bold text-bear-700 dark:text-bear-300 border border-stone-200 dark:border-stone-700/60 shadow-2xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>
                          {isAr
                            ? `عرض باقي المقالات (${clusterArticles.length})`
                            : `View all ${clusterArticles.length} articles`}
                        </span>
                        <span>
                          {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
