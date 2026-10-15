import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest, checkRateLimit } from '@/lib/auth';
import { saveFeedbackReport } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 1. Identify User (Optional, can be anonymous visitor)
    const user = getAuthUserFromRequest(request);

    // 2. IP / User Rate Limiting (Max 10 reports per hour to prevent spam)
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown_ip';
    const rateKey = user ? `feedback:user:${user.id}` : `feedback:ip:${clientIp}`;
    const rateCheck = checkRateLimit(rateKey, 10, 60 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'تم استلام عدد من البلاغات مؤخراً من جهازك. يرجى الانتظار قليلاً قبل إرسال بلاغ آخر.',
        },
        { status: 429 }
      );
    }

    // 3. Parse and Validate Body
    const body = await request.json();
    const { category = 'bug', message, errorDetails, pageUrl, contactInfo } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'نص البلاغ أو الملاحظة مطلوب.' },
        { status: 400 }
      );
    }

    const cleanMessage = message.trim();
    const cleanCategory = ['bug', 'suggestion', 'content'].includes(category) ? category : 'bug';

    // 4. Save to Database (Supabase / Local)
    const savedRecord = await saveFeedbackReport({
      user_id: user?.id || null,
      username: user?.username || null,
      category: cleanCategory as any,
      message: cleanMessage,
      error_details: errorDetails ? String(errorDetails).slice(0, 1000) : null,
      page_url: pageUrl ? String(pageUrl).slice(0, 300) : null,
      contact_info: contactInfo ? String(contactInfo).slice(0, 200) : null,
    });

    // 5. Send Instant Telegram Bot Notification if configured
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramToken && telegramChatId) {
      try {
        const categoryLabels: Record<string, string> = {
          bug: '🐛 مشكلة فنية / خطأ برمجي',
          suggestion: '💡 اقتراح أو فكرة تحسين',
          content: '📝 ملاحظة في مقال أو ترجمة',
        };

        const categoryText = categoryLabels[cleanCategory] || cleanCategory;
        const reporterName = user ? `👤 ${user.username} (مسجل)` : '👤 زائر (غير مسجل)';
        const dateStr = new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' });

        let telegramText = `🚨 *بلاغ جديد من منصة مستشار الدب الذكي!*\n`;
        telegramText += `━━━━━━━━━━━━━━━━━━━━\n`;
        telegramText += `📌 *التصنيف:* ${categoryText}\n`;
        telegramText += `👤 *المرسل:* ${reporterName}\n`;
        telegramText += `💬 *نص البلاغ:*\n${cleanMessage}\n\n`;

        if (contactInfo) {
          telegramText += `📱 *وسيلة التواصل:* \`${contactInfo}\`\n`;
        }
        if (pageUrl) {
          telegramText += `🔗 *الصفحة:* \`${pageUrl}\`\n`;
        }
        if (errorDetails) {
          telegramText += `⚠️ *تفاصيل الخطأ:*\n\`\`\`\n${String(errorDetails).slice(0, 400)}\n\`\`\`\n`;
        }
        telegramText += `⏰ *الوقت:* ${dateStr}`;

        // Fire and forget telegram dispatch with short timeout
        fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramText,
            parse_mode: 'Markdown',
          }),
        }).catch((tgErr) => console.warn('Telegram dispatch warning:', tgErr));
      } catch (tgError) {
        console.warn('Telegram notification error:', tgError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'تم استلام بلاغك بنجاح وسيقوم فريق التطوير بمراجعته فوراً. شكراً لمساهمتك!',
      data: savedRecord,
    });
  } catch (error: any) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء إرسال البلاغ.' },
      { status: 500 }
    );
  }
}
