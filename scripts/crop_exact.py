from PIL import Image
import os

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
output_dir = r"C:\Users\dhanu\.gemini\antigravity\scratch\vinayaka-chavithi-tracker\public\members"

img = Image.open(poster_path)
width, height = img.size

# Let's define the 3 rows y-centers
row_centers = [415, 520, 625]

# For each row, let's find the 11 photo boxes by detecting the white rounded frame borders!
# A photo frame border has white/light-colored rounded border (RGB high values).
# Between photo boxes is a dark gap/separator (low RGB values).

def find_boxes_for_row(row_y):
    # Scan horizontal line at row_y
    # Determine columns where a photo box exists
    boxes = []
    
    # We know there are exactly 11 photo boxes per row
    # Total grid width is from ~x=20 to ~x=1004
    # Each box is approx 78 to 82 px wide, with gaps of ~6 to 10 px
    
    # Let's do a peak finding scan along row_y
    # A box is characterized by high brightness (photo content) bounded by white border
    # Dark gap between boxes has r<60, g<30, b<40
    
    in_photo = False
    start_x = None
    
    for x in range(15, 1015):
        r, g, b = img.getpixel((x, row_y))
        # Dark purple/black background gap
        is_dark_gap = (r < 50 and g < 40 and b < 50)
        
        if not is_dark_gap and not in_photo:
            in_photo = True
            start_x = x
        elif is_dark_gap and in_photo:
            in_photo = False
            w = x - start_x
            if w >= 45: # Valid photo box width
                boxes.append((start_x, x))
            elif len(boxes) > 0 and (start_x - boxes[-1][1]) < 8:
                # Merge small gap inside face/background if it accidentally triggered dark gap
                prev_s, prev_e = boxes.pop()
                boxes.append((prev_s, x))

    return boxes

all_row_boxes = []
for r_y in row_centers:
    boxes = find_boxes_for_row(r_y)
    print(f"Row at y={r_y} found {len(boxes)} boxes:")
    for b in boxes:
        print(f"  x: {b[0]} to {b[1]} (width {b[1]-b[0]})")
    all_row_boxes.append(boxes)
