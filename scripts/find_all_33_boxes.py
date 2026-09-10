from PIL import Image

poster_path = r"C:\Users\dhanu\.gemini\antigravity\brain\5b1c2ec3-29d5-482e-9bda-4313a6209625\.user_uploaded\media_1788967988533.jpg"
img = Image.open(poster_path)
width, height = img.size

# Let's inspect the y-center for each row
row_y_centers = [415, 520, 625]

# For each row, let's scan pixel by pixel across x from 10 to 1014
# A photo frame in the poster has a bright white rounded border around it.
# The area between photo frames is the dark maroon poster background.
# Let's find the exact (left, right) x-coordinates of all 11 boxes in each row.

all_rows_coords = []

for r_idx, r_y in enumerate(row_y_centers):
    # Sample brightness along horizontal line r_y
    # We will also sample r_y - 10 and r_y + 10 to be robust against dark clothes/backgrounds
    line_spans = []
    
    # We know each photo box is roughly 75-85px wide and gaps are ~8-12px
    # Let's measure the column positions by checking the white border vertical lines!
    # The vertical white border of each photo frame shows up as bright pixels (R>180, G>180, B>180) 
    # surrounded by dark background.
    
    # Let's find white vertical border lines at row_y
    borders = []
    for x in range(15, 1015):
        r, g, b = img.getpixel((x, r_y))
        # White border test
        if r > 180 and g > 180 and b > 180:
            borders.append(x)
            
    print(f"Row {r_idx+1} (y={r_y}) border pixels count: {len(borders)}")

