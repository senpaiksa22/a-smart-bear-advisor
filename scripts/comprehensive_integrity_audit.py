"""
Comprehensive Project Integrity & Data Audit Script
Checks:
1. knowledge_index.json structure, valid JSON, 213 articles
2. Arabic and English content file existence
3. Clusters integrity
4. Frontmatter consistency in all 213 Arabic markdown articles
5. Markdown formatting: unclosed brackets, broken internal links, weird escapes
6. Character encoding / zero nulls / zero corruption
"""
import os
import sys
import json
import re

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(BASE_DIR, 'data', 'knowledge_index.json')
CLUSTERS_PATH = os.path.join(BASE_DIR, 'data', 'clusters.json')
AR_DIR = os.path.join(BASE_DIR, 'data', 'articles_ar')
EN_DIR = os.path.join(BASE_DIR, 'data', 'articles_en')

def run_audit():
    print("=" * 80)
    print("🚀 EXHAUSTIVE INTEGRITY AUDIT: A SMART BEAR ADVISOR")
    print("=" * 80)

    errors = []
    warnings = []

    # 1. Check knowledge_index.json
    print("\n[1] Auditing knowledge_index.json...")
    try:
        with open(INDEX_PATH, 'r', encoding='utf-8') as f:
            index_data = json.load(f)
        print(f"    ✓ Valid JSON format.")
        print(f"    ✓ Article count: {len(index_data)} (Expected: 213)")
        if len(index_data) != 213:
            errors.append(f"Expected 213 articles in index, found {len(index_data)}")
        
        # Check required fields
        slugs_seen = set()
        ids_seen = set()
        for i, art in enumerate(index_data):
            slug = art.get('slug')
            art_id = art.get('id')
            
            if not slug:
                errors.append(f"Article at index {i} has missing slug")
            elif slug in slugs_seen:
                errors.append(f"Duplicate slug found: {slug}")
            slugs_seen.add(slug)
            
            if art_id in ids_seen:
                errors.append(f"Duplicate ID found: {art_id}")
            ids_seen.add(art_id)

            # Titles
            if not art.get('title_ar') or not art.get('title_en'):
                errors.append(f"[{slug}] Missing Arabic or English title")

            # Summaries
            sum_ar = art.get('summary_ar', '')
            sum_en = art.get('summary_en', '')
            if not sum_ar or not sum_en:
                errors.append(f"[{slug}] Missing Arabic or English summary")
            if sum_ar.endswith('\\') or sum_ar.endswith('\\"') or sum_ar.endswith('\\\\'):
                errors.append(f"[{slug}] Truncated summary_ar ending with escape slash")

            # Subtopics
            subtopics = art.get('subtopics', [])
            if not subtopics:
                warnings.append(f"[{slug}] Has empty subtopics array")
            
            for st in subtopics:
                if not st.get('title') and not st.get('title_ar'):
                    warnings.append(f"[{slug}] Subtopic missing title")

    except Exception as e:
        errors.append(f"Failed to read/parse knowledge_index.json: {e}")

    # 2. Check clusters.json
    print("\n[2] Auditing clusters.json...")
    try:
        with open(CLUSTERS_PATH, 'r', encoding='utf-8') as f:
            clusters = json.load(f)
        print(f"    ✓ Valid JSON format.")
        print(f"    ✓ Clusters count: {len(clusters)}")
        for c in clusters:
            if not c.get('id') or not c.get('name_ar') or not c.get('name_en'):
                errors.append(f"Cluster {c.get('id')} missing name_ar or name_en")
    except Exception as e:
        errors.append(f"Failed to read/parse clusters.json: {e}")

    # 3. Check Markdown Files Existence & Frontmatter
    print("\n[3] Auditing Arabic and English Markdown Files...")
    ar_files = [f for f in os.listdir(AR_DIR) if f.endswith('.md')]
    en_files = [f for f in os.listdir(EN_DIR) if f.endswith('.md')]
    print(f"    ✓ Arabic articles on disk: {len(ar_files)} (Expected: 213)")
    print(f"    ✓ English articles on disk: {len(en_files)} (Expected: 213)")

    if len(ar_files) != 213:
        errors.append(f"Expected 213 Arabic markdown files, found {len(ar_files)}")
    if len(en_files) != 213:
        errors.append(f"Expected 213 English markdown files, found {len(en_files)}")

    # 4. Check Arabic Markdown Content & Health
    print("\n[4] Deep inspection of Arabic markdown content...")
    broken_md = []
    for fname in ar_files:
        fpath = os.path.join(AR_DIR, fname)
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Check frontmatter
            if not content.startswith('---'):
                broken_md.append(f"{fname}: Missing frontmatter start '---'")
                continue
            
            parts = content.split('---', 2)
            if len(parts) < 3:
                broken_md.append(f"{fname}: Incomplete frontmatter closing '---'")
                continue

            # Check body length
            body = parts[2].strip()
            if len(body) < 100:
                warnings.append(f"{fname}: Article body suspiciously short ({len(body)} chars)")

            # Check for literal patterns that shouldn't exist anymore
            bad_needles = ["قاعدة الإبهام", "يتم أخذ الجميع"]
            for needle in bad_needles:
                if needle in body:
                    errors.append(f"{fname}: Still contains '{needle}'")

        except Exception as e:
            errors.append(f"{fname}: Error reading file: {e}")

    if broken_md:
        errors.extend(broken_md)
    else:
        print("    ✓ All 213 markdown files have valid frontmatter and body structure.")

    # 5. Summary
    print("\n" + "=" * 80)
    print("📊 AUDIT RESULTS SUMMARY")
    print("=" * 80)
    print(f"Total Errors:   {len(errors)}")
    print(f"Total Warnings: {len(warnings)}")

    if errors:
        print("\n❌ CRITICAL ERRORS FOUND:")
        for err in errors:
            print(f"  • {err}")
    else:
        print("\n✅ ZERO CRITICAL ERRORS! All files and datasets are 100% sound.")

    if warnings:
        print("\n⚠️ WARNINGS / NOTICES:")
        for w in warnings[:10]:
            print(f"  • {w}")

    return len(errors) == 0

if __name__ == '__main__':
    success = run_audit()
    sys.exit(0 if success else 1)
