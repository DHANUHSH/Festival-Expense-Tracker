from PIL import Image
import os

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
output_dir = r"C:\Users\dhanu\.gemini\antigravity\scratch\vinayaka-chavithi-tracker\public\members"

img = Image.open(poster_path)
width, height = img.size

# Let's measure the exact bounding box for each row and column by finding white borders
# Poster dims: 1024 x 682

# Row Y ranges (top, bottom):
# Row 1 (Members 1-11): top ~364, bottom ~464
# Row 2 (Members 12-22): top ~469, bottom ~569
# Row 3 (Members 23-33): top ~574, bottom ~674

rows_y = [
    (364, 464),
    (469, 569),
    (574, 674)
]

# For each row, let's find the 11 photo boxes accurately by detecting white borders
def find_cell_boxes_in_row(row_top, row_bottom):
    boxes = []
    mid_y = (row_top + row_bottom) // 2
    
    # Scan along mid_y from x=15 to x=1010 to find white borders
    in_box = False
    box_start = 0
    
    for x in range(15, 1015):
        r, g, b = img.getpixel((x, mid_y))
        is_white_border = (r > 210 and g > 210 and b > 210)
        
        if is_white_border and not in_box:
            # Entering a photo frame box
            in_box = True
            box_start = x
        elif not is_white_border and in_box:
            # Checked edge, but let's make sure it's not just a bright spot inside photo
            # A true frame border has a dark gap between columns
            # Check 5 pixels ahead
            if x + 5 < width:
                r_next, g_next, b_next = img.getpixel((x + 5, mid_y))
                if r_next > 210 and g_next > 210 and b_next > 210:
                    continue # Still inside white background/photo
            
            in_box = False
            box_end = x
            if (box_end - box_start) > 40: # Valid photo box width
                boxes.append((box_start, box_end))
    return boxes

member_idx = 1
for r_idx, (r_top, r_bottom) in enumerate(rows_y):
    # Find 11 column boxes
    cols = []
    # Calculate 11 equal column segments if thresholding is noisy
    total_w = 984
    start_x = 21
    step_w = total_w / 11.0 # 89.45 pixels per box
    
    for c in range(11):
        # Add 3px inset to remove the white border line itself and crop strictly inside the face photo!
        c_left = int(start_x + c * step_w + 3)
        c_right = int(start_x + (c + 1) * step_w - 3)
        
        # Row inset
        t = r_top + 3
        b = r_bottom - 3
        
        cropped = img.crop((c_left, t, c_right, b))
        out_file = os.path.join(output_dir, f"member_{member_idx}.jpg")
        cropped.save(out_file, "JPEG", quality=95)
        print(f"Member #{member_idx}: ({c_left}, {t}, {c_right}, {b}) -> saved member_{member_idx}.jpg")
        member_idx += 1

print("Cropping complete!")
