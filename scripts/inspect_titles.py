import json
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('data/knowledge_index.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

problematic = []
for a in articles:
    t_ar = a.get('title_ar', '')
    t_en = a.get('title_en', '')
    eng_chars = len(re.findall(r'[a-zA-Z]', t_ar))
    ar_chars = len(re.findall(r'[\u0600-\u06FF]', t_ar))
    
    # Check if untranslated, contains backslashes, or strange prefix
    if eng_chars > 3 or '\\' in t_ar or ar_chars < 3 or t_ar == t_en:
        problematic.append((a['id'], a['slug'], t_en, t_ar))

print(f"Total articles in index: {len(articles)}")
print(f"Total articles with English or corrupted title_ar: {len(problematic)}")
for item in problematic[:25]:
    print(f"ID {item[0]}: EN='{item[2]}' -> AR='{item[3]}'")
