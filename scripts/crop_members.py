import os
from PIL import Image

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
output_dir = r"C:\Users\dhanu\.gemini\antigravity\scratch\vinayaka-chavithi-tracker\public\members"

os.makedirs(output_dir, exist_ok=True)

img = Image.open(poster_path)
width, height = img.size
print(f"Poster dimensions: {width} x {height}")

# The poster has 3 rows of 11 member photos at the bottom half.
# Let's locate the photo grid bounding box based on poster aspect ratio.
# Row 1 top ~53.5%, bottom ~68.0%
# Row 2 top ~68.5%, bottom ~83.0%
# Row 3 top ~83.5%, bottom ~98.0%
# Left margin ~ 1.8%, Right margin ~ 98.2%

row_height_pct = 0.145
row_tops_pct = [0.535, 0.683, 0.832]

cols = 11
rows = 3

margin_left_pct = 0.018
margin_right_pct = 0.982
grid_width_pct = margin_right_pct - margin_left_pct
col_width_pct = grid_width_pct / cols

member_idx = 1

for r_idx, top_pct in enumerate(row_tops_pct):
    top = int(height * top_pct)
    bottom = int(height * (top_pct + row_height_pct))
    
    for c_idx in range(cols):
        left = int(width * (margin_left_pct + c_idx * col_width_pct + 0.002))
        right = int(width * (margin_left_pct + (c_idx + 1) * col_width_pct - 0.002))
        
        cropped = img.crop((left, top, right, bottom))
        out_file = os.path.join(output_dir, f"member_{member_idx}.jpg")
        cropped.save(out_file, "JPEG", quality=90)
        print(f"Saved member_{member_idx}.jpg ({right-left}x{bottom-top})")
        member_idx += 1

print("Successfully cropped all 33 committee member photos!")
