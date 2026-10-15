'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Map,
  Globe,
  User as UserIcon,
  LogOut,
  Cpu,
  ChevronDown,
  Layers,
  BookOpen,
} from 'lucide-react';
import { AuthUser } from '@/lib/auth';
import { AppTheme } from '@/lib/theme';
import ThemeSelector from '@/components/ThemeSelector';
import { AVAILABLE_MODELS, ModelOption } from '@/lib/models';
import { FounderChallenge, FounderChallengeId } from './types';
import { FOUNDER_CHALLENGES } from './playbooksData';

interface V2HeaderProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  activeChallengeId: FounderChallengeId;
  setActiveChallengeId: (id: FounderChallengeId) => void;
  onTogglePlaybooks: () => void;
  isPlaybooksOpen: boolean;
}

export default function V2Header({
  lang,
  setLang,
  theme,
  setTheme,
  user,
  onOpenAuth,
  onLogout,
  selectedModel,
  setSelectedModel,
  activeChallengeId,
  setActiveChallengeId,
  onTogglePlaybooks,
  isPlaybooksOpen,
}: V2HeaderProps) {
  const isAr = lang === 'ar';
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);

  const currentModelObj =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[3];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/90 dark:border-stone-800/90 bg-white/90 dark:bg-[#0c0d14]/90 backdrop-blur-xl transition-colors shadow-xs">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Return to V1 */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            title={isAr ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-bear-500 to-amber-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-bear-500/25 group-hover:scale-105 transition-transform">
              🐻
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base lg:text-lg tracking-tight text-stone-900 dark:text-white">
                  {isAr ? 'استوديو الدب التنفيذي' : 'Executive Studio'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  V2 Beta
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isAr ? 'استشارات جيسون كوهين التفاعلية' : 'Jason Cohen Advisory Console'}
              </p>
            </div>
          </Link>

          {/* Seamless V1 <-> V2 Switcher Pill */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-bear-500/50 bg-stone-100/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-bold transition-all shadow-xs"
            title={isAr ? 'التبديل إلى خريطة المحاور الكلاسيكية V1' : 'Switch to V1 Classic Mind Map'}
          >
            <Map className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400" />
            <span className="hidden sm:inline">
              {isAr ? 'الخريطة الكلاسيكية (V1)' : 'Classic Map (V1)'}
            </span>
            <span className="sm:hidden">V1</span>
          </Link>
        </div>

        {/* Center: Founder Challenges Quick Bar */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-stone-800/80 overflow-x-auto max-w-2xl">
          {FOUNDER_CHALLENGES.map((challenge) => {
            const isActive = challenge.id === activeChallengeId;
            return (
              <button
                key={challenge.id}
                onClick={() => setActiveChallengeId(challenge.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs border border-stone-200 dark:border-stone-700'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                }`}
              >
                <span>{challenge.icon}</span>
                <span>{isAr ? challenge.title_ar : challenge.title_en}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions, Playbooks Drawer Toggle, Models, Theme, Lang, Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Toggle Playbooks & Articles Drawer */}
          <button
            onClick={onTogglePlaybooks}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
              isPlaybooksOpen
                ? 'border-bear-500 bg-bear-50 dark:bg-bear-950/40 text-bear-700 dark:text-bear-300'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-bear-500/40'
            }`}
            title={isAr ? 'فتح بنك المقالات والأدلة' : 'Toggle Knowledge Radar & Playbooks'}
          >
            <BookOpen className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400" />
            <span className="hidden md:inline">
              {isAr ? 'كتيبات العمل (Playbooks)' : 'Playbooks & Radar'}
            </span>
          </button>

          {/* Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModelDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-xs font-bold hover:border-bear-500/40 transition-all shadow-xs"
              title={isAr ? 'اختيار نموذج الذكاء الاصطناعي' : 'Select AI Model'}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline max-w-[120px] truncate">
                {isAr ? currentModelObj.name_ar : currentModelObj.name}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {modelDropdownOpen && (
              <div
                className="absolute top-full mt-2 w-72 rounded-2xl bg-white dark:bg-[#12141e] border border-stone-200 dark:border-stone-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ [isAr ? 'left' : 'right']: 0 }}
              >
                <div className="text-[10px] uppercase font-black text-stone-400 px-3 py-1.5 tracking-wider">
                  {isAr ? 'نماذج Gemini المتوفرة' : 'Available Gemini Models'}
                </div>
                <div className="space-y-1">
                  {AVAILABLE_MODELS.map((model) => {
                    const isSelected = model.id === selectedModel;
                    return (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setModelDropdownOpen(false);
                        }}
                        className={`w-full text-start p-2.5 rounded-xl transition-all flex flex-col gap-0.5 ${
                          isSelected
                            ? 'bg-bear-50 dark:bg-bear-950/60 border border-bear-500/30'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-black ${
                              isSelected
                                ? 'text-bear-700 dark:text-bear-300'
                                : 'text-stone-800 dark:text-stone-200'
                            }`}
                          >
                            {isAr ? model.name_ar : model.name}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-bear-500" />
                          )}
                        </div>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                          {isAr ? model.description_ar : model.description_en}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Theme Selector (7 Themes) */}
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} lang={lang} />

          {/* Language Switcher */}
          <button
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 text-xs font-bold hover:border-bear-500/40 transition-all shadow-xs"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400" />
            <span>{isAr ? 'EN' : 'عربي'}</span>
          </button>

          {/* Auth Status */}
          {user ? (
            <div className="flex items-center gap-1">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold">
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
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-bear-600 hover:bg-bear-700 text-white text-xs font-bold shadow-sm shadow-bear-600/20 transition-all"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'دخول' : 'Sign In'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Challenges Horizontal Scroller */}
      <div className="xl:hidden border-t border-stone-200/60 dark:border-stone-800/60 px-3 py-1.5 overflow-x-auto flex items-center gap-1.5 no-scrollbar bg-stone-50/50 dark:bg-stone-900/40">
        {FOUNDER_CHALLENGES.map((challenge) => {
          const isActive = challenge.id === activeChallengeId;
          return (
            <button
              key={challenge.id}
              onClick={() => setActiveChallengeId(challenge.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                isActive
                  ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs border border-stone-200 dark:border-stone-700'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800'
              }`}
            >
              <span>{challenge.icon}</span>
              <span>{isAr ? challenge.title_ar : challenge.title_en}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
