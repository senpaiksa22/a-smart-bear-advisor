"""
Comprehensive Arabic Translation Quality Audit
Scans all 213 articles for literal/machine translation patterns
"""
import os
import re
import json
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AR_DIR = os.path.join(BASE_DIR, 'data', 'articles_ar')
EN_DIR = os.path.join(BASE_DIR, 'data', 'articles_en')

# ========================================================================
# PATTERNS: Known literal machine translation errors (EN idiom → bad AR)
# Each entry: (bad_arabic_pattern, english_original, correct_arabic, category)
# ========================================================================
LITERAL_PATTERNS = [
    # Idioms translated word-for-word
    ("قاعدة الإبهام", "rule of thumb", "قاعدة عامة تقريبية", "idiom"),
    ("يتم أخذ الجميع", "everyone else is already taken", "فجميع الأدوار الأخرى محجوزة بالفعل", "idiom"),
    ("الفاكهة المتدلية", "low-hanging fruit", "الثمار القريبة / الأهداف السهلة", "idiom"),
    ("الفاكهة المنخفضة", "low-hanging fruit", "الثمار القريبة / الأهداف السهلة", "idiom"),
    ("الرصاصة الفضية", "silver bullet", "الحل السحري", "idiom"),
    ("جلد في اللعبة", "skin in the game", "مصلحة شخصية حقيقية / مخاطرة شخصية", "idiom"),
    ("الخط السفلي", "bottom line", "خلاصة القول / المحصلة النهائية", "idiom"),
    ("حافة القطع", "cutting edge", "في طليعة / في الصدارة", "idiom"),
    ("بدون عقل", "no-brainer", "أمر بديهي / لا يحتاج تفكير", "idiom"),
    ("من الخدش", "from scratch", "من الصفر", "idiom"),
    ("ملعب الكرة", "ballpark", "تقدير تقريبي", "idiom"),
    ("الفيل في الغرفة", "elephant in the room", "المشكلة الواضحة التي يتجاهلها الجميع", "idiom"),
    ("رمي تحت الحافلة", "throw under the bus", "التضحية بشخص / الإيقاع بشخص", "idiom"),
    ("اسحب القابس", "pull the plug", "أوقف المشروع / أنهِ الأمر", "idiom"),
    ("على نفس الصفحة", "on the same page", "على توافق / متفقون", "idiom"),
    ("ركل العلبة", "kick the can", "المماطلة / تأجيل المشكلة", "idiom"),
    ("تحريك الإبرة", "move the needle", "إحداث تأثير ملموس", "idiom"),
    ("ضرب الأرض بالركض", "hit the ground running", "الانطلاق بقوة من البداية", "idiom"),
    ("نقل عمود المرمى", "move the goalpost", "تغيير المعايير والقواعد", "idiom"),
    ("غسل الأيدي", "wash hands of", "التنصل / التبرؤ من المسؤولية", "idiom"),
    ("القش الذي قصم ظهر", "the straw that broke the camel", "القشة التي قصمت ظهر البعير", "idiom"),
    ("ذيل طويل", "long tail", "الذيل الطويل (المبيعات المتخصصة)", "idiom"),
    
    # Business jargon translated literally
    ("سباق إلى القاع", "race to the bottom", "تنافس مدمّر على خفض الأسعار", "business"),
    ("الأشياء المتحركة", "moving parts", "العناصر المتغيرة / المتداخلة", "business"),
    ("طاولة التفاوض", "bring to the table", "ما تقدمه / ما تضيفه", "business"),
    ("وراء الكواليس", "behind the scenes", "في الكواليس / خلف الأضواء", "business"),
    
    # Awkward sentence patterns  
    ("يجعل معنى", "makes sense", "منطقي / يبدو صائباً", "grammar"),
    ("يصنع المعنى", "makes sense", "منطقي / يبدو صائباً", "grammar"),
    ("نهاية اللعبة", "end game", "الهدف النهائي / الغاية", "business"),
    ("عصا سحرية", "magic wand", "حل سحري / عصا سحرية", "idiom"),
    
    # Common bad patterns from Google Translate Chrome extension
    ("المزيد أو أقل", "more or less", "تقريباً / إلى حدٍّ ما", "grammar"),
    ("مع ذلك قال", "that said", "ومع ذلك", "grammar"),
    ("في الواقع بالفعل", "in fact already", "وقد سبق بالفعل", "redundancy"),
]

