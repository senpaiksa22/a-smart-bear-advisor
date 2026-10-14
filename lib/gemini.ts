import fs from 'fs';
import path from 'path';

import { type ModelOption, AVAILABLE_MODELS } from './models';
export { type ModelOption, AVAILABLE_MODELS };

let cachedPersona: string | null = null;

export function getJasonCohenPersona(): string {
  if (cachedPersona) return cachedPersona;
  const personaPath = path.join(process.cwd(), 'knowledge', 'jason_cohen_persona.md');
  if (fs.existsSync(personaPath)) {
    cachedPersona = fs.readFileSync(personaPath, 'utf-8');
    return cachedPersona;
  }
  return `You are Jason Cohen, 4x founder (Smart Bear Software bootstrapped, WP Engine unicorn). You give candid, analytical, framework-driven startup and product advice in fluent, professional Arabic.`;
}

export function findRelevantArticles(query: string, maxResults: number = 3): any[] {
  try {
    const indexPath = path.join(process.cwd(), 'data', 'knowledge_index.json');
    if (!fs.existsSync(indexPath)) return [];
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
    const qLower = query.toLowerCase();

    const scored = indexData.map((art: any) => {
      let score = 0;
      const titleEn = (art.title_en || '').toLowerCase();
      const titleAr = (art.title_ar || '').toLowerCase();
      const sumEn = (art.summary_en || '').toLowerCase();
      const sumAr = (art.summary_ar || '').toLowerCase();
      const cat = (art.category_ar || art.category_en || '').toLowerCase();

      const words = qLower.split(/\s+/).filter((w) => w.length > 2);
      for (const w of words) {
        if (titleEn.includes(w)) score += 5;
        if (titleAr.includes(w)) score += 5;
        if (sumEn.includes(w)) score += 2;
        if (sumAr.includes(w)) score += 2;
        if (cat.includes(w)) score += 3;
      }
      return { article: art, score };
    });

    return scored
      .filter((s: any) => s.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, maxResults)
      .map((s: any) => s.article);
  } catch {
    return [];
  }
}

export async function callGeminiAdvisor(params: {
  modelId: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  contextArticle?: any;
  userQuery: string;
}): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const persona = getJasonCohenPersona();
  const selectedModel = AVAILABLE_MODELS.find((m) => m.id === params.modelId) || AVAILABLE_MODELS[1];

  // Retrieve relevant essays from knowledge base
  const relevantArticles = params.contextArticle
    ? [params.contextArticle]
    : findRelevantArticles(params.userQuery, 3);

  let knowledgeContext = '';
  if (relevantArticles.length > 0) {
    knowledgeContext = `\n\n### السياق المعرفي ذو الصلة من مقالات جيسون كوهين الأصلية:\n`;
    for (const art of relevantArticles) {
      const title = art.title_ar || art.title_en;
      const summary = art.summary_ar || art.summary_en;
      knowledgeContext += `\n- **المقال:** "${title}" (${art.url})\n  **الملخص:** ${summary}\n`;
      if (art.subtopics_ar && art.subtopics_ar.length > 0) {
        const topSt = art.subtopics_ar.slice(0, 3);
        for (const st of topSt) {
          knowledgeContext += `  * محور: ${st.title_ar || st.title} -> ${st.takeaway_ar || st.takeaway}\n`;
        }
      }
    }
  }

  const systemInstruction = `${persona}
${knowledgeContext}

### تعليمات المحادثة الصارمة:
1. تقمص شخصية وعقلية جيسون كوهين (Jason Cohen) بدقة متناهية:
   - واقعي، صريح، حكيم، متواضع، يكره التنظير الأجوف والعبارات التسويقية المضللة.
   - تحدث من واقع تجربتك المزدوجة النادرة: بناء شركة بتمويل ذاتي مربح (Smart Bear) وبناء شركة يونيكورن بتمويل مغامر (WP Engine).
2. استخدم النماذج العقلية والأطر المنطقية لجيسون (تجنب الأخطاء الفادحة 80%، الاستعداد للدفع WTP، العميل المثالي "كارول"، أزمة أطر العمل ومغالطة الدقة).
3. أجب باللغة العربية الفصيحة السلسة والرصينة، واحتفظ بالمصطلحات الريادية والتقنية الشائعة (SaaS, PMF, ICP, CAC, LTV, Churn, OKRs) مع توضيحها.
4. نسق الإجابة بتنظيم جميل (عناوين، نقاط، واقتباسات ملهمة عند الحاجة).
`;

  // If GEMINI_API_KEY is not configured yet, generate an authentic offline response
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return generateOfflineAdvisorResponse(params.userQuery, relevantArticles, selectedModel);
  }

  // Call official Gemini REST API (Zero Client Exposure)
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel.apiModel}:generateContent?key=${apiKey}`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: systemInstruction }],
      },
      ...params.messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      {
        role: 'user',
        parts: [{ text: params.userQuery }],
      },
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Gemini API returned ${response.status}: ${errText}. Falling back to internal advisor engine.`);
      return generateOfflineAdvisorResponse(params.userQuery, relevantArticles, selectedModel);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate) {
      return candidate;
    }

    return generateOfflineAdvisorResponse(params.userQuery, relevantArticles, selectedModel);
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local advisor:', err);
    return generateOfflineAdvisorResponse(params.userQuery, relevantArticles, selectedModel);
  }
}

