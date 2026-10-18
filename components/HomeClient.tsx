'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MindMap from '@/components/MindMap';
import SearchModal from '@/components/SearchModal';
import ArticleDrawer from '@/components/ArticleDrawer';
import AuthModal from '@/components/AuthModal';
import AdvisorPanel from '@/components/AdvisorPanel';
import FeedbackModal from '@/components/FeedbackModal';
import WelcomeModal from '@/components/WelcomeModal';
import BottomNav from '@/components/BottomNav';
import UserProfileModal from '@/components/UserProfileModal';
import ThemeSheet from '@/components/ThemeSheet';
import { MessageSquare } from 'lucide-react';
import { Article, Cluster } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { AppTheme, applyTheme, getInitialTheme } from '@/lib/theme';

interface HomeClientProps {
  initialArticles?: Article[];
  initialClusters?: Cluster[];
}

export default function HomeClient({
  initialArticles = [],
  initialClusters = [],
}: HomeClientProps) {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [clusters, setClusters] = useState<Cluster[]>(initialClusters);
  const [loading, setLoading] = useState<boolean>(initialArticles.length === 0);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [advisorModalOpen, setAdvisorModalOpen] = useState<boolean>(false);
  const [advisorContextArticle, setAdvisorContextArticle] = useState<Article | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [themeSheetOpen, setThemeSheetOpen] = useState<boolean>(false);
  const [showFavoritesFilter, setShowFavoritesFilter] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [feedbackOpen, setFeedbackOpen] = useState<boolean>(false);
  const [feedbackErrorDetails, setFeedbackErrorDetails] = useState<string | null>(null);
  const [welcomeOpen, setWelcomeOpen] = useState<boolean>(false);

  const handleOpenFeedback = (err?: string) => {
    setFeedbackErrorDetails(err || null);
    setFeedbackOpen(true);
  };

  const handleCloseWelcome = () => {
    setWelcomeOpen(false);
    try {
      localStorage.setItem('asb_welcome_seen', 'true');
    } catch {}
  };

  const isAr = lang === 'ar';

  // Check first-time visitor to show welcome guide modal (once only)
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem('asb_welcome_seen');
      const params = new URLSearchParams(window.location.search);
      const isDeepLink = params.has('article') || params.has('slug');
      if (!hasSeen && !isDeepLink) {
        const timer = setTimeout(() => setWelcomeOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

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

  // Intelligent Cloud Favorites Fetcher with Auto-Migration & Cross-Device Merge
  const fetchCloudFavorites = async (currentUser: AuthUser, localFavsToMerge: string[] = []) => {
    try {
      const userKey = `smartbear_favorites_${currentUser.id}`;
      const res = await fetch('/api/favorites', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.favorites)) {
        const cloudFavs = data.favorites as string[];

        if (cloudFavs.length === 0 && localFavsToMerge.length > 0) {
          // Auto-migrate: User had favorites on this device before cloud sync, upload them to Supabase!
          await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorites: localFavsToMerge }),
          });
          setFavorites(localFavsToMerge);
          try {
            localStorage.setItem(userKey, JSON.stringify(localFavsToMerge));
          } catch {}
        } else {
          // Merge cloud and local so no items are ever lost across devices
          const merged = Array.from(new Set([...cloudFavs, ...localFavsToMerge]));
          setFavorites(merged);
          try {
            localStorage.setItem(userKey, JSON.stringify(merged));
          } catch {}

          if (merged.length > cloudFavs.length) {
            await fetch('/api/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ favorites: merged }),
            });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching cloud favorites:', err);
    }
  };

  // Initial favorites load on user login
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setShowFavoritesFilter(false);
      return;
    }

    // 1. Scan all possible storage keys to retrieve any existing local favorites
    let localFavs: string[] = [];
    const userKey = `smartbear_favorites_${user.id}`;
    try {
      const keysToScan = [userKey, 'smartbear_favorites', 'asb_favorites', 'favorites'];
      for (const k of keysToScan) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              localFavs = Array.from(new Set([...localFavs, ...parsed]));
            }
          } catch {}
        }
      }
      if (localFavs.length > 0) {
        setFavorites(localFavs);
        localStorage.setItem(userKey, JSON.stringify(localFavs));
      }
    } catch {}

    // 2. Fetch from cloud database & sync
    fetchCloudFavorites(user, localFavs);
  }, [user]);

  // Live re-sync when user switches back to the app/tab on iPhone or PC
  useEffect(() => {
    if (!user) return;
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchCloudFavorites(user);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
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

      // Cache locally
      try {
        localStorage.setItem(`smartbear_favorites_${user.id}`, JSON.stringify(next));
      } catch {}

      // Persist to server / Supabase
      fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites: next }),
      }).catch((err) => console.error('Error syncing cloud favorites:', err));

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

  // Fetch articles and clusters if not already provided via SSR
  useEffect(() => {
    if (articles.length > 0 && clusters.length > 0) {
      setLoading(false);
      return;
    }
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
  }, [articles.length, clusters.length]);

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
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={handleLogout}
        onOpenAbout={() => setWelcomeOpen(true)}
      />

      {/* Main Content Area (With bottom padding on mobile for BottomNav) */}
      <main className="flex-1 flex flex-col pb-20 md:pb-0">
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
            showOnlyFavorites={showFavoritesFilter}
            onToggleFavoritesFilter={setShowFavoritesFilter}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        currentView={showFavoritesFilter ? 'favorites' : 'map'}
        onSelectView={(view) => {
          if (view === 'favorites' && !user) {
            setAuthModalOpen(true);
            return;
          }
          if (view === 'favorites' && user) {
            fetchCloudFavorites(user);
          }
          setShowFavoritesFilter(view === 'favorites');
        }}
        onOpenAdvisor={() => {
          setAdvisorContextArticle(null);
          setAdvisorModalOpen(true);
        }}
        onOpenThemeSheet={() => setThemeSheetOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        user={user}
        favoritesCount={favorites.length}
        lang={lang}
      />

      {/* Mobile Theme Selection Sheet */}
      <ThemeSheet
        isOpen={themeSheetOpen}
        onClose={() => setThemeSheetOpen(false)}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        lang={lang}
      />

      {/* User Profile & Account Settings Modal */}
      {user && (
        <UserProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          user={user}
          onUserUpdated={(updatedUser) => setUser(updatedUser)}
          onLogout={handleLogout}
          lang={lang}
        />
      )}

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
        articles={articles}
        onSelectArticle={handleSelectArticle}
        isAdvisorOpen={advisorModalOpen}
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
        onOpenFeedback={handleOpenFeedback}
        articles={articles}
        onSelectArticle={handleSelectArticle}
      />

      {/* Floating Developer Feedback / Bug Report Trigger */}
      <div className="fixed bottom-20 md:bottom-4 left-4 rtl:left-auto rtl:right-4 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
          onClick={() => handleOpenFeedback()}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/95 dark:bg-stone-900/95 hover:bg-bear-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-bear-700 dark:hover:text-bear-300 border border-stone-200/90 dark:border-stone-800 shadow-md backdrop-blur-md text-xs font-bold transition-all hover:scale-105 active:scale-95 group"
          title={isAr ? 'إبلاغ عن مشكلة أو اقتراح فكرة للمطور' : 'Report a bug or suggest an idea'}
        >
          <MessageSquare className="w-3.5 h-3.5 text-bear-600 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">{isAr ? 'إبلاغ عن مشكلة / اقتراح' : 'Feedback & Bug Report'}</span>
          <span className="sm:hidden">{isAr ? 'بلاغ / اقتراح' : 'Feedback'}</span>
        </button>
      </div>

      {/* Developer Feedback & Bug Modal */}
      <FeedbackModal
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        lang={lang}
        initialError={feedbackErrorDetails}
      />

      {/* First-Time Visitor & On-Demand Welcome Modal */}
      <WelcomeModal
        isOpen={welcomeOpen}
        onClose={handleCloseWelcome}
        onOpenAdvisor={() => {
          handleCloseWelcome();
          setAdvisorContextArticle(null);
          setAdvisorModalOpen(true);
        }}
        lang={lang}
      />
    </div>
  );
}
