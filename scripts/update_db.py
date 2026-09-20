import json

# Royal Young Boys Paid Donations (13 items) -> Total: 1,18,599
ryb_donations = [
    {"name": "2025 Balance Carryover", "amount": 23000, "notes": "Previous year 2025 balance carryover"},
    {"name": "Ajay", "amount": 45000, "notes": "Royal Young Boys Donation"},
    {"name": "Prabhakar", "amount": 11111, "notes": "Royal Young Boys Donation"},
    {"name": "Dinesh Reddy", "amount": 9999, "notes": "Royal Young Boys Donation"},
    {"name": "Prasad", "amount": 5001, "notes": "Royal Young Boys Donation"},
    {"name": "Chaitu", "amount": 1116, "notes": "Royal Young Boys Donation"},
    {"name": "Mahesh", "amount": 2516, "notes": "Royal Young Boys Donation"},
    {"name": "Chintu", "amount": 10001, "notes": "Royal Young Boys Donation"},
    {"name": "Sandeep", "amount": 5116, "notes": "Royal Young Boys Donation"},
    {"name": "Shakeel", "amount": 1516, "notes": "Royal Young Boys Donation"},
    {"name": "Sudhakar", "amount": 1001, "notes": "Royal Young Boys Donation"},
    {"name": "Raju", "amount": 2222, "notes": "Royal Young Boys Donation"},
    {"name": "Tirupati", "amount": 1000, "notes": "Royal Young Boys Donation"}
]

# Outers Collection (6 Days) -> Total: 77,069
outers_donations = [
    {"name": "Outers Collection Day 1", "amount": 9381, "notes": "Outers collection Day 1 (07/09/26)", "date": "2026-09-07"},
    {"name": "Outers Collection Day 2", "amount": 30683, "notes": "Outers collection Day 2 (11001 + 19682)", "date": "2026-09-08"},
    {"name": "Outers Collection Day 3", "amount": 11135, "notes": "Outers collection Day 3", "date": "2026-09-09"},
    {"name": "Outers Collection Day 4", "amount": 5100, "notes": "Outers collection Day 4", "date": "2026-09-10"},
    {"name": "Outers Collection Day 5", "amount": 6649, "notes": "Outers collection Day 5", "date": "2026-09-11"},
    {"name": "Outers Collection Day 6", "amount": 3000, "notes": "Outers collection Day 6", "date": "2026-09-12"},
    {"name": "Outers Collection Adjustment", "amount": 121, "notes": "Outers collection misc roundoff adjustment", "date": "2026-09-12"}
]

# REDDYs Collection (22 items) -> Total: 77,832
reddys_donations = [
    {"name": "DURGA D.", "amount": 10000},
    {"name": "Raja D.", "amount": 5116},
    {"name": "PURUSHOTTAM", "amount": 5120},
    {"name": "BUJJI", "amount": 5000},
    {"name": "RAVI", "amount": 5000},
    {"name": "MANOHAR", "amount": 5000},
    {"name": "SURENDAR REDDY", "amount": 5000},
    {"name": "B NARAYANA", "amount": 5000},
    {"name": "G SRINIVAS", "amount": 5000},
    {"name": "SPANDANA", "amount": 3000},
    {"name": "SARIKA", "amount": 3116},
    {"name": "VINOD", "amount": 2116},
    {"name": "BORA PRAKASH", "amount": 3500},
    {"name": "P SHYAM", "amount": 2116},
    {"name": "G PRASAD", "amount": 2000},
    {"name": "TEJESH", "amount": 2000},
    {"name": "Y SRINU", "amount": 2016},
    {"name": "MAJJI SRINU", "amount": 2500},
    {"name": "VENKATESH", "amount": 2000},
    {"name": "KISHORE", "amount": 1116},
    {"name": "KIRAN", "amount": 1116},
    {"name": "KUMARI", "amount": 1000}
]

# Committee Pending Dues List
committee_dues = [
    {"name": "Pavan jaddu", "amount": 1116, "notes": "Committee Pending Due"},
    {"name": "Ravi yerra", "amount": 1116, "notes": "Committee Pending Due"},
    {"name": "Sai Patnala", "amount": 5116, "notes": "Committee Pending Due"},
    {"name": "Praveen", "amount": 2116, "notes": "Committee Pending Due"},
    {"name": "Santosh S", "amount": 2116, "notes": "Committee Pending Due"},
    {"name": "Kishore Reddy", "amount": 2116, "notes": "Committee Pending Due"},
    {"name": "Jagadish", "amount": 1116, "notes": "Committee Pending Due"},
    {"name": "Shashi", "amount": 1116, "notes": "Committee Pending Due"},
    {"name": "Satti babu", "amount": 0, "notes": "Committee Pending Due (Amount TBD)"},
    {"name": "Jaswanth", "amount": 1516, "notes": "Committee Pending Due"},
    {"name": "Venky", "amount": 0, "notes": "Committee Pending Due (Amount TBD)"},
    {"name": "Daivik", "amount": 1116, "notes": "Pending Due Donation"}
]

