'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Article } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { AppTheme, applyTheme, getInitialTheme } from '@/lib/theme';
import AuthModal from '@/components/AuthModal';
import V2Header from './V2Header';
import V2ChatAdvisor from './V2ChatAdvisor';
import V2PlaybookDrawer from './V2PlaybookDrawer';
import { FounderChallengeId } from './types';
import { FOUNDER_CHALLENGES } from './playbooksData';

export default function V2StudioClient() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [activeChallengeId, setActiveChallengeId] = useState<FounderChallengeId>('pmf');
  const [isPlaybooksOpen, setIsPlaybooksOpen] = useState(true);
  const [contextArticle, setContextArticle] = useState<Article | null>(null);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-3.8-flash');

  const isAr = lang === 'ar';

  // Active challenge object
  const activeChallenge = useMemo(() => {
    return (
      FOUNDER_CHALLENGES.find((c) => c.id === activeChallengeId) ||
      FOUNDER_CHALLENGES[0]
    );
  }, [activeChallengeId]);

  // Check auth session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Sync theme
  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Sync lang & direction
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  // Fetch articles
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.articles) {
          setAllArticles(data.articles);
        }
      })
      .catch(() => {});
  }, []);

  const handlePinArticleContext = (article: Article) => {
    setContextArticle(article);
  };

  const handleSelectArticleBySlug = (slug: string) => {
    setSelectedArticleSlug(slug);
    setIsPlaybooksOpen(true);
  };

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-stone-100/60 dark:bg-[#07080c] text-stone-900 dark:text-stone-100 transition-colors selection:bg-bear-500 selection:text-white"
    >
      {/* Executive Top Bar */}
      <V2Header
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={handleThemeChange}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        activeChallengeId={activeChallengeId}
        setActiveChallengeId={setActiveChallengeId}
        onTogglePlaybooks={() => setIsPlaybooksOpen((prev) => !prev)}
        isPlaybooksOpen={isPlaybooksOpen}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-2 sm:p-4 md:p-6 flex flex-col lg:flex-row gap-4 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Central / Left: Immersive Chat-First Advisor Workspace */}
        <section className="flex-1 h-full min-w-0">
          <V2ChatAdvisor
            lang={lang}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
            activeChallenge={activeChallenge}
            selectedModel={selectedModel}
            contextArticle={contextArticle}
            onClearContextArticle={() => setContextArticle(null)}
            onSelectArticleBySlug={handleSelectArticleBySlug}
            allArticles={allArticles}
          />
        </section>

        {/* Right: Knowledge Radar & Founder Playbook Drawer */}
        <V2PlaybookDrawer
          lang={lang}
          isOpen={isPlaybooksOpen}
          onClose={() => setIsPlaybooksOpen(false)}
          activeChallenge={activeChallenge}
          allArticles={allArticles}
          onPinArticleContext={handlePinArticleContext}
          selectedArticleSlug={selectedArticleSlug}
          onSelectArticleSlug={setSelectedArticleSlug}
        />
      </main>

      {/* User Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        onAuthSuccess={(loggedUser) => {
          setUser(loggedUser);
          setAuthModalOpen(false);
        }}
      />
    </div>
  );
}
