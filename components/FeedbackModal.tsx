'use client';

import React, { useState } from 'react';
import { X, Bug, Lightbulb, FileText, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  initialError?: string | null;
  initialCategory?: 'bug' | 'suggestion' | 'content';
}

export default function FeedbackModal({
  isOpen,
  onClose,
  lang,
  initialError = null,
  initialCategory = 'bug',
}: FeedbackModalProps) {
  const [category, setCategory] = useState<'bug' | 'suggestion' | 'content'>(initialCategory);
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError(isAr ? 'يرجى كتابة وصف المشكلة أو الملاحظة.' : 'Please write your feedback message.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message: message.trim(),
          contactInfo: contactInfo.trim() || undefined,
          errorDetails: initialError || undefined,
          pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (isAr ? 'فشل إرسال البلاغ.' : 'Failed to submit report.'));
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        setContactInfo('');
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || (isAr ? 'حدث خطأ في الاتصال.' : 'Connection error.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-7 overflow-hidden"
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

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bear-50 dark:bg-bear-950 text-bear-700 dark:text-bear-300 text-xs font-bold border border-bear-500/20 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isAr ? 'مركز مساعدة وتواصل المطورين' : 'Developer Feedback & Bug Center'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
            {isAr ? 'إبلاغ عن مشكلة أو اقتراح تحسين' : 'Report an Issue or Suggestion'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {isAr
              ? 'صوتك يصل فوراً لفريق التطوير لمتابعة المشكلة وحلها بأسرع وقت.'
              : 'Your report goes directly to the development team for rapid resolution.'}
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/20 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-stone-900 dark:text-white">
              {isAr ? 'تم استلام بلاغك بنجاح!' : 'Report Sent Successfully!'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              {isAr
                ? 'شكراً جزيلاً لحرصك ومساعدتنا في تحسين تجربة المستشار الذكي. سيتم مراجعة الملاحظة فوراً.'
                : 'Thank you for helping us improve A Smart Bear Advisor. Your report is being reviewed.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('bug')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'bug'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300 shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 text-stone-600 dark:text-stone-400 hover:border-rose-400/50'
                }`}
              >
                <Bug className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{isAr ? 'مشكلة فنية' : 'Bug Report'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('suggestion')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'suggestion'
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-300 shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 text-stone-600 dark:text-stone-400 hover:border-amber-400/50'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{isAr ? 'اقتراح فكرة' : 'Suggestion'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('content')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'content'
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-2xs'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/80 text-stone-600 dark:text-stone-400 hover:border-blue-400/50'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{isAr ? 'ملاحظة مقال' : 'Content/Typo'}</span>
              </button>
            </div>

            {/* Error Details Alert if captured */}
            {initialError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {isAr ? 'تم رصد تفاصيل الخطأ تلقائياً وإرفاقها:' : 'Captured error details:'}
                </span>
                <p className="font-mono text-[11px] truncate opacity-80">{initialError}</p>
              </div>
            )}

            {/* Message Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
                {isAr ? 'وصف المشكلة أو الملاحظة *' : 'Description *'}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  category === 'bug'
                    ? isAr
                      ? 'ما الذي حدث معك؟ أين ظهرت المشكلة؟'
                      : 'What happened? Where did the issue occur?'
                    : isAr
                    ? 'شاركنا فكرتك أو تحسين تود رؤيته في المنصة...'
                    : 'Share your suggestion or feature request...'
                }
                rows={4}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-stone-900 dark:text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-bear-500/30 focus:border-bear-500 resize-none transition-all"
              />
            </div>

            {/* Optional Contact Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
                <span>{isAr ? 'وسيلة تواصل (اختياري)' : 'Contact Info (Optional)'}</span>
                <span className="text-[10px] text-stone-400 font-normal">
                  {isAr ? 'إيميل أو يوزر تيليجرام' : 'Email or Telegram'}
                </span>
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder={isAr ? 'مثال: @username أو user@email.com' : 'e.g. @username or user@email.com'}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/80 text-stone-900 dark:text-white placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-bear-500/30 focus:border-bear-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bear-600 hover:bg-bear-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-bear-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isAr ? 'جاري الإرسال...' : 'Sending...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إرسال البلاغ' : 'Send Report'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
