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
} from 'lucide-react';

interface MindMapProps {
  articles: Article[];
  clusters: Cluster[];
  lang: 'ar' | 'en';
  onSelectArticle: (article: Article) => void;
  selectedArticleSlug?: string;
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
}: MindMapProps) {
  const isAr = lang === 'ar';
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [displayMode, setDisplayMode] = useState<'cards' | 'compact'>('cards');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Group articles by cluster
  const articlesByCluster = useMemo(() => {
    const map: Record<string, Article[]> = {};
    for (const art of articles) {
      const cId = art.cluster_id || 'cluster_1';
      if (!map[cId]) map[cId] = [];
      map[cId].push(art);
    }
    return map;
  }, [articles]);

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
              onClick={() => setActiveClusterId(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeClusterId === null
                  ? 'bg-bear-600 text-white shadow-md shadow-bear-600/25 ring-2 ring-bear-600/30'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isAr ? 'جميع المحاور' : 'All Themes'}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  activeClusterId === null
                    ? 'bg-white/20 text-white'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {articles.length}
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
      {/* MAIN WORKSPACE (عرض مريح، خطوط واضحة، بدون سحب أفقي عقيم) */}
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
                      {isAr ? 'محور استراتيجي رئيسي' : 'Strategic Cluster'}
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
                      {isAr ? 'مقالاً استراتيجياً' : 'Articles'}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveClusterId(null)}
                    className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-bold text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 shadow-sm transition-all"
                  >
                    {isAr ? '← عرض جميع المحاور' : '← All Themes'}
                  </button>
                </div>
              </div>
            </div>

            {/* Articles Grid or Compact List for Active Cluster */}
            {displayMode === 'compact' ? (
              <div className="space-y-2.5">
                {(articlesByCluster[activeCluster.id] || []).map((art) => {
                  const title = isAr ? art.title_ar || art.title_en : art.title_en;
                  const isSelected = selectedArticleSlug === art.slug;

                  return (
                    <div
                      key={art.slug}
                      onClick={() => onSelectArticle(art)}
                      className={`group px-4 py-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-bear-50 dark:bg-bear-950/60 border-bear-500 shadow-sm ring-2 ring-bear-500/20'
                          : 'bg-white dark:bg-[#151722] hover:bg-stone-50 dark:hover:bg-[#1a1d2c] border-stone-200/90 dark:border-stone-800 shadow-2xs hover:border-bear-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500 w-10 shrink-0">
                          #{art.id}
                        </span>
                        <h3 className="font-bold text-sm text-stone-900 dark:text-white truncate group-hover:text-bear-600 dark:group-hover:text-bear-400 transition-colors">
                          {title}
                        </h3>
                        {isAr && art.title_en !== title && (
                          <span className="hidden md:inline text-xs text-stone-400 dark:text-stone-500 italic truncate max-w-sm shrink-0">
                            ({art.title_en})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-bear-700 dark:text-bear-400 bg-bear-50 dark:bg-bear-950/80 px-3 py-1.5 rounded-lg border border-bear-500/20 flex items-center gap-1.5 group-hover:bg-bear-600 group-hover:text-white transition-all">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isAr ? 'قراءة واستشارة' : 'Read & Consult'}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(articlesByCluster[activeCluster.id] || []).map((art) => {
                  const title = isAr ? art.title_ar || art.title_en : art.title_en;
                  const summary = isAr ? art.summary_ar || art.summary_en : art.summary_en;
                  const isSelected = selectedArticleSlug === art.slug;

                  return (
                    <div
                      key={art.slug}
                      onClick={() => onSelectArticle(art)}
                      className={`group p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-bear-50 dark:bg-bear-950/60 border-bear-500 shadow-md ring-2 ring-bear-500/20'
                          : 'bg-white dark:bg-[#151722] hover:bg-stone-50 dark:hover:bg-[#1a1d2c] border-stone-200/90 dark:border-stone-800 shadow-sm hover:shadow-md hover:border-bear-500/40'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-mono font-bold text-stone-400 dark:text-stone-500">
                            #{art.id}
                          </span>
                          <span className="text-[11px] font-semibold text-bear-700 dark:text-bear-400 bg-bear-50 dark:bg-bear-950/80 px-2 py-0.5 rounded-md border border-bear-500/20">
                            {isAr ? 'مبدأ تطبيقي' : 'Practical Rule'}
                          </span>
                        </div>

                        <h3 className="font-bold text-sm sm:text-base text-stone-900 dark:text-white leading-snug group-hover:text-bear-600 dark:group-hover:text-bear-400 transition-colors">
                          {title}
                        </h3>

                        {isAr && art.title_en !== title && (
                          <p className="text-[11px] font-medium text-stone-400 dark:text-stone-500 italic line-clamp-1">
                            {art.title_en}
                          </p>
                        )}

                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
                          {summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-bear-600 dark:text-bear-400">
                        <span className="flex items-center gap-1.5 group-hover:underline">
                          <BookOpen className="w-3.5 h-3.5" />
                          {isAr ? 'قراءة واستشارة جيسون' : 'Read & Consult Jason'}
                        </span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {isAr ? '←' : '→'}
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
          /* ALL THEMES OVERVIEW GRID (عرض شامل ذكي لجميع المحاور الـ 14) */
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

            {/* 14 Clusters Grid (3 Columns Responsive, No Awkward Cutoffs!) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clusters.map((cluster, cIdx) => {
                const clusterArticles = articlesByCluster[cluster.id] || [];
                const theme = CLUSTER_THEMES[cIdx % CLUSTER_THEMES.length];
                const cName = isAr ? cluster.name_ar : cluster.name_en;
                const cDesc = isAr ? cluster.description_ar : cluster.description_en;
                const previewArticles = clusterArticles.slice(0, displayMode === 'compact' ? 6 : 4);

                return (
                  <div
                    key={cluster.id}
                    className={`rounded-2xl border ${theme.border} ${theme.bg} ${
                      displayMode === 'compact' ? 'p-4 sm:p-5' : 'p-5 sm:p-6'
                    } shadow-sm transition-all hover:shadow-md flex flex-col justify-between`}
                  >
                    {/* Cluster Header */}
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${theme.dot}`} />
                          <h2 className={`font-black text-base sm:text-lg leading-snug ${theme.text}`}>
                            {cName}
                          </h2>
                        </div>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${theme.badge}`}>
                          {clusterArticles.length}
                        </span>
                      </div>

                      {displayMode === 'cards' && cDesc && (
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                          {cDesc}
                        </p>
                      )}

                      {/* Top Articles Preview */}
                      <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 space-y-2">
                        {previewArticles.map((art) => {
                          const title = isAr ? art.title_ar || art.title_en : art.title_en;
                          const isSelected = selectedArticleSlug === art.slug;

                          return (
                            <div
                              key={art.slug}
                              onClick={() => onSelectArticle(art)}
                              className={`p-2.5 rounded-xl cursor-pointer text-xs font-semibold transition-all flex items-center justify-between gap-2 border ${
                                isSelected
                                  ? 'bg-bear-600 text-white border-bear-600 shadow-sm'
                                  : 'bg-white/90 dark:bg-stone-900/90 hover:bg-white dark:hover:bg-stone-900 border-stone-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-bear-500/50 hover:translate-x-0.5'
                              }`}
                            >
                              <span className="line-clamp-1 leading-snug">{title}</span>
                              <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-100" />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* View All Button for this Cluster */}
                    <button
                      onClick={() => setActiveClusterId(cluster.id)}
                      className="mt-4 pt-3 border-t border-stone-200/50 dark:border-stone-800/50 w-full py-2 rounded-xl bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-800 text-xs font-bold text-bear-700 dark:text-bear-300 border border-stone-200 dark:border-stone-700/60 shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>
                        {isAr
                          ? `استعراض كل مقالات هذا المحور (${clusterArticles.length})`
                          : `Browse all ${clusterArticles.length} articles`}
                      </span>
                      <span>{isAr ? '←' : '→'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
