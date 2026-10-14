import os
import sys
import re
import json
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EN_DIR = os.path.join(BASE_DIR, 'data', 'articles_en')
AR_DIR = os.path.join(BASE_DIR, 'data', 'articles_ar')
INDEX_PATH = os.path.join(BASE_DIR, 'data', 'knowledge_index.json')
CACHE_PATH = os.path.join(BASE_DIR, 'data', '.full_trans_cache.json')

# Persistent translation cache
trans_cache = {}
if os.path.exists(CACHE_PATH):
    try:
        with open(CACHE_PATH, 'r', encoding='utf-8') as f:
            trans_cache = json.load(f)
    except Exception:
        trans_cache = {}

def save_cache():
    try:
        with open(CACHE_PATH, 'w', encoding='utf-8') as f:
            json.dump(trans_cache, f, ensure_ascii=False)
    except Exception:
        pass

def translate_snippet(text, max_retries=3):
    if not text or not text.strip():
        return text
    clean_t = text.strip()
    if clean_t in trans_cache:
        return trans_cache[clean_t]
        
    # Don't translate pure markdown image or code block
    if clean_t.startswith('![') and clean_t.endswith(')'):
        return clean_t
    if clean_t.startswith('```') and clean_t.endswith('```'):
        return clean_t

    encoded = urllib.parse.quote(clean_t[:2200])
    url = f"https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=ar&q={encoded}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=7) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if isinstance(data, list) and len(data) > 0:
                    res = data[0] if isinstance(data[0], str) else "".join(data)
                    trans_cache[clean_t] = res
                    return res
        except Exception:
            time.sleep(0.15 * (attempt + 1))
            
    return clean_t

def translate_markdown_document(body_md):
    lines = body_md.split('\n')
    translated_lines = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        
        # 1. Blank line
        if not stripped:
            translated_lines.append("")
            i += 1
            continue
            
        # 2. Markdown Image: preserve intact!
        if stripped.startswith('![') and stripped.endswith(')'):
            translated_lines.append(stripped)
            i += 1
            continue
            
        # 3. Code fence: preserve intact!
        if stripped.startswith('```'):
            code_block = [line]
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_block.append(lines[i])
                i += 1
            if i < len(lines):
                code_block.append(lines[i])
                i += 1
            translated_lines.extend(code_block)
            continue
            
        # 4. Headings: #, ##, ###
        if stripped.startswith('#'):
            level = len(re.match(r'^#+', stripped).group(0))
            heading_text = stripped[level:].strip()
            if not heading_text.startswith('!['):
                tr_heading = translate_snippet(heading_text)
                translated_lines.append(f"{'#' * level} {tr_heading}")
            else:
                translated_lines.append(stripped)
            i += 1
            continue
            
        # 5. Bullet lists: *, -, or numbered 1.
        list_match = re.match(r'^(\s*[\*\-\+]|\s*\d+\.)\s+(.*)', line)
        if list_match:
            prefix = list_match.group(1)
            item_text = list_match.group(2)
            if item_text.strip().startswith('!['):
                translated_lines.append(line)
            else:
                tr_item = translate_snippet(item_text)
                translated_lines.append(f"{prefix} {tr_item}")
            i += 1
            continue
            
        # 6. Blockquote: > ...
        if stripped.startswith('>'):
            quote_text = stripped.lstrip('>').strip()
            tr_quote = translate_snippet(quote_text)
            translated_lines.append(f"> {tr_quote}")
            i += 1
            continue
            
        # 7. Markdown Table row: starts and ends with '|'
        if stripped.startswith('|') and stripped.endswith('|'):
            # Table separator row: |:---|:---| or |---|---|
            if re.match(r'^\|[\s\-:]+(\|[\s\-:]+)+\|$', stripped):
                translated_lines.append(stripped)
            else:
                cells = stripped.split('|')
                tr_cells = []
                for cell in cells:
                    c = cell.strip()
                    if not c:
                        tr_cells.append('')
                    elif re.match(r'^[\s\-:]+$', c):
                        tr_cells.append(c)
                    else:
                        tr_cells.append(f" {translate_snippet(c)} ")
                translated_lines.append('|'.join(tr_cells))
            i += 1
            continue
            
        # 8. Standard paragraph: collect consecutive lines
        para_lines = [stripped]
        while i + 1 < len(lines) and lines[i + 1].strip() and not lines[i + 1].strip().startswith(('#', '*', '-', '>', '|', '1.', '2.', '3.', '4.', '5.', '![', '```')):
            i += 1
            para_lines.append(lines[i].strip())
            
        para_text = " ".join(para_lines)
        tr_para = translate_snippet(para_text)
        translated_lines.append(tr_para)
        i += 1
        
    return "\n".join(translated_lines)

def process_article(art_meta):
    slug = art_meta['slug']
    en_file = os.path.join(EN_DIR, f"{slug}.md")
    ar_file = os.path.join(AR_DIR, f"{slug}.md")
    
    if not os.path.exists(en_file):
        return slug, False
        
    with open(en_file, 'r', encoding='utf-8') as f:
        en_raw = f.read()
        
    # Extract body without frontmatter
    m = re.match(r'^---([\s\S]*?)---\s*([\s\S]*)', en_raw)
    if not m:
        return slug, False
        
    body = m.group(2)
    # Strip initial duplicated title/summary
    body = re.sub(r'^#\s+[^\n]+\n*', '', body).strip()
    body = re.sub(r'^>\s+\*\*Executive Summary:\*\*[\s\S]*?>\s+\*\*Original URL:\*\*[\s\S]*?\n', '', body).strip()
    
    translated_body = translate_markdown_document(body)
    
    # Build complete Arabic markdown with metadata
    ar_md = f"""---
id: {art_meta['id']}
title_en: "{art_meta['title_en'].replace('"', '\\"')}"
title_ar: "{art_meta['title_ar'].replace('"', '\\"')}"
slug: "{slug}"
url: "{art_meta['url']}"
published_date: "{art_meta.get('published_date', '')}"
category_en: "{art_meta.get('category_en', '')}"
category_ar: "{art_meta.get('category_ar', '')}"
summary_en: "{art_meta.get('summary_en', '').replace('"', '\\"')}"
summary_ar: "{art_meta.get('summary_ar', '').replace('"', '\\"')}"
---

# {art_meta['title_ar']}
### {art_meta['title_en']}

> **الملخص التنفيذي:** {art_meta['summary_ar']}
> **المحور التصنيفي:** {art_meta.get('category_ar', '')}
> **الرابط الأصلي للمقال:** [{art_meta['url']}]({art_meta['url']})

---

{translated_body.strip()}
"""
    with open(ar_file, 'w', encoding='utf-8') as f:
        f.write(ar_md)
        
    return slug, True

def main():
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        articles = json.load(f)
        
    print(f"Starting full translation for {len(articles)} articles with image preservation...")
    
    completed = 0
    # Use 5 concurrent workers for quick, reliable translation
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(process_article, art): art for art in articles}
        for future in as_completed(futures):
            art = futures[future]
            try:
                slug, success = future.result()
                if success:
                    completed += 1
                    if completed % 10 == 0 or completed == len(articles):
                        print(f"Progress: {completed}/{len(articles)} articles translated ({completed*100//len(articles)}%)")
                        save_cache()
            except Exception as e:
                print(f"Error translating {art.get('slug')}: {e}")
                
    save_cache()
    print("All articles translated and saved into data/articles_ar/!")

if __name__ == '__main__':
    main()
