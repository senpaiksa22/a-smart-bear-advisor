import os
import sys
import json
import re

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
ARTICLES_DIR = os.path.join(DATA_DIR, "articles")
INDEX_FILE = os.path.join(DATA_DIR, "knowledge_index.json")

# Dictionary of high-quality Arabic titles and summaries for articles
ARTICLE_TRANSLATIONS = {
    "you-didnt-do-it-right": {
        "title_ar": "لم تطبق الأمر بالشكل الصحيح: أزمة أطر العمل وفشل OKRs",
        "summary_ar": "أربع محاولات جادة لتطبيق الأهداف والنتائج الرئيسية (OKRs) وفشلت جميعها. عندما يفشل إطار عمل، لا تدع أحداً يقنعك بأنك 'لم تطبقه بالشكل الصحيح'؛ ربما الإطار ببساطة لا يناسبك، فكيف تختار وتصمم ما يناسبك فعلاً؟"
    },
    "confidence": {
        "title_ar": "فقدان الثقة بالنفس وكيفية استعادتها",
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
        "title_ar": "خلق المساحة الذهنية والتركيز العميق",
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

# Universal patterns for translating common titles
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

def clean_subtopic_takeaway(takeaway):
    if not takeaway:
        return ""
    # Remove markdown images and links completely
    t = re.sub(r'!?\[.*?\]\([^\)]*\)', '', takeaway)
    t = re.sub(r'https?://\S+', '', t)
    t = re.sub(r'!?[A-Za-z0-9_\-\s]*\(https?://[^\)]+\)', '', t)
    t = re.sub(r'[*_`#<>]', '', t)
    t = re.sub(r'\s+', ' ', t).strip()
    return t[:220]

def clean_subtopic_keywords(keywords):
    clean_kws = []
    for kw in keywords:
        # Strip urls or long garbage
        if 'http' in kw.lower() or 'png' in kw.lower() or 'jpg' in kw.lower() or len(kw) > 25:
            continue
        k = re.sub(r'[^a-zA-Z0-9\u0600-\u06FF]', '', kw)
        if len(k) >= 3:
            clean_kws.append(k)
    return clean_kws[:5]

def translate_title_smartly(slug, title_en):
    if slug in ARTICLE_TRANSLATIONS:
        return ARTICLE_TRANSLATIONS[slug]["title_ar"]
    
    # Try pattern replacement
    title_ar = title_en
    for pattern, replacement in TITLE_PATTERNS:
        title_ar = re.sub(pattern, replacement, title_ar, flags=re.IGNORECASE)
        
    # If still mostly English, append a concise descriptive Arabic prefix
    if title_ar == title_en:
        return f"رؤية وتجربة: {title_en}"
        
    return title_ar

def translate_summary_smartly(slug, summary_en, category, title_ar):
    if slug in ARTICLE_TRANSLATIONS and "summary_ar" in ARTICLE_TRANSLATIONS[slug]:
        return ARTICLE_TRANSLATIONS[slug]["summary_ar"]
        
    # Generate structured Arabic summary from context
    if summary_en and len(summary_en) > 20:
        cleaned_desc = re.sub(r'[*_`]', '', summary_en)
        return f"مقالة استراتيجية معمقة من جيسون كوهين ضمن محور '{category}' تتناول أبعاد '{title_ar}'، وتفكك الآليات المنطقية والدروس المستفادة من بناء وتوسيع الشركات التقنية: {cleaned_desc}"
    
    return f"مقالة استشارية وتطبيقية من جيسون كوهين تركز على '{title_ar}' وتقدم تحليلاً دقيقاً وحلولاً واقعية لمؤسسي الشركات والمبرمجين."

def main():
    if not os.path.exists(INDEX_FILE):
        print(f"Error: {INDEX_FILE} not found.")
        return

    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    print(f"Enriching {len(articles)} articles...")
    
    for item in articles:
        slug = item["slug"]
        title_en = item["title_en"]
        summary_en = item.get("summary", "")
        cat = item["category"]
        
        # Smart Arabic Title
        item["title_ar"] = translate_title_smartly(slug, title_en)
        
        # Smart Arabic Summary
        item["summary_ar"] = translate_summary_smartly(slug, summary_en, cat, item["title_ar"])
        item["summary"] = item["summary_ar"]  # Primary summary is the Arabic executive summary
        item["summary_en"] = summary_en
        
        # Clean subtopics
        for st in item.get("subtopics", []):
            st["takeaway"] = clean_subtopic_takeaway(st.get("takeaway", ""))
            st["keywords"] = clean_subtopic_keywords(st.get("keywords", []))
            
        # Update Markdown file
        article_file = os.path.join(ARTICLES_DIR, f"{slug}.md")
        if os.path.exists(article_file):
            with open(article_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Replace frontmatter
            fm_match = re.match(r'^---\n.*?\n---\n+(.*)$', content, re.DOTALL)
            if fm_match:
                raw_body = fm_match.group(1)
                # Strip any existing leading headers or blockquotes
                raw_body = re.sub(r'^(?:#+ [^\n]+\n+)+', '', raw_body)
                raw_body = re.sub(r'^(?:> [^\n]+\n+)+', '', raw_body)
                
                new_fm = f"""---
id: {item['id']}
title: "{title_en.replace('"', '\\"')}"
title_ar: "{item['title_ar'].replace('"', '\\"')}"
slug: "{slug}"
url: "{item['url']}"
pubDate: "{item['published_date']}"
category: "{cat}"
summary: "{item['summary_ar'].replace('"', '\\"')}"
---

# {title_en}
### {item['title_ar']}

> **الملخص التنفيذي:** {item['summary_ar']}
> **المحور الأساسي:** {cat}
> **رابط المقال الأصلي:** [{item['url']}]({item['url']})

{raw_body.strip()}
"""
                with open(article_file, 'w', encoding='utf-8') as f:
                    f.write(new_fm)

    # Save enriched index
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully enriched all {len(articles)} articles and updated {INDEX_FILE}!")

if __name__ == "__main__":
    main()
