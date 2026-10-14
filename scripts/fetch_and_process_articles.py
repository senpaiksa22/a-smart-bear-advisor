import os
import sys
import re
import json
import urllib.request
import xml.etree.ElementTree as ET

# Configure utf-8 encoding for Windows terminal output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

FEED_URL = "https://longform.asmartbear.com/chronological.xml"
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
ARTICLES_DIR = os.path.join(DATA_DIR, "articles")
INDEX_FILE = os.path.join(DATA_DIR, "knowledge_index.json")

# 5 Core Categories required by specification
CATEGORIES = [
    "استراتيجية الأعمال والنمو",
    "تطوير المنتج والعملاء",
    "التسعير ونموذج الأعمال",
    "القيادة والثقافة",
    "المقالات الفلسفية",
]

# Classification keywords mapping
CATEGORY_RULES = {
    "التسعير ونموذج الأعمال": [
        "price", "pricing", "willingness-to-pay", "business model", "freemium", "free plan",
        "margin", "ltv", "cac", "monetization", "tier", "roi", "cost", "revenue", "arpu",
        "bootstrap", "funding", "venture", "investor", "valuation", "cash flow", "economics",
        "market size", "tam"
    ],
    "تطوير المنتج والعملاء": [
        "customer", "icp", "interview", "product/market fit", "pmf", "feature", "mvp",
        "onboarding", "churn", "retention", "user", "ux", "roadmap", "bugs", "code", "tech",
        "software", "architecture", "agile", "scrum", "prototype", "feedback", "persona",
        "sales", "funnel", "conversion", "activation", "launch"
    ],
    "القيادة والثقافة": [
        "leadership", "leader", "culture", "team", "hire", "hiring", "firing", "manager",
        "management", "founder", "co-founder", "autonomy", "okr", "okrs", "goal", "meeting",
        "organization", "org", "scale", "communication", "psychology", "burnout", "stress",
        "delegation", "accountability", "values"
    ],
    "المقالات الفلسفية": [
        "happiness", "life", "wisdom", "luck", "fate", "philosophy", "stoic", "meaning",
        "death", "time", "purpose", "regret", "balance", "truth", "ego", "curiosity",
        "perspective", "mental model", "thinking", "fallacy", "paradox", "existential"
    ],
    "استراتيجية الأعمال والنمو": [
        "strategy", "growth", "competitive", "advantage", "moat", "scale", "incumbent",
        "market", "positioning", "differentiation", "pivot", "flywheel", "leverage",
        "blunder", "risk", "unfair advantage", "distribution", "long-term", "forces"
    ]
}

