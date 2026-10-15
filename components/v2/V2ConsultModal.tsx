'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Send,
  X,
  BookOpen,
  Copy,
  Check,
  Loader2,
  User as UserIcon,
  ShieldAlert,
} from 'lucide-react';
import { marked } from 'marked';
import { Article } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { BentoItem } from './bentoData';

interface V2ConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  user: AuthUser | null;
  onOpenAuth: () => void;
  bentoItem: BentoItem | null;
  article: Article | null;
  selectedModel: string;
}

interface MiniMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function V2ConsultModal({
  isOpen,
  onClose,
  lang,
  user,
  onOpenAuth,
  bentoItem,
  article,
  selectedModel,
}: V2ConsultModalProps) {
  const isAr = lang === 'ar';
  const [messages, setMessages] = useState<MiniMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset or initialize on open with bento item
  useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setConversationId(null);
      const defaultPrompt = isAr
        ? `كيف أطبق مبدأ "${bentoItem?.title_ar || article?.title_ar || ''}" على مشروعي الناشئ عملياً؟`
        : `How do I practically apply "${bentoItem?.title_en || article?.title_en || ''}" to my startup today?`;
      setInputQuery(defaultPrompt);
    }
  }, [isOpen, bentoItem, article, isAr]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const query = (customText ?? inputQuery).trim();
    if (!query || loading) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    const userMsg: MiniMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          modelId: selectedModel,
          conversationId,
          contextArticle: article
            ? {
                title_en: article.title_en,
                title_ar: article.title_ar,
                slug: article.slug,
                summary_en: article.summary_en,
                summary_ar: article.summary_ar,
                category_en: article.category_en,
                category_ar: article.category_ar,
              }
            : bentoItem
            ? {
                title_en: bentoItem.title_en,
                title_ar: bentoItem.title_ar,
                slug: bentoItem.slug,
                summary_en: bentoItem.subtitle_en,
                summary_ar: bentoItem.subtitle_ar,
                category_en: bentoItem.category_en,
                category_ar: bentoItem.category_ar,
              }
            : undefined,
        }),
      });

      const data = await response.json();

      if (data.requiresAuth) {
        onOpenAuth();
        setLoading(false);
        return;
      }

      if (data.success) {
        if (data.conversationId) setConversationId(data.conversationId);
        const botMsg: MiniMessage = {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'assistant',
            content: `⚠️ ${data.error || (isAr ? 'حدث خطأ' : 'Error occurred')}`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: isAr ? '⚠️ تعذر الاتصال بالخادم.' : '⚠️ Connection failed.',
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-900/60 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#11131c] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-50/80 dark:bg-stone-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-bear-600 to-amber-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              🐻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm sm:text-base text-stone-900 dark:text-white">
                  {isAr ? 'استشارة استراتيجية مع جيسون كوهين' : 'Consult Jason Cohen'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  {isAr ? 'مستشار تنفيذي' : 'Executive Advisor'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                {bentoItem
                  ? isAr
                    ? bentoItem.title_ar
                    : bentoItem.title_en
                  : article
                  ? isAr
                    ? article.title_ar
                    : article.title_en
                  : isAr
                  ? 'حول النماذج الفكرية لريادة الأعمال'
                  : 'On Startup Mental Models'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-6 sm:py-8 space-y-3">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-1">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-sm font-black text-stone-900 dark:text-white">
                {isAr
                  ? 'لديك سؤال أو تحدٍ محدد حول هذا المفهوم؟'
                  : 'Have a specific question about this mental model?'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                {isAr
                  ? 'جيسون سيرد عليك بمنهجيته الصريحة والمستندة إلى تجاربه الحقيقية في تأسيس WP Engine و Smart Bear.'
                  : 'Jason will answer using his battle-tested frameworks from building WP Engine and Smart Bear.'}
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                        : 'bg-bear-600 text-white'
                    }`}
                  >
                    {isUser ? <UserIcon className="w-3.5 h-3.5" /> : '🐻'}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm shadow-xs ${
                      isUser
                        ? 'bg-bear-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800/80 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700/60'
                    }`}
                  >
                    {!isUser && (
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200/60 dark:border-stone-700/60">
                        <span className="text-[10px] font-bold text-stone-500">
                          {isAr ? 'جيسون كوهين' : 'Jason Cohen'}
                        </span>
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    ) : (
                      <ConsultMarkdown content={m.content} />
                    )}
                  </div>
                </div>
              );
            })
          )}

          {loading && (
            <div className="flex gap-2.5 items-center text-xs font-bold text-stone-500 p-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-bear-600" />
              <span>{isAr ? 'جيسون يكتب الرد الاستراتيجي...' : 'Jason is formulating strategic advice...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Composer */}
        <div className="p-3 sm:p-4 border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-50/60 dark:bg-stone-900/60">
          {!user ? (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
              <span className="text-xs text-amber-900 dark:text-amber-200 font-bold">
                {isAr
                  ? 'سجل دخولك للحصول على استشارة كاملة'
                  : 'Sign in to consult with Jason'}
              </span>
              <button
                onClick={onOpenAuth}
                className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-black"
              >
                {isAr ? 'دخول' : 'Sign In'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <textarea
                ref={textareaRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder={isAr ? 'اكتب استشارتك...' : 'Ask your strategic question...'}
                className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 outline-none focus:border-bear-500 resize-none max-h-24"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputQuery.trim() || loading}
                className={`p-2.5 rounded-xl font-bold transition-all shadow-xs ${
                  inputQuery.trim() && !loading
                    ? 'bg-bear-600 text-white hover:bg-bear-700 shadow-bear-600/20 active:scale-95'
                    : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                }`}
              >
                <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConsultMarkdown({ content }: { content: string }) {
  const html = useMemo(() => {
    try {
      return marked.parse(content, { gfm: true }) as string;
    } catch {
      return `<p>${content}</p>`;
    }
  }, [content]);

  return (
    <div
      className="prose-bear text-xs sm:text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
