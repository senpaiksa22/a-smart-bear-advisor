import json
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

with open('data/knowledge_index.json', 'r', encoding='utf-8') as f:
    articles = json.load(f)

print(f"Total articles: {len(articles)}")

# Print out slug and title_en for all 213 articles
for a in articles:
    print(f"{a['id']} | {a['slug']} | {a['title_en']}")
