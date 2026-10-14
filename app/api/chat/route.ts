import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest, checkRateLimit } from '@/lib/auth';
import { createConversation, getConversationById, getMessages, saveMessage } from '@/lib/db';
import { callGeminiAdvisor } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify User Session & Isolation
    const user = getAuthUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'يرجى تسجيل الدخول أولاً لتتمكن من استشارة جيسون كوهين وحفظ محادثاتك بأمان.',
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    // 2. Rate Limiting on Chat (20 requests per minute per user)
    const rateCheck = checkRateLimit(`chat:${user.id}`, 20, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'تم تجاوز الحد الأقصى للاستفسارات السريعة، يرجى التمهل دقيقة واحدة للحفاظ على رصيد الخدمة.',
        },
        { status: 429 }
      );
    }

    // 3. Parse Request
    const body = await request.json();
    const { query, modelId = 'gemini-3.8-flash', conversationId, contextArticle } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'الاستفسار مطلوب.' },
        { status: 400 }
      );
    }

    const cleanQuery = query.trim();

    // 4. Resolve or Create Conversation
    let activeConvId = conversationId;
    let historyMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

    if (activeConvId) {
      const conv = await getConversationById(user.id, activeConvId);
      if (!conv) {
        return NextResponse.json(
          { success: false, error: 'المحادثة غير موجودة أو غير مصرح لك بالوصول إليها.' },
          { status: 404 }
        );
      }
      const existing = await getMessages(user.id, activeConvId);
      historyMessages = existing.map((m: any) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      }));
    } else {
      // Auto-generate concise conversation title
      const title = cleanQuery.length > 50 ? cleanQuery.slice(0, 48) + '...' : cleanQuery;
      const newConv = await createConversation(user.id, title, modelId);
      activeConvId = newConv.id;
    }

    // 5. Save User Message to Database
    await saveMessage(activeConvId, user.id, 'user', cleanQuery);

    // 6. Invoke Gemini Advisor Server-Side
    const assistantReply = await callGeminiAdvisor({
      modelId,
      messages: historyMessages,
      contextArticle,
      userQuery: cleanQuery,
    });

    // 7. Save Assistant Reply to Database
    const savedAssistantMsg = await saveMessage(activeConvId, user.id, 'assistant', assistantReply);

    return NextResponse.json({
      success: true,
      conversationId: activeConvId,
      message: savedAssistantMsg,
      modelUsed: modelId,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء معالجة الاستشارة الذكية.' },
      { status: 500 }
    );
  }
}
