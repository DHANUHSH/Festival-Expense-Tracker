import express from 'express';
import cors from 'cors';
import { readDb, writeDb } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to generate receipt number
function generateReceiptNo(db) {
  const counter = db.settings.receiptCounter || (db.donations.length + 1);
  const prefix = db.settings.receiptPrefix || 'VC-DON-';
  const formattedNo = `${prefix}${String(counter).padStart(3, '0')}`;
  db.settings.receiptCounter = counter + 1;
  return formattedNo;
}

// ----------------- SUMMARY ENDPOINT -----------------
app.get('/api/summary', (req, res) => {
  const db = readDb();

  let totalPromisedDonations = 0;
  let totalPaidDonations = 0;
  let totalDueDonations = 0;
  let itemDonationCount = 0;

  db.donations.forEach(d => {
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

  // Expense calculations with Advance and Vendor Due
  let totalExpensesAgreed = 0;
  let totalExpensesAdvance = 0;
  let totalExpensesDue = 0;

  db.expenses.forEach(e => {
    const total = Number(e.totalAmount !== undefined ? e.totalAmount : e.amount) || 0;
    const advance = Number(e.advancePaid !== undefined ? e.advancePaid : e.amount) || 0;
    const due = Math.max(0, total - advance);

    totalExpensesAgreed += total;
    totalExpensesAdvance += advance;
    totalExpensesDue += due;
  });

  const remainingBalance = totalPaidDonations - totalExpensesAdvance;

  // Category breakdown for expenses
  const categoryMap = {};
  db.expenses.forEach(exp => {
    const cat = exp.category || 'Miscellaneous';
    const val = Number(exp.totalAmount !== undefined ? exp.totalAmount : exp.amount) || 0;
    categoryMap[cat] = (categoryMap[cat] || 0) + val;
  });

  const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
    name: cat,
    value: categoryMap[cat]
  }));

  // Members status count
  const members = db.members || [];
  const inMandapam = members.filter(m => m.status === 'IN_MANDAPAM').length;
  const outForWork = members.filter(m => m.status === 'OUT_FOR_WORK').length;
  const notInMandapam = members.filter(m => m.status === 'NOT_IN_MANDAPAM').length;

  // Families & Gothram count
  const families = db.families || [];
  const gothramSet = new Set(families.map(f => f.gothram?.trim().toLowerCase()).filter(Boolean));

  res.json({
    totalPromisedDonations,
    totalPaidDonations,
    totalDueDonations,
    totalExpensesAgreed,
    totalExpensesAdvance,
    totalExpensesDue,
    remainingBalance,
    donationCount: db.donations.length,
    itemDonationCount,
    expenseCount: db.expenses.length,
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
  });
});

// ----------------- DONATIONS ENDPOINTS -----------------
app.get('/api/donations', (req, res) => {
  const db = readDb();
  res.json(db.donations);
});

