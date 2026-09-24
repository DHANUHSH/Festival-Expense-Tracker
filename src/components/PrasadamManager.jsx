import React, { useState } from 'react';
import { Utensils, Plus, CheckSquare, Square, Calendar, Phone, Trash2 } from 'lucide-react';
import { translations } from '../i18n/translations.js';

export default function PrasadamManager({
  sponsors = [],
  checklist = [],
  onAddSponsor,
  onDeleteSponsor,
  onToggleChecklist,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    sponsorName: '',
    item: 'Anna Dhanam (Lunch)',
    date: '2026-09-14',
    phone: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sponsorName) return;
    onAddSponsor({
      ...formData,
      id: `sp_${Date.now()}`
    });
    setFormData({ sponsorName: '', item: 'Anna Dhanam (Lunch)', date: '2026-09-14', phone: '', notes: '' });
    setIsAddOpen(false);
  };

  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-orange-300/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-400/20 text-orange-200 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-orange-300/30">
            <Utensils className="w-4 h-4 text-orange-300" />
            <span>Mahaprasadam Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow">
            {t.prasadamTitle}
          </h2>
          <p className="text-xs sm:text-sm text-orange-100 font-medium max-w-xl">
            Track daily Anna Dhanam and Prasadam sponsors across all 13 days of Vinayaka Chavithi.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowVideoModal(true)}
            className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-red-950 font-black rounded-2xl shadow-lg transition flex items-center gap-2 text-sm shrink-0"
          >
            <span>🎬 డోరేమాన్ & నోబితా ఆహ్వానం (Video Invite)</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-3 bg-white text-orange-950 font-black rounded-2xl shadow-lg hover:bg-orange-100 transition flex items-center gap-2 text-sm shrink-0"
          >
            <Plus className="w-5 h-5 text-orange-600" />
            <span>{t.addSponsor}</span>
          </button>
        </div>
      </div>

      {/* Doraemon Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-red-950 rounded-3xl max-w-4xl w-full border-2 border-amber-400 overflow-hidden shadow-2xl space-y-2">
            <div className="p-4 bg-red-900 flex justify-between items-center text-amber-300 font-bold border-b border-amber-400/40">
              <span className="flex items-center gap-2 text-sm font-black">
                <span>🤖 Doraemon & Nobita Telugu Video Invitation</span>
              </span>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-white hover:text-amber-300 font-black text-xl"
              >
                ✕ Close
              </button>
            </div>
            <div className="w-full h-[550px] bg-black">
              <iframe
                src="/doraemon_invitation.html"
                title="Doraemon & Nobita Telugu Anna Santharpana Invitation"
                className="w-full h-full border-0"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sponsors Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              <Utensils className="w-5 h-5 text-orange-600" />
              <span>Prasadam Sponsors ({sponsors.length})</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">{t.sponsorName}</th>
                  <th className="p-4">{t.sponsorItem}</th>
                  <th className="p-4">{t.phoneLabel}</th>
                  <th className="p-4 text-right">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sponsors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">
                      {t.noRecords}
                    </td>
                  </tr>
                ) : (
                  sponsors.map((sp) => (
                    <tr key={sp.id} className="hover:bg-orange-50/30 transition font-medium">
                      <td className="p-4 text-red-700 font-bold text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-orange-500" />
                          {sp.date}
                        </span>
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">{sp.sponsorName}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-900 rounded-lg text-xs font-bold border border-orange-200">
                          {sp.item}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 text-xs">{sp.phone || '—'}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onDeleteSponsor(sp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grocery & Samagri Checklist Sidebar */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-6 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 pb-2 border-b border-slate-100">
            <CheckSquare className="w-5 h-5 text-orange-600" />
            <span>{t.pujaChecklist}</span>
          </h3>

          <div className="space-y-2">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                  item.completed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 line-through opacity-75'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-orange-50 hover:border-orange-200'
                }`}
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 shrink-0" />
                )}
                <span className="text-xs font-bold">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Sponsor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Utensils className="w-6 h-6 text-orange-600" />
              <span>{t.addSponsor}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.sponsorName} *</label>
                <input
                  type="text"
                  required
                  value={formData.sponsorName}
                  onChange={e => setFormData({ ...formData, sponsorName: e.target.value })}
                  placeholder="e.g. Sri Prasad Garu & Family"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.sponsorItem}</label>
                <select
                  value={formData.item}
                  onChange={e => setFormData({ ...formData, item: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                >
                  <option value="Anna Dhanam (Lunch)">🍲 Anna Dhanam (Full Lunch)</option>
                  <option value="Morning Tiffin">🥟 Morning Tiffin / Breakfast</option>
                  <option value="Evening Prasadam">🥮 Evening Prasadam / Modak distribution</option>
                  <option value="Laddu Donation">🍡 Laddu Prasadam Sponsor</option>
                  <option value="Puja Samagri">💐 Puja Flowers & Fruits</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Phone number"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition text-sm"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 text-white font-black rounded-xl hover:bg-orange-700 shadow-md transition text-sm"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
