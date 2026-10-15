'use client';

import React, { useState } from 'react';
import { X, Lock, User, Sparkles, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { AuthUser } from '@/lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  onAuthSuccess: (user: AuthUser) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  lang,
  onAuthSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAr = lang === 'ar';

  // Prevent background scroll bleed when AuthModal is open (Rock-solid iOS & desktop lock)
  React.useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || (isAr ? 'فشلت العملية' : 'Authentication failed'));
      }

      onAuthSuccess(data.user);
      onClose();
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 overflow-hidden"
        style={{ direction: isAr ? 'rtl' : 'ltr' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl overflow-hidden border border-amber-500/30 shadow-md flex items-center justify-center bg-stone-900 mb-3">
            <img src="/icon.png" alt="A Smart Bear Advisor" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            {mode === 'login'
              ? isAr
                ? 'تسجيل الدخول إلى حسابك'
                : 'Sign In to Your Account'
              : isAr
              ? 'إنشاء حساب جديد'
              : 'Create New Account'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {isAr
              ? 'احفظ مقالاتك المفضلة وسجل استشاراتك مع المستشار الذكي مجاناً'
              : 'Save your favorite articles and advisor chats in your free account'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex rounded-xl bg-stone-100 dark:bg-stone-800 p-1 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white dark:bg-stone-900 text-bear-700 dark:text-bear-400 shadow-sm'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white dark:bg-stone-900 text-bear-700 dark:text-bear-400 shadow-sm'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {isAr ? 'إنشاء حساب' : 'Register'}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Semantic HTML5 Form - 100% Password Manager Compliant */}
        <form onSubmit={handleSubmit} method="post" className="space-y-4">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5"
            >
              {isAr ? 'اسم المستخدم' : 'Username'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3.5 rtl:pr-3.5 ltr:pl-3.5 pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isAr ? 'أدخل اسم المستخدم' : 'Enter username'}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2.5 rtl:pr-10 ltr:pl-10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-bear-500 text-base sm:text-sm font-medium transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5"
            >
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto flex items-center pr-3.5 rtl:pr-3.5 ltr:pl-3.5 pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter password'}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-2.5 rtl:pr-10 ltr:pl-10 text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-bear-500 text-base sm:text-sm font-medium transition-all"
              />
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">
              {isAr
                ? 'مقبول أي طول بدون قيود أو شروط تعقيد (مشفرة بـ bcrypt مع Salt).'
                : 'Any length accepted with zero complexity restrictions (bcrypt hashed).'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-bear-600 hover:bg-bear-700 text-white font-bold text-sm shadow-lg shadow-bear-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login'
                    ? isAr
                      ? 'تسجيل الدخول'
                      : 'Sign In'
                    : isAr
                    ? 'إنشاء الحساب فوراً'
                    : 'Create Account'}
                </span>
                <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
        </form>

        {/* Security Assurance Badge */}
        <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-center gap-2 text-stone-400 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            {isAr
              ? 'حماية كاملة: تشفير Bcrypt وجلسات HttpOnly معزولة'
              : 'Zero Client Exposure • Bcrypt Salted • HttpOnly Isolation'}
          </span>
        </div>
      </div>
    </div>
  );
}
