from PIL import Image, ImageDraw, ImageFont
import os

def create_bear_icon(size=512):
    # Create image with transparency
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Scale factor
    s = size / 512.0

    # 1. Squircle background (Dark luxurious navy with subtle amber border)
    bg_box = [8 * s, 8 * s, 504 * s, 504 * s]
    draw.rounded_rectangle(bg_box, radius=110 * s, fill=(18, 20, 29, 255), outline=(217, 119, 6, 200), width=int(6 * s))

    # Inner ambient glow
    draw.ellipse([156 * s, 156 * s, 356 * s, 356 * s], fill=(217, 119, 6, 40))

    # 2. Bear Ears
    # Left Ear Outer & Inner
    draw.ellipse([90 * s, 100 * s, 210 * s, 220 * s], fill=(217, 119, 6, 255), outline=(180, 90, 5, 255), width=int(3 * s))
    draw.ellipse([120 * s, 130 * s, 180 * s, 190 * s], fill=(254, 215, 170, 255))

    # Right Ear Outer & Inner
    draw.ellipse([302 * s, 100 * s, 422 * s, 220 * s], fill=(217, 119, 6, 255), outline=(180, 90, 5, 255), width=int(3 * s))
    draw.ellipse([332 * s, 130 * s, 392 * s, 190 * s], fill=(254, 215, 170, 255))

    # 3. Bear Head
    draw.ellipse([106 * s, 140 * s, 406 * s, 440 * s], fill=(217, 119, 6, 255), outline=(180, 90, 5, 255), width=int(4 * s))

    # 4. Snout / Muzzle
    draw.ellipse([186 * s, 280 * s, 326 * s, 395 * s], fill=(254, 237, 213, 255))
    # Nose
    draw.ellipse([231 * s, 295 * s, 281 * s, 335 * s], fill=(45, 25, 15, 255))
    # Mouth line
    draw.line([256 * s, 335 * s, 256 * s, 360 * s], fill=(45, 25, 15, 255), width=int(4 * s))
    draw.arc([236 * s, 345 * s, 276 * s, 375 * s], start=0, end=180, fill=(45, 25, 15, 255), width=int(4 * s))

    # 5. Smart Glasses ("A Smart Bear")
    # Left Lens
    draw.rounded_rectangle([150 * s, 215 * s, 235 * s, 275 * s], radius=15 * s, fill=(255, 255, 255, 50), outline=(255, 255, 255, 240), width=int(6 * s))
    # Right Lens
    draw.rounded_rectangle([277 * s, 215 * s, 362 * s, 275 * s], radius=15 * s, fill=(255, 255, 255, 50), outline=(255, 255, 255, 240), width=int(6 * s))
    # Glasses Bridge
    draw.line([235 * s, 245 * s, 277 * s, 245 * s], fill=(255, 255, 255, 240), width=int(6 * s))
    # Glasses Sides
    draw.line([125 * s, 240 * s, 150 * s, 240 * s], fill=(255, 255, 255, 240), width=int(5 * s))
    draw.line([362 * s, 240 * s, 387 * s, 240 * s], fill=(255, 255, 255, 240), width=int(5 * s))

    # Eyes behind glasses
    draw.ellipse([180 * s, 235 * s, 204 * s, 259 * s], fill=(45, 25, 15, 255))
    draw.ellipse([194 * s, 239 * s, 202 * s, 247 * s], fill=(255, 255, 255, 255))
    draw.ellipse([308 * s, 235 * s, 332 * s, 259 * s], fill=(45, 25, 15, 255))
    draw.ellipse([322 * s, 239 * s, 330 * s, 247 * s], fill=(255, 255, 255, 255))

    # 6. Sparkle Star (top right)
    draw.line([430 * s, 85 * s, 430 * s, 125 * s], fill=(251, 191, 36, 255), width=int(3 * s))
    draw.line([410 * s, 105 * s, 450 * s, 105 * s], fill=(251, 191, 36, 255), width=int(3 * s))
    draw.ellipse([424 * s, 99 * s, 436 * s, 111 * s], fill=(255, 255, 255, 255))

    return img

os.makedirs('public', exist_ok=True)
os.makedirs('app', exist_ok=True)

# Generate 512x512
img512 = create_bear_icon(512)
img512.save('app/icon.png', 'PNG')
img512.save('public/icon.png', 'PNG')

# Generate 180x180 (Apple touch icon)
img180 = create_bear_icon(180)
img180.save('app/apple-icon.png', 'PNG')
img180.save('public/apple-touch-icon.png', 'PNG')

# Generate 32x32 Favicon ICO
img32 = create_bear_icon(32)
img32.save('public/favicon.ico', format='ICO', sizes=[(32, 32), (16, 16), (48, 48)])
img32.save('app/favicon.ico', format='ICO', sizes=[(32, 32), (16, 16), (48, 48)])

print("Successfully generated all favicon & app icons!")
