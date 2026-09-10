import React from 'react';
import { Download, Printer, FileSpreadsheet, AlertCircle, Package, Calendar } from 'lucide-react';

export default function Reports({ summary, donations, expenses, events = [] }) {
  const { 
    totalPromisedDonations = 0, 
    totalPaidDonations = 0, 
    totalDueDonations = 0, 
    totalExpenses = 0, 
    remainingBalance = 0, 
    categoryBreakdown = [] 
  } = summary || {};

  const handleDownloadCSV = () => {
    window.location.href = '/api/export/csv';
  };

  const handlePrintReport = () => {
    window.print();
  };

  const moneyDonations = donations.filter(d => d.donationType !== 'Item' && !d.itemName);
  const itemDonations = donations.filter(d => d.donationType === 'Item' || Boolean(d.itemName));
  const dueDonations = moneyDonations.filter(d => Number(d.dueAmount) > 0 || Number(d.promisedAmount) > Number(d.paidAmount));

  return (
    <div className="space-y-8">
      
      {/* Action Header */}
      <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            📊 Complete Accounts Audit & Statement
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete statement of Money Collected, Pending Dues, Items Received, Events & Expenses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export Excel / CSV
          </button>

          <button
            onClick={handlePrintReport}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" /> Print Full Report
          </button>
        </div>
      </div>

      {/* Printable Document */}
      <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-sm space-y-8">
        
        {/* Header */}
        <div className="text-center pb-6 border-b border-red-200">
          <div className="text-4xl mb-1">🕉️</div>
          <h1 className="text-2xl font-black text-red-950 tracking-tight">
            Sri Vinayaka Chavithi Celebrations
          </h1>
          <p className="text-xs font-bold text-red-700 uppercase tracking-widest mt-1">
            Official Balance Sheet & Festival Audit Statement
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Generated on: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
          </p>
        </div>

        {/* Net Financial Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-red-50/40 p-4 rounded-xl border border-red-200">
          <div className="p-3 bg-white rounded-lg border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-700 block">Total Paid Collected</span>
            <span className="text-xl font-black text-emerald-600">₹ {totalPaidDonations.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-amber-200">
            <span className="text-xs font-semibold text-amber-800 block">Total Pending Due</span>
            <span className="text-xl font-black text-amber-600">₹ {totalDueDonations.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-3 bg-white rounded-lg border border-rose-100">
            <span className="text-xs font-semibold text-rose-700 block">Total Expenses Spent</span>
            <span className="text-xl font-black text-rose-600">₹ {totalExpenses.toLocaleString('en-IN')}</span>
          </div>

          <div className={`p-3 bg-white rounded-lg border ${remainingBalance >= 0 ? 'border-red-200' : 'border-red-400'}`}>
            <span className="text-xs font-semibold text-slate-600 block">Available Balance</span>
            <span className={`text-xl font-black ${remainingBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
              ₹ {remainingBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Pending Dues Section */}
        {dueDonations.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Pending Due Money Schedule ({dueDonations.length} Pending)
            </h3>
            <div className="border border-amber-200 rounded-xl overflow-hidden text-xs bg-amber-50/20">
              <table className="w-full text-left">
                <thead className="bg-amber-100/60 text-amber-900 font-bold border-b border-amber-200">
                  <tr>
                    <th className="py-2.5 px-3">Donor Name</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Pledged (₹)</th>
                    <th className="py-2.5 px-3">Paid (₹)</th>
                    <th className="py-2.5 px-3 text-right">Pending Due (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {dueDonations.map((d) => {
                    const p = Number(d.promisedAmount || d.amount);
                    const pd = Number(d.paidAmount || d.amount);
                    const due = Math.max(0, p - pd);
                    return (
                      <tr key={d.id}>
                        <td className="py-2 px-3 font-bold text-slate-900">{d.donorName}</td>
                        <td className="py-2 px-3 text-slate-600">{d.phone || '-'}</td>
                        <td className="py-2 px-3 font-semibold text-slate-800">₹ {p.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3 font-semibold text-emerald-600">₹ {pd.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3 text-right font-black text-amber-700">₹ {due.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Item Donations Section */}
        {itemDonations.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-900 mb-3 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-purple-600" /> Pilgrim Item Donations ({itemDonations.length} Items)
            </h3>
            <div className="border border-purple-200 rounded-xl overflow-hidden text-xs bg-purple-50/20">
              <table className="w-full text-left">
                <thead className="bg-purple-100/60 text-purple-900 font-bold border-b border-purple-200">
                  <tr>
                    <th className="py-2.5 px-3">Pilgrim Name</th>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Est. Value (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {itemDonations.map((d) => (
                    <tr key={d.id}>
                      <td className="py-2 px-3 font-bold text-slate-900">{d.donorName}</td>
                      <td className="py-2 px-3 font-semibold text-purple-900">{d.itemName}</td>
                      <td className="py-2 px-3 text-slate-700">{d.itemQuantity || '1'}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-700">
                        {d.estimatedValue ? `₹ ${Number(d.estimatedValue).toLocaleString('en-IN')}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Events Schedule Section */}
        {events.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-red-900 mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-red-600" /> Festival Events Schedule & Budgets
            </h3>
            <div className="border border-red-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-red-50 text-red-900 font-bold border-b border-red-200">
                  <tr>
                    <th className="py-2.5 px-3">Event Name</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Timing</th>
                    <th className="py-2.5 px-3 text-right">Budget Spent (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {events.map((ev) => (
                    <tr key={ev.id}>
                      <td className="py-2 px-3 font-bold text-slate-900">{ev.eventName}</td>
                      <td className="py-2 px-3 text-slate-600">{ev.date}</td>
                      <td className="py-2 px-3 text-slate-600">{ev.time}</td>
                      <td className="py-2 px-3 text-right font-bold text-red-600">₹ {Number(ev.moneySpent || 0).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-800">Verified & Approved By:</p>
            <p className="mt-1">Sri Vinayaka Chavithi Utsav Committee</p>
          </div>
          <div className="text-right">
            <div className="inline-block border-b border-slate-400 w-36 mb-1"></div>
            <p className="font-bold text-slate-800">Treasurer / President</p>
          </div>
        </div>

      </div>

    </div>
  );
}
