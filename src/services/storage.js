// Unified Storage & API service for both local Express server and GitHub Pages static hosting

import defaultDbData from '../../server/data/db.json';

const STORAGE_KEY = 'vinayaka_chavithi_db_v1';

// Check if running on static host (like GitHub Pages) or local backend server
function getLocalStore() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing localStorage db:', e);
    }
  }

  // Initialize with initial database snapshot
  const initial = {
    donations: [
      { id: "don_1", receiptNo: "VC-DON-001", donationType: "Money", donorName: "2025 Balance Carryover", promisedAmount: 23000, paidAmount: 23000, dueAmount: 0, amount: 23000, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Previous year 2025 balance carryover" },
      { id: "don_2", receiptNo: "VC-DON-002", donationType: "Money", donorName: "Ajay", promisedAmount: 45000, paidAmount: 45000, dueAmount: 0, amount: 45000, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Royal Young Boys Donation" },
      { id: "don_3", receiptNo: "VC-DON-003", donationType: "Money", donorName: "Prasad", promisedAmount: 5001, paidAmount: 5001, dueAmount: 0, amount: 5001, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Royal Young Boys Donation" },
      { id: "don_4", receiptNo: "VC-DON-004", donationType: "Money", donorName: "Chaitu", promisedAmount: 1116, paidAmount: 1116, dueAmount: 0, amount: 1116, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Royal Young Boys Donation" },
      { id: "don_5", receiptNo: "VC-DON-005", donationType: "Money", donorName: "Mahesh", promisedAmount: 2516, paidAmount: 2516, dueAmount: 0, amount: 2516, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Royal Young Boys Donation" },
      { id: "don_6", receiptNo: "VC-DON-006", donationType: "Money", donorName: "Chintu", promisedAmount: 10001, paidAmount: 10001, dueAmount: 0, amount: 10001, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Royal Young Boys Donation" },
      { id: "don_7", receiptNo: "VC-DON-007", donationType: "Money", donorName: "Sandeep", promisedAmount: 5116, paidAmount: 5116, dueAmount: 0, amount: 5116, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Royal Young Boys Donation" },
      { id: "don_8", receiptNo: "VC-DON-008", donationType: "Money", donorName: "Shakeel", promisedAmount: 1516, paidAmount: 1516, dueAmount: 0, amount: 1516, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Royal Young Boys Donation" },
      { id: "don_9", receiptNo: "VC-DON-009", donationType: "Money", donorName: "Sudhakar", promisedAmount: 1001, paidAmount: 1001, dueAmount: 0, amount: 1001, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Royal Young Boys Donation" },
      { id: "don_10", receiptNo: "VC-DON-010", donationType: "Money", donorName: "Outers Collection Day 1 (07/09/26)", promisedAmount: 9381, paidAmount: 9381, dueAmount: 0, amount: 9381, paymentMode: "Cash", phone: "", date: "2026-09-07", notes: "Outers collection Day 1" },
      { id: "don_11", receiptNo: "VC-DON-011", donationType: "Money", donorName: "Dinesh", promisedAmount: 11111, paidAmount: 0, dueAmount: 11111, amount: 0, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Pending Due Donation" },
      { id: "don_12", receiptNo: "VC-DON-012", donationType: "Money", donorName: "Daivik", promisedAmount: 1116, paidAmount: 0, dueAmount: 1116, amount: 0, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Pending Due Donation" },
      { id: "don_13", receiptNo: "VC-DON-013", donationType: "Money", donorName: "Raju", promisedAmount: 2222, paidAmount: 0, dueAmount: 2222, amount: 0, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Pending Due Donation" },
      { id: "don_14", receiptNo: "VC-DON-014", donationType: "Money", donorName: "Santosh yas", promisedAmount: 2116, paidAmount: 0, dueAmount: 2116, amount: 0, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Pending Due Donation" },
      { id: "don_15", receiptNo: "VC-DON-015", donationType: "Money", donorName: "Sai Patnala", promisedAmount: 5116, paidAmount: 0, dueAmount: 5116, amount: 0, paymentMode: "Cash", phone: "", date: "2026-09-09", notes: "Pending Due Donation" }
    ],
    expenses: [
      { id: "exp_1", title: "Ganesh IDOL", category: "Idol/Pratima", totalAmount: 45000, advancePaid: 45000, dueAmount: 0, amount: 45000, date: "2026-09-09", paidTo: "", spentBy: "", notes: "6ft Ganesh Idol" },
      { id: "exp_2", title: "Labour for site clearance", category: "Tent/Pandal & Stage", totalAmount: 1800, advancePaid: 1800, dueAmount: 0, amount: 1800, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Site clearance labour" },
      { id: "exp_3", title: "Panthulu garu", category: "Puja Materials", totalAmount: 1001, advancePaid: 1001, dueAmount: 0, amount: 1001, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Priest dakshina / honorarium" },
      { id: "exp_4", title: "Raata karra", category: "Tent/Pandal & Stage", totalAmount: 200, advancePaid: 200, dueAmount: 0, amount: 200, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Pandal support post" },
      { id: "exp_5", title: "Pooja items", category: "Puja Materials", totalAmount: 860, advancePaid: 860, dueAmount: 0, amount: 860, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Puja samagri" },
      { id: "exp_6", title: "Labour for site Holes", category: "Tent/Pandal & Stage", totalAmount: 1900, advancePaid: 1900, dueAmount: 0, amount: 1900, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Post hole digging labour" },
      { id: "exp_7", title: "Labour for Posts", category: "Tent/Pandal & Stage", totalAmount: 1900, advancePaid: 1900, dueAmount: 0, amount: 1900, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Post fixing labour" },
      { id: "exp_8", title: "Fuel for Rajesh/shashi to s kota for bamboos", category: "Transportation", totalAmount: 400, advancePaid: 400, dueAmount: 0, amount: 400, date: "2026-09-09", paidTo: "", spentBy: "Rajesh/Shashi", notes: "Fuel for bamboo trip" },
      { id: "exp_9", title: "Commitee Banner", category: "Decoration & Flowers", totalAmount: 2300, advancePaid: 2300, dueAmount: 0, amount: 2300, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Royal Young Boys banner printing" },
      { id: "exp_10", title: "Colour Chandha books", category: "Miscellaneous", totalAmount: 1400, advancePaid: 1400, dueAmount: 0, amount: 1400, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Donation subscription receipt books" },
      { id: "exp_11", title: "1 load Mud", category: "Tent/Pandal & Stage", totalAmount: 1000, advancePaid: 1000, dueAmount: 0, amount: 1000, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Site levelling mud load" },
      { id: "exp_12", title: "Kasara bhoggu", category: "Puja Materials", totalAmount: 1000, advancePaid: 1000, dueAmount: 0, amount: 1000, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Charcoal for homam" },
      { id: "exp_13", title: "Karralu", category: "Tent/Pandal & Stage", totalAmount: 6000, advancePaid: 6000, dueAmount: 0, amount: 6000, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Wooden beams & poles" },
      { id: "exp_14", title: "Transport", category: "Transportation", totalAmount: 350, advancePaid: 350, dueAmount: 0, amount: 350, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Material transport charges" },
      { id: "exp_15", title: "Plywood Sheets", category: "Tent/Pandal & Stage", totalAmount: 1000, advancePaid: 1000, dueAmount: 0, amount: 1000, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Stage flooring sheets" },
      { id: "exp_16", title: "Auto charges", category: "Transportation", totalAmount: 1000, advancePaid: 1000, dueAmount: 0, amount: 1000, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Auto transport for items" },
      { id: "exp_17", title: "Hardware tools", category: "Miscellaneous", totalAmount: 1390, advancePaid: 1390, dueAmount: 0, amount: 1390, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Nails, ropes, and tools" },
      { id: "exp_18", title: "Xtra tools", category: "Miscellaneous", totalAmount: 210, advancePaid: 210, dueAmount: 0, amount: 210, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Extra hardware tools" },
      { id: "exp_19", title: "bike fuel", category: "Transportation", totalAmount: 350, advancePaid: 350, dueAmount: 0, amount: 350, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Volunteering bike fuel" },
      { id: "exp_20", title: "Bamboos (150 no s)", category: "Tent/Pandal & Stage", totalAmount: 9900, advancePaid: 9900, dueAmount: 0, amount: 9900, date: "2026-09-09", paidTo: "", spentBy: "", notes: "150 Nos Bamboos for pandari" },
      { id: "exp_21", title: "Bamboos transport charges (from Skota to pandiri)", category: "Transportation", totalAmount: 5000, advancePaid: 5000, dueAmount: 0, amount: 5000, date: "2026-09-09", paidTo: "", spentBy: "", notes: "S.Kota to Pandiri truck transport" },
      { id: "exp_22", title: "Fuel", category: "Transportation", totalAmount: 200, advancePaid: 200, dueAmount: 0, amount: 200, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Local transport fuel" },
      { id: "exp_23", title: "Cycle Tubes and hardware", category: "Miscellaneous", totalAmount: 910, advancePaid: 910, dueAmount: 0, amount: 910, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Rubber ties & hardware" },
      { id: "exp_24", title: "Tarpaans", category: "Tent/Pandal & Stage", totalAmount: 6300, advancePaid: 6300, dueAmount: 0, amount: 6300, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Waterproof tarpaulins" },
      { id: "exp_25", title: "Transport", category: "Transportation", totalAmount: 100, advancePaid: 100, dueAmount: 0, amount: 100, date: "2026-09-09", paidTo: "", spentBy: "", notes: "Misc transport" }
    ],
    events: defaultDbData.events || [],
    members: defaultDbData.members || [],
    families: defaultDbData.families || [
      { id: "fam_1", familyHead: "Kothapalli Ramesh", gothram: "Kasyapa", familyMembers: "Lakshmi (Wife), Rahul (Son)", phone: "9876543210", address: "", poojaRequested: "Laxmiganapathi Homam", date: "2026-09-09" }
    ],
    settings: defaultDbData.settings || {
      eventName: "Royal Young Boys Association - Ganesh Agamanam 2026",
      year: 2026,
      receiptPrefix: "VC-DON-",
      receiptCounter: 16
    }
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalStore(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function computeSummary(db) {
  let totalPromisedDonations = 0;
  let totalPaidDonations = 0;
  let totalDueDonations = 0;
  let itemDonationCount = 0;

  (db.donations || []).forEach(d => {
    if (d.donationType === 'Item') {
      itemDonationCount += 1;
    } else {
      const promised = Number(d.promisedAmount !== undefined ? d.promisedAmount : d.amount) || 0;
      const paid = Number(d.paidAmount !== undefined ? d.paidAmount : d.amount) || 0;
      const due = Math.max(0, promised - paid);

      totalPromisedDonations += promised;
      totalPaidDonations += paid;
      totalDueDonations += due;
    }
  });

  let totalExpensesAgreed = 0;
  let totalExpensesAdvance = 0;
  let totalExpensesDue = 0;

  (db.expenses || []).forEach(e => {
    const total = Number(e.totalAmount !== undefined ? e.totalAmount : e.amount) || 0;
    const advance = Number(e.advancePaid !== undefined ? e.advancePaid : e.amount) || 0;
    const due = Math.max(0, total - advance);

    totalExpensesAgreed += total;
    totalExpensesAdvance += advance;
    totalExpensesDue += due;
  });

  const remainingBalance = totalPaidDonations - totalExpensesAdvance;

  const categoryMap = {};
  (db.expenses || []).forEach(exp => {
    const cat = exp.category || 'Miscellaneous';
    const val = Number(exp.totalAmount !== undefined ? exp.totalAmount : exp.amount) || 0;
    categoryMap[cat] = (categoryMap[cat] || 0) + val;
  });

  const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  const members = db.members || [];
  const inMandapam = members.filter(m => m.status === 'IN_MANDAPAM').length;
  const outForWork = members.filter(m => m.status === 'OUT_FOR_WORK').length;
  const notInMandapam = members.filter(m => m.status === 'NOT_IN_MANDAPAM').length;

  const families = db.families || [];
  const gothramSet = new Set(families.map(f => f.gothram?.trim().toLowerCase()).filter(Boolean));

  return {
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
    memberCounts: {
      total: members.length,
      inMandapam,
      outForWork,
      notInMandapam
    },
    categoryBreakdown,
    settings: db.settings
  };
}

export default {
  getLocalStore,
  saveLocalStore,
  computeSummary
};
