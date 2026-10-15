const fs = require('fs');
const path = require('path');

const rootDir = 'C:/Users/momo1/Desktop/My Projects/A Smart Bear Advisor';
const indexPath = path.join(rootDir, 'data/knowledge_index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

const art = index.find(a => a.slug === 'exponential-growth');

if (art) {
  art.summary_ar = 'حتى الشركات سريعة الانتشار مثل فيسبوك وسلاك لم تنمو أبدًا بمعدل "أُسي" كما يُشاع، بل بنمو تربيعي واقعي. يقدم جيسون كوهين في هذا المقال النموذج الرياضي الدقيق لفهم محركات النمو الحقيقية في شركتك والتأثير فيها بفاعلية.';
  art.subtopics_ar = [
    {
      num: 1,
      title_ar: 'تفنيد خرافة "النمو الأسي"',
      takeaway_ar: 'النمو الأسي الحقيقي يتصاعد عمودياً بشكل مستحيل رياضياً في الواقع العملي، بينما تثبت البيانات الحقيقية أن نمو الشركات يتبع نموذجاً تربيعياً مستداماً وقابلاً للتفسير.',
      keywords_ar: ['النمو الأسي', 'النمو التربيعي', 'تفنيد الخرافات', 'الرياضيات والنمو']
    },
    {
      num: 2,
      title_ar: 'النمو الفائق الحقيقي هو نمو تربيعي (Quadratic)',
      takeaway_ar: 'البيانات التاريخية لإيرادات شركات كبرى مثل HubSpot وSlack توضح أن مسار نموها الفعلي يطابق المنحنى التربيعي وليس الدالة الأسية المتضاعفة.',
      keywords_ar: ['HubSpot', 'Slack', 'النمو التربيعي', 'معدل النمو السنوي']
    },
    {
      num: 3,
      title_ar: 'لماذا تنمو المنتجات القائمة على التسويق تربيعياً؟',
      takeaway_ar: 'تفسير منطقي من المبادئ الأولى: الحملات التسويقية المتتالية تضيف مبيعات تراكمية تدعم تدفقات الإيرادات الدورية المستمرة.',
      keywords_ar: ['المبادئ الأولى', 'التسويق', 'محركات النمو', 'الإيرادات المتكررة']
    },
    {
      num: 4,
      title_ar: 'دورة حياة الحملة التسويقية',
      takeaway_ar: 'الحملات التسويقية تتبع نمطاً طبيعياً: انطلاق تدريجي، وصول إلى قمة الأداء، ثم انحدار وتلاشٍ تدريجي لفعاليتها بعد استنفاد الجمهور المستهدف.',
      keywords_ar: ['الحملة التسويقية', 'دورة الحياة', 'ذروة الأداء', 'تشبع السوق']
    },
    {
      num: 5,
      title_ar: 'كيف تتحول الحملة التسويقية إلى نمو مستمر؟',
      takeaway_ar: 'في نماذج الاشتراكات المتكررة (SaaS)، المبيعات المكتسبة من حملة منتهية لا تختفي، بل تستمر في ضخ إيرادات شهرية متراكمة شهراً بعد شهر.',
      keywords_ar: ['SaaS', 'الإيرادات الدورية', 'التراكم المالي', 'استبقاء العملاء']
    },
    {
      num: 6,
      title_ar: 'طبقات الكعكة للنمو التربيعي المتراكم',
      takeaway_ar: 'إدارات التسويق الذكية لا تعتمد على حملة منفردة، بل تراكم طبقات متعددة من المبادرات والقنوات، وهذا التراكم المتزامن هو المحرك الحقيقي للنمو المتسارع.',
      keywords_ar: ['طبقات النمو', 'تعدد القنوات', 'استراتيجية التسويق', 'تراكم الإيرادات']
    }
  ];
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf8');
  console.log('Successfully updated knowledge_index.json for exponential-growth');
}

const mdPath = path.join(rootDir, 'data/articles_ar/exponential-growth.md');
if (fs.existsSync(mdPath)) {
  let md = fs.readFileSync(mdPath, 'utf8');
  const newSummary = 'حتى الشركات سريعة الانتشار مثل فيسبوك وسلاك لم تنمو أبدًا بمعدل "أُسي" كما يُشاع، بل بنمو تربيعي واقعي. يقدم جيسون كوهين في هذا المقال النموذج الرياضي الدقيق لفهم محركات النمو الحقيقية في شركتك والتأثير فيها بفاعلية.';
  md = md.replace(/summary_ar:\s*"[^"]+"/, `summary_ar: "${newSummary}"`);
  md = md.replace(/> \*\*الملخص التنفيذي:\*\* [^\n]+/, `> **الملخص التنفيذي:** ${newSummary}`);
  fs.writeFileSync(mdPath, md, 'utf8');
  console.log('Successfully updated articles_ar/exponential-growth.md');
}
