import React from 'react';
import { Search, Globe, Moon, Sun, Sparkles, BookOpen, User, LogOut } from 'lucide-react';
import { AuthUser } from '@/lib/auth';

interface NavbarProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenSearch: () => void;
  onOpenAdvisor: () => void;
  articleCount?: number;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navbar({
  lang,
  setLang,
  darkMode,
  setDarkMode,
  onOpenSearch,
  onOpenAdvisor,
  articleCount = 213,
  user,
  onOpenAuth,
  onLogout,
}: NavbarProps) {
  const isAr = lang === 'ar';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/85 dark:bg-stone-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-bear-500/10 dark:bg-bear-500/20 text-bear-600 dark:text-bear-400 flex items-center justify-center font-bold text-xl border border-bear-500/20 shadow-sm">
            🐻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-stone-900 dark:text-white">
                {isAr ? 'مستشار الدب الذكي' : 'A Smart Bear Advisor'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-bear-500/10 text-bear-700 dark:text-bear-300 border border-bear-500/20">
                {articleCount} {isAr ? 'مقالاً' : 'Essays'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
              {isAr
                ? 'فلسفة واستراتيجيات جيسون كوهين لريادة الأعمال'
                : "Jason Cohen's Philosophy & Startup Frameworks"}
            </p>
          </div>
        </div>

        {/* Center / Search Quick Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-bear-500/50 hover:text-stone-900 dark:hover:text-stone-100 transition-all text-sm w-72 justify-between group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-stone-400 group-hover:text-bear-500 transition-colors" />
            <span>{isAr ? 'بحث في المقالات والمفاهيم...' : 'Search essays & frameworks...'}</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-bold rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 shadow-xs">
            Ctrl + K
          </kbd>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isAr ? 'بحث' : 'Search'}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-bear-500/50 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-xs font-semibold transition-all shadow-sm"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-transparent hover:border-stone-200 dark:border-stone-800"
            title={isAr ? 'تبديل المظهر' : 'Toggle Theme'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Auth Status / Sign-In Button */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold">
                <User className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400" />
                <span className="max-w-[100px] truncate">{user.username}</span>
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-bear-500/30 hover:border-bear-500 bg-bear-50 dark:bg-bear-950/40 text-bear-700 dark:text-bear-300 text-xs font-bold transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          )}

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAdvisor}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-bear-600 hover:bg-bear-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-bear-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span className="font-semibold">{isAr ? 'المستشار الذكي' : 'AI Advisor'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
