from PIL import Image, ImageDraw
import os

def create_og_bear_image():
    width = 1200
    height = 630
    img = Image.new('RGBA', (width, height), (18, 20, 29, 255))
    draw = ImageDraw.Draw(img)

    # Ambient radial glow in center
    for r in range(350, 0, -5):
        alpha = int(45 * (1 - r / 350))
        draw.ellipse([600 - r, 315 - r, 600 + r, 315 + r], fill=(217, 119, 6, alpha))

    # Load 512x512 bear icon
    bear_path = os.path.join('public', 'icon.png')
    if not os.path.exists(bear_path):
        import generate_favicon
        generate_favicon.create_bear_icon(512).save(bear_path, 'PNG')

    bear = Image.open(bear_path).convert('RGBA')
    # Resize to 480x480
    bear_resized = bear.resize((480, 480), Image.Resampling.LANCZOS)

    # Paste in exact center: x = (1200 - 480) / 2 = 360, y = (630 - 480) / 2 = 75
    img.paste(bear_resized, (360, 75), bear_resized)

    # Convert to RGB and save
    final = img.convert('RGB')
    os.makedirs('public', exist_ok=True)
    os.makedirs('app', exist_ok=True)
    final.save('public/og-image.png', 'PNG', quality=95)
    final.save('app/opengraph-image.png', 'PNG', quality=95)
    final.save('app/twitter-image.png', 'PNG', quality=95)
    print('Generated new centered Smart Bear OG image!')

if __name__ == '__main__':
    create_og_bear_image()
