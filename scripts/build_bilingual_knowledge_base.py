import os
import sys
import re
import json
import time
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

FEED_URL = "https://longform.asmartbear.com/chronological.xml"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
ARTICLES_EN_DIR = os.path.join(DATA_DIR, "articles_en")
ARTICLES_AR_DIR = os.path.join(DATA_DIR, "articles_ar")
CACHE_FILE = os.path.join(DATA_DIR, ".translation_cache.json")
INDEX_FILE = os.path.join(DATA_DIR, "knowledge_index.json")
CLUSTERS_FILE = os.path.join(DATA_DIR, "clusters.json")

# Persistent translation cache
translation_cache = {}
if os.path.exists(CACHE_FILE):
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            translation_cache = json.load(f)
    except Exception:
        translation_cache = {}

def save_cache():
    with open(CACHE_FILE, 'w', encoding='utf-8') as f:
        json.dump(translation_cache, f, ensure_ascii=False)

from deep_translator import MyMemoryTranslator

my_memory = MyMemoryTranslator(source='en-US', target='ar-SA')

def translate_snippet(text, max_retries=2):
    if not text or not text.strip():
        return text
    clean_t = text.strip()
    if clean_t in translation_cache:
        return translation_cache[clean_t]
    
    # Don't translate pure images or code
    if clean_t.startswith('![') and clean_t.endswith(')'):
        return clean_t
    if clean_t.startswith('```') and clean_t.endswith('```'):
        return clean_t
        
    encoded_q = urllib.parse.quote(clean_t[:2500])
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q={encoded_q}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                res = "".join([part[0] for part in data[0] if part[0]])
                if res and res.strip():
                    translation_cache[clean_t] = res
                    return res
        except Exception:
            time.sleep(0.3)
            
    # Fallback to MyMemory if Google is rate limited
    try:
        res = my_memory.translate(clean_t[:500])
        if res and res.strip():
            translation_cache[clean_t] = res
            return res
    except Exception:
        pass
        
    return clean_t

def translate_markdown_document(md_text):
    """
    Translates an entire markdown document by chunking into ~2000 character blocks,
    preserving markdown syntax, headers, code fences, and paragraphs.
    """
    if not md_text or not md_text.strip():
        return md_text
        
    paragraphs = md_text.split('\n\n')
    chunks = []
    current_chunk = []
    current_len = 0
    
    for p in paragraphs:
        p_len = len(p)
        # If code block or huge image, preserve as independent chunk
        if p.strip().startswith('```') or (p.strip().startswith('![') and p.strip().endswith(')')):
            if current_chunk:
                chunks.append("\n\n".join(current_chunk))
                current_chunk = []
                current_len = 0
            chunks.append(p)
            continue
            
        if current_len + p_len > 2200 and current_chunk:
            chunks.append("\n\n".join(current_chunk))
            current_chunk = [p]
            current_len = p_len
        else:
            current_chunk.append(p)
            current_len += p_len + 2
            
    if current_chunk:
        chunks.append("\n\n".join(current_chunk))
        
    translated_chunks = []
    for chunk in chunks:
        # Don't translate pure code blocks
        if chunk.strip().startswith('```') and chunk.strip().endswith('```'):
            translated_chunks.append(chunk)
        elif chunk.strip().startswith('![') and chunk.strip().endswith(')'):
            translated_chunks.append(chunk)
        else:
            translated_chunks.append(translate_snippet(chunk))
            
    return "\n\n".join(translated_chunks)

