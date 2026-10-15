import React from 'react';
import { X, Sparkles, BookOpen, MessageSquare, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdvisor: () => void;
  lang: 'ar' | 'en';
}

export default function WelcomeModal({
  isOpen,
  onClose,
  onOpenAdvisor,
  lang,
}: WelcomeModalProps) {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const handleStartAdvisor = () => {
    onClose();
    onOpenAdvisor();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 dark:bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-bear-500/10 dark:bg-bear-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Logo & Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-lg flex items-center justify-center bg-stone-900 mb-4 p-0.5">
            <img src="/icon.png" alt="A Smart Bear Logo" className="w-full h-full object-cover rounded-xl" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'مستشارك الاستراتيجي الذكي' : 'AI Strategic Advisor'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight">
            {isAr ? 'أهلاً بك في مستشار الدب الذكي' : 'Welcome to A Smart Bear Advisor'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
            {isAr
              ? 'خلاصة أكثر من 20 عاماً في بناء الشركات البرمجية من الصفر إلى اليونيكورن'
              : '20+ years of tactical wisdom on building startups from zero to unicorn'}
          </p>
        </div>

        {/* 3 Quick Value Cards */}
        <div className="space-y-3 mb-6">
          {/* Card 1: Who is it */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
              🧠
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'فكر وخبرة جيسون كوهين' : "Jason Cohen's Proven Philosophy"}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                {isAr
                  ? 'مستشار افتراضي مبني على تجارب مؤسس WP Engine (شركة بقيمة مليار دولار) لمساعدتك بقرارات حاسمة بدون تنظير.'
                  : 'An interactive advisor distilled from the founder of WP Engine ($1B unicorn) to give you honest, actionable advice.'}
              </p>
            </div>
          </div>

          {/* Card 2: What you get */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-bear-500/10 text-bear-600 dark:text-bear-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
              💡
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'استشارات ذكية ومكتبة استراتيجية' : 'AI Advice & Strategic Library'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                {isAr
                  ? 'حل معضلاتك في التسعير، ملاءمة المنتج للسوق، والنمو، بالإضافة إلى 213 مقالاً مترجماً للعربية بدقة.'
                  : 'Solve your toughest challenges in pricing, PMF, and bootstrapping, backed by 213 translated essays.'}
              </p>
            </div>
          </div>

          {/* Card 3: Free forever */}
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
              ✨
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                {isAr ? 'مجاني 100% للأبد' : '100% Free Forever'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 leading-relaxed">
                {isAr
                  ? 'بدون رسوم، بدون بطاقات بنكية، ومتاح لجميع رواد الأعمال لخدمة مجتمع الشركات الناشئة.'
                  : 'No subscription, no credit card required. Free forever to empower founders everywhere.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleStartAdvisor}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-bear-600 to-amber-600 hover:from-bear-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-bear-600/25 transition-all flex items-center justify-center gap-2 group"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isAr ? 'جرّب سؤال المستشار الذكي الآن' : 'Ask the AI Advisor Now'}</span>
            {isAr ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {isAr ? 'تصفح خريطة المعرفة والمقالات' : 'Explore Articles & Mind Map'}
          </button>
        </div>
      </div>
    </div>
  );
}