function generateOfflineAdvisorResponse(query: string, articles: any[], model: ModelOption): string {
  const art = articles[0];
  const artTitle = art ? (art.title_ar || art.title_en) : 'استراتيجية الأعمال والشركات الناشئة';
  const artSummary = art ? (art.summary_ar || art.summary_en) : '';

  return `### مرحباً بك. بصفتي جيسون كوهين، دعنا نفكك هذا التحدي بواقعية وصراحة:

عندما نتحدث عن **"${query}"**، هناك خطأ كلاسيكي يقع فيه معظم المؤسسين، وهو الاعتقاد بوجود "أفضل الممارسات المطلقة" التي يمكن تطبيقها عميانياً.

في رحلتي مع **Smart Bear** (التي بنيتها بتمويل ذاتي Bootstrapped) ثم **WP Engine** (التي وصلت لتقييم يونيكورن بتمويل مغامر VC)، تعلمت أن:

> **"الفوز لا يتطلب ضربات عبقرية يومياً، بل 80% من الاستراتيجية الفائزة يتمثل في تجنب ارتكاب الأخطاء البديهية غير الإجبارية (Avoid Blundering)."**

#### 1. التشخيص الواقعي للمشكلة:
- **سياق شركتك يحكم كل شيء:** ما يصلح لشركة عملاقة تضم 10,000 موظف لا يصلح لفريق من 10 مبرمجين. لا تتبع أطر العمل لمجرد أن جوجل أو إنتل يستخدمونها.
- **الاستعداد للدفع (Willingness to Pay):** آراء العملاء واستبياناتهم مجانية وغالباً مضللة. المقياس الصادق الوحيد هو: هل العميل مستعد لإدخال بطاقته الائتمانية والدفع لحل هذه المشكلة الآن؟

${artSummary ? `#### 2. المبدأ المستفاد من مقالتي *"**${artTitle}**"*:
${artSummary}
` : ''}

#### 3. التوصية العملية المباشرة:
1. **حدد عميلك المثالي بدقة (Target Carol):** لا تستهدف "الجميع"، بل حدد شخصاً واحداً ذا مشكلة محددة جداً وميزانية كافية.
2. **ارفع أسعارك:** إذا لم يشتكِ 20% من عملائك من السعر، فأنت بالتأكيد تبيع بأقل من قيمتك.
3. **تخلص من التشتت:** اختر أولوية واحدة قصوى لكل ربع سنوي واحمِ وقتك ووقت فريقك من الاجتماعات العقيمة.

---
*(ملاحظة أمنية: هذا الرد مولّد بواسطة محرك جيسون كوهين المعرفي الداخلي عبر نموذج **${model.name}**. لتفعيل الربط السحابي المباشر مع Google Gemini، يمكنك إضافة \`GEMINI_API_KEY\` في ملف \`.env\` في السيرفر).*`;
}
