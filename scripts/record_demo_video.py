import os
import sys
import glob
import subprocess
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright

video_dir = os.path.join(os.getcwd(), 'public', 'demo', 'video')
os.makedirs(video_dir, exist_ok=True)

# Clean previous recordings in video_dir
for f in glob.glob(os.path.join(video_dir, '*.*')):
    try:
        os.remove(f)
    except:
        pass

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={'width': 1280, 'height': 750},
        record_video_dir=video_dir,
        record_video_size={'width': 1280, 'height': 750}
    )
    
    page = context.new_page()
    page.goto('http://localhost:3000')
    page.evaluate("() => localStorage.setItem('asb_welcome_seen', 'true')")
    
    # 1. Open Homepage
    print("[1/5] Loading Homepage...", flush=True)
    page.goto('http://localhost:3000', wait_until='networkidle')
    page.wait_for_timeout(2500)
    
    # Smooth scroll down to showcase the knowledge map and clusters
    print("[2/5] Exploring Knowledge Map & Clusters...", flush=True)
    page.mouse.wheel(0, 400)
    page.wait_for_timeout(1800)
    page.mouse.wheel(0, -200)
    page.wait_for_timeout(1200)
    
    # 2. Click an article card to show the article reader
    print("[3/5] Opening Article Reader...", flush=True)
    read_btn = page.locator('button:has-text("قراءة"), span:has-text("قراءة")').first
    read_btn.click()
    page.wait_for_timeout(2000)
    
    # Scroll slightly inside the article drawer to showcase the executive summary
    drawer_scroll = page.locator('div.fixed.inset-0.z-50.overflow-y-auto').first
    if drawer_scroll.is_visible():
        drawer_scroll.evaluate("el => el.scrollBy({ top: 250, behavior: 'smooth' })")
        page.wait_for_timeout(1500)
    
    # 3. Consult Jason Cohen from inside the article
    print("[4/5] Launching AI Advisor with Article Context...", flush=True)
    consult_btn = page.locator('button:has-text("استشر جيسون")').first
    consult_btn.click()
    page.wait_for_timeout(1500)
    
    # 4. Ask a sharp strategic question
    print("[5/5] Asking Jason Cohen a Strategic Founder Question...", flush=True)
    textarea = page.locator('textarea').first
    question_text = "كيف أطبق هذا المبدأ لزيادة استعداد العميل للدفع (WTP) دون خسارة العملاء الأوائل؟"
    
    # Type character by character for realistic demo video feel
    for char in question_text:
        textarea.type(char, delay=20)
    page.wait_for_timeout(400)
    
    send_btn = page.locator('button[title="إرسال الاستفسار"]').first
    send_btn.click()
    
    print("Waiting for Jason Cohen's AI consultation...", flush=True)
    page.wait_for_selector('button[title="نسخ الإجابة"]', timeout=45000)
    page.wait_for_timeout(2500)
    
    # Scroll chat to show full response and takeaway
    print("Consultation received! Showcasing response...", flush=True)
    chat_scroll = page.locator('.overflow-y-auto').last
    try:
        chat_scroll.evaluate("el => el.scrollBy({ top: 400, behavior: 'smooth' })")
    except:
        pass
    page.wait_for_timeout(4000)
    
    # Close context to write and finalize video
    context.close()
    browser.close()
    print("Playwright recording closed.", flush=True)

# Find the recorded video file
recordings = glob.glob(os.path.join(video_dir, '*.webm'))
if recordings:
    raw_video = recordings[0]
    final_webm = os.path.join(os.getcwd(), 'public', 'demo', 'smart_bear_demo.webm')
    final_mp4 = os.path.join(os.getcwd(), 'public', 'demo', 'smart_bear_demo.mp4')
    
    if os.path.exists(final_webm):
        try: os.remove(final_webm)
        except: pass
    os.rename(raw_video, final_webm)
    print(f"Demo video saved as WebM: {final_webm}", flush=True)
    
    # Convert to MP4 using ffmpeg with libx264 for universal mobile/desktop compatibility
    try:
        if os.path.exists(final_mp4):
            try: os.remove(final_mp4)
            except: pass
        cmd = f'ffmpeg -y -i "{final_webm}" -c:v libx264 -pix_fmt yuv420p "{final_mp4}"'
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if res.returncode == 0:
            print(f"Demo video successfully converted to MP4: {final_mp4}", flush=True)
        else:
            print(f"ffmpeg notice: {res.stderr[:200]}", flush=True)
    except Exception as e:
        print(f"Error during mp4 conversion: {e}", flush=True)

print("VIDEO RECORDING PIPELINE COMPLETED SUCCESSFULLY!", flush=True)
