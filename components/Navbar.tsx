import React from 'react';
import { Search, Globe, Moon, Sun, Sparkles, BookOpen, User, LogOut, HelpCircle } from 'lucide-react';
import { AuthUser } from '@/lib/auth';

import { AppTheme } from '@/lib/theme';
import ThemeSelector from '@/components/ThemeSelector';

interface NavbarProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  onOpenSearch: () => void;
  onOpenAdvisor: () => void;
  articleCount?: number;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAbout: () => void;
}

export default function Navbar({
  lang,
  setLang,
  theme,
  setTheme,
  onOpenSearch,
  onOpenAdvisor,
  articleCount = 213,
  user,
  onOpenAuth,
  onLogout,
  onOpenAbout,
}: NavbarProps) {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/85 dark:bg-stone-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-500/30 shadow-sm flex items-center justify-center bg-stone-900 flex-shrink-0">
            <img src="/icon.png" alt="A Smart Bear Advisor" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-stone-900 dark:text-white whitespace-nowrap">
                {isAr ? 'مستشار الدب الذكي' : 'A Smart Bear Advisor'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-bear-500/10 text-bear-700 dark:text-bear-300 border border-bear-500/20 whitespace-nowrap">
                {articleCount} {isAr ? 'مقالاً' : 'Essays'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden xl:block whitespace-nowrap">
              {isAr
                ? 'فلسفة واستراتيجيات جيسون كوهين لريادة الأعمال'
                : "Jason Cohen's Philosophy & Startup Frameworks"}
            </p>
          </div>
        </div>

        {/* Center / Search Quick Trigger (Compact on medium, expands on xl) */}
        <button
          onClick={onOpenSearch}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-bear-500/50 hover:text-stone-900 dark:hover:text-stone-100 transition-all text-xs w-44 xl:w-56 justify-between group shadow-sm h-9 shrink"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-stone-400 group-hover:text-bear-500 transition-colors shrink-0" />
            <span className="truncate">{isAr ? 'بحث في المقالات...' : 'Search essays...'}</span>
          </div>
          <kbd className="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-stone-200/80 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 shrink-0">
            <span>K</span>
          </kbd>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile / Tablet Search Button */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200/60 dark:border-stone-800 shrink-0"
            title={isAr ? 'بحث' : 'Search'}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-bear-500/50 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-xs font-semibold transition-all shadow-sm"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400 shrink-0" />
            <span className="whitespace-nowrap">{isAr ? 'English' : 'عربي'}</span>
          </button>

          {/* Color Themes Selector */}
          <ThemeSelector
            currentTheme={theme}
            onThemeChange={setTheme}
            lang={lang}
          />

          {/* About / Guide Button */}
          <button
            onClick={onOpenAbout}
            className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:bg-amber-500/10 text-stone-600 dark:text-stone-300 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-semibold transition-all shadow-sm"
            title={isAr ? 'عن المستشار وفكرة المنصة' : 'About the Advisor'}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">{isAr ? 'عن المنصة' : 'About'}</span>
          </button>

          {/* User Auth Status / Sign-In Button */}
          {user ? (
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold whitespace-nowrap">
                <User className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400 shrink-0" />
                <span className="max-w-[85px] sm:max-w-[110px] truncate">{user.username}</span>
              </div>
              <button
                onClick={onLogout}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors shrink-0"
                title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="whitespace-nowrap shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-xl border border-bear-500/30 hover:border-bear-500 bg-bear-50 dark:bg-bear-950/40 text-bear-700 dark:text-bear-300 text-xs font-bold transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          )}

          {/* AI Advisor Button (Unbroken Single Line Horizontal Pill) */}
          <button
            onClick={onOpenAdvisor}
            className="whitespace-nowrap shrink-0 flex items-center gap-2 px-3.5 sm:px-4 h-9 sm:h-9.5 rounded-xl bg-bear-600 hover:bg-bear-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-bear-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 animate-spin-slow shrink-0" />
            <span className="whitespace-nowrap font-bold">{isAr ? 'المستشار الذكي' : 'AI Advisor'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
