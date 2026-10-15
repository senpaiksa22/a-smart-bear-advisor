'use client';

import React from 'react';
import { Compass, Star, Sparkles, Palette, User } from 'lucide-react';
import { AuthUser } from '@/lib/auth';

interface BottomNavProps {
  currentView: 'map' | 'favorites';
  onSelectView: (view: 'map' | 'favorites') => void;
  onOpenAdvisor: () => void;
  onOpenThemeSheet: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  user: AuthUser | null;
  favoritesCount: number;
  lang: 'ar' | 'en';
}

export default function BottomNav({
  currentView,
  onSelectView,
  onOpenAdvisor,
  onOpenThemeSheet,
  onOpenProfile,
  onOpenAuth,
  user,
  favoritesCount,
  lang,
}: BottomNavProps) {
  const isAr = lang === 'ar';

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 transition-colors"
      style={{
        direction: isAr ? 'rtl' : 'ltr',
        backgroundColor: 'var(--surface-primary)',
        borderColor: 'var(--border-subtle)',
      }}
      aria-label={isAr ? 'شريط التنقل السفلي' : 'Bottom Navigation'}
    >
      <div className="max-w-md mx-auto px-4 flex items-center justify-between">
        {/* 1. MAP / HOME */}
        <button
          onClick={() => onSelectView('map')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all group ${
            currentView === 'map'
              ? 'text-bear-600 dark:text-bear-400 font-black'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-transform ${
              currentView === 'map' ? 'bg-bear-500/10 scale-110' : 'group-active:scale-95'
            }`}
          >
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold">
            {isAr ? 'الخريطة' : 'Map'}
          </span>
        </button>

        {/* 2. FAVORITES */}
        <button
          onClick={() => onSelectView('favorites')}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-all relative group ${
            currentView === 'favorites'
              ? 'text-amber-500 dark:text-amber-400 font-black'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <div
            className={`p-1 rounded-xl transition-transform relative ${
              currentView === 'favorites' ? 'bg-amber-500/15 scale-110' : 'group-active:scale-95'
            }`}
          >
            <Star className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 text-[9px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold">
            {isAr ? 'المفضلة' : 'Saved'}
          </span>
        </button>

        {/* 3. CENTER: ADVISOR BUTTON (Prominent & Raised) */}
        <div className="flex-1 flex items-center justify-center -mt-4">
          <button
            onClick={onOpenAdvisor}
            className="flex flex-col items-center justify-center group active:scale-95 transition-transform"
            title={isAr ? 'استشارة جيسون كوهين' : 'Consult Jason Cohen'}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-bear-700 via-bear-600 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-bear-600/30 border-2 border-white dark:border-stone-900 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-amber-200 animate-spin-slow" />
            </div>
            <span className="text-[10px] mt-0.5 font-extrabold text-bear-700 dark:text-bear-300">
              {isAr ? 'المستشار' : 'Advisor'}
            </span>
          </button>
        </div>

        {/* 4. THEME PICKER */}
        <button
          onClick={onOpenThemeSheet}
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-all group active:scale-95"
          title={isAr ? 'المظهر والألوان' : 'Color Themes'}
        >
          <div className="p-1 rounded-xl group-hover:bg-stone-100 dark:group-hover:bg-stone-800 transition-colors">
            <Palette className="w-5 h-5 text-stone-600 dark:text-stone-300" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold">
            {isAr ? 'المظهر' : 'Themes'}
          </span>
        </button>

        {/* 5. USER PROFILE / AUTH */}
        <button
          onClick={user ? onOpenProfile : onOpenAuth}
          className="flex-1 flex flex-col items-center justify-center py-1 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-all group active:scale-95"
          title={user ? (isAr ? 'حسابي' : 'Profile') : (isAr ? 'تسجيل الدخول' : 'Sign In')}
        >
          <div
            className={`p-1 rounded-xl transition-colors ${
              user
                ? 'bg-bear-500/10 text-bear-700 dark:text-bear-300'
                : 'group-hover:bg-stone-100 dark:group-hover:bg-stone-800'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold truncate max-w-[60px]">
            {user ? user.username : isAr ? 'دخول' : 'Sign In'}
          </span>
        </button>
      </div>
    </nav>
  );
}
