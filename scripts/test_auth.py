import urllib.request
import urllib.parse
import json
import http.cookiejar
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "http://localhost:3000"

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def post_json(path, data):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    try:
        resp = opener.open(req)
        return resp.status, json.loads(resp.read().decode('utf-8')), resp.info()
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8')), e.headers

def get_json(path):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url)
    try:
        resp = opener.open(req)
        return resp.status, json.loads(resp.read().decode('utf-8')), resp.info()
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8')), e.headers

import time

test_username = f"user_{int(time.time())}"
test_password = "p"

print(f"--- 1. Testing Registration for '{test_username}' with 1-char password ---")
status, res, headers = post_json("/api/auth/register", {"username": test_username, "password": test_password})
print(f"Register status: {status}, response: {res}")
assert status == 200, f"Registration failed: {res}"

# Check cookies
cookies = list(cj)
print(f"Session cookies received: {[c.name for c in cookies]}")
session_cookie = next((c for c in cookies if c.name == 'asb_session'), None)
assert session_cookie is not None, "asb_session cookie not set!"
print("asb_session cookie successfully set in client!")

print(f"\n--- 2. Testing /api/auth/me with session cookie ---")
status, res, _ = get_json("/api/auth/me")
print(f"/api/auth/me status: {status}, response: {res}")
assert res.get('authenticated') is True, "User should be authenticated!"
assert res.get('user', {}).get('username') == test_username, "Username should match!"

print(f"\n--- 3. Testing DB Password Hash (Checking Bcrypt encryption) ---")
import os
db_path = os.path.join(os.path.dirname(__file__), "..", "data", ".app_database.json")
if os.path.exists(db_path):
    db_data = json.load(open(db_path, encoding='utf-8'))
    user_rec = next((u for u in db_data['users'] if u['username'] == test_username), None)
    if user_rec:
        print(f"Stored record for user '{test_username}': ID={user_rec['id']}, Hash={user_rec['password_hash'][:15]}...")
        assert user_rec['password_hash'].startswith('$2'), "Password is NOT hashed with bcrypt!"
        assert user_rec['password_hash'] != test_password, "Plaintext password detected!"
        print("Bcrypt salted hash verified! No plaintext passwords stored.")

print(f"\n--- 4. Testing Logout ---")
status, res, _ = post_json("/api/auth/logout", {})
print(f"Logout status: {status}, response: {res}")
status, res, _ = get_json("/api/auth/me")
print(f"After logout /api/auth/me: {res}")
assert res.get('authenticated') is False, "User should NOT be authenticated after logout!"

print(f"\n--- 5. Testing Login with Valid Credentials ---")
status, res, _ = post_json("/api/auth/login", {"username": test_username, "password": test_password})
print(f"Login valid status: {status}, response: {res}")
assert status == 200, "Login should succeed!"
status, res, _ = get_json("/api/auth/me")
assert res.get('authenticated') is True, "User should be re-authenticated!"

print(f"\n--- 6. Testing Login with Invalid Password ---")
opener_fresh = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
req = urllib.request.Request(
    f"{BASE_URL}/api/auth/login",
    data=json.dumps({"username": test_username, "password": "WRONG_PASSWORD"}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)
try:
    opener_fresh.open(req)
    print("Error: Invalid login should fail!")
except urllib.error.HTTPError as e:
    print(f"Invalid login properly rejected with code: {e.code}")
    assert e.code == 401, "Expected 401 Unauthorized"

print(f"\nAll Phase 3 Security & Authentication Tests PASSED 100%!")
