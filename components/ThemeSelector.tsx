'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AppTheme, APP_THEMES } from '@/lib/theme';
import { Sun, Moon, BookOpen, Compass, Trees, Palette, Check, Sparkles, Coffee } from 'lucide-react';

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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';

  const activeConfig = APP_THEMES.find((t) => t.id === currentTheme) || APP_THEMES[0];

  // Close when clicking outside
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

  const renderIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'sun':
        return <Sun className={className} />;
      case 'sand':
        return <Coffee className={className} />;
      case 'moon':
        return <Moon className={className} />;
      case 'book':
        return <BookOpen className={className} />;
      case 'ocean':
        return <Compass className={className} />;
      case 'forest':
        return <Trees className={className} />;
      case 'sunset':
        return <Palette className={className} />;
      default:
        return <Palette className={className} />;
    }
  };

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-bear-500/50 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-xs font-semibold transition-all shadow-xs hover:shadow-sm h-9"
        title={isAr ? `تغيير المظهر: ${activeConfig.name_ar}` : `Change Theme: ${activeConfig.name_en}`}
        aria-expanded={isOpen}
      >
        {/* Active Theme Color Dot with Inner Glow */}
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

      {/* Dropdown Menu (6 Signature Themes) */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 z-50 w-72 p-2 rounded-2xl bg-white dark:bg-[#151722] border border-stone-200 dark:border-stone-800 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${
            isAr ? 'left-0 sm:right-auto' : 'right-0 sm:left-auto'
          }`}
          style={{
            direction: isAr ? 'rtl' : 'ltr',
          }}
        >
          {/* Header */}
          <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800/80 mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-stone-800 dark:text-stone-200">
              <Palette className="w-3.5 h-3.5 text-bear-600" />
              <span>{isAr ? 'المظاهر اللونية (7 ثيمات)' : 'Color Themes (7 Themes)'}</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-bear-100 dark:bg-bear-950 text-bear-700 dark:text-bear-300 font-bold">
              7
            </span>
          </div>

          {/* Theme List */}
          <div className="space-y-1">
            {APP_THEMES.map((theme) => {
              const isActive = theme.id === currentTheme;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-start transition-all flex items-center justify-between gap-3 border ${
                    isActive
                      ? 'bg-bear-50 dark:bg-bear-950/60 border-bear-500 shadow-2xs'
                      : 'border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/70 hover:border-stone-200/80 dark:hover:border-stone-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Visual Swatch Pill */}
                    <div
                      className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs"
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

                    {/* Names & Description */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900 dark:text-white truncate">
                          {isAr ? theme.name_ar : theme.name_en}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-bear-600 dark:text-bear-400">
                            •
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate leading-tight mt-0.5">
                        {isAr ? theme.description_ar : theme.description_en}
                      </p>
                    </div>
                  </div>

                  {/* Active Indicator Checkmark */}
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-bear-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
