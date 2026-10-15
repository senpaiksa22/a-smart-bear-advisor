'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, BookOpen, Layers, Tag } from 'lucide-react';
import { Article } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  lang: 'ar' | 'en';
  onSelectArticle: (article: Article) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  articles,
  lang,
  onSelectArticle,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open trigger handled by parent, but Esc closes
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter articles
  const cleanQ = query.trim().toLowerCase();
  const filtered = cleanQ
    ? articles.filter((art) => {
        const titleEn = (art.title_en || '').toLowerCase();
        const titleAr = (art.title_ar || '').toLowerCase();
        const sumEn = (art.summary_en || '').toLowerCase();
        const sumAr = (art.summary_ar || '').toLowerCase();
        const catEn = (art.category_en || '').toLowerCase();
        const catAr = (art.category_ar || '').toLowerCase();

        return (
          titleEn.includes(cleanQ) ||
          titleAr.includes(cleanQ) ||
          sumEn.includes(cleanQ) ||
          sumAr.includes(cleanQ) ||
          catEn.includes(cleanQ) ||
          catAr.includes(cleanQ)
        );
      })
    : articles.slice(0, 15); // Show top 15 initial suggestions

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectArticle(filtered[selectedIndex]);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-24 px-2.5 sm:px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-200 dark:border-stone-800 gap-3">
          <Search className="w-5 h-5 text-bear-600 dark:text-bear-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isAr
                ? 'ابحث في العناوين، الملخصات، أو المصطلحات (مثال: PMF, التسعير, OKRs)...'
                : 'Search titles, concepts, frameworks (e.g. PMF, Pricing, OKRs)...'
            }
            className="w-full bg-transparent text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none text-sm sm:text-base font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-stone-100 dark:divide-stone-800/50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">
              {isAr ? 'لم يتم العثور على مقالات مطابقة لبحثك' : 'No matching essays found'}
            </div>
          ) : (
            filtered.map((art, idx) => {
              const isSelected = idx === selectedIndex;
              const title = isAr ? art.title_ar || art.title_en : art.title_en;
              const subTitle = isAr ? art.title_en : art.title_ar;
              const category = isAr ? art.category_ar || art.category_en : art.category_en;
              const summary = isAr ? art.summary_ar || art.summary_en : art.summary_en;

              return (
                <div
                  key={art.slug}
                  onClick={() => {
                    onSelectArticle(art);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-bear-50 dark:bg-bear-950/40 border-bear-500/30'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <div
                    className={`mt-1 p-2 rounded-lg shrink-0 ${
                      isSelected
                        ? 'bg-bear-500 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 group-hover:text-bear-600 dark:group-hover:text-bear-400 transition-colors">
                        {title}
                      </span>
                      {category && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-bear-100 dark:bg-bear-900/50 text-bear-800 dark:text-bear-300">
                          {category}
                        </span>
                      )}
                    </div>
                    {subTitle && (
                      <p className="text-xs text-stone-400 dark:text-stone-500 mb-1 font-sans">
                        {subTitle}
                      </p>
                    )}
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 mt-2 shrink-0 transition-transform ${
                      isAr ? 'rotate-180' : ''
                    } ${
                      isSelected
                        ? 'text-bear-600 dark:text-bear-400 translate-x-1'
                        : 'text-stone-300 dark:text-stone-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700">
                ↑
              </kbd>{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700">
                ↓
              </kbd>{' '}
              {isAr ? 'للتنقل' : 'Navigate'}
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700">
                Enter
              </kbd>{' '}
              {isAr ? 'للاختيار' : 'Select'}
            </span>
          </div>
          <span>{filtered.length} {isAr ? 'نتيجة' : 'results'}</span>
        </div>
      </div>
    </div>
  );
}
