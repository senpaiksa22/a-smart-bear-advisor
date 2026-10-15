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

        const escapeHtml = (text: string) =>
          text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const categoryText = categoryLabels[cleanCategory] || cleanCategory;
        const reporterName = user ? `👤 ${user.username} (مسجل)` : '👤 زائر (غير مسجل)';
        const dateStr = new Date().toLocaleString('ar-SA', { timeZone: 'Asia/Riyadh' });

        let telegramHtml = `🚨 <b>بلاغ جديد من منصة مستشار الدب الذكي!</b>\n`;
        telegramHtml += `━━━━━━━━━━━━━━━━━━━━\n`;
        telegramHtml += `📌 <b>التصنيف:</b> ${escapeHtml(categoryText)}\n`;
        telegramHtml += `👤 <b>المرسل:</b> ${escapeHtml(reporterName)}\n`;
        telegramHtml += `💬 <b>نص البلاغ:</b>\n${escapeHtml(cleanMessage)}\n\n`;

        if (contactInfo) {
          telegramHtml += `📱 <b>وسيلة التواصل:</b> <code>${escapeHtml(contactInfo)}</code>\n`;
        }
        if (pageUrl) {
          telegramHtml += `🔗 <b>الصفحة:</b> ${escapeHtml(pageUrl)}\n`;
        }
        if (errorDetails) {
          telegramHtml += `⚠️ <b>تفاصيل الخطأ:</b>\n<pre>${escapeHtml(String(errorDetails).slice(0, 400))}</pre>\n`;
        }
        telegramHtml += `⏰ <b>الوقت:</b> ${escapeHtml(dateStr)}`;

        // Must await in serverless runtime so Vercel does not terminate the process early
        const tgRes = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: telegramHtml,
            parse_mode: 'HTML',
          }),
        });

        if (!tgRes.ok) {
          const errText = await tgRes.text();
          console.warn('Telegram API response error:', tgRes.status, errText);
        }
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
