import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Banknote, Receipt, FileText, Calendar, Users, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import Dashboard from './components/Dashboard.jsx';
import DonationManager from './components/DonationManager.jsx';
import ExpenseManager from './components/ExpenseManager.jsx';
import EventManager from './components/EventManager.jsx';
import CommitteeManager from './components/CommitteeManager.jsx';
import GothramManager from './components/GothramManager.jsx';
import Reports from './components/Reports.jsx';
import ReceiptModal from './components/ReceiptModal.jsx';
import storage, { computeSummary } from './services/storage.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState({
    totalPromisedDonations: 0,
    totalPaidDonations: 0,
    totalDueDonations: 0,
    totalExpensesAgreed: 0,
    totalExpensesAdvance: 0,
    totalExpensesDue: 0,
    remainingBalance: 0,
    donationCount: 0,
    itemDonationCount: 0,
    expenseCount: 0,
    eventCount: 0,
    familyCount: 0,
    gothramCount: 0,
    memberCounts: { total: 33, inMandapam: 0, outForWork: 0, notInMandapam: 33 },
    categoryBreakdown: []
  });
  const [donations, setDonations] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedReceiptDonation, setSelectedReceiptDonation] = useState(null);
  const [isAddDonationOpen, setIsAddDonationOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Fetch all data from server or localStorage fallback
  const refreshData = async () => {
    setLoading(true);
    let loadedFromApi = false;
    try {
      const [sumRes, donRes, expRes, evtRes, memRes, famRes] = await Promise.all([
        fetch('/api/summary'),
        fetch('/api/donations'),
        fetch('/api/expenses'),
        fetch('/api/events'),
        fetch('/api/members'),
        fetch('/api/families')
      ]);

      if (sumRes.ok && donRes.ok && expRes.ok) {
        setSummary(await sumRes.json());
        setDonations(await donRes.json());
        setExpenses(await expRes.json());
        if (evtRes.ok) setEvents(await evtRes.json());
        if (memRes.ok) setMembers(await memRes.json());
        if (famRes.ok) setFamilies(await famRes.json());
        loadedFromApi = true;
      }
    } catch (err) {
      console.log('Backend API not reached, using local storage mode:', err);
    }

    if (!loadedFromApi) {
      const db = storage.getLocalStore();
      setDonations(db.donations || []);
      setExpenses(db.expenses || []);
      setEvents(db.events || []);
      setMembers(db.members || []);
      setFamilies(db.families || []);
      setSummary(computeSummary(db));
    }

    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for Donations
  const handleAddDonation = async (data) => {
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    // Fallback Local Storage
    const db = storage.getLocalStore();
    const counter = (db.settings?.receiptCounter || db.donations.length) + 1;
    const receiptNo = `VC-DON-${String(counter).padStart(3, '0')}`;
    if (db.settings) db.settings.receiptCounter = counter + 1;

    const promised = Number(data.promisedAmount || data.amount) || 0;
    const paid = Number(data.paidAmount || data.amount) || 0;
    const due = Math.max(0, promised - paid);

    const record = {
      id: `don_${Date.now()}`,
      receiptNo,
      donationType: data.donationType || 'Money',
      donorName: data.donorName,
      promisedAmount: promised,
      paidAmount: paid,
      dueAmount: due,
      amount: paid,
      paymentMode: data.paymentMode || 'Cash',
      itemName: data.itemName || '',
      itemQuantity: data.itemQuantity || '',
      phone: data.phone || '',
      date: data.date || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    db.donations.unshift(record);
    storage.saveLocalStore(db);
    refreshData();
  };

  const handleUpdateDonation = async (id, data) => {
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    const idx = db.donations.findIndex(d => d.id === id);
    if (idx !== -1) {
      db.donations[idx] = { ...db.donations[idx], ...data };
      storage.saveLocalStore(db);
    }
    refreshData();
  };

  const handleDeleteDonation = async (id) => {
    try {
      const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    db.donations = db.donations.filter(d => d.id !== id);
    storage.saveLocalStore(db);
    refreshData();
  };

  // Handlers for Expenses
  const handleAddExpense = async (data) => {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    const total = Number(data.totalAmount || data.amount) || 0;
    const advance = Number(data.advancePaid || data.amount) || 0;
    const due = Math.max(0, total - advance);

    const record = {
      id: `exp_${Date.now()}`,
      title: data.title,
      category: data.category || 'Miscellaneous',
      totalAmount: total,
      advancePaid: advance,
      dueAmount: due,
      amount: advance,
      date: data.date || new Date().toISOString().split('T')[0],
      paidTo: data.paidTo || '',
      spentBy: data.spentBy || '',
      notes: data.notes || '',
      createdAt: new Date().toISOString()
    };

    db.expenses.unshift(record);
    storage.saveLocalStore(db);
    refreshData();
  };

  const handleUpdateExpense = async (id, data) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    const idx = db.expenses.findIndex(e => e.id === id);
    if (idx !== -1) {
      db.expenses[idx] = { ...db.expenses[idx], ...data };
      storage.saveLocalStore(db);
    }
    refreshData();
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    db.expenses = db.expenses.filter(e => e.id !== id);
    storage.saveLocalStore(db);
    refreshData();
  };

  // Handlers for Events
  const handleAddEvent = async (data) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    db.events.unshift({ id: `evt_${Date.now()}`, ...data });
    storage.saveLocalStore(db);
    refreshData();
  };

  const handleUpdateEvent = async (id, data) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    const idx = db.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      db.events[idx] = { ...db.events[idx], ...data };
      storage.saveLocalStore(db);
    }
    refreshData();
  };

  const handleDeleteEvent = async (id) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    db.events = db.events.filter(e => e.id !== id);
    storage.saveLocalStore(db);
    refreshData();
  };

  // Handlers for Members
  const handleUpdateMemberStatus = async (id, status) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    try {
      await fetch(`/api/members/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {}

    const db = storage.getLocalStore();
    const mem = db.members.find(m => m.id === id);
    if (mem) {
      mem.status = status;
      storage.saveLocalStore(db);
    }
    refreshData();
  };

  const handleUpdateMemberName = async (id, name) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, name } : m));
    try {
      await fetch(`/api/members/${id}/name`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
    } catch (err) {}

    const db = storage.getLocalStore();
    const mem = db.members.find(m => m.id === id);
    if (mem) {
      mem.name = name;
      storage.saveLocalStore(db);
    }
    refreshData();
  };

  // Handlers for Families & Gothram
  const handleAddFamily = async (data) => {
    try {
      const res = await fetch('/api/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    db.families.unshift({ id: `fam_${Date.now()}`, ...data });
    storage.saveLocalStore(db);
    refreshData();
  };

  const handleUpdateFamily = async (id, data) => {
    try {
      const res = await fetch(`/api/families/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    const idx = db.families.findIndex(f => f.id === id);
    if (idx !== -1) {
      db.families[idx] = { ...db.families[idx], ...data };
      storage.saveLocalStore(db);
    }
    refreshData();
  };

  const handleDeleteFamily = async (id) => {
    try {
      const res = await fetch(`/api/families/${id}`, { method: 'DELETE' });
      if (res.ok) {
        refreshData();
        return;
      }
    } catch (err) {}

    const db = storage.getLocalStore();
    db.families = db.families.filter(f => f.id !== id);
    storage.saveLocalStore(db);
    refreshData();
  };

  const inMandapamCount = summary.memberCounts?.inMandapam || 0;

  return (
    <div className="min-h-screen vinayaka-bg text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header Navigation */}
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-red-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 flex items-center justify-center text-white text-xl shadow-md font-bold">
              🕉️
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-red-950 tracking-tight flex items-center gap-1.5">
                Royal Young Boys <span className="text-red-700 text-xs px-2 py-0.5 rounded-full bg-red-100 font-bold border border-red-200">2026</span>
              </h1>
              <p className="text-[10px] text-red-700 font-bold tracking-wider uppercase">
                Ganesh Agamanam Accounts & Gothralu Tracker
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === 'dashboard'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('donations')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === 'donations'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Donations ({summary.donationCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === 'expenses'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Expenses ({summary.expenseCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('gothram')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === 'gothram'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Gothralu ({summary.familyCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('committee')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition relative ${
                activeTab === 'committee'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Committee</span>
              {inMandapamCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[10px] rounded-full font-bold">
                  {inMandapamCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === 'events'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Events ({summary.eventCount || 13})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition ${
                activeTab === 'reports'
                  ? 'bg-red-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Statement</span>
            </button>

            <button
              onClick={refreshData}
              title="Refresh Data"
              className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-600' : ''}`} />
            </button>
          </nav>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'dashboard' && (
          <Dashboard
            summary={summary}
            donations={donations}
            expenses={expenses}
            events={events}
            members={members}
            families={families}
            onOpenAddDonation={() => {
              setActiveTab('donations');
              setIsAddDonationOpen(true);
            }}
            onOpenAddExpense={() => {
              setActiveTab('expenses');
              setIsAddExpenseOpen(true);
            }}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'donations' && (
          <DonationManager
            donations={donations}
            onAddDonation={handleAddDonation}
            onUpdateDonation={handleUpdateDonation}
            onDeleteDonation={handleDeleteDonation}
            onViewReceipt={setSelectedReceiptDonation}
            isAddOpen={isAddDonationOpen}
            setIsAddOpen={setIsAddDonationOpen}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseManager
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            isAddOpen={isAddExpenseOpen}
            setIsAddOpen={setIsAddExpenseOpen}
          />
        )}

        {activeTab === 'gothram' && (
          <GothramManager
            families={families}
            onAddFamily={handleAddFamily}
            onUpdateFamily={handleUpdateFamily}
            onDeleteFamily={handleDeleteFamily}
          />
        )}

        {activeTab === 'committee' && (
          <CommitteeManager
            members={members}
            onUpdateStatus={handleUpdateMemberStatus}
            onUpdateName={handleUpdateMemberName}
          />
        )}

        {activeTab === 'events' && (
          <EventManager
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'reports' && (
          <Reports
            summary={summary}
            donations={donations}
            expenses={expenses}
            events={events}
          />
        )}
      </main>

      {/* Receipt Modal */}
      {selectedReceiptDonation && (
        <ReceiptModal
          donation={selectedReceiptDonation}
          onClose={() => setSelectedReceiptDonation(null)}
        />
      )}

      {/* Footer */}
      <footer className="no-print border-t border-red-100 bg-white py-4 text-center text-xs text-slate-500">
        <p className="font-bold text-red-900">
          🚩 Royal Young Boys Association • Ganesh Agamanam 2026 Official Accounts & Gothralu Directory
        </p>
      </footer>

    </div>
  );
}
