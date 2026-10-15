import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('data/knowledge_index.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

art = next(a for a in data if a['slug'] == 'target-market')
print("=== TARGET MARKET REPAIRED SUBTOPICS (ENGLISH) ===")
for st in art['subtopics_en']:
    print(f"\n[{st['num']}] {st['title_en']}")
    print(f"Takeaway: {st['takeaway_en']}")

print("\n=== TARGET MARKET REPAIRED SUBTOPICS (ARABIC) ===")
for st in art['subtopics_ar']:
    print(f"\n[{st['num']}] {st['title_ar']}")
    print(f"Takeaway: {st['takeaway_ar']}")