ARTICLE_TRANSLATIONS = {
    "you-didnt-do-it-right": {
        "title_ar": "لم تطبق الأمر بالشكل الصحيح: أزمة أطر العمل وفشل OKRs",
        "summary_ar": "أربع محاولات جادة لتطبيق الأهداف والنتائج الرئيسية (OKRs) وفشلت جميعها. عندما يفشل إطار عمل، لا تدع أحداً يقنعك بأنك 'لم تطبقه بالشكل الصحيح'؛ ربما الإطار ببساطة لا يناسبك، فكيف تختار وتصمم ما يناسبك فعلاً؟"
    },
    "confidence": {
        "title_ar": "فقدان الثقة بالنفس وكيفية استعادتها للمؤسسين",
        "summary_ar": "يمر كل رائد أعمال بلحظات حرجة يفقد فيها الثقة في قراراته ومستقبل مشروعه. كيف تميز بين الشك الطبيعي المساعد وبين الانهيار، وكيف تعيد بناء ثقتك المرتكزة على الحقائق؟"
    },
    "hire-better-than-you": {
        "title_ar": "كيف توظف أشخاصاً أكثر مهارة وذكاءً منك",
        "summary_ar": "إذا كنت أذكى شخص في شركتك فإن شركتك في خطر. دليلك العملي للتخلي عن الغرور، تقييم المرشحين المتفوقين في مجالات لا تفقه تفاصيلها، وبناء ثقافة تجذب العقول الاستثنائية."
    },
    "strategic-choices": {
        "title_ar": "الخيارات الاستراتيجية: عندما يكون كلا الخيارين ممتازاً",
        "summary_ar": "أصعب القرارات في الشركات الناشئة ليست بين الصواب والخطأ، بل بين خيارين ممتازين كلاهما يحقق فوائد كبرى. كيف تفاضل وتتخذ قراراً حاسماً وتلتزم به دون تشتيت الموارد؟"
    },
    "focus": {
        "title_ar": "خلق المساحة الذهنية والتركيز العميق للمؤسس",
        "summary_ar": "الانشغال الدائم لا يعني الإنجاز. التركيز الحقيقي يتطلب خلق مساحات فارغة في جدولك للتفكير الاستراتيجي وتفكيك المشكلات المعقدة قبل أن تتحول إلى أزمات."
    },
    "mission-vision": {
        "title_ar": "الرسالة والرؤية ومصطلحات الشركات الجوفاء",
        "summary_ar": "لماذا تبدو أغلب بيانات الرؤية والرسالة عبارات علاقات عامة لا قيمة لها؟ كيف تبني بياناً حقيقياً يوجه القرارات اليومية الصعبة ويوحد الفريق حول هدف ملموس."
    },
    "target-market": {
        "title_ar": "سوقك المستهدف ليس مجرد بيانات ديموغرافية",
        "summary_ar": "تقسيم السوق حسب العمر أو الموقع أو حجم الشركة لم يعد كافياً. التحديد الدقيق يعتمد على سلوك العميل، التحدي المشترك، والألم النفسي والمادي الذي يدفعهم للبحث عن حل."
    },
    "max-mrr": {
        "title_ar": "الحد الأقصى للإيراد الشهري المتكرر: سقف نمو شركتك",
        "summary_ar": "بناءً على معادلات اقتصاديات الوحدة ونسب التسرب والتحويل، لكل شركة سقف رياضي للإيرادات لا يمكن اختراقه إلا بتغيير النموذج أو رفع الأسعار أو إطلاق منتجات مجاورة."
    },
    "prioritization": {
        "title_ar": "تحديد الأولويات الصارم في خضم الفوضى العارمة",
        "summary_ar": "كيف تختار ما يجب إنجازه اليوم عندما تشتعل الحرائق في كل زاوية؟ أساليب عملية لعزل الضوضاء، حماية المهام ذات التأثير المضاعف، وقول 'لا' دون تردد."
    },
    "buy-both": {
        "title_ar": "عندما يشتري العميل منتج منافسك ثم يشتري منتجك أيضاً",
        "summary_ar": "المنافسة ليست لعبة صفرية دائماً. في كثير من أسواق البرمجيات، يشتري العملاء حلين متكاملين لتغطية احتياجات مختلفة. كيف تستفيد من هذه الديناميكية لتموضع منتجك بذكاء؟"
    },
    "purgatory": {
        "title_ar": "مطهر المنتجات: عندما يعجبهم منتجك لكنهم يمتنعون عن الشراء",
        "summary_ar": "العملاء يمتدحون فكرتك ويثنون على التصميم، لكنهم لا يدفعون سنتاً واحداً. هذا هو 'مطهر المنتجات'. كيف تخرج منه بتحويل الميزات اللطيفة إلى حلول لأزمات ملحة لا يمكن تجاهلها."
    },
    "never-compete-on-price": {
        "title_ar": "إياك أن تنافس على السعر المنخفض",
        "summary_ar": "المنافسة عبر حرق الأسعار سباق نحو القاع لا يفوز فيه إلا الأرخص تكلفة في العالم. كيف تبني ميزتك التنافسية حول القيمة العالية والتجربة الفريدة وتفرض أسعاراً مرتفعة بفخر؟"
    },
    "scratched-my-own-itch": {
        "title_ar": "'حللت مشكلتي الخاصة' ليست سبباً كافياً لبناء شركة",
        "summary_ar": "كثير من المطورين يبنون منتجات لأنهم واجهوا مشكلة شخصية، ثم يكتشفون أنه لا يوجد غيرهم يكترث بها. كيف تنتقل من حل مشكلتك إلى التحقق من وجود سوق مستعد للدفع؟"
    },
    "first-marketing-channel": {
        "title_ar": "كيف تختار وتتقن أول قناة تسويقية لمنتجك",
        "summary_ar": "محاولة الوجود في كل قنوات التسويق في البداية وصفة للفشل. اختر قناة واحدة تلائم طبيعة منتجك وجمهورك، وركز عليها حتى تصبح محركاً موثوقاً لتدفق العملاء."
    },
    "startup-drake-equation": {
        "title_ar": "معادلة دريك للشركات الناشئة: احتمالات النجاح الحقيقية",
        "summary_ar": "تطبيق نمط التفكير الاحتمالي على نجاح الشركات: ما هي المضاعفات والنسب الحقيقية للوصول إلى شركة مربحة ومستدامة، وأين تكمن أكبر نقاط التسريب؟"
    },
    "stealth-mode": {
        "title_ar": "أسطورة 'وضع التخفي' والاستراتيجيات الذاتية الخادعة",
        "summary_ar": "الخوف من سرقة الفكرة يدفع المؤسسين لإخفاء منتجاتهم في وضع التخفي حتى فوات الأوان. الحقيقة أن لا أحد يكترث بفكرتك حتى تثبت قيمتها، والسرعة في التعلم أهم بمراحل من السرية."
    },
    "explore-execute": {
        "title_ar": "الاستكشاف مقابل التنفيذ: متى تبحث ومتى تضاعف الرهان؟",
        "summary_ar": "في البدايات، أنت بحاجة ماسة للاستكشاف والتعلم. ولكن بعد اكتشاف النمط الناجح، يجب أن تتحول بالكامل لآلة تنفيذ منضبطة. الخلط بين هاتين المرحلتين يدمر الشركات."
    },
    "find-customers-to-interview": {
        "title_ar": "عندما لا تملك شيئاً: كيف تعثر على عملاء محتملين لمقابلتهم؟",
        "summary_ar": "الدليل العملي خطوة بخطوة للوصول إلى الغرباء وإقناعهم بالتحدث معك وإجراء مقابلات استكشافية متعمقة دون ميزانية تسويق ودون الظهور كبائع متطفل."
    },
    "brittle-points": {
        "title_ar": "نقاط الهشاشة: كيف تجعل شركتك الناشئة محصنة وقوية",
        "summary_ar": "الشركات لا تموت غالباً من المنافسة، بل من نقاط ضعف داخلية هشة: اعتماد على شخص واحد، أو عميل وحيد، أو قناة دخل مفردة. كيف تكشف هذه النقاط وتعالجها قبل فوات الأوان؟"
    },
    "saas-metric": {
        "title_ar": "المقياس الوحيد الأكثر أهمية في شركات البرمجيات (SaaS)",
        "summary_ar": "مع كثرة المقاييس ولوحات البيانات، ما هو المؤشر الجوهري الذي يعكس الصحة الحقيقية لشركتك ويكشف مصيرها المستقبلي قبل الجميع؟"
    },
    "pivot-points": {
        "title_ar": "نقاط التحول والتمحور: متى وكيف تغير مسار الشركة؟",
        "summary_ar": "التمحور ليس اعترافاً بالهزيمة بل استجابة واعية للبيانات. كيف تفرق بين الصبر المحمود على الفكرة وبين العناد المدمر، ومتى تقرر قلب الطاولة وإعادة رسم النموذج؟"
    },
    "ramen-profitable": {
        "title_ar": "الوصول للربحية الأولية وتغطية التكاليف من اليوم الأول",
        "summary_ar": "تحقيق الاستقلال المالي والوصول لنقطة التعادل يغير كل شيء في نفسية المؤسس وقوته التفاوضية. لماذا يجب أن يكون هدفك الأول هو تغطية نفقاتك المعيشية فوراً؟"
    },
    "tension-autonomy-admin": {
        "title_ar": "الصراع بين الكفاءة الإدارية واستقلالية الفرق",
        "summary_ar": "كلما كبرت الشركة زادت الإجراءات والاجتماعات لضبط الجودة، لكن على حساب سرعة وابتكار الأفراد. كيف تدير هذا التوتر الحتمي وتمنع البيروقراطية من خنق روح المبادرة؟"
    },
    "annual-prepay": {
        "title_ar": "كيف يصنع الدفع المسبق السنوي ميزانية تسويقية لا نهائية",
        "summary_ar": "تحصيل الاشتراكات مقدماً لسنة كاملة يوفر سيولة نقدية فورية تمكنك من إعادة استثمارها في الإعلانات وتطوير المنتج دون الحاجة لقروض أو تمويل خارجي يخفف ملكيتك."
    },
    "conflicting-choices": {
        "title_ar": "'تحقيق التوازن' ليس دائماً الإجابة الصحيحة",
        "summary_ar": "الادعاء بأن الحل يكمن في 'الوسطية والتوازن' غالباً ما يكون هروباً من اتخاذ قرار شجاع. الاستراتيجيات العظيمة تتطلب التميز المتطرف في جانب معين وقبول القصور في جانب آخر."
    },
    "three-languages": {
        "title_ar": "تفكيك اللغات الثلاث: العميل، المنتج، ونموذج العمل",
        "summary_ar": "المشكلات تنشأ عندما يتحدث فريق التسويق بلغة العميل، ويتحدث المطورون بلغة الميزات البرمجية، وتتحدث الإدارة بلغة الإيرادات. كيف تترجم وتوحد هذه اللغات الثلاث؟"
    },
    "adjacency": {
        "title_ar": "مصفوفة المجاورة: كيف تتوسع وتنمو بعد ملاءمة المنتج للسوق؟",
        "summary_ar": "بعد تحقيق PMF لمنتجك الأساسي، ما هي الخطوة التالية؟ التوسع نحو عملاء جدد بنفس المنتج، أو بيع منتجات جديدة لنفس العملاء؟ دليلك لمصفوفة التوسع المحسوبة."
    },
    "avoid-blundering": {
        "title_ar": "تجنب الأخطاء الفادحة: 80% من الاستراتيجية الفائزة",
        "summary_ar": "في الشطرنج والتنس وريادة الأعمال، الفائز الحقيقي هو من يرتكب أقل عدد من الأخطاء غير الإجبارية. تعرف على القواعد الذهبية لتفادي القرارات الكارثية وضمان البقاء."
    },
    "perseverance": {
        "title_ar": "أصحاب الرؤى الملهمون أم الحمقى العنيدون؟",
        "summary_ar": "الخط الفاصل بين الإصرار الأسطوري والعناد الأعمى رفيع للغاية. كيف تعرف ما إذا كان استمرارك في وجه الصعاب بطولة ستؤتي ثمارها أم إهداراً للوقت في وهم لا وجود له؟"
    },
    "ai-startups": {
        "title_ar": "الشركات الناشئة في عصر الذكاء الاصطناعي: هذه المرة الأمر مختلف",
        "summary_ar": "لماذا لا تنطبق قواعد البرمجيات التقليدية بالكامل على منتجات الذكاء الاصطناعي؟ تكلفة الاستدلال (Inference Cost)، انهيار حواجز الدخول، وبناء خنادق الدفاع الحقيقية."
    },
    "startup-beats-incumbent": {
        "title_ar": "كيف تتغلب الشركات الناشئة الصغيرة على العمالقة الراسخين",
        "summary_ar": "الشركات الكبرى تمتلك المليارات وجيوش الموظفين، لكنها مقيدة ببطء القرار والخوف على عملائها الحاليين. كيف تستغل سرعة حركتك وجرأتك لانتزاع السوق من تحت أقدامهم؟"
    },
    "icp-ideal-customer-persona": {
        "title_ar": "البيع لـ 'كارول': لماذا يجلب تحديد العميل المثالي 10 أضعاف العملاء؟",
        "summary_ar": "عندما تستهدف الجميع، تبدو رسالتك باهتة ومملة للجميع. عندما تخاطب شخصية محددة بتفاصيل دقيقة، يشعر العميل بأنك بنيت المنتج خصيصاً له وحده، وتتضاعف مبيعاتك بشكل غير متوقع."
    },
    "product-market-fit-formula": {
        "title_ar": "خارطة الطريق نحو ملاءمة المنتج للسوق (PMF)... ربما!",
        "summary_ar": "لا توجد صيغة سحرية حتمية، ولكن هناك إشارات واضحة ومسار منهجي يرفع احتمالات وصولك لنقطة الانفجار حيث يسحب السوق منتجك بقوة أسرع مما يمكنك تلبيته."
    },
    "scale": {
        "title_ar": "القوى الأساسية المحركة للتوسع والنمو الكبير",
        "summary_ar": "عندما تتجاوز الشركة مرحلة البدايات، تتغير قواعد اللعبة تماماً. ما هي القوى الرياضية والتنظيمية التي تدفع النمو، وكيف تحافظ على روح الابتكار مع التوسع؟"
    },
    "great-strategy": {
        "title_ar": "ما الذي يجعل الاستراتيجية عظيمة حقاً؟",
        "summary_ar": "الاستراتيجية ليست قائمة أمنيات أو أهداف أرقام، بل هي نظرية متماسكة حول كيفية الفوز، مقترنة بخيارات صعبة تفرض عليك التخلي عن أشياء مغرية من أجل التركيز المطلق."
    },
    "product-metrics": {
        "title_ar": "اختيار مؤشرات الأداء الصحيحة للمنتج (KPIs)",
        "summary_ar": "قياس المقاييس الخاطئة يقود الفرق لاتخاذ قرارات مدمرة. كيف تحدد المقاييس التي تعبر عن القيمة الحقيقية للعميل وترتبط ارتباطاً وثيقاً بنمو الإيرادات واستقرار الشركة؟"
    },
    "leverage": {
        "title_ar": "الأنواع الثلاثة للروافع التي ترتكز عليها الاستراتيجيات الفعالة",
        "summary_ar": "كيف تحقق نتائج تفوق حجمك بمائة ضعف؟ شرح تفصيلي للروافع الثلاث: رافعة الكود والأنظمة، رافعة رأس المال، ورافعة الشبكات والسمعة المؤسسية."
    },
    "needs-stack": {
        "title_ar": "استخدام هرم الاحتياجات لبناء استراتيجية تنافسية كاسحة",
        "summary_ar": "كيف ترتب أولويات ميزات منتجك استناداً إلى هرم احتياجات العميل الأساسية: من الوظيفة الأساسية والاستقرار، وصولاً للسرعة والمتعة والقيمة الفريدة."
    },
    "willingness-to-pay": {
        "title_ar": "الاستعداد للدفع: بناء ميزة تنافسية دائمة للأسباب الصحيحة",
        "summary_ar": "العميل المستعد للدفع بسخاء هو أفضل شريك في رحلة شركتك. كيف تصمم منتجك وتحدد أسعارك استناداً إلى القيمة الاقتصادية المضافة وليس التكلفة الهامشية؟"
    }
}

