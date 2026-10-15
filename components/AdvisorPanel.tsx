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
} from 'lucide-react';
import { Article } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { AVAILABLE_MODELS, ModelOption } from '@/lib/models';

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
}

export default function AdvisorPanel({
  isOpen,
  onClose,
  lang,
  user,
  onOpenAuth,
  contextArticle,
  onClearContext,
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModelObj =
    AVAILABLE_MODELS.find((m) => m.id === selectedModel) || AVAILABLE_MODELS[1];

  // Prevent background scrolling when advisor modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
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

  const deleteConv = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذه المحادثة؟' : 'Delete this conversation?')) {
      return;
    }
    try {
      const res = await fetch(`/api/conversations/${convId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setConversations((prev) => prev.filter((c) => c.id !== convId));
        if (activeConversationId === convId) {
          startNewConversation();
        }
      }
    } catch (e) {
      console.error('Error deleting conversation:', e);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/70 backdrop-blur-md animate-in fade-in duration-200"
      style={{ direction: isAr ? 'rtl' : 'ltr' }}
    >
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        {/* ==================================================================== */}
        {/* HEADER BAR */}
        {/* ==================================================================== */}
        <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-900/80 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Brand & Persona Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHistorySidebarOpen(!historySidebarOpen)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors relative"
              title={isAr ? 'سجل المحادثات' : 'Chat History'}
            >
              <History className="w-5 h-5" />
              {conversations.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-bear-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {conversations.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-bear-700 to-amber-600 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-white leading-none">
                    {isAr ? 'جيسون كوهين الذكي' : 'Jason Cohen Advisor'}
                  </h2>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-bear-100 dark:bg-bear-950 text-bear-700 dark:text-bear-300 border border-bear-500/20">
                    A Smart Bear
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 hidden sm:block">
                  {isAr
                    ? 'استشارات ريادية استراتيجية مستخلصة من 213 مقال وخبرة 4 شركات'
                    : 'Tactical founder advice distilled from 213 essays & 4 exits'}
                </p>
              </div>
            </div>
          </div>

          {/* Model Switcher & Action Controls */}
          <div className="flex items-center gap-2">
            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-bear-500 shadow-sm transition-all"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedModel.includes('argon')
                      ? 'bg-amber-500'
                      : selectedModel.includes('pro')
                      ? 'bg-purple-500'
                      : selectedModel.includes('3.8')
                      ? 'bg-blue-500'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {isAr ? currentModelObj.name_ar : currentModelObj.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {modelDropdownOpen && (
                <div className="absolute ltr:right-0 rtl:left-0 mt-1.5 w-64 sm:w-72 bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 p-2 z-50 animate-in fade-in duration-150 max-w-[calc(100vw-2rem)]">
                  <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 dark:border-stone-700/50 mb-1">
                    {isAr ? 'اختر نموذج الذكاء الاصطناعي' : 'Select Gemini Model'}
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
                          className={`w-full text-start p-2.5 rounded-xl transition-all flex flex-col gap-0.5 ${
                            isSelected
                              ? 'bg-bear-50 dark:bg-bear-950/70 border border-bear-500/30'
                              : 'hover:bg-stone-100 dark:hover:bg-stone-700/60 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold ${
                                isSelected
                                  ? 'text-bear-700 dark:text-bear-300'
                                  : 'text-stone-800 dark:text-stone-200'
                              }`}
                            >
                              {isAr ? model.name_ar : model.name}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-bear-600 dark:bg-bear-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-normal">
                            {isAr ? model.description_ar : model.description_en}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Export Markdown Button */}
            {messages.length > 0 && (
              <button
                onClick={exportConversationMarkdown}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-1.5"
                title={isAr ? 'تصدير كملف Markdown' : 'Export as Markdown'}
              >
                <Download className="w-4 h-4 text-stone-500" />
                <span className="hidden sm:inline">{isAr ? 'تصدير' : 'Export'}</span>
              </button>
            )}

            {/* New Chat Button */}
            <button
              onClick={startNewConversation}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium bg-bear-50 dark:bg-bear-950/50 text-bear-700 dark:text-bear-300 hover:bg-bear-100 dark:hover:bg-bear-900/60 transition-colors flex items-center gap-1"
              title={isAr ? 'محادثة جديدة' : 'New Chat'}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? 'جديدة' : 'New'}</span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5" />
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
              className={`absolute sm:relative z-20 top-0 bottom-0 w-72 bg-stone-50 dark:bg-stone-950 border-inline-end border-stone-200 dark:border-stone-800 flex flex-col p-3 transition-all duration-200 shadow-xl sm:shadow-none ${
                isAr ? 'right-0' : 'left-0'
              }`}
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
                          onClick={(e) => deleteConv(c.id, e)}
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
          <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-stone-900">
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
              <div className="mx-4 mt-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-500/20 text-xs text-red-700 dark:text-red-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMessage}</span>
                </div>
                <button onClick={() => setErrorMessage(null)} className="text-red-400 p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
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
                /* Message Bubbles */
                messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  const isCopied = copiedId === msg.id;

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 max-w-3xl ${
                        isUser
                          ? isAr
                            ? 'mr-auto flex-row-reverse'
                            : 'ml-auto flex-row-reverse'
                          : ''
                      }`}
                    >
                      {/* Avatar Icon */}
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                          isUser
                            ? 'bg-stone-800 dark:bg-stone-700 text-stone-200'
                            : 'bg-bear-600 text-white'
                        }`}
                      >
                        {isUser ? (
                          <UserIcon className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-amber-200" />
                        )}
                      </div>

                      {/* Bubble Content */}
                      <div className="flex-1 space-y-1">
                        <div
                          className={`flex items-center gap-2 ${
                            isUser ? (isAr ? 'justify-start' : 'justify-end') : 'justify-start'
                          }`}
                        >
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                            {isUser
                              ? user?.username || (isAr ? 'أنت' : 'You')
                              : isAr
                              ? 'جيسون كوهين'
                              : 'Jason Cohen'}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {!isUser && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-mono font-bold flex items-center gap-1.5 shadow-2xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              <span>{msg.model_used || currentModelObj.name}</span>
                            </span>
                          )}
                        </div>

                        <div
                          className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                            isUser
                              ? 'bg-bear-600 text-white rounded-tr-none'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-tl-none border border-stone-200/50 dark:border-stone-700/50'
                          }`}
                        >
                          {/* Message Text formatted cleanly */}
                          <div className="whitespace-pre-wrap font-sans space-y-2">
                            {msg.content}
                          </div>

                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopyMessage(msg.content, msg.id)}
                            className="absolute top-2.5 left-2.5 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/80 dark:bg-stone-900/80 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 shadow-sm transition-all"
                            title={isAr ? 'نسخ النص' : 'Copy text'}
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-3 max-w-xl animate-in fade-in">
                  <div className="w-8 h-8 rounded-xl bg-bear-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-stone-100 dark:bg-stone-800 border border-stone-200/50 dark:border-stone-700/50 flex items-center gap-2">
                    <div className="flex gap-1.5 items-center">
                      <span className="w-2 h-2 rounded-full bg-bear-600 animate-bounce" />
                      <span
                        className="w-2 h-2 rounded-full bg-bear-600 animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <span
                        className="w-2 h-2 rounded-full bg-bear-600 animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                    <span className="text-xs text-stone-500 font-medium mr-1">
                      {isAr
                        ? `جاري التحليل واستخلاص الحكمة عبر ${currentModelObj.name}...`
                        : `Formulating strategic advice via ${currentModelObj.name}...`}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ==================================================================== */}
            {/* INPUT SECTION / AUTH PROMPT */}
            {/* ==================================================================== */}
            <div className="p-3 sm:p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/70">
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
                  <div className="relative flex items-end gap-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 focus-within:border-bear-500 focus-within:ring-2 focus-within:ring-bear-500/20 p-2 shadow-sm transition-all">
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
                      className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none p-1.5 max-h-32 leading-relaxed"
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

                  <div className="flex items-center justify-between text-[11px] text-stone-400 px-1">
                    <span>
                      {isAr
                        ? 'النموذج المختار: ' + currentModelObj.name
                        : 'Selected Model: ' + currentModelObj.name}
                    </span>
                    <span>
                      {isAr
                        ? 'بياناتك معزولة ومشفرة بنسبة 100%'
                        : 'Isolated & encrypted sessions'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
