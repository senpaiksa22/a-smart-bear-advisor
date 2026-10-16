"""
Comprehensive End-to-End API and Flow Verification Script
Tests:
1. /api/articles (list, count 213)
2. /api/articles/[slug] (read article details)
3. /api/auth/register (test zero restriction password, e.g. 1 char, Unicode)
4. /api/auth/me (check authentication session)
5. /api/auth/profile (test change name)
6. /api/auth/profile (test change password without length restrictions)
7. /api/favorites (add favorite, list favorites, remove favorite)
8. /api/chat (verify live Gemini advisor integration with Jason Cohen RAG)
9. /api/conversations (list user chat history)
10. /api/feedback (submit feedback)
11. /api/auth/logout (sign out cleanly)
"""
import sys
import uuid
import json
import requests

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = 'http://localhost:3000'

def run_tests():
    print("=" * 80)
    print("🧪 FULL SYSTEM END-TO-END SUITE VERIFICATION")
    print("=" * 80)

    s = requests.Session()
    test_slug = "great-strategy"

    # Test 1: /api/articles
    print("\n[Test 1] Testing /api/articles endpoint...")
    res = s.get(f"{BASE_URL}/api/articles")
    assert res.status_code == 200, f"Failed: {res.text}"
    data = res.json()
    assert data['success'] is True
    assert data['total'] == 213
    print(f"    ✓ PASS: 213 articles and {len(data['clusters'])} clusters loaded successfully.")

    # Test 2: /api/articles/[slug]
    print(f"\n[Test 2] Testing /api/articles/{test_slug}...")
    res = s.get(f"{BASE_URL}/api/articles/{test_slug}")
    assert res.status_code == 200, f"Failed: {res.text}"
    art_data = res.json()
    assert art_data['slug'] == test_slug
    assert 'content_ar' in art_data or 'content' in art_data
    print(f"    ✓ PASS: Article '{art_data.get('title_ar')}' loaded with content length {len(art_data.get('content_ar') or art_data.get('content', ''))}.")

    # Test 3: /api/auth/register (Testing zero restriction password: e.g. 'x')
    test_user = f"tester_{uuid.uuid4().hex[:5]}"
    test_pass = "1"  # 1-character password
    print(f"\n[Test 3] Testing /api/auth/register with user='{test_user}' & 1-char password='{test_pass}'...")
    res = s.post(f"{BASE_URL}/api/auth/register", json={
        "username": test_user,
        "password": test_pass
    })
    assert res.status_code == 200, f"Failed: {res.text}"
    reg_data = res.json()
    assert reg_data['success'] is True
    print(f"    ✓ PASS: Registered successfully with no arbitrary password restrictions.")

    # Test 4: /api/auth/me
    print(f"\n[Test 4] Testing /api/auth/me...")
    res = s.get(f"{BASE_URL}/api/auth/me")
    assert res.status_code == 200, f"Failed: {res.text}"
    me_data = res.json()
    assert me_data['authenticated'] is True
    assert me_data['user']['username'] == test_user
    print(f"    ✓ PASS: Session cookie active for '{test_user}'.")

    # Test 5: /api/auth/profile -> change_username
    new_name = f"rebranded_{test_user[:10]}"
    print(f"\n[Test 5] Testing update name to '{new_name}'...")
    res = s.post(f"{BASE_URL}/api/auth/profile", json={
        "action": "change_username",
        "newUsername": new_name
    })
    assert res.status_code == 200, f"Failed: {res.text}"
    prof_data = res.json()
    assert prof_data['success'] is True
    assert prof_data['user']['username'] == new_name
    print(f"    ✓ PASS: Name updated successfully.")

    # Test 6: /api/auth/profile -> change_password (no current password needed, no min length)
    new_pass = "z"
    print(f"\n[Test 6] Testing update password to '{new_pass}' without restrictions...")
    res = s.post(f"{BASE_URL}/api/auth/profile", json={
        "action": "change_password",
        "newPassword": new_pass
    })
    assert res.status_code == 200, f"Failed: {res.text}"
    pass_data = res.json()
    assert pass_data['success'] is True
    print(f"    ✓ PASS: Password changed seamlessly.")

    # Test 7: /api/favorites
    print(f"\n[Test 7] Testing favorites API (save array, get, clear)...")
    res = s.post(f"{BASE_URL}/api/favorites", json={"favorites": [test_slug]})
    assert res.status_code == 200, f"Add favorite failed: {res.text}"
    fav_data = res.json()
    assert test_slug in fav_data['favorites']
    print(f"    ✓ Saved '{test_slug}' to favorites. Current favorites: {fav_data['favorites']}")

    # Get favorites
    res = s.get(f"{BASE_URL}/api/favorites")
    assert res.status_code == 200
    assert test_slug in res.json()['favorites']
    print(f"    ✓ Verified GET /api/favorites returns '{test_slug}'.")

    # Clear favorites
    res = s.post(f"{BASE_URL}/api/favorites", json={"favorites": []})
    assert res.status_code == 200
    assert test_slug not in res.json()['favorites']
    print(f"    ✓ Successfully cleared favorites.")

    # Test 8: /api/chat (Jason Cohen Advisor)
    print(f"\n[Test 8] Testing /api/chat with Advisor prompt...")
    chat_res = s.post(f"{BASE_URL}/api/chat", json={
        "query": "ما هي الميزة التنافسية الدائمة وكيف أبنيها؟",
        "modelId": "gemini-3.8-flash"
    })
    assert chat_res.status_code == 200, f"Chat failed: {chat_res.text}"
    chat_json = chat_res.json()
    assert chat_json['success'] is True
    answer = chat_json['message']['content']
    model_name = chat_json['modelUsed']
    print(f"    ✓ PASS: Advisor responded using [{model_name}]:")
    print(f"      Preview: {answer[:140]}...")

    # Test 9: /api/conversations
    print(f"\n[Test 9] Testing /api/conversations history...")
    res = s.get(f"{BASE_URL}/api/conversations")
    assert res.status_code == 200, f"Conversations failed: {res.text}"
    convs = res.json().get('conversations', [])
    assert len(convs) >= 1
    print(f"    ✓ PASS: Found {len(convs)} conversation thread(s) stored in database.")

    # Test 10: /api/feedback
    print(f"\n[Test 10] Testing /api/feedback submission...")
    res = s.post(f"{BASE_URL}/api/feedback", json={
        "type": "suggestion",
        "rating": 5,
        "message": "تجربة ممتازة والترجمة أصبحت بليغة جداً"
    })
    assert res.status_code == 200, f"Feedback failed: {res.text}"
    assert res.json()['success'] is True
    print(f"    ✓ PASS: Feedback recorded.")

    # Test 11: /api/auth/logout
    print(f"\n[Test 11] Testing /api/auth/logout...")
    res = s.post(f"{BASE_URL}/api/auth/logout")
    assert res.status_code == 200
    me_after = s.get(f"{BASE_URL}/api/auth/me").json()
    assert me_after['authenticated'] is False
    print(f"    ✓ PASS: User logged out cleanly.")

    print("\n" + "=" * 80)
    print("🎉 ALL 11 TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 80)

if __name__ == '__main__':
    run_tests()
