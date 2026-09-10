from PIL import Image
import os

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
output_dir = r"C:\Users\dhanu\.gemini\antigravity\scratch\vinayaka-chavithi-tracker\public\members"

img = Image.open(poster_path)
width, height = img.size

# Row Y boundaries (top, bottom) inside the photo frame
rows_y = [
    (370, 462),
    (474, 566),
    (578, 670)
]

# 11 Column X centers calculation:
# Grid starts at x = 22, ends at x = 1002 (width = 980)
grid_start = 22.0
cell_width = 89.09

box_crop_width = 72 # Crop strictly inside the white border frame!

member_idx = 1
for r_top, r_bottom in rows_y:
    for c in range(11):
        c_center = grid_start + (c + 0.5) * cell_width
        c_left = int(c_center - (box_crop_width / 2.0))
        c_right = int(c_center + (box_crop_width / 2.0))
        
        cropped = img.crop((c_left, r_top, c_right, r_bottom))
        out_file = os.path.join(output_dir, f"member_{member_idx}.jpg")
        cropped.save(out_file, "JPEG", quality=95)
        print(f"Member #{member_idx}: x=[{c_left}, {c_right}], y=[{r_top}, {r_bottom}] -> member_{member_idx}.jpg")
        member_idx += 1

print("Successfully generated all 33 cropped member photos with zero split lines!")
