import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Generate 33 members array
const initialMembers = Array.from({ length: 33 }, (_, i) => ({
  id: `mem_${i + 1}`,
  memberNo: i + 1,
  name: `Member #${i + 1}`,
  role: 'Committee Member',
  photo: `/members/member_${i + 1}.jpg`,
  status: 'NOT_IN_MANDAPAM',
  lastUpdated: new Date().toISOString()
}));

// Official 13-day event schedule from Royal Young Boys Association poster
const initialEvents = [
  { id: 'evt_1', eventName: 'Ganesha Chavithi Puja & Idol Sthapana', date: '2026-09-14', time: '08:30 AM', moneySpent: 0, description: 'Installation & Grand Opening Puja (Day 1)' },
  { id: 'evt_2', eventName: 'Morning Special Prayers & Devotional Volunteering', date: '2026-09-15', time: '09:00 AM', moneySpent: 0, description: 'Special Prayers & Mandapam Service (Day 2)' },
  { id: 'evt_3', eventName: 'Evening Community Bhajans & Kirtan', date: '2026-09-16', time: '06:30 PM', moneySpent: 0, description: 'Devotional Bhajans (Day 3)' },
  { id: 'evt_4', eventName: 'Local Blood Bank Drive & Volunteering', date: '2026-09-17', time: '10:00 AM', moneySpent: 0, description: 'Blood Donation Camp (Day 4)' },
  { id: 'evt_5', eventName: 'Auspicious Kumkum Pooja & Muggula Potilu', date: '2026-09-18', time: '05:00 PM', moneySpent: 0, description: 'Special Ladies Ritual & Rangoli Contest (Day 5)' },
  { id: 'evt_6', eventName: 'Cultural Evening & Games to Children', date: '2026-09-19', time: '06:00 PM', moneySpent: 0, description: 'Children Competitions & Cultural Shows (Day 6)' },
  { id: 'evt_7', eventName: 'Community Welfare Distribution & Dance / Baby Dolls Event', date: '2026-09-20', time: '06:00 PM', moneySpent: 0, description: 'Welfare & Dance Programs (Day 7)' },
  { id: 'evt_8', eventName: 'Grand Deepardhana & Utti Sambaram', date: '2026-09-21', time: '07:00 PM', moneySpent: 0, description: 'Maha Deepam Festival of Lamps (Day 8)' },
  { id: 'evt_9', eventName: 'Special Devotional Offerings & Bhajans', date: '2026-09-22', time: '07:00 PM', moneySpent: 0, description: 'Cultural Bhajans (Day 9)' },
  { id: 'evt_10', eventName: 'Laxmiganapathi Homam', date: '2026-09-23', time: '09:00 AM', moneySpent: 0, description: 'Grand Vedic Homam (Day 10)' },
  { id: 'evt_11', eventName: 'Grand ANNADHANAM', date: '2026-09-24', time: '12:30 PM', moneySpent: 0, description: 'Mass Feast & Prasadam Distribution (Day 11)' },
  { id: 'evt_12', eventName: 'Special Devotional Offerings & Bhajans', date: '2026-09-25', time: '07:00 PM', moneySpent: 0, description: 'Evening Bhajans (Day 12)' },
  { id: 'evt_13', eventName: 'Final Arti & Grand Immersion (Nimajjanam)', date: '2026-09-26', time: '04:00 PM', moneySpent: 0, description: 'Grand Procession & Nimajjanam (Day 13)' }
];

const defaultData = {
  donations: [],
  expenses: [],
  events: initialEvents,
  members: initialMembers,
  families: [],
  settings: {
    eventName: 'Royal Young Boys Association - Ganesh Agamanam 2026',
    year: 2026,
    receiptPrefix: 'VC-DON-',
    receiptCounter: 1
  }
};

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
}

export function readDb() {
  ensureDbExists();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.members || parsed.members.length === 0) parsed.members = initialMembers;
    if (!parsed.events || parsed.events.length < 13) parsed.events = initialEvents;
    if (!parsed.families) parsed.families = [];
    if (!parsed.donations) parsed.donations = [];
    if (!parsed.expenses) parsed.expenses = [];
    return parsed;
  } catch (err) {
    console.error('Error reading database file:', err);
    return defaultData;
  }
}

export function writeDb(data) {
  ensureDbExists();
  const tempPath = path.join(DATA_DIR, 'db.json.tmp');
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempPath, DB_FILE);
}
