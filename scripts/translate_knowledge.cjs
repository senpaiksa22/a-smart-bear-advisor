const fs = require('fs');
const path = require('path');

const rootDir = 'C:/Users/momo1/Desktop/My Projects/A Smart Bear Advisor';
const envFile = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf8');
const apiKey = envFile.split('\n').find(l => l.startsWith('GEMINI_API_KEY=')).split('=')[1].trim();

const indexPath = path.join(rootDir, 'data/knowledge_index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

// Find items needing translation
const queue = [];
for (let i = 0; i < index.length; i++) {
  const a = index[i];
  const needsSummary = a.summary_ar && (a.summary_ar.includes('تحليل واستراتيجية:') || a.summary_ar.includes('The Elephant') || /^[A-Za-z]/.test(a.summary_ar));
  const needsSubtopics = a.subtopics_ar && a.subtopics_ar[0] && /^[A-Za-z]/.test(a.subtopics_ar[0].title_ar);
  if (needsSummary || needsSubtopics) {
    queue.push({
      indexIdx: i,
      slug: a.slug,
      title_ar: a.title_ar,
      title_en: a.title_en,
      summary_en: a.summary_en,
      needsSummary,
      needsSubtopics,
      subtopics_to_translate: needsSubtopics ? a.subtopics_ar.map(s => ({ num: s.num, title: s.title_ar || s.title, takeaway: s.takeaway_ar || s.takeaway })) : []
    });
  }
}

console.log(`Found ${queue.length} articles to translate.`);

async function callGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }
  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(text);
}

async function processBatch(batch) {
  const prompt = `أنت مترجم وخبير استراتيجي في ريادة الأعمال لمقالات مدونة جيسون كوهين (A Smart Bear).
مهمتك ترجمة وتعريب ملخصات ومحاور المقالات التالية إلى اللغة العربية الفصيحة، الرصينة، والاحترافية جداً (تجنب الترجمة الحرفية الركيكة، واجعل الأسلوب جذاباً وواضحاً لرواد الأعمال).

المقطلوب ترجمته بصيغة JSON طبق الأصل لمصفوفة النتائج:
[
  ${batch.map(item => JSON.stringify({
    slug: item.slug,
    title_ar: item.title_ar,
    summary_en: item.needsSummary ? item.summary_en : null,
    subtopics_en: item.needsSubtopics ? item.subtopics_to_translate : null
  })).join(',\n')}
]

أرجع JSON حصرياً بهذا الشكل المطابق لكل عنصر:
[
  {
    "slug": "article-slug",
    "summary_ar": "الملخص المترجم بالعربية الفصيحة المباشرة (أو null إذا لم يكن مطلوباً)",
    "subtopics_ar": [
      {
        "num": 1,
        "title_ar": "عنوان المحور بالعربية الواضحة",
        "takeaway_ar": "الدرس المستفاد والشرح بالعربية الفصيحة"
      }
    ]
  }
]
`;

  const results = await callGemini(prompt);
  return results;
}

async function run() {
  const BATCH_SIZE = 8;
  for (let i = 0; i < queue.length; i += BATCH_SIZE) {
    const batch = queue.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(queue.length / BATCH_SIZE)} (items ${i + 1} to ${Math.min(i + BATCH_SIZE, queue.length)})...`);
    try {
      const results = await processBatch(batch);
      for (const res of results) {
        const item = queue.find(q => q.slug === res.slug);
        if (!item) continue;
        const targetArt = index[item.indexIdx];
        if (res.summary_ar) {
          targetArt.summary_ar = res.summary_ar;
          // Also update md file if exists
          const mdPath = path.join(rootDir, 'data/articles_ar', `${targetArt.slug}.md`);
          if (fs.existsSync(mdPath)) {
            try {
              let md = fs.readFileSync(mdPath, 'utf8');
              md = md.replace(/summary_ar:\s*"[^"]+"/, `summary_ar: "${res.summary_ar.replace(/"/g, '\\"')}"`);
              md = md.replace(/> \*\*الملخص التنفيذي:\*\* [^\n]+/, `> **الملخص التنفيذي:** ${res.summary_ar}`);
              fs.writeFileSync(mdPath, md, 'utf8');
            } catch (e) {}
          }
        }
        if (res.subtopics_ar && res.subtopics_ar.length > 0) {
          targetArt.subtopics_ar = res.subtopics_ar.map((s, sIdx) => ({
            num: s.num || sIdx + 1,
            title_ar: s.title_ar,
            takeaway_ar: s.takeaway_ar,
            keywords_ar: targetArt.subtopics_ar?.[sIdx]?.keywords_ar || []
          }));
        }
      }
      // Save progress to knowledge_index.json
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
      console.log(`Batch ${Math.floor(i / BATCH_SIZE) + 1} completed and saved.`);
    } catch (e) {
      console.error(`Error in batch starting at ${i}:`, e.message);
    }
  }
  console.log('All translations completed successfully!');
}

run();
