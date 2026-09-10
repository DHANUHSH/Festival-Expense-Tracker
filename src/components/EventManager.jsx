import React, { useState } from 'react';
import { Plus, Calendar, Clock, DollarSign, Edit3, Trash2, CheckCircle2, Sparkles, MapPin, FileText } from 'lucide-react';

export default function EventManager({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    moneySpent: '',
    description: ''
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      eventName: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      moneySpent: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingId(evt.id);
    setFormData({
      eventName: evt.eventName,
      date: evt.date,
      time: evt.time || '10:00 AM',
      moneySpent: evt.moneySpent || '',
      description: evt.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.eventName) {
      alert('Please enter Event Name');
      return;
    }

    if (editingId) {
      onUpdateEvent(editingId, formData);
    } else {
      onAddEvent(formData);
    }

    setIsModalOpen(false);
  };

  const totalEventBudget = events.reduce((sum, ev) => sum + (Number(ev.moneySpent) || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-2 top-0 opacity-10 text-9xl pointer-events-none">
          🕉️
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-white text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Festival Schedule & Program Manager
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            Vinayaka Utsav Events Info
          </h2>
          <p className="text-red-100 text-xs mt-1">
            Manage event timing, day, budget spent, and program descriptions
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="relative z-10 px-5 py-2.5 bg-white text-red-700 hover:bg-red-50 font-extrabold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition active:scale-95"
        >
          <Plus className="w-4 h-4 text-red-600" /> + Add New Event
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Scheduled Events</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{events.length} Program{events.length !== 1 ? 's' : ''}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-red-600 flex items-center justify-center font-bold">
            📅
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Total Money Spent on Events</p>
            <h3 className="text-2xl font-black text-red-600 mt-1">₹ {totalEventBudget.toLocaleString('en-IN')}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            💸
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((evt) => (
            <div key={evt.id} className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md transition relative flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-200">
                    🕉️ Utsav Event
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleOpenEdit(evt)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete event "${evt.eventName}"?`)) {
                          onDeleteEvent(evt.id);
                        }
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {evt.eventName}
                </h3>

                {evt.description && (
                  <p className="text-xs text-slate-600 mb-4 bg-red-50/40 p-2.5 rounded-lg border border-red-100">
                    {evt.description}
                  </p>
                )}

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-slate-800">Day / Date: </span>
                    <span>{evt.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="font-semibold text-slate-800">Time: </span>
                    <span>{evt.time}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Money Spent:</span>
                <span className="text-lg font-black text-red-600">
                  ₹ {Number(evt.moneySpent || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-dashed border-red-200 text-center text-slate-400">
            <p className="text-lg font-bold text-slate-600">No events scheduled yet</p>
            <p className="text-xs text-slate-400 mt-1">Click "+ Add New Event" to add festival programs, timing, and budgets.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-red-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-red-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-600" />
              {editingId ? 'Edit Event Info' : 'Add Festival Event Info'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sthapana Puja / Annadanam / Nimajjanam"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Date / Day
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
                    Timing
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 08:30 AM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Money Spent / Budget (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 5000"
                  value={formData.moneySpent}
                  onChange={(e) => setFormData({ ...formData, moneySpent: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Program Info / Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Details of the event, chief guests, prasad distribution details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-red-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-medium text-sm rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Event
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
