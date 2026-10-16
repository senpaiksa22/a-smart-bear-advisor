"""
Comprehensive Arabic Translation Polisher
Uses Gemini API to:
1. Fix knowledge_index.json subtopics (translate English-only, fix broken Arabic)
2. Fix truncated summaries
3. Polish article bodies for literal translation patterns
"""
import os
import sys
import json
import time
import re
import urllib.request
import urllib.parse
import hashlib

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(BASE_DIR, 'data', 'knowledge_index.json')
AR_DIR = os.path.join(BASE_DIR, 'data', 'articles_ar')
EN_DIR = os.path.join(BASE_DIR, 'data', 'articles_en')
CACHE_PATH = os.path.join(BASE_DIR, 'data', '.polish_cache.json')

# Load .env.local for API key
def load_env():
    env_path = os.path.join(BASE_DIR, '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    os.environ[key.strip()] = val.strip()

load_env()
API_KEY = os.environ.get('GEMINI_API_KEY', '')
if not API_KEY:
    print("ERROR: GEMINI_API_KEY not found in .env.local")
    sys.exit(1)

# Cache for polished translations
polish_cache = {}
if os.path.exists(CACHE_PATH):
    try:
        with open(CACHE_PATH, 'r', encoding='utf-8') as f:
            polish_cache = json.load(f)
    except:
        polish_cache = {}

def save_cache():
    with open(CACHE_PATH, 'w', encoding='utf-8') as f:
        json.dump(polish_cache, f, ensure_ascii=False)

def cache_key(text):
    return hashlib.md5(text.encode('utf-8')).hexdigest()

def call_gemini(prompt, model="gemini-2.5-flash", max_retries=3):
    """Call Gemini API with retry logic."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"
    
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 4096
        }
    }).encode('utf-8')
    
    headers = {"Content-Type": "application/json"}
    
    for attempt in range(max_retries):
        try:
            req = urllib.request.Request(url, data=payload, headers=headers, method='POST')
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if 'candidates' in data and data['candidates']:
                    parts = data['candidates'][0].get('content', {}).get('parts', [])
                    if parts:
                        return parts[0].get('text', '')
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 3
                print(f"   ⏳ Retry {attempt+1}/{max_retries} after {wait_time}s: {str(e)[:60]}")
                time.sleep(wait_time)
            else:
                print(f"   ❌ Failed after {max_retries} attempts: {str(e)[:80]}")
                return None
    return None

def is_arabic(text):
    return bool(re.search(r'[\u0600-\u06FF]', text)) if text else False

def translate_subtopic_batch(batch):
    """Translate a batch of English subtopic titles+takeaways to Arabic."""
    prompt_parts = []
    for i, item in enumerate(batch):
        prompt_parts.append(f"""--- Item {i+1} ---
Title (EN): {item['title']}
Takeaway (EN): {item['takeaway']}""")
    
    prompt = f"""أنت مترجم محترف متخصص في ريادة الأعمال والتقنية. ترجم العناوين والخلاصات التالية من الإنجليزية إلى العربية بأسلوب فكري رصين وبليغ.

القواعد الصارمة:
1. ترجم المعنى والمقصود وليس الكلمات حرفياً
2. التعابير الاصطلاحية (idioms) يجب ترجمتها بمعناها العربي وليس حرفياً (مثل: "rule of thumb" = "قاعدة عامة" وليس "قاعدة الإبهام")
3. اجعل العربية سلسة كأن كاتباً عربياً كتبها من الأساس
4. المصطلحات التقنية الشائعة (OKRs, SaaS, PMF, ROI, MRR, CAC) تُبقى كما هي
5. أسماء الأشخاص والشركات تُبقى كما هي بالإنجليزية
6. لا تضف أي شرح أو تعليق، فقط الترجمة

أجب بتنسيق JSON فقط (بدون أي نص قبله أو بعده):
[
  {{"title_ar": "...", "takeaway_ar": "..."}},
  ...
]

{chr(10).join(prompt_parts)}"""
    
    result = call_gemini(prompt)
    if not result:
        return None
    
    # Extract JSON from response
    try:
        # Try to find JSON array in the response
        json_match = re.search(r'\[[\s\S]*\]', result)
        if json_match:
            return json.loads(json_match.group())
    except:
        pass
    return None

def fix_truncated_summary(slug, summary_en, summary_ar):
    """Fix a truncated Arabic summary using Gemini."""
    ck = cache_key(f"summary:{slug}")
    if ck in polish_cache:
        return polish_cache[ck]
    
    prompt = f"""ترجم هذا الملخص من الإنجليزية إلى العربية بأسلوب فكري رصين وبليغ.
لا تترجم حرفياً، بل انقل المعنى المقصود بأسلوب عربي انسيابي.

الملخص الإنجليزي:
{summary_en}

أجب بالترجمة العربية فقط، بدون أي شرح أو إضافات."""
    
    result = call_gemini(prompt)
    if result:
        result = result.strip().strip('"').strip("'")
        polish_cache[ck] = result
        save_cache()
    return result

def polish_article_body(slug, ar_content, en_content):
    """Polish an Arabic article body for literal translation artifacts."""
    ck = cache_key(f"article:{slug}")
    if ck in polish_cache:
        return polish_cache[ck]
    
    # Extract body (skip frontmatter)
    ar_parts = ar_content.split('---', 2)
    if len(ar_parts) >= 3:
        ar_body = ar_parts[2]
    else:
        ar_body = ar_content
    
    en_parts = en_content.split('---', 2)
    if len(en_parts) >= 3:
        en_body = en_parts[2]
    else:
        en_body = en_content
    
    # Only process first 3000 chars to stay within limits
    ar_chunk = ar_body[:3000]
    en_chunk = en_body[:3000]
    
    prompt = f"""أنت مدقق لغوي متخصص. راجع الترجمة العربية التالية وأصلح أي ترجمة حرفية ركيكة.

القواعد:
1. حدد التعابير المترجمة حرفياً (مثل: "قاعدة الإبهام" بدل "قاعدة عامة"، "يتم أخذ الجميع" بدل "محجوزة بالفعل")
2. أصلح الجمل المفككة التي لا تقرأ بسلاسة بالعربية
3. أبقِ المعنى الأصلي كما هو
4. أبقِ تنسيق الماركداون كما هو (عناوين، روابط، صور)
5. أبقِ أسماء الأشخاص والشركات والمصطلحات التقنية كما هي

النص الإنجليزي الأصلي (للمرجع):
{en_chunk}

النص العربي المطلوب مراجعته:
{ar_chunk}

إذا وجدت أخطاء ترجمة حرفية، أعد النص كاملاً مع التصحيحات.
إذا كان النص سليماً، أجب بكلمة واحدة فقط: CLEAN

أجب بالنص العربي المصحح فقط أو بكلمة CLEAN."""
    
    result = call_gemini(prompt)
    if result and result.strip() != 'CLEAN':
        polish_cache[ck] = result.strip()
        save_cache()
        return result.strip()
    elif result and result.strip() == 'CLEAN':
        polish_cache[ck] = 'CLEAN'
        save_cache()
    return None

# ===============================================================
# MAIN EXECUTION
# ===============================================================
def main():
    print("=" * 80)
    print("🔧 COMPREHENSIVE ARABIC TRANSLATION POLISHER")
    print("=" * 80)
    
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        index_data = json.load(f)
    
    # ---------------------------------------------------------------
    # PHASE 1: Fix truncated summaries in knowledge_index.json
    # ---------------------------------------------------------------
    print("\n📋 PHASE 1: Fixing truncated summaries...")
    truncated_count = 0
    fixed_summaries = 0
    
    for article in index_data:
        summary_ar = article.get('summary_ar', '')
        if summary_ar.endswith('\\') or summary_ar.endswith('\\"') or summary_ar.endswith('\\\\'):
            truncated_count += 1
            slug = article['slug']
            summary_en = article.get('summary_en', '')
            print(f"   🔄 Fixing truncated summary: {slug}")
            fixed = fix_truncated_summary(slug, summary_en, summary_ar)
            if fixed:
                article['summary_ar'] = fixed
                fixed_summaries += 1
                print(f"   ✅ Fixed: {fixed[:80]}...")
            time.sleep(0.5)  # Rate limiting
    
    print(f"   📊 Found {truncated_count} truncated, fixed {fixed_summaries}")
    
    # ---------------------------------------------------------------
    # PHASE 2: Translate English subtopics in the `subtopics` field
    # ---------------------------------------------------------------
    print("\n📋 PHASE 2: Translating English subtopics...")
    
    total_en_subtopics = 0
    translated_subtopics = 0
    
    for article in index_data:
        slug = article['slug']
        subtopics = article.get('subtopics', [])
        subtopics_ar = article.get('subtopics_ar', [])
        
        # Check if subtopics field has English-only content
        en_only_indices = []
        for i, st in enumerate(subtopics):
            title = st.get('title', '')
            takeaway = st.get('takeaway', '')
            if (title or takeaway) and not is_arabic(title + takeaway):
                en_only_indices.append(i)
                total_en_subtopics += 1
        
        if not en_only_indices:
            continue
        
        # Check if we already have Arabic versions in subtopics_ar
        if subtopics_ar and len(subtopics_ar) >= len(subtopics):
            # Copy Arabic versions to subtopics field
            for i in en_only_indices:
                if i < len(subtopics_ar):
                    ar_st = subtopics_ar[i]
                    subtopics[i]['title'] = ar_st.get('title_ar') or ar_st.get('title', subtopics[i]['title'])
                    subtopics[i]['takeaway'] = ar_st.get('takeaway_ar') or ar_st.get('takeaway', subtopics[i]['takeaway'])
                    # Also add _ar fields
                    subtopics[i]['title_ar'] = subtopics[i]['title']
                    subtopics[i]['takeaway_ar'] = subtopics[i]['takeaway']
                    translated_subtopics += 1
            print(f"   📝 {slug}: Copied {len(en_only_indices)} subtopics from subtopics_ar")
        else:
            # Need to translate via Gemini API
            batch = []
            for i in en_only_indices:
                batch.append({
                    'index': i,
                    'title': subtopics[i].get('title_en') or subtopics[i].get('title', ''),
                    'takeaway': subtopics[i].get('takeaway_en') or subtopics[i].get('takeaway', '')
                })
            
            # Process in batches of 6
            for batch_start in range(0, len(batch), 6):
                batch_chunk = batch[batch_start:batch_start+6]
                print(f"   🔄 {slug}: Translating batch {batch_start//6+1} ({len(batch_chunk)} items)...")
                
                translations = translate_subtopic_batch(batch_chunk)
                if translations and len(translations) == len(batch_chunk):
                    for j, trans in enumerate(translations):
                        idx = batch_chunk[j]['index']
                        subtopics[idx]['title'] = trans.get('title_ar', subtopics[idx]['title'])
                        subtopics[idx]['takeaway'] = trans.get('takeaway_ar', subtopics[idx]['takeaway'])
                        subtopics[idx]['title_ar'] = subtopics[idx]['title']
                        subtopics[idx]['takeaway_ar'] = subtopics[idx]['takeaway']
                        translated_subtopics += 1
                    print(f"   ✅ Translated {len(batch_chunk)} subtopics")
                else:
                    print(f"   ⚠️ Batch translation failed for {slug}")
                
                time.sleep(1)  # Rate limiting
    
    print(f"   📊 Total English subtopics found: {total_en_subtopics}")
    print(f"   📊 Successfully translated: {translated_subtopics}")
    
    # ---------------------------------------------------------------
    # PHASE 3: Fix literal idioms in article bodies
    # ---------------------------------------------------------------
    print("\n📋 PHASE 3: Scanning article bodies for literal translations...")
    
    IDIOM_FIXES = {
        "قاعدة الإبهام": "قاعدة عامة تقريبية",
        "الفاكهة المتدلية": "الأهداف السهلة القريبة",
        "الفاكهة المنخفضة": "الأهداف السهلة القريبة",
        "الرصاصة الفضية": "الحل السحري",
        "جلد في اللعبة": "مصلحة شخصية حقيقية",
        "الخط السفلي": "خلاصة القول",
        "حافة القطع": "في الصدارة",
        "بدون عقل": "أمر بديهي",
        "نهاية اللعبة": "الهدف النهائي",
        "ملعب الكرة": "تقدير تقريبي",
        "الفيل في الغرفة": "المشكلة الواضحة التي يتجاهلها الجميع",
        "رمي تحت الحافلة": "التضحية بشخص للنجاة",
        "اسحب القابس": "أوقف المشروع",
        "على نفس الصفحة": "على توافق تام",
        "ركل العلبة": "تأجيل المشكلة",
        "تحريك الإبرة": "إحداث تأثير ملموس",
        "نقل عمود المرمى": "تغيير القواعد والمعايير",
        "هناك هي ": "هناك ",
    }
    
    articles_fixed = 0
    total_replacements = 0
    
    for fname in sorted(os.listdir(AR_DIR)):
        if not fname.endswith('.md'):
            continue
        fpath = os.path.join(AR_DIR, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        for bad, good in IDIOM_FIXES.items():
            if bad in content:
                count = content.count(bad)
                content = content.replace(bad, good)
                total_replacements += count
                modified = True
                print(f"   🔄 {fname}: «{bad}» → «{good}» ({count}x)")
        
        if modified:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            articles_fixed += 1
    
    # Also fix in knowledge_index takeaways
    for article in index_data:
        for st_list in [article.get('subtopics', []), article.get('subtopics_ar', [])]:
            for st in st_list:
                for field in ['takeaway', 'takeaway_ar', 'title', 'title_ar']:
                    val = st.get(field, '')
                    for bad, good in IDIOM_FIXES.items():
                        if bad in val:
                            st[field] = val.replace(bad, good)
                            total_replacements += 1
    
    print(f"   📊 Articles fixed: {articles_fixed}")
    print(f"   📊 Total replacements: {total_replacements}")
    
    # ---------------------------------------------------------------
    # SAVE updated knowledge_index.json
    # ---------------------------------------------------------------
    print("\n💾 Saving updated knowledge_index.json...")
    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        json.dump(index_data, f, ensure_ascii=False, indent=2)
    print("   ✅ Saved!")
    
    # ---------------------------------------------------------------
    # FINAL SUMMARY
    # ---------------------------------------------------------------
    print(f"\n{'=' * 80}")
    print("📊 FINAL SUMMARY")
    print(f"{'=' * 80}")
    print(f"   ✅ Truncated summaries fixed: {fixed_summaries}/{truncated_count}")
    print(f"   ✅ Subtopics translated: {translated_subtopics}/{total_en_subtopics}")
    print(f"   ✅ Idiom replacements in articles: {total_replacements}")
    print(f"   ✅ Article files updated: {articles_fixed}")

if __name__ == '__main__':
    main()
