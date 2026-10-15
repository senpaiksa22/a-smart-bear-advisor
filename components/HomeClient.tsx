'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MindMap from '@/components/MindMap';
import SearchModal from '@/components/SearchModal';
import ArticleDrawer from '@/components/ArticleDrawer';
import AuthModal from '@/components/AuthModal';
import AdvisorPanel from '@/components/AdvisorPanel';
import { Article, Cluster } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { AppTheme, applyTheme, getInitialTheme } from '@/lib/theme';

export default function HomeClient() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [articles, setArticles] = useState<Article[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [advisorModalOpen, setAdvisorModalOpen] = useState<boolean>(false);
  const [advisorContextArticle, setAdvisorContextArticle] = useState<Article | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const isAr = lang === 'ar';

  // Check existing session from HttpOnly cookie
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

  // Load saved favorites from localStorage scoped to authenticated user
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    try {
      const userKey = `smartbear_favorites_${user.id}`;
      const saved = localStorage.getItem(userKey);
      if (saved) {
        setFavorites(JSON.parse(saved));
      } else {
        // Fallback check by username or legacy
        const legacy = localStorage.getItem('smartbear_favorites');
        if (legacy) {
          setFavorites(JSON.parse(legacy));
          localStorage.setItem(userKey, legacy);
          localStorage.removeItem('smartbear_favorites');
        } else {
          setFavorites([]);
        }
      }
    } catch {
      setFavorites([]);
    }
  }, [user]);

  const handleToggleFavorite = (slug: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setFavorites((prev) => {
      const next = prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug];
      try {
        localStorage.setItem(`smartbear_favorites_${user.id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setFavorites([]);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Sync URL with selected article for seamless sharing on WhatsApp/Twitter
  const handleSelectArticle = (art: Article | null) => {
    setSelectedArticle(art);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (art) {
        url.searchParams.set('article', art.slug);
      } else {
        url.searchParams.delete('article');
        url.searchParams.delete('slug');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Global shortcut (K or / or Ctrl+K) to toggle search anywhere without browser conflict
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput =
        tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;

      if (!isInput && (e.code === 'KeyK' || e.key.toLowerCase() === 'k' || e.key === '/')) {
        e.preventDefault();
        e.stopPropagation();
        setSearchOpen((prev) => !prev);
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyK' || e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        e.stopPropagation();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle direction & html lang attribute
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  // Initialize theme from localStorage
  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // Fetch articles and clusters
  useEffect(() => {
    fetch('/api/articles')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.articles || []);
          setClusters(data.clusters || []);
        }
      })
      .catch((err) => console.error('Error loading articles:', err))
      .finally(() => setLoading(false));
  }, []);

  // Open article automatically on initial page load if ?article=slug is present in URL
  useEffect(() => {
    if (articles.length === 0 || typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const targetSlug = params.get('article') || params.get('slug');
      if (targetSlug) {
        const match = articles.find((a) => a.slug === targetSlug);
        if (match) {
          setSelectedArticle(match);
        }
      }
    } catch {}
  }, [articles]);

  const handleConsultJason = (article: Article) => {
    setAdvisorContextArticle(article);
    setAdvisorModalOpen(true);
  };

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors"
    >
      {/* Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={handleThemeChange}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenAdvisor={() => {
          setAdvisorContextArticle(null);
          setAdvisorModalOpen(true);
        }}
        articleCount={articles.length}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-bear-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-stone-500">
                {isAr ? 'جاري تحميل خريطة المعارف والمقالات...' : 'Loading knowledge tree & essays...'}
              </p>
            </div>
          </div>
        ) : (
          <MindMap
            articles={articles}
            clusters={clusters}
            lang={lang}
            onSelectArticle={handleSelectArticle}
            selectedArticleSlug={selectedArticle?.slug}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        articles={articles}
        lang={lang}
        onSelectArticle={handleSelectArticle}
      />

      {/* Article Detail Drawer */}
      <ArticleDrawer
        article={selectedArticle}
        onClose={() => handleSelectArticle(null)}
        lang={lang}
        onConsultJason={handleConsultJason}
        theme={theme}
        onThemeChange={handleThemeChange}
        isFavorite={selectedArticle ? favorites.includes(selectedArticle.slug) : false}
        onToggleFavorite={handleToggleFavorite}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal (Password Manager Compliant) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        lang={lang}
        onAuthSuccess={(authedUser) => setUser(authedUser)}
      />

      {/* Jason Cohen AI Advisor Panel (Gemini 4 Models + Auth + History + Export) */}
      <AdvisorPanel
        isOpen={advisorModalOpen}
        onClose={() => setAdvisorModalOpen(false)}
        lang={lang}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        contextArticle={advisorContextArticle}
        onClearContext={() => setAdvisorContextArticle(null)}
      />
    </div>
  );
}
