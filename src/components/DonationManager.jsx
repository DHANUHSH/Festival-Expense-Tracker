import React, { useState } from 'react';
import { Plus, Search, Filter, Printer, Edit3, Trash2, CheckCircle2, User, Phone, Banknote, Calendar, FileText, Package, AlertCircle } from 'lucide-react';

export default function DonationManager({ donations, onAddDonation, onUpdateDonation, onDeleteDonation, onViewReceipt, isAddOpen, setIsAddOpen }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL', 'MONEY', 'ITEM', 'DUE'

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [donationType, setDonationType] = useState('Money'); // 'Money' | 'Item'
  const [formData, setFormData] = useState({
    donorName: '',
    promisedAmount: '',
    paidAmount: '',
    itemName: '',
    itemQuantity: '1',
    estimatedValue: '',
    paymentMode: 'Cash',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setDonationType('Money');
    setFormData({
      donorName: '',
      promisedAmount: '',
      paidAmount: '',
      itemName: '',
      itemQuantity: '1',
      estimatedValue: '',
      paymentMode: 'Cash',
      phone: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (donation) => {
    setEditingId(donation.id);
    const type = donation.donationType || (donation.itemName ? 'Item' : 'Money');
    setDonationType(type);

    setFormData({
      donorName: donation.donorName,
      promisedAmount: donation.promisedAmount !== undefined ? donation.promisedAmount : donation.amount,
      paidAmount: donation.paidAmount !== undefined ? donation.paidAmount : donation.amount,
      itemName: donation.itemName || '',
      itemQuantity: donation.itemQuantity || '1',
      estimatedValue: donation.estimatedValue || '',
      paymentMode: donation.paymentMode || 'Cash',
      phone: donation.phone || '',
      date: donation.date,
      notes: donation.notes || ''
    });
    setIsAddOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.donorName) {
      alert('Please fill in Donor Name');
      return;
    }

    if (donationType === 'Money') {
      if (!formData.promisedAmount && !formData.paidAmount) {
        alert('Please enter Promised Amount or Paid Amount');
        return;
      }
    } else if (donationType === 'Item') {
      if (!formData.itemName) {
        alert('Please enter Item Name');
        return;
      }
    }

    const payload = {
      ...formData,
      donationType
    };

    if (editingId) {
      onUpdateDonation(editingId, payload);
    } else {
      onAddDonation(payload);
    }

    setIsAddOpen(false);
  };

  const filteredDonations = donations.filter(d => {
    const isItem = d.donationType === 'Item' || Boolean(d.itemName);
    const matchesSearch = 
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.phone && d.phone.includes(searchTerm)) ||
      (d.itemName && d.itemName.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesFilter = true;
    if (typeFilter === 'MONEY') matchesFilter = !isItem;
    if (typeFilter === 'ITEM') matchesFilter = isItem;
    if (typeFilter === 'DUE') matchesFilter = !isItem && (Number(d.dueAmount) > 0 || Number(d.promisedAmount) > Number(d.paidAmount));

    return matchesSearch && matchesFilter;
  });

  // Totals calculations
  let totalPromised = 0;
  let totalPaid = 0;
  let totalDue = 0;

  filteredDonations.forEach(d => {
    if (d.donationType !== 'Item' && !d.itemName) {
      const p = Number(d.promisedAmount !== undefined ? d.promisedAmount : d.amount) || 0;
      const pd = Number(d.paidAmount !== undefined ? d.paidAmount : d.amount) || 0;
      totalPromised += p;
      totalPaid += pd;
      totalDue += Math.max(0, p - pd);
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>🚩</span> Pilgrim & Festival Donations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Record money donations, pending due amounts, and pilgrim item contributions
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Donation / Item
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search donor name, item, receipt no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition ${typeFilter === 'ALL' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All Records
            </button>
            <button
              onClick={() => setTypeFilter('MONEY')}
              className={`px-3 py-1.5 rounded-lg transition ${typeFilter === 'MONEY' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Money
            </button>
            <button
              onClick={() => setTypeFilter('DUE')}
              className={`px-3 py-1.5 rounded-lg transition ${typeFilter === 'DUE' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Pending Due
            </button>
            <button
              onClick={() => setTypeFilter('ITEM')}
              className={`px-3 py-1.5 rounded-lg transition ${typeFilter === 'ITEM' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Item / In-Kind
            </button>
          </div>
        </div>

      </div>

      {/* Summary Pills Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Paid Money Collected:</span>
          <span className="text-lg font-black text-emerald-600">₹ {totalPaid.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex items-center justify-between bg-amber-50/20">
          <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Total Pending Due:
          </span>
          <span className="text-lg font-black text-amber-600">₹ {totalDue.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Promised Pledged:</span>
          <span className="text-lg font-black text-slate-800">₹ {totalPromised.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-red-50/70 text-xs font-bold text-red-900 uppercase tracking-wider border-b border-red-100">
              <tr>
                <th className="py-3.5 px-4">Receipt No</th>
                <th className="py-3.5 px-4">Donor / Pilgrim</th>
                <th className="py-3.5 px-4">Donation Details</th>
                <th className="py-3.5 px-4">Paid (₹)</th>
                <th className="py-3.5 px-4">Due Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.length > 0 ? (
                filteredDonations.map((d) => {
                  const isItem = d.donationType === 'Item' || Boolean(d.itemName);
                  const promised = Number(d.promisedAmount !== undefined ? d.promisedAmount : d.amount) || 0;
                  const paid = Number(d.paidAmount !== undefined ? d.paidAmount : d.amount) || 0;
                  const due = Math.max(0, promised - paid);

                  return (
                    <tr key={d.id} className="hover:bg-red-50/20 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-red-900 text-xs">
                        {d.receiptNo}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {d.donorName}
                        {d.phone && <p className="text-[11px] text-slate-400 font-normal">📞 {d.phone}</p>}
                        {d.notes && <p className="text-[11px] text-slate-500 italic font-normal">{d.notes}</p>}
                      </td>
                      <td className="py-3.5 px-4">
                        {isItem ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
                            <Package className="w-3.5 h-3.5" />
                            <span>{d.itemName} ({d.itemQuantity || '1'})</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-slate-900">Pledged: ₹ {promised.toLocaleString('en-IN')}</span>
                            <span className="ml-2 text-[11px] text-slate-400">({d.paymentMode})</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-emerald-600 text-base">
                        {isItem ? (
                          <span className="text-xs text-purple-700 font-medium">In-Kind Item</span>
                        ) : (
                          `₹ ${paid.toLocaleString('en-IN')}`
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isItem ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                            Item Received
                          </span>
                        ) : due > 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            ⚠️ Due: ₹ {due.toLocaleString('en-IN')}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ✓ Fully Paid
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {d.date}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => onViewReceipt(d)}
                          title="Print / View Receipt"
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(d)}
                          title="Edit Donation"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete donation record for ${d.donorName}?`)) {
                              onDeleteDonation(d.id);
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
                    No donation records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Donation Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-red-200">
            
            {/* Modal Header & Tabs */}
            <div className="mb-4 pb-3 border-b border-red-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Banknote className="w-5 h-5 text-red-600" />
                {editingId ? 'Edit Record' : 'Record New Donation'}
              </h3>

              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDonationType('Money')}
                  className={`flex-1 py-2 rounded-lg transition ${donationType === 'Money' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  💵 Money / Cash / UPI
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType('Item')}
                  className={`flex-1 py-2 rounded-lg transition ${donationType === 'Item' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  🎁 Item / In-Kind Contribution
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Donor / Pilgrim Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.donorName}
                    onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Money Donation Fields */}
              {donationType === 'Money' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Pledged Amount (₹) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="e.g. 5000"
                        value={formData.promisedAmount}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({ 
                            ...formData, 
                            promisedAmount: val,
                            // If paidAmount is empty, default paidAmount to promisedAmount
                            paidAmount: formData.paidAmount === '' ? val : formData.paidAmount 
                          });
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Paid Amount (₹) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder="e.g. 2000"
                        value={formData.paidAmount}
                        onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-extrabold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Calculated Due Display Box */}
                  {Number(formData.promisedAmount || 0) > Number(formData.paidAmount || 0) && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs flex justify-between items-center text-amber-800 font-bold">
                      <span>Remaining Due Balance:</span>
                      <span className="text-base text-amber-900 font-extrabold">
                        ₹ {(Number(formData.promisedAmount || 0) - Number(formData.paidAmount || 0)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={formData.paymentMode}
                        onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI / GPay / PhonePe</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Item Donation Fields */
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Item Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 25kg Rice bag / 5L Ghee / Silver Crown"
                      value={formData.itemName}
                      onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Quantity & Unit
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 25 kg / 2 Bags / 1 Set"
                        value={formData.itemQuantity}
                        onChange={(e) => setFormData({ ...formData, itemQuantity: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Estimated Value (₹ Optional)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1500"
                        value={formData.estimatedValue}
                        onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Notes / Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. For Prasadam"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
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
                  <CheckCircle2 className="w-4 h-4" /> Save Record
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