def clean_markdown_content(raw_text):
    if not raw_text:
        return ""
    text = re.sub(r'<(script|style).*?</\1>', '', raw_text, flags=re.DOTALL)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def extract_subtopics(text, title_en, summary_en):
    headings = re.findall(r'^(#{1,3})\s+(.+)$', text, flags=re.MULTILINE)
    subtopics = []
    
    if headings and len(headings) >= 2:
        for idx, (level, h_text) in enumerate(headings[:6], 1):
            cleaned_h = re.sub(r'[*_`]', '', h_text).strip()
            escaped_h = re.escape(h_text)
            pattern = rf'{escaped_h}\s*\n+([^#\n]+(?:\n+[^#\n]+)?)'
            match = re.search(pattern, text)
            raw_takeaway = match.group(1).strip() if match else cleaned_h
            
            # Clean takeaway
            t = re.sub(r'!?\[.*?\]\([^\)]*\)', '', raw_takeaway)
            t = re.sub(r'https?://\S+', '', t)
            t = re.sub(r'[*_`#<>]', '', t).strip()
            t = re.sub(r'\s+', ' ', t)[:220]
            
            words = [w.strip('.,;:"!?()[]{}') for w in (cleaned_h + " " + t).split() if len(w) > 4 and 'http' not in w.lower()]
            keywords = list(dict.fromkeys(words))[:5]
            
            subtopics.append({
                "num": idx,
                "title_en": cleaned_h,
                "takeaway_en": t,
                "keywords_en": keywords
            })
    else:
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 80 and not p.startswith('!') and not p.startswith('<')]
        if not paragraphs:
            paragraphs = [summary_en]
        for idx, p in enumerate(paragraphs[:4], 1):
            first_sentence = p.split('.')[0].strip()
            t = re.sub(r'[*_`#<>]', '', p).strip()
            t = re.sub(r'\s+', ' ', t)[:220]
            words = [w.strip('.,;:"!?()[]{}') for w in p.split() if len(w) > 4 and 'http' not in w.lower()]
            keywords = list(dict.fromkeys(words))[:5]
            subtopics.append({
                "num": idx,
                "title_en": first_sentence[:80] + ("..." if len(first_sentence) > 80 else ""),
                "takeaway_en": t,
                "keywords_en": keywords
            })
            
    return subtopics

