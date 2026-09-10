import React, { useState } from 'react';
import { Plus, Search, Filter, Printer, Edit3, Trash2, CheckCircle2, Users, HeartHandshake, Phone, MapPin, Sparkles, BookOpen, X } from 'lucide-react';

const COMMON_GOTHRAMS = [
  'Kasyapa',
  'Bharadwaja',
  'Vasishta',
  'Harithasa',
  'Srivatsa',
  'Kaushika',
  'Atri',
  'Gautama',
  'Vishwamitra',
  'Jamadagni',
  'Agastya',
  'Angirasa',
  'Naidhruva',
  'Sandilya',
  'Koundinya',
  'Moudgalya',
  'Garga'
];

export default function GothramManager({ families = [], onAddFamily, onUpdateFamily, onDeleteFamily }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGothramFilter, setSelectedGothramFilter] = useState('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSankalpamPrintOpen, setIsSankalpamPrintOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    familyHead: '',
    gothram: 'Kasyapa',
    customGothram: '',
    familyMembers: '',
    phone: '',
    address: '',
    poojaRequested: 'Special Archana & Sankalpam',
    date: new Date().toISOString().split('T')[0]
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      familyHead: '',
      gothram: 'Kasyapa',
      customGothram: '',
      familyMembers: '',
      phone: '',
      address: '',
      poojaRequested: 'Special Archana & Sankalpam',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (fam) => {
    setEditingId(fam.id);
    const isCommon = COMMON_GOTHRAMS.includes(fam.gothram);
    setFormData({
      familyHead: fam.familyHead,
      gothram: isCommon ? fam.gothram : 'Other',
      customGothram: isCommon ? '' : fam.gothram,
      familyMembers: fam.familyMembers || '',
      phone: fam.phone || '',
      address: fam.address || '',
      poojaRequested: fam.poojaRequested || 'Special Archana & Sankalpam',
      date: fam.date || new Date().toISOString().split('T')[0]
    });
    setIsAddOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.familyHead) {
      alert('Please enter Family Head / Devotee Name');
      return;
    }

    const finalGothram = formData.gothram === 'Other' 
      ? (formData.customGothram.trim() || 'Kasyapa') 
      : formData.gothram;

    const payload = {
      familyHead: formData.familyHead.trim(),
      gothram: finalGothram,
      familyMembers: formData.familyMembers.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      poojaRequested: formData.poojaRequested.trim(),
      date: formData.date
    };

    if (editingId) {
      onUpdateFamily(editingId, payload);
    } else {
      onAddFamily(payload);
    }

    setIsAddOpen(false);
  };

  const filteredFamilies = families.filter(f => {
    const matchesSearch = 
      f.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.gothram.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.familyMembers && f.familyMembers.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.phone && f.phone.includes(searchTerm));
    const matchesFilter = selectedGothramFilter === 'ALL' || f.gothram === selectedGothramFilter;
    return matchesSearch && matchesFilter;
  });

  // Extract list of all unique gothrams present in data
  const registeredGothrams = Array.from(new Set(families.map(f => f.gothram))).filter(Boolean);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Vinayaka Chavithi Devotees Directory
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Family Names & Gothralu Directory
          </h2>
          <p className="text-red-100 text-xs mt-1">
            Register devotee family names, Gothram, family members list, and puja sankalpam
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setIsSankalpamPrintOpen(true)}
            className="px-4 py-2.5 bg-red-950/40 hover:bg-red-950/60 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 shadow-sm flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-rose-200" /> Pujari Sankalpam Sheet
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-white text-red-700 hover:bg-rose-50 font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-red-600" /> + Add Family & Gothram
          </button>
        </div>
      </div>

      {/* Quick Summary Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Registered Families</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{families.length} Famil{families.length !== 1 ? 'ies' : 'y'}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Unique Gothrams Registered</p>
            <h3 className="text-2xl font-black text-red-600 mt-1">{registeredGothrams.length} Gothram{registeredGothrams.length !== 1 ? 's' : ''}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-red-600 flex items-center justify-center font-bold text-xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search family head, gothram, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedGothramFilter}
            onChange={(e) => setSelectedGothramFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Gothrams ({families.length})</option>
            {registeredGothrams.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Family Directory Table */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-red-50/70 text-xs font-bold text-red-900 uppercase tracking-wider border-b border-red-100">
              <tr>
                <th className="py-3.5 px-4">Family Head / Devotee</th>
                <th className="py-3.5 px-4">Gothram</th>
                <th className="py-3.5 px-4">Family Members List</th>
                <th className="py-3.5 px-4">Pooja / Sankalpam</th>
                <th className="py-3.5 px-4">Phone / Address</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFamilies.length > 0 ? (
                filteredFamilies.map((f) => (
                  <tr key={f.id} className="hover:bg-red-50/20 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {f.familyHead}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-900 border border-red-200 shadow-2xs">
                        🕉️ {f.gothram} Gothram
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-700 max-w-xs">
                      {f.familyMembers ? (
                        <p className="line-clamp-2">{f.familyMembers}</p>
                      ) : (
                        <span className="text-slate-400 italic">Self & Family</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-rose-800">
                      {f.poojaRequested || 'Special Archana & Sankalpam'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {f.phone && <p className="font-semibold text-slate-800">📞 {f.phone}</p>}
                      {f.address && <p className="text-[11px] text-slate-400">📍 {f.address}</p>}
                      {!f.phone && !f.address && '-'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      {f.date}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(f)}
                        title="Edit Family Record"
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete family record for ${f.familyHead}?`)) {
                            onDeleteFamily(f.id);
                          }
                        }}
                        title="Delete Record"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">
                    No family gothram records found. Click "+ Add Family & Gothram" to register.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Family & Gothram Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-red-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-red-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-600" />
              {editingId ? 'Edit Devotee Family Record' : 'Register Family Name & Gothram'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Family Head / Devotee Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kothapalli Ramesh"
                  value={formData.familyHead}
                  onChange={(e) => setFormData({ ...formData, familyHead: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Gothram Name *
                </label>
                <select
                  value={formData.gothram}
                  onChange={(e) => setFormData({ ...formData, gothram: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-red-900 focus:outline-none focus:border-red-500"
                >
                  {COMMON_GOTHRAMS.map(g => (
                    <option key={g} value={g}>{g} Gothram</option>
                  ))}
                  <option value="Other">Other (Enter Custom Gothram)</option>
                </select>

                {formData.gothram === 'Other' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom Gothram name"
                    value={formData.customGothram}
                    onChange={(e) => setFormData({ ...formData, customGothram: e.target.value })}
                    className="w-full px-3 py-2 mt-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Family Members List (Spouse, Children, Relatives)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Lakshmi (Wife), Ananya (Daughter), Rahul (Son)"
                  value={formData.familyMembers}
                  onChange={(e) => setFormData({ ...formData, familyMembers: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Date of Pooja
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

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Pooja Requested / Special Sankalpam
                </label>
                <input
                  type="text"
                  placeholder="e.g. Laxmiganapathi Homam / Kumkum Pooja / Annadanam"
                  value={formData.poojaRequested}
                  onChange={(e) => setFormData({ ...formData, poojaRequested: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Area / Door No / Address (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flat 302, Main Road"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  <CheckCircle2 className="w-4 h-4" /> Save Family Record
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Printable Pujari Sankalpam Sheet Modal */}
      {isSankalpamPrintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-red-200 overflow-hidden relative">
            
            {/* Header - No print controls */}
            <div className="no-print bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
              <span className="text-sm font-bold text-red-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-600" /> Pujari Sankalpam List Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" /> Print Sankalpam Sheet
                </button>
                <button
                  onClick={() => setIsSankalpamPrintOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-rose-100/50 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Sankalpam Area */}
            <div id="sankalpam-printable" className="p-8 bg-white text-slate-900 space-y-6">
              
              {/* Header */}
              <div className="text-center pb-4 border-b-2 border-red-200">
                <div className="text-4xl mb-1">🕉️</div>
                <h1 className="text-2xl font-black text-red-950 tracking-tight">
                  Sri Vinayaka Chavithi Utsavam - Pujari Sankalpam List
                </h1>
                <p className="text-xs text-red-700 font-bold tracking-widest uppercase mt-1">
                  Devotee Family Names & Gothram Schedule for Veda Parayanam & Homam
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Printed Date: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
                </p>
              </div>

              {/* Devotees List for Pandit */}
              <div className="space-y-4">
                {families.length > 0 ? (
                  families.map((fam, idx) => (
                    <div key={fam.id} className="p-4 rounded-xl border border-red-200 bg-rose-50/20 text-xs">
                      <div className="flex items-start justify-between border-b border-red-100 pb-2 mb-2">
                        <div>
                          <span className="font-extrabold text-red-900 text-sm">{idx + 1}. {fam.familyHead}</span>
                          {fam.familyMembers && (
                            <p className="text-slate-700 font-medium text-xs mt-0.5">
                              <span className="font-bold text-slate-900">Family Members: </span>{fam.familyMembers}
                            </p>
                          )}
                        </div>
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-950 font-black text-xs border border-red-300">
                          🕉️ {fam.gothram} Gothram
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600 pt-1">
                        <span><strong className="text-slate-800">Sankalpam / Pooja:</strong> {fam.poojaRequested}</span>
                        {fam.phone && <span>📞 {fam.phone}</span>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-slate-400 text-sm">No family gothram records registered yet.</p>
                )}
              </div>

              {/* Signatures */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
                <div>
                  <p className="font-bold text-red-900">May Sri Mahaganapathi Bless All Devotee Families!</p>
                </div>
                <div className="text-center">
                  <div className="w-32 border-b border-slate-400 mb-1"></div>
                  <p className="font-bold text-slate-800">Pujari / Veda Pandit</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
