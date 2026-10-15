'use client';

import React from 'react';
import Link from 'next/link';
import {
  Map,
  Globe,
  User as UserIcon,
  LogOut,
  Sparkles,
  Layers,
} from 'lucide-react';
import { AuthUser } from '@/lib/auth';
import { AppTheme } from '@/lib/theme';
import ThemeSelector from '@/components/ThemeSelector';

interface V2BentoHeaderProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onQuickConsult: () => void;
  totalArticlesCount?: number;
}

export default function V2BentoHeader({
  lang,
  setLang,
  theme,
  setTheme,
  user,
  onOpenAuth,
  onLogout,
  onQuickConsult,
  totalArticlesCount = 213,
}: V2BentoHeaderProps) {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 dark:border-stone-800/90 bg-white/90 dark:bg-[#0c0d14]/90 backdrop-blur-xl transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand & V1 Switcher */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-bear-500 to-amber-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-bear-500/25 group-hover:scale-105 transition-transform">
              🐻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-stone-900 dark:text-white">
                  {isAr ? 'استوديو بينتو التنفيذي' : 'Bento Studio'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-bear-500/10 text-bear-700 dark:text-bear-300 border border-bear-500/20">
                  V2 Bento
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block">
                {isAr
                  ? `خلاصة فكر جيسون كوهين (${totalArticlesCount} مقالاً موثقاً)`
                  : `Jason Cohen's Thought Architecture (${totalArticlesCount} Essays)`}
              </p>
            </div>
          </Link>

          {/* Switcher back to V1 Classic Mind Map */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-bear-500/50 bg-stone-100/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-bold transition-all shadow-xs"
            title={isAr ? 'التبديل إلى خريطة المحاور الكلاسيكية V1' : 'Switch to V1 Classic Mind Map'}
          >
            <Map className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400" />
            <span className="hidden sm:inline">
              {isAr ? 'خريطة المحاور (V1)' : 'Classic Map (V1)'}
            </span>
            <span className="sm:hidden">V1</span>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Quick Advisor Trigger */}
          <button
            onClick={onQuickConsult}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-bear-600 to-amber-600 hover:from-bear-700 hover:to-amber-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-bear-600/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">
              {isAr ? 'استشارة جيسون كوهين' : 'Consult Jason'}
            </span>
            <span className="sm:hidden">{isAr ? 'استشر' : 'Ask'}</span>
          </button>

          {/* 7 Themes Selector */}
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} lang={lang} />

          {/* Language Switcher */}
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-xs font-bold hover:border-bear-500/40 transition-all shadow-xs"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-1">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold">
                <UserIcon className="w-3.5 h-3.5 text-bear-600" />
                <span className="max-w-[80px] truncate">{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-bear-500/30 hover:border-bear-500 bg-bear-50 dark:bg-bear-950/40 text-bear-700 dark:text-bear-300 text-xs font-bold transition-all shadow-xs"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'دخول' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