all_donations = []
counter = 1

# Paid Donations
for item in ryb_donations:
    all_donations.append({
        "id": f"don_{counter}",
        "receiptNo": f"VC-DON-{str(counter).zfill(3)}",
        "donationType": "Money",
        "donorName": item["name"],
        "promisedAmount": item["amount"],
        "paidAmount": item["amount"],
        "dueAmount": 0,
        "amount": item["amount"],
        "paymentMode": "Cash",
        "phone": "",
        "date": item.get("date", "2026-09-09"),
        "notes": item.get("notes", "Royal Young Boys Donation")
    })
    counter += 1

for item in outers_donations:
    all_donations.append({
        "id": f"don_{counter}",
        "receiptNo": f"VC-DON-{str(counter).zfill(3)}",
        "donationType": "Money",
        "donorName": item["name"],
        "promisedAmount": item["amount"],
        "paidAmount": item["amount"],
        "dueAmount": 0,
        "amount": item["amount"],
        "paymentMode": "Cash",
        "phone": "",
        "date": item.get("date", "2026-09-10"),
        "notes": item.get("notes", "Outers Collection")
    })
    counter += 1

for item in reddys_donations:
    all_donations.append({
        "id": f"don_{counter}",
        "receiptNo": f"VC-DON-{str(counter).zfill(3)}",
        "donationType": "Money",
        "donorName": item["name"],
        "promisedAmount": item["amount"],
        "paidAmount": item["amount"],
        "dueAmount": 0,
        "amount": item["amount"],
        "paymentMode": "Cash",
        "phone": "",
        "date": "2026-09-15",
        "notes": "REDDYs Collection"
    })
    counter += 1

# Committee Dues
for item in committee_dues:
    all_donations.append({
        "id": f"don_{counter}",
        "receiptNo": f"VC-DON-{str(counter).zfill(3)}",
        "donationType": "Money",
        "donorName": item["name"],
        "promisedAmount": item["amount"],
        "paidAmount": 0,
        "dueAmount": item["amount"],
        "amount": 0,
        "paymentMode": "Cash",
        "phone": "",
        "date": "2026-09-20",
        "notes": item["notes"]
    })
    counter += 1

# Load db.json
db_path = "C:/Users/dhanu/.gemini/antigravity/scratch/vinayaka-chavithi-tracker/server/data/db.json"
with open(db_path, "r", encoding="utf-8") as f:
    db = json.load(f)

db["donations"] = all_donations

