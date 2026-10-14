import json
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('data/knowledge_index.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

untranslated = [i for i in items if i['title_ar'].startswith('تحليل واستراتيجية:')]
print(f"Total untranslated: {len(untranslated)}")
for u in untranslated:
    print(f'"{u["slug"]}": "{u["title_en"]}",')