TITLE_PATTERNS = [
    (r'\bProduct/Market Fit\b', 'ملاءمة المنتج للسوق'),
    (r'\bProduct-Market Fit\b', 'ملاءمة المنتج للسوق'),
    (r'\bPMF\b', 'ملاءمة المنتج للسوق'),
    (r'\bIdeal Customer Persona\b', 'شخصية العميل المثالي'),
    (r'\bCustomer\b', 'العميل'),
    (r'\bCustomers\b', 'العملاء'),
    (r'\bPricing\b', 'التسعير'),
    (r'\bPrice\b', 'السعر'),
    (r'\bStrategy\b', 'الاستراتيجية'),
    (r'\bStrategic\b', 'الاستراتيجي'),
    (r'\bLeadership\b', 'القيادة'),
    (r'\bLeader\b', 'القائد'),
    (r'\bCulture\b', 'الثقافة المؤسسية'),
    (r'\bStartups?\b', 'الشركات الناشئة'),
    (r'\bScale\b', 'التوسع والنمو'),
    (r'\bGrowth\b', 'النمو'),
    (r'\bHiring\b', 'التوظيف'),
    (r'\bHire\b', 'توظيف'),
    (r'\bFounder\b', 'المؤسس'),
    (r'\bFounders\b', 'المؤسسون'),
    (r'\bBootstrapping\b', 'التمويل الذاتي'),
    (r'\bBootstrapped\b', 'التمويل الذاتي'),
    (r'\bBusiness Model\b', 'نموذج العمل'),
    (r'\bMetric\b', 'المؤشر'),
    (r'\bMetrics\b', 'مؤشرات الأداء'),
    (r'\bDecisions?\b', 'القرارات'),
    (r'\bFailure\b', 'الفشل'),
    (r'\bFail\b', 'الفشل'),
    (r'\bSuccess\b', 'النجاح'),
    (r'\bSaaS\b', 'برمجيات السحاب SaaS'),
    (r'\bAI\b', 'الذكاء الاصطناعي'),
    (r'\bMoney\b', 'المال'),
    (r'\bTime\b', 'الوقت'),
    (r'\bAdvice\b', 'نصائح استشارية'),
    (r'\bInterview\b', 'مقابلات'),
    (r'\bInterviewing\b', 'إجراء المقابلات'),
    (r'\bFeatures?\b', 'الميزات البرمجية'),
    (r'\bRoadmap\b', 'خارطة الطريق'),
    (r'\bWhy\b', 'لماذا'),
    (r'\bHow to\b', 'كيف'),
    (r'\bHow\b', 'كيفية'),
    (r'\bWhat\b', 'ماذا'),
    (r'\bWhen\b', 'متى'),
]

