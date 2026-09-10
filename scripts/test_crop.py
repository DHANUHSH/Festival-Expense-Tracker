from PIL import Image, ImageDraw

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
img = Image.open(poster_path)
width, height = img.size

# Let's test exact pixel coordinates of the 3 rows x 11 cols grid
# Total poster size: 1024 x 682

# Row Y coordinates (top, bottom) in pixels:
# The photo grid starts at y = 368 and ends at y = 672
# Row 1: y = 368 to 468 (height 100)
# Row 2: y = 470 to 570 (height 100)
# Row 3: y = 572 to 672 (height 100)

# Column X coordinates for 11 columns:
# Total width of grid: x = 20 to 1004 (width ~ 984 pixels)
# Each column is about 89 pixels wide, with ~ 0.5px gap
# Col 1: x=20 to 108
# Col 2: x=109 to 197
# Col 3: x=198 to 286
# Col 4: x=287 to 375
# Col 5: x=376 to 464
# Col 6: x=465 to 553
# Col 7: x=554 to 642
# Col 8: x=643 to 731
# Col 9: x=732 to 820
# Col 10: x=821 to 909
# Col 11: x=910 to 998

row_ranges = [
    (368, 468),
    (470, 570),
    (572, 672)
]

col_step = 89.2
col_start = 20

cols_coords = []
for c in range(11):
    l = int(col_start + c * col_step)
    r = int(col_start + (c + 1) * col_step - 1)
    cols_coords.append((l, r))

print("Columns X coordinates:")
for i, (l, r) in enumerate(cols_coords):
    print(f"Col {i+1}: left={l}, right={r}, width={r-l}")

# Draw boxes on copy of image to verify
debug_img = img.copy()
draw = ImageDraw.Draw(debug_img)

for r_top, r_bottom in row_ranges:
    for c_left, c_right in cols_coords:
        draw.rectangle([c_left, r_top, c_right, r_bottom], outline="yellow", width=2)

debug_img.save(r"C:\Users\dhanu\.gemini\antigravity\scratch\vinayaka-chavithi-tracker\public\members_debug.jpg")
print("Saved debug grid image to public/members_debug.jpg")
