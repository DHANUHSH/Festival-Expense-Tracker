// Unified Storage & API service for both local Express server and GitHub Pages static hosting

import defaultDbData from '../../server/data/db.json';
import cloudSync from './cloudSync.js';

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
      {
            "id": "don_1",
            "receiptNo": "VC-DON-001",
            "donationType": "Money",
            "donorName": "2025 Balance Carryover",
            "promisedAmount": 23000,
            "paidAmount": 23000,
            "dueAmount": 0,
            "amount": 23000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Previous year 2025 balance carryover"
      },
      {
            "id": "don_2",
            "receiptNo": "VC-DON-002",
            "donationType": "Money",
            "donorName": "Ajay",
            "promisedAmount": 45000,
            "paidAmount": 45000,
            "dueAmount": 0,
            "amount": 45000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_3",
            "receiptNo": "VC-DON-003",
            "donationType": "Money",
            "donorName": "Prabhakar",
            "promisedAmount": 11111,
            "paidAmount": 11111,
            "dueAmount": 0,
            "amount": 11111,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_4",
            "receiptNo": "VC-DON-004",
            "donationType": "Money",
            "donorName": "Dinesh Reddy",
            "promisedAmount": 9999,
            "paidAmount": 9999,
            "dueAmount": 0,
            "amount": 9999,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_5",
            "receiptNo": "VC-DON-005",
            "donationType": "Money",
            "donorName": "Prasad",
            "promisedAmount": 5001,
            "paidAmount": 5001,
            "dueAmount": 0,
            "amount": 5001,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_6",
            "receiptNo": "VC-DON-006",
            "donationType": "Money",
            "donorName": "Chaitu",
            "promisedAmount": 1116,
            "paidAmount": 1116,
            "dueAmount": 0,
            "amount": 1116,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_7",
            "receiptNo": "VC-DON-007",
            "donationType": "Money",
            "donorName": "Mahesh",
            "promisedAmount": 2516,
            "paidAmount": 2516,
            "dueAmount": 0,
            "amount": 2516,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_8",
            "receiptNo": "VC-DON-008",
            "donationType": "Money",
            "donorName": "Chintu",
            "promisedAmount": 10001,
            "paidAmount": 10001,
            "dueAmount": 0,
            "amount": 10001,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_9",
            "receiptNo": "VC-DON-009",
            "donationType": "Money",
            "donorName": "Sandeep",
            "promisedAmount": 5116,
            "paidAmount": 5116,
            "dueAmount": 0,
            "amount": 5116,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_10",
            "receiptNo": "VC-DON-010",
            "donationType": "Money",
            "donorName": "Shakeel",
            "promisedAmount": 1516,
            "paidAmount": 1516,
            "dueAmount": 0,
            "amount": 1516,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_11",
            "receiptNo": "VC-DON-011",
            "donationType": "Money",
            "donorName": "Sudhakar",
            "promisedAmount": 1001,
            "paidAmount": 1001,
            "dueAmount": 0,
            "amount": 1001,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_12",
            "receiptNo": "VC-DON-012",
            "donationType": "Money",
            "donorName": "Raju",
            "promisedAmount": 2222,
            "paidAmount": 2222,
            "dueAmount": 0,
            "amount": 2222,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_13",
            "receiptNo": "VC-DON-013",
            "donationType": "Money",
            "donorName": "Tirupati",
            "promisedAmount": 1000,
            "paidAmount": 1000,
            "dueAmount": 0,
            "amount": 1000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Royal Young Boys Donation"
      },
      {
            "id": "don_14",
            "receiptNo": "VC-DON-014",
            "donationType": "Money",
            "donorName": "Outers Collection Day 1",
            "promisedAmount": 9381,
            "paidAmount": 9381,
            "dueAmount": 0,
            "amount": 9381,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-07",
            "notes": "Outers collection Day 1 (07/09/26)"
      },
      {
            "id": "don_15",
            "receiptNo": "VC-DON-015",
            "donationType": "Money",
            "donorName": "Outers Collection Day 2",
            "promisedAmount": 30683,
            "paidAmount": 30683,
            "dueAmount": 0,
            "amount": 30683,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-08",
            "notes": "Outers collection Day 2 (11001 + 19682)"
      },
      {
            "id": "don_16",
            "receiptNo": "VC-DON-016",
            "donationType": "Money",
            "donorName": "Outers Collection Day 3",
            "promisedAmount": 11135,
            "paidAmount": 11135,
            "dueAmount": 0,
            "amount": 11135,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-09",
            "notes": "Outers collection Day 3"
      },
      {
            "id": "don_17",
            "receiptNo": "VC-DON-017",
            "donationType": "Money",
            "donorName": "Outers Collection Day 4",
            "promisedAmount": 5100,
            "paidAmount": 5100,
            "dueAmount": 0,
            "amount": 5100,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-10",
            "notes": "Outers collection Day 4"
      },
      {
            "id": "don_18",
            "receiptNo": "VC-DON-018",
            "donationType": "Money",
            "donorName": "Outers Collection Day 5",
            "promisedAmount": 6649,
            "paidAmount": 6649,
            "dueAmount": 0,
            "amount": 6649,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-11",
            "notes": "Outers collection Day 5"
      },
      {
            "id": "don_19",
            "receiptNo": "VC-DON-019",
            "donationType": "Money",
            "donorName": "Outers Collection Day 6",
            "promisedAmount": 3000,
            "paidAmount": 3000,
            "dueAmount": 0,
            "amount": 3000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-12",
            "notes": "Outers collection Day 6"
      },
      {
            "id": "don_20",
            "receiptNo": "VC-DON-020",
            "donationType": "Money",
            "donorName": "Outers Collection Adjustment",
            "promisedAmount": 121,
            "paidAmount": 121,
            "dueAmount": 0,
            "amount": 121,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-12",
            "notes": "Outers collection misc roundoff adjustment"
      },
      {
            "id": "don_21",
            "receiptNo": "VC-DON-021",
            "donationType": "Money",
            "donorName": "DURGA D.",
            "promisedAmount": 10000,
            "paidAmount": 10000,
            "dueAmount": 0,
            "amount": 10000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_22",
            "receiptNo": "VC-DON-022",
            "donationType": "Money",
            "donorName": "Raja D.",
            "promisedAmount": 5116,
            "paidAmount": 5116,
            "dueAmount": 0,
            "amount": 5116,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_23",
            "receiptNo": "VC-DON-023",
            "donationType": "Money",
            "donorName": "PURUSHOTTAM",
            "promisedAmount": 5120,
            "paidAmount": 5120,
            "dueAmount": 0,
            "amount": 5120,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_24",
            "receiptNo": "VC-DON-024",
            "donationType": "Money",
            "donorName": "BUJJI",
            "promisedAmount": 5000,
            "paidAmount": 5000,
            "dueAmount": 0,
            "amount": 5000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_25",
            "receiptNo": "VC-DON-025",
            "donationType": "Money",
            "donorName": "RAVI",
            "promisedAmount": 5000,
            "paidAmount": 5000,
            "dueAmount": 0,
            "amount": 5000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_26",
            "receiptNo": "VC-DON-026",
            "donationType": "Money",
            "donorName": "MANOHAR",
            "promisedAmount": 5000,
            "paidAmount": 5000,
            "dueAmount": 0,
            "amount": 5000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_27",
            "receiptNo": "VC-DON-027",
            "donationType": "Money",
            "donorName": "SURENDAR REDDY",
            "promisedAmount": 5000,
            "paidAmount": 5000,
            "dueAmount": 0,
            "amount": 5000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_28",
            "receiptNo": "VC-DON-028",
            "donationType": "Money",
            "donorName": "B NARAYANA",
            "promisedAmount": 5000,
            "paidAmount": 5000,
            "dueAmount": 0,
            "amount": 5000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_29",
            "receiptNo": "VC-DON-029",
            "donationType": "Money",
            "donorName": "G SRINIVAS",
            "promisedAmount": 5000,
            "paidAmount": 5000,
            "dueAmount": 0,
            "amount": 5000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_30",
            "receiptNo": "VC-DON-030",
            "donationType": "Money",
            "donorName": "SPANDANA",
            "promisedAmount": 3000,
            "paidAmount": 3000,
            "dueAmount": 0,
            "amount": 3000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_31",
            "receiptNo": "VC-DON-031",
            "donationType": "Money",
            "donorName": "SARIKA",
            "promisedAmount": 3116,
            "paidAmount": 3116,
            "dueAmount": 0,
            "amount": 3116,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_32",
            "receiptNo": "VC-DON-032",
            "donationType": "Money",
            "donorName": "VINOD",
            "promisedAmount": 2116,
            "paidAmount": 2116,
            "dueAmount": 0,
            "amount": 2116,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_33",
            "receiptNo": "VC-DON-033",
            "donationType": "Money",
            "donorName": "BORA PRAKASH",
            "promisedAmount": 3500,
            "paidAmount": 3500,
            "dueAmount": 0,
            "amount": 3500,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_34",
            "receiptNo": "VC-DON-034",
            "donationType": "Money",
            "donorName": "P SHYAM",
            "promisedAmount": 2116,
            "paidAmount": 2116,
            "dueAmount": 0,
            "amount": 2116,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_35",
            "receiptNo": "VC-DON-035",
            "donationType": "Money",
            "donorName": "G PRASAD",
            "promisedAmount": 2000,
            "paidAmount": 2000,
            "dueAmount": 0,
            "amount": 2000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_36",
            "receiptNo": "VC-DON-036",
            "donationType": "Money",
            "donorName": "TEJESH",
            "promisedAmount": 2000,
            "paidAmount": 2000,
            "dueAmount": 0,
            "amount": 2000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_37",
            "receiptNo": "VC-DON-037",
            "donationType": "Money",
            "donorName": "Y SRINU",
            "promisedAmount": 2016,
            "paidAmount": 2016,
            "dueAmount": 0,
            "amount": 2016,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_38",
            "receiptNo": "VC-DON-038",
            "donationType": "Money",
            "donorName": "MAJJI SRINU",
            "promisedAmount": 2500,
            "paidAmount": 2500,
            "dueAmount": 0,
            "amount": 2500,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_39",
            "receiptNo": "VC-DON-039",
            "donationType": "Money",
            "donorName": "VENKATESH",
            "promisedAmount": 2000,
            "paidAmount": 2000,
            "dueAmount": 0,
            "amount": 2000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_40",
            "receiptNo": "VC-DON-040",
            "donationType": "Money",
            "donorName": "KISHORE",
            "promisedAmount": 1116,
            "paidAmount": 1116,
            "dueAmount": 0,
            "amount": 1116,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_41",
            "receiptNo": "VC-DON-041",
            "donationType": "Money",
            "donorName": "KIRAN",
            "promisedAmount": 1116,
            "paidAmount": 1116,
            "dueAmount": 0,
            "amount": 1116,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_42",
            "receiptNo": "VC-DON-042",
            "donationType": "Money",
            "donorName": "KUMARI",
            "promisedAmount": 1000,
            "paidAmount": 1000,
            "dueAmount": 0,
            "amount": 1000,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-15",
            "notes": "REDDYs Collection"
      },
      {
            "id": "don_43",
            "receiptNo": "VC-DON-043",
            "donationType": "Money",
            "donorName": "Pavan jaddu",
            "promisedAmount": 1116,
            "paidAmount": 0,
            "dueAmount": 1116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_44",
            "receiptNo": "VC-DON-044",
            "donationType": "Money",
            "donorName": "Ravi yerra",
            "promisedAmount": 1116,
            "paidAmount": 0,
            "dueAmount": 1116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_45",
            "receiptNo": "VC-DON-045",
            "donationType": "Money",
            "donorName": "Sai Patnala",
            "promisedAmount": 5116,
            "paidAmount": 0,
            "dueAmount": 5116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_46",
            "receiptNo": "VC-DON-046",
            "donationType": "Money",
            "donorName": "Praveen",
            "promisedAmount": 2116,
            "paidAmount": 0,
            "dueAmount": 2116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_47",
            "receiptNo": "VC-DON-047",
            "donationType": "Money",
            "donorName": "Santosh S",
            "promisedAmount": 2116,
            "paidAmount": 0,
            "dueAmount": 2116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_48",
            "receiptNo": "VC-DON-048",
            "donationType": "Money",
            "donorName": "Kishore Reddy",
            "promisedAmount": 2116,
            "paidAmount": 0,
            "dueAmount": 2116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_49",
            "receiptNo": "VC-DON-049",
            "donationType": "Money",
            "donorName": "Jagadish",
            "promisedAmount": 1116,
            "paidAmount": 0,
            "dueAmount": 1116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_50",
            "receiptNo": "VC-DON-050",
            "donationType": "Money",
            "donorName": "Shashi",
            "promisedAmount": 1116,
            "paidAmount": 0,
            "dueAmount": 1116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_51",
            "receiptNo": "VC-DON-051",
            "donationType": "Money",
            "donorName": "Satti babu",
            "promisedAmount": 0,
            "paidAmount": 0,
            "dueAmount": 0,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due (Amount TBD)"
      },
      {
            "id": "don_52",
            "receiptNo": "VC-DON-052",
            "donationType": "Money",
            "donorName": "Jaswanth",
            "promisedAmount": 1516,
            "paidAmount": 0,
            "dueAmount": 1516,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due"
      },
      {
            "id": "don_53",
            "receiptNo": "VC-DON-053",
            "donationType": "Money",
            "donorName": "Venky",
            "promisedAmount": 0,
            "paidAmount": 0,
            "dueAmount": 0,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Committee Pending Due (Amount TBD)"
      },
      {
            "id": "don_54",
            "receiptNo": "VC-DON-054",
            "donationType": "Money",
            "donorName": "Daivik",
            "promisedAmount": 1116,
            "paidAmount": 0,
            "dueAmount": 1116,
            "amount": 0,
            "paymentMode": "Cash",
            "phone": "",
            "date": "2026-09-20",
            "notes": "Pending Due Donation"
      }
],
    expenses: [
      {
            "id": "exp_1",
            "title": "Ganesh IDOL",
            "category": "Idol/Pratima",
            "totalAmount": 45000,
            "advancePaid": 45000,
            "dueAmount": 0,
            "amount": 45000,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "6ft Ganesh Idol"
      },
      {
            "id": "exp_2",
            "title": "Labour for site clearance",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 1800,
            "advancePaid": 1800,
            "dueAmount": 0,
            "amount": 1800,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Site clearance labour"
      },
      {
            "id": "exp_3",
            "title": "Panthulu garu",
            "category": "Puja Materials",
            "totalAmount": 1001,
            "advancePaid": 1001,
            "dueAmount": 0,
            "amount": 1001,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Priest dakshina / honorarium"
      },
      {
            "id": "exp_4",
            "title": "Raata karra",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 200,
            "advancePaid": 200,
            "dueAmount": 0,
            "amount": 200,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Pandal support post"
      },
      {
            "id": "exp_5",
            "title": "Pooja items",
            "category": "Puja Materials",
            "totalAmount": 860,
            "advancePaid": 860,
            "dueAmount": 0,
            "amount": 860,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Puja samagri"
      },
      {
            "id": "exp_6",
            "title": "Labour for site Holes",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 1900,
            "advancePaid": 1900,
            "dueAmount": 0,
            "amount": 1900,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Post hole digging labour"
      },
      {
            "id": "exp_7",
            "title": "Labour for Posts",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 1900,
            "advancePaid": 1900,
            "dueAmount": 0,
            "amount": 1900,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Post fixing labour"
      },
      {
            "id": "exp_8",
            "title": "Fuel for Rajesh/shashi to s kota for bamboos",
            "category": "Transportation",
            "totalAmount": 400,
            "advancePaid": 400,
            "dueAmount": 0,
            "amount": 400,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "Rajesh/Shashi",
            "notes": "Fuel for bamboo trip"
      },
      {
            "id": "exp_9",
            "title": "Commitee Banner",
            "category": "Decoration & Flowers",
            "totalAmount": 2300,
            "advancePaid": 2300,
            "dueAmount": 0,
            "amount": 2300,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Royal Young Boys banner printing"
      },
      {
            "id": "exp_10",
            "title": "Colour Chandha books",
            "category": "Miscellaneous",
            "totalAmount": 1400,
            "advancePaid": 1400,
            "dueAmount": 0,
            "amount": 1400,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Donation subscription receipt books"
      },
      {
            "id": "exp_11",
            "title": "1 load Mud",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 1000,
            "advancePaid": 1000,
            "dueAmount": 0,
            "amount": 1000,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Site levelling mud load"
      },
      {
            "id": "exp_12",
            "title": "Kasara bhoggu",
            "category": "Puja Materials",
            "totalAmount": 1000,
            "advancePaid": 1000,
            "dueAmount": 0,
            "amount": 1000,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Charcoal for homam"
      },
      {
            "id": "exp_13",
            "title": "Karralu",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 6000,
            "advancePaid": 6000,
            "dueAmount": 0,
            "amount": 6000,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Wooden beams & poles"
      },
      {
            "id": "exp_14",
            "title": "Transport",
            "category": "Transportation",
            "totalAmount": 350,
            "advancePaid": 350,
            "dueAmount": 0,
            "amount": 350,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Material transport charges"
      },
      {
            "id": "exp_15",
            "title": "Plywood Sheets",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 1000,
            "advancePaid": 1000,
            "dueAmount": 0,
            "amount": 1000,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Stage flooring sheets"
      },
      {
            "id": "exp_16",
            "title": "Auto charges",
            "category": "Transportation",
            "totalAmount": 1000,
            "advancePaid": 1000,
            "dueAmount": 0,
            "amount": 1000,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Auto transport for items"
      },
      {
            "id": "exp_17",
            "title": "Hardware tools",
            "category": "Miscellaneous",
            "totalAmount": 1390,
            "advancePaid": 1390,
            "dueAmount": 0,
            "amount": 1390,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Nails, ropes, and tools"
      },
      {
            "id": "exp_18",
            "title": "Xtra tools",
            "category": "Miscellaneous",
            "totalAmount": 210,
            "advancePaid": 210,
            "dueAmount": 0,
            "amount": 210,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Extra hardware tools"
      },
      {
            "id": "exp_19",
            "title": "bike fuel",
            "category": "Transportation",
            "totalAmount": 350,
            "advancePaid": 350,
            "dueAmount": 0,
            "amount": 350,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Volunteering bike fuel"
      },
      {
            "id": "exp_20",
            "title": "Bamboos (150 no s)",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 9900,
            "advancePaid": 9900,
            "dueAmount": 0,
            "amount": 9900,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "150 Nos Bamboos for pandari"
      },
      {
            "id": "exp_21",
            "title": "Bamboos transport charges (from Skota to pandiri)",
            "category": "Transportation",
            "totalAmount": 5000,
            "advancePaid": 5000,
            "dueAmount": 0,
            "amount": 5000,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "S.Kota to Pandiri truck transport"
      },
      {
            "id": "exp_22",
            "title": "Fuel",
            "category": "Transportation",
            "totalAmount": 200,
            "advancePaid": 200,
            "dueAmount": 0,
            "amount": 200,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Local transport fuel"
      },
      {
            "id": "exp_23",
            "title": "Cycle Tubes and hardware",
            "category": "Miscellaneous",
            "totalAmount": 910,
            "advancePaid": 910,
            "dueAmount": 0,
            "amount": 910,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Rubber ties & hardware"
      },
      {
            "id": "exp_24",
            "title": "Tarpaans",
            "category": "Tent/Pandal & Stage",
            "totalAmount": 6300,
            "advancePaid": 6300,
            "dueAmount": 0,
            "amount": 6300,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Waterproof tarpaulins"
      },
      {
            "id": "exp_25",
            "title": "Transport",
            "category": "Transportation",
            "totalAmount": 100,
            "advancePaid": 100,
            "dueAmount": 0,
            "amount": 100,
            "date": "2026-09-09",
            "paidTo": "",
            "spentBy": "",
            "notes": "Misc transport"
      },
      {
            "id": "exp_26",
            "title": "Additional Festival & Immersion Expenses",
            "category": "Festival Operations",
            "totalAmount": 83535,
            "advancePaid": 83535,
            "dueAmount": 0,
            "amount": 83535,
            "date": "2026-09-20",
            "paidTo": "",
            "spentBy": "",
            "notes": "Sound system, lighting, Anna Dhanam, and immersion procession expenses"
      }
],
    events: defaultDbData.events || [],
    members: defaultDbData.members || [],
    families: defaultDbData.families || [
      { id: "fam_1", familyHead: "Kothapalli Ramesh", gothram: "Kasyapa", familyMembers: "Lakshmi (Wife), Rahul (Son)", phone: "9876543210", address: "", poojaRequested: "Laxmiganapathi Homam", date: "2026-09-09" }
    ],
    ladduBids: [
      { id: "bid_1", bidderName: "Sri Chintu Garu", amount: 15000, gothram: "Shiva Gothram", phone: "9876543210", paymentStatus: "Pending", timestamp: "2026-09-09" },
      { id: "bid_2", bidderName: "Sri Ajay Garu", amount: 12000, gothram: "Kasyapa Gothram", phone: "9876543211", paymentStatus: "Paid", timestamp: "2026-09-09" }
    ],
    prasadamSponsors: [
      { id: "sp_1", sponsorName: "Prasad & Family", item: "Anna Dhanam (Lunch)", date: "2026-09-14", phone: "9876543210" },
      { id: "sp_2", sponsorName: "Chaitu & Family", item: "Evening Prasadam", date: "2026-09-15", phone: "9876543212" }
    ],
    prasadamChecklist: [
      { id: "pc_1", name: "25kg Sona Masoori Rice (10 Bags)", completed: true },
      { id: "pc_2", name: "Toor Dal (50 kg)", completed: true },
      { id: "pc_3", name: "Pure Cow Ghee (15 Litres)", completed: false },
      { id: "pc_4", name: "Cooking Oil (5 Tins)", completed: false },
      { id: "pc_5", name: "Banana Leaf Plates (2000 Nos)", completed: false }
    ],
    samagriChecklist: [
      { id: "sc_1", name: "Flowers (Garlands & Loose Lotus)", completed: true },
      { id: "sc_2", name: "Coconuts (108 Nos)", completed: true },
      { id: "sc_3", name: "Camphor, Incense & Oil Wicks", completed: true },
      { id: "sc_4", name: "Betel Leaves & Areca Nuts", completed: false },
      { id: "sc_5", name: "Sandalwood Paste & Turmeric Kumkum", completed: true }
    ],
    settings: defaultDbData.settings || {
      eventName: "Royal Young Boys Association - Ganesh Agamanam 2026",
      year: 2026,
      receiptPrefix: "VC-DON-",
      receiptCounter: 55
    }
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalStore(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  try {
    cloudSync.broadcastMutation(db);
  } catch (e) {}
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