# Patterns that indicate generic machine translation artifacts
MACHINE_ARTIFACTS = [
    (r'هناك هي', "there are → هناك هي", "هناك / يوجد"),
    (r'و لكن أيضًا', "but also → و لكن أيضًا", "وأيضاً / فضلاً عن"),
    (r'يمكن أن يكون كذلك', "can be so", "كذلك"),
    (r'على أي حال بغض النظر', "anyway regardless", "بصرف النظر / على أي حال"),
    (r'كونها\s', "being (a/the)", "بوصفها / باعتبارها"),
]

# Scan for truncated/broken summaries (ending with \\ or incomplete)
BROKEN_PATTERNS = [
    (r'\\\\\"$', "Truncated summary ending with escaped quote"),
    (r'\\\\$', "Truncated text ending with backslash"),
    (r'\.\.\.$', "Text trailing off with ..."),
]

def scan_article(filepath):
    """Scan a single article for translation quality issues."""
    issues = []
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    filename = os.path.basename(filepath)
    lines = content.split('\n')
    
    # Check for literal translation patterns
    for bad_ar, en_original, correct_ar, category in LITERAL_PATTERNS:
        occurrences = [(i+1, line.strip()[:120]) for i, line in enumerate(lines) if bad_ar in line]
        for line_num, line_preview in occurrences:
            issues.append({
                'file': filename,
                'line': line_num,
                'category': category,
                'bad_pattern': bad_ar,
                'english_original': en_original,
                'suggested_fix': correct_ar,
                'context': line_preview
            })
    
    # Check for machine translation artifacts
    for pattern, description, fix in MACHINE_ARTIFACTS:
        matches = re.finditer(pattern, content)
        for m in matches:
            # Find line number
            pos = m.start()
            line_num = content[:pos].count('\n') + 1
            issues.append({
                'file': filename,
                'line': line_num,
                'category': 'artifact',
                'bad_pattern': description,
                'english_original': '',
                'suggested_fix': fix,
                'context': content[max(0,pos-40):pos+60].replace('\n', ' ')[:120]
            })
    
    return issues

