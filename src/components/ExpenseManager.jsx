import React, { useState } from 'react';
import { Plus, Search, Filter, Edit3, Trash2, CheckCircle2, Receipt, Calendar, User, Tag, FileText, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Idol/Pratima',
  'Puja Materials',
  'Tent/Pandal & Stage',
  'Food & Prasadam',
  'Lighting & Sound',
  'Music & DJ',
  'Nimajjanam/Immersion',
  'Decoration & Flowers',
  'Transportation',
  'Miscellaneous'
];

export default function ExpenseManager({ expenses, onAddExpense, onUpdateExpense, onDeleteExpense, isAddOpen, setIsAddOpen }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dueFilter, setDueFilter] = useState('ALL'); // 'ALL' | 'DUE' | 'PAID'

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Puja Materials',
    totalAmount: '',
    advancePaid: '',
    date: new Date().toISOString().split('T')[0],
    paidTo: '',
    spentBy: '',
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Puja Materials',
      totalAmount: '',
      advancePaid: '',
      date: new Date().toISOString().split('T')[0],
      paidTo: '',
      spentBy: '',
      notes: ''
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (expense) => {
    setEditingId(expense.id);
    const total = expense.totalAmount !== undefined ? expense.totalAmount : expense.amount;
    const advance = expense.advancePaid !== undefined ? expense.advancePaid : expense.amount;
    setFormData({
      title: expense.title,
      category: expense.category || 'Miscellaneous',
      totalAmount: total,
      advancePaid: advance,
      date: expense.date,
      paidTo: expense.paidTo || '',
      spentBy: expense.spentBy || '',
      notes: expense.notes || ''
    });
    setIsAddOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || (!formData.totalAmount && !formData.advancePaid)) {
      alert('Please fill in Expense Title and Amount');
      return;
    }

    if (editingId) {
      onUpdateExpense(editingId, formData);
    } else {
      onAddExpense(formData);
    }

    setIsAddOpen(false);
  };

  const filteredExpenses = expenses.filter(e => {
    const total = Number(e.totalAmount !== undefined ? e.totalAmount : e.amount) || 0;
    const advance = Number(e.advancePaid !== undefined ? e.advancePaid : e.amount) || 0;
    const due = Math.max(0, total - advance);

    const matchesSearch = 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.paidTo && e.paidTo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (e.spentBy && e.spentBy.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;

    let matchesDue = true;
    if (dueFilter === 'DUE') matchesDue = due > 0;
    if (dueFilter === 'PAID') matchesDue = due === 0;

    return matchesSearch && matchesCategory && matchesDue;
  });

  // Calculate totals
  let totalAgreedSum = 0;
  let totalAdvanceSum = 0;
  let totalDueSum = 0;

  filteredExpenses.forEach(e => {
    const tot = Number(e.totalAmount !== undefined ? e.totalAmount : e.amount) || 0;
    const adv = Number(e.advancePaid !== undefined ? e.advancePaid : e.amount) || 0;
    totalAgreedSum += tot;
    totalAdvanceSum += adv;
    totalDueSum += Math.max(0, tot - adv);
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>💸</span> Festival Expenses & Vendor Advance Log
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Record total agreed expense amounts, advance payments, and vendor pending dues
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Record New Expense / Advance
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search expense item, vendor, spent by..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setDueFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${dueFilter === 'ALL' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setDueFilter('DUE')}
              className={`px-3 py-1.5 rounded-lg transition ${dueFilter === 'DUE' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Vendor Due
            </button>
            <button
              onClick={() => setDueFilter('PAID')}
              className={`px-3 py-1.5 rounded-lg transition ${dueFilter === 'PAID' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Fully Settled
            </button>
          </div>
        </div>

      </div>

      {/* Summary Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Agreed Total Expenses:</span>
          <span className="text-lg font-black text-slate-900">₹ {totalAgreedSum.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Advance Paid Out:</span>
          <span className="text-lg font-black text-emerald-600">₹ {totalAdvanceSum.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between bg-amber-50/20">
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Remaining Vendor Due:
          </span>
          <span className="text-lg font-black text-amber-600">₹ {totalDueSum.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-red-50/70 text-xs font-bold text-red-900 uppercase tracking-wider border-b border-red-100">
              <tr>
                <th className="py-3.5 px-4">Expense Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Agreed Total (₹)</th>
                <th className="py-3.5 px-4">Advance Paid (₹)</th>
                <th className="py-3.5 px-4">Vendor Due Status</th>
                <th className="py-3.5 px-4">Paid To</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((e) => {
                  const total = Number(e.totalAmount !== undefined ? e.totalAmount : e.amount) || 0;
                  const advance = Number(e.advancePaid !== undefined ? e.advancePaid : e.amount) || 0;
                  const due = Math.max(0, total - advance);

                  return (
                    <tr key={e.id} className="hover:bg-red-50/20 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {e.title}
                        {e.notes && <p className="text-[11px] text-slate-400 font-normal italic">{e.notes}</p>}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100/70 text-red-900 border border-red-200">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-base">
                        ₹ {total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600 text-base">
                        ₹ {advance.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        {due > 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                            ⚠️ Vendor Due: ₹ {due.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ Fully Settled
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-700">
                        {e.paidTo || '-'}
                        {e.spentBy && <p className="text-[11px] text-slate-400">By: {e.spentBy}</p>}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenEdit(e)}
                          title="Edit Expense Record"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete expense "${e.title}"?`)) {
                              onDeleteExpense(e.id);
                            }
                          }}
                          title="Delete Record"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No expense records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-red-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-red-100 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-red-600" />
              {editingId ? 'Edit Expense Record' : 'Record Expense & Vendor Advance'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Expense Item / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tent & Stage setup charges / Sound system"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Agreed Total Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 10000"
                    value={formData.totalAmount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({ 
                        ...formData, 
                        totalAmount: val,
                        advancePaid: formData.advancePaid === '' ? val : formData.advancePaid 
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Advance Paid (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 4000"
                    value={formData.advancePaid}
                    onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-extrabold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Vendor Due Box */}
              {Number(formData.totalAmount || 0) > Number(formData.advancePaid || 0) && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs flex justify-between items-center text-amber-800 font-bold">
                  <span>Remaining Due to Vendor:</span>
                  <span className="text-base text-amber-900 font-extrabold">
                    ₹ {(Number(formData.totalAmount || 0) - Number(formData.advancePaid || 0)).toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Paid To (Vendor/Shop)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Tent House"
                    value={formData.paidTo}
                    onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Spent By (Member)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Suresh (Treasurer)"
                    value={formData.spentBy}
                    onChange={(e) => setFormData({ ...formData, spentBy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Voucher / Bill Notes
                </label>
                <input
                  type="text"
                  placeholder="Receipt/Bill notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium text-sm rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Expense Record
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
