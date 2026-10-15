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

export interface GeminiResponsePayload {
  text: string;
  modelUsed: string;
  isLive: boolean;
}

export async function callGeminiAdvisor(params: {
  modelId: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  contextArticle?: any;
  userQuery: string;
}): Promise<GeminiResponsePayload> {
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
    return {
      text: generateOfflineAdvisorResponse(params.userQuery, relevantArticles, selectedModel),
      modelUsed: `${selectedModel.name} (محلي)`,
      isLive: false,
    };
  }

  // Call official Gemini REST API (Zero Client Exposure)
  try {
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

    let activeModel = selectedModel.apiModel;
    let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey}`;

    let response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    let modelUsedName = selectedModel.name;

    // If primary model has high demand or error, fallback to gemini-3.5-flash-lite
    if (!response.ok && activeModel !== 'gemini-3.5-flash-lite') {
      console.warn(`Model ${activeModel} returned ${response.status}, failing over to gemini-3.5-flash-lite...`);
      endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });
      if (response.ok) {
        modelUsedName = 'Gemini 3.5 Flash-Lite (تلقائي)';
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`Gemini API returned ${response.status}: ${errText}. Falling back to internal advisor engine.`);
      return {
        text: generateOfflineAdvisorResponse(params.userQuery, relevantArticles, selectedModel),
        modelUsed: `${selectedModel.name} (محلي)`,
        isLive: false,
      };
    }

    const data = await response.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (candidate) {
      return {
        text: candidate,
        modelUsed: modelUsedName,
        isLive: true,
      };
    }

    return {
      text: generateOfflineAdvisorResponse(params.userQuery, relevantArticles, selectedModel),
      modelUsed: `${selectedModel.name} (محلي)`,
      isLive: false,
    };
  } catch (err) {
    console.warn('Gemini API call failed, falling back to local advisor:', err);
    return {
      text: generateOfflineAdvisorResponse(params.userQuery, relevantArticles, selectedModel),
      modelUsed: `${selectedModel.name} (محلي)`,
      isLive: false,
    };
  }
}

function isGreeting(q: string): boolean {
  const clean = q.trim().toLowerCase();
  const greetings = [
    'السلام عليكم', 'سلام عليكم', 'وعليكم السلام', 'مرحبا', 'مرحباً', 'اهلين', 'أهلاً', 'أهلا',
    'صباح الخير', 'مساء الخير', 'هلا', 'تحياتي', 'كيفك', 'شخبارك', 'hi', 'hello', 'hey', 'greetings'
  ];
  return greetings.some((g) => clean.includes(g)) && clean.length < 40;
}

function generateOfflineAdvisorResponse(query: string, articles: any[], model: ModelOption): string {
  // 1. Natural greeting handling
  if (isGreeting(query)) {
    return `### مرحباً بك يا رائد الأعمال! وعليكم السلام ورحمة الله وبركاته.

أنا **جيسون كوهين**، ويسعدني جداً أن أكون مستشارك اليوم لنفكر معاً بعقلية ريادية واقعية وتكتيكية.

في رحلتي لتأسيس 4 شركات — من بينها **Smart Bear** (التي بنيتها بأموالي الذاتية وبأرباح حقيقية دون مستثمرين) و **WP Engine** (التي نمت كشركة يونيكورن بتمويل استثماري رأس مالي) — تعلمت أن أعظم ميزة لرائد الأعمال هي التفكير النقدي وتجنب الأخطاء الفادحة الشائعة.

---

🎯 **أخبرني: ما هو مشروعك الحالي، أو ما هو التحدي الاستراتيجي الذي يشغل تفكيرك وتريد أن نفككه معاً؟**

*(يمكنك سؤالي عن: كيفية تسعير منتجك، التحقق من ملاءمة المنتج للسوق PMF، مقابلة العملاء واستكشافهم، إدارة الفريق، أو حتى التردد بين التمويل الذاتي والاستثماري).*`;
  }

  // 2. Contextual Advisor Response
  const art = articles[0];
  const artTitle = art ? (art.title_ar || art.title_en) : 'استراتيجية الأعمال وتجنب الأخطاء الفادحة';
  const artSummary = art ? (art.summary_ar || art.summary_en) : '';
  const artUrl = art ? art.url : '';

  return `### رؤية جيسون كوهين المباشرة والعملية:

دعنا ننظر إلى هذا التحدي بواقعية تجريدية بعيداً عن كليشيهات ريادة الأعمال الشائعة.

في تجاربي الريادية، سواء بالتمويل الذاتي (Bootstrapping) أو الاستثماري (VC)، وجدت أن أغلب المؤسسين يبحثون عن "حلول سحرية"، بينما الحقيقة هي أن:

> **"80% من الاستراتيجية الفائزة لا تعتمد على ضربات عبقرية نادرة، بل على تجنب ارتكاب الأخطاء البديهية غير الإجبارية (Avoid Blundering)."**

#### 1. التحليل التكتيكي الأساسي:
- **سياق شركتك يحكم كل قرار:** ما يناسب شركة عملاقة تضم آلاف الموظفين قد يدمر شركة ناشئة من 5 أشخاص. لا تتبع أطر العمل لأنها "رائجة" بل لأنها تحل عنق الزجاجة الفعلي لديك اليوم.
- **الاستعداد الفعلي للدفع (Willingness to Pay):** المقياس الصادق الوحيد لاهتمام السوق هو فتح العميل لمحفظته ودفع المال لحل مشكلته. الاستبيانات والثناء الشفهي مجاني وغالباً مضلل.

${artSummary ? `#### 2. المبدأ المستخلص من مقالتي: [${artTitle}](${artUrl})
${artSummary}
` : ''}

#### 3. التوصيات التنفيذية للبدء فوراً:
1. **حدد عميلك المستهدف بدقة متناهية (Target Persona):** لا تَبِع للجميع، حدد شريحة محددة جداً تعاني من ألم حقيقي وتمتلك ميزانية للدفع.
2. **ارفع أسعارك وثق بقيمتك:** إذا لم يشتكِ 15-20% من عملائك من السعر، فأنت غالباً تبيع منتجك بأقل من قيمته الحقيقية.
3. **احمِ تركيزك (Protect Your Focus):** اختر أولوية واحدة قصوى لكل مرحلة وتخلص من المشاريع الجانبية والميزات غير الضرورية.

---
*(ملاحظة: الردود تعتمد على محرك أفكار ومقالات جيسون كوهين. لتفعيل الاتصال السحابي الحي بنموذج الذكاء الاصطناعي **${model.name}**، يمكنك إضافة مفتاح \`GEMINI_API_KEY\` في ملف الإعدادات).*`;
}
