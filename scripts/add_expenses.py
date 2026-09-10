import urllib.request
import json

expenses_data = [
    {"title": "Ganesh IDOL", "category": "Idol/Pratima", "totalAmount": 45000, "advancePaid": 45000, "notes": "6ft Ganesh Idol"},
    {"title": "Labour for site clearance", "category": "Tent/Pandal & Stage", "totalAmount": 1800, "advancePaid": 1800, "notes": "Site clearance labour"},
    {"title": "Panthulu garu", "category": "Puja Materials", "totalAmount": 1001, "advancePaid": 1001, "notes": "Priest dakshina / honorarium"},
    {"title": "Raata karra", "category": "Tent/Pandal & Stage", "totalAmount": 200, "advancePaid": 200, "notes": "Pandal support post"},
    {"title": "Pooja items", "category": "Puja Materials", "totalAmount": 860, "advancePaid": 860, "notes": "Puja samagri"},
    {"title": "Labour for site Holes", "category": "Tent/Pandal & Stage", "totalAmount": 1900, "advancePaid": 1900, "notes": "Post hole digging labour"},
    {"title": "Labour for Posts", "category": "Tent/Pandal & Stage", "totalAmount": 1900, "advancePaid": 1900, "notes": "Post fixing labour"},
    {"title": "Fuel for Rajesh/shashi to s kota for bamboos", "category": "Transportation", "totalAmount": 400, "advancePaid": 400, "spentBy": "Rajesh/Shashi", "notes": "Fuel for bamboo trip"},
    {"title": "Commitee Banner", "category": "Decoration & Flowers", "totalAmount": 2300, "advancePaid": 2300, "notes": "Royal Young Boys banner printing"},
    {"title": "Colour Chandha books", "category": "Miscellaneous", "totalAmount": 1400, "advancePaid": 1400, "notes": "Donation subscription receipt books"},
    {"title": "1 load Mud", "category": "Tent/Pandal & Stage", "totalAmount": 1000, "advancePaid": 1000, "notes": "Site levelling mud load"},
    {"title": "Kasara bhoggu", "category": "Puja Materials", "totalAmount": 1000, "advancePaid": 1000, "notes": "Charcoal for homam"},
    {"title": "Karralu", "category": "Tent/Pandal & Stage", "totalAmount": 6000, "advancePaid": 6000, "notes": "Wooden beams & poles"},
    {"title": "Transport", "category": "Transportation", "totalAmount": 350, "advancePaid": 350, "notes": "Material transport charges"},
    {"title": "Plywood Sheets", "category": "Tent/Pandal & Stage", "totalAmount": 1000, "advancePaid": 1000, "notes": "Stage flooring sheets"},
    {"title": "Auto charges", "category": "Transportation", "totalAmount": 1000, "advancePaid": 1000, "notes": "Auto transport for items"},
    {"title": "Hardware tools", "category": "Miscellaneous", "totalAmount": 1390, "advancePaid": 1390, "notes": "Nails, ropes, and tools"},
    {"title": "Xtra tools", "category": "Miscellaneous", "totalAmount": 210, "advancePaid": 210, "notes": "Extra hardware tools"},
    {"title": "bike fuel", "category": "Transportation", "totalAmount": 350, "advancePaid": 350, "notes": "Volunteering bike fuel"},
    {"title": "Bamboos (150 no s)", "category": "Tent/Pandal & Stage", "totalAmount": 9900, "advancePaid": 9900, "notes": "150 Nos Bamboos for pandari"},
    {"title": "Bamboos transport charges (from Skota to pandiri)", "category": "Transportation", "totalAmount": 5000, "advancePaid": 5000, "notes": "S.Kota to Pandiri truck transport"},
    {"title": "Fuel", "category": "Transportation", "totalAmount": 200, "advancePaid": 200, "notes": "Local transport fuel"},
    {"title": "Cycle Tubes and hardware", "category": "Miscellaneous", "totalAmount": 910, "advancePaid": 910, "notes": "Rubber ties & hardware"},
    {"title": "Tarpaans", "category": "Tent/Pandal & Stage", "totalAmount": 6300, "advancePaid": 6300, "notes": "Waterproof tarpaulins"},
    {"title": "Transport", "category": "Transportation", "totalAmount": 100, "advancePaid": 100, "notes": "Misc transport"}
]

# Clear existing expenses first to avoid duplicate additions
req_get = urllib.request.Request('http://localhost:5000/api/expenses')
current_exps = json.loads(urllib.request.urlopen(req_get).read().decode())
for exp in current_exps:
    req_del = urllib.request.Request(f"http://localhost:5000/api/expenses/{exp['id']}", method='DELETE')
    urllib.request.urlopen(req_del)

count = 0
total_sum = 0

for item in expenses_data:
    req = urllib.request.Request(
        'http://localhost:5000/api/expenses',
        data=json.dumps(item).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode())
    count += 1
    total_sum += res['totalAmount']
    print(f"[{count}/25] Added: {res['title']} -> Rs. {res['totalAmount']}")

print(f"\nSUCCESS! Added all {count} expenses. Overall Total: Rs. {total_sum:,}")