def determine_category(title, summary, text):
    content_lower = f"{title} {summary} {text[:3000]}".lower()
    scores = {cat: 0 for cat in CATEGORIES}
    
    for cat, kws in CATEGORY_RULES.items():
        for kw in kws:
            matches = len(re.findall(r'\b' + re.escape(kw) + r'\b', content_lower))
            if matches > 0:
                if kw in title.lower():
                    scores[cat] += matches * 4
                elif kw in summary.lower():
                    scores[cat] += matches * 2
                else:
                    scores[cat] += matches
                    
    best_cat = max(scores, key=scores.get)
    if scores[best_cat] == 0:
        return "استراتيجية الأعمال والنمو"
    return best_cat

def clean_markdown_content(raw_text):
    if not raw_text:
        return ""
    text = re.sub(r'<(script|style).*?</\1>', '', raw_text, flags=re.DOTALL)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def clean_subtopic_takeaway(takeaway):
    if not takeaway:
        return ""
    t = re.sub(r'!?\[.*?\]\([^\)]*\)', '', takeaway)
    t = re.sub(r'https?://\S+', '', t)
    t = re.sub(r'!?[A-Za-z0-9_\-\s]*\(https?://[^\)]+\)', '', t)
    t = re.sub(r'[*_`#<>]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t[:220]

def clean_subtopic_keywords(keywords):
    clean_kws = []
    for kw in keywords:
        if 'http' in kw.lower() or 'png' in kw.lower() or 'jpg' in kw.lower() or len(kw) > 25:
            continue
        k = re.sub(r'[^a-zA-Z0-9\u0600-\u06FF]', '', kw)
        if len(k) >= 3:
            clean_kws.append(k)
    return clean_kws[:5]

def extract_subtopics_from_text(title, text, summary):
    headings = re.findall(r'^(#{1,3})\s+(.+)$', text, flags=re.MULTILINE)
    subtopics = []
    
    if headings and len(headings) >= 2:
        for idx, (level, h_text) in enumerate(headings[:6], 1):
            cleaned_h = re.sub(r'[*_`]', '', h_text).strip()
            escaped_h = re.escape(h_text)
            pattern = rf'{escaped_h}\s*\n+([^#\n]+(?:\n+[^#\n]+)?)'
            match = re.search(pattern, text)
            raw_takeaway = match.group(1).strip() if match else cleaned_h
            takeaway = clean_subtopic_takeaway(raw_takeaway)
            
            words = [w.strip('.,;:"!?()[]{}') for w in (cleaned_h + " " + takeaway).split()]
            keywords = clean_subtopic_keywords(list(dict.fromkeys(words)))
            
            subtopics.append({
                "num": idx,
                "title": cleaned_h,
                "takeaway": takeaway,
                "keywords": keywords
            })
    else:
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 80 and not p.startswith('!') and not p.startswith('<')]
        if not paragraphs:
            paragraphs = [summary]
        for idx, p in enumerate(paragraphs[:4], 1):
            first_sentence = p.split('.')[0].strip()
            takeaway = clean_subtopic_takeaway(p)
            words = [w.strip('.,;:"!?()[]{}') for w in p.split()]
            keywords = clean_subtopic_keywords(list(dict.fromkeys(words)))
            subtopics.append({
                "num": idx,
                "title": first_sentence[:80] + ("..." if len(first_sentence) > 80 else ""),
                "takeaway": takeaway,
                "keywords": keywords
            })
            
    return subtopics