app.post('/api/donations', (req, res) => {
  const { 
    donationType = 'Money', 
    donorName, 
    promisedAmount, 
    paidAmount, 
    amount, 
    itemName, 
    itemQuantity, 
    estimatedValue, 
    paymentMode, 
    phone, 
    date, 
    notes 
  } = req.body;

  if (!donorName) {
    return res.status(400).json({ error: 'Donor Name is required' });
  }

  const db = readDb();
  const receiptNo = generateReceiptNo(db);

  let record = {
    id: `don_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    receiptNo,
    donationType,
    donorName: donorName.trim(),
    phone: phone || '',
    date: date || new Date().toISOString().split('T')[0],
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  if (donationType === 'Item') {
    if (!itemName) {
      return res.status(400).json({ error: 'Item Name is required' });
    }
    record.itemName = itemName.trim();
    record.itemQuantity = itemQuantity || '1';
    record.estimatedValue = Number(estimatedValue) || 0;
    record.paymentMode = 'In-Kind Item';
    record.amount = Number(estimatedValue) || 0;
    record.promisedAmount = 0;
    record.paidAmount = 0;
    record.dueAmount = 0;
  } else {
    const promised = Number(promisedAmount !== undefined ? promisedAmount : amount) || 0;
    const paid = Number(paidAmount !== undefined ? paidAmount : amount) || 0;
    const due = Math.max(0, promised - paid);

    record.promisedAmount = promised;
    record.paidAmount = paid;
    record.dueAmount = due;
    record.amount = paid;
    record.paymentMode = paymentMode || 'Cash';
  }

  db.donations.unshift(record);
  writeDb(db);
  res.status(201).json(record);
});

app.put('/api/donations/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const index = db.donations.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Donation record not found' });
  }

  const existing = db.donations[index];
  const { 
    donationType = existing.donationType || 'Money', 
    donorName, 
    promisedAmount, 
    paidAmount, 
    amount, 
    itemName, 
    itemQuantity, 
    estimatedValue, 
    paymentMode, 
    phone, 
    date, 
    notes 
  } = req.body;

  let updated = {
    ...existing,
    donationType,
    donorName: donorName !== undefined ? donorName.trim() : existing.donorName,
    phone: phone !== undefined ? phone : existing.phone,
    date: date || existing.date,
    notes: notes !== undefined ? notes : existing.notes,
    updatedAt: new Date().toISOString()
  };

  if (donationType === 'Item') {
    updated.itemName = itemName !== undefined ? itemName.trim() : existing.itemName;
    updated.itemQuantity = itemQuantity !== undefined ? itemQuantity : existing.itemQuantity;
    updated.estimatedValue = Number(estimatedValue !== undefined ? estimatedValue : existing.estimatedValue) || 0;
    updated.paymentMode = 'In-Kind Item';
    updated.amount = updated.estimatedValue;
    updated.promisedAmount = 0;
    updated.paidAmount = 0;
    updated.dueAmount = 0;
  } else {
    const promised = Number(promisedAmount !== undefined ? promisedAmount : (amount !== undefined ? amount : existing.promisedAmount)) || 0;
    const paid = Number(paidAmount !== undefined ? paidAmount : (amount !== undefined ? amount : existing.paidAmount)) || 0;
    const due = Math.max(0, promised - paid);

    updated.promisedAmount = promised;
    updated.paidAmount = paid;
    updated.dueAmount = due;
    updated.amount = paid;
    updated.paymentMode = paymentMode || existing.paymentMode || 'Cash';
  }

  db.donations[index] = updated;
  writeDb(db);
  res.json(updated);
});

app.delete('/api/donations/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialLen = db.donations.length;
  db.donations = db.donations.filter(d => d.id !== id);

  if (db.donations.length === initialLen) {
    return res.status(404).json({ error: 'Donation record not found' });
  }

  writeDb(db);
  res.json({ message: 'Donation deleted successfully' });
});

// ----------------- EXPENSES ENDPOINTS -----------------
app.get('/api/expenses', (req, res) => {
  const db = readDb();
  res.json(db.expenses);
});

app.post('/api/expenses', (req, res) => {
  const { title, category, totalAmount, advancePaid, amount, date, paidTo, spentBy, notes } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Expense Title is required' });
  }

  const total = Number(totalAmount !== undefined ? totalAmount : amount) || 0;
  const advance = Number(advancePaid !== undefined ? advancePaid : amount) || 0;
  const due = Math.max(0, total - advance);

  const db = readDb();
  const newExpense = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim(),
    category: category || 'Miscellaneous',
    totalAmount: total,
    advancePaid: advance,
    dueAmount: due,
    amount: advance,
    date: date || new Date().toISOString().split('T')[0],
    paidTo: paidTo || '',
    spentBy: spentBy || '',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  db.expenses.unshift(newExpense);
  writeDb(db);
  res.status(201).json(newExpense);
});

app.put('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, totalAmount, advancePaid, amount, date, paidTo, spentBy, notes } = req.body;

  const db = readDb();
  const index = db.expenses.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Expense record not found' });
  }

  const existing = db.expenses[index];
  const total = Number(totalAmount !== undefined ? totalAmount : (amount !== undefined ? amount : existing.totalAmount)) || 0;
  const advance = Number(advancePaid !== undefined ? advancePaid : (amount !== undefined ? amount : existing.advancePaid)) || 0;
  const due = Math.max(0, total - advance);

  db.expenses[index] = {
    ...existing,
    title: title !== undefined ? title.trim() : existing.title,
    category: category || existing.category,
    totalAmount: total,
    advancePaid: advance,
    dueAmount: due,
    amount: advance,
    date: date || existing.date,
    paidTo: paidTo !== undefined ? paidTo : existing.paidTo,
    spentBy: spentBy !== undefined ? spentBy : existing.spentBy,
    notes: notes !== undefined ? notes : existing.notes,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  res.json(db.expenses[index]);
});

app.delete('/api/expenses/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialLen = db.expenses.length;
  db.expenses = db.expenses.filter(e => e.id !== id);

  if (db.expenses.length === initialLen) {
    return res.status(404).json({ error: 'Expense record not found' });
  }

  writeDb(db);
  res.json({ message: 'Expense deleted successfully' });
});

// ----------------- FAMILIES & GOTHRAM ENDPOINTS -----------------
app.get('/api/families', (req, res) => {
  const db = readDb();
  res.json(db.families || []);
});

app.post('/api/families', (req, res) => {
  const { familyHead, gothram, familyMembers, phone, address, poojaRequested, date } = req.body;
  if (!familyHead || !gothram) {
    return res.status(400).json({ error: 'Family Head Name and Gothram are required' });
  }

  const db = readDb();
  const newFamily = {
    id: `fam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    familyHead: familyHead.trim(),
    gothram: gothram.trim(),
    familyMembers: familyMembers || '',
    phone: phone || '',
    address: address || '',
    poojaRequested: poojaRequested || 'Special Archana & Sankalpam',
    date: date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  db.families = db.families || [];
  db.families.unshift(newFamily);
  writeDb(db);
  res.status(201).json(newFamily);
});

app.put('/api/families/:id', (req, res) => {
  const { id } = req.params;
  const { familyHead, gothram, familyMembers, phone, address, poojaRequested, date } = req.body;

  const db = readDb();
  db.families = db.families || [];
  const index = db.families.findIndex(f => f.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Family record not found' });
  }

  db.families[index] = {
    ...db.families[index],
    familyHead: familyHead !== undefined ? familyHead.trim() : db.families[index].familyHead,
    gothram: gothram !== undefined ? gothram.trim() : db.families[index].gothram,
    familyMembers: familyMembers !== undefined ? familyMembers : db.families[index].familyMembers,
    phone: phone !== undefined ? phone : db.families[index].phone,
    address: address !== undefined ? address : db.families[index].address,
    poojaRequested: poojaRequested !== undefined ? poojaRequested : db.families[index].poojaRequested,
    date: date || db.families[index].date,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  res.json(db.families[index]);
});

app.delete('/api/families/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.families = db.families || [];
  const initialLen = db.families.length;
  db.families = db.families.filter(f => f.id !== id);

  if (db.families.length === initialLen) {
    return res.status(404).json({ error: 'Family record not found' });
  }

  writeDb(db);
  res.json({ message: 'Family record deleted successfully' });
});

// ----------------- MEMBERS ENDPOINTS -----------------
app.get('/api/members', (req, res) => {
  const db = readDb();
  res.json(db.members || []);
});

app.put('/api/members/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['IN_MANDAPAM', 'NOT_IN_MANDAPAM', 'OUT_FOR_WORK'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = readDb();
  const member = (db.members || []).find(m => m.id === id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  member.status = status;
  member.lastUpdated = new Date().toISOString();

  writeDb(db);
  res.json(member);
});

app.put('/api/members/:id/name', (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  const db = readDb();
  const member = (db.members || []).find(m => m.id === id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  if (name) member.name = name.trim();
  if (role) member.role = role.trim();

  writeDb(db);
  res.json(member);
});

// ----------------- EVENTS ENDPOINTS -----------------
app.get('/api/events', (req, res) => {
  const db = readDb();
  res.json(db.events || []);
});

app.post('/api/events', (req, res) => {
  const { eventName, date, time, moneySpent, description } = req.body;
  if (!eventName) {
    return res.status(400).json({ error: 'Event Name is required' });
  }

  const db = readDb();
  const newEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    eventName: eventName.trim(),
    date: date || new Date().toISOString().split('T')[0],
    time: time || '10:00 AM',
    moneySpent: Number(moneySpent) || 0,
    description: description || '',
    createdAt: new Date().toISOString()
  };

  db.events.unshift(newEvent);
  writeDb(db);
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const { eventName, date, time, moneySpent, description } = req.body;

  const db = readDb();
  const index = db.events.findIndex(e => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Event record not found' });
  }

  db.events[index] = {
    ...db.events[index],
    eventName: eventName !== undefined ? eventName.trim() : db.events[index].eventName,
    date: date || db.events[index].date,
    time: time || db.events[index].time,
    moneySpent: moneySpent !== undefined ? Number(moneySpent) : db.events[index].moneySpent,
    description: description !== undefined ? description : db.events[index].description,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  res.json(db.events[index]);
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const initialLen = db.events.length;
  db.events = db.events.filter(e => e.id !== id);

  if (db.events.length === initialLen) {
    return res.status(404).json({ error: 'Event record not found' });
  }

  writeDb(db);
  res.json({ message: 'Event deleted successfully' });
});

// ----------------- CSV EXPORT -----------------
app.get('/api/export/csv', (req, res) => {
  const db = readDb();
  let csv = '--- FAMILY & GOTHRAM DIRECTORY ---\n';
  csv += 'Family Head,Gothram,Family Members,Phone,Address,Pooja Requested,Date\n';
  (db.families || []).forEach(f => {
    csv += `"${f.familyHead}","${f.gothram}","${f.familyMembers || ''}","${f.phone || ''}","${f.address || ''}","${f.poojaRequested || ''}","${f.date || ''}"\n`;
  });

  csv += '\n--- DONATIONS ---\n';
  csv += 'Receipt No,Type,Donor Name,Pledged (INR),Paid (INR),Due (INR),Item Name,Quantity,Mode,Phone,Date,Notes\n';
  db.donations.forEach(d => {
    csv += `"${d.receiptNo}","${d.donationType || 'Money'}","${d.donorName}",${d.promisedAmount || 0},${d.paidAmount || 0},${d.dueAmount || 0},"${d.itemName || ''}","${d.itemQuantity || ''}","${d.paymentMode}","${d.phone}","${d.date}","${d.notes || ''}"\n`;
  });

  csv += '\n--- EXPENSES ---\n';
  csv += 'Title,Category,Agreed Total (INR),Advance Paid (INR),Vendor Due (INR),Date,Paid To,Spent By,Notes\n';
  db.expenses.forEach(e => {
    csv += `"${e.title}","${e.category}",${e.totalAmount || e.amount},${e.advancePaid || e.amount},${e.dueAmount || 0},"${e.date}","${e.paidTo || ''}","${e.spentBy || ''}","${e.notes || ''}"\n`;
  });

  csv += '\n--- COMMITTEE MEMBERS MANDAPAM STATUS ---\n';
  csv += 'Member No,Member Name,Status,Last Updated\n';
  (db.members || []).forEach(m => {
    csv += `"#${m.memberNo}","${m.name}","${m.status}","${m.lastUpdated || ''}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="vinayaka_chavithi_gothram_and_accounts_report.csv"');
  res.send(csv);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
