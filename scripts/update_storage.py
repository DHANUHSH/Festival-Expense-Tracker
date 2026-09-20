import json

with open("server/data/db.json", "r", encoding="utf-8") as f:
    db = json.load(f)

storage_code = f"""// Unified Storage & API service for both local Express server and GitHub Pages static hosting

import defaultDbData from '../../server/data/db.json';
import cloudSync from './cloudSync.js';

const STORAGE_KEY = 'vinayaka_chavithi_db_v1';

// Check if running on static host (like GitHub Pages) or local backend server
function getLocalStore() {{
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {{
    try {{
      return JSON.parse(stored);
    }} catch (e) {{
      console.error('Error parsing localStorage db:', e);
    }}
  }}

  // Initialize with initial database snapshot
  const initial = {{
    donations: {json.dumps(db['donations'], indent=6)},
    expenses: {json.dumps(db['expenses'], indent=6)},
    events: defaultDbData.events || [],
    members: defaultDbData.members || [],
    families: defaultDbData.families || [
      {{ id: "fam_1", familyHead: "Kothapalli Ramesh", gothram: "Kasyapa", familyMembers: "Lakshmi (Wife), Rahul (Son)", phone: "9876543210", address: "", poojaRequested: "Laxmiganapathi Homam", date: "2026-09-09" }}
    ],
    ladduBids: [
      {{ id: "bid_1", bidderName: "Sri Chintu Garu", amount: 15000, gothram: "Shiva Gothram", phone: "9876543210", paymentStatus: "Pending", timestamp: "2026-09-09" }},
      {{ id: "bid_2", bidderName: "Sri Ajay Garu", amount: 12000, gothram: "Kasyapa Gothram", phone: "9876543211", paymentStatus: "Paid", timestamp: "2026-09-09" }}
    ],
    prasadamSponsors: [
      {{ id: "sp_1", sponsorName: "Prasad & Family", item: "Anna Dhanam (Lunch)", date: "2026-09-14", phone: "9876543210" }},
      {{ id: "sp_2", sponsorName: "Chaitu & Family", item: "Evening Prasadam", date: "2026-09-15", phone: "9876543212" }}
    ],
    prasadamChecklist: [
      {{ id: "pc_1", name: "25kg Sona Masoori Rice (10 Bags)", completed: true }},
      {{ id: "pc_2", name: "Toor Dal (50 kg)", completed: true }},
      {{ id: "pc_3", name: "Pure Cow Ghee (15 Litres)", completed: false }},
      {{ id: "pc_4", name: "Cooking Oil (5 Tins)", completed: false }},
      {{ id: "pc_5", name: "Banana Leaf Plates (2000 Nos)", completed: false }}
    ],
    samagriChecklist: [
      {{ id: "sc_1", name: "Flowers (Garlands & Loose Lotus)", completed: true }},
      {{ id: "sc_2", name: "Coconuts (108 Nos)", completed: true }},
      {{ id: "sc_3", name: "Camphor, Incense & Oil Wicks", completed: true }},
      {{ id: "sc_4", name: "Betel Leaves & Areca Nuts", completed: false }},
      {{ id: "sc_5", name: "Sandalwood Paste & Turmeric Kumkum", completed: true }}
    ],
    settings: defaultDbData.settings || {{
      eventName: "Royal Young Boys Association - Ganesh Agamanam 2026",
      year: 2026,
      receiptPrefix: "VC-DON-",
      receiptCounter: {db['settings']['receiptCounter']}
    }}
  }};

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}}

function saveLocalStore(db) {{
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  try {{
    cloudSync.broadcastMutation(db);
  }} catch (e) {{}}
}}

export function computeSummary(db) {{
  let totalPromisedDonations = 0;
  let totalPaidDonations = 0;
  let totalDueDonations = 0;
  let itemDonationCount = 0;

  (db.donations || []).forEach(d => {{
    if (d.donationType === 'Item') {{
      itemDonationCount += 1;
    }} else {{
      const promised = Number(d.promisedAmount !== undefined ? d.promisedAmount : d.amount) || 0;
      const paid = Number(d.paidAmount !== undefined ? d.paidAmount : d.amount) || 0;
      const due = Math.max(0, promised - paid);

      totalPromisedDonations += promised;
      totalPaidDonations += paid;
      totalDueDonations += due;
    }}
  }});

  let totalExpensesAgreed = 0;
  let totalExpensesAdvance = 0;
  let totalExpensesDue = 0;

  (db.expenses || []).forEach(e => {{
    const total = Number(e.totalAmount !== undefined ? e.totalAmount : e.amount) || 0;
    const advance = Number(e.advancePaid !== undefined ? e.advancePaid : e.amount) || 0;
    const due = Math.max(0, total - advance);

    totalExpensesAgreed += total;
    totalExpensesAdvance += advance;
    totalExpensesDue += due;
  }});

  const remainingBalance = totalPaidDonations - totalExpensesAdvance;

  const categoryMap = {{}};
  (db.expenses || []).forEach(exp => {{
    const cat = exp.category || 'Miscellaneous';
    const val = Number(exp.totalAmount !== undefined ? exp.totalAmount : exp.amount) || 0;
    categoryMap[cat] = (categoryMap[cat] || 0) + val;
  }});

  const categoryBreakdown = Object.keys(categoryMap).map(cat => ({{
    name: cat,
    value: categoryMap[cat]
  }}));

  const members = db.members || [];
  const inMandapam = members.filter(m => m.status === 'IN_MANDAPAM').length;
  const outForWork = members.filter(m => m.status === 'OUT_FOR_WORK').length;
  const notInMandapam = members.filter(m => m.status === 'NOT_IN_MANDAPAM').length;

  const families = db.families || [];
  const gothramSet = new Set(families.map(f => f.gothram?.trim().toLowerCase()).filter(Boolean));

  return {{
    totalPromisedDonations,
    totalPaidDonations,
    totalDueDonations,
    totalExpensesAgreed,
    totalExpensesAdvance,
    totalExpensesDue,
    remainingBalance,
    donationCount: (db.donations || []).length,
    itemDonationCount,
    expenseCount: (db.expenses || []).length,
    eventCount: (db.events || []).length,
    familyCount: families.length,
    gothramCount: gothramSet.size,
    memberCounts: {{
      total: members.length,
      inMandapam,
      outForWork,
      notInMandapam
    }},
    categoryBreakdown,
    settings: db.settings
  }};
}}

export default {{
  getLocalStore,
  saveLocalStore,
  computeSummary
}};
"""

with open("src/services/storage.js", "w", encoding="utf-8") as f:
    f.write(storage_code)

print("Successfully updated src/services/storage.js!")