def translate_title_smartly(slug, title_en):
    if slug in ARTICLE_TRANSLATIONS:
        return ARTICLE_TRANSLATIONS[slug]["title_ar"]
    title_ar = title_en
    for pattern, replacement in TITLE_PATTERNS:
        title_ar = re.sub(pattern, replacement, title_ar, flags=re.IGNORECASE)
    if title_ar == title_en:
        return f"رؤية وتجربة: {title_en}"
    return title_ar

def translate_summary_smartly(slug, summary_en, category, title_ar):
    if slug in ARTICLE_TRANSLATIONS and "summary_ar" in ARTICLE_TRANSLATIONS[slug]:
        return ARTICLE_TRANSLATIONS[slug]["summary_ar"]
    if summary_en and len(summary_en) > 20:
        cleaned_desc = re.sub(r'[*_`]', '', summary_en)
        return f"مقالة استراتيجية معمقة من جيسون كوهين ضمن محور '{category}' تتناول أبعاد '{title_ar}'، وتفكك الآليات والدروس المستفادة: {cleaned_desc}"
    return f"مقالة استشارية وتطبيقية من جيسون كوهين تركز على '{title_ar}' وتقدم تحليلاً دقيقاً وحلولاً واقعية لمؤسسي الشركات والمبرمجين."

