'use client';

import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { AppTheme, APP_THEMES } from '@/lib/theme';

interface ThemeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  lang: 'ar' | 'en';
}

export default function ThemeSheet({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  lang,
}: ThemeSheetProps) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#151722] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-bear-500/15 border border-bear-500/30 flex items-center justify-center text-bear-600 dark:text-bear-400">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                {isAr ? 'المظاهر اللونية' : 'Color Themes'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isAr ? '10 مظاهر مميزة مريحة للقراءة' : '10 curated reading themes'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
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

            const subtitleAr =
              theme.id === 'sand'
                ? 'مريح للعين'
                : theme.id === 'matcha'
                ? 'سكينة وهدوء'
                : theme.id === 'frost'
                ? 'بارد ومنعش'
                : theme.id === 'lavender'
                ? 'موف باودري'
                : theme.id === 'light'
                ? 'أبيض ناصع'
                : theme.id === 'dark'
                ? 'عالي التباين'
                : theme.id === 'ocean'
                ? 'كحلي نورديك'
                : theme.id === 'forest'
                ? 'صنوبر مهدئ'
                : theme.id === 'sunset'
                ? 'مخملي ملكي'
                : 'ياقوتي نبيذي';

            const subtitleEn =
              theme.id === 'sand'
                ? 'Eye-Ease'
                : theme.id === 'matcha'
                ? 'Zen Focus'
                : theme.id === 'frost'
                ? 'Glacier Ice'
                : theme.id === 'lavender'
                ? 'Powder Lilac'
                : theme.id === 'light'
                ? 'Clean White'
                : theme.id === 'dark'
                ? 'High Contrast'
                : theme.id === 'ocean'
                ? 'Nordic Blue'
                : theme.id === 'forest'
                ? 'Calming Pine'
                : theme.id === 'sunset'
                ? 'Royal Velvet'
                : 'Ruby Wine';

            return (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id);
                  onClose();
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
    </div>
  );
}
