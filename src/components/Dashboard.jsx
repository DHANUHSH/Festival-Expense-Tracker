import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Users, Receipt, PlusCircle, ArrowUpRight, ArrowDownRight, Sparkles, AlertCircle, Calendar, BookOpen, ArrowRight, Minus, Equal } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#DC2626', '#E11D48', '#EA580C', '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777'];

export default function Dashboard({ summary, donations, expenses, events = [], members = [], families = [], onOpenAddDonation, onOpenAddExpense, onSelectTab }) {
  const { 
    totalPromisedDonations = 0, 
    totalPaidDonations = 0, 
    totalDueDonations = 0, 
    totalExpensesAgreed = 0,
    totalExpensesAdvance = 0,
    totalExpensesDue = 0,
    remainingBalance = 0, 
    donationCount = 0, 
    itemDonationCount = 0,
    expenseCount = 0, 
    eventCount = 0,
    familyCount = 0,
    gothramCount = 0,
    memberCounts = { total: 33, inMandapam: 0, outForWork: 0, notInMandapam: 33 },
    categoryBreakdown = [] 
  } = summary || {};

  const expensePctOfDonations = totalPaidDonations > 0 ? Math.min(100, Math.round((totalExpensesAdvance / totalPaidDonations) * 100)) : 0;

  return (
    <div className="space-y-8">
      
      {/* Devotional Banner Card */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-2 top-0 opacity-15 text-9xl pointer-events-none select-none">
          🕉️
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Royal Young Boys Association • Ganesh Agamanam 2026
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Sri Ganesh Utsav Accounts & Duty Dashboard
            </h2>
            <p className="text-red-100 text-sm mt-1">
              Live tracking of Pledged Donations, Vendor Advances & Dues, Gothralu Directory, & 13-Day Events
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddDonation}
              className="px-4 py-2.5 bg-white text-red-700 hover:bg-rose-50 font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-red-600" /> + Add Donation / Item
            </button>
            <button
              onClick={onOpenAddExpense}
              className="px-4 py-2.5 bg-red-950/40 hover:bg-red-950/60 text-white font-semibold text-sm rounded-xl border border-white/20 shadow-sm flex items-center gap-2 transition active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-rose-200" /> + Record Expense / Advance
            </button>
          </div>
        </div>
      </div>

      {/* FINANCIAL CASH FLOW EQUATION BANNER */}
      <div className="bg-white p-6 rounded-2xl border-2 border-red-200 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-red-100 pb-3">
          <div>
            <h3 className="font-extrabold text-red-950 text-base flex items-center gap-2">
              <span>💳</span> Donation Funds & Expenses Usage Equation
            </h3>
            <p className="text-xs text-slate-500">
              Donations collected are used directly to fund festival expenses
            </p>
          </div>

          <div className="px-3 py-1 bg-red-50 text-red-800 rounded-full text-xs font-extrabold border border-red-200">
            📊 {expensePctOfDonations}% of collected donations used for expenses
          </div>
        </div>

        {/* 3 Step Equation Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
          
          {/* Step 1: Total Donations Collected */}
          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 col-span-1 md:col-span-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">1. Total Donations Collected</span>
            <span className="text-xl font-black text-emerald-700 block mt-1">₹ {totalPaidDonations.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">📥 Income Received</span>
          </div>

          {/* Minus Operator */}
          <div className="hidden md:flex justify-center text-slate-400 font-black text-2xl">
            <Minus className="w-6 h-6 text-red-500" />
          </div>

          {/* Step 2: Total Money Used for Expenses */}
          <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 col-span-1 md:col-span-1">
            <span className="text-[11px] font-bold text-rose-800 uppercase block">2. Used for Expenses</span>
            <span className="text-xl font-black text-rose-700 block mt-1">₹ {totalExpensesAdvance.toLocaleString('en-IN')}</span>
            <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">📤 Festival Outflow</span>
          </div>

          {/* Equals Operator */}
          <div className="hidden md:flex justify-center text-slate-400 font-black text-2xl">
            <Equal className="w-6 h-6 text-slate-700" />
          </div>

          {/* Step 3: Remaining Balance Available */}
          <div className={`p-4 rounded-xl border col-span-1 md:col-span-1 ${remainingBalance >= 0 ? 'bg-sky-50 border-sky-200' : 'bg-red-100 border-red-300'}`}>
            <span className="text-[11px] font-bold text-slate-800 uppercase block">3. Remaining Balance</span>
            <span className={`text-xl font-black block mt-1 ${remainingBalance >= 0 ? 'text-sky-700' : 'text-red-700'}`}>
              ₹ {remainingBalance.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-600 font-semibold block mt-0.5">💰 Net Funds Available</span>
          </div>

        </div>
      </div>

      {/* Committee & Gothram Live Quick Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Committee Roster Widget */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Committee Mandapam Roster</h3>
                <p className="text-xs text-slate-500">33 Members Duty Tracker</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('committee')}
              className="text-xs font-bold text-red-700 hover:underline"
            >
              View Roster →
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex-1 text-center">
              🟢 In Mandapam: {memberCounts.inMandapam}
            </div>

            <div className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg flex-1 text-center">
              🟡 Pandhiri Work: {memberCounts.outForWork}
            </div>

            <div className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg flex-1 text-center">
              🔴 Away: {memberCounts.notInMandapam}
            </div>
          </div>
        </div>

        {/* Family Gothram Directory Widget */}
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-red-700 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Family Names & Gothralu Directory</h3>
                <p className="text-xs text-slate-500">Devotees Registered for Puja Sankalpam</p>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('gothram')}
              className="text-xs font-bold text-red-700 hover:underline"
            >
              View Directory →
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="px-3 py-1.5 bg-red-50 text-red-900 border border-red-200 rounded-lg flex-1 text-center">
              👪 Registered Families: {familyCount}
            </div>

            <div className="px-3 py-1.5 bg-rose-50 text-red-900 border border-rose-200 rounded-lg flex-1 text-center">
              🕉️ Unique Gothrams: {gothramCount}
            </div>
          </div>
        </div>

      </div>

      {/* 4 Core Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Paid Donations */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Paid Collected
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Paid Money Received</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹ {totalPaidDonations.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pledged: ₹{totalPromisedDonations.toLocaleString('en-IN')}</span>
            <button 
              onClick={() => onSelectTab('donations')}
              className="text-red-700 font-bold hover:underline"
            >
              Details →
            </button>
          </div>
        </div>

        {/* Card 2: Pending Donor Due */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition relative bg-amber-50/10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300">
              Donor Due
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Donor Due Pending</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              ₹ {totalDueDonations.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-amber-800 font-semibold">{totalDueDonations > 0 ? 'Follow up needed' : 'All clear'}</span>
            <button 
              onClick={() => onSelectTab('donations')}
              className="text-amber-700 font-bold hover:underline"
            >
              View Dues →
            </button>
          </div>
        </div>

        {/* Card 3: Vendor Advances & Dues */}
        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm hover:shadow-md transition relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              Advance Paid Out
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Expenses Advance Paid</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹ {totalExpensesAdvance.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-amber-700 font-bold">Vendor Due: ₹{totalExpensesDue.toLocaleString('en-IN')}</span>
            <button 
              onClick={() => onSelectTab('expenses')}
              className="text-rose-700 font-bold hover:underline"
            >
              Expenses →
            </button>
          </div>
        </div>

        {/* Card 4: Available Remaining Balance */}
        <div className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition relative ${remainingBalance >= 0 ? 'border-red-200' : 'border-red-400 bg-red-50/20'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${remainingBalance >= 0 ? 'text-red-800 bg-red-50 border-red-200' : 'text-red-800 bg-red-100 border-red-300'}`}>
              Available Balance
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500">Net Remaining Funds</p>
            <h3 className={`text-2xl font-black mt-1 ${remainingBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
              ₹ {remainingBalance.toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold text-slate-600">
              {itemDonationCount > 0 ? `${itemDonationCount} In-Kind Items` : 'Net Cash Available'}
            </span>
            <button 
              onClick={() => onSelectTab('reports')}
              className="text-red-700 font-bold hover:underline"
            >
              Statement →
            </button>
          </div>
        </div>

      </div>

      {/* Events Schedule & Expense Pie Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 13-Day Events Schedule Widget */}
        <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-600" /> 13-Day Utsav Events Schedule
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Royal Young Boys Association Official Schedule</p>
              </div>

              <button
                onClick={() => onSelectTab('events')}
                className="text-xs font-bold text-red-700 hover:underline"
              >
                + Manage Events
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {events.length > 0 ? (
                events.map((evt, idx) => (
                  <div key={evt.id} className="p-3 rounded-xl bg-red-50/40 border border-red-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-red-700 text-[10px] uppercase bg-red-100 px-2 py-0.5 rounded">
                        Day {idx + 1} • {evt.date}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{evt.eventName}</h4>
                      <p className="text-slate-500 text-[11px]">⏰ {evt.time} • {evt.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm border border-dashed border-red-100 rounded-xl">
                  No events scheduled yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Events: {eventCount}</span>
            <button
              onClick={() => onSelectTab('events')}
              className="font-bold text-red-700 hover:underline"
            >
              View Full 13-Day Schedule →
            </button>
          </div>
        </div>

        {/* Expense Category Chart */}
        <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Expense Distribution
          </h3>
          <p className="text-xs text-slate-500 mb-4">Where festival money was spent</p>

          {categoryBreakdown.length > 0 ? (
            <div className="h-64 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val) => [`₹ ${Number(val).toLocaleString('en-IN')}`, 'Spent']} 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #fca5a5' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-sm border border-dashed border-red-100 rounded-xl">
              <Receipt className="w-10 h-10 mb-2 text-slate-300" />
              <p>No expenses recorded yet</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
