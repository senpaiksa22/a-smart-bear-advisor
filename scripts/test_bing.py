from curl_cffi import requests
import re
import json

session = requests.Session(impersonate='chrome120')
r = session.get('https://www.bing.com/translator')

ig_match = re.search(r'IG:"([A-Za-z0-9]+)"', r.text)
iid_match = re.search(r'data-iid="([^"]+)"', r.text)
token_match = re.search(r'params_RichTranslateHelper\s*=\s*\[([^\]]+)\]', r.text)

if token_match and ig_match:
    parts = [p.strip().strip('"') for p in token_match.group(1).split(',')]
    key = parts[0]
    token = parts[1]
    ig = ig_match.group(1)
    iid = iid_match.group(1) if iid_match else "translator.5029"
    
    url = f"https://www.bing.com/ttranslatev3?isVertical=1&&IG={ig}&IID={iid}"
    data = {
        'fromLang': 'en',
        'text': 'Avoid blundering: 80% of a winning strategy',
        'to': 'ar',
        'token': token,
        'key': key
    }
    resp = session.post(url, data=data)
    print("Bing status:", resp.status_code)
    try:
        res_json = resp.json()
        print("Bing translated:", res_json[0]['translations'][0]['text'])
    except Exception as e:
        print("Parse error:", e, resp.text[:200])
else:
    print("Could not find token or IG")
