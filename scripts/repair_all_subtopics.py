import os
import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(ROOT_DIR, 'data', 'knowledge_index.json')
EN_DIR = os.path.join(ROOT_DIR, 'data', 'articles')
AR_DIR = os.path.join(ROOT_DIR, 'data', 'articles_ar')

def clean_markdown_text(raw):
    if not raw:
        return ""
    # 1. Replace [text](url) with text
    t = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', raw)
    # 2. Remove images ![alt](url)
    t = re.sub(r'!\[.*?\]\([^\)]*\)', '', t)
    # 3. Remove footnotes [^1]
    t = re.sub(r'\[\^[0-9]+\]', '', t)
    # 4. Remove blockquote markers >
    t = re.sub(r'^\s*>\s*', '', t, flags=re.MULTILINE)
    # 5. Remove HTML tags
    t = re.sub(r'<[^>]+>', '', t)
    # 6. Remove formatting stars, backticks, hashes
    t = re.sub(r'[*_`#]', '', t)
    # 7. Normalize spaces
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def extract_takeaway_from_body(body_text, max_len=260, min_len=90, lang='en'):
    if not body_text:
        return ""
    
    # Split paragraphs
    paras = [p.strip() for p in body_text.split('\n\n') if p.strip()]
    
    candidate = ""
    for idx, p in enumerate(paras):
        if p.startswith('!') or p.startswith('<figure') or p.startswith('[^'):
            continue
        cleaned = clean_markdown_text(p)
        if len(cleaned) > 25:
            # If paragraph ends with a colon, check if next paragraph has the blockquote / question
            if (cleaned.endswith(':') or cleaned.endswith(':-')) and idx + 1 < len(paras):
                next_p = clean_markdown_text(paras[idx + 1])
                candidate = cleaned.rstrip(':-') + ": " + next_p
            else:
                candidate = cleaned
            break
            
    if not candidate:
        candidate = clean_markdown_text(body_text)
        
    if not candidate:
        return ""

    # Split into sentences
    sentences = re.split(r'(?<=[.!?؟])\s+', candidate)
    
    result = ""
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        if not result:
            result = s
        else:
            if len(result) + len(s) + 1 <= max_len:
                result += " " + s
            else:
                break
                
    # If single sentence is excessively long, cut cleanly at the last space before max_len
    if len(result) > max_len:
        cut = result[:max_len]
        last_space = cut.rfind(' ')
        if last_space > min_len:
            result = cut[:last_space].rstrip('.,;:!?؟') + "..."
        else:
            result = cut.rstrip('.,;:!?؟') + "..."

    # Ensure it ends with appropriate punctuation
    end_marks = ('.', '!', '?', '؟', '...', '…')
    if not result.endswith(end_marks):
        if lang == 'ar':
            result += "؟" if any(q in result for q in ['هل ', 'كيف ', 'لماذا ', 'ما الذي ']) else "."
        else:
            result += "?" if any(result.lower().startswith(q) for q in ['is ', 'are ', 'how ', 'why ', 'would ', 'can ']) else "."
            
    return result

