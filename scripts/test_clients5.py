import urllib.request
import urllib.parse
import json
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

text = "Take the TV show above. Despite the stated demographic, most females 19-29 don't watch that show. Why not--what differentiates those who watch from those who don't? Conversely, many people who are not females 19-29 do watch it. Why?"

url = f"https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl=ar&q={urllib.parse.quote(text)}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

with urllib.request.urlopen(req, timeout=5) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    print("Translated:", data)
