'use client';

import React, { useState, useMemo } from 'react';
import { Article, Cluster } from '@/lib/types';
import {
  Sparkles,
  Layers,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Filter,
} from 'lucide-react';

interface MindMapProps {
  articles: Article[];
  clusters: Cluster[];
  lang: 'ar' | 'en';
  onSelectArticle: (article: Article) => void;
  selectedArticleSlug?: string;
}

// Color palette for clusters
const CLUSTER_COLORS = [
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  { bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  { bg: 'bg-purple-500/10', border: 'border-purple-500/40', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  { bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
  { bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-700 dark:text-cyan-300', dot: 'bg-cyan-500' },
  { bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/40', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-500' },
  { bg: 'bg-teal-500/10', border: 'border-teal-500/40', text: 'text-teal-700 dark:text-teal-300', dot: 'bg-teal-500' },
  { bg: 'bg-pink-500/10', border: 'border-pink-500/40', text: 'text-pink-700 dark:text-pink-300', dot: 'bg-pink-500' },
  { bg: 'bg-lime-500/10', border: 'border-lime-500/40', text: 'text-lime-700 dark:text-lime-300', dot: 'bg-lime-500' },
  { bg: 'bg-sky-500/10', border: 'border-sky-500/40', text: 'text-sky-700 dark:text-sky-300', dot: 'bg-sky-500' },
  { bg: 'bg-violet-500/10', border: 'border-violet-500/40', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
  { bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
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
  const [expandedClusters, setExpandedClusters] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'mindmap' | 'grid'>('mindmap');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

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

  const toggleCluster = (cId: string) => {
    setExpandedClusters((prev) => ({
      ...prev,
      [cId]: !prev[cId],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    clusters.forEach((c) => {
      next[c.id] = true;
    });
    setExpandedClusters(next);
  };

  const collapseAll = () => {
    setExpandedClusters({});
  };

  return (
    <div className="relative w-full flex flex-col flex-1 min-h-[calc(100vh-4rem)]">
      {/* Control Toolbar */}
      <div className="sticky top-16 z-30 w-full px-4 sm:px-6 lg:px-8 py-3 bg-white/70 dark:bg-stone-950/70 backdrop-blur border-b border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
        {/* Cluster Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none max-w-full sm:max-w-3xl">
          <button
            onClick={() => setActiveClusterId(null)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeClusterId === null
                ? 'bg-bear-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            {isAr ? 'جميع المحاور' : 'All Themes'} ({articles.length})
          </button>
          {clusters.map((c, idx) => {
            const count = articlesByCluster[c.id]?.length || c.article_count || 0;
            const isCurrent = activeClusterId === c.id;
            const cName = isAr ? c.name_ar : c.name_en;

            return (
              <button
                key={c.id}
                onClick={() => setActiveClusterId(isCurrent ? null : c.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-bear-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <span>{cName}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* View and Zoom Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={expandAll}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
            title={isAr ? 'توسيع الكل' : 'Expand All'}
          >
            {isAr ? 'توسيع الكل' : 'Expand All'}
          </button>
          <button
            onClick={collapseAll}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
            title={isAr ? 'طي الكل' : 'Collapse All'}
          >
            {isAr ? 'طي الكل' : 'Collapse All'}
          </button>
          <div className="h-4 w-px bg-stone-300 dark:bg-stone-700 mx-1" />
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.1, 1.3))}
            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.1, 0.7))}
            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mind Map Canvas */}
      <div
        className="flex-1 p-4 sm:p-8 flex flex-col items-center justify-start overflow-auto transition-transform"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
      >
        {/* Core Root Node */}
        <div className="mb-12 flex flex-col items-center">
          <div className="relative group cursor-pointer p-6 rounded-3xl bg-gradient-to-b from-bear-500 to-bear-700 text-white shadow-xl shadow-bear-600/20 border-4 border-white dark:border-stone-800 flex flex-col items-center text-center max-w-sm animate-soft-pulse">
            <span className="text-3xl mb-2">🐻</span>
            <h1 className="text-lg sm:text-xl font-black tracking-tight">
              {isAr ? 'فلسفة وخريطة الدب الذكي' : 'A Smart Bear Knowledge Tree'}
            </h1>
            <p className="text-xs text-bear-100 mt-1">
              {isAr
                ? `${articles.length} مقالاً موزعاً على ${clusters.length} محاور عضوية`
                : `${articles.length} essays structured across ${clusters.length} organic themes`}
            </p>
          </div>
          {/* Vertical connecting line */}
          <div className="w-0.5 h-8 bg-bear-400 dark:bg-bear-700" />
        </div>

        {/* Clusters Radial / Grid Tree */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clusters
            .filter((c) => (activeClusterId ? c.id === activeClusterId : true))
            .map((cluster, cIdx) => {
              const clusterArticles = articlesByCluster[cluster.id] || [];
              const isExpanded = expandedClusters[cluster.id] ?? true;
              const color = CLUSTER_COLORS[cIdx % CLUSTER_COLORS.length];
              const cName = isAr ? cluster.name_ar : cluster.name_en;
              const cDesc = isAr ? cluster.description_ar : cluster.description_en;

              return (
                <div
                  key={cluster.id}
                  className={`rounded-2xl border ${color.border} ${color.bg} p-5 shadow-sm transition-all hover:shadow-md flex flex-col`}
                >
                  {/* Cluster Header Node */}
                  <div
                    onClick={() => toggleCluster(cluster.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer select-none group"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${color.dot}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className={`font-black text-base sm:text-lg leading-snug ${color.text}`}>
                            {cName}
                          </h2>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300">
                            {clusterArticles.length}
                          </span>
                        </div>
                        {cDesc && (
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                            {cDesc}
                          </p>
                        )}
                      </div>
                    </div>
                    <button className="p-1 rounded-md text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Connecting Line */}
                  {isExpanded && clusterArticles.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/60 space-y-2">
                      {clusterArticles.map((art) => {
                        const title = isAr ? art.title_ar || art.title_en : art.title_en;
                        const isSelected = selectedArticleSlug === art.slug;

                        return (
                          <div
                            key={art.slug}
                            onClick={() => onSelectArticle(art)}
                            className={`p-3 rounded-xl cursor-pointer text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-2 border ${
                              isSelected
                                ? 'bg-bear-600 text-white border-bear-600 shadow-md'
                                : 'bg-white/80 dark:bg-stone-900/80 hover:bg-white dark:hover:bg-stone-900 border-stone-200/80 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-bear-500/50 hover:translate-x-0.5'
                            }`}
                          >
                            <span className="line-clamp-2 leading-snug">{title}</span>
                            <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-50 group-hover:opacity-100" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
