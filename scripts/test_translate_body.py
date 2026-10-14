import os
import sys
import re
import json
import time
import urllib.request
import urllib.parse

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EN_DIR = os.path.join(BASE_DIR, 'data', 'articles_en')
AR_DIR = os.path.join(BASE_DIR, 'data', 'articles_ar')
INDEX_PATH = os.path.join(BASE_DIR, 'data', 'knowledge_index.json')

CACHE_PATH = os.path.join(BASE_DIR, 'data', '.full_trans_cache.json')
trans_cache = {}
if os.path.exists(CACHE_PATH):
    try:
        with open(CACHE_PATH, 'r', encoding='utf-8') as f:
            trans_cache = json.load(f)
    except Exception:
        trans_cache = {}

def save_cache():
    with open(CACHE_PATH, 'w', encoding='utf-8') as f:
        json.dump(trans_cache, f, ensure_ascii=False)

def translate_text(text):
    if not text or not text.strip():
        return text
    clean_t = text.strip()
    if clean_t in trans_cache:
        return trans_cache[clean_t]
        
    # Don't translate standalone markdown image or code block
    if clean_t.startswith('![') and clean_t.endswith(')'):
        return clean_t
    if clean_t.startswith('```') and clean_t.endswith('```'):
        return clean_t

    try:
        # Split into ~1500 char chunks if long
        url = f"https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=ar&q={urllib.parse.quote(clean_t[:2000])}"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if isinstance(data, list) and len(data) > 0:
                res = data[0] if isinstance(data[0], str) else "".join(data)
                trans_cache[clean_t] = res
                return res
    except Exception as e:
        time.sleep(0.2)
        
    return clean_t

def translate_markdown_body(body_md):
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
            
        # 3. Headings: #, ##, ###
        if stripped.startswith('#'):
            level = len(re.match(r'^#+', stripped).group(0))
            heading_text = stripped[level:].strip()
            # If image inside heading or pure symbol
            if not heading_text.startswith('!['):
                tr_heading = translate_text(heading_text)
                translated_lines.append(f"{'#' * level} {tr_heading}")
            else:
                translated_lines.append(stripped)
            i += 1
            continue
            
        # 4. Bullet lists: *, -, or numbered 1.
        list_match = re.match(r'^(\s*[\*\-\+]|\s*\d+\.)\s+(.*)', line)
        if list_match:
            prefix = list_match.group(1)
            item_text = list_match.group(2)
            # Check if image
            if item_text.strip().startswith('!['):
                translated_lines.append(line)
            else:
                tr_item = translate_text(item_text)
                translated_lines.append(f"{prefix} {tr_item}")
            i += 1
            continue
            
        # 5. Blockquote: > ...
        if stripped.startswith('>'):
            quote_text = stripped.lstrip('>').strip()
            tr_quote = translate_text(quote_text)
            translated_lines.append(f"> {tr_quote}")
            i += 1
            continue
            
        # 6. Standard paragraph: collect paragraph lines
        para_lines = [stripped]
        while i + 1 < len(lines) and lines[i + 1].strip() and not lines[i + 1].strip().startswith(('#', '*', '-', '>', '1.', '![')):
            i += 1
            para_lines.append(lines[i].strip())
            
        para_text = " ".join(para_lines)
        tr_para = translate_text(para_text)
        translated_lines.append(tr_para)
        i += 1
        
    return "\n".join(translated_lines)

# Test on target-market.md
slug = "target-market"
en_path = os.path.join(EN_DIR, f"{slug}.md")
ar_path = os.path.join(AR_DIR, f"{slug}.md")

with open(en_path, 'r', encoding='utf-8') as f:
    en_content = f.read()

# Extract frontmatter and body
m = re.match(r'^---([\s\S]*?)---\s*([\s\S]*)', en_content)
if m:
    body = m.group(2)
    # Remove initial duplicated heading
    body = re.sub(r'^#\s+[^\n]+\n*', '', body).strip()
    # Remove executive summary blockquote from original body if repeated
    body = re.sub(r'^>\s+\*\*Executive Summary:\*\*[\s\S]*?>\s+\*\*Original URL:\*\*[\s\S]*?\n', '', body).strip()
    
    print("Translating body for target-market.md...")
    translated_body = translate_markdown_body(body)
    
    print("Preview of translated body (first 500 chars):")
    print(translated_body[:500])
    save_cache()
