'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AppTheme, APP_THEMES } from '@/lib/theme';
import {
  Sun,
  Moon,
  Compass,
  Trees,
  Palette,
  Check,
  Sparkles,
  Coffee,
  Leaf,
  Crown,
  Wind,
  Wine,
  X,
} from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  lang: 'ar' | 'en';
  variant?: 'compact' | 'full';
}

export default function ThemeSelector({
  currentTheme,
  onThemeChange,
  lang,
  variant = 'compact',
}: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';

  const activeConfig = APP_THEMES.find((t) => t.id === currentTheme) || APP_THEMES[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicking outside on desktop
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll on mobile when sheet is open
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const renderIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={className} />;
      case 'sand':
        return <Coffee className={className} />;
      case 'moon':
        return <Moon className={className} />;
      case 'ocean':
        return <Compass className={className} />;
      case 'forest':
        return <Trees className={className} />;
      case 'sunset':
        return <Palette className={className} />;
      case 'leaf':
        return <Leaf className={className} />;
      case 'frost':
        return <Wind className={className} />;
      case 'lavender':
        return <Sparkles className={className} />;
      case 'bordeaux':
        return <Wine className={className} />;
      case 'crown':
        return <Crown className={className} />;
      default:
        return <Palette className={className} />;
    }
  };

  const getSubtitles = (themeId: string) => {
    const subtitleAr =
      themeId === 'sand'
        ? 'مريح للعين'
        : themeId === 'matcha'
        ? 'سكينة وهدوء'
        : themeId === 'frost'
        ? 'بارد ومنعش'
        : themeId === 'lavender'
        ? 'موف باودري'
        : themeId === 'light'
        ? 'أبيض ناصع'
        : themeId === 'dark'
        ? 'عالي التباين'
        : themeId === 'ocean'
        ? 'كحلي نورديك'
        : themeId === 'forest'
        ? 'صنوبر مهدئ'
        : themeId === 'sunset'
        ? 'مخملي ملكي'
        : 'ياقوتي نبيذي';

    const subtitleEn =
      themeId === 'sand'
        ? 'Eye-Ease'
        : themeId === 'matcha'
        ? 'Zen Focus'
        : themeId === 'frost'
        ? 'Glacier Ice'
        : themeId === 'lavender'
        ? 'Powder Lilac'
        : themeId === 'light'
        ? 'Clean White'
        : themeId === 'dark'
        ? 'High Contrast'
        : themeId === 'ocean'
        ? 'Nordic Blue'
        : themeId === 'forest'
        ? 'Calming Pine'
        : themeId === 'sunset'
        ? 'Royal Velvet'
        : 'Ruby Wine';

    return { subtitleAr, subtitleEn };
  };

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-bear-500/50 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-xs font-semibold transition-all shadow-xs hover:shadow-sm h-8 sm:h-9"
        title={isAr ? `تغيير المظهر: ${activeConfig.name_ar}` : `Change Theme: ${activeConfig.name_en}`}
        aria-expanded={isOpen}
      >
        {/* Active Theme Color Dot with Inner Accent */}
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shrink-0 shadow-2xs flex items-center justify-center"
          style={{ backgroundColor: activeConfig.colorSwatch.bg }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: activeConfig.colorSwatch.accent }}
          />
        </span>

        {/* Icon & Label */}
        {renderIcon(activeConfig.icon, 'w-3.5 h-3.5 opacity-80 shrink-0')}
        <span className="hidden xl:inline font-bold whitespace-nowrap">
          {isAr ? activeConfig.name_ar.split('(')[0].trim() : activeConfig.name_en.split('(')[0].trim()}
        </span>
      </button>

      {/* ==================================================================== */}
      {/* 1. DESKTOP POPOVER (Anchored, >= 640px) */}
      {/* ==================================================================== */}
      {isOpen && (
        <div
          className={`hidden sm:block absolute top-full mt-2 z-[90] w-[400px] p-3 rounded-2xl bg-white dark:bg-[#151722] border border-stone-200 dark:border-stone-800 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${
            isAr ? 'right-auto left-0' : 'left-auto right-0'
          }`}
          style={{
            direction: isAr ? 'rtl' : 'ltr',
          }}
        >
          {/* Header */}
          <div className="px-2 py-1.5 border-b border-stone-100 dark:border-stone-800/80 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-stone-900 dark:text-white whitespace-nowrap">
              <Palette className="w-4 h-4 text-bear-600 dark:text-bear-400 shrink-0" />
              <span>{isAr ? 'المظاهر اللونية' : 'Color Themes'}</span>
            </div>
            <span className="shrink-0 text-[10px] px-2.5 py-0.5 rounded-full bg-bear-100 dark:bg-bear-950 text-bear-700 dark:text-bear-300 font-bold whitespace-nowrap">
              {isAr ? '10 مظاهر مميزة' : '10 Themes'}
            </span>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-2 gap-1.5 p-0.5 max-h-[75vh] overflow-y-auto [scrollbar-width:thin]">
            {APP_THEMES.map((theme) => {
              const isActive = theme.id === currentTheme;
              const cleanNameAr = theme.name_ar.split('(')[0].trim();
              const cleanNameEn = theme.name_en.split('(')[0].trim();
              const { subtitleAr, subtitleEn } = getSubtitles(theme.id);

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  className={`p-2 rounded-xl text-start transition-all flex items-center justify-between gap-2 border ${
                    isActive
                      ? 'bg-bear-50 dark:bg-bear-950/70 border-bear-500 shadow-xs ring-1 ring-bear-500/40'
                      : 'border-stone-200/80 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                  title={isAr ? theme.description_ar : theme.description_en}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Visual Swatch */}
                    <div
                      className="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: theme.colorSwatch.bg,
                        borderColor: theme.colorSwatch.border,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: theme.colorSwatch.accent }}
                      />
                    </div>

                    {/* Names & Subtitle */}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                        {isAr ? cleanNameAr : cleanNameEn}
                      </div>
                      <div className="text-[10px] text-stone-400 dark:text-stone-500 truncate leading-tight">
                        {isAr ? subtitleAr : subtitleEn}
                      </div>
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isActive && (
                    <div className="w-4 h-4 rounded-full bg-bear-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. MOBILE BOTTOM SHEET (Via React Portal to document.body, < 640px) */}
      {/* ==================================================================== */}
      {isOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          className="sm:hidden fixed inset-0 z-[100] flex items-end justify-center bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          style={{ direction: isAr ? 'rtl' : 'ltr' }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white dark:bg-[#151722] rounded-t-3xl shadow-2xl border-t border-x border-stone-200 dark:border-stone-800 p-4 pb-6 max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800/80 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-bear-500/15 border border-bear-500/30 flex items-center justify-center text-bear-600 dark:text-bear-400 shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900 dark:text-white leading-tight">
                    {isAr ? 'المظاهر اللونية' : 'Color Themes'}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                    {isAr ? '10 مظاهر مميزة مريحة للقراءة' : '10 curated reading themes'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0"
                aria-label={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-2 gap-2 overflow-y-auto py-3 [scrollbar-width:thin]">
              {APP_THEMES.map((theme) => {
                const isActive = theme.id === currentTheme;
                const cleanNameAr = theme.name_ar.split('(')[0].trim();
                const cleanNameEn = theme.name_en.split('(')[0].trim();
                const { subtitleAr, subtitleEn } = getSubtitles(theme.id);

                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-2xl text-start transition-all flex items-center justify-between gap-2 border ${
                      isActive
                        ? 'bg-bear-50 dark:bg-bear-950/70 border-bear-500 shadow-xs ring-2 ring-bear-500/30'
                        : 'border-stone-200/80 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs"
                        style={{
                          backgroundColor: theme.colorSwatch.bg,
                          borderColor: theme.colorSwatch.border,
                        }}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: theme.colorSwatch.accent }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                          {isAr ? cleanNameAr : cleanNameEn}
                        </div>
                        <div className="text-[10px] text-stone-400 dark:text-stone-500 truncate leading-tight">
                          {isAr ? subtitleAr : subtitleEn}
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-bear-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
