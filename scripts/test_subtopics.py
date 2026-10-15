import sys
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

def clean_md_text(raw):
    if not raw:
        return ""
    # Replace markdown links [text](url) with text
    t = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', raw)
    # Remove image embeds ![alt](url)
    t = re.sub(r'!\[.*?\]\([^\)]*\)', '', t)
    # Remove footnotes [^1]
    t = re.sub(r'\[\^[0-9]+\]', '', t)
    # Remove html tags
    t = re.sub(r'<[^>]+>', '', t)
    # Remove formatting characters
    t = re.sub(r'[*_`#>]', '', t)
    # Normalize spaces
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def extract_complete_sentence(text, max_len=240, min_len=80):
    cleaned = clean_md_text(text)
    if not cleaned:
        return ""
    
    # Split into sentences
    sentences = re.split(r'(?<=[.!?])\s+', cleaned)
    
    result = ""
    for s in sentences:
        s = s.strip()
        if not s:
            continue
        # Avoid bullet remnants or short header echoes
        if not result:
            result = s
        else:
            if len(result) + len(s) + 1 <= max_len:
                result += " " + s
            else:
                break
                
    # If the first sentence alone is already longer than max_len, cleanly cut at word boundary
    if len(result) > max_len:
        cut = result[:max_len]
        last_space = cut.rfind(' ')
        if last_space > min_len:
            result = cut[:last_space] + "..."
        else:
            result = cut + "..."
            
    # Ensure it ends with proper punctuation
    if not result.endswith(('.', '!', '?', '...')):
        result += "."
        
    return result

with open('data/articles/target-market.md', 'r', encoding='utf-8') as f:
    raw_content = f.read()

# Strip frontmatter
body = re.sub(r'^---[\s\S]*?---\s*', '', raw_content)
# Strip H1 / executive summary at top
body = re.sub(r'^#[^\n]+\n+', '', body)
body = re.sub(r'^###[^\n]+\n+', '', body)
body = re.sub(r'^>[\s\S]*?\n\n', '', body)

# Split by headings
sections = re.split(r'\n(?=#{2,3}\s+)', body)
print(f"Total sections: {len(sections)}")

for i, sec in enumerate(sections[:8]):
    lines = sec.strip().split('\n')
    header_line = lines[0] if lines else ""
    header_m = re.match(r'^(#{2,3})\s+(.+)$', header_line)
    if header_m:
        h_title = clean_md_text(header_m.group(2))
        sec_body = '\n'.join(lines[1:]).strip()
        takeaway = extract_complete_sentence(sec_body)
        print(f"\n--- Subtopic {i}: {h_title} ---")
        print(f"Takeaway ({len(takeaway)} chars): {takeaway}")
