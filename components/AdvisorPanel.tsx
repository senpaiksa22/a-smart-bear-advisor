'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Trash2,
  Plus,
  Download,
  Copy,
  Check,
  ChevronDown,
  X,
  MessageSquare,
  Bot,
  User as UserIcon,
  BookOpen,
  Info,
  ShieldCheck,
  History,
  AlertCircle,
  ExternalLink,
  Bug,
} from 'lucide-react';
import { Article } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { AVAILABLE_MODELS, ModelOption } from '@/lib/models';
import { marked } from 'marked';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  model_used?: string;
}

interface Conversation {
  id: string;
  title: string;
  model_used: string;
  created_at: string;
  updated_at: string;
}

interface AdvisorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  user: AuthUser | null;
  onOpenAuth: () => void;
  contextArticle?: Article | null;
  onClearContext?: () => void;
  onOpenFeedback?: (errorText?: string) => void;
  articles?: Article[];
  onSelectArticle?: (article: Article) => void;
}

export default function AdvisorPanel({
  isOpen,
  onClose,
  lang,
  user,
  onOpenAuth,
  contextArticle,
  onClearContext,
  onOpenFeedback,
  articles = [],
  onSelectArticle,
}: AdvisorPanelProps) {
  const isAr = lang === 'ar';

  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [modelDropdownOpen, setModelDropdownOpen] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [historySidebarOpen, setHistorySidebarOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);
  const [isDeletingConv, setIsDeletingConv] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModelObj =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[1];

  // Prevent background scrolling when advisor modal is open (Robust iOS & Android lock)
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

  // Load conversations when user logs in or panel opens
  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    } else if (!user) {
      setConversations([]);
      setMessages([]);
      setActiveConversationId(null);
    }
  }, [isOpen, user]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      if (data.success && data.conversations) {
        setConversations(data.conversations);
      }
    } catch (e) {
      console.error('Error fetching conversations:', e);
    }
  };

  const selectConversation = async (convId: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(`/api/conversations/${convId}`);
      const data = await res.json();
      if (data.success) {
        setActiveConversationId(convId);
        setMessages(data.messages || []);
        if (data.conversation?.model_used) {
          setSelectedModel(data.conversation.model_used);
        }
        setHistorySidebarOpen(false);
      }
    } catch (e) {
      console.error('Error loading conversation:', e);
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setErrorMessage(null);
    setHistorySidebarOpen(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const promptDeleteConv = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversationToDelete(conv);
  };

  const confirmDeleteConv = async () => {
    if (!conversationToDelete || isDeletingConv) return;
    const convId = conversationToDelete.id;
    setIsDeletingConv(true);
    try {
      const res = await fetch(`/api/conversations/${convId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setConversations((prev) => prev.filter((c) => c.id !== convId));
        if (activeConversationId === convId) {
          startNewConversation();
        }
        setConversationToDelete(null);
      }
    } catch (e) {
      console.error('Error deleting conversation:', e);
    } finally {
      setIsDeletingConv(false);
    }
  };

  const handleSendMessage = async (customQuery?: string) => {
    const queryToSend = customQuery || inputQuery;
    if (!queryToSend.trim() || loading) return;

    if (!user) {
      onOpenAuth();
      return;
    }

    setErrorMessage(null);
    const userMsgText = queryToSend.trim();
    setInputQuery('');

    // Optimistic UI for user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: userMsgText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsgText,
          modelId: selectedModel,
          conversationId: activeConversationId || undefined,
          contextArticle: contextArticle
            ? {
                title_ar: contextArticle.title_ar,
                title_en: contextArticle.title_en,
                summary_ar: contextArticle.summary_ar,
                summary_en: contextArticle.summary_en,
                slug: contextArticle.slug,
                url: contextArticle.url,
              }
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل الاتصال بالمستشار الذكي.');
      }

      // Update active conversation ID if newly created
      if (!activeConversationId && data.conversationId) {
        setActiveConversationId(data.conversationId);
        loadConversations();
      }

      // Append assistant message
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err.message || (isAr ? 'حدث خطأ في الرد' : 'Error in advisor response'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportConversationMarkdown = () => {
    if (messages.length === 0) return;

    const convTitle =
      conversations.find((c) => c.id === activeConversationId)?.title ||
      (isAr ? 'استشارة جيسون كوهين' : 'Jason Cohen Advisory Session');

    let md = `# ${convTitle}\n\n`;
    md += `> **A Smart Bear Advisor** — Jason Cohen AI Consultant\n`;
    md += `> **Model:** ${currentModelObj.name} (${selectedModel})\n`;
    md += `> **Date:** ${new Date().toLocaleString()}\n`;
    if (contextArticle) {
      md += `> **Consulting Principle:** [${isAr ? contextArticle.title_ar : contextArticle.title_en}](${contextArticle.url})\n`;
    }
    md += `\n---\n\n`;

    messages.forEach((msg) => {
      const speaker =
        msg.role === 'user'
          ? isAr
            ? `👤 رائد الأعمال (${user?.username || 'أنت'})`
            : `👤 Founder (${user?.username || 'You'})`
          : `🐻 جيسون كوهين (Jason Cohen)`;

      md += `### ${speaker} — *${new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}*\n\n`;
      md += `${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `A_Smart_Bear_Consultation_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Quick Starter Questions
  const starterQuestions = isAr
    ? [
        {
          label: 'ملاءمة المنتج والسوق (PMF)',
          query: 'كيف أتحقق بطريقة علمية وصادقة من وصول مشروعي لمرحلة ملاءمة المنتج للسوق (Product/Market Fit)؟',
        },
        {
          label: 'مفارقة الكفاءة والاستقلالية',
          query: 'ما هي مفارقة الكفاءة مقابل الاستقلالية (Efficiency vs Autonomy) وكيف تطبقها في إدارة الفريق؟',
        },
        {
          label: 'تسعير البرمجيات والقيمة (WTP)',
          query: 'كيف أضع استراتيجية تسعير لمنتج SaaS تعتمد على استعداد العميل للدفع (WTP) دون خوف من خسارة العملاء؟',
        },
        {
          label: 'تجنب الحماقات القاتلة (80%)',
          query: 'اشرح لي كيف أن 80% من نجاح ريادة الأعمال يكمن في تجنب الأخطاء الفادحة والحماقات بدلاً من ملاحقة العبقرية؟',
        },
      ]
    : [
        {
          label: 'Product/Market Fit (PMF)',
          query: 'How can I measure and validate real Product/Market Fit without lying to myself?',
        },
        {
          label: 'Efficiency vs Autonomy',
          query: 'Can you explain the paradox of Efficiency vs Autonomy and how to design company culture around it?',
        },
        {
          label: 'SaaS Value Pricing & WTP',
          query: 'How should I structure SaaS pricing around Willingness To Pay (WTP) without fearing customer churn?',
        },
        {
          label: 'Avoid Blundering (80% Rule)',
          query: 'Why does 80% of entrepreneurial success come from avoiding fatal blunders rather than seeking genius moves?',
        },
      ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div
        className="relative w-full max-w-5xl h-[100dvh] sm:h-[92vh] sm:max-h-[850px] rounded-none sm:rounded-2xl shadow-2xl border-0 sm:border flex flex-col overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border-subtle)',
          color: 'var(--foreground)',
        }}
      >
        {/* ==================================================================== */}
        {/* HEADER BAR */}
        {/* ==================================================================== */}
        <div
          className="px-3 sm:px-4 py-2.5 sm:py-3 border-b flex items-center justify-between gap-2 transition-colors duration-200"
          style={{
            backgroundColor: 'var(--surface-primary)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {/* Brand & Persona Badge */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
              className="p-1.5 sm:p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors relative shrink-0"
              title={isAr ? 'سجل المحادثات' : 'Chat History'}
            >
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
              {conversations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-bear-600 text-white text-[9px] sm:text-[10px] rounded-full flex items-center justify-center font-bold">
                  {conversations.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-bear-700 to-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-white leading-normal pb-0.5 whitespace-nowrap">
                    {isAr ? 'جيسون كوهين' : 'Jason Cohen'}
                  </h2>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-bear-100 dark:bg-bear-950 text-bear-700 dark:text-bear-300 border border-bear-500/20 whitespace-nowrap">
                    A Smart Bear
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 hidden md:block whitespace-nowrap">
                  {isAr
                    ? 'استشارات ريادية استراتيجية مستخلصة من 213 مقال وخبرة 4 شركات'
                    : 'Tactical founder advice distilled from 213 essays & 4 exits'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Export Markdown Button */}
            {messages.length > 0 && (
              <button
                onClick={exportConversationMarkdown}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-1.5 shrink-0"
                title={isAr ? 'تصدير كملف Markdown' : 'Export as Markdown'}
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-500" />
                <span className="hidden sm:inline">{isAr ? 'تصدير' : 'Export'}</span>
              </button>
            )}

            {/* New Chat Button */}
            <button
              onClick={startNewConversation}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium bg-bear-50 dark:bg-bear-950/50 text-bear-700 dark:text-bear-300 hover:bg-bear-100 dark:hover:bg-bear-900/60 transition-colors flex items-center gap-1 shrink-0"
              title={isAr ? 'محادثة جديدة' : 'New Chat'}
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isAr ? 'جديدة' : 'New'}</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors shrink-0"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* BODY (HISTORY SIDEBAR + CHAT AREA) */}
        {/* ==================================================================== */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* History Sidebar */}
          {historySidebarOpen && (
            <div
              className={`absolute sm:relative z-20 top-0 bottom-0 w-72 border-inline-end flex flex-col p-3 transition-all duration-200 shadow-xl sm:shadow-none ${
                isAr ? 'right-0' : 'left-0'
              }`}
              style={{
                backgroundColor: 'var(--surface-secondary)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-bear-600" />
                  {isAr ? 'سجل المحادثات السابقة' : 'Previous Chats'}
                </span>
                <button
                  onClick={() => setHistorySidebarOpen(false)}
                  className="sm:hidden text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5">
                {conversations.length === 0 ? (
                  <p className="text-xs text-stone-400 text-center py-6">
                    {isAr ? 'لا توجد محادثات سابقة حتى الآن' : 'No previous conversations yet'}
                  </p>
                ) : (
                  conversations.map((c) => {
                    const isActive = c.id === activeConversationId;
                    return (
                      <div
                        key={c.id}
                        onClick={() => selectConversation(c.id)}
                        className={`group p-2.5 rounded-xl cursor-pointer text-xs transition-all flex items-center justify-between gap-2 ${
                          isActive
                            ? 'bg-bear-100/70 dark:bg-bear-950/70 border border-bear-500/30 font-semibold text-bear-900 dark:text-bear-200'
                            : 'hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex-1 truncate">
                          <p className="truncate">{c.title}</p>
                          <span className="text-[10px] text-stone-400 block mt-0.5">
                            {new Date(c.updated_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <button
                          onClick={(e) => promptDeleteConv(c, e)}
                          className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 p-1 transition-opacity"
                          title={isAr ? 'حذف المحادثة' : 'Delete'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Chat Messages Section */}
          <div
            className="flex-1 flex flex-col overflow-hidden transition-colors duration-200"
            style={{
              backgroundColor: 'var(--background)',
            }}
          >
            {/* Active Consulting Context Banner (if triggered by article) */}
            {contextArticle && (
              <div className="px-4 py-2 bg-gradient-to-r from-bear-50 to-amber-50/50 dark:from-bear-950/50 dark:to-stone-900 border-b border-bear-200/50 dark:border-bear-800/50 flex items-center justify-between text-xs text-bear-900 dark:text-bear-200">
                <div className="flex items-center gap-2 overflow-hidden">
                  <BookOpen className="w-4 h-4 text-bear-600 flex-shrink-0" />
                  <span className="font-semibold text-bear-700 dark:text-bear-300 flex-shrink-0">
                    {isAr ? 'المبدأ الاستشاري المفعّل:' : 'Active Principle Context:'}
                  </span>
                  <span className="font-bold truncate">
                    {isAr ? contextArticle.title_ar : contextArticle.title_en}
                  </span>
                </div>
                {onClearContext && (
                  <button
                    onClick={onClearContext}
                    className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors flex-shrink-0"
                    title={isAr ? 'إلغاء قيد المبدأ' : 'Clear principle filter'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Error Message Pill */}
            {errorMessage && (
              <div className="mx-4 mt-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-500/20 text-xs text-red-700 dark:text-red-300 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span className="truncate">{errorMessage}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenFeedback && (
                    <button
                      onClick={() => onOpenFeedback(errorMessage)}
                      className="px-2 py-0.5 rounded-lg bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200 font-bold hover:bg-red-200 transition-colors text-[11px]"
                    >
                      {isAr ? 'أبلغ المطورين فوراً' : 'Report this'}
                    </button>
                  )}
                  <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600 p-0.5">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {messages.length === 0 ? (
                /* Empty State with Starter Prompts */
                <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-6">
                  <div className="w-14 h-14 rounded-2xl bg-bear-100 dark:bg-bear-950 text-bear-600 dark:text-bear-400 flex items-center justify-center mb-4 shadow-sm">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                    {isAr
                      ? 'مرحباً، أنا جيسون كوهين — مستشارك الاستراتيجي'
                      : 'Hello, I am Jason Cohen — your tactical startup advisor'}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-6 max-w-md">
                    {isAr
                      ? 'اطرح عليّ أي معضلة تواجهك في نموذج العمل، التسعير، أو بناء ثقافة الفريق. سأجيبك بصرامة ومباشرة اعتماداً على مبادئ مدونة A Smart Bear.'
                      : 'Ask me any dilemma about business models, value pricing, product strategy, or company culture. I will advise you directly based on A Smart Bear principles.'}
                  </p>

                  {/* Starter Quick Chips */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-start">
                    {starterQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q.query)}
                        className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-bear-500 hover:bg-stone-50 dark:hover:bg-stone-800/60 transition-all text-xs group"
                      >
                        <span className="font-bold text-bear-700 dark:text-bear-400 block mb-1 group-hover:translate-x-0.5 transition-transform">
                          {q.label}
                        </span>
                        <span className="text-stone-600 dark:text-stone-400 line-clamp-2">
                          {q.query}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Message Cards */
                messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  const isCopied = copiedId === msg.id;

                  return (
                    isUser ? (
                      /* User Message */
                      <div
                        key={msg.id || index}
                        className="w-full flex flex-col gap-1.5 animate-in fade-in duration-150"
                      >
                        <div className="flex items-center justify-between gap-2 px-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-stone-800 dark:bg-stone-700 text-stone-100 flex items-center justify-center shrink-0 shadow-xs">
                              <UserIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                              {user?.username || (isAr ? 'أنت' : 'You')}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bear-500/15 text-bear-800 dark:text-bear-300 border border-bear-500/30 whitespace-nowrap">
                              {isAr ? 'سؤالك' : 'Your Question'}
                            </span>
                          </div>
                          <span className="text-stone-400 text-[10px] shrink-0 font-mono">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="rounded-2xl text-xs sm:text-sm leading-relaxed p-4 bg-bear-50/80 dark:bg-bear-950/40 border border-bear-200/90 dark:border-bear-800/80 text-stone-900 dark:text-stone-100 shadow-2xs font-medium whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      /* Assistant Message (Jason Cohen) */
                      <div
                        key={msg.id || index}
                        className="w-full flex flex-col gap-1.5 animate-in fade-in duration-150"
                      >
                        <div className="flex items-center justify-between gap-2 px-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-bear-700 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
                            </div>
                            <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 whitespace-nowrap">
                              {isAr ? 'جيسون كوهين' : 'Jason Cohen'}
                            </span>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bear-100 dark:bg-bear-950/80 text-bear-700 dark:text-bear-300 border border-bear-500/20">
                                {isAr ? 'المستشار الذكي' : 'AI Advisor'}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono font-semibold flex items-center gap-1.5 shadow-2xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                <span>{msg.model_used || currentModelObj.name}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 text-stone-400 text-[10px]">
                            <span className="font-mono">
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <button
                              onClick={() => handleCopyMessage(msg.content, msg.id)}
                              className="p-1 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
                              title={isAr ? 'نسخ الإجابة' : 'Copy response'}
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div
                          className="rounded-2xl text-xs sm:text-sm leading-relaxed p-4 sm:p-5 border shadow-xs transition-colors duration-200"
                          style={{
                            backgroundColor: 'var(--surface-primary)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--foreground)',
                          }}
                        >
                          <ChatMessageMarkdown
                            content={msg.content}
                            articles={articles}
                            onSelectArticle={onSelectArticle}
                            isAr={isAr}
                          />
                        </div>
                      </div>
                    )
                  );
                })
              )}

              {/* Loading Indicator */}
              {loading && (
                <div className="w-full flex flex-col gap-1.5 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-bear-700 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 animate-spin" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                      {isAr ? 'جيسون كوهين' : 'Jason Cohen'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bear-100 dark:bg-bear-950/80 text-bear-700 dark:text-bear-300 border border-bear-500/20">
                      {isAr ? 'يكتب تحليله الآن...' : 'Analyzing & writing...'}
                    </span>
                  </div>
                  <div
                    className="rounded-2xl border p-4 rtl:mr-8 sm:rtl:mr-10 ltr:ml-8 sm:ltr:ml-10 flex items-center gap-2 transition-colors duration-200"
                    style={{
                      backgroundColor: 'var(--surface-primary)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-bear-600 animate-bounce" />
                    <span
                      className="w-2 h-2 rounded-full bg-bear-600 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-bear-600 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                    <span className="text-xs text-stone-400 ms-2">
                      {isAr
                        ? `جاري استدعاء نموذج ${currentModelObj.name_ar} واستخلاص أفكار المقالات...`
                        : `Consulting ${currentModelObj.name} with A Smart Bear essays...`}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ==================================================================== */}
            {/* INPUT SECTION / AUTH PROMPT */}
            {/* ==================================================================== */}
            <div
              className="p-3 sm:p-4 border-t transition-colors duration-200"
              style={{
                backgroundColor: 'var(--surface-primary)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              {!user ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="text-xs text-stone-700 dark:text-stone-300">
                      {isAr
                        ? 'يرجى تسجيل الدخول أو إنشاء حساب بدون شروط تعقيد للبدء بالاستشارة وحفظ محادثاتك بأمان.'
                        : 'Please login or create an account to start consulting and save your sessions securely.'}
                    </p>
                  </div>
                  <button
                    onClick={onOpenAuth}
                    className="px-4 py-2 rounded-xl bg-bear-600 hover:bg-bear-700 text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
                  >
                    {isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Login / Register'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div
                    className="relative flex items-end gap-2 rounded-2xl border focus-within:border-bear-500 focus-within:ring-2 focus-within:ring-bear-500/20 p-2 shadow-sm transition-all"
                    style={{
                      backgroundColor: 'var(--surface-secondary)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <textarea
                      ref={textareaRef}
                      value={inputQuery}
                      onChange={(e) => setInputQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={2}
                      placeholder={
                        isAr
                          ? 'استشر جيسون كوهين حول استراتيجيتك... (Enter للإرسال، Shift+Enter لسطر جديد)'
                          : 'Ask Jason Cohen about your strategic dilemma... (Enter to send, Shift+Enter for newline)'
                      }
                      className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm placeholder-stone-400 focus:outline-none p-1.5 max-h-32 leading-relaxed"
                      style={{
                        color: 'var(--foreground)',
                      }}
                    />

                    <button
                      onClick={() => handleSendMessage()}
                      disabled={loading || !inputQuery.trim()}
                      className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                        loading || !inputQuery.trim()
                          ? 'bg-stone-100 dark:bg-stone-700 text-stone-400 cursor-not-allowed'
                          : 'bg-bear-600 hover:bg-bear-700 text-white shadow-md active:scale-95'
                      }`}
                      title={isAr ? 'إرسال الاستفسار' : 'Send'}
                    >
                      <Send className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>

                  {/* Bottom Controls Bar: Model Selector (ChatGPT/Gemini style) + Feedback/Status */}
                  <div className="flex items-center justify-between gap-2 text-[11px] px-1 relative">
                    {/* Model Switcher Popover (opens upwards) */}
                    <div className="relative">
                      {modelDropdownOpen && (
                        <div
                          className="fixed inset-0 z-40 bg-black/5"
                          onClick={() => setModelDropdownOpen(false)}
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                        className="relative z-41 flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs transition-all"
                      >
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            selectedModel.includes('argon')
                              ? 'bg-amber-500'
                              : selectedModel.includes('pro')
                              ? 'bg-purple-500'
                              : selectedModel.includes('3.8')
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="font-bold">
                          {isAr ? currentModelObj.name_ar : currentModelObj.name}
                        </span>
                        <ChevronDown
                          className={`w-3 h-3 text-stone-400 transition-transform ${
                            modelDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {modelDropdownOpen && (
                        <div
                          className="absolute bottom-full mb-2 rtl:right-0 ltr:left-0 w-72 sm:w-80 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150 max-w-[calc(100vw-2rem)]"
                          style={{
                            backgroundColor: 'var(--surface-primary)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--foreground)',
                          }}
                        >
                          <div className="px-2.5 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 dark:border-stone-700/50 mb-1 flex items-center justify-between">
                            <span>{isAr ? 'اختر نموذج المستشار' : 'Select Advisor Model'}</span>
                            <span className="text-[9px] font-medium text-bear-600 dark:text-bear-400">
                              Gemini 2.5 & 3.8
                            </span>
                          </div>
                          <div className="space-y-1">
                            {AVAILABLE_MODELS.map((model) => {
                              const isSelected = model.id === selectedModel;
                              return (
                                <button
                                  key={model.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedModel(model.id);
                                    setModelDropdownOpen(false);
                                  }}
                                  className={`w-full text-start p-2 rounded-xl transition-all flex flex-col gap-0.5 ${
                                    isSelected
                                      ? 'bg-bear-50 dark:bg-bear-950/70 border border-bear-500/30'
                                      : 'hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <span
                                        className={`w-2 h-2 rounded-full shrink-0 ${
                                          model.id.includes('argon')
                                            ? 'bg-amber-500'
                                            : model.id.includes('pro')
                                            ? 'bg-purple-500'
                                            : model.id.includes('3.8')
                                            ? 'bg-blue-500'
                                            : 'bg-emerald-500'
                                        }`}
                                      />
                                      <span
                                        className={`text-xs font-bold ${
                                          isSelected
                                            ? 'text-bear-700 dark:text-bear-300'
                                            : 'text-stone-800 dark:text-stone-200'
                                        }`}
                                      >
                                        {isAr ? model.name_ar : model.name}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <span className="w-2 h-2 rounded-full bg-bear-600 dark:bg-bear-400 shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal rtl:pr-3.5 ltr:pl-3.5">
                                    {isAr ? model.description_ar : model.description_en}
                                  </p>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secondary Info / Issue reporter */}
                    <div className="text-stone-400 flex items-center gap-3">
                      {onOpenFeedback ? (
                        <button
                          onClick={() => onOpenFeedback()}
                          className="hover:text-bear-600 dark:hover:text-bear-400 underline underline-offset-2 flex items-center gap-1 transition-colors"
                        >
                          <Bug className="w-3 h-3" />
                          <span>{isAr ? 'إبلاغ عن مشكلة' : 'Report issue'}</span>
                        </button>
                      ) : (
                        <span className="hidden sm:inline">
                          {isAr
                            ? 'بياناتك معزولة ومشفرة بنسبة 100%'
                            : 'Isolated & encrypted sessions'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom In-App Confirmation Modal for Deleting Conversation */}
      {conversationToDelete && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => {
            if (!isDeletingConv) setConversationToDelete(null);
          }}
        >
          <div
            className="border rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-center"
            style={{
              backgroundColor: 'var(--surface-primary)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--foreground)',
            }}
            onClick={(e) => e.stopPropagation()}
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1.5">
              {isAr ? 'حذف المحادثة؟' : 'Delete Conversation?'}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 leading-relaxed">
              {isAr
                ? 'هل أنت متأكد من رغبتك في حذف هذه المحادثة؟ سيتم حذف جميع الرسائل السابقة نهائياً ولا يمكن التراجع عن هذا الإجراء.'
                : 'Are you sure you want to delete this conversation? All associated messages will be permanently removed and cannot be recovered.'}
            </p>
            <div className="p-2.5 mb-4 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300 font-medium truncate border border-stone-200/60 dark:border-stone-700/60">
              &ldquo;{conversationToDelete.title}&rdquo;
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isDeletingConv}
                onClick={() => setConversationToDelete(null)}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors disabled:opacity-50"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isDeletingConv}
                onClick={confirmDeleteConv}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-colors disabled:opacity-50 shadow-sm"
              >
                {isDeletingConv
                  ? (isAr ? 'جاري الحذف...' : 'Deleting...')
                  : (isAr ? 'نعم، احذف' : 'Yes, Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatMessageMarkdown({
  content,
  articles = [],
  onSelectArticle,
  isAr,
}: {
  content: string;
  articles?: Article[];
  onSelectArticle?: (article: Article) => void;
  isAr: boolean;
}) {
  const html = React.useMemo(() => {
    if (!content) return '';
    try {
      const renderer = new marked.Renderer();

      renderer.link = ({ href, text }) => {
        const cleanHref = (href || '').trim();
        const match = cleanHref.match(/(?:asmartbear\.com\/|\/article\/|\/|#)?([a-z0-9\-]+)(?:\/)?$/i);
        const candidateSlug = match ? match[1].toLowerCase() : '';

        let targetArticle = articles.find(
          (a) => a.slug.toLowerCase() === candidateSlug
        );
        if (!targetArticle && cleanHref) {
          targetArticle = articles.find(
            (a) => cleanHref.includes(a.slug) || (a.url && cleanHref === a.url)
          );
        }

        if (targetArticle) {
          const displayTitle = text || (isAr ? targetArticle.title_ar : targetArticle.title_en);
          return `
            <a 
              href="#" 
              data-article-slug="${targetArticle.slug}"
              class="internal-article-link inline-flex items-center gap-1.5 px-2.5 py-1 my-1 rounded-xl bg-bear-500/15 hover:bg-bear-500/25 text-bear-800 dark:text-bear-200 border border-bear-500/30 font-bold transition-all no-underline shadow-2xs group cursor-pointer"
              title="${isAr ? 'انقر لقراءة المقال كاملاً ومعرباً داخل المنصة' : 'Click to read full translated article'}"
            >
              <span class="text-bear-600 dark:text-bear-400">📖</span>
              <span class="underline decoration-bear-400 underline-offset-2">${displayTitle}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-bear-500/20 text-bear-700 dark:text-bear-300 font-normal">
                ${isAr ? 'اقرأ المقال' : 'Read Article'}
              </span>
            </a>
          `;
        }

        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-bear-600 dark:text-bear-400 underline font-medium hover:text-bear-700">${text}</a>`;
      };

      marked.setOptions({
        gfm: true,
        breaks: true,
        renderer,
      });

      return marked.parse(content) as string;
    } catch {
      return content;
    }
  }, [content, articles, isAr]);

  const handleProseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const link = (e.target as HTMLElement).closest('a');
    if (!link) return;

    const slug = link.getAttribute('data-article-slug');
    if (slug) {
      e.preventDefault();
      e.stopPropagation();
      const found = articles.find(
        (a) => a.slug.toLowerCase() === slug.toLowerCase()
      );
      if (found && onSelectArticle) {
        onSelectArticle(found);
        return;
      }
    }

    // Fallback: check href
    const href = link.getAttribute('href');
    if (href && href !== '#') {
      const match = href.match(/(?:asmartbear\.com\/|\/article\/|\/|#)?([a-z0-9\-]+)(?:\/)?$/i);
      if (match && match[1]) {
        const found = articles.find(
          (a) => a.slug.toLowerCase() === match[1].toLowerCase()
        );
        if (found && onSelectArticle) {
          e.preventDefault();
          e.stopPropagation();
          onSelectArticle(found);
          return;
        }
      }
    }
  };

  return (
    <div
      onClick={handleProseClick}
      className="prose-chat select-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
