import React, { useState } from 'react';
import { Trophy, Plus, Award, Phone, CheckCircle, Clock, Printer, Trash2 } from 'lucide-react';
import { translations } from '../i18n/translations.js';

export default function LadduAuctionManager({ bids = [], onAddBid, onUpdateBid, onDeleteBid, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [formData, setFormData] = useState({
    bidderName: '',
    amount: '',
    gothram: '',
    phone: '',
    paymentStatus: 'Pending',
    notes: ''
  });

  const sortedBids = [...bids].sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
  const highestBid = sortedBids[0] || null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.bidderName || !formData.amount) return;
    onAddBid({
      ...formData,
      amount: Number(formData.amount),
      timestamp: new Date().toISOString()
    });
    setFormData({ bidderName: '', amount: '', gothram: '', phone: '', paymentStatus: 'Pending', notes: '' });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-red-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-300/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-200 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-amber-300/30">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Official Prasadam Auction 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow">
            {t.ladduTitle}
          </h2>
          <p className="text-xs sm:text-sm text-red-100 font-medium max-w-xl">
            Track live bids for the sacred Vinayaka Chavithi Main Laddu Prasadam auction.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-3 bg-amber-400 text-red-950 font-black rounded-2xl shadow-lg hover:bg-amber-300 transition flex items-center gap-2 text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>{t.addBid}</span>
          </button>
          {highestBid && (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-2xl backdrop-blur-sm transition flex items-center gap-2 text-sm border border-white/30"
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>{t.winnerCertificate}</span>
            </button>
          )}
        </div>
      </div>

      {/* Highest Bid Showcase Card */}
      {highestBid ? (
        <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-amber-400/60 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-6 -bottom-6 text-amber-100 opacity-50 pointer-events-none">
            <Trophy className="w-48 h-48" />
          </div>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-red-950 flex items-center justify-center text-3xl shadow-lg shrink-0">
              👑
            </div>
            <div>
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {t.winningBidder}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {highestBid.bidderName}
              </h3>
              <p className="text-xs font-bold text-slate-500">
                {t.gothramLabel}: <span className="text-red-700 font-extrabold">{highestBid.gothram || 'N/A'}</span>
                {highestBid.phone && ` • 📞 ${highestBid.phone}`}
              </p>
            </div>
          </div>

          <div className="text-center md:text-right bg-amber-50 px-6 py-4 rounded-2xl border border-amber-200 shrink-0">
            <div className="text-xs font-bold text-amber-800 uppercase">{t.currentHighestBid}</div>
            <div className="text-3xl sm:text-4xl font-black text-red-700">
              ₹{Number(highestBid.amount).toLocaleString('en-IN')}
            </div>
            <div className="mt-1 flex items-center justify-center md:justify-end gap-1.5 text-xs font-bold">
              {highestBid.paymentStatus === 'Paid' ? (
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Paid
                </span>
              ) : (
                <span className="text-amber-700 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Pending Payment
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-8 text-center text-amber-900">
          <Trophy className="w-12 h-12 mx-auto text-amber-500 mb-2 opacity-80" />
          <h3 className="font-bold text-lg">No bids placed yet</h3>
          <p className="text-xs text-amber-700 mt-1">Click "{t.addBid}" above to record the first Laddu auction bid!</p>
        </div>
      )}

      {/* Bidding Log Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>{t.bidHistory} ({bids.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-100">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">{t.bidderName}</th>
                <th className="p-4">{t.gothramLabel}</th>
                <th className="p-4">{t.phoneLabel}</th>
                <th className="p-4 text-right">{t.bidAmount}</th>
                <th className="p-4 text-center">{t.paymentStatus}</th>
                <th className="p-4 text-right">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedBids.map((bid, index) => (
                <tr key={bid.id || index} className="hover:bg-amber-50/40 transition font-medium">
                  <td className="p-4 font-bold text-slate-400">
                    {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
                  </td>
                  <td className="p-4 font-extrabold text-slate-900">{bid.bidderName}</td>
                  <td className="p-4 text-red-700 font-bold">{bid.gothram || '—'}</td>
                  <td className="p-4 text-slate-600">{bid.phone || '—'}</td>
                  <td className="p-4 text-right font-black text-slate-900 text-base">
                    ₹{Number(bid.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onUpdateBid(bid.id, { paymentStatus: bid.paymentStatus === 'Paid' ? 'Pending' : 'Paid' })}
                      className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                        bid.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-emerald-100'
                      }`}
                    >
                      {bid.paymentStatus === 'Paid' ? '✓ Paid' : '⏳ Pending'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onDeleteBid(bid.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bid Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              <span>{t.placeBid}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.bidderName} *</label>
                <input
                  type="text"
                  required
                  value={formData.bidderName}
                  onChange={e => setFormData({ ...formData, bidderName: e.target.value })}
                  placeholder="e.g. Sri Chintu Garu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.bidAmount} *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g. 15000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-black text-lg text-red-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.gothramLabel}</label>
                  <input
                    type="text"
                    value={formData.gothram}
                    onChange={e => setFormData({ ...formData, gothram: e.target.value })}
                    placeholder="e.g. Shiva Gothram"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-medium focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">{t.paymentStatus}</label>
                <select
                  value={formData.paymentStatus}
                  onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Pending">⏳ Pending Payment</option>
                  <option value="Paid">✓ Paid</option>
                </select>
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
                  className="px-6 py-2.5 bg-amber-500 text-red-950 font-black rounded-xl hover:bg-amber-400 shadow-md transition text-sm"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Winner Certificate Modal */}
      {showCertificate && highestBid && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-amber-50 border-4 border-amber-400 rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="no-print flex justify-between items-center pb-2 border-b border-amber-200">
              <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                Prasadam Winner Certificate
              </span>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-slate-400 hover:text-slate-700 font-black text-xl"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-red-600 text-white flex items-center justify-center text-4xl shadow-xl">
                🕉️
              </div>
              <h2 className="text-2xl font-black text-red-950 tracking-wide uppercase">
                Royal Young Boys Committee 2026
              </h2>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">
                Sri Vinayaka Chavithi Main Laddu Prasadam Winner
              </p>

              <div className="py-4 px-6 bg-white rounded-2xl border-2 border-amber-300 shadow-sm space-y-2">
                <p className="text-xs text-slate-500 font-bold uppercase">This certificate honors</p>
                <h3 className="text-3xl font-black text-red-800">{highestBid.bidderName}</h3>
                {highestBid.gothram && (
                  <p className="text-sm font-extrabold text-amber-900">
                    Gothram: <span className="text-red-700">{highestBid.gothram}</span>
                  </p>
                )}
                <div className="mt-3 pt-3 border-t border-amber-100 text-2xl font-black text-amber-700">
                  Winning Bid: ₹{Number(highestBid.amount).toLocaleString('en-IN')}
                </div>
              </div>

              <p className="text-xs text-amber-800 italic font-medium">
                May Lord Siddhi Vinayaka bless your family with health, wealth, peace, and prosperous joy!
              </p>
            </div>

            <div className="no-print pt-2 flex justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-red-700 text-white font-bold rounded-xl shadow-md hover:bg-red-800 transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
