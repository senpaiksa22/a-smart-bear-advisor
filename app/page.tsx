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
import { Sparkles, MessageSquare, AlertCircle } from 'lucide-react';

export default function HomePage() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [advisorModalOpen, setAdvisorModalOpen] = useState<boolean>(false);
  const [advisorContextArticle, setAdvisorContextArticle] = useState<Article | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Global shortcut (K or / or Ctrl+K) to toggle search anywhere without browser conflict
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;

      // Standalone K (works with English layout 'k' or Arabic layout 'ن' via e.code) or '/' when not typing in an input
      if (!isInput && (e.code === 'KeyK' || e.key.toLowerCase() === 'k' || e.key === '/')) {
        e.preventDefault();
        e.stopPropagation();
        setSearchOpen((prev) => !prev);
        return;
      }

      // Also support Ctrl+K as fallback with preventDefault to stop browser search takeover
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

  // Toggle dark mode class on html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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
        darkMode={darkMode}
        setDarkMode={setDarkMode}
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
            onSelectArticle={(art) => setSelectedArticle(art)}
            selectedArticleSlug={selectedArticle?.slug}
          />
        )}
      </main>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        articles={articles}
        lang={lang}
        onSelectArticle={(art) => setSelectedArticle(art)}
      />

      {/* Article Detail Drawer */}
      <ArticleDrawer
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        lang={lang}
        onConsultJason={handleConsultJason}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
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
