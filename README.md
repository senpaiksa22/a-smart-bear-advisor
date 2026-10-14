# 🐻 مستشار الدب الذكي — A Smart Bear Advisor
> منصة ويب تفاعلية فائقة الأمان، ثنائية اللغة (عربي / إنجليزي)، مبنية بالكامل على مقالات وفلسفة رائد الأعمال جيسون كوهين (**Jason Cohen**) من مدونة [*A Smart Bear*](https://longform.asmartbear.com).

---

## 🌟 أبرز مميزات التطبيق

1. **قاعدة معرفية شاملة وثرية:**
   - **213 مقالاً كاملاً** مجلوباً ومفهرساً بدقة متناهية.
   - **دعم ثنائي اللغة 100%:** النص الأصلي بالإنجليزية كاملاً دون اختصار، إلى جانب ترجمة عربية احترافية رصينة لكل مقال.
   - **تصنيف دلالي ديناميكي (Dynamic Clustering):** اكتشاف تلقائي لـ **14 محوراً عضوياً** تلخص رحلة تأسيس الشركات الناشئة، ملاءمة المنتج للسوق، استراتيجيات التسعير، والميزة التنافسية.

2. **واجهة تفاعلية بصرية حديثة:**
   - **خريطة مفاهيم تفاعلية (Interactive Mind Map):** شجرة بصرية متجاوبة تتيح التكبير والتصغير وتصفح المحاور والمقالات بسلاسة.
   - **محرك بحث فوري (`Cmd+K` / `Ctrl+K`):** بحث ذكي في العناوين والملخصات والمحاور والكلمات المفتاحية بكلا اللغتين.
   - **لوحة قراءة جانبية منزلقة (Article Drawer):** قراءة سريعة لملخص المقال ومحاوره، مع إمكانية قراءة المقال كاملاً باللغة المختارة بزر تبديل فوري.

3. **مستشار ذكي يحاكي فلسفة جيسون كوهين (Jason Cohen AI Advisor):**
   - **محدد النماذج الأربعة (4-Model Switcher):**
     * ⚡ **Gemini 3.5 Flash-Lite** — للإجابات السريعة والملخصات الفورية.
     * 🎯 **Gemini 3.8 Flash** — المساعد الشامل للمهام اليومية المتوازنة.
     * 🧠 **Gemini 3.1 Pro** — التفكير العميق والتحليل المنطقي والمالي.
     * 🚀 **Gemini 4 Argon** — المهام المعقدة وتفكيك النماذج الاستراتيجية الصعبة.
   - **توجيه سياقي ذكي:** زر *"استشر جيسون حول هذا المبدأ"* يربط المقال المختار مباشرة بجلسة الاستشارة.
   - **سجل محادثات سحابي خاص:** حفظ وإدارة واسترجاع المحادثات السابقة وحذفها بخصوصية تامة.
   - **تصدير المحادثات بصيغة Markdown:** تنزيل جلسة الاستشارة كاملة بضغطة زر كملف `.md` مفهرس.

---

## 🛡️ المواصفات الأمنية الفائقة (Enterprise-Grade Security)

- **توافق كامل مع متصفح Brave ومديري كلمات المرور (1Password, Bitwarden, etc.):**
  * استخدام وسوم HTML5 القياسية المعيارية (`<form>`, `name="username"`, `autocomplete="username"`, `autocomplete="current-password"`, `autocomplete="new-password"`).
  * لا قيود تعقيد مصطنعة على اسم المستخدم أو كلمة المرور (يُقبل أي طول حتى لو حرف أو رقم واحد).
- **حماية وسرية الـ APIs بنسبة 100% (Zero Client Exposure):**
  * مفتاح Gemini API ومفاتيح Supabase مشفرة ومحمية بالكامل داخل سيرفر Next.js الداخلي ولا يمكن لأي متصفح أو عميل الاطلاع عليها أو استدعاؤها.
- **تشفير كلمات المرور (Bcrypt Salted Hashing):**
  * تشفير كلمات المرور داخل جدول `app_users` باستخدام `bcrypt` مع Salt عشوائي قوي (`$2b$10$...`). لا تخزن أي كلمة مرور كنص عادي نهائياً.
- **إدارة الجلسات عبر ملفات تعريف ارتباط آمنة (Secure HttpOnly JWT Cookies):**
  * تخزين التوكن في ملف تعريف ارتباط يحمل سمات `HttpOnly`, `SameSite=Strict`, `Secure` لمنع هجمات XSS وسرقة الجلسات.
- **عزل صارم للبيانات (Multi-Tenant Isolation):**
  * لا يمكن لأي مستخدم قراءة أو الوصول إلى محادثات أو رسائل مستخدم آخر، مع تطبيق سياسات الحماية على مستوى قواعد البيانات (RLS) ومسارات الـ API.
- **الحد من الاستنزاف والتخمين (Rate Limiting):**
  * طبقة حماية برمجية تمنع التخمين العشوائي على مسار تسجيل الدخول والاستنزاف المفرط لمسار الشات الذكي.

---

## 🚀 التثبيت والتشغيل المحلي (Local Setup)

### 1. المتطلبات الأساسية
- Node.js (الإصدار 18 فما فوق).
- Python 3.9 فما فوق (لتشغيل سكربتات الاختبار).

### 2. تثبيت الحزم
```bash
npm install
```

### 3. إعداد متغيرات البيئة
قم بإنشاء ملف `.env.local` بناءً على `.env.example`:
```bash
cp .env.example .env.local
```
ثم أضف مفتاح Gemini ومفتاح التشفير السري:
```env
GEMINI_API_KEY=AIzaSy...
JWT_SECRET=super_secret_jwt_random_string_32chars
```
*(ملاحظة: إذا لم تقم بإدخال بيانات Supabase، سيعمل التطبيق تلقائياً وبشكل مرن وسريع عبر قاعدة البيانات المحلية المدمجة `data/.app_database.json`)*.

### 4. تشغيل خادم التطوير
```bash
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

### 5. تشغيل الاختبارات الآلية
```bash
python scripts/test_auth.py
python scripts/test_advisor_chat.py
```

---

## 🌐 النشر السحابي (Deployment on Vercel & Supabase)

### الخطوة 1: تجهيز قاعدة بيانات Supabase
1. أنشئ مشروعاً جديداً مجانياً على [Supabase](https://supabase.com).
2. انتقل إلى **SQL Editor** ونفذ الكود التالي لإنشاء الجداول وسياسات الأمان:

```sql
-- 1. جدول المستخدمين
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول المحادثات
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  model_used TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول الرسائل
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- الفهارس للأداء الفائق
CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at ASC);

