'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, TrendingUp, BookOpen, Layers } from 'lucide-react';
import { Article } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { AppTheme, applyTheme, getInitialTheme } from '@/lib/theme';
import AuthModal from '@/components/AuthModal';
import V2BentoHeader from './V2BentoHeader';
import V2BentoGrid from './V2BentoGrid';
import V2ArticleModal from './V2ArticleModal';
import V2ConsultModal from './V2ConsultModal';
import { BentoItem } from './bentoData';

export default function V2StudioClient() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<AppTheme>('light');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [allArticles, setAllArticles] = useState<Article[]>([]);

  // Modals state
  const [activeArticleModal, setActiveArticleModal] = useState<Article | null>(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultBentoItem, setConsultBentoItem] = useState<BentoItem | null>(null);
  const [consultArticle, setConsultArticle] = useState<Article | null>(null);

  const isAr = lang === 'ar';

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

  const handleOpenConsultFromItem = (item: BentoItem) => {
    setConsultBentoItem(item);
    const matchedArt = allArticles.find((a) => a.slug === item.slug) || null;
    setConsultArticle(matchedArt);
    setConsultModalOpen(true);
  };

  const handleOpenConsultFromArticle = (art: Article) => {
    setConsultBentoItem(null);
    setConsultArticle(art);
    setConsultModalOpen(true);
  };

  const handleQuickConsult = () => {
    setConsultBentoItem(null);
    setConsultArticle(null);
    setConsultModalOpen(true);
  };

  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col bg-stone-50/70 dark:bg-[#07080c] text-stone-900 dark:text-stone-100 transition-colors selection:bg-bear-500 selection:text-white"
    >
      {/* Top Bento Header */}
      <V2BentoHeader
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={handleThemeChange}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onQuickConsult={handleQuickConsult}
        totalArticlesCount={allArticles.length || 213}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Apple-style Hero Showcase Banner */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bear-500/10 text-bear-700 dark:text-bear-300 border border-bear-500/20 text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {isAr
                ? 'لوحة بينتو التنفيذية: أسلوب عرض آبل الحديث'
                : 'Executive Bento Showcase: Apple-Inspired Grid'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-white tracking-tight leading-tight">
            {isAr
              ? 'النماذج الفكرية التي بنت شركات مليارية'
              : 'Mental Models That Built Billion-Dollar Companies'}
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-medium max-w-2xl mx-auto">
            {isAr
              ? 'استكشف أهم خلاصات وتجارب جيسون كوهين في بطاقات بصرية تفاعلية مستوحاة من واجهات آبل و Linear؛ من معادلة ملاءمة المنتج للسوق إلى هندسة التسعير والخنادق التنافسية.'
              : 'Explore Jason Cohen’s foundational playbooks in interactive Apple-inspired bento cards; from PMF and pricing mechanics to moats and founder psychology.'}
          </p>
        </section>

        {/* The Bento Grid Showcase Component */}
        <V2BentoGrid
          lang={lang}
          allArticles={allArticles}
          onOpenArticle={(art) => setActiveArticleModal(art)}
          onConsultItem={handleOpenConsultFromItem}
          onConsultArticle={handleOpenConsultFromArticle}
        />
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800/80 py-8 text-center text-xs text-stone-500 dark:text-stone-400">
        <p>
          {isAr
            ? 'مستشار الدب الذكي © جميع المقالات والنماذج الفكرية الأصلية ملك للمؤسس والكاتب جيسون كوهين (A Smart Bear)'
            : 'A Smart Bear Advisor © Original essays and mental models by Jason Cohen'}
        </p>
      </footer>

      {/* Article Detail Reading Modal */}
      <V2ArticleModal
        isOpen={!!activeArticleModal}
        onClose={() => setActiveArticleModal(null)}
        article={activeArticleModal}
        lang={lang}
        onConsult={handleOpenConsultFromArticle}
      />

      {/* Sleek Floating Consultation Modal */}
      <V2ConsultModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
        lang={lang}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        bentoItem={consultBentoItem}
        article={consultArticle}
        selectedModel="gemini-3.8-flash"
      />

      {/* Auth Modal */}
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
