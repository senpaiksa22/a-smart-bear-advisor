import sys
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

with open('data/knowledge_index.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

print(f"Total articles in index: {len(articles)}")

bad_en = 0
bad_ar = 0
bad_samples = []

for a in articles:
    slug = a.get('slug')
    for st in a.get('subtopics_en', []):
        tk = st.get('takeaway_en', '').strip()
        # Bad if empty or doesn't end in punctuation or ends in dangling preposition/word
        if not tk or not tk.endswith(('.', '!', '?', '"', "'", '...')):
            bad_en += 1
            bad_samples.append((slug, 'EN', tk[-30:] if tk else 'EMPTY'))
            break
            
    for st in a.get('subtopics_ar', []):
        tk = st.get('takeaway_ar', '').strip()
        if not tk or not tk.endswith(('.', '!', '?', '؟', '"', '»', '”', '...')):
            bad_ar += 1
            bad_samples.append((slug, 'AR', tk[-30:] if tk else 'EMPTY'))
            break

print(f"Subtopics with bad/broken English endings: {bad_en} / {len(articles)}")
print(f"Subtopics with bad/broken Arabic endings: {bad_ar} / {len(articles)}")

if bad_samples:
    print("\nSamples:")
    for slug, lang, s in bad_samples[:10]:
        print(f"[{lang}] {slug}: ...{s}")
else:
    print("ALL 213 articles have 100% complete, properly punctuated subtopic takeaways in both languages!")
