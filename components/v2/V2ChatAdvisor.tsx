'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  Bot,
  User as UserIcon,
  BookOpen,
  X,
  Compass,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  Loader2,
  CornerDownLeft,
} from 'lucide-react';
import { marked } from 'marked';
import { Article } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { AVAILABLE_MODELS } from '@/lib/models';
import { FounderChallenge, V2Message } from './types';

interface V2ChatAdvisorProps {
  lang: 'ar' | 'en';
  user: AuthUser | null;
  onOpenAuth: () => void;
  activeChallenge: FounderChallenge;
  selectedModel: string;
  contextArticle: Article | null;
  onClearContextArticle: () => void;
  onSelectArticleBySlug: (slug: string) => void;
  allArticles: Article[];
}

export default function V2ChatAdvisor({
  lang,
  user,
  onOpenAuth,
  activeChallenge,
  selectedModel,
  contextArticle,
  onClearContextArticle,
  onSelectArticleBySlug,
  allArticles,
}: V2ChatAdvisorProps) {
  const isAr = lang === 'ar';
  const [messages, setMessages] = useState<V2Message[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModelObj =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[3];

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? inputQuery).trim();
    if (!query || loading) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    const tempUserMsg: V2Message = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          modelId: selectedModel,
          conversationId,
          contextArticle: contextArticle
            ? {
                title_en: contextArticle.title_en,
                title_ar: contextArticle.title_ar,
                slug: contextArticle.slug,
                summary_en: contextArticle.summary_en,
                summary_ar: contextArticle.summary_ar,
                category_en: contextArticle.category_en,
                category_ar: contextArticle.category_ar,
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
        if (data.conversationId) {
          setConversationId(data.conversationId);
        }

        const assistantMsg: V2Message = {
          id: `ast_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          created_at: new Date().toISOString(),
          model_used: data.modelUsed,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorMsg: V2Message = {
          id: `err_${Date.now()}`,
          role: 'assistant',
          content: isAr
            ? `⚠️ معذرة، حدث خطأ: ${data.error || 'يرجى المحاولة مرة أخرى.'}`
            : `⚠️ Sorry, an error occurred: ${data.error || 'Please try again.'}`,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: any) {
      const networkErrorMsg: V2Message = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: isAr
          ? '⚠️ تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والضغط على إعادة المحاولة.'
          : '⚠️ Unable to connect to server. Please check your network and retry.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm(isAr ? 'هل تريد بدء استشارة جديدة ومسح الرسائل الحالية؟' : 'Start a fresh consultation?')) {
      setMessages([]);
      setConversationId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-stone-50/50 dark:bg-[#0c0d14]/50 rounded-3xl border border-stone-200/80 dark:border-stone-800/80 shadow-sm overflow-hidden relative">
      {/* Strategic Challenge Header Banner */}
      <div className="p-4 sm:p-5 border-b border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl sm:text-3xl p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 shadow-xs shrink-0">
            {activeChallenge.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base sm:text-lg text-stone-900 dark:text-white">
                {isAr ? activeChallenge.title_ar : activeChallenge.title_en}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hidden sm:inline">
                {currentModelObj.name}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
              {isAr ? activeChallenge.subtitle_ar : activeChallenge.subtitle_en}
            </p>
          </div>
        </div>

        {/* Clear / New Session Button */}
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-red-500/40 text-stone-500 hover:text-red-600 dark:text-stone-400 text-xs font-bold transition-all shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'جلسة جديدة' : 'New Session'}</span>
          </button>
        )}
      </div>

      {/* Pinned Context Article Badge */}
      {contextArticle && (
        <div className="px-4 py-2 bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/25 flex items-center justify-between gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 truncate">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="shrink-0">{isAr ? 'السياق المرجعي المقيد:' : 'Pinned Article Context:'}</span>
            <span className="underline truncate">
              {isAr ? contextArticle.title_ar : contextArticle.title_en}
            </span>
          </div>
          <button
            onClick={onClearContextArticle}
            className="p-1 rounded-lg hover:bg-amber-500/20 text-amber-700 dark:text-amber-300"
            title={isAr ? 'إزالة السياق المقيد' : 'Remove Pinned Context'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Messages & Advisor Dialogue Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          /* High-Impact Executive Welcome & Quick Prompts */
          <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-8 animate-in fade-in duration-300">
            {/* Persona Introduction */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-bear-600 to-amber-500 text-white text-3xl shadow-xl shadow-bear-600/20 mb-2">
                🐻
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white">
                {isAr
                  ? 'مرحباً، أنا جيسون كوهين. ما هو التحدي الاستراتيجي الذي يواجهك؟'
                  : "Hello, I'm Jason Cohen. What strategic hurdle are you tackling?"}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl mx-auto">
                {isAr
                  ? activeChallenge.description_ar
                  : activeChallenge.description_en}
              </p>

              {/* Primary Metric Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bear-50 dark:bg-bear-950/60 border border-bear-500/30 text-bear-800 dark:text-bear-200 text-xs font-black shadow-xs">
                <TrendingUp className="w-3.5 h-3.5 text-bear-600 dark:text-bear-400" />
                <span>
                  {isAr ? activeChallenge.primaryMetric_ar : activeChallenge.primaryMetric_en}
                </span>
              </div>
            </div>

            {/* Quick Strategic Prompts Grid */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-stone-400 dark:text-stone-500 uppercase tracking-wider px-1">
                <Compass className="w-3.5 h-3.5" />
                <span>{isAr ? 'أسئلة وتحديات فورية موجهة لجيسون' : 'Direct Strategic Prompts for Jason'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeChallenge.quickPrompts.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSendMessage(isAr ? item.prompt_ar : item.prompt_en)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200/90 dark:border-stone-800/90 hover:border-bear-500/50 hover:bg-bear-50/30 dark:hover:bg-bear-950/20 text-start group transition-all shadow-xs flex flex-col justify-between gap-2"
                  >
                    <span className="text-xs font-black text-stone-800 dark:text-stone-200 group-hover:text-bear-600 dark:group-hover:text-bear-400 transition-colors">
                      {isAr ? item.label_ar : item.label_en}
                    </span>
                    <div className="flex items-center justify-between text-[11px] text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300">
                      <span>{isAr ? 'بدء الاستشارة' : 'Launch prompt'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Render Active Message Threads */
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 sm:gap-4 ${
                  isUser ? 'flex-row-reverse' : 'flex-row'
                } animate-in fade-in duration-200`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-sm font-black shadow-xs ${
                    isUser
                      ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900'
                      : 'bg-gradient-to-br from-bear-600 to-amber-600 text-white'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : '🐻'}
                </div>

                {/* Message Bubble Container */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 shadow-xs relative group ${
                    isUser
                      ? 'bg-bear-600 text-white rounded-tr-xs'
                      : 'bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800/90 text-stone-800 dark:text-stone-100 rounded-tl-xs'
                  }`}
                >
                  {/* Assistant Meta & Actions */}
                  {!isUser && (
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800/80 text-[11px] text-stone-400">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span className="text-stone-700 dark:text-stone-300">
                          {isAr ? 'جيسون كوهين (مستشار الدب الذكي)' : 'Jason Cohen'}
                        </span>
                        {msg.model_used && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-mono">
                            {msg.model_used}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                        title={isAr ? 'نسخ الإجابة' : 'Copy answer'}
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Body Content */}
                  {isUser ? (
                    <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                      {msg.content}
                    </p>
                  ) : (
                    <MarkdownBody content={msg.content} isAr={isAr} />
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex gap-3 items-center animate-in fade-in duration-200">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-bear-600 to-amber-600 text-white flex items-center justify-center text-sm shadow-xs">
              🐻
            </div>
            <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center gap-3 text-xs font-bold text-stone-500 dark:text-stone-400">
              <Loader2 className="w-4 h-4 animate-spin text-bear-600" />
              <span>
                {isAr
                  ? 'جيسون يستحضر النماذج الفكرية ويصيغ المشورة...'
                  : 'Jason is synthesizing mental models & crafting advice...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Strategic Composer */}
      <div className="p-3 sm:p-4 border-t border-stone-200/80 dark:border-stone-800/80 bg-white/90 dark:bg-[#0c0d14]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto">
          {!user ? (
            <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>
                  {isAr
                    ? 'سجّل دخولك الآن للتحدث بحرية مع جيسون كوهين وحفظ استشاراتك الاستراتيجية بأمان.'
                    : 'Sign in to consult with Jason Cohen and save your executive sessions.'}
                </span>
              </div>
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-xs shrink-0"
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            </div>
          ) : (
            <div className="relative rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700/80 shadow-md focus-within:border-bear-500 dark:focus-within:border-bear-500 transition-all p-2 flex flex-col gap-2">
              <textarea
                ref={textareaRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isAr
                    ? `اطرح سؤالاً أو استشارة استراتيجية على جيسون كوهين... (اضغط Enter للإرسال)`
                    : `Ask Jason Cohen a candid strategic question... (Press Enter to send)`
                }
                rows={2}
                className="w-full bg-transparent border-0 resize-none outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 p-1.5 max-h-32"
              />

              <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800/80 pt-1.5 px-1">
                <div className="flex items-center gap-2 text-[11px] text-stone-400">
                  <span className="hidden sm:inline">
                    {isAr ? 'Shift + Enter لسطر جديد' : 'Shift + Enter for new line'}
                  </span>
                </div>

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim() || loading}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all shadow-xs ${
                    inputQuery.trim() && !loading
                      ? 'bg-bear-600 hover:bg-bear-700 text-white shadow-bear-600/20 active:scale-95'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <span>{isAr ? 'استشر جيسون' : 'Send'}</span>
                  <Send className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Markdown Formatter for Assistant Dialogue
function MarkdownBody({ content, isAr }: { content: string; isAr: boolean }) {
  const html = useMemo(() => {
    if (!content) return '';
    try {
      const renderer = new marked.Renderer();
      marked.setOptions({
        gfm: true,
        breaks: true,
        renderer,
      });
      return marked.parse(content) as string;
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