def generate_cluster_metadata(k, vectorizer, model, articles, labels):
    """
    Analyzes top TF-IDF terms and representative articles for each cluster
    and generates professional bilingual names and descriptions.
    """
    terms = vectorizer.get_feature_names_out()
    order_centroids = model.cluster_centers_.argsort()[:, ::-1]
    
    cluster_definitions = []
    
    for i in range(k):
        top_terms = [terms[ind] for ind in order_centroids[i, :10]]
        cluster_articles = [articles[j] for j in range(len(articles)) if labels[j] == i]
        
        # Analyze thematic signals
        terms_joined = " ".join(top_terms).lower()
        titles_joined = " ".join([a["title_en"] for a in cluster_articles]).lower()
        combined = terms_joined + " " + titles_joined
        
        # Semantic matching for cluster theme
        if any(w in combined for w in ["pricing", "price", "freemium", "willingness", "monetization"]):
            name_en = "Pricing Strategy & Monetization"
            name_ar = "استراتيجيات التسعير ونماذج تحقيق الدخل"
            desc_en = "Frameworks for setting prices, willingness-to-pay, freemium mechanics, and value capture."
            desc_ar = "أطر تحديد الأسعار، الاستعداد للدفع، ميكانيكا النماذج المجانية واقتناص القيمة الاقتصادية."
        elif any(w in combined for w in ["saas", "mrr", "ltv", "cac", "churn", "ssebitda", "metric", "retention"]):
            name_en = "SaaS Metrics, Unit Economics & Financial Health"
            name_ar = "مقاييس شركات SaaS واقتصاديات الوحدة والصحة المالية"
            desc_en = "Key SaaS metrics, CAC, LTV, churn reduction, financial modeling, and growth ceilings."
            desc_ar = "المقاييس الجوهرية للبرمجيات السحابية، تكلفة الاكتساب، القيمة الدائمة، وتقليل التسرب."
        elif any(w in combined for w in ["advantage", "moat", "competitive", "unfair", "barrier"]):
            name_en = "Competitive Advantage, Moats & Defense"
            name_ar = "الميزة التنافسية وبناء الخنادق الدفاعية"
            desc_en = "Creating durable competitive moats, unfair advantages, and defending against rivals."
            desc_ar = "بناء خنادق تنافسية مستدامة، المزايا الفريدة غير العادلة، والدفاع أمام المنافسين."
        elif any(w in combined for w in ["customer", "interview", "icp", "persona", "development", "validation"]):
            name_en = "Customer Discovery, Interviews & ICP"
            name_ar = "استكشاف العملاء والمقابلات وشخصية المشتري المثالي"
            desc_en = "Finding early customers to interview, uncovering latent pain points, and targeting the ICP."
            desc_ar = "طرق الوصول للعملاء وإجراء المقابلات، كشف نقاط الألم الحقيقية، واستهداف العميل المثالي."
        elif any(w in combined for w in ["product", "mvp", "feature", "pmf", "fit", "roadmap", "slc"]):
            name_en = "Product/Market Fit & Product Strategy"
            name_ar = "ملاءمة المنتج للسوق واستراتيجية تطوير المنتجات"
            desc_en = "Achieving PMF, balancing features, building SLC products, and product evolution."
            desc_ar = "الوصول لملاءمة المنتج للسوق (PMF)، موازنة الميزات، وبناء منتجات بسيطة ومكتملة ومحبوبة."
        elif any(w in combined for w in ["marketing", "channel", "growth", "viral", "positioning", "distribution"]):
            name_en = "Marketing Channels, Positioning & Distribution"
            name_ar = "قنوات التسويق، التموضع الاستراتيجي والتوزيع"
            desc_en = "Selecting primary acquisition channels, positioning narratives, and distribution loops."
            desc_ar = "اختيار قنوات الاستحواذ الأولى، صياغة التموضع الذهني، ومحركات الانتشار والتوزيع."
        elif any(w in combined for w in ["ai", "disruption", "incumbent", "revolution", "technology"]):
            name_en = "AI Era Dynamics, Disruption & Big Tech"
            name_ar = "ديناميكيات عصر الذكاء الاصطناعي والثورات التقنية"
            desc_en = "How AI changes startup playbooks, competing against incumbents, and platform disruption."
            desc_ar = "كيف يغير الذكاء الاصطناعي قواعد اللعبة، منافسة العمالقة الراسخين، والتحولات الجذرية."
        elif any(w in combined for w in ["hire", "hiring", "team", "culture", "leader", "leadership", "manager"]):
            name_en = "Leadership, Team Building & Culture"
            name_ar = "القيادة، التوظيف وبناء الثقافة المؤسسية"
            desc_en = "Hiring people smarter than you, fostering autonomy, team alignment, and executive leadership."
            desc_ar = "توظيف الكفاءات المتفوقة، تمكين الاستقلالية، مواءمة الفرق، والقيادة التنفيذية الفعالة."
        elif any(w in combined for w in ["prioritization", "focus", "decision", "okr", "strategy", "planning"]):
            name_en = "Strategic Planning, Prioritization & Decision Making"
            name_ar = "التخطيط الاستراتيجي، تحديد الأولويات واتخاذ القرارات"
            desc_en = "Ruthless prioritization, navigating trade-offs, strategic frameworks, and avoiding blunders."
            desc_ar = "تحديد الأولويات الحاسم، إدارة المقايضات الصعبة، أطر العمل الاستراتيجية، وتفادي الأخطاء."
        elif any(w in combined for w in ["bootstrap", "funding", "investor", "venture", "profitable", "cash"]):
            name_en = "Bootstrapping vs Venture Capital & Capital Allocation"
            name_ar = "التمويل الذاتي مقابل الاستثمار الجريء وإدارة السيولة"
            desc_en = "Choosing between self-funding and VC, profitability from day one, and financial independence."
            desc_ar = "المفاضلة بين البوتسترابينغ والاستثمار الجريء، الوصول للربحية، وإدارة السيولة المالية."
        elif any(w in combined for w in ["psychology", "confidence", "burnout", "stress", "fulfillment", "balance"]):
            name_en = "Founder Psychology, Mental Resilience & Fulfillment"
            name_ar = "سيكولوجية المؤسس، الصلابة النفسية والتحقق الذاتي"
            desc_en = "Managing self-doubt, overcoming burnout, finding inner fulfillment, and psychological resilience."
            desc_ar = "إدارة الشكوك الذاتية، التغلب على الاحتراق النفسي، البحث عن المعنى والصلابة الذهنية."
        else:
            name_en = f"Foundational Philosophy & Startup Wisdom"
            name_ar = f"فلسفة ريادة الأعمال والحكمة التأسيسية"
            desc_en = "Philosophical insights on luck, truth, paradoxes, scale, and long-term thinking."
            desc_ar = "رؤى فلسفية حول الحظ، الحقيقة، مفارقات التفكير، وقوانين التوسع والتفكير بعيد المدى."
            
        cluster_definitions.append({
            "id": f"cluster_{i+1}",
            "cluster_num": i + 1,
            "name_en": name_en,
            "name_ar": name_ar,
            "description_en": desc_en,
            "description_ar": desc_ar,
            "top_terms": top_terms[:6],
            "article_count": len(cluster_articles)
        })
        
    return cluster_definitions

