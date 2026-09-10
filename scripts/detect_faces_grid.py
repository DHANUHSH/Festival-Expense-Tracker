from PIL import Image, ImageDraw

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
img = Image.open(poster_path)
width, height = img.size

# Let's manually calibrate the EXACT (x1, y1, x2, y2) bounding box for each of the 33 photos
# The poster has 3 rows of 11 rounded cards.
# Notice: In the poster, the purple/gold container has a border around the 3 rows.
# Row 1 (Members 1 - 11):
#   Y top ~ 368, Y bottom ~ 463
# Row 2 (Members 12 - 22):
#   Y top ~ 472, Y bottom ~ 567
# Row 3 (Members 23 - 33):
#   Y top ~ 576, Y bottom ~ 671

# Let's inspect the X center for each column (c = 0..10):
# Looking at Member #25, #26, #27, #28, #29, #30 in user screenshot:
# In Row 3, Member 25 (c=2) had a split line on the right! That means x_right was too far right (into Member 26's frame).
# Member 26 (c=1) showed Member 26 on left, Member 27 on right!
# Why? Because the step size between columns was too large!
# Let's measure the actual width of each photo card:
# The cards have width ~ 78px and margin between cards ~ 10px.
# Total width for 1 card + 1 gap = 88px.
# 11 cards * 88px = 968px.
# Margin left: ~ 28px.

# Let's test:
margin_left = 26
card_w = 76
gap_w = 12

# Let's test column X ranges:
# c=0: 26 to 102
# c=1: 114 to 190
# c=2: 202 to 278
# c=3: 290 to 366
# c=4: 378 to 454
# c=5: 466 to 542
# c=6: 554 to 630
# c=7: 642 to 718
# c=8: 730 to 806
# c=9: 818 to 894
# c=10: 906 to 982

# Notice the crop box width is 76 (instead of 89!).
# This ensures it crops ONLY inside the face photo box and CANNOT touch the neighboring photo box!

row_y = [
    (370, 460),
    (474, 564),
    (578, 668)
]

col_x = [
    (int(margin_left + c * (card_w + gap_w)), int(margin_left + c * (card_w + gap_w) + card_w))
    for c in range(11)
]

print("Calibrated Column X ranges:")
for i, (l, r) in enumerate(col_x):
    print(f"Col {i+1}: left={l}, right={r}")

import os
out_dir = r"C:\Users\dhanu\.gemini\antigravity\scratch\vinayaka-chavithi-tracker\public\members"

member_idx = 1
for r_top, r_bottom in row_y:
    for c_left, c_right in col_x:
        # Crop with 4px inner inset to strictly isolate the face!
        cropped = img.crop((c_left + 4, r_top + 4, c_right - 4, r_bottom - 4))
        out_file = os.path.join(out_dir, f"member_{member_idx}.jpg")
        cropped.save(out_file, "JPEG", quality=95)
        member_idx += 1

print("Successfully updated all 33 photos with tight face isolation!")
