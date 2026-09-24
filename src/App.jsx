import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Banknote, Receipt, FileText, Calendar, Users, BookOpen, Sparkles, RefreshCw, Trophy, Utensils, Volume2, Globe } from 'lucide-react';
import Dashboard from './components/Dashboard.jsx';
import DonationManager from './components/DonationManager.jsx';
import ExpenseManager from './components/ExpenseManager.jsx';
import EventManager from './components/EventManager.jsx';
import CommitteeManager from './components/CommitteeManager.jsx';
import GothramManager from './components/GothramManager.jsx';
import Reports from './components/Reports.jsx';
import ReceiptModal from './components/ReceiptModal.jsx';
import LadduAuctionManager from './components/LadduAuctionManager.jsx';
import PrasadamManager from './components/PrasadamManager.jsx';
import PujaAudioTracker from './components/PujaAudioTracker.jsx';
import storage, { computeSummary } from './services/storage.js';
import cloudSync from './services/cloudSync.js';
import { translations } from './i18n/translations.js';

export default function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang] || translations.en;

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

  // New Features States
  const [ladduBids, setLadduBids] = useState([]);
  const [prasadamSponsors, setPrasadamSponsors] = useState([]);
  const [prasadamChecklist, setPrasadamChecklist] = useState([]);
  const [samagriChecklist, setSamagriChecklist] = useState([]);

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

    const db = storage.getLocalStore();
    if (!loadedFromApi) {
      setDonations(db.donations || []);
      setExpenses(db.expenses || []);
      setEvents(db.events || []);
      setMembers(db.members || []);
      setFamilies(db.families || []);
      setSummary(computeSummary(db));
    }

    setLadduBids(db.ladduBids || []);
    setPrasadamSponsors(db.prasadamSponsors || []);
    setPrasadamChecklist(db.prasadamChecklist || []);
    setSamagriChecklist(db.samagriChecklist || []);

    setLoading(false);
  };

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [roomInput, setRoomInput] = useState(cloudSync.getRoomCode());

  useEffect(() => {
    refreshData();
    const unsubscribe = cloudSync.subscribe((remoteStore) => {
      if (remoteStore) {
        setDonations(remoteStore.donations || []);
        setExpenses(remoteStore.expenses || []);
        setEvents(remoteStore.events || []);
        setMembers(remoteStore.members || []);
        setFamilies(remoteStore.families || []);
        setLadduBids(remoteStore.ladduBids || []);
        setPrasadamSponsors(remoteStore.prasadamSponsors || []);
        setPrasadamChecklist(remoteStore.prasadamChecklist || []);
        setSamagriChecklist(remoteStore.samagriChecklist || []);
        setSummary(computeSummary(remoteStore));
      } else {
        refreshData();
      }
    });
    return () => unsubscribe();
  }, []);

  // Handlers for Laddu Bids
  const handleAddLadduBid = (bidData) => {
    const db = storage.getLocalStore();
    const newBid = { id: `bid_${Date.now()}`, ...bidData };
    const updated = [newBid, ...(db.ladduBids || [])];
    db.ladduBids = updated;
    storage.saveLocalStore(db);
    setLadduBids(updated);
  };

  const handleUpdateLadduBid = (id, data) => {
    const db = storage.getLocalStore();
    const updated = (db.ladduBids || []).map(b => b.id === id ? { ...b, ...data } : b);
    db.ladduBids = updated;
    storage.saveLocalStore(db);
    setLadduBids(updated);
  };

  const handleDeleteLadduBid = (id) => {
    const db = storage.getLocalStore();
    const updated = (db.ladduBids || []).filter(b => b.id !== id);
    db.ladduBids = updated;
    storage.saveLocalStore(db);
    setLadduBids(updated);
  };

  // Handlers for Prasadam Sponsors
  const handleAddPrasadamSponsor = (spData) => {
    const db = storage.getLocalStore();
    const newSp = { id: `sp_${Date.now()}`, ...spData };
    const updated = [newSp, ...(db.prasadamSponsors || [])];
    db.prasadamSponsors = updated;
    storage.saveLocalStore(db);
    setPrasadamSponsors(updated);
  };

  const handleDeletePrasadamSponsor = (id) => {
    const db = storage.getLocalStore();
    const updated = (db.prasadamSponsors || []).filter(s => s.id !== id);
    db.prasadamSponsors = updated;
    storage.saveLocalStore(db);
    setPrasadamSponsors(updated);
  };

  const handleTogglePrasadamChecklist = (id) => {
    const db = storage.getLocalStore();
    const updated = (db.prasadamChecklist || []).map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    db.prasadamChecklist = updated;
    storage.saveLocalStore(db);
    setPrasadamChecklist(updated);
  };

  // Handlers for Samagri Checklist
  const handleToggleSamagriChecklist = (id) => {
    const db = storage.getLocalStore();
    const updated = (db.samagriChecklist || []).map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    db.samagriChecklist = updated;
    storage.saveLocalStore(db);
    setSamagriChecklist(updated);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 flex items-center justify-center text-white text-xl shadow-md font-bold shrink-0">
              🕉️
            </div>
            <div className="hidden md:block">
              <h1 className="text-base sm:text-lg font-black text-red-950 tracking-tight flex items-center gap-1.5">
                {t.appTitle} <span className="text-red-700 text-xs px-2 py-0.5 rounded-full bg-red-100 font-bold border border-red-200">2026</span>
              </h1>
              <p className="text-[10px] text-red-700 font-bold tracking-wider uppercase">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.dashboard}</span>
            </button>

            <button
              onClick={() => setActiveTab('donations')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'donations'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>{t.donations} ({summary.donationCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'expenses'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>{t.expenses} ({summary.expenseCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('laddu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'laddu'
                  ? 'bg-amber-500 text-red-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-amber-900 hover:bg-amber-50'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>{t.ladduAuction}</span>
            </button>

            <button
              onClick={() => setActiveTab('prasadam')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'prasadam'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-orange-900 hover:bg-orange-50'
              }`}
            >
              <Utensils className="w-4 h-4 text-orange-600" />
              <span>{t.prasadam}</span>
            </button>

            <button
              onClick={() => setActiveTab('videoInvite')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'videoInvite'
                  ? 'bg-amber-400 text-red-950 shadow-sm font-black'
                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100 font-extrabold border border-amber-300'
              }`}
            >
              <span>🎬 ఆహ్వానం (Video Invite)</span>
            </button>

            <button
              onClick={() => setActiveTab('puja')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'puja'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-900 hover:bg-purple-50'
              }`}
            >
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>{t.pujaAudio}</span>
            </button>

            <button
              onClick={() => setActiveTab('gothram')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'gothram'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.gothram} ({summary.familyCount || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('committee')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition relative shrink-0 ${
                activeTab === 'committee'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t.committee}</span>
              {inMandapamCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[10px] rounded-full font-bold">
                  {inMandapamCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'events'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{t.events} ({summary.eventCount || 13})</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 ${
                activeTab === 'reports'
                  ? 'bg-red-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-red-900 hover:bg-red-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.reports}</span>
            </button>
          </nav>

          {/* Right Action Bar: Live Sync, Language Switcher & Refresh */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSyncModalOpen(true)}
              className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-1.5 border border-emerald-300 shadow-sm transition"
              title="Click to configure Festival Cloud Room"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="hidden sm:inline">Live:</span>
              <span>{cloudSync.getRoomCode()}</span>
            </button>

            <button
              onClick={() => setLang(l => l === 'en' ? 'te' : 'en')}
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 font-extrabold text-xs rounded-xl transition flex items-center gap-1 border border-red-200"
              title="Toggle Telugu / English"
            >
              <Globe className="w-3.5 h-3.5 text-red-700" />
              <span>{lang === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            <button
              onClick={refreshData}
              title="Refresh Data"
              className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-red-600' : ''}`} />
            </button>
          </div>

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

        {activeTab === 'laddu' && (
          <LadduAuctionManager
            bids={ladduBids}
            onAddBid={handleAddLadduBid}
            onUpdateBid={handleUpdateLadduBid}
            onDeleteBid={handleDeleteLadduBid}
            lang={lang}
          />
        )}

        {activeTab === 'prasadam' && (
          <PrasadamManager
            sponsors={prasadamSponsors}
            checklist={prasadamChecklist}
            onAddSponsor={handleAddPrasadamSponsor}
            onDeleteSponsor={handleDeletePrasadamSponsor}
            onToggleChecklist={handleTogglePrasadamChecklist}
            lang={lang}
          />
        )}

        {activeTab === 'videoInvite' && (
          <div className="bg-red-950 rounded-3xl p-4 border-2 border-amber-400 shadow-2xl space-y-4">
            <div className="flex justify-between items-center text-amber-300 font-bold px-2">
              <h3 className="text-lg font-black flex items-center gap-2">
                <span>🤖 Doraemon & Nobita Telugu Video Invitation</span>
              </h3>
              <a
                href="/doraemon_invitation.html"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-1.5 bg-amber-400 text-red-950 rounded-xl text-xs font-black hover:bg-amber-300 transition"
              >
                🔗 Open Full Screen Link
              </a>
            </div>
            <div className="w-full h-[650px] bg-black rounded-2xl overflow-hidden">
              <iframe
                src="/doraemon_invitation.html"
                title="Doraemon & Nobita Telugu Anna Santharpana Invitation"
                className="w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        )}

        {activeTab === 'puja' && (
          <PujaAudioTracker
            samagriChecklist={samagriChecklist}
            onToggleSamagri={handleToggleSamagriChecklist}
            lang={lang}
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

      {/* Cloud Sync Settings Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 border border-emerald-200">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Live Multi-Phone Sync Settings</span>
              </h3>
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-semibold space-y-1">
                <p className="font-bold text-sm text-emerald-950">📱 How Realtime Sync Works:</p>
                <p>All smartphones at the Mandapam sharing the same <strong>Festival Room Code</strong> will sync donations, expenses, laddu bids, and family gothrams instantly in real-time!</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Festival Room Code
                </label>
                <input
                  type="text"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                  placeholder="e.g. VC-2026-ROYALBOYS"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-black text-slate-900 tracking-wider focus:ring-2 focus:ring-emerald-500 outline-none uppercase"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSyncModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (roomInput.trim()) {
                      cloudSync.setRoomCode(roomInput.trim());
                      refreshData();
                    }
                    setIsSyncModalOpen(false);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-md transition"
                >
                  Save & Connect Room
                </button>
              </div>
            </div>
          </div>
        </div>
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