def extract_sections(md_text, lang='en'):
    # Strip frontmatter
    body = re.sub(r'^---[\s\S]*?---\s*', '', md_text)
    # Strip top H1 and blockquotes
    body = re.sub(r'^#[^\n]+\n+', '', body)
    body = re.sub(r'^###[^\n]+\n+', '', body)
    body = re.sub(r'^>[\s\S]*?\n\n', '', body)

    heading_matches = list(re.finditer(r'^(#{2,3})\s+(.+)$', body, flags=re.MULTILINE))
    raw_sections = []
    
    for idx, match in enumerate(heading_matches):
        h_level = len(match.group(1))
        h_title = clean_markdown_text(match.group(2))
        
        # Don't include footnotes or bibliography headings
        if any(bad in h_title.lower() for bad in ['footnotes', 'references', 'هوامش', 'مراجع']):
            continue
            
        start_pos = match.end()
        end_pos = heading_matches[idx + 1].start() if idx + 1 < len(heading_matches) else len(body)
        sec_content = body[start_pos:end_pos].strip()
        
        # Check if sec_content has real text (not just another heading immediately following)
        has_real_text = len(clean_markdown_text(sec_content)) > 40
        
        raw_sections.append({
            "level": h_level,
            "title": h_title,
            "content": sec_content,
            "has_real_text": has_real_text
        })

    # Filter out empty parent container headings if they have subheadings
    filtered_sections = []
    for i, s in enumerate(raw_sections):
        if not s["has_real_text"]:
            # Check if immediately followed by a sub-heading (level 3 following level 2)
            if i + 1 < len(raw_sections) and raw_sections[i+1]["level"] > s["level"]:
                continue # Skip empty parent heading in favor of its child sections
        filtered_sections.append(s)

    sections = []
    for s in filtered_sections:
        takeaway = extract_takeaway_from_body(s["content"], lang=lang)
        if takeaway and len(takeaway) > 20:
            sections.append({
                "title": s["title"],
                "takeaway": takeaway
            })

    # If fewer than 3 headings, fallback to clean paragraphs
    if len(sections) < 3:
        paras = [clean_markdown_text(p) for p in body.split('\n\n') if len(clean_markdown_text(p)) > 70 and not p.startswith('!')]
        sections = []
        for p in paras[:4]:
            first_sent = p.split('.')[0].strip()
            if not first_sent.endswith(('.', '!', '?', '؟')):
                first_sent += "."
            sections.append({
                "title": first_sent[:70],
                "takeaway": extract_takeaway_from_body(p, lang=lang)
            })
            
    return sections[:6]

print("Starting refined subtopics repair across all 213 articles...")
with open(INDEX_PATH, 'r', encoding='utf-8') as f:
    articles = json.load(f)

for art in articles:
    slug = art.get('slug')
    en_file = os.path.join(EN_DIR, f"{slug}.md")
    ar_file = os.path.join(AR_DIR, f"{slug}.md")
    
    en_text = ""
    ar_text = ""
    
    if os.path.exists(en_file):
        with open(en_file, 'r', encoding='utf-8') as f:
            en_text = f.read()
            
    if os.path.exists(ar_file):
        with open(ar_file, 'r', encoding='utf-8') as f:
            ar_text = f.read()

    en_secs = extract_sections(en_text, lang='en') if en_text else []
    ar_secs = extract_sections(ar_text, lang='ar') if ar_text else []
    
    new_subtopics_en = []
    for idx, s in enumerate(en_secs, 1):
        words = [w.strip('.,;:"!?()[]{}') for w in (s["title"] + " " + s["takeaway"]).split()]
        kws = [w for w in list(dict.fromkeys(words)) if len(w) >= 3 and not w.startswith('http')][:5]
        new_subtopics_en.append({
            "num": idx,
            "title_en": s["title"],
            "takeaway_en": s["takeaway"],
            "title": s["title"],
            "takeaway": s["takeaway"],
            "keywords_en": kws
        })
        
    new_subtopics_ar = []
    for idx, s in enumerate(ar_secs, 1):
        words = [w.strip('.,;:"!?()[]{}') for w in (s["title"] + " " + s["takeaway"]).split()]
        kws = [w for w in list(dict.fromkeys(words)) if len(w) >= 3 and not w.startswith('http')][:5]
        new_subtopics_ar.append({
            "num": idx,
            "title_ar": s["title"],
            "takeaway_ar": s["takeaway"],
            "title": s["title"],
            "takeaway": s["takeaway"],
            "keywords_ar": kws
        })
        
    if new_subtopics_en:
        art["subtopics_en"] = new_subtopics_en
        art["subtopics"] = new_subtopics_en
        
    if new_subtopics_ar:
        art["subtopics_ar"] = new_subtopics_ar

with open(INDEX_PATH, 'w', encoding='utf-8') as f:
    json.dump(articles, f, indent=2, ensure_ascii=False)

print("Full refined repair complete for all 213 articles!")
