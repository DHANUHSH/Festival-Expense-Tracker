from PIL import Image

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
img = Image.open(poster_path)
width, height = img.size

# Let's inspect a horizontal slice across row 1 (y around 410)
y_sample = 410
pixels = [img.getpixel((x, y_sample)) for x in range(width)]

# Find white / bright border lines or distinct dark gaps
# Print pixel RGB values or sample points
print(f"Image width: {width}, height: {height}")

# Let's scan along y=410 and find columns where color changes significantly
diffs = []
for x in range(1, width):
    r1, g1, b1 = img.getpixel((x-1, y_sample))
    r2, g2, b2 = img.getpixel((x, y_sample))
    diff = abs(r1-r2) + abs(g1-g2) + abs(b1-b2)
    if diff > 60:
        diffs.append((x, diff))

print(f"Significant horizontal edge changes at y={y_sample}:")
print([d[0] for d in diffs])
