import urllib.request
import json

# List of paid donations & carryover balance
paid_donations = [
    {"donorName": "2025 Balance Carryover", "promisedAmount": 23000, "paidAmount": 23000, "paymentMode": "Cash", "notes": "Previous year 2025 balance carryover"},
    {"donorName": "Ajay", "promisedAmount": 45000, "paidAmount": 45000, "paymentMode": "Cash", "notes": "Royal Young Boys Donation"},
    {"donorName": "Prasad", "promisedAmount": 5001, "paidAmount": 5001, "paymentMode": "Cash", "notes": "Royal Young Boys Donation"},
    {"donorName": "Chaitu", "promisedAmount": 1116, "paidAmount": 1116, "paymentMode": "Cash", "notes": "Royal Young Boys Donation"},
    {"donorName": "Mahesh", "promisedAmount": 2516, "paidAmount": 2516, "paymentMode": "Cash", "notes": "Royal Young Boys Donation"},
    {"donorName": "Chintu", "promisedAmount": 10001, "paidAmount": 10001, "paymentMode": "Cash", "notes": "Royal Young Boys Donation"},
    {"donorName": "Sandeep", "promisedAmount": 5116, "paidAmount": 5116, "paymentMode": "Cash", "notes": "Royal Young Boys Donation"},
    {"donorName": "Shakeel", "promisedAmount": 1516, "paidAmount": 1516, "paymentMode": "Cash", "notes": "Royal Young Boys Donation"},
    {"donorName": "Sudhakar", "promisedAmount": 1001, "paidAmount": 1001, "paymentMode": "Cash", "notes": "Royal Young Boys Donation"},
    {"donorName": "Outers Collection Day 1 (07/09/26)", "promisedAmount": 9381, "paidAmount": 9381, "paymentMode": "Cash", "date": "2026-09-07", "notes": "Outers collection Day 1"}
]

# List of pending due donations
due_donations = [
    {"donorName": "Dinesh", "promisedAmount": 11111, "paidAmount": 0, "paymentMode": "Cash", "notes": "Pending Due Donation"},
    {"donorName": "Daivik", "promisedAmount": 1116, "paidAmount": 0, "paymentMode": "Cash", "notes": "Pending Due Donation"},
    {"donorName": "Raju", "promisedAmount": 2222, "paidAmount": 0, "paymentMode": "Cash", "notes": "Pending Due Donation"},
    {"donorName": "Santosh yas", "promisedAmount": 2116, "paidAmount": 0, "paymentMode": "Cash", "notes": "Pending Due Donation"},
    {"donorName": "Sai Patnala", "promisedAmount": 5116, "paidAmount": 0, "paymentMode": "Cash", "notes": "Pending Due Donation"}
]

# Clear existing test donations first
req_get = urllib.request.Request('http://localhost:5000/api/donations')
current_dons = json.loads(urllib.request.urlopen(req_get).read().decode())
for d in current_dons:
    req_del = urllib.request.Request(f"http://localhost:5000/api/donations/{d['id']}", method='DELETE')
    urllib.request.urlopen(req_del)

# Add paid donations
paid_sum = 0
for d in paid_donations:
    req = urllib.request.Request(
        'http://localhost:5000/api/donations',
        data=json.dumps(d).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode())
    paid_sum += res['paidAmount']
    print(f"[PAID] {res['receiptNo']} - {res['donorName']}: Rs. {res['paidAmount']}")

# Add due donations
due_sum = 0
for d in due_donations:
    req = urllib.request.Request(
        'http://localhost:5000/api/donations',
        data=json.dumps(d).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode())
    due_sum += res['dueAmount']
    print(f"[DUE PENDING] {res['receiptNo']} - {res['donorName']}: Pledged Rs. {res['promisedAmount']} (Due: Rs. {res['dueAmount']})")

print(f"\nSUCCESS!")
print(f"Total Paid Collected: Rs. {paid_sum:,}")
print(f"Total Pending Dues: Rs. {due_sum:,}")
