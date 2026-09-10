from PIL import Image

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
img = Image.open(poster_path)
width, height = img.size

# Let's sample a horizontal line at y=415 (center of row 1 photos)
# Print horizontal brightness changes to pinpoint exact left/right of each of the 11 photo boxes
y = 415

bright_spans = []
in_span = False
start_x = 0

for x in range(10, width - 10):
    r, g, b = img.getpixel((x, y))
    brightness = (r + g + b) / 3.0
    
    # Check if pixel is dark frame border vs photo content
    # The poster background around photos is dark purple/maroon (low green, low brightness)
    is_border = (r < 50 and g < 30) or (r < 30 and g < 30 and b < 30)
    
    if not is_border and not in_span:
        in_span = True
        start_x = x
    elif is_border and in_span:
        in_span = False
        if (x - start_x) > 30: # minimum width of a photo box
            bright_spans.append((start_x, x))

print(f"Row 1 (y={y}) detected photo spans ({len(bright_spans)} spans):")
for idx, (s, e) in enumerate(bright_spans):
    print(f"Photo #{idx+1}: x={s} to {e} (width {e-s})")