# Expenses
expenses = [
    { "id": "exp_1", "title": "Ganesh IDOL", "category": "Idol/Pratima", "totalAmount": 45000, "advancePaid": 45000, "dueAmount": 0, "amount": 45000, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "6ft Ganesh Idol" },
    { "id": "exp_2", "title": "Labour for site clearance", "category": "Tent/Pandal & Stage", "totalAmount": 1800, "advancePaid": 1800, "dueAmount": 0, "amount": 1800, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Site clearance labour" },
    { "id": "exp_3", "title": "Panthulu garu", "category": "Puja Materials", "totalAmount": 1001, "advancePaid": 1001, "dueAmount": 0, "amount": 1001, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Priest dakshina / honorarium" },
    { "id": "exp_4", "title": "Raata karra", "category": "Tent/Pandal & Stage", "totalAmount": 200, "advancePaid": 200, "dueAmount": 0, "amount": 200, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Pandal support post" },
    { "id": "exp_5", "title": "Pooja items", "category": "Puja Materials", "totalAmount": 860, "advancePaid": 860, "dueAmount": 0, "amount": 860, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Puja samagri" },
    { "id": "exp_6", "title": "Labour for site Holes", "category": "Tent/Pandal & Stage", "totalAmount": 1900, "advancePaid": 1900, "dueAmount": 0, "amount": 1900, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Post hole digging labour" },
    { "id": "exp_7", "title": "Labour for Posts", "category": "Tent/Pandal & Stage", "totalAmount": 1900, "advancePaid": 1900, "dueAmount": 0, "amount": 1900, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Post fixing labour" },
    { "id": "exp_8", "title": "Fuel for Rajesh/shashi to s kota for bamboos", "category": "Transportation", "totalAmount": 400, "advancePaid": 400, "dueAmount": 0, "amount": 400, "date": "2026-09-09", "paidTo": "", "spentBy": "Rajesh/Shashi", "notes": "Fuel for bamboo trip" },
    { "id": "exp_9", "title": "Commitee Banner", "category": "Decoration & Flowers", "totalAmount": 2300, "advancePaid": 2300, "dueAmount": 0, "amount": 2300, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Royal Young Boys banner printing" },
    { "id": "exp_10", "title": "Colour Chandha books", "category": "Miscellaneous", "totalAmount": 1400, "advancePaid": 1400, "dueAmount": 0, "amount": 1400, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Donation subscription receipt books" },
    { "id": "exp_11", "title": "1 load Mud", "category": "Tent/Pandal & Stage", "totalAmount": 1000, "advancePaid": 1000, "dueAmount": 0, "amount": 1000, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Site levelling mud load" },
    { "id": "exp_12", "title": "Kasara bhoggu", "category": "Puja Materials", "totalAmount": 1000, "advancePaid": 1000, "dueAmount": 0, "amount": 1000, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Charcoal for homam" },
    { "id": "exp_13", "title": "Karralu", "category": "Tent/Pandal & Stage", "totalAmount": 6000, "advancePaid": 6000, "dueAmount": 0, "amount": 6000, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Wooden beams & poles" },
    { "id": "exp_14", "title": "Transport", "category": "Transportation", "totalAmount": 350, "advancePaid": 350, "dueAmount": 0, "amount": 350, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Material transport charges" },
    { "id": "exp_15", "title": "Plywood Sheets", "category": "Tent/Pandal & Stage", "totalAmount": 1000, "advancePaid": 1000, "dueAmount": 0, "amount": 1000, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Stage flooring sheets" },
    { "id": "exp_16", "title": "Auto charges", "category": "Transportation", "totalAmount": 1000, "advancePaid": 1000, "dueAmount": 0, "amount": 1000, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Auto transport for items" },
    { "id": "exp_17", "title": "Hardware tools", "category": "Miscellaneous", "totalAmount": 1390, "advancePaid": 1390, "dueAmount": 0, "amount": 1390, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Nails, ropes, and tools" },
    { "id": "exp_18", "title": "Xtra tools", "category": "Miscellaneous", "totalAmount": 210, "advancePaid": 210, "dueAmount": 0, "amount": 210, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Extra hardware tools" },
    { "id": "exp_19", "title": "bike fuel", "category": "Transportation", "totalAmount": 350, "advancePaid": 350, "dueAmount": 0, "amount": 350, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Volunteering bike fuel" },
    { "id": "exp_20", "title": "Bamboos (150 no s)", "category": "Tent/Pandal & Stage", "totalAmount": 9900, "advancePaid": 9900, "dueAmount": 0, "amount": 9900, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "150 Nos Bamboos for pandari" },
    { "id": "exp_21", "title": "Bamboos transport charges (from Skota to pandiri)", "category": "Transportation", "totalAmount": 5000, "advancePaid": 5000, "dueAmount": 0, "amount": 5000, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "S.Kota to Pandiri truck transport" },
    { "id": "exp_22", "title": "Fuel", "category": "Transportation", "totalAmount": 200, "advancePaid": 200, "dueAmount": 0, "amount": 200, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Local transport fuel" },
    { "id": "exp_23", "title": "Cycle Tubes and hardware", "category": "Miscellaneous", "totalAmount": 910, "advancePaid": 910, "dueAmount": 0, "amount": 910, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Rubber ties & hardware" },
    { "id": "exp_24", "title": "Tarpaans", "category": "Tent/Pandal & Stage", "totalAmount": 6300, "advancePaid": 6300, "dueAmount": 0, "amount": 6300, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Waterproof tarpaulins" },
    { "id": "exp_25", "title": "Transport", "category": "Transportation", "totalAmount": 100, "advancePaid": 100, "dueAmount": 0, "amount": 100, "date": "2026-09-09", "paidTo": "", "spentBy": "", "notes": "Misc transport" },
    { "id": "exp_26", "title": "Additional Festival & Immersion Expenses", "category": "Festival Operations", "totalAmount": 83535, "advancePaid": 83535, "dueAmount": 0, "amount": 83535, "date": "2026-09-20", "paidTo": "", "spentBy": "", "notes": "Sound system, lighting, Anna Dhanam, and immersion procession expenses" }
]

db["expenses"] = expenses
db["settings"]["receiptCounter"] = counter

with open(db_path, "w", encoding="utf-8") as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print(f"Successfully updated db.json with {len(all_donations)} donations.")
