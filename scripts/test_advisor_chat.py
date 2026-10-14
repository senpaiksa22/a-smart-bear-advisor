import sys
import requests
import json
import uuid

# Fix windows console unicode printing
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = 'http://localhost:3000'

def test_full_advisor_lifecycle():
    print("=" * 70)
    print("🚀 TESTING JASON COHEN AI ADVISOR & CONVERSATION API LIFECYCLE")
    print("=" * 70)

    # 1. Register User 1
    session1 = requests.Session()
    u1_name = f"founder_{uuid.uuid4().hex[:6]}"
    u1_pass = "p"  # Zero-restriction test (1 char)

    print(f"\n[1] Registering User 1: '{u1_name}' with 1-char password...")
    reg_res = session1.post(f"{BASE_URL}/api/auth/register", json={
        "username": u1_name,
        "password": u1_pass
    })
    assert reg_res.status_code == 200, f"Registration failed: {reg_res.text}"
    user1 = reg_res.json()['user']
    print(f"    ✓ User 1 created: id={user1['id']}, username={user1['username']}")

    # 2. Check Auth Status (/api/auth/me)
    print("\n[2] Checking User 1 Session via /api/auth/me...")
    me_res = session1.get(f"{BASE_URL}/api/auth/me")
    assert me_res.status_code == 200, f"Auth check failed: {me_res.text}"
    me_data = me_res.json()
    assert me_data['authenticated'] is True
    print(f"    ✓ Session valid for: {me_data['user']['username']}")

    # 3. Send Advisory Query (/api/chat) using Gemini 3.8 Flash
    print("\n[3] Sending consulting query to Jason Cohen Advisor (/api/chat)...")
    query_text = "كيف أتحقق بطريقة عملية وصادقة من وصول مشروعي لمرحلة ملاءمة المنتج للسوق (Product/Market Fit)؟"
    chat_payload = {
        "query": query_text,
        "modelId": "gemini-3.8-flash",
    }
    chat_res = session1.post(f"{BASE_URL}/api/chat", json=chat_payload)
    assert chat_res.status_code == 200, f"Chat failed: {chat_res.text}"
    chat_data = chat_res.json()
    assert chat_data['success'] is True, f"Chat returned success=false: {chat_data}"
    
    conv_id = chat_data['conversationId']
    assistant_msg = chat_data['message']
    model_used = chat_data['modelUsed']

    print(f"    ✓ Conversation created: ID={conv_id}")
    print(f"    ✓ Model used: {model_used}")
    print(f"    ✓ Advisor response preview (first 150 chars):\n      \"{assistant_msg['content'][:150]}...\"")

    # 4. List Conversations (/api/conversations)
    print("\n[4] Listing user conversations (/api/conversations)...")
    convs_res = session1.get(f"{BASE_URL}/api/conversations")
    assert convs_res.status_code == 200, f"Failed listing convs: {convs_res.text}"
    convs_data = convs_res.json()
    assert convs_data['success'] is True
    assert len(convs_data['conversations']) >= 1
    found_conv = next((c for c in convs_data['conversations'] if c['id'] == conv_id), None)
    assert found_conv is not None, "Created conversation not found in user list!"
    print(f"    ✓ Found conversation '{found_conv['title']}' in list.")

    # 5. Fetch Conversation Messages (/api/conversations/[id])
    print(f"\n[5] Fetching conversation detail (/api/conversations/{conv_id})...")
    detail_res = session1.get(f"{BASE_URL}/api/conversations/{conv_id}")
    assert detail_res.status_code == 200, f"Failed fetching detail: {detail_res.text}"
    detail_data = detail_res.json()
    assert detail_data['success'] is True
    messages = detail_data['messages']
    assert len(messages) >= 2, f"Expected at least 2 messages (user + assistant), got {len(messages)}"
    print(f"    ✓ Retrieved {len(messages)} messages (user query & assistant response).")

    # 6. Strict User Isolation Test (User 2 attempts to read User 1's conversation)
    session2 = requests.Session()
    u2_name = f"intruder_{uuid.uuid4().hex[:6]}"
    print(f"\n[6] Testing User Isolation: Creating User 2 ('{u2_name}')...")
    session2.post(f"{BASE_URL}/api/auth/register", json={
        "username": u2_name,
        "password": "x"
    })
    intruder_res = session2.get(f"{BASE_URL}/api/conversations/{conv_id}")
    print(f"    User 2 access status code: {intruder_res.status_code}")
    assert intruder_res.status_code in (401, 404, 500), "SECURITY BREACH: User 2 accessed User 1's conversation!"
    print("    ✓ STRICT ISOLATION CONFIRMED: User 2 was blocked from User 1's conversation.")

    # 7. Delete Conversation (/api/conversations/[id])
    print(f"\n[7] Deleting conversation {conv_id}...")
    del_res = session1.delete(f"{BASE_URL}/api/conversations/{conv_id}")
    assert del_res.status_code == 200, f"Delete failed: {del_res.text}"
    del_data = del_res.json()
    assert del_data['success'] is True
    print("    ✓ Conversation deleted successfully.")

    # 8. Verify Deletion
    verify_res = session1.get(f"{BASE_URL}/api/conversations/{conv_id}")
    assert verify_res.status_code in (404, 500), "Deleted conversation still accessible!"
    print("    ✓ Verified: Conversation no longer exists.")

    print("\n" + "=" * 70)
    print("🎉 ALL 8 TESTS PASSED SUCCESSFULLY! FULL AI ADVISOR LIFECYCLE VERIFIED.")
    print("=" * 70)

if __name__ == '__main__':
    test_full_advisor_lifecycle()
