'use client';

import React, { useState, useEffect } from 'react';
import { X, User, KeyRound, LogOut, CheckCircle2, AlertCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { AuthUser } from '@/lib/auth';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser;
  onUserUpdated: (updatedUser: AuthUser) => void;
  onLogout: () => void;
  lang: 'ar' | 'en';
}

export default function UserProfileModal({
  isOpen,
  onClose,
  user,
  onUserUpdated,
  onLogout,
  lang,
}: UserProfileModalProps) {
  const isAr = lang === 'ar';

  const [currentScreen, setCurrentScreen] = useState<'main' | 'username' | 'password'>('main');

  // Change Username State
  const [newUsername, setNewUsername] = useState(user.username);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);

  // Change Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Reset to main view and update username if user prop changes
  useEffect(() => {
    if (isOpen) {
      setCurrentScreen('main');
      setNewUsername(user.username);
      setUsernameError(null);
      setUsernameSuccess(null);
      setPasswordError(null);
      setPasswordSuccess(null);
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isOpen, user]);

  // Robust Mobile & Desktop Background Scroll Lock
  useEffect(() => {
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

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(null);
    setUsernameSuccess(null);

    if (newUsername.trim() === user.username) {
      setUsernameSuccess(isAr ? 'لم يطرأ أي تغيير على الاسم' : 'No changes made');
      return;
    }

    setUsernameLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_username',
          newUsername: newUsername.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isAr ? 'فشل تحديث الاسم' : 'Failed to update username'));
      }

      onUserUpdated(data.user);
      setUsernameSuccess(isAr ? 'تم تحديث اسم المستخدم بنجاح!' : 'Username updated successfully!');
      setTimeout(() => setCurrentScreen('main'), 1000);
    } catch (err: any) {
      setUsernameError(err.message);
    } finally {
      setUsernameLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError(isAr ? 'يجب ألا تقل كلمة المرور عن 6 خانات' : 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isAr ? 'فشل تغيير كلمة المرور' : 'Failed to change password'));
      }

      setPasswordSuccess(isAr ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setCurrentScreen('main'), 1200);
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-7 overflow-hidden max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ==================================================================== */}
        {/* SCREEN 1: MAIN PROFILE VIEW */}
        {/* ==================================================================== */}
        {currentScreen === 'main' && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-bear-500/15 border border-bear-500/30 flex items-center justify-center text-bear-600 dark:text-bear-400 font-black text-lg shadow-xs">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base sm:text-lg text-stone-900 dark:text-white">
                      {user.username}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {isAr ? 'عضو نشط' : 'Active Member'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {isAr ? 'إدارة بيانات حسابك وسجل جلساتك' : 'Manage your profile and session'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Details Box */}
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{isAr ? 'اسم الحساب:' : 'Username:'}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{user.username}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{isAr ? 'مزامنة المحادثات:' : 'Cloud Sync:'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{isAr ? 'مفعلة سحابياً' : 'Enabled'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{isAr ? 'مزامنة المفضلة:' : 'Favorites Sync:'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{isAr ? 'متصلة بالحساب' : 'Connected'}</span>
              </div>
            </div>

            {/* Action Buttons: Edit Username & Change Password */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={() => setCurrentScreen('username')}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-bear-500/50 hover:bg-bear-50/50 dark:hover:bg-bear-950/30 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all shadow-2xs group"
              >
                <User className="w-4 h-4 text-bear-600 group-hover:scale-110 transition-transform" />
                <span>{isAr ? 'تعديل الاسم' : 'Edit Username'}</span>
              </button>
              <button
                onClick={() => setCurrentScreen('password')}
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-bear-500/50 hover:bg-bear-50/50 dark:hover:bg-bear-950/30 text-stone-700 dark:text-stone-200 text-xs font-bold transition-all shadow-2xs group"
              >
                <KeyRound className="w-4 h-4 text-bear-600 group-hover:scale-110 transition-transform" />
                <span>{isAr ? 'تغيير كلمة المرور' : 'Change Password'}</span>
              </button>
            </div>

            {/* Sign Out Button */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 dark:border-red-950 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>{isAr ? 'تسجيل الخروج من الحساب' : 'Sign Out'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SCREEN 2: EDIT USERNAME */}
        {/* ==================================================================== */}
        {currentScreen === 'username' && (
          <form onSubmit={handleUpdateUsername} className="space-y-4">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setCurrentScreen('main')}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-bear-600 transition-colors"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isAr ? 'رجوع' : 'Back'}</span>
              </button>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                {isAr ? 'تعديل اسم المستخدم' : 'Edit Username'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {usernameError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{usernameError}</span>
              </div>
            )}
            {usernameSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{usernameSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                {isAr ? 'اسم المستخدم الجديد' : 'New Username'}
              </label>
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 right-3 ltr:left-3 ltr:right-auto w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-9 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-base sm:text-xs font-medium focus:ring-2 focus:ring-bear-500 focus:outline-hidden transition-all"
                  required
                  minLength={3}
                  maxLength={25}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCurrentScreen('main')}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={usernameLoading}
                className="flex-1 py-2.5 rounded-xl bg-bear-600 hover:bg-bear-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {usernameLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isAr ? 'حفظ التعديل' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* SCREEN 3: CHANGE PASSWORD (Frictionless - No Current Password Needed) */}
        {/* ==================================================================== */}
        {currentScreen === 'password' && (
          <form onSubmit={handleUpdatePassword} className="space-y-3.5">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setCurrentScreen('main')}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-bear-600 transition-colors"
              >
                {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                <span>{isAr ? 'رجوع' : 'Back'}</span>
              </button>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-white">
                {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div className="relative">
                <KeyRound className="absolute top-1/2 -translate-y-1/2 right-3 ltr:left-3 ltr:right-auto w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isAr ? 'أدخل كلمة مرور جديدة (6 خانات على الأقل)' : 'At least 6 characters'}
                  className="w-full px-9 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-base sm:text-xs font-medium focus:ring-2 focus:ring-bear-500 focus:outline-hidden transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <KeyRound className="absolute top-1/2 -translate-y-1/2 right-3 ltr:left-3 ltr:right-auto w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={isAr ? 'أعد كتابة كلمة المرور للتأكيد' : 'Re-enter your new password'}
                  className="w-full px-9 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-base sm:text-xs font-medium focus:ring-2 focus:ring-bear-500 focus:outline-hidden transition-all"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCurrentScreen('main')}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex-1 py-2.5 rounded-xl bg-bear-600 hover:bg-bear-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                {passwordLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isAr ? 'حفظ كلمة المرور' : 'Save Password'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