-- تفعيل سياسات الأمان على مستوى الصف (RLS)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

### الخطوة 2: النشر على Vercel
1. ارفع الكود إلى مستودع GitHub الخاص بك.
2. توجه إلى [Vercel](https://vercel.com) واختر **Add New Project**.
3. أضف متغيرات البيئة التالية في إعدادات المشروع (Environment Variables):
   - `GEMINI_API_KEY`: مفتاح جوجل جيميناي الخاص بك.
   - `SUPABASE_URL`: رابط مشروع Supabase الخاص بك.
   - `SUPABASE_SERVICE_ROLE_KEY`: المفتاح السري لمشروع Supabase (Service Role Key).
   - `JWT_SECRET`: سلسلة عشوائية قوية لتشفير ملفات الجلسات (32 حرفاً أو أكثر).
4. انقر فوق **Deploy**، وسيكون تطبيقك جاهزاً للعمل في غضون ثوانٍ!

---

## 📂 بنية المشروع (Project Architecture)

```text
├── app/
│   ├── api/
│   │   ├── articles/          # جلب المقالات والمحتوى ثنائي اللغة
│   │   ├── auth/              # تسجيل الدخول، إنشاء الحساب، الجلسات، الخروج
│   │   ├── chat/              # سيرفر الشات الاستشاري مع جيسون كوهين
│   │   └── conversations/     # إدارة المحادثات والرسائل وحذفها
│   ├── globals.css            # أنماط Tailwind والتصميم العصري
│   ├── layout.tsx             # الغلاف الأساسي والخطوط ودعم RTL
│   └── page.tsx               # الصفحة الرئيسية التفاعلية
├── components/
│   ├── AdvisorPanel.tsx       # لوحة الشات الاستشاري (4 نماذج + تاريخ + تصدير)
│   ├── ArticleDrawer.tsx      # قارئ المقالات المنزلق ثنائي اللغة
│   ├── AuthModal.tsx          # نافذة المصادقة القياسية المتوافقة مع مديري كلمات المرور
│   ├── MindMap.tsx            # خريطة المفاهيم التفاعلية (SVG + Zoom + Filter)
│   ├── Navbar.tsx             # شريط التنقل العلوي وتبديل اللغة والوضع الليلي
│   └── SearchModal.tsx        # محرك البحث الفوري (Cmd+K)
├── data/
│   ├── articles_en/           # 213 مقالاً بالإنجليزية الأصلية
│   ├── articles_ar/           # 213 مقالاً مترجماً للعربية بدقة
│   ├── clusters.json          # 14 محوراً عضوياً مكتشفاً دلالياً
│   └── knowledge_index.json   # الفهرس الشامل ثنائي اللغة
├── knowledge/
│   └── jason_cohen_persona.md # الدستور المعرفي والإرشادي لشخصية جيسون كوهين
├── lib/
│   ├── auth.ts                # تشفير Bcrypt وجلسات JWT والـ Rate Limiting
│   ├── db.ts                  # وسيط قاعدة البيانات (Supabase + Fallback محلي)
│   ├── gemini.ts              # محرك استدعاء نماذج Gemini والـ RAG الداخلي
│   ├── models.ts              # إعدادات النماذج الأربعة ومواصفاتها
│   └── types.ts               # تعريفات الأنواع (TypeScript Interfaces)
└── scripts/
    ├── test_auth.py           # اختبار شامل للأمان والمصادقة
    └── test_advisor_chat.py   # اختبار شامل لدورة حياة الشات والاستشارة
```

---

## 📄 الترخيص
تم تطوير هذا المشروع للأغراض التعليمية والاستشارية الريادية اعتماداً على الفكر الإداري والتقني الرائد لـ **Jason Cohen**.
جميع حقوق المقالات الفكرية محفوظة لمدونة [*A Smart Bear*](https://longform.asmartbear.com).