def scan_knowledge_index():
    """Scan knowledge_index.json for translation issues in metadata."""
    issues = []
    idx_path = os.path.join(BASE_DIR, 'data', 'knowledge_index.json')
    with open(idx_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for article in data:
        slug = article.get('slug', '?')
        
        # Check summary_ar for truncation
        summary_ar = article.get('summary_ar', '')
        if summary_ar.endswith('\\') or summary_ar.endswith('\\"'):
            issues.append({
                'file': f'knowledge_index.json [{slug}]',
                'field': 'summary_ar',
                'category': 'truncated',
                'content': summary_ar[-80:]
            })
        
        # Check subtopics
        for st_list_key in ['subtopics', 'subtopics_ar']:
            for st in article.get(st_list_key, []):
                takeaway = st.get('takeaway_ar') or st.get('takeaway', '')
                title = st.get('title_ar') or st.get('title', '')
                
                # Check if takeaway is still in English
                if takeaway and not re.search(r'[\u0600-\u06FF]', takeaway):
                    issues.append({
                        'file': f'knowledge_index.json [{slug}]',
                        'field': f'subtopic #{st.get("num")} takeaway',
                        'category': 'untranslated',
                        'content': takeaway[:100]
                    })
                
                # Check if title is still in English
                if title and not re.search(r'[\u0600-\u06FF]', title):
                    issues.append({
                        'file': f'knowledge_index.json [{slug}]',
                        'field': f'subtopic #{st.get("num")} title',
                        'category': 'untranslated',
                        'content': title[:100]
                    })
                
                # Check for literal patterns in takeaways
                for bad_ar, en_original, correct_ar, category in LITERAL_PATTERNS:
                    if bad_ar in takeaway:
                        issues.append({
                            'file': f'knowledge_index.json [{slug}]',
                            'field': f'subtopic #{st.get("num")} takeaway',
                            'category': category,
                            'content': f'{bad_ar} → {correct_ar}'
                        })
    
    return issues

def main():
    print("=" * 80)
    print("🔍 COMPREHENSIVE ARABIC TRANSLATION QUALITY AUDIT")
    print("=" * 80)
    
    # 1. Scan all Arabic articles
    all_issues = []
    article_files = sorted([f for f in os.listdir(AR_DIR) if f.endswith('.md')])
    print(f"\n📂 Scanning {len(article_files)} Arabic articles...")
    
    for fname in article_files:
        fpath = os.path.join(AR_DIR, fname)
        issues = scan_article(fpath)
        all_issues.extend(issues)
    
    # 2. Scan knowledge index
    print("📂 Scanning knowledge_index.json...")
    idx_issues = scan_knowledge_index()
    
    # 3. Report
    print(f"\n{'=' * 80}")
    print(f"📊 RESULTS SUMMARY")
    print(f"{'=' * 80}")
    
    # Article issues by category
    categories = {}
    for issue in all_issues:
        cat = issue['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"\n📝 Article Translation Issues: {len(all_issues)} total")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"   • {cat}: {count}")
    
    # Index issues by category
    idx_categories = {}
    for issue in idx_issues:
        cat = issue['category']
        idx_categories[cat] = idx_categories.get(cat, 0) + 1
    
    print(f"\n📋 Knowledge Index Issues: {len(idx_issues)} total")
    for cat, count in sorted(idx_categories.items(), key=lambda x: -x[1]):
        print(f"   • {cat}: {count}")
    
    # Detailed article issues
    print(f"\n{'=' * 80}")
    print("📝 DETAILED ARTICLE ISSUES")
    print(f"{'=' * 80}")
    
    # Group by file
    by_file = {}
    for issue in all_issues:
        fname = issue['file']
        if fname not in by_file:
            by_file[fname] = []
        by_file[fname].append(issue)
    
    for fname, issues in sorted(by_file.items()):
        print(f"\n📄 {fname} ({len(issues)} issues):")
        for issue in issues:
            print(f"   L{issue['line']:4d} [{issue['category']}] «{issue['bad_pattern']}»")
            print(f"         EN: {issue['english_original']}")
            print(f"         Fix: {issue['suggested_fix']}")
    
    # Detailed index issues (first 50)
    print(f"\n{'=' * 80}")
    print("📋 KNOWLEDGE INDEX ISSUES (showing first 50)")
    print(f"{'=' * 80}")
    
    for issue in idx_issues[:50]:
        print(f"   [{issue['category']}] {issue['file']}")
        print(f"         {issue.get('field', '')}: {issue['content'][:100]}")
    
    # Save full report
    report_path = os.path.join(BASE_DIR, 'scripts', 'translation_audit_report.json')
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump({
            'article_issues': all_issues,
            'index_issues': idx_issues,
            'summary': {
                'total_article_issues': len(all_issues),
                'total_index_issues': len(idx_issues),
                'article_categories': categories,
                'index_categories': idx_categories,
                'files_with_issues': len(by_file),
                'total_files_scanned': len(article_files)
            }
        }, f, ensure_ascii=False, indent=2)
    print(f"\n💾 Full report saved to: {report_path}")

if __name__ == '__main__':
    main()