def main():
    os.makedirs(ARTICLES_DIR, exist_ok=True)
    
    print(f"Fetching RSS feed from: {FEED_URL}...")
    req = urllib.request.Request(FEED_URL, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        xml_data = resp.read()
        
    print(f"Feed fetched: {len(xml_data)} bytes. Parsing XML...")
    root = ET.fromstring(xml_data)
    items = root.findall('.//item')
    print(f"Total articles found in feed: {len(items)}")
    
    knowledge_index = []
    
    for idx, item in enumerate(items, 1):
        title_elem = item.find('title')
        title_en = title_elem.text.strip() if title_elem is not None and title_elem.text else f"Article {idx}"
        
        link_elem = item.find('link')
        url = link_elem.text.strip() if link_elem is not None and link_elem.text else ""
        slug = url.strip('/').split('/')[-1] if url else re.sub(r'[^a-zA-Z0-9]+', '-', title_en.lower()).strip('-')
        
        pubdate_elem = item.find('pubDate')
        pubdate = pubdate_elem.text.strip() if pubdate_elem is not None and pubdate_elem.text else ""
        
        desc_elem = item.find('description')
        desc_en = desc_elem.text.strip() if desc_elem is not None and desc_elem.text else ""
        
        encoded_elem = item.find('{http://purl.org/rss/1.0/modules/content/}encoded')
        raw_content = encoded_elem.text if encoded_elem is not None and encoded_elem.text else desc_en
        
        clean_content = clean_markdown_content(raw_content)
        category = determine_category(title_en, desc_en, clean_content)
        title_ar = translate_title_smartly(slug, title_en)
        summary_ar = translate_summary_smartly(slug, desc_en, category, title_ar)
        subtopics = extract_subtopics_from_text(title_en, clean_content, summary_ar)
        
        # Clean article body from redundant top title if already there
        body_content = re.sub(rf'^#\s+{re.escape(title_en)}\s*\n*', '', clean_content, flags=re.IGNORECASE)
        
        article_filename = f"{slug}.md"
        article_path = os.path.join(ARTICLES_DIR, article_filename)
        
        frontmatter = f"""---
id: {idx}
title: "{title_en.replace('"', '\\"')}"
title_ar: "{title_ar.replace('"', '\\"')}"
slug: "{slug}"
url: "{url}"
pubDate: "{pubdate}"
category: "{category}"
summary: "{summary_ar.replace('"', '\\"')}"
---

# {title_en}
### {title_ar}

> **الملخص التنفيذي:** {summary_ar}
> **المحور الأساسي:** {category}
> **رابط المقال الأصلي:** [{url}]({url})

{body_content.strip()}
"""
        with open(article_path, 'w', encoding='utf-8') as f:
            f.write(frontmatter)
            
        knowledge_index.append({
            "id": idx,
            "slug": slug,
            "url": url,
            "title_en": title_en,
            "title_ar": title_ar,
            "published_date": pubdate,
            "category": category,
            "summary": summary_ar,
            "summary_en": desc_en,
            "subtopics": subtopics,
            "file_path": f"data/articles/{article_filename}"
        })
        
    print(f"Processed and cleanly saved {len(knowledge_index)} articles into {ARTICLES_DIR}")
    
    cat_stats = {}
    for item in knowledge_index:
        c = item["category"]
        cat_stats[c] = cat_stats.get(c, 0) + 1
        
    print("\n--- توزيع المقالات حسب المحاور الخمسة ---")
    for cat, count in cat_stats.items():
        print(f"• {cat}: {count} مقال")
        
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(knowledge_index, f, ensure_ascii=False, indent=2)
        
    print(f"\nKnowledge index successfully generated at: {INDEX_FILE}")

if __name__ == "__main__":
    main()
