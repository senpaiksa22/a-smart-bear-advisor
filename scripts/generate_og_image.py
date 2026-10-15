from PIL import Image, ImageDraw, ImageFont
import os

width = 1200
height = 630

# Create base dark image
img = Image.new('RGB', (width, height), color=(12, 13, 20))
draw = ImageDraw.Draw(img)

# Draw radial ambient glows
for r in range(400, 0, -5):
    alpha = int(35 * (1 - r / 400))
    # Amber glow at top left
    draw.ellipse([150 - r, 120 - r, 150 + r, 120 + r], fill=(217, 119, 6, alpha))
    # Forest emerald glow at bottom right
    draw.ellipse([1050 - r, 500 - r, 1050 + r, 500 + r], fill=(72, 99, 55, alpha))

# Inner border frame
draw.rounded_rectangle([30, 30, width - 30, height - 30], radius=28, outline=(40, 44, 60), width=2)

# Load font if available or use default
try:
    font_title = ImageFont.truetype("arial.ttf", 52)
    font_sub = ImageFont.truetype("arial.ttf", 26)
    font_badge = ImageFont.truetype("arialbd.ttf", 20)
    font_small = ImageFont.truetype("arial.ttf", 18)
except:
    font_title = font_sub = font_badge = font_small = ImageFont.load_default()

# Top Badge: A SMART BEAR ADVISOR
draw.rounded_rectangle([420, 90, 780, 140], radius=25, fill=(35, 25, 15), outline=(180, 100, 20), width=1)
draw.text((600, 115), "BEAR  •  A SMART BEAR ADVISOR", fill=(245, 158, 11), font=font_badge, anchor="mm")

# Main Title: A Smart Bear Advisor
draw.text((600, 230), "مستشار الدب الذكي", fill=(255, 255, 255), font=font_title, anchor="mm")
draw.text((600, 295), "Jason Cohen's Startup Philosophy & Frameworks", fill=(254, 243, 199), font=font_sub, anchor="mm")

# Divider line
draw.line([350, 350, 850, 350], fill=(60, 65, 85), width=2)

# Subtitle / Description
draw.text((600, 395), "خلاصة عقدين في بناء الشركات البرمجية من الصفر إلى اليونيكورن", fill=(214, 211, 209), font=font_sub, anchor="mm")
draw.text((600, 435), "WP Engine & Smart Bear Software", fill=(168, 162, 158), font=font_small, anchor="mm")

# Bottom 3 Badges
# Badge 1: 213 Essays
draw.rounded_rectangle([180, 500, 440, 555], radius=16, fill=(25, 28, 40), outline=(50, 55, 75), width=1)
draw.text((310, 527), "213 مقالاً استراتيجياً", fill=(220, 220, 225), font=font_badge, anchor="mm")

# Badge 2: AI Advisor
draw.rounded_rectangle([470, 500, 730, 555], radius=16, fill=(25, 28, 40), outline=(50, 55, 75), width=1)
draw.text((600, 527), "مستشار ذكاء اصطناعي", fill=(220, 220, 225), font=font_badge, anchor="mm")

# Badge 3: 100% Free
draw.rounded_rectangle([760, 500, 1020, 555], radius=16, fill=(35, 30, 20), outline=(217, 119, 6), width=1)
draw.text((890, 527), "مجاني 100% للأبد", fill=(251, 191, 36), font=font_badge, anchor="mm")

os.makedirs('public', exist_ok=True)
out_path = os.path.join('public', 'og-image.png')
img.save(out_path, format='PNG', quality=95)
print(f"Successfully generated {out_path} ({width}x{height})")
