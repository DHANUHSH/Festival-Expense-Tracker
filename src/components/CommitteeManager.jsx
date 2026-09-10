import React, { useState } from 'react';
import { Users, CheckCircle, Clock, XCircle, Search, Edit2, Sparkles, MapPin } from 'lucide-react';

export default function CommitteeManager({ members = [], onUpdateStatus, onUpdateName }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'IN_MANDAPAM' | 'OUT_FOR_WORK' | 'NOT_IN_MANDAPAM'
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editName, setEditName] = useState('');

  const inMandapamCount = members.filter(m => m.status === 'IN_MANDAPAM').length;
  const outForWorkCount = members.filter(m => m.status === 'OUT_FOR_WORK').length;
  const notInMandapamCount = members.filter(m => m.status === 'NOT_IN_MANDAPAM').length;

  const filteredMembers = members.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `#${m.memberNo}`.includes(searchTerm);
    const matchesFilter = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSaveName = (id) => {
    if (editName.trim()) {
      onUpdateName(id, editName.trim());
    }
    setEditingMemberId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Royal Young Boys Association
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Committee Members Live Duty Status
          </h2>
          <p className="text-red-100 text-xs mt-1">
            Real-time tracking of members present in Mandapam, out on Pandhiri work, or away
          </p>
        </div>

        <div className="relative z-10 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center">
          <span className="text-xs text-red-100 uppercase font-semibold block">Total Roster</span>
          <span className="text-2xl font-black text-white">{members.length} Members</span>
        </div>
      </div>

      {/* Live Status Counters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* In Mandapam */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'IN_MANDAPAM' ? 'ALL' : 'IN_MANDAPAM')}
          className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
            statusFilter === 'IN_MANDAPAM' ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-500/20' : 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900 uppercase">In the Mandapam</p>
              <h3 className="text-2xl font-black text-emerald-700">{inMandapamCount}</h3>
            </div>
          </div>
          <span className="text-xs text-emerald-800 font-semibold bg-white/80 px-2.5 py-1 rounded-full border border-emerald-200">
            Active
          </span>
        </div>

        {/* Out for Work */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'OUT_FOR_WORK' ? 'ALL' : 'OUT_FOR_WORK')}
          className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
            statusFilter === 'OUT_FOR_WORK' ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-500/20' : 'bg-amber-50/40 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase">Out on Pandhiri Work</p>
              <h3 className="text-2xl font-black text-amber-700">{outForWorkCount}</h3>
            </div>
          </div>
          <span className="text-xs text-amber-800 font-semibold bg-white/80 px-2.5 py-1 rounded-full border border-amber-200">
            On Duty
          </span>
        </div>

        {/* Not in Mandapam */}
        <div 
          onClick={() => setStatusFilter(statusFilter === 'NOT_IN_MANDAPAM' ? 'ALL' : 'NOT_IN_MANDAPAM')}
          className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
            statusFilter === 'NOT_IN_MANDAPAM' ? 'bg-rose-100 border-rose-400 ring-2 ring-rose-500/20' : 'bg-rose-50/30 border-rose-100 hover:bg-rose-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-400 text-white flex items-center justify-center font-bold">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-900 uppercase">Not in Mandapam</p>
              <h3 className="text-2xl font-black text-rose-700">{notInMandapamCount}</h3>
            </div>
          </div>
          <span className="text-xs text-rose-800 font-semibold bg-white/80 px-2.5 py-1 rounded-full border border-rose-200">
            Away
          </span>
        </div>

      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name or number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'ALL' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            All ({members.length})
          </button>
          <button
            onClick={() => setStatusFilter('IN_MANDAPAM')}
            className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'IN_MANDAPAM' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            In Mandapam ({inMandapamCount})
          </button>
          <button
            onClick={() => setStatusFilter('OUT_FOR_WORK')}
            className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'OUT_FOR_WORK' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Out for Pandhiri ({outForWorkCount})
          </button>
          <button
            onClick={() => setStatusFilter('NOT_IN_MANDAPAM')}
            className={`px-3 py-1.5 rounded-lg transition ${statusFilter === 'NOT_IN_MANDAPAM' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Away ({notInMandapamCount})
          </button>
        </div>

      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredMembers.map((member) => (
          <div 
            key={member.id} 
            className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition relative flex flex-col justify-between ${
              member.status === 'IN_MANDAPAM' ? 'border-emerald-300 ring-2 ring-emerald-500/10' :
              member.status === 'OUT_FOR_WORK' ? 'border-amber-300 ring-2 ring-amber-500/10' :
              'border-slate-200'
            }`}
          >
            <div>
              {/* Photo & Member Badge */}
              <div className="relative mb-3 aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23fee2e2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='30'%3E👤%3C/text%3E%3C/svg%3E";
                  }}
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-white font-mono text-[10px] font-bold">
                  #{member.memberNo}
                </span>

                {/* Status Badge overlay */}
                <div className="absolute bottom-2 right-2">
                  {member.status === 'IN_MANDAPAM' && (
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white block shadow-sm" title="In Mandapam"></span>
                  )}
                  {member.status === 'OUT_FOR_WORK' && (
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white block shadow-sm" title="Out for Pandhiri Work"></span>
                  )}
                  {member.status === 'NOT_IN_MANDAPAM' && (
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-400 border-2 border-white block shadow-sm" title="Not in Mandapam"></span>
                  )}
                </div>
              </div>

              {/* Member Name */}
              <div className="mb-3">
                {editingMemberId === member.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs font-bold p-1 border border-red-300 rounded focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveName(member.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group">
                    <h3 className="font-extrabold text-slate-900 text-xs truncate" title={member.name}>
                      {member.name}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingMemberId(member.id);
                        setEditName(member.name);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-slate-700 transition"
                      title="Edit Member Name"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-400 mt-0.5">Royal Young Boys</p>
              </div>
            </div>

            {/* 3 Status Toggle Buttons (Checkbox style choices) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] font-bold">
              
              {/* Option 1: In the Mandapam */}
              <label 
                className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition border ${
                  member.status === 'IN_MANDAPAM'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name={`status_${member.id}`}
                  checked={member.status === 'IN_MANDAPAM'}
                  onChange={() => onUpdateStatus(member.id, 'IN_MANDAPAM')}
                  className="accent-emerald-600"
                />
                <span className="truncate">🟢 In Mandapam</span>
              </label>

              {/* Option 2: Out for Pandhiri Work */}
              <label 
                className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition border ${
                  member.status === 'OUT_FOR_WORK'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name={`status_${member.id}`}
                  checked={member.status === 'OUT_FOR_WORK'}
                  onChange={() => onUpdateStatus(member.id, 'OUT_FOR_WORK')}
                  className="accent-amber-600"
                />
                <span className="truncate">🟡 Pandhiri Work</span>
              </label>

              {/* Option 3: Not in Mandapam */}
              <label 
                className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition border ${
                  member.status === 'NOT_IN_MANDAPAM'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-slate-50/60 border-slate-100 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name={`status_${member.id}`}
                  checked={member.status === 'NOT_IN_MANDAPAM'}
                  onChange={() => onUpdateStatus(member.id, 'NOT_IN_MANDAPAM')}
                  className="accent-rose-600"
                />
                <span className="truncate">🔴 Away</span>
              </label>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