def main():
    os.makedirs(ARTICLES_EN_DIR, exist_ok=True)
    os.makedirs(ARTICLES_AR_DIR, exist_ok=True)
    
    print(f"1. Fetching RSS full-text feed from {FEED_URL}...")
    req = urllib.request.Request(FEED_URL, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        xml_data = resp.read()
        
    root = ET.fromstring(xml_data)
    items = root.findall('.//item')
    print(f"Total articles found in feed: {len(items)}")
    
    parsed_articles = []
    corpus = []
    
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
        
        # Save unabridged original English Markdown
        body_content_en = re.sub(rf'^#\s+{re.escape(title_en)}\s*\n*', '', clean_content, flags=re.IGNORECASE)
        article_en_file = os.path.join(ARTICLES_EN_DIR, f"{slug}.md")
        
        en_frontmatter = f"""---
id: {idx}
title: "{title_en.replace('"', '\\"')}"
slug: "{slug}"
url: "{url}"
pubDate: "{pubdate}"
summary: "{desc_en.replace('"', '\\"')}"
---

# {title_en}

> **Executive Summary:** {desc_en}
> **Original URL:** [{url}]({url})

{body_content_en.strip()}
"""
        with open(article_en_file, 'w', encoding='utf-8') as f:
            f.write(en_frontmatter)
            
        parsed_articles.append({
            "id": idx,
            "slug": slug,
            "url": url,
            "title_en": title_en,
            "pubdate": pubdate,
            "summary_en": desc_en,
            "clean_body_en": body_content_en.strip(),
            "full_content": clean_content
        })
        
        corpus.append(f"{title_en} {title_en} {desc_en} {clean_content[:4000]}")
        
    print(f"2. Saved {len(parsed_articles)} full original English articles into data/articles_en/")
    
    # 2. Dynamic Semantic Clustering
    print("\n3. Performing TF-IDF feature extraction & Dynamic Clustering...")
    vectorizer = TfidfVectorizer(max_df=0.7, min_df=2, stop_words='english', ngram_range=(1, 2))
    X = vectorizer.fit_transform(corpus)
    
    # Evaluate optimal cluster count (between 8 and 15)
    best_k = 12
    best_score = -1
    for k in range(8, 16):
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        lbls = km.fit_predict(X)
        score = silhouette_score(X, lbls)
        if score > best_score:
            best_score = score
            best_k = k
            
    print(f"Dynamic Clustering selected {best_k} organic clusters (Silhouette score: {best_score:.4f})")
    
    final_model = KMeans(n_clusters=best_k, random_state=42, n_init=10)
    final_labels = final_model.fit_predict(X)
    
    cluster_metadata = generate_cluster_metadata(best_k, vectorizer, final_model, parsed_articles, final_labels)
    cluster_map = {c["cluster_num"] - 1: c for c in cluster_metadata}
    
    with open(CLUSTERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(cluster_metadata, f, ensure_ascii=False, indent=2)
    print(f"Clusters metadata saved at: {CLUSTERS_FILE}")
    for c in cluster_metadata:
        print(f"  • [{c['name_en']}] / [{c['name_ar']}] ({c['article_count']} مقال)")
        
    # 3. Full Translation & Bilingual Structuring
    print("\n4. Translating articles and generating full bilingual index...")
    
    knowledge_index = []
    
    def process_single_article(art, cluster_info):
        slug = art["slug"]
        title_en = art["title_en"]
        summary_en = art["summary_en"]
        clean_body = art["clean_body_en"]
        article_ar_file = os.path.join(ARTICLES_AR_DIR, f"{slug}.md")
        
        # If already exists and is non-empty, reuse it
        if os.path.exists(article_ar_file) and os.path.getsize(article_ar_file) > 100:
            with open(article_ar_file, 'r', encoding='utf-8') as f:
                existing_ar = f.read()
            m_title = re.search(r'title_ar:\s*"(.*?)"', existing_ar)
            m_sum = re.search(r'summary_ar:\s*"(.*?)"', existing_ar)
            title_ar = m_title.group(1) if m_title else translate_snippet(title_en)
            summary_ar = m_sum.group(1) if m_sum else translate_snippet(summary_en)
        else:
            # Translate title & summary
            title_ar = translate_snippet(title_en)
            summary_ar = translate_snippet(summary_en)
            
            # Translate full article markdown
            full_translated_body = translate_markdown_document(clean_body)
            
            ar_frontmatter = f"""---
id: {art['id']}
title_en: "{title_en.replace('"', '\\"')}"
title_ar: "{title_ar.replace('"', '\\"')}"
slug: "{slug}"
url: "{art['url']}"
pubDate: "{art['pubdate']}"
category_en: "{cluster_info['name_en'].replace('"', '\\"')}"
category_ar: "{cluster_info['name_ar'].replace('"', '\\"')}"
summary_en: "{summary_en.replace('"', '\\"')}"
summary_ar: "{summary_ar.replace('"', '\\"')}"
---

# {title_ar}
### {title_en}

> **الملخص التنفيذي:** {summary_ar}
> **المحور التصنيفي:** {cluster_info['name_ar']}
> **الرابط الأصلي للمقال:** [{art['url']}]({art['url']})

{full_translated_body.strip()}
"""
            with open(article_ar_file, 'w', encoding='utf-8') as f:
                f.write(ar_frontmatter)
        
        # Subtopics in EN & AR
        subtopics_en = extract_subtopics(art["full_content"], title_en, summary_en)
        subtopics_ar = []
        for st in subtopics_en:
            tr_title = translate_snippet(st["title_en"])
            tr_takeaway = translate_snippet(st["takeaway_en"])
            tr_keywords = [translate_snippet(kw) for kw in st["keywords_en"]]
            subtopics_ar.append({
                "num": st["num"],
                "title_ar": tr_title,
                "takeaway_ar": tr_takeaway,
                "keywords_ar": tr_keywords
            })
            
        return {
            "id": art["id"],
            "slug": slug,
            "url": art["url"],
            "published_date": art["pubdate"],
            "cluster_id": cluster_info["id"],
            "category_en": cluster_info["name_en"],
            "category_ar": cluster_info["name_ar"],
            "title_en": title_en,
            "title_ar": title_ar,
            "summary_en": summary_en,
            "summary_ar": summary_ar,
            "subtopics_en": subtopics_en,
            "subtopics_ar": subtopics_ar,
            "content_en_path": f"data/articles_en/{slug}.md",
            "content_ar_path": f"data/articles_ar/{slug}.md"
        }

    # Execute with worker threads
    start_time = time.time()
    print("Starting concurrent translation with 4 workers...", flush=True)
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {}
        for idx, art in enumerate(parsed_articles):
            c_info = cluster_map[final_labels[idx]]
            fut = executor.submit(process_single_article, art, c_info)
            futures[fut] = art["slug"]
            
        done_count = 0
        for fut in as_completed(futures):
            slug = futures[fut]
            try:
                item_data = fut.result()
                knowledge_index.append(item_data)
                done_count += 1
                if done_count % 10 == 0 or done_count == len(parsed_articles):
                    print(f"  Translated & Indexed: {done_count}/{len(parsed_articles)} articles (Cache size: {len(translation_cache)})", flush=True)
                    save_cache()
            except Exception as e:
                print(f"Error on {slug}: {e}", flush=True)
                
    # Sort index by id
    knowledge_index.sort(key=lambda x: x["id"])
    
    # Save final index
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(knowledge_index, f, ensure_ascii=False, indent=2)
        
    save_cache()
    elapsed = time.time() - start_time
    print(f"\nCompleted in {elapsed:.1f}s!")
    print(f"Knowledge Index: {INDEX_FILE} ({len(knowledge_index)} articles)")
    print(f"English Articles: {ARTICLES_EN_DIR}")
    print(f"Arabic Articles: {ARTICLES_AR_DIR}")
    print(f"Clusters File: {CLUSTERS_FILE}")

if __name__ == "__main__":
    main()
